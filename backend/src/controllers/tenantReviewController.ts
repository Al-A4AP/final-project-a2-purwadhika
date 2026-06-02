import { Request, Response } from 'express';
import { getTenantReviews } from '../services/tenantReviewService';
import { sendSuccess } from '../utils/response';
import { handleControllerError } from './controllerErrors';

export const getTenantReviewsCtrl = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const result = await getTenantReviews(tenantId, page, limit);
    return sendSuccess(res, result, 'Daftar ulasan tenant berhasil diambil');
  } catch (error: unknown) {
    handleControllerError(res, error, 400);
  }
};

