import { Request, Response } from 'express';
import * as tenantReportService from '../services/tenantReportService';
import { sendSuccess } from '../utils/response';
import { handleControllerError } from './controllerErrors';
import { tenantReportQuerySchema } from '../validations/queryValidation';

export const getDashboardAnalyticsCtrl = async (req: Request, res: Response) => {
  try {
    const analytics = await tenantReportService.getDashboardAnalytics(req.user!.id, tenantReportQuerySchema.parse(req.query));
    return sendSuccess(res, analytics, 'Laporan analisis dashboard berhasil diambil');
  } catch (err: unknown) {
    handleControllerError(res, err, 400);
  }
};

export const getOccupancyCalendarCtrl = async (req: Request, res: Response) => {
  try {
    const calendar = await tenantReportService.getOccupancyCalendar(req.user!.id);
    return sendSuccess(res, calendar, 'Kalender okupasi berhasil diambil');
  } catch (err: unknown) {
    handleControllerError(res, err, 400);
  }
};
