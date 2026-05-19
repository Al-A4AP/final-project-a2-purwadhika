import prisma from '../config/prisma';
import bcrypt from 'bcryptjs';
import { uploadBuffer } from '../utils/cloudinaryUpload';
import { AppError } from '../middlewares/errorHandler';

export const updateProfile = async (userId: string, data: { name?: string; phone?: string }) => {
  const user = await prisma.user.findUnique({ where: { id: userId, deleted_at: null } });
  if (!user) throw new AppError('User tidak ditemukan', 404);
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { name: data.name ?? user.name, phone: data.phone ?? user.phone },
  });
  const { password_hash, ...safe } = updated;
  return safe;
};

export const updateAvatar = async (userId: string, file: Express.Multer.File) => {
  const result = await uploadBuffer(file.buffer, 'proprrent/avatars');
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { avatar_url: result.url },
  });
  const { password_hash, ...safe } = updated;
  return safe;
};

export const changePassword = async (userId: string, data: any) => {
  const { old_password, new_password } = data;
  if (!old_password || !new_password) throw new AppError('Password lama dan baru wajib diisi', 400);

  const user = await prisma.user.findUnique({ where: { id: userId, deleted_at: null } });
  if (!user) throw new AppError('User tidak ditemukan', 404);

  const isMatch = await bcrypt.compare(old_password, user.password_hash);
  if (!isMatch) throw new AppError('Password lama salah', 400);

  const newHash = await bcrypt.hash(new_password, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { password_hash: newHash }
  });

  return { success: true };
};
