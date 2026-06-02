import crypto from "crypto";
import prisma from "../config/prisma";
import type { Prisma } from "@prisma/client";
import { AppError } from "../middlewares/errorHandler";
import { sendEmailChangeVerificationEmail } from "../utils/emailService";

const ONE_HOUR = 60 * 60 * 1000;

const hashToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

const normalizeEmail = (email: string) => email.trim().toLowerCase();

type SanitizedUser = Omit<Prisma.UserGetPayload<{}>, "password_hash">;

const sanitizeUser = (user: Prisma.UserGetPayload<{}>): SanitizedUser => {
  const { password_hash, ...safe } = user;
  return safe as SanitizedUser;
};

const findActiveUser = async (userId: string) =>
  prisma.user.findUnique({ where: { id: userId, deleted_at: null } });

const ensureEmailAvailable = async (email: string, userId: string) => {
  const existing = await prisma.user.findFirst({
    where: {
      id: { not: userId },
      deleted_at: null,
      OR: [{ email }, { pending_email: email }],
    },
  });
  if (existing) throw new AppError("Email sudah digunakan akun lain", 409);
};

const expirePendingRequests = (tx: Prisma.TransactionClient, userId: string) =>
  tx.emailVerification.updateMany({
    where: { userId, purpose: "EMAIL_CHANGE", used_at: null },
    data: { used_at: new Date() },
  });

const setPendingEmail = (
  tx: Prisma.TransactionClient,
  userId: string,
  email: string,
) =>
  tx.user.update({
    where: { id: userId },
    data: { pending_email: email, email_change_requested_at: new Date() },
  });

const createEmailChangeRecord = (
  tx: Prisma.TransactionClient,
  userId: string,
  email: string,
  token: string,
) =>
  tx.emailVerification.create({
    data: {
      userId,
      token,
      purpose: "EMAIL_CHANGE",
      target_email: email,
      expires_at: new Date(Date.now() + ONE_HOUR),
    },
  });

const saveEmailChangeRequest = async (
  userId: string,
  email: string,
  token: string,
) =>
  prisma.$transaction(async (tx) => {
    await expirePendingRequests(tx, userId);
    const user = await setPendingEmail(tx, userId, email);
    await createEmailChangeRecord(tx, userId, email, token);
    return user;
  });

type EmailChangeRecord = Prisma.EmailVerificationGetPayload<{
  include: { user: true };
}>;

const findEmailChangeRecord = (
  token: string,
): Promise<EmailChangeRecord | null> =>
  prisma.emailVerification.findFirst({
    where: {
      token,
      purpose: "EMAIL_CHANGE",
      used_at: null,
      expires_at: { gt: new Date() },
    },
    include: { user: true },
  });

const assertPendingEmail = (record: EmailChangeRecord) => {
  if (
    !record.target_email ||
    record.user.pending_email !== record.target_email
  ) {
    throw new AppError("Token perubahan email tidak valid", 400);
  }
};

const getEmailActivationData = (record: EmailChangeRecord) => ({
  email: record.target_email,
  pending_email: null,
  email_change_requested_at: null,
  verified_at: new Date(),
});

const activatePendingEmail = (record: EmailChangeRecord) =>
  prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: getEmailActivationData(record),
    }),
    prisma.emailVerification.update({
      where: { id: record.id },
      data: { used_at: new Date() },
    }),
  ]);

const assertEmailChangeAllowed = async (userId: string, targetEmail: string) => {
  const user = await findActiveUser(userId);
  if (!user) throw new AppError("User tidak ditemukan", 404);
  if (user.email === targetEmail)
    throw new AppError("Email baru sama dengan email saat ini", 400);
  await ensureEmailAvailable(targetEmail, userId);
};

const createRawEmailToken = () => crypto.randomBytes(32).toString("hex");

const saveAndSendEmailChange = async (userId: string, targetEmail: string) => {
  const rawToken = createRawEmailToken();
  const updated = await saveEmailChangeRequest(userId, targetEmail, hashToken(rawToken));
  await sendEmailChangeVerificationEmail(targetEmail, rawToken);
  return updated;
};

export const requestEmailChange = async (userId: string, email: string) => {
  const targetEmail = normalizeEmail(email);
  await assertEmailChangeAllowed(userId, targetEmail);
  const updated = await saveAndSendEmailChange(userId, targetEmail);
  return sanitizeUser(updated);
};

const getValidEmailChangeRecord = async (rawToken: string) => {
  const record = await findEmailChangeRecord(hashToken(rawToken));
  if (!record) throw new AppError("Token tidak valid atau kadaluarsa", 400);
  return record;
};

const completeEmailChange = async (record: EmailChangeRecord) => {
  assertPendingEmail(record);
  await ensureEmailAvailable(record.target_email!, record.userId);
  await activatePendingEmail(record);
};

export const verifyEmailChange = async (rawToken: string) => {
  const record = await getValidEmailChangeRecord(rawToken);
  await completeEmailChange(record);
  return { email: record.target_email };
};
