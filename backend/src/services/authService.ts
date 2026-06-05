import bcryptjs from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import type { User } from '@prisma/client';
import { EmailVerificationPurpose } from '@prisma/client';
import { env } from '../config/env';
import prisma from '../config/prisma';
import { AppError } from '../middlewares/errorHandler';
import type { AuthJwtPayload } from '../types/authJwt';
import { sendPasswordResetEmail, sendVerificationEmail } from '../utils/emailService';

const JWT_SECRET = env.JWT_SECRET;
const JWT_EXPIRES = env.JWT_EXPIRES_IN;
const ONE_HOUR = 60 * 60 * 1000;

export const registerUser = async (data: RegisterUserData) => {
  await assertEmailAvailable(data.email);
  const user = await createPendingEmailUser(data);
  const rawToken = await createActivationToken(user.id);
  await sendVerificationEmail(user.email, rawToken).catch(() => {});
  return { email: user.email };
};

export const loginUser = async (email: string, password: string) => {
  const user = await findLoginUserOrThrow(email);
  await assertValidPassword(password, user.password_hash);
  assertVerifiedUser(user);
  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  return { user: sanitizeUser(user), token };
};

export const verifyEmail = async (rawToken: string, newPassword?: string) => {
  const record = await findActivationRecordOrThrow(rawToken);
  const updateData = await buildPasswordUpdate(newPassword);
  await Promise.all([
    prisma.user.update({ where: { id: record.userId }, data: updateData }),
    markEmailVerificationUsed(record.id),
  ]);
};

export const resendVerification = async (email: string) => {
  const user = await findUnverifiedUserOrThrow(email);
  const rawToken = await createActivationToken(user.id);
  await sendVerificationEmail(email, rawToken);
};

export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email, deleted_at: null } });
  if (!user || !canUsePasswordReset(user)) return;
  const rawToken = await createPasswordResetToken(user.id);
  await sendPasswordResetEmail(email, rawToken);
};

export const resetPassword = async (rawToken: string, newPassword: string) => {
  const record = await findPasswordResetRecordOrThrow(rawToken);
  if (!canUsePasswordReset(record.user)) throw new AppError('Reset password hanya untuk akun email dan password', 400);
  await Promise.all([
    updatePassword(record.userId, newPassword),
    markPasswordResetUsed(record.id),
  ]);
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId, deleted_at: null } });
  if (!user) throw new AppError('User tidak ditemukan', 404);
  return sanitizeUser(user);
};

export const logout = async (token: string) => {
  const { revokeToken } = await import('./tokenBlacklistService');
  revokeToken(token);
};

const assertEmailAvailable = async (email: string) => {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new AppError('Email sudah terdaftar', 409);
};

const createPendingEmailUser = async (data: RegisterUserData) =>
  prisma.user.create({
    data: { name: data.name, email: data.email, password_hash: await createDummyPasswordHash(), auth_provider: 'EMAIL', role: data.role || 'USER', verified_at: null },
  });

const findLoginUserOrThrow = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email, deleted_at: null } });
  if (!user) throw new AppError('Email atau password salah', 401);
  return user;
};

const assertValidPassword = async (password: string, hash: string) => {
  const valid = await bcryptjs.compare(password, hash);
  if (!valid) throw new AppError('Email atau password salah', 401);
};

const assertVerifiedUser = (user: User) => {
  if (!user.verified_at) throw new AppError('Silakan verifikasi email Anda terlebih dahulu', 403);
};

const findUnverifiedUserOrThrow = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email, deleted_at: null } });
  if (!user) throw new AppError('Email tidak terdaftar', 404);
  if (user.verified_at) throw new AppError('Email sudah terverifikasi', 400);
  return user;
};

const findActivationRecordOrThrow = async (rawToken: string) => {
  const record = await prisma.emailVerification.findFirst({ where: buildActiveActivationWhere(rawToken) });
  if (!record) throw new AppError('Token tidak valid atau kadaluarsa', 400);
  return record;
};

const findPasswordResetRecordOrThrow = async (rawToken: string) => {
  const record = await prisma.passwordReset.findFirst({ where: buildActiveTokenWhere(rawToken), include: { user: true } });
  if (!record) throw new AppError('Token tidak valid atau kadaluarsa', 400);
  return record;
};

const createActivationToken = (userId: string) =>
  createEmailVerificationToken(userId, EmailVerificationPurpose.ACCOUNT_ACTIVATION);

const createEmailVerificationToken = async (userId: string, purpose: EmailVerificationPurpose) => {
  const rawToken = createRawToken();
  await prisma.emailVerification.create({ data: { userId, token: hashToken(rawToken), purpose, expires_at: oneHourFromNow() } });
  return rawToken;
};

const createPasswordResetToken = async (userId: string) => {
  const rawToken = createRawToken();
  await prisma.passwordReset.create({ data: { userId, token: hashToken(rawToken), expires_at: oneHourFromNow() } });
  return rawToken;
};

const buildActiveActivationWhere = (rawToken: string) => ({
  ...buildActiveTokenWhere(rawToken),
  purpose: EmailVerificationPurpose.ACCOUNT_ACTIVATION,
});

const buildActiveTokenWhere = (rawToken: string) => ({
  token: hashToken(rawToken),
  used_at: null,
  expires_at: { gt: new Date() },
});

const buildPasswordUpdate = async (newPassword?: string) =>
  newPassword ? buildVerifiedPasswordData(newPassword) : { verified_at: new Date() };

const buildVerifiedPasswordData = async (newPassword: string) => ({
  password_hash: await bcryptjs.hash(newPassword, 10),
  password_set_at: new Date(),
  verified_at: new Date(),
});

const markEmailVerificationUsed = (id: string) =>
  prisma.emailVerification.update({ where: { id }, data: { used_at: new Date() } });

const markPasswordResetUsed = (id: string) =>
  prisma.passwordReset.update({ where: { id }, data: { used_at: new Date() } });

const updatePassword = async (userId: string, newPassword: string) =>
  prisma.user.update({ where: { id: userId }, data: { password_hash: await bcryptjs.hash(newPassword, 10), password_set_at: new Date() } });

const createDummyPasswordHash = async () =>
  bcryptjs.hash(crypto.randomBytes(16).toString('hex'), 10);

const canUsePasswordReset = (user: Pick<User, 'auth_provider' | 'password_set_at'>) =>
  user.auth_provider === 'EMAIL' && !!user.password_set_at;

const generateToken = (payload: AuthTokenPayload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES as SignOptions['expiresIn'] });

const createRawToken = () =>
  crypto.randomBytes(32).toString('hex');

const hashToken = (token: string) =>
  crypto.createHash('sha256').update(token).digest('hex');

const oneHourFromNow = () =>
  new Date(Date.now() + ONE_HOUR);

const sanitizeUser = (user: User): SafeUser => {
  const { password_hash, ...safe } = user;
  return safe;
};

interface RegisterUserData {
  name: string;
  email: string;
  role?: 'USER' | 'TENANT';
}

type SafeUser = Omit<User, 'password_hash'>;
type AuthTokenPayload = Pick<AuthJwtPayload, 'email' | 'id' | 'role'>;
