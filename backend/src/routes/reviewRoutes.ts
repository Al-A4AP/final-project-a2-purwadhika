import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/authMiddleware';
import { createReviewCtrl, deleteReviewCtrl, getPropertyReviewsCtrl, replyReviewCtrl } from '../controllers/reviewController';
import { validate } from '../middlewares/validateMiddleware';
import { createReviewSchema, replyReviewSchema } from '../validations/reviewValidation';

const router = Router();

router.get('/properties/:propertyId/reviews', getPropertyReviewsCtrl);
router.post('/orders/:orderId/reviews', requireAuth, requireRole(['USER']), validate(createReviewSchema), createReviewCtrl);
router.post('/reviews/:reviewId/replies', requireAuth, requireRole(['TENANT']), validate(replyReviewSchema), replyReviewCtrl);
router.post('/reviews/:reviewId/reply', requireAuth, requireRole(['TENANT']), replyReviewCtrl);
router.delete('/reviews/:reviewId', requireAuth, requireRole(['TENANT']), deleteReviewCtrl);

export default router;
