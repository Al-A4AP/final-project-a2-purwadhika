import { Request, Response } from 'express';
import { cancelUserOrder } from '../services/order/userCancelOrder';
import { sendError, sendSuccess } from '../utils/response';

export const cancelUserOrderCtrl = async (req: Request, res: Response) => {
  try {
    const data = await cancelUserOrder(req.params.id as string, req.user!.id as string);
    return sendSuccess(res, data, 'Pesanan berhasil dibatalkan');
  } catch (err) {
    return sendError(res, getErrorMessage(err), getErrorStatus(err));
  }
};

const getErrorMessage = (err: unknown) =>
  err instanceof Error ? err.message : 'Pesanan gagal dibatalkan';
const getErrorStatus = (err: unknown) =>
  typeof err === 'object' && err !== null && 'statusCode' in err ? Number(err.statusCode) : 500;
