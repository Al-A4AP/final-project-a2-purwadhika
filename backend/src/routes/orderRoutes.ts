import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { upload, uploadPaymentProof } from '../middlewares/uploadMiddleware';
import { orderLimiter, webhookLimiter } from '../middlewares/rateLimitMiddleware';
import {
  createOrderCtrl,
  getUserOrdersCtrl,
  getTenantOrdersCtrl,
  updateOrderStatusCtrl,
  uploadPaymentProofCtrl,
  midtransNotificationCtrl
} from '../controllers/orderController';
import { createOrderSchema, updateOrderStatusSchema } from '../validations/orderValidation';

const router = Router();

// Public webhook (Midtrans)
router.post('/midtrans-notification', webhookLimiter, midtransNotificationCtrl);

// User Routes
router.post('/', requireAuth, requireRole(['USER']), orderLimiter, validate(createOrderSchema), createOrderCtrl);
router.get('/user', requireAuth, requireRole(['USER']), getUserOrdersCtrl);
router.post('/:id/payment-proof', requireAuth, requireRole(['USER']), uploadPaymentProof.single('payment_proof'), uploadPaymentProofCtrl);

// Tenant Routes
router.get('/tenant', requireAuth, requireRole(['TENANT']), getTenantOrdersCtrl);
router.patch('/:id/status', requireAuth, requireRole(['TENANT']), validate(updateOrderStatusSchema), updateOrderStatusCtrl);

export default router;
