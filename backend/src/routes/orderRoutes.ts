import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { upload } from '../middlewares/uploadMiddleware';
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
router.post('/midtrans-notification', midtransNotificationCtrl);

// User Routes
router.post('/', requireAuth, validate(createOrderSchema), createOrderCtrl);
router.get('/user', requireAuth, getUserOrdersCtrl);
router.post('/:id/payment-proof', requireAuth, upload.single('payment_proof'), uploadPaymentProofCtrl);

// Tenant Routes
router.get('/tenant', requireAuth, requireRole(['TENANT']), getTenantOrdersCtrl);
router.patch('/:id/status', requireAuth, requireRole(['TENANT']), validate(updateOrderStatusSchema), updateOrderStatusCtrl);

export default router;
