import { Router } from 'express';
import { validate } from '../middlewares/validateMiddleware';
import { requireAuth } from '../middlewares/authMiddleware';
import { authLimiter, resendLimiter } from '../middlewares/rateLimitMiddleware';
import {
  registerController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
  getMeController,
  verifyEmailController,
  verifyEmailChangeController,
  resendVerificationController,
  googleLoginController,
  logoutController,
} from '../controllers/authController';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  verifyEmailChangeSchema,
  resendVerificationSchema,
  googleLoginSchema,
} from '../validations/authValidation';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), registerController);
router.post('/login', authLimiter, validate(loginSchema), loginController);
router.post('/google-login', resendLimiter, validate(googleLoginSchema), googleLoginController);
router.post('/logout', requireAuth, logoutController);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPasswordController);
router.post('/reset-password', validate(resetPasswordSchema), resetPasswordController);
router.post('/verify-email', validate(verifyEmailSchema), verifyEmailController);
router.post('/verify-email-change', validate(verifyEmailChangeSchema), verifyEmailChangeController);
router.post('/resend-verification', resendLimiter, validate(resendVerificationSchema), resendVerificationController);
router.get('/me', requireAuth, getMeController);

export default router;
