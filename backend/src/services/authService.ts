import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../config/prisma';
import { AppError } from '../middlewares/errorHandler';
import { sendPasswordResetEmail, sendVerificationEmail } from '../utils/emailService';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '7d';
const ONE_HOUR = 60 * 60 * 1000;

const generateToken = (payload: object) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES } as any);

const hashToken = (token: string) =>
  crypto.createHash('sha256').update(token).digest('hex');

export const registerUser = async (data: {
  name: string; email: string; password: string; role?: 'USER' | 'TENANT';
}) => {
  const exists = await prisma.user.findUnique({ where: { email: data.email } });
  if (exists) throw new AppError('Email sudah terdaftar', 409);

  const password_hash = await bcryptjs.hash(data.password, 10);

  // yang iniake mode auto-verified dulu anggi
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password_hash,
      role: data.role || 'USER',
      verified_at: new Date(),
    },
  });

  // Generate verification token (mock implementation for email verification)
  const verificationToken = crypto.randomBytes(32).toString('hex');
  await sendVerificationEmail(user.email, verificationToken).catch(() => console.error('Gagal mengirim email verifikasi'));

  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  return { user: sanitizeUser(user), token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email, deleted_at: null } });
  if (!user) throw new AppError('Email atau password salah', 401);

  const valid = await bcryptjs.compare(password, user.password_hash);
  if (!valid) throw new AppError('Email atau password salah', 401);

  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  return { user: sanitizeUser(user), token };
};

export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email, deleted_at: null } });
  if (!user) return; // Silent fail untuk keamanan

  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = hashToken(rawToken);

  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      token: hashedToken,
      expires_at: new Date(Date.now() + ONE_HOUR),
    },
  });

  await sendPasswordResetEmail(email, rawToken);
};

export const resetPassword = async (rawToken: string, newPassword: string) => {
  const hashedToken = hashToken(rawToken);
  const record = await prisma.passwordReset.findFirst({
    where: { token: hashedToken, used_at: null, expires_at: { gt: new Date() } },
  });
  if (!record) throw new AppError('Token tidak valid atau kadaluarsa', 400);

  const password_hash = await bcryptjs.hash(newPassword, 10);
  await Promise.all([
    prisma.user.update({ where: { id: record.userId }, data: { password_hash } }),
    prisma.passwordReset.update({ where: { id: record.id }, data: { used_at: new Date() } }),
  ]);
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId, deleted_at: null },
  });
  if (!user) throw new AppError('User tidak ditemukan', 404);
  return sanitizeUser(user);
};

const sanitizeUser = (user: any) => {
  const { password_hash, ...safe } = user;
  return safe;
};
