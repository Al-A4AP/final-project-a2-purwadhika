import type { ErrorRequestHandler } from 'express';

interface ErrorLike {
  code?: string;
  errors?: unknown;
  message?: string;
  status?: number;
  statusCode?: number;
}

const isErrorLike = (err: unknown): err is ErrorLike =>
  typeof err === 'object' && err !== null;

const getErrorLike = (err: unknown): ErrorLike =>
  isErrorLike(err) ? err : {};

const isFileSizeError = (err: ErrorLike) =>
  err.code === 'LIMIT_FILE_SIZE';

const getErrorPayload = (err: unknown) => {
  const error = getErrorLike(err);
  if (isFileSizeError(error)) return { errors: null, message: 'Ukuran file maksimal adalah 1MB', statusCode: 400 };
  return {
    errors: error.errors || null,
    message: error.message || 'Internal Server Error',
    statusCode: error.statusCode || error.status || 500,
  };
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const { errors, message, statusCode } = getErrorPayload(err);
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
  });
};

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}
