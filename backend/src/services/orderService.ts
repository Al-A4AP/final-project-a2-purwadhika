import prisma from '../config/prisma';
import { createSnapTransaction, handleNotification } from './midtransService';
import { sendPaymentConfirmationEmail, sendPaymentRejectionEmail, sendOrderConfirmationEmail } from '../utils/emailService';
import { getValidatedStayDetails } from './pricingService';

interface CreateOrderData {
  userId: string;
  propertyId: string;
  roomId: string;
  check_in_date: string;
  check_out_date: string;
  payment_method: 'MANUAL' | 'MIDTRANS';
  adults: number;
  children: number;
  babies: number;
}

// Generate unique order number
const generateOrderNumber = () => {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

const throwError = (message: string, statusCode: number): never => {
  const error: any = new Error(message);
  error.statusCode = statusCode;
  throw error;
};

const validateUser = async (userId: string) => {
  const user = await prisma.user.findFirst({ where: { id: userId, deleted_at: null } });
  if (!user) throwError('User tidak ditemukan', 404);
  if (!user!.verified_at) throwError('Akun Anda belum terverifikasi. Silakan verifikasi email Anda terlebih dahulu.', 403);
  return user!;
};

const validateDates = (checkIn: Date, checkOut: Date) => {
  if (checkIn >= checkOut) throwError('Tanggal check-out harus lebih dari check-in', 400);
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const checkInCompare = new Date(checkIn);
  checkInCompare.setUTCHours(0, 0, 0, 0);
  if (checkInCompare < today) throwError('Tanggal check-in tidak boleh di masa lalu', 400);
};

const validateCapacity = (adults: number, children: number, babies: number, capacity: number) => {
  if (adults < 1) throwError('Pemesanan harus menyertakan minimal 1 orang dewasa', 400);
  if (adults > capacity) throwError(`Jumlah orang dewasa melebihi kapasitas kamar (${capacity} orang)`, 400);
  if (children > adults) throwError(`Jumlah anak-anak tidak boleh melebihi jumlah orang dewasa (${adults} orang)`, 400);
  if (babies > adults) throwError(`Jumlah bayi tidak boleh melebihi jumlah orang dewasa (${adults} orang)`, 400);
};

export const createOrder = async (data: CreateOrderData) => {
  const { userId, propertyId, roomId, check_in_date, check_out_date, payment_method, adults, children, babies } = data;

  await validateUser(userId);
  const checkIn = new Date(check_in_date);
  const checkOut = new Date(check_out_date);
  validateDates(checkIn, checkOut);

  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

  const order = await prisma.$transaction(async (tx) => {
    const room = await tx.room.findFirst({ where: { id: roomId, deleted_at: null } });
    if (!room) throwError('Kamar tidak ditemukan', 404);

    validateCapacity(adults, children, babies, room!.capacity);

    let priceDetails;
    try {
      priceDetails = await getValidatedStayDetails(roomId, checkIn, checkOut, tx);
    } catch (e: any) { throwError(e.message, 400); }
    const finalTotalPrice = priceDetails.totalPrice;

    return tx.order.create({
      data: {
        order_number: generateOrderNumber(),
        userId, propertyId, roomId,
        check_in_date: checkIn,
        check_out_date: checkOut,
        total_price: finalTotalPrice,
        payment_method,
        status: 'WAITING_PAYMENT',
        expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000),
      },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        property: { select: { name: true } },
        room: { select: { room_type: true } },
      },
    });
  });

  let snapToken = null;
  let snapRedirectUrl = null;

  if (payment_method === 'MIDTRANS') {
    const snap = await createSnapTransaction(
      order.id, order.total_price, nights,
      order.user.name, order.user.email, order.user.phone || '',
      order.property.name, order.room.room_type, order.roomId,
    );
    snapToken = snap.token;
    snapRedirectUrl = snap.redirectUrl;
  }

  sendOrderConfirmationEmail(
    order.user.email, order.order_number, order.property.name,
    order.room.room_type, order.check_in_date, order.check_out_date, order.total_price,
  ).catch(() => {});

  return { order, snapToken, snapRedirectUrl };
};

export const getUserOrders = async (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    include: {
      property: { select: { name: true, city: true, featured_image_url: true } },
      room: { select: { room_type: true } },
      review: true,
    },
    orderBy: { created_at: 'desc' },
  });
};

export interface GetTenantOrdersOptions {
  propertyId?: string; status?: string;
  startDate?: string; endDate?: string;
  sortBy?: string; sortOrder?: 'asc' | 'desc';
  page?: number; limit?: number;
}

export const getTenantOrders = async (tenantId: string, options: GetTenantOrdersOptions = {}) => {
  const { propertyId, status, startDate, endDate, sortBy = 'created_at', sortOrder = 'desc', page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;
  const where: any = { property: { tenantId } };
  if (propertyId) where.propertyId = propertyId;
  if (status) where.status = status;
  if (startDate || endDate) {
    where.created_at = {};
    if (startDate) where.created_at.gte = new Date(startDate);
    if (endDate) { const endOf = new Date(endDate); endOf.setHours(23, 59, 59, 999); where.created_at.lte = endOf; }
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { user: { select: { name: true, email: true } }, property: { select: { name: true } }, room: { select: { room_type: true } } },
      orderBy: { [sortBy]: sortOrder }, skip, take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

export const updateOrderStatus = async (orderId: string, tenantId: string, status: any) => {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { property: true, user: true } });
  if (!order || order.property.tenantId !== tenantId) throwError('Pesanan tidak ditemukan atau akses ditolak', 404);

  let finalStatus = status;
  let updateData: any = { status: finalStatus };

  if (order.status === 'WAITING_CONFIRMATION' && status === 'CANCELLED') {
    finalStatus = 'WAITING_PAYMENT';
    updateData = { status: 'WAITING_PAYMENT', payment_proof_url: null, expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000) };
  }

  const updatedOrder = await prisma.order.update({ where: { id: orderId }, data: updateData });

  if (finalStatus === 'PROCESSED') {
    await sendPaymentConfirmationEmail(order.user.email, order.order_number).catch(() => {});
  } else if (order.status === 'WAITING_CONFIRMATION' && status === 'CANCELLED') {
    await sendPaymentRejectionEmail(order.user.email, order.order_number).catch(() => {});
  }
  return updatedOrder;
};

export const uploadPaymentProof = async (orderId: string, userId: string, imageUrl: string) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== userId) throwError('Pesanan tidak ditemukan atau akses ditolak', 404);
  if (order.status !== 'WAITING_PAYMENT') throwError('Pesanan tidak dalam status menunggu pembayaran', 400);
  return prisma.order.update({ where: { id: orderId }, data: { payment_proof_url: imageUrl, status: 'WAITING_CONFIRMATION' } });
};

export const handleMidtransNotification = handleNotification;
