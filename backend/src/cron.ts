import cron from 'node-cron';
import { EVERY_FIVE_MINUTES, EVERY_HOUR } from './cron/cronSchedules';
import { cancelExpiredUnpaidOrders, completeProcessedOrders, sendCheckInReminders } from './cron/cronTasks';

export const initCronJobs = () => {
  cron.schedule(EVERY_FIVE_MINUTES, cancelExpiredUnpaidOrders);
  cron.schedule(EVERY_HOUR, completeProcessedOrders);
  cron.schedule(EVERY_HOUR, sendCheckInReminders);
};
