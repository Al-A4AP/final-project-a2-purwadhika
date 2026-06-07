import type { User } from '@prisma/client';
import prisma from '../config/prisma';
import bcrypt from 'bcryptjs';
import { uploadBuffer } from '../utils/cloudinaryUpload';
import { AppError } from '../middlewares/errorHandler';

export const updateProfile = async (userId: string, data: ProfileUpdateData) => {
  const user = await findUserOrThrow(userId);
  const updated = await prisma.user.update({
    where: { id: userId },
    data: buildProfileUpdateData(user, data),
  });
  return sanitizeUser(updated);
};

export const updateAvatar = async (userId: string, file: Express.Multer.File) => {
  const result = await uploadBuffer(file.buffer, 'proprrent/avatars');
  const updated = await prisma.user.update({ where: { id: userId }, data: { avatar_url: result.url } });
  return sanitizeUser(updated);
};

export const changePassword = async (userId: string, data: PasswordChangeData) => {
  assertPasswordInput(data);
  const user = await findUserOrThrow(userId);
  assertEmailPasswordAccount(user);
  await assertOldPassword(user.password_hash, data.old_password!);
  await updateUserPassword(userId, data.new_password!);
  return { success: true };
};

const findUserOrThrow = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId, deleted_at: null } });
  if (!user) throw new AppError('User tidak ditemukan', 404);
  return user;
};

const assertPasswordInput = ({ old_password, new_password }: PasswordChangeData) => {
  if (!old_password || !new_password) throw new AppError('Password lama dan baru wajib diisi', 400);
};

const assertEmailPasswordAccount = (user: User) => {
  if (user.auth_provider === 'EMAIL' && user.password_set_at) return;
  throw new AppError('Password hanya dapat diubah untuk akun email dan password', 400);
};

const assertOldPassword = async (oldHash: string, oldPassword: string) => {
  const isMatch = await bcrypt.compare(oldPassword, oldHash);
  if (!isMatch) throw new AppError('Password lama salah', 400);
};

const updateUserPassword = async (userId: string, newPassword: string) =>
  prisma.user.update({
    where: { id: userId },
    data: { password_hash: await bcrypt.hash(newPassword, 10), password_set_at: new Date() },
  });

const buildProfileUpdateData = (user: User, data: ProfileUpdateData) => ({
  domicile_address: data.domicile_address ?? user.domicile_address,
  ktp_address: data.ktp_address ?? user.ktp_address,
  legal_name: data.legal_name ?? user.legal_name,
  name: data.name ?? user.name,
  phone: data.phone ?? user.phone,
});

const sanitizeUser = (user: User): SafeUser => {
  const { password_hash, ...safe } = user;
  return safe;
};

interface ProfileUpdateData {
  domicile_address?: string;
  ktp_address?: string;
  legal_name?: string;
  name?: string;
  phone?: string;
}

interface PasswordChangeData {
  old_password?: string;
  new_password?: string;
}

type SafeUser = Omit<User, 'password_hash'>;
