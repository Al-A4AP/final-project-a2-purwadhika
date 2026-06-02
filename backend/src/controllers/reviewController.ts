import { Request, Response } from 'express';
import * as reviewService from '../services/reviewService';
import { handleLegacyControllerError } from './controllerErrors';

export const createReviewCtrl = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId as string;
    const { rating, comment } = req.body;
    const review = await reviewService.createReview(req.user!.id, orderId, rating, comment);
    res.status(201).json({ message: 'Review berhasil dikirim', data: review });
  } catch (err) {
    return handleLegacyControllerError(res, err);
  }
};

export const getPropertyReviewsCtrl = async (req: Request, res: Response) => {
  try {
    const propertyId = req.params.propertyId as string;
    const reviews = await reviewService.getPropertyReviews(propertyId);
    res.status(200).json({ data: reviews });
  } catch (err) {
    return handleLegacyControllerError(res, err);
  }
};

export const replyReviewCtrl = async (req: Request, res: Response) => {
  try {
    const reviewId = req.params.reviewId as string;
    const { reply_text } = req.body;
    const reply = await reviewService.replyReview(req.user!.id, reviewId, reply_text);
    res.status(201).json({ message: 'Balasan berhasil dikirim', data: reply });
  } catch (err) {
    return handleLegacyControllerError(res, err);
  }
};

export const deleteReviewCtrl = async (req: Request, res: Response) => {
  try {
    const reviewId = req.params.reviewId as string;
    await reviewService.deleteTenantReview(req.user!.id, reviewId);
    res.status(200).json({ message: 'Ulasan berhasil dihapus' });
  } catch (err) {
    return handleLegacyControllerError(res, err);
  }
};
