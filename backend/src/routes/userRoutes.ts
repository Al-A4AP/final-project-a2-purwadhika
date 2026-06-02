import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { upload } from '../middlewares/uploadMiddleware';
import { changePasswordSchema, requestEmailChangeSchema, updateProfileSchema } from '../validations/userValidation';
import {
  changePasswordCtrl,
  requestEmailChangeCtrl,
  updateAvatarCtrl,
  updateProfileCtrl,
} from '../controllers/userController';

const router = Router();

router.patch('/me', requireAuth, validate(updateProfileSchema), updateProfileCtrl);
router.patch('/me/avatar', requireAuth, upload.single('avatar'), updateAvatarCtrl);
router.patch('/me/password', requireAuth, validate(changePasswordSchema), changePasswordCtrl);
router.post('/me/email-change-requests', requireAuth, validate(requestEmailChangeSchema), requestEmailChangeCtrl);
router.patch('/profile', requireAuth, validate(updateProfileSchema), updateProfileCtrl);
router.patch('/email-change', requireAuth, validate(requestEmailChangeSchema), requestEmailChangeCtrl);
router.patch('/avatar', requireAuth, upload.single('avatar'), updateAvatarCtrl);
router.patch('/change-password', requireAuth, validate(changePasswordSchema), changePasswordCtrl);

export default router;
