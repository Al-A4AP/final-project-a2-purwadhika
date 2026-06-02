import type { Response } from 'express';
import { sendError } from '../utils/response';

interface ErrorLike {
  message?: string;
  status?: number;
  statusCode?: number;
}

export const handleControllerError = (res: Response, err: unknown, fallbackStatus = 500) =>
  sendError(res, getErrorMessage(err), getStatusCode(err, fallbackStatus));

export const handleLegacyControllerError = (res: Response, err: unknown, statusCode = 400) =>
  res.status(statusCode).json({ message: getErrorMessage(err) });

export const handleWebhookError = (res: Response) =>
  res.status(500).json({ error: 'Server error' });

export const getErrorMessage = (err: unknown) =>
  getErrorLike(err).message || 'Terjadi kesalahan';

const getStatusCode = (err: unknown, fallbackStatus: number) =>
  getErrorLike(err).statusCode || getErrorLike(err).status || fallbackStatus;

const getErrorLike = (err: unknown): ErrorLike =>
  typeof err === 'object' && err !== null ? err as ErrorLike : {};
