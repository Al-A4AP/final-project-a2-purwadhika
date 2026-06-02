import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { googleLogin } from '../services/authGoogleService';
import { verifyEmailChange } from '../services/userEmailService';
import { sendSuccess } from '../utils/response';
import { handleControllerError } from './controllerErrors';

export const registerController = async (req: Request, res: Response) => {
  try {
    const result = await authService.registerUser(req.body);
    return sendSuccess(res, result, 'Registrasi berhasil', 201);
  } catch (err) {
    return handleControllerError(res, err);
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUser(req.body.email, req.body.password);
    res.cookie('auth_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return sendSuccess(res, result, 'Login berhasil');
  } catch (err) {
    return handleControllerError(res, err);
  }
};

export const forgotPasswordController = async (req: Request, res: Response) => {
  try {
    await authService.forgotPassword(req.body.email);
    return sendSuccess(res, null, 'Jika email terdaftar, link reset akan dikirim');
  } catch (err) {
    return handleControllerError(res, err);
  }
};

export const resetPasswordController = async (req: Request, res: Response) => {
  try {
    await authService.resetPassword(req.body.token, req.body.password);
    return sendSuccess(res, null, 'Password berhasil direset');
  } catch (err) {
    return handleControllerError(res, err);
  }
};

export const getMeController = async (req: Request, res: Response) => {
  try {
    const user = await authService.getMe(req.user!.id);
    return sendSuccess(res, user, 'Data user berhasil diambil');
  } catch (err) {
    return handleControllerError(res, err);
  }
};

export const verifyEmailController = async (req: Request, res: Response) => {
  try {
    await authService.verifyEmail(req.body.token, req.body.password);
    return sendSuccess(res, null, 'Email berhasil diverifikasi');
  } catch (err) {
    return handleControllerError(res, err);
  }
};

export const resendVerificationController = async (req: Request, res: Response) => {
  try {
    await authService.resendVerification(req.body.email);
    return sendSuccess(res, null, 'Email verifikasi berhasil dikirim ulang');
  } catch (err) {
    return handleControllerError(res, err);
  }
};

export const verifyEmailChangeController = async (req: Request, res: Response) => {
  try {
    const data = await verifyEmailChange(req.body.token);
    return sendSuccess(res, data, 'Email baru berhasil diverifikasi');
  } catch (err) {
    return handleControllerError(res, err);
  }
};

export const googleLoginController = async (req: Request, res: Response) => {
  try {
    const result = await googleLogin(req.body);
    res.cookie('auth_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return sendSuccess(res, result, 'Login Google berhasil');
  } catch (err) {
    return handleControllerError(res, err);
  }
};

export const logoutController = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.auth_token;
    if (token) await authService.logout(token);
    res.clearCookie('auth_token', { httpOnly: true, sameSite: 'strict' });
    return sendSuccess(res, null, 'Logout berhasil');
  } catch (err) {
    return handleControllerError(res, err);
  }
};
