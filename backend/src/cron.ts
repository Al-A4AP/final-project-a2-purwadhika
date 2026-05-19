import cron from 'node-cron';
import prisma from './config/prisma';

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
      }
    });

    for (const order of expiredOrders) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'CANCELLED', canceled_at: new Date() }
      });
    }
  });
};
