import { Request, Response } from 'express';
import * as tenantReportService from '../services/tenantReportService';
import { sendSuccess } from '../utils/response';
import { handleControllerError } from './controllerErrors';

export const getDashboardAnalyticsCtrl = async (req: Request, res: Response) => {
  try {
    const analytics = await tenantReportService.getDashboardAnalytics(req.user!.id, buildAnalyticsOptions(req.query));
    return sendSuccess(res, analytics, 'Laporan analisis dashboard berhasil diambil');
  } catch (err: unknown) {
    handleControllerError(res, err, 400);
  }
};

const buildAnalyticsOptions = (query: Request['query']) => {
  const { startDate, endDate, propertyId, revenuePeriod, status, sortBy, sortOrder, userName, page, limit } = query;
  return {
    startDate: startDate as string,
    endDate: endDate as string,
    propertyId: propertyId as string,
    revenuePeriod: revenuePeriod as string,
    status: status as string,
    userName: userName as string,
    sortBy: sortBy as string,
    sortOrder: sortOrder as 'asc' | 'desc',
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  };
};

export const getOccupancyCalendarCtrl = async (req: Request, res: Response) => {
  try {
    const calendar = await tenantReportService.getOccupancyCalendar(req.user!.id);
    return sendSuccess(res, calendar, 'Kalender okupasi berhasil diambil');
  } catch (err: unknown) {
    handleControllerError(res, err, 400);
  }
};

