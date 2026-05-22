import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { errorHandler } from './src/middlewares/errorHandler';
import authRoutes from './src/routes/authRoutes';
import propertyRoutes from './src/routes/propertyRoutes';
import orderRoutes from './src/routes/orderRoutes';
import tenantRoutes from './src/routes/tenantRoutes';
import userRoutes from './src/routes/userRoutes';
import reviewRoutes from './src/routes/reviewRoutes';
import { initCronJobs } from './src/cron';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
];
app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Server berjalan', timestamp: new Date() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/tenant', tenantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api', reviewRoutes);

// 404
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route tidak ditemukan' });
});

// Global error handler
app.use(errorHandler);

// Start Cron Jobs
initCronJobs();

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

export default app;
