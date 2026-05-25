import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(2, 'Nama kategori minimal 2 karakter').max(50, 'Maksimal 50 karakter'),
  icon: z.string().optional()
});

export const createCategoryCtrl = async (req: Request, res: Response) => {
  try {
    const data = categorySchema.parse(req.body);
    const existing = await prisma.propertyCategory.findUnique({ where: { name: data.name } });
    
    if (existing) {
      return res.status(400).json({ success: false, message: 'Kategori sudah ada' });
    }

    const category = await prisma.propertyCategory.create({ data });
    res.status(201).json({ success: true, data: category });
  } catch (error: any) {
    if (error && typeof error === 'object' && 'errors' in error && Array.isArray(error.errors)) {
      return res.status(400).json({ success: false, message: error.errors[0].message });
    }
    res.status(500).json({ success: false, message: 'Terjadi kesalahan internal' });
  }
};

export const updateCategoryCtrl = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const data = categorySchema.parse(req.body);
    
    const existingName = await prisma.propertyCategory.findFirst({
      where: { name: data.name, id: { not: id } }
    });

    if (existingName) {
      return res.status(400).json({ success: false, message: 'Nama kategori sudah digunakan' });
    }

    const category = await prisma.propertyCategory.update({
      where: { id },
      data
    });
    res.json({ success: true, data: category });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Gagal mengubah kategori' });
  }
};

export const deleteCategoryCtrl = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    
    const count = await prisma.property.count({ where: { categoryId: id } });
    if (count > 0) {
      return res.status(400).json({ success: false, message: 'Kategori ini sedang digunakan oleh properti dan tidak dapat dihapus' });
    }

    await prisma.propertyCategory.delete({ where: { id } });
    res.json({ success: true, message: 'Kategori berhasil dihapus' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: 'Gagal menghapus kategori' });
  }
};
