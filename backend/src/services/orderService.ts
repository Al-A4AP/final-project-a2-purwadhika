import { OrderStatus, PaymentMethod, type Prisma } from "@prisma/client";
import prisma from "../config/prisma";
import { createPaymentDeadline } from "../constants/orderConstants";
import { AppError } from "../middlewares/errorHandler";
import { sendOrderConfirmationEmail } from "../utils/emailService";
import { checkAvailability } from "./availabilityService";
import { createSnapTransaction, handleNotification } from "./midtransService";
import { lockStayRange } from "./order/bookingLocks";
import {
  getTenantOrders as getTenantOrderList,
  type GetTenantOrdersOptions,
} from "./order/tenantOrderList";
import { updateTenantOrderStatus } from "./order/tenantOrderStatus";
import type { CreateOrderData, GuestCounts } from "./order/orderTypes";
import { getValidatedStayDetails } from "./pricingService";
import { applyVoucherToOrder } from "./voucherService";

export type { GetTenantOrdersOptions };
export const getTenantOrders = getTenantOrderList;
export const updateOrderStatus = updateTenantOrderStatus;

export const createOrder = async (data: CreateOrderData) => {
  const context = await buildOrderContext(data);
  const order = await executeOrderTransaction(context);
  await syncUserProfileFromBooking(context).catch(() => undefined);
  const snapData = await buildPaymentResponse(
    order,
    context.nights,
    data.payment_method,
  );
  sendOrderCreatedEmail(order);
  return { order, ...snapData };
};

export const uploadPaymentProof = async (
  orderId: string,
  userId: string,
  imageUrl: string,
) => {
  const order = await findUserOrderOrThrow(orderId, userId);
  assertCanUploadPaymentProof(order);
  await assertPaymentProofNotExpired(order);
  return markPaymentProofUploaded(orderId, imageUrl);
};

const buildOrderContext = async (data: CreateOrderData) => {
  await validateUser(data.userId);
  await validateActiveWaitingPaymentOrders(data.userId);
  const dates = parseStayDates(data.check_in_date, data.check_out_date);
  validateDates(dates.checkIn, dates.checkOut);
  const stayDetails = await getStayPriceForRoom(
    data.roomId,
    dates.checkIn,
    dates.checkOut,
  );
  return {
    ...data,
    ...dates,
    guests: pickGuestCounts(data),
    nights: stayDetails.nights,
    stayDetails,
  };
};

const MAX_ACTIVE_WAITING_PAYMENT_ORDERS = 3;

const validateActiveWaitingPaymentOrders = async (userId: string) => {
  await cancelExpiredUserWaitingPayments(userId);
  const count = await prisma.order.count({
    where: {
      userId,
      status: OrderStatus.WAITING_PAYMENT,
      OR: [{ expires_at: null }, { expires_at: { gt: new Date() } }],
    },
  });
  if (count >= MAX_ACTIVE_WAITING_PAYMENT_ORDERS) {
    throw new AppError(
      "Anda masih memiliki 3 pesanan yang menunggu pembayaran. Selesaikan atau batalkan salah satu pesanan terlebih dahulu.",
      400,
    );
  }
};

const cancelExpiredUserWaitingPayments = (userId: string) =>
  prisma.order.updateMany({
    where: {
      userId,
      status: OrderStatus.WAITING_PAYMENT,
      expires_at: { lt: new Date() },
    },
    data: { status: OrderStatus.CANCELLED, canceled_at: new Date() },
  });

const executeOrderTransaction = (context: OrderContext) =>
  prisma.$transaction(
    async (tx) => {
      const room = await loadOrderRoom(tx, context);
      validateCapacity(context.guests, room.capacity);
      await lockStayRange(tx, room, context.checkIn, context.checkOut);
      await assertStayAvailable(tx, context);
      const voucher = await applyVoucherToOrder(
        tx,
        context.propertyId,
        context.voucher_code,
        context.userId,
        {
          breakdown: context.stayDetails.breakdown,
          subtotal: context.stayDetails.totalPrice,
          totalNights: context.nights,
        },
      );
      return tx.order.create({
        data: buildOrderCreateData(context, voucher),
        include: orderCreateInclude,
      });
    },
    {
      timeout: 15000,
      maxWait: 10000,
    },
  );

const syncUserProfileFromBooking = async (context: OrderContext) => {
  if (context.booking_for_self === false) return;
  const user = await prisma.user.findUnique({ where: { id: context.userId } });
  if (!user || user.role !== "USER") return;

  const updateData: Prisma.UserUpdateInput = {};
  if (!user.ktp_number && context.guest_ktp_number)
    updateData.ktp_number = context.guest_ktp_number;
  if (!user.legal_name && context.guest_legal_name)
    updateData.legal_name = context.guest_legal_name;
  if (!user.ktp_address && context.guest_ktp_address)
    updateData.ktp_address = context.guest_ktp_address;
  if (!user.phone && context.guest_phone)
    updateData.phone = context.guest_phone;

  if (Object.keys(updateData).length > 0) {
    await prisma.user.update({ where: { id: user.id }, data: updateData });
  }
};

const buildPaymentResponse = (
  order: CreatedOrder,
  nights: number,
  method: PaymentMethod,
) =>
  method === PaymentMethod.MIDTRANS && order.total_price > 0
    ? processMidtransPayment(order, nights)
    : emptySnapData();

const processMidtransPayment = async (order: CreatedOrder, nights: number) => {
  const snap = await createSnapTransaction(
    order.id,
    order.total_price,
    nights,
    order.user.name,
    order.user.email,
    order.user.phone || "",
    order.property.name,
    order.room.room_type,
    order.roomId,
  );
  return { snapToken: snap.token, snapRedirectUrl: snap.redirectUrl };
};

const validateUser = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: { id: userId, deleted_at: null },
  });
  if (!user) throw new AppError("User tidak ditemukan", 404);
  if (!user.verified_at)
    throw new AppError(
      "Akun Anda belum terverifikasi. Silakan verifikasi email Anda terlebih dahulu.",
      403,
    );
};

const validateDates = (checkIn: Date, checkOut: Date) => {
  if (checkIn >= checkOut)
    throw new AppError("Tanggal check-out harus lebih dari check-in", 400);
  if (startOfUtcDay(checkIn) < todayUtc())
    throw new AppError("Tanggal check-in tidak boleh di masa lalu", 400);
};

const validateCapacity = (guests: GuestCounts, capacity: number) => {
  if (guests.adults < 1)
    throw new AppError(
      "Pemesanan harus menyertakan minimal 1 orang dewasa",
      400,
    );
  if (guests.adults > capacity)
    throw new AppError(
      `Jumlah orang dewasa melebihi kapasitas kamar (${capacity} orang)`,
      400,
    );
  if (guests.children > guests.adults)
    throw new AppError(
      `Jumlah anak-anak tidak boleh melebihi jumlah orang dewasa (${guests.adults} orang)`,
      400,
    );
  if (guests.babies > guests.adults)
    throw new AppError(
      `Jumlah bayi tidak boleh melebihi jumlah orang dewasa (${guests.adults} orang)`,
      400,
    );
};

const loadOrderRoom = async (
  tx: Prisma.TransactionClient,
  context: OrderContext,
) => {
  const room = await tx.room.findFirst({
    where: {
      id: context.roomId,
      propertyId: context.propertyId,
      deleted_at: null,
    },
    include: { property: { select: { id: true, rental_type: true } } },
  });
  if (!room) throw new AppError("Kamar tidak ditemukan pada properti ini", 404);
  return room;
};

const getStayPriceForRoom = async (
  roomId: string,
  checkIn: Date,
  checkOut: Date,
) => {
  try {
    return await getValidatedStayDetails(roomId, checkIn, checkOut);
  } catch (err) {
    throw new AppError(getErrorMessage(err), 400);
  }
};

const assertStayAvailable = async (
  tx: Prisma.TransactionClient,
  context: OrderContext,
) => {
  const availability = await checkAvailability(
    context.roomId,
    context.checkIn,
    context.checkOut,
    tx,
  );
  if (!availability.available)
    throw new AppError(availability.reason || "Kamar penuh", 400);
};

const buildOrderCreateData = (
  context: OrderContext,
  voucher: VoucherOrderResult,
): Prisma.OrderCreateInput => ({
  order_number: generateOrderNumber(),
  user: { connect: { id: context.userId } },
  property: { connect: { id: context.propertyId } },
  room: { connect: { id: context.roomId } },
  check_in_date: context.checkIn,
  check_out_date: context.checkOut,
  discount_amount: voucher.discountAmount,
  subtotal_price: voucher.subtotalPrice,
  total_price: voucher.totalPrice,
  ...(voucher.voucherId
    ? { voucher: { connect: { id: voucher.voucherId } } }
    : {}),
  ...buildGuestCreateData(context),
  payment_method: context.payment_method,
  ...buildPaymentState(voucher.totalPrice),
});

const buildPaymentState = (totalPrice: number) =>
  totalPrice <= 0
    ? {
        status: OrderStatus.PROCESSED,
        payment_verified_at: new Date(),
        expires_at: null,
      }
    : {
        status: OrderStatus.WAITING_PAYMENT,
        expires_at: createPaymentDeadline(),
      };

const buildGuestCreateData = (context: OrderContext) => ({
  booking_for_self: context.booking_for_self ?? true,
  guest_email: context.guest_email || null,
  guest_ktp_address: context.guest_ktp_address || null,
  guest_ktp_number: context.guest_ktp_number || null,
  guest_legal_name: context.guest_legal_name || null,
  guest_name: context.guest_name || null,
  guest_phone: context.guest_phone || null,
});

const findUserOrderOrThrow = async (orderId: string, userId: string) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== userId)
    throw new AppError("Pesanan tidak ditemukan atau akses ditolak", 404);
  return order;
};

const assertCanUploadPaymentProof = (order: UserPaymentOrder) => {
  if (order.status !== OrderStatus.WAITING_PAYMENT)
    throw new AppError("Pesanan tidak dalam status menunggu pembayaran", 400);
  if (order.payment_method !== PaymentMethod.MANUAL)
    throw new AppError("Bukti pembayaran hanya untuk pembayaran manual", 400);
};

const assertPaymentProofNotExpired = async (order: UserPaymentOrder) => {
  if (!order.expires_at || order.expires_at > new Date()) return;
  await prisma.order.update({
    where: { id: order.id },
    data: { status: OrderStatus.CANCELLED, canceled_at: new Date() },
  });
  throw new AppError("Batas waktu upload bukti pembayaran telah berakhir", 400);
};

const markPaymentProofUploaded = (orderId: string, imageUrl: string) =>
  prisma.order.update({
    where: { id: orderId },
    data: {
      expires_at: null,
      payment_proof_url: imageUrl,
      status: OrderStatus.WAITING_CONFIRMATION,
    },
  });

const sendOrderCreatedEmail = (order: CreatedOrder) =>
  sendOrderConfirmationEmail(
    order.user.email,
    order.order_number,
    order.property.name,
    order.room.room_type,
    order.check_in_date,
    order.check_out_date,
    order.total_price,
  ).catch(() => {});

const parseStayDates = (checkIn: string, checkOut: string) => ({
  checkIn: new Date(checkIn),
  checkOut: new Date(checkOut),
});

const pickGuestCounts = ({ adults, children, babies }: CreateOrderData) => ({
  adults,
  children,
  babies,
});

const startOfUtcDay = (date: Date) => {
  const value = new Date(date);
  value.setUTCHours(0, 0, 0, 0);
  return value;
};

const todayUtc = () => startOfUtcDay(new Date());
const generateOrderNumber = () =>
  `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
const emptySnapData = () => ({ snapToken: null, snapRedirectUrl: null });
const getErrorMessage = (err: unknown) =>
  err instanceof Error ? err.message : "Tanggal menginap tidak valid";

const orderCreateInclude = {
  user: { select: { name: true, email: true, phone: true } },
  property: { select: { name: true } },
  room: { select: { room_type: true } },
} satisfies Prisma.OrderInclude;

export const handleMidtransNotification = handleNotification;

type CreatedOrder = Prisma.OrderGetPayload<{
  include: typeof orderCreateInclude;
}>;
type UserPaymentOrder = NonNullable<
  Awaited<ReturnType<typeof findUserOrderOrThrow>>
>;
type OrderContext = Awaited<ReturnType<typeof buildOrderContext>>;
type VoucherOrderResult = Awaited<ReturnType<typeof applyVoucherToOrder>>;
