import nodemailer from "nodemailer";
import { env } from "../config/env";
import { getEmailWrapper } from "./emailTemplate";

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,
  secure: false,
  auth: { user: env.EMAIL_USER, pass: env.EMAIL_PASSWORD },
});

const FROM = `"PURWALOKA" <${env.EMAIL_USER}>`;

const sendMail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({ from: FROM, to, subject, html });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const url = `${env.FRONTEND_URL}/auth/verify-email/${token}`;
  const html = getEmailWrapper(
    "Verifikasi Email Anda - PURWALOKA",
    `
    <h2>Verifikasi Email Akun Anda</h2>
    <p>Halo,</p>
    <p>Terima kasih telah mendaftar di PURWALOKA. Silakan klik tombol di bawah ini untuk memverifikasi alamat email Anda dan mengaktifkan akun Anda:</p>
    <p style="text-align: center;"><a href="${url}" class="btn" style="color: #ffffff;">Verifikasi Email</a></p>
    <p>Atau salin tautan berikut ke browser Anda jika tombol di atas tidak berfungsi:</p>
    <p style="word-break: break-all; font-size: 13px; color: #64748b;">${url}</p>
    <p><strong>Catatan:</strong> Tautan ini hanya berlaku selama 1 jam.</p>
  `,
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
    `
    <h2>Verifikasi Email Baru</h2>
    <p>Halo,</p>
    <p>Kami menerima permintaan perubahan email akun PURWALOKA Anda. Klik tombol di bawah ini untuk mengaktifkan email baru ini:</p>
    <p style="text-align: center;"><a href="${url}" class="btn" style="color: #ffffff;">Verifikasi Email Baru</a></p>
    <p>Atau salin tautan berikut ke browser Anda jika tombol di atas tidak berfungsi:</p>
    <p style="word-break: break-all; font-size: 13px; color: #64748b;">${url}</p>
    <p><strong>Catatan:</strong> Tautan ini hanya berlaku selama 1 jam.</p>
  `,
  );
  await sendMail(email, "Verifikasi Email Baru - PURWALOKA", html);
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const url = `${env.FRONTEND_URL}/auth/reset-password?token=${token}`;
  const html = getEmailWrapper(
    "Reset Password Anda - PURWALOKA",
    `
    <h2>Permintaan Reset Password</h2>
    <p>Halo,</p>
    <p>Kami menerima permintaan untuk mereset password akun Anda di PURWALOKA. Silakan klik tombol di bawah ini untuk mengubah password Anda:</p>
    <p style="text-align: center;"><a href="${url}" class="btn" style="color: #ffffff;">Reset Password</a></p>
    <p>Atau salin tautan berikut ke browser Anda jika tombol di atas tidak berfungsi:</p>
    <p style="word-break: break-all; font-size: 13px; color: #64748b;">${url}</p>
    <p>Jika Anda tidak merasa melakukan permintaan ini, silakan abaikan email ini.</p>
    <p><strong>Catatan:</strong> Tautan ini hanya berlaku selama 1 jam.</p>
  `,
  );
  await sendMail(email, "Reset Password - PURWALOKA", html);
};

export const sendOrderConfirmationEmail = async (
  email: string,
  orderNumber: string,
  propertyName: string,
  roomType: string,
  checkIn: Date,
  checkOut: Date,
  totalPrice: number,
) => {
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

const buildOrderConfirmationBody = (data: OrderConfirmationData) => `
    <h2>Pemesanan Akomodasi Berhasil Dibuat</h2>
    <p>Halo,</p>
    <p>Terima kasih telah memesan akomodasi melalui PURWALOKA. Berikut rincian pemesanan Anda yang menunggu pembayaran:</p>
    ${buildOrderDetailTable(data)}
    <p>Silakan segera lakukan pembayaran sebelum batas waktu yang ditentukan untuk mengamankan pesanan Anda.</p>
  `;

const buildOrderDetailTable = (data: OrderConfirmationData) => `
  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    ${orderDetailRows(data).map(buildOrderDetailRow).join("")}
  </table>
`;

const orderDetailRows = (data: OrderConfirmationData) =>
  [
    ["Nomor Order:", `#${data.orderNumber}`, false],
    ["Akomodasi:", data.propertyName, false],
    ["Tipe Kamar:", data.roomType, false],
    ["Check-in:", formatEmailDate(data.checkIn), false],
    ["Check-out:", formatEmailDate(data.checkOut), false],
    ["Total Biaya:", formatEmailPrice(data.totalPrice), true],
  ] as const;

const buildOrderDetailRow = ([label, value, highlight]: OrderDetailRow) =>
  `<tr><td style="${labelCellStyle(label)}">${label}</td><td style="${valueCellStyle(highlight)}">${value}</td></tr>`;

const labelCellStyle = (label: string) =>
  `padding: 8px 0; color: #64748b;${label === "Nomor Order:" ? " width: 150px;" : ""}`;

const valueCellStyle = (highlight: boolean) =>
  `padding: 8px 0; font-weight: bold; color: ${highlight ? "#2980B9" : "#1e293b"};${highlight ? " font-size: 16px;" : ""}`;

const formatEmailPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

const formatEmailDate = (date: Date) =>
  new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const sendPaymentConfirmationEmail = async (
  email: string,
  orderNumber: string,
) => {
  const html = getEmailWrapper(
    "Pembayaran Dikonfirmasi - PURWALOKA",
    `
    <h2>Pembayaran Diterima & Dikonfirmasi</h2>
    <p>Halo,</p>
    <p>Pembayaran Anda untuk order <strong>#${orderNumber}</strong> telah berhasil dikonfirmasi oleh pemilik akomodasi (tenant).</p>
    <p>Status pemesanan Anda kini telah berubah menjadi <strong>Dikonfirmasi (Processed)</strong>. Silakan periksa kembali rincian pemesanan Anda pada halaman dashboard pengguna.</p>
    <p>Terima kasih telah mempercayai PURWALOKA!</p>
  `,
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
    `
    <h2>Pengingat Jadwal Check-in Besok</h2>
    <p>Halo,</p>
    <p>Ini adalah pengingat bahwa jadwal menginap Anda untuk properti <strong>${propertyName}</strong> (Order <strong>#${orderNumber}</strong>) adalah besok.</p>
    <p>Harap persiapkan dokumen penting Anda dan hubungi kontak properti jika membutuhkan bantuan panduan arah atau proses check-in.</p>
    <p>Semoga perjalanan dan masa menginap Anda menyenangkan!</p>
  `,
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
  const refundInfo = requiresManualRefund
    ? `<div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
         <p style="margin: 0; font-weight: bold; color: #d97706;">Informasi Pengembalian Dana:</p>
         <p style="margin: 5px 0 0 0; color: #475569;">Pengembalian dana dilakukan langsung oleh pengelola properti dan berada di luar sistem Purwaloka.</p>
       </div>`
    : "";

  const html = getEmailWrapper(
    "Pemesanan Dibatalkan - PURWALOKA",
    `
    <h2>Pembatalan Transaksi Pemesanan</h2>
    <p>Halo,</p>
    <p>Kami ingin menginformasikan bahwa pesanan Anda dengan nomor <strong>#${orderNumber}</strong> telah dibatalkan.</p>
    <div style="background-color: #f8fafc; border-left: 4px solid #2980B9; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-weight: bold; color: #2980B9;">Alasan Pembatalan:</p>
      <p style="margin: 5px 0 0 0; color: #475569;">${reason}</p>
    </div>
    ${refundInfo}
    <p>Jika pembatalan disebabkan oleh habisnya batas waktu pembayaran, Anda masih dapat mencari akomodasi lain yang tersedia dan melakukan pemesanan ulang.</p>
  `,
  );
  await sendMail(email, `Pesanan Dibatalkan - Order #${orderNumber}`, html);
};

export const sendManualRefundTenantEmail = async (
  email: string,
  orderNumber: string,
  guestName: string,
  propertyName: string,
  checkInDate: Date,
) => {
  const html = getEmailWrapper(
    "Refund Manual Diperlukan - PURWALOKA",
    `
    <h2>Pengembalian Dana Manual Diperlukan</h2>
    <p>Halo,</p>
    <p>Tamu telah membatalkan pesanan yang sebelumnya telah memiliki bukti pembayaran.</p>
    <p>Mohon melakukan pengembalian dana (refund) kepada tamu sesuai dengan kebijakan properti Anda, karena transaksi ini dilakukan secara manual di luar sistem pembayaran otomatis.</p>
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <tr><td style="padding: 8px 0; color: #64748b; width: 150px;">Nomor Order:</td><td style="padding: 8px 0; font-weight: bold;">#${orderNumber}</td></tr>
      <tr><td style="padding: 8px 0; color: #64748b;">Akomodasi:</td><td style="padding: 8px 0; font-weight: bold;">${propertyName}</td></tr>
      <tr><td style="padding: 8px 0; color: #64748b;">Nama Tamu:</td><td style="padding: 8px 0; font-weight: bold;">${guestName}</td></tr>
      <tr><td style="padding: 8px 0; color: #64748b;">Check-in:</td><td style="padding: 8px 0; font-weight: bold;">${new Date(checkInDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</td></tr>
    </table>
    <p>Anda dapat berkomunikasi dengan tamu untuk detail pengembalian dana.</p>
  `,
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
    `
    <h2>Bukti Pembayaran Ditolak</h2>
    <p>Halo,</p>
    <p>Bukti pembayaran yang Anda unggah untuk nomor pesanan <strong>#${orderNumber}</strong> ditolak karena alasan berikut:</p>
    <div style="background-color: #f8fafc; border-left: 4px solid #D4AC0D; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-weight: bold; color: #D4AC0D;">Alasan Penolakan:</p>
      <p style="margin: 5px 0 0 0; color: #475569;">${reason}</p>
    </div>
    <p><strong>Penting:</strong> Status pesanan Anda telah dikembalikan menjadi <strong>Menunggu Pembayaran</strong>.</p>
    <p>Silakan masuk ke dashboard akun Anda untuk mengunggah ulang bukti pembayaran yang valid sebelum batas waktu pembayaran Anda berakhir untuk mencegah pembatalan otomatis.</p>
  `,
  );
  await sendMail(
    email,
    `Bukti Pembayaran Ditolak - Order #${orderNumber}`,
    html,
  );
};

interface OrderConfirmationData {
  orderNumber: string;
  propertyName: string;
  roomType: string;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
}

type OrderDetailRow = readonly [string, string, boolean];
