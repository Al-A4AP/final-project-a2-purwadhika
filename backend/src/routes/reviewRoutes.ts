import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/authMiddleware';
import { createReviewCtrl, deleteReviewCtrl, getPropertyReviewsCtrl, replyReviewCtrl } from '../controllers/reviewController';

const router = Router();

router.get('/properties/:propertyId/reviews', getPropertyReviewsCtrl);
router.post('/orders/:orderId/reviews', requireAuth, requireRole(['USER']), createReviewCtrl);
router.post('/reviews/:reviewId/reply', requireAuth, requireRole(['TENANT']), replyReviewCtrl);
router.delete('/reviews/:reviewId', requireAuth, requireRole(['TENANT']), deleteReviewCtrl);

export default router;
