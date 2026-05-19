import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { upload } from '../middlewares/uploadMiddleware';
import { updateProfileSchema } from '../validations/propertyValidation';
import { updateProfileCtrl, updateAvatarCtrl, changePasswordCtrl } from '../controllers/userController';

const router = Router();

router.patch('/profile', requireAuth, validate(updateProfileSchema), updateProfileCtrl);
router.patch('/avatar', requireAuth, upload.single('avatar'), updateAvatarCtrl);
router.patch('/change-password', requireAuth, changePasswordCtrl);

export default router;
