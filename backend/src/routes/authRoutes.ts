import { Router } from 'express';
import { validate } from '../middlewares/validateMiddleware';
import { requireAuth } from '../middlewares/authMiddleware';
import {
  registerController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
  getMeController,
} from '../controllers/authController';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validations/authValidation';

const router = Router();

router.post('/register', validate(registerSchema), registerController);
router.post('/login', validate(loginSchema), loginController);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPasswordController);
router.post('/reset-password', validate(resetPasswordSchema), resetPasswordController);
router.get('/me', requireAuth, getMeController);

export default router;
