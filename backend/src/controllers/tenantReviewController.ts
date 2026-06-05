import { Request, Response } from 'express';
import { getTenantReviews } from '../services/tenantReviewService';
import { sendSuccess } from '../utils/response';
import { handleControllerError } from './controllerErrors';
import { tenantReviewQuerySchema } from '../validations/queryValidation';

export const getTenantReviewsCtrl = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.id;
    const { page = 1, limit = 10 } = tenantReviewQuerySchema.parse(req.query);
    const result = await getTenantReviews(tenantId, page, limit);
    return sendSuccess(res, result, 'Daftar ulasan tenant berhasil diambil');
  } catch (error: unknown) {
    handleControllerError(res, error, 400);
  }
};
