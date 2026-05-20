import cron from 'node-cron';
import prisma from './config/prisma';
import { sendCancellationEmail, sendBookingReminderEmail } from './utils/emailService';

// Run cron jobs
export const initCronJobs = () => {
  // 1. Unpaid order expiration check (runs every 5 minutes)
  cron.schedule('*/5 * * * *', async () => {
    const now = new Date();
    
    // Find orders waiting for payment that have expired (now > expires_at)
    const expiredOrders = await prisma.order.findMany({
      where: {
        status: 'WAITING_PAYMENT',
        expires_at: { lt: now }
      },
      include: { user: true }
    });

    for (const order of expiredOrders) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'CANCELLED', canceled_at: now }
      });
      // Send auto-cancel email
      await sendCancellationEmail(order.user.email, order.order_number, 'Batas waktu pembayaran telah berakhir').catch(() => {});
    }
  });

  // 2. Auto-complete processed orders after checkout date (runs every hour)
  cron.schedule('0 * * * *', async () => {
    const now = new Date();
    
    const completedOrders = await prisma.order.findMany({
      where: {
        status: 'PROCESSED',
        check_out_date: { lt: now }
      }
    });

    for (const order of completedOrders) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'COMPLETED', completed_at: now }
      });
    }
  });

  // 3. Reminder H-1 Check-in (runs every hour, checks if check-in is between 24 and 25 hours from now)
  cron.schedule('0 * * * *', async () => {
    const in24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const in25Hours = new Date(Date.now() + 25 * 60 * 60 * 1000);

    const upcomingOrders = await prisma.order.findMany({
      where: {
        status: 'PROCESSED',
        check_in_date: {
          gte: in24Hours,
          lt: in25Hours
        }
      },
      include: { user: true, property: true }
    });

    for (const order of upcomingOrders) {
      await sendBookingReminderEmail(order.user.email, order.order_number, order.property.name).catch(() => {});
    }
  });
};
