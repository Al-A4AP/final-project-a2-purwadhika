import prisma from '../config/prisma';
import { snap } from '../config/midtrans';
import crypto from 'crypto';
import { sendPaymentConfirmationEmail, sendPaymentRejectionEmail, sendOrderConfirmationEmail } from '../utils/emailService';
import { checkAvailability } from './availabilityService';
import { calculateStayDetails } from './pricingService';

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

export const createOrder = async (data: CreateOrderData) => {
  const { userId, propertyId, roomId, check_in_date, check_out_date, payment_method, adults, children, babies } = data;

  // 1. Validate user verification status
  const user = await prisma.user.findFirst({
    where: { id: userId, deleted_at: null }
  });
  if (!user) {
    const error: any = new Error('User tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }
  if (!user.verified_at) {
    const error: any = new Error('Akun Anda belum terverifikasi. Silakan verifikasi email Anda terlebih dahulu.');
    error.statusCode = 403;
    throw error;
  }

  // Validate dates
  const checkIn = new Date(check_in_date);
  const checkOut = new Date(check_out_date);
  if (checkIn >= checkOut) {
    const error: any = new Error('Tanggal check-out harus lebih dari check-in');
    error.statusCode = 400;
    throw error;
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  
  const checkInCompare = new Date(checkIn);
  checkInCompare.setUTCHours(0, 0, 0, 0);

  if (checkInCompare < today) {
    const error: any = new Error('Tanggal check-in tidak boleh di masa lalu');
    error.statusCode = 400;
    throw error;
  }

  // Calculate nights
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

  // Create Order in DB inside a transaction to prevent race conditions
  const order = await prisma.$transaction(async (tx) => {
    // Fetch room to check capacity
    const room = await tx.room.findFirst({
      where: { id: roomId, deleted_at: null }
    });
    if (!room) {
      const error: any = new Error('Kamar tidak ditemukan');
      error.statusCode = 404;
      throw error;
    }

    // Validate capacity
    if (adults < 1) {
      const error: any = new Error('Pemesanan harus menyertakan minimal 1 orang dewasa');
      error.statusCode = 400;
      throw error;
    }
    if (adults > room.capacity) {
      const error: any = new Error(`Jumlah orang dewasa melebihi kapasitas kamar (${room.capacity} orang)`);
      error.statusCode = 400;
      throw error;
    }
    if (children > adults) {
      const error: any = new Error(`Jumlah anak-anak tidak boleh melebihi jumlah orang dewasa (${adults} orang)`);
      error.statusCode = 400;
      throw error;
    }
    if (babies > adults) {
      const error: any = new Error(`Jumlah bayi tidak boleh melebihi jumlah orang dewasa (${adults} orang)`);
      error.statusCode = 400;
      throw error;
    }

    // 2. Validate room availability
    const avail = await checkAvailability(roomId, checkIn, checkOut, tx);
    if (!avail.available) {
      const error: any = new Error(avail.reason || 'Kamar tidak tersedia pada tanggal yang dipilih');
      error.statusCode = 400;
      throw error;
    }

    // 3. Calculate dynamic stay pricing
    const priceDetails = await calculateStayDetails(roomId, checkIn, checkOut, tx);

    // Calculate child pricing (same as babies, children are free)
    const totalChildPrice = 0;

    const finalTotalPrice = priceDetails.totalPrice + totalChildPrice;

    const order_number = generateOrderNumber();
    const expires_at = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours expiration

    return tx.order.create({
      data: {
        order_number,
        userId,
        propertyId,
        roomId,
        check_in_date: checkIn,
        check_out_date: checkOut,
        total_price: finalTotalPrice,
        payment_method,
        status: 'WAITING_PAYMENT',
        expires_at,
      },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        property: { select: { name: true } },
        room: { select: { room_type: true } }
      }
    });
  });

  // If Midtrans, create Snap Token
  let snapToken = null;
  let snapRedirectUrl = null;

  if (payment_method === 'MIDTRANS') {
    const parameter = {
      transaction_details: {
        order_id: order.id,
        gross_amount: order.total_price
      },
      customer_details: {
        first_name: order.user.name,
        email: order.user.email,
        phone: order.user.phone || ''
      },
      item_details: [{
        id: order.roomId,
        price: Math.round(order.total_price / nights),
        quantity: nights,
        name: `${order.property.name} - ${order.room.room_type} (${nights} Malam)`
      }]
    };

    const transaction = await snap.createTransaction(parameter);
    snapToken = transaction.token;
    snapRedirectUrl = transaction.redirect_url;
  }

  // Send booking confirmation email asynchronously
  sendOrderConfirmationEmail(
    order.user.email,
    order.order_number,
    order.property.name,
    order.room.room_type,
    order.check_in_date,
    order.check_out_date,
    order.total_price
  ).catch(() => {});

  return {
    order,
    snapToken,
    snapRedirectUrl
  };
};

export const getUserOrders = async (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    include: {
      property: { select: { name: true, city: true, featured_image_url: true } },
      room: { select: { room_type: true } },
      review: true
    },
    orderBy: { created_at: 'desc' }
  });
};

export interface GetTenantOrdersOptions {
  propertyId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const getTenantOrders = async (tenantId: string, options: GetTenantOrdersOptions = {}) => {
  const {
    propertyId,
    status,
    startDate,
    endDate,
    sortBy = 'created_at',
    sortOrder = 'desc',
    page = 1,
    limit = 10,
  } = options;

  const skip = (page - 1) * limit;

  const where: any = {
    property: { tenantId }
  };

  if (propertyId) {
    where.propertyId = propertyId;
  }

  if (status) {
    where.status = status;
  }

  if (startDate || endDate) {
    where.created_at = {};
    if (startDate) {
      where.created_at.gte = new Date(startDate);
    }
    if (endDate) {
      const endOf = new Date(endDate);
      endOf.setHours(23, 59, 59, 999);
      where.created_at.lte = endOf;
    }
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        property: { select: { name: true } },
        room: { select: { room_type: true } }
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    }
  };
};

export const updateOrderStatus = async (orderId: string, tenantId: string, status: any) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { property: true, user: true }
  });

  if (!order || order.property.tenantId !== tenantId) {
    const error: any = new Error('Pesanan tidak ditemukan atau akses ditolak');
    error.statusCode = 404;
    throw error;
  }

  let finalStatus = status;
  let updateData: any = { status: finalStatus };

  // If order is in WAITING_CONFIRMATION and tenant chooses CANCELLED, this is a payment rejection!
  if (order.status === 'WAITING_CONFIRMATION' && status === 'CANCELLED') {
    finalStatus = 'WAITING_PAYMENT';
    updateData = {
      status: 'WAITING_PAYMENT',
      payment_proof_url: null,
      expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000) // extend by 2 hours
    };
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: updateData
  });

  if (finalStatus === 'PROCESSED') {
    await sendPaymentConfirmationEmail(order.user.email, order.order_number).catch(() => {});
  } else if (order.status === 'WAITING_CONFIRMATION' && status === 'CANCELLED') {
    await sendPaymentRejectionEmail(order.user.email, order.order_number).catch(() => {});
  }

  return updatedOrder;
};

export const uploadPaymentProof = async (orderId: string, userId: string, imageUrl: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId }
  });

  if (!order || order.userId !== userId) {
    const error: any = new Error('Pesanan tidak ditemukan atau akses ditolak');
    error.statusCode = 404;
    throw error;
  }

  if (order.status !== 'WAITING_PAYMENT') {
    const error: any = new Error('Pesanan tidak dalam status menunggu pembayaran');
    error.statusCode = 400;
    throw error;
  }

  return prisma.order.update({
    where: { id: orderId },
    data: {
      payment_proof_url: imageUrl,
      status: 'WAITING_CONFIRMATION'
    }
  });
};

export const handleMidtransNotification = async (notificationData: any) => {
  const statusResponse = await snap.transaction.notification(notificationData);
  const orderId = statusResponse.order_id;
  const transactionStatus = statusResponse.transaction_status;
  const fraudStatus = statusResponse.fraud_status;

  const order = await prisma.order.findUnique({ 
    where: { id: orderId },
    include: { user: true }
  });
  if (!order) return;

  let newStatus = order.status;

  if (transactionStatus === 'capture') {
    if (fraudStatus === 'challenge') {
      newStatus = 'WAITING_CONFIRMATION';
    } else if (fraudStatus === 'accept') {
      newStatus = 'PROCESSED';
    }
  } else if (transactionStatus === 'settlement') {
    newStatus = 'PROCESSED';
  } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
    newStatus = 'CANCELLED';
  } else if (transactionStatus === 'pending') {
    newStatus = 'WAITING_PAYMENT';
  }

  if (newStatus !== order.status) {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: newStatus as any,
        midtrans_transaction_id: statusResponse.transaction_id,
        payment_verified_at: newStatus === 'PROCESSED' ? new Date() : null
      }
    });

    if (newStatus === 'PROCESSED') {
      await sendPaymentConfirmationEmail(order.user.email, order.order_number).catch(() => {});
    }
  }
};

