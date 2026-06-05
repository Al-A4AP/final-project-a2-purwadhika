import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { uploadPaymentProof } from '../middlewares/uploadMiddleware';
import { orderLimiter, webhookLimiter } from '../middlewares/rateLimitMiddleware';
import { cancelUserManualOrderCtrl } from '../controllers/userOrderCancelController';
import {
  createOrderCtrl,
  getUserOrdersCtrl,
  getTenantOrdersCtrl,
  updateOrderStatusCtrl,
  uploadPaymentProofCtrl,
  retryMidtransPaymentCtrl,
  switchPaymentToManualCtrl,
  midtransNotificationCtrl
} from '../controllers/orderController';
import { createOrderSchema, paymentAttemptSchema, updateOrderStatusSchema } from '../validations/orderValidation';

const router = Router();

// Public webhook (Midtrans)
router.post('/midtrans-notification', webhookLimiter, midtransNotificationCtrl);

// User Routes
router.post('/', requireAuth, requireRole(['USER']), orderLimiter, validate(createOrderSchema), createOrderCtrl);
router.get('/user', requireAuth, requireRole(['USER']), getUserOrdersCtrl);
router.post('/:id/cancellations', requireAuth, requireRole(['USER']), cancelUserManualOrderCtrl);
router.post('/:id/payments', requireAuth, requireRole(['USER']), validate(paymentAttemptSchema), retryMidtransPaymentCtrl);
router.post('/:id/payment-attempts', requireAuth, requireRole(['USER']), retryMidtransPaymentCtrl);
router.patch('/:id/payment-method', requireAuth, requireRole(['USER']), switchPaymentToManualCtrl);
router.post('/:id/payment-proof', requireAuth, requireRole(['USER']), uploadPaymentProof.single('payment_proof'), uploadPaymentProofCtrl);

// Tenant Routes
router.get('/tenant', requireAuth, requireRole(['TENANT']), getTenantOrdersCtrl);
router.post('/:id/status-transitions', requireAuth, requireRole(['TENANT']), validate(updateOrderStatusSchema), updateOrderStatusCtrl);
router.patch('/:id/status', requireAuth, requireRole(['TENANT']), validate(updateOrderStatusSchema), updateOrderStatusCtrl);

export default router;
