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
  name: string; email: string; role?: 'USER' | 'TENANT';
}) => {
  const exists = await prisma.user.findUnique({ where: { email: data.email } });
  if (exists) throw new AppError('Email sudah terdaftar', 409);

  // Buat random dummy password hash karena password_hash not null di db
  const dummyPassword = crypto.randomBytes(16).toString('hex');
  const password_hash = await bcryptjs.hash(dummyPassword, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password_hash,
      role: data.role || 'USER',
      verified_at: null, // Verifikasi lewat email
    },
  });

  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = hashToken(rawToken);

  await prisma.emailVerification.create({
    data: {
      userId: user.id,
      token: hashedToken,
      expires_at: new Date(Date.now() + ONE_HOUR),
    },
  });

  await sendVerificationEmail(user.email, rawToken).catch(() => console.error('Gagal mengirim email verifikasi'));

  return { email: user.email };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email, deleted_at: null } });
  if (!user) throw new AppError('Email atau password salah', 401);

  const valid = await bcryptjs.compare(password, user.password_hash);
  if (!valid) throw new AppError('Email atau password salah', 401);

  if (!user.verified_at) {
    throw new AppError('Silakan verifikasi email Anda terlebih dahulu', 403);
  }

  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  return { user: sanitizeUser(user), token };
};

export const verifyEmail = async (rawToken: string, newPassword?: string) => {
  const hashedToken = hashToken(rawToken);
  const record = await prisma.emailVerification.findFirst({
    where: { token: hashedToken, used_at: null, expires_at: { gt: new Date() } },
  });
  if (!record) throw new AppError('Token tidak valid atau kadaluarsa', 400);

  const updateData: any = { verified_at: new Date() };
  if (newPassword) {
    updateData.password_hash = await bcryptjs.hash(newPassword, 10);
  }

  await Promise.all([
    prisma.user.update({ where: { id: record.userId }, data: updateData }),
    prisma.emailVerification.update({ where: { id: record.id }, data: { used_at: new Date() } }),
  ]);
};

export const resendVerification = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email, deleted_at: null } });
  if (!user) throw new AppError('Email tidak terdaftar', 404);
  if (user.verified_at) throw new AppError('Email sudah terverifikasi', 400);

  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = hashToken(rawToken);

  await prisma.emailVerification.create({
    data: {
      userId: user.id,
      token: hashedToken,
      expires_at: new Date(Date.now() + ONE_HOUR),
    },
  });

  await sendVerificationEmail(email, rawToken);
};

export const googleLogin = async (data: { email: string; name: string; avatarUrl?: string }) => {
  let user = await prisma.user.findFirst({
    where: { email: data.email, deleted_at: null },
  });

  if (!user) {
    const dummyPassword = crypto.randomBytes(16).toString('hex');
    const password_hash = await bcryptjs.hash(dummyPassword, 10);
    user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password_hash,
        role: 'USER',
        verified_at: new Date(),
        avatar_url: data.avatarUrl,
      },
    });
  } else {
    if (!user.verified_at) {
      await prisma.user.update({
        where: { id: user.id },
        data: { verified_at: new Date() },
      });
      user.verified_at = new Date();
    }
  }

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

export const logout = async (token: string) => {
  const { revokeToken } = await import('./tokenBlacklistService');
  revokeToken(token);
};

const sanitizeUser = (user: any) => {
  const { password_hash, ...safe } = user;
  return safe;
};
