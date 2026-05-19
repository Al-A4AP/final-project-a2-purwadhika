import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const FROM = `"Property Renting" <${process.env.EMAIL_USER}>`;

export const sendVerificationEmail = async (email: string, token: string) => {
  const url = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/verify-email/${token}`;
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: 'Verifikasi Email Anda',
    html: `<p>Klik link berikut untuk verifikasi email: <a href="${url}">${url}</a></p><p>Link berlaku 1 jam.</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const url = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/reset-password?token=${token}`;
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: 'Reset Password',
    html: `<p>Klik link berikut untuk reset password: <a href="${url}">${url}</a></p><p>Link berlaku 1 jam.</p>`,
  });
};

export const sendPaymentConfirmationEmail = async (email: string, orderNumber: string) => {
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: `Pembayaran Dikonfirmasi - Order #${orderNumber}`,
    html: `<p>Pembayaran Anda untuk order <strong>#${orderNumber}</strong> telah dikonfirmasi. Selamat menikmati!`,
  });
};

export const sendBookingReminderEmail = async (email: string, orderNumber: string, propertyName: string) => {
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: `Pengingat Check-in: Besok! - Order #${orderNumber}`,
    html: `<p>Halo, ini adalah pengingat bahwa jadwal check-in Anda untuk <strong>${propertyName}</strong> adalah besok. Semoga perjalanan Anda menyenangkan!</p>`,
  });
};

export const sendCancellationEmail = async (email: string, orderNumber: string, reason: string) => {
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: `Pesanan Dibatalkan - Order #${orderNumber}`,
    html: `<p>Pesanan Anda dengan nomor <strong>#${orderNumber}</strong> telah dibatalkan karena: ${reason}.</p>`,
  });
};
