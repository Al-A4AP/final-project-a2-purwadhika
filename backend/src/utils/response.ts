import { Response } from 'express';

export const sendSuccess = (
  res: Response,
  data: any,
  message = 'Berhasil',
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  message = 'Terjadi kesalahan',
  statusCode = 500,
  errors?: any
) => {
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: errors || null,
  });
};
