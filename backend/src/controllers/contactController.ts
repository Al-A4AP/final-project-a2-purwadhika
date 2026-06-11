import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../utils/response';
import { sendContactMessageEmail } from '../utils/emailService';

export const createContactMessageCtrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, subject, message } = req.body;
    await sendContactMessageEmail(name, email, subject, message);
    return sendSuccess(res, null, 'Pesan berhasil dikirim', 201);
  } catch (error) {
    next(error);
  }
};
