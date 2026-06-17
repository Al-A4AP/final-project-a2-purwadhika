import nodemailer from "nodemailer";
import { env } from "../config/env";
import {
  buildBookingReminderBody,
  buildCancellationBody,
  buildContactMessageBody,
  buildEmailChangeVerificationBody,
  buildFailedLoginWarningBody,
  buildManualRefundTenantBody,
  buildOrderConfirmationBody,
  buildPasswordResetBody,
  buildPaymentConfirmationBody,
  buildPaymentRejectionBody,
  buildVerificationEmailBody,
} from "./emailContent";
import { getEmailWrapper } from "./emailTemplate";

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,
  secure: false,
  auth: { user: env.EMAIL_USER, pass: env.EMAIL_PASSWORD },
});

const FROM = `"PURWALOKA" <${env.EMAIL_USER}>`;

const sendMail = async (to: string, subject: string, html: string, replyTo?: string) => {
  await transporter.sendMail({ from: FROM, to, subject, html, replyTo });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const url = `${env.FRONTEND_URL}/auth/verify-email/${token}`;
  const html = getEmailWrapper(
    "Verifikasi Email Anda - PURWALOKA",
    buildVerificationEmailBody(url),
  );
  await sendMail(email, "Verifikasi Email Anda - PURWALOKA", html);
};

export const sendEmailChangeVerificationEmail = async (
  email: string,
  token: string,
) => {
  const url = `${env.FRONTEND_URL}/auth/verify-email-change/${token}`;
  const html = getEmailWrapper(
    "Verifikasi Email Baru - PURWALOKA",
    buildEmailChangeVerificationBody(url),
  );
  await sendMail(email, "Verifikasi Email Baru - PURWALOKA", html);
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const url = `${env.FRONTEND_URL}/auth/reset-password?token=${token}`;
  const html = getEmailWrapper(
    "Reset Password Anda - PURWALOKA",
    buildPasswordResetBody(url),
  );
  await sendMail(email, "Reset Password - PURWALOKA", html);
};

export const sendFailedLoginWarningEmail = async (email: string) => {
  const html = getEmailWrapper(
    "Percobaan Login Gagal - PURWALOKA",
    buildFailedLoginWarningBody(),
  );
  await sendMail(email, "Peringatan Percobaan Login Gagal - PURWALOKA", html);
};

export const sendOrderConfirmationEmail = async (email: string, orderNumber: string, propertyName: string, roomType: string, checkIn: Date, checkOut: Date, totalPrice: number) => {
  const html = getEmailWrapper(
    "Konfirmasi Pemesanan Baru - PURWALOKA",
    buildOrderConfirmationBody({
      checkIn,
      checkOut,
      orderNumber,
      propertyName,
      roomType,
      totalPrice,
    }),
  );
  await sendMail(email, `Konfirmasi Pemesanan - Order #${orderNumber}`, html);
};

export const sendPaymentConfirmationEmail = async (
  email: string,
  orderNumber: string,
) => {
  const html = getEmailWrapper(
    "Pembayaran Dikonfirmasi - PURWALOKA",
    buildPaymentConfirmationBody(orderNumber),
  );
  await sendMail(
    email,
    `Pembayaran Dikonfirmasi - Order #${orderNumber}`,
    html,
  );
};

export const sendBookingReminderEmail = async (
  email: string,
  orderNumber: string,
  propertyName: string,
) => {
  const html = getEmailWrapper(
    "Pengingat Check-in Besok - PURWALOKA",
    buildBookingReminderBody(orderNumber, propertyName),
  );
  await sendMail(
    email,
    `Pengingat Check-in: Besok! - Order #${orderNumber}`,
    html,
  );
};
export const sendCancellationEmail = async (
  email: string,
  orderNumber: string,
  reason: string,
  requiresManualRefund = false,
) => {
  const html = getEmailWrapper(
    "Pemesanan Dibatalkan - PURWALOKA",
    buildCancellationBody(orderNumber, reason, requiresManualRefund),
  );
  await sendMail(email, `Pesanan Dibatalkan - Order #${orderNumber}`, html);
};

export const sendManualRefundTenantEmail = async (email: string, orderNumber: string, guestName: string, propertyName: string, checkInDate: Date) => {
  const html = getEmailWrapper(
    "Refund Manual Diperlukan - PURWALOKA",
    buildManualRefundTenantBody({
      checkInDate,
      guestName,
      orderNumber,
      propertyName,
    }),
  );
  await sendMail(email, `Refund Manual Diperlukan - Order #${orderNumber}`, html);
};

export const sendPaymentRejectionEmail = async (
  email: string,
  orderNumber: string,
  reason: string = "Bukti pembayaran tidak terbaca atau tidak valid",
) => {
  const html = getEmailWrapper(
    "Bukti Pembayaran Ditolak - PURWALOKA",
    buildPaymentRejectionBody(orderNumber, reason),
  );
  await sendMail(
    email,
    `Bukti Pembayaran Ditolak - Order #${orderNumber}`,
    html,
  );
};

export const sendContactMessageEmail = async (
  name: string,
  email: string,
  subject: string,
  message: string,
) => {
  if (!env.EMAIL_USER) return;
  const html = getEmailWrapper(
    "Pesan Kontak Baru - PURWALOKA",
    buildContactMessageBody({ email, message, name, subject }),
  );
  await sendMail(env.EMAIL_USER, `Pesan Kontak: ${subject}`, html, email);
};
