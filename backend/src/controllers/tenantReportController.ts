import { Request, Response } from 'express';
import * as tenantReportService from '../services/tenantReportService';

export const getDashboardAnalyticsCtrl = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, propertyId, status, sortBy, sortOrder, userName } = req.query;
    const analytics = await tenantReportService.getDashboardAnalytics(req.user!.id, {
      startDate: startDate as string,
      endDate: endDate as string,
      propertyId: propertyId as string,
      status: status as string,
      userName: userName as string,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
    });
    res.status(200).json({ data: analytics });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getOccupancyCalendarCtrl = async (req: Request, res: Response) => {
  try {
    const calendar = await tenantReportService.getOccupancyCalendar(req.user!.id);
    res.status(200).json({ data: calendar });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
