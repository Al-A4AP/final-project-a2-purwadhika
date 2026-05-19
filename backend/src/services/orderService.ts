import prisma from '../config/prisma';
import { snap } from '../config/midtrans';
import crypto from 'crypto';
import { sendPaymentConfirmationEmail } from '../utils/emailService';

interface CreateOrderData {
  userId: string;
  propertyId: string;
  roomId: string;
  check_in_date: string;
  check_out_date: string;
  payment_method: 'MANUAL' | 'MIDTRANS';
}

// Generate unique order number
const generateOrderNumber = () => {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

export const createOrder = async (data: CreateOrderData) => {
  const { userId, propertyId, roomId, check_in_date, check_out_date, payment_method } = data;

  // Validate dates
  const checkIn = new Date(check_in_date);
  const checkOut = new Date(check_out_date);
  if (checkIn >= checkOut) {
    const error: any = new Error('Tanggal check-out harus lebih dari check-in');
    error.statusCode = 400;
    throw error;
  }

  // Calculate nights
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

  // Get Room and Calculate Price ini di simpel kan, coba cek lagi anggi
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: { peakRates: true }
  });

  if (!room) {
    const error: any = new Error('Kamar tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  // pake perhitunag sederhana (Base price * nights) kalo anggi ada ide boleh tambahin
  // paling pake yg ini untuk nanti kalo udh beres ui ux blh langsung integrate peak rates calculation per day
  let total_price = room.base_price * nights;

  const order_number = generateOrderNumber();

  // Create Order in DB
  const order = await prisma.order.create({
    data: {
      order_number,
      userId,
      propertyId,
      roomId,
      check_in_date: checkIn,
      check_out_date: checkOut,
      total_price,
      payment_method,
      status: 'WAITING_PAYMENT'
    },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      property: { select: { name: true } },
      room: { select: { room_type: true } }
    }
  });

  // If Midtrans, create Snap Token
  let snapToken = null;
  let snapRedirectUrl = null;

  if (payment_method === 'MIDTRANS') {
    const parameter = {
      transaction_details: {
        order_id: order.id,
        gross_amount: total_price
      },
      customer_details: {
        first_name: order.user.name,
        email: order.user.email,
        phone: order.user.phone || ''
      },
      item_details: [{
        id: room.id,
        price: room.base_price,
        quantity: nights,
        name: `${order.property.name} - ${order.room.room_type} (${nights} Malam)`
      }]
    };

    const transaction = await snap.createTransaction(parameter);
    snapToken = transaction.token;
    snapRedirectUrl = transaction.redirect_url;
  }

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

export const getTenantOrders = async (tenantId: string) => {
  return prisma.order.findMany({
    where: { property: { tenantId } },
    include: {
      user: { select: { name: true, email: true } },
      property: { select: { name: true } },
      room: { select: { room_type: true } }
    },
    orderBy: { created_at: 'desc' }
  });
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

    await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });

    if (status === 'PROCESSED') {
      await sendPaymentConfirmationEmail(order.user.email, order.order_number).catch(() => {});
    }

    return order;
  }

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

