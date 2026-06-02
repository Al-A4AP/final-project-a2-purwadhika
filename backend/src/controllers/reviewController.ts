import { Request, Response } from 'express';
import * as reviewService from '../services/reviewService';
import { sendSuccess } from '../utils/response';
import { handleControllerError } from './controllerErrors';

export const createReviewCtrl = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId as string;
    const { rating, comment } = req.body;
    const review = await reviewService.createReview(req.user!.id, orderId, rating, comment);
    return sendSuccess(res, review, 'Review berhasil dikirim', 201);
  } catch (err) {
    return handleControllerError(res, err);
  }
};

export const getPropertyReviewsCtrl = async (req: Request, res: Response) => {
  try {
    const propertyId = req.params.propertyId as string;
    const reviews = await reviewService.getPropertyReviews(propertyId);
    return sendSuccess(res, reviews, 'Data ulasan berhasil diambil');
  } catch (err) {
    return handleControllerError(res, err);
  }
};

export const replyReviewCtrl = async (req: Request, res: Response) => {
  try {
    const reviewId = req.params.reviewId as string;
    const { reply_text } = req.body;
    const reply = await reviewService.replyReview(req.user!.id, reviewId, reply_text);
    return sendSuccess(res, reply, 'Balasan berhasil dikirim', 201);
  } catch (err) {
    return handleControllerError(res, err);
  }
};

export const deleteReviewCtrl = async (req: Request, res: Response) => {
  try {
    const reviewId = req.params.reviewId as string;
    await reviewService.deleteTenantReview(req.user!.id, reviewId);
    return sendSuccess(res, null, 'Ulasan berhasil dihapus');
  } catch (err) {
    return handleControllerError(res, err);
  }
};

