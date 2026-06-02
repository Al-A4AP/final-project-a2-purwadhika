import { Request, Response } from 'express';
import * as svc from '../services/categoryService';
import { sendError, sendSuccess } from '../utils/response';
import { categoryQuerySchema, categorySchema } from '../validations/categoryValidation';

interface ApiError {
  message?: string;
  statusCode?: number;
  issues?: Array<{ message?: string }>;
}

const errorMessage = (err: ApiError) => err?.issues?.[0]?.message || err.message || 'Terjadi kesalahan internal';
const statusCode = (err: ApiError) => err?.statusCode || (err?.issues ? 400 : 500);
const handleError = (res: Response, err: unknown) => sendError(res, errorMessage(err as ApiError), statusCode(err as ApiError));

export const getCategoriesCtrl = async (req: Request, res: Response) => {
  try {
    const data = await svc.listCategories(categoryQuerySchema.parse(req.query));
    return sendSuccess(res, data, 'Kategori berhasil diambil');
  } catch (err: unknown) { return handleError(res, err); }
};

export const createCategoryCtrl = async (req: Request, res: Response) => {
  try {
    const data = await svc.createCategory(categorySchema.parse(req.body));
    return sendSuccess(res, data, 'Kategori berhasil dibuat', 201);
  } catch (err: any) { return handleError(res, err); }
};

export const updateCategoryCtrl = async (req: Request, res: Response) => {
  try {
    const data = await svc.updateCategory(String(req.params.id), categorySchema.parse(req.body));
    return sendSuccess(res, data, 'Kategori berhasil diperbarui');
  } catch (err: any) { return handleError(res, err); }
};

export const deleteCategoryCtrl = async (req: Request, res: Response) => {
  try {
    await svc.deleteCategory(String(req.params.id));
    return sendSuccess(res, null, 'Kategori berhasil dihapus');
  } catch (err: any) { return handleError(res, err); }
};
