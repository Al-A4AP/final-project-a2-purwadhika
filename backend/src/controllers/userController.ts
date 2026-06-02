import { Request, Response } from 'express';
import * as svc from '../services/userService';
import { requestEmailChange } from '../services/userEmailService';
import { sendSuccess, sendError } from '../utils/response';
import { handleControllerError } from './controllerErrors';

export const updateProfileCtrl = async (req: Request, res: Response) => {
  try {
    const data = await svc.updateProfile(req.user!.id, req.body);
    return sendSuccess(res, data, 'Profil berhasil diperbarui');
  } catch (err) { return handleControllerError(res, err); }
};

export const updateAvatarCtrl = async (req: Request, res: Response) => {
  try {
    if (!req.file) return sendError(res, 'File avatar wajib diupload', 400);
    const data = await svc.updateAvatar(req.user!.id, req.file);
    return sendSuccess(res, data, 'Avatar berhasil diperbarui');
  } catch (err) { return handleControllerError(res, err); }
};

export const changePasswordCtrl = async (req: Request, res: Response) => {
  try {
    const data = await svc.changePassword(req.user!.id, req.body);
    return sendSuccess(res, data, 'Password berhasil diubah');
  } catch (err) { return handleControllerError(res, err); }
};

export const requestEmailChangeCtrl = async (req: Request, res: Response) => {
  try {
    const data = await requestEmailChange(req.user!.id, req.body.email);
    return sendSuccess(res, data, 'Email verifikasi sudah dikirim ke email baru');
  } catch (err) { return handleControllerError(res, err); }
};
