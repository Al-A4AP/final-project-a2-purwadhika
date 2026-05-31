import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './src/middlewares/errorHandler';
import { globalLimiter } from './src/middlewares/rateLimitMiddleware';
import authRoutes from './src/routes/authRoutes';
import propertyRoutes from './src/routes/propertyRoutes';
import orderRoutes from './src/routes/orderRoutes';
import tenantRoutes from './src/routes/tenantRoutes';
import userRoutes from './src/routes/userRoutes';
import reviewRoutes from './src/routes/reviewRoutes';
import { initCronJobs } from './src/cron';

const app = express();
const PORT = process.env.PORT || 5000;

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'];
app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Server berjalan', timestamp: new Date() });
});

app.use('/api', globalLimiter);

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

// Cron Jobs — hanya aktif di environment yang support persistent process
if (process.env.ENABLE_CRON === 'true') {
  initCronJobs();
}

// Server listen — hanya di local/development, tidak di Vercel Serverless
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT);
}

export default app;
