import { Request, Response } from 'express';
import * as tenantReportService from '../services/tenantReportService';

export const getDashboardAnalyticsCtrl = async (req: Request, res: Response) => {
  try {
    const analytics = await tenantReportService.getDashboardAnalytics(req.user!.id);
    res.status(200).json({ data: analytics });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
