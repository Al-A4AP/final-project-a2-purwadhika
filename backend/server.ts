import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env, getAllowedOrigins } from './src/config/env';
import { errorHandler } from './src/middlewares/errorHandler';
import { globalLimiter } from './src/middlewares/rateLimitMiddleware';
import { securityHeaders } from './src/middlewares/securityHeaders';
import authRoutes from './src/routes/authRoutes';
import propertyRoutes from './src/routes/propertyRoutes';
import locationRoutes from './src/routes/locationRoutes';
import roomRoutes from './src/routes/roomRoutes';
import orderRoutes from './src/routes/orderRoutes';
import tenantRoutes from './src/routes/tenantRoutes';
import userRoutes from './src/routes/userRoutes';
import reviewRoutes from './src/routes/reviewRoutes';
import webhookRoutes from './src/routes/webhookRoutes';

const app = express();
const PORT = env.PORT;

app.use(securityHeaders);
app.use(cors({ origin: getAllowedOrigins(), credentials: true }));
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
app.use('/api/locations', locationRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/tenants/me', tenantRoutes);      // RESTful — Tahap 4
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api', reviewRoutes);

// 404
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route tidak ditemukan' });
});

// Global error handler
app.use(errorHandler);

// Server listen — hanya di local/development, tidak di Vercel Serverless
if (env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT);
}

export default app;
