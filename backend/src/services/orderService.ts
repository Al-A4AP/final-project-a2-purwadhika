import prisma from '../config/prisma';
import { OrderStatus } from '@prisma/client';
import { createSnapTransaction, handleNotification } from './midtransService';
import { sendPaymentConfirmationEmail, sendPaymentRejectionEmail, sendOrderConfirmationEmail } from '../utils/emailService';
import { getValidatedStayDetails } from './pricingService';
import { createPaymentDeadline } from '../constants/orderConstants';

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
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / 86400000);
  const order: any = await executeOrderTransaction(userId, propertyId, roomId, checkIn, checkOut, payment_method, { adults, children, babies });
  const snapData = payment_method === 'MIDTRANS' ? await processMidtransPayment(order, nights) : { snapToken: null, snapRedirectUrl: null };
  sendOrderConfirmationEmail(order.user.email, order.order_number, order.property.name, order.room.room_type, order.check_in_date, order.check_out_date, order.total_price).catch(() => {});
  return { order, ...snapData };
};

const executeOrderTransaction = async (userId: string, propertyId: string, roomId: string, checkIn: Date, checkOut: Date, payment_method: 'MANUAL' | 'MIDTRANS', capacityData: any) => {
  return prisma.$transaction(async (tx) => {
    const room = await tx.room.findFirst({ where: { id: roomId, propertyId, deleted_at: null } });
    if (!room) throwError('Kamar tidak ditemukan pada properti ini', 404);
    validateCapacity(capacityData.adults, capacityData.children, capacityData.babies, room.capacity);
    let pd;
    try { pd = await getValidatedStayDetails(roomId, checkIn, checkOut, tx); } catch (e: any) { throwError(e.message, 400); }
    return tx.order.create({
      data: { order_number: generateOrderNumber(), userId, propertyId, roomId, check_in_date: checkIn, check_out_date: checkOut, total_price: pd.totalPrice, payment_method, status: 'WAITING_PAYMENT', expires_at: createPaymentDeadline() },
      include: { user: { select: { name: true, email: true, phone: true } }, property: { select: { name: true } }, room: { select: { room_type: true } } },
    });
  });
};

const processMidtransPayment = async (order: any, nights: number) => {
  const snap = await createSnapTransaction(
    order.id, order.total_price, nights,
    order.user.name, order.user.email, order.user.phone || '',
    order.property.name, order.room.room_type, order.roomId,
  );
  return { snapToken: snap.token, snapRedirectUrl: snap.redirectUrl };
};

export interface GetTenantOrdersOptions {
  propertyId?: string; status?: string;
  startDate?: string; endDate?: string;
  sortBy?: string; sortOrder?: 'asc' | 'desc';
  page?: number; limit?: number;
}

export const getTenantOrders = async (tenantId: string, options: GetTenantOrdersOptions = {}) => {
  const { sortBy = 'created_at', sortOrder = 'desc', page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;
  const where = buildTenantOrdersWhere(tenantId, options);

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

const buildTenantOrdersWhere = (tenantId: string, options: GetTenantOrdersOptions) => {
  const { propertyId, status, startDate, endDate } = options;
  const where: any = { property: { tenantId } };
  if (propertyId) where.propertyId = propertyId;
  if (status) where.status = status;
  if (startDate || endDate) {
    where.created_at = {};
    if (startDate) where.created_at.gte = new Date(startDate);
    if (endDate) { const endOf = new Date(endDate); endOf.setHours(23, 59, 59, 999); where.created_at.lte = endOf; }
  }
  return where;
};

export const updateOrderStatus = async (orderId: string, tenantId: string, status: string) => {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { property: true, user: true } });
  if (!order || order.property.tenantId !== tenantId) throwError('Akses ditolak', 404);
  const { finalStatus, updateData } = buildTenantStatusUpdate(order.status, status);
  const updatedOrder = await prisma.order.update({ where: { id: orderId }, data: updateData });
  await handleOrderStatusEmail(order, finalStatus, status);
  return updatedOrder;
};

const buildTenantStatusUpdate = (currentStatus: string, requestedStatus: string) => {
  if (currentStatus === 'WAITING_CONFIRMATION' && requestedStatus === 'PROCESSED') {
    return { finalStatus: 'PROCESSED', updateData: { status: OrderStatus.PROCESSED, payment_verified_at: new Date() } };
  }
  if (currentStatus === 'WAITING_CONFIRMATION' && requestedStatus === 'CANCELLED') {
    return { finalStatus: 'WAITING_PAYMENT', updateData: { status: OrderStatus.WAITING_PAYMENT, payment_proof_url: null, expires_at: createPaymentDeadline() } };
  }
  if (currentStatus === 'WAITING_PAYMENT' && requestedStatus === 'CANCELLED') {
    return { finalStatus: 'CANCELLED', updateData: { status: OrderStatus.CANCELLED, canceled_at: new Date() } };
  }
  throwError(`Transisi status dari ${currentStatus} ke ${requestedStatus} tidak diperbolehkan`, 400);
};

const handleOrderStatusEmail = async (order: any, finalStatus: string, originalStatus: string) => {
  if (finalStatus === 'PROCESSED') {
    await sendPaymentConfirmationEmail(order.user.email, order.order_number).catch(() => {});
  } else if (order.status === 'WAITING_CONFIRMATION' && originalStatus === 'CANCELLED') {
    await sendPaymentRejectionEmail(order.user.email, order.order_number).catch(() => {});
  }
};

export const uploadPaymentProof = async (orderId: string, userId: string, imageUrl: string) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== userId) throwError('Pesanan tidak ditemukan atau akses ditolak', 404);
  if (order.status !== 'WAITING_PAYMENT') throwError('Pesanan tidak dalam status menunggu pembayaran', 400);
  if (order.payment_method !== 'MANUAL') throwError('Bukti pembayaran hanya untuk pembayaran manual', 400);
  if (order.expires_at && order.expires_at <= new Date()) {
    await prisma.order.update({ where: { id: orderId }, data: { status: OrderStatus.CANCELLED, canceled_at: new Date() } });
    throwError('Batas waktu upload bukti pembayaran telah berakhir', 400);
  }
  return prisma.order.update({ where: { id: orderId }, data: { payment_proof_url: imageUrl, status: 'WAITING_CONFIRMATION' } });
};

export const handleMidtransNotification = handleNotification;
