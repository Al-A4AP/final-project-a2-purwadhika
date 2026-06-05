import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { upload } from '../middlewares/uploadMiddleware';
import { getUserOrdersCtrl } from '../controllers/orderController';
import { changePasswordSchema, requestEmailChangeSchema, updateProfileSchema } from '../validations/userValidation';
import {
  changePasswordCtrl,
  requestEmailChangeCtrl,
  updateAvatarCtrl,
  updateProfileCtrl,
} from '../controllers/userController';

const router = Router();

router.get('/me/orders', requireAuth, requireRole(['USER']), getUserOrdersCtrl);
router.patch('/me', requireAuth, validate(updateProfileSchema), updateProfileCtrl);
router.patch('/me/avatar', requireAuth, upload.single('avatar'), updateAvatarCtrl);
router.patch('/me/password', requireAuth, validate(changePasswordSchema), changePasswordCtrl);
router.post('/me/email-change-requests', requireAuth, validate(requestEmailChangeSchema), requestEmailChangeCtrl);

export default router;
