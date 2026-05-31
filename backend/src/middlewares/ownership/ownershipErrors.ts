import { Response } from 'express';
import { sendError } from '../../utils/response';

export const sendServerOwnershipError = (res: Response, error: unknown) =>
  sendError(res, getErrorMessage(error), 500);

export const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Terjadi kesalahan pada server';
