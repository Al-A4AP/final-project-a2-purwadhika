import { PaymentMethod, type Prisma } from "@prisma/client";
import prisma from "../config/prisma";
import { AppError } from "../middlewares/errorHandler";
import { sendOrderConfirmationEmail } from "../utils/emailService";
import { checkAvailability } from "./availabilityService";
import { createSnapTransaction, handleNotification } from "./midtransService";
import { lockStayRange } from "./order/bookingLocks";
import { buildOrderContext, type OrderContext } from "./order/orderContext";
import { buildGuestCreateData, validateCapacity } from "./order/orderGuestUtils";
import { generateOrderNumber } from "./order/orderNumber";
import { buildPaymentState, emptySnapData } from "./order/orderPaymentState";
import {
  getTenantOrders as getTenantOrderList,
  type GetTenantOrdersOptions,
} from "./order/tenantOrderList";
import { updateTenantOrderStatus } from "./order/tenantOrderStatus";
import type { CreateOrderData } from "./order/orderTypes";
import { applyVoucherToOrder } from "./voucherService";

export type { GetTenantOrdersOptions };
export const getTenantOrders = getTenantOrderList;
export const updateOrderStatus = updateTenantOrderStatus;
export { uploadPaymentProof } from "./order/userPaymentProof";

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

const orderCreateInclude = {
  user: { select: { name: true, email: true, phone: true } },
  property: { select: { name: true } },
  room: { select: { room_type: true } },
} satisfies Prisma.OrderInclude;

export const handleMidtransNotification = handleNotification;

type CreatedOrder = Prisma.OrderGetPayload<{
  include: typeof orderCreateInclude;
}>;
type VoucherOrderResult = Awaited<ReturnType<typeof applyVoucherToOrder>>;
