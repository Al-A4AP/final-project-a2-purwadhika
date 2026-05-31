import crypto from 'crypto';
import prisma from '../config/prisma';
import { AppError } from '../middlewares/errorHandler';
import { sendEmailChangeVerificationEmail } from '../utils/emailService';

const ONE_HOUR = 60 * 60 * 1000;

const hashToken = (token: string) =>
  crypto.createHash('sha256').update(token).digest('hex');

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const sanitizeUser = (user: any) => {
  const { password_hash, ...safe } = user;
  return safe;
};

const findActiveUser = async (userId: string) =>
  prisma.user.findUnique({ where: { id: userId, deleted_at: null } });

const ensureEmailAvailable = async (email: string, userId: string) => {
  const existing = await prisma.user.findFirst({
    where: { id: { not: userId }, deleted_at: null, OR: [{ email }, { pending_email: email }] },
  });
  if (existing) throw new AppError('Email sudah digunakan akun lain', 409);
};

const expirePendingRequests = (tx: any, userId: string) =>
  tx.emailVerification.updateMany({
    where: { userId, purpose: 'EMAIL_CHANGE', used_at: null },
    data: { used_at: new Date() },
  });

const setPendingEmail = (tx: any, userId: string, email: string) =>
  tx.user.update({
    where: { id: userId },
    data: { pending_email: email, email_change_requested_at: new Date() },
  });

const createEmailChangeRecord = (tx: any, userId: string, email: string, token: string) =>
  tx.emailVerification.create({
    data: { userId, token, purpose: 'EMAIL_CHANGE', target_email: email, expires_at: new Date(Date.now() + ONE_HOUR) },
  });

const saveEmailChangeRequest = async (userId: string, email: string, token: string) =>
  prisma.$transaction(async (tx) => {
    await expirePendingRequests(tx, userId);
    const user = await setPendingEmail(tx, userId, email);
    await createEmailChangeRecord(tx, userId, email, token);
    return user;
  });

const findEmailChangeRecord = (token: string) =>
  prisma.emailVerification.findFirst({
    where: {
      token,
      purpose: 'EMAIL_CHANGE',
      used_at: null,
      expires_at: { gt: new Date() },
    },
    include: { user: true },
  });

const assertPendingEmail = (record: any) => {
  if (!record.target_email || record.user.pending_email !== record.target_email) {
    throw new AppError('Token perubahan email tidak valid', 400);
  }
};

const activatePendingEmail = (record: any) =>
  prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: {
        email: record.target_email,
        pending_email: null,
        email_change_requested_at: null,
        verified_at: new Date(),
      },
    }),
    prisma.emailVerification.update({
      where: { id: record.id },
      data: { used_at: new Date() },
    }),
  ]);

export const requestEmailChange = async (userId: string, email: string) => {
  const targetEmail = normalizeEmail(email);
  const user = await findActiveUser(userId);
  if (!user) throw new AppError('User tidak ditemukan', 404);
  if (user.email === targetEmail) throw new AppError('Email baru sama dengan email saat ini', 400);
  await ensureEmailAvailable(targetEmail, userId);

  const rawToken = crypto.randomBytes(32).toString('hex');
  const updated = await saveEmailChangeRequest(userId, targetEmail, hashToken(rawToken));
  await sendEmailChangeVerificationEmail(targetEmail, rawToken);
  return sanitizeUser(updated);
};

export const verifyEmailChange = async (rawToken: string) => {
  const record = await findEmailChangeRecord(hashToken(rawToken));
  if (!record) throw new AppError('Token tidak valid atau kadaluarsa', 400);
  assertPendingEmail(record);
  await ensureEmailAvailable(record.target_email!, record.userId);
  await activatePendingEmail(record);
  return { email: record.target_email };
};
