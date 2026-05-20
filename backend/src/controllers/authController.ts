import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { sendSuccess, sendError } from '../utils/response';

export const registerController = async (req: Request, res: Response) => {
  try {
    const result = await authService.registerUser(req.body);
    return sendSuccess(res, result, 'Registrasi berhasil', 201);
  } catch (err: any) {
    return sendError(res, err.message, err.statusCode || 500);
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUser(req.body.email, req.body.password);
    return sendSuccess(res, result, 'Login berhasil');
  } catch (err: any) {
    return sendError(res, err.message, err.statusCode || 500);
  }
};

export const forgotPasswordController = async (req: Request, res: Response) => {
  try {
    await authService.forgotPassword(req.body.email);
    return sendSuccess(res, null, 'Jika email terdaftar, link reset akan dikirim');
  } catch (err: any) {
    return sendError(res, err.message, err.statusCode || 500);
  }
};

export const resetPasswordController = async (req: Request, res: Response) => {
  try {
    await authService.resetPassword(req.body.token, req.body.password);
    return sendSuccess(res, null, 'Password berhasil direset');
  } catch (err: any) {
    return sendError(res, err.message, err.statusCode || 500);
  }
};

export const getMeController = async (req: Request, res: Response) => {
  try {
    const user = await authService.getMe(req.user!.id);
    return sendSuccess(res, user, 'Data user berhasil diambil');
  } catch (err: any) {
    return sendError(res, err.message, err.statusCode || 500);
  }
};

export const verifyEmailController = async (req: Request, res: Response) => {
  try {
    await authService.verifyEmail(req.body.token, req.body.password);
    return sendSuccess(res, null, 'Email berhasil diverifikasi');
  } catch (err: any) {
    return sendError(res, err.message, err.statusCode || 500);
  }
};

export const resendVerificationController = async (req: Request, res: Response) => {
  try {
    await authService.resendVerification(req.body.email);
    return sendSuccess(res, null, 'Email verifikasi berhasil dikirim ulang');
  } catch (err: any) {
    return sendError(res, err.message, err.statusCode || 500);
  }
};

export const googleLoginController = async (req: Request, res: Response) => {
  try {
    const result = await authService.googleLogin(req.body);
    return sendSuccess(res, result, 'Login Google berhasil');
  } catch (err: any) {
    return sendError(res, err.message, err.statusCode || 500);
  }
};
