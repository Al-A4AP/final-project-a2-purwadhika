import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/authMiddleware';
import { createReviewCtrl, getPropertyReviewsCtrl, replyReviewCtrl } from '../controllers/reviewController';

const router = Router();

router.get('/properties/:propertyId/reviews', getPropertyReviewsCtrl);
router.post('/orders/:orderId/reviews', requireAuth, createReviewCtrl);
router.post('/reviews/:reviewId/reply', requireAuth, requireRole(['TENANT']), replyReviewCtrl);

export default router;
