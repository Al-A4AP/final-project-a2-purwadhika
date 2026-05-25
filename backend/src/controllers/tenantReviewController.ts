import { Request, Response } from 'express';
import { getTenantReviews } from '../services/tenantReviewService';

export const getTenantReviewsCtrl = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const result = await getTenantReviews(tenantId, page, limit);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
