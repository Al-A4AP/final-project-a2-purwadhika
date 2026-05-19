import cron from 'node-cron';
import prisma from './config/prisma';
import { sendCancellationEmail, sendBookingReminderEmail } from './utils/emailService';

// Run every hour
export const initCronJobs = () => {
  cron.schedule('0 * * * *', async () => {
    // console.log('[CRON] Running order expiration check...');
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    // Find orders waiting for payment older than 24 hours
    const expiredOrders = await prisma.order.findMany({
      where: {
        status: 'WAITING_PAYMENT',
        created_at: { lt: yesterday }
      },
      include: { user: true }
    });

    for (const order of expiredOrders) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'CANCELLED', canceled_at: new Date() }
      });
      // Send auto-cancel email
      await sendCancellationEmail(order.user.email, order.order_number, 'Batas waktu pembayaran 24 jam telah berakhir').catch(() => {});
    }

    // [CRON] Reminder H-1 Check-in (runs every hour, checks if check-in is between 24 and 25 hours from now)
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
