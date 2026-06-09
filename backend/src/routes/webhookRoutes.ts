import { Router } from 'express';
import { env } from '../config/env';
import {
  cancelExpiredUnpaidOrders,
  completeProcessedOrders,
  sendCheckInReminders,
} from '../cron/cronTasks';

const router = Router();

router.post('/cron', async (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!env.CRON_SECRET) {
    return res.status(500).json({ success: false, message: 'CRON_SECRET is not configured' });
  }

  if (!authHeader || authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return res.status(401).json({ success: false, message: 'Unauthorized webhook call' });
  }

  try {
    // Jalankan semua tugas cron secara paralel (atau berurutan jika saling bergantung, tapi di sini aman paralel)
    await Promise.all([
      cancelExpiredUnpaidOrders(),
      completeProcessedOrders(),
      sendCheckInReminders(),
    ]);

    res.json({ success: true, message: 'Semua tugas cron berhasil dijalankan' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menjalankan tugas cron' });
  }
});

export default router;
