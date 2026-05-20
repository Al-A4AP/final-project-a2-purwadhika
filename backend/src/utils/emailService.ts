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

const FROM = `"PropRent" <${process.env.EMAIL_USER}>`;

const getEmailWrapper = (title: string, bodyContent: string) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f6f9;
            margin: 0;
            padding: 0;
            color: #333333;
          }
          .container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
            border: 1px solid #e1e8ed;
          }
          .header {
            background-color: #e11d48;
            padding: 30px 20px;
            text-align: center;
          }
          .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: 0.5px;
          }
          .content {
            padding: 30px 25px;
            line-height: 1.6;
          }
          .content h2 {
            margin-top: 0;
            color: #1e293b;
            font-size: 20px;
          }
          .btn {
            display: inline-block;
            background-color: #e11d48;
            color: #ffffff !important;
            padding: 12px 28px;
            margin: 20px 0;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            font-size: 14px;
            text-align: center;
          }
          .footer {
            background-color: #f8fafc;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>PropRent</h1>
          </div>
          <div class="content">
            ${bodyContent}
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} PropRent. Hak Cipta Dilindungi.</p>
            <p>Email ini dikirim secara otomatis oleh sistem. Mohon tidak membalas email ini.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const url = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/verify-email/${token}`;
  const html = getEmailWrapper(
    'Verifikasi Email Anda - PropRent',
    `
    <h2>Verifikasi Email Akun Anda</h2>
    <p>Halo,</p>
    <p>Terima kasih telah mendaftar di PropRent. Silakan klik tombol di bawah ini untuk memverifikasi alamat email Anda dan mengaktifkan akun Anda:</p>
    <p style="text-align: center;">
      <a href="${url}" class="btn" style="color: #ffffff;">Verifikasi Email</a>
    </p>
    <p>Atau salin tautan berikut ke browser Anda jika tombol di atas tidak berfungsi:</p>
    <p style="word-break: break-all; font-size: 13px; color: #64748b;">${url}</p>
    <p><strong>Catatan:</strong> Tautan ini hanya berlaku selama 1 jam.</p>
    `
  );

  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: 'Verifikasi Email Anda - PropRent',
    html,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const url = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/reset-password?token=${token}`;
  const html = getEmailWrapper(
    'Reset Password Anda - PropRent',
    `
    <h2>Permintaan Reset Password</h2>
    <p>Halo,</p>
    <p>Kami menerima permintaan untuk mereset password akun Anda di PropRent. Silakan klik tombol di bawah ini untuk mengubah password Anda:</p>
    <p style="text-align: center;">
      <a href="${url}" class="btn" style="color: #ffffff;">Reset Password</a>
    </p>
    <p>Atau salin tautan berikut ke browser Anda jika tombol di atas tidak berfungsi:</p>
    <p style="word-break: break-all; font-size: 13px; color: #64748b;">${url}</p>
    <p>Jika Anda tidak merasa melakukan permintaan ini, silakan abaikan email ini.</p>
    <p><strong>Catatan:</strong> Tautan ini hanya berlaku selama 1 jam.</p>
    `
  );

  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: 'Reset Password - PropRent',
    html,
  });
};

export const sendOrderConfirmationEmail = async (
  email: string,
  orderNumber: string,
  propertyName: string,
  roomType: string,
  checkIn: Date,
  checkOut: Date,
  totalPrice: number
) => {
  const formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalPrice);
  const html = getEmailWrapper(
    'Konfirmasi Pemesanan Baru - PropRent',
    `
    <h2>Pemesanan Akomodasi Berhasil Dibuat</h2>
    <p>Halo,</p>
    <p>Terima kasih telah memesan akomodasi melalui PropRent. Berikut rincian pemesanan Anda yang menunggu pembayaran:</p>
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <tr>
        <td style="padding: 8px 0; color: #64748b; width: 150px;">Nomor Order:</td>
        <td style="padding: 8px 0; font-weight: bold; color: #1e293b;">#${orderNumber}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b;">Akomodasi:</td>
        <td style="padding: 8px 0; font-weight: bold; color: #1e293b;">${propertyName}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b;">Tipe Kamar:</td>
        <td style="padding: 8px 0; font-weight: bold; color: #1e293b;">${roomType}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b;">Check-in:</td>
        <td style="padding: 8px 0; font-weight: bold; color: #1e293b;">${new Date(checkIn).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b;">Check-out:</td>
        <td style="padding: 8px 0; font-weight: bold; color: #1e293b;">${new Date(checkOut).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b;">Total Biaya:</td>
        <td style="padding: 8px 0; font-weight: bold; color: #e11d48; font-size: 16px;">${formattedPrice}</td>
      </tr>
    </table>
    <p>Silakan segera lakukan pembayaran sebelum batas waktu yang ditentukan untuk mengamankan pesanan Anda.</p>
    `
  );

  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: `Konfirmasi Pemesanan - Order #${orderNumber}`,
    html,
  });
};

export const sendPaymentConfirmationEmail = async (email: string, orderNumber: string) => {
  const html = getEmailWrapper(
    'Pembayaran Dikonfirmasi - PropRent',
    `
    <h2>Pembayaran Diterima & Dikonfirmasi</h2>
    <p>Halo,</p>
    <p>Pembayaran Anda untuk order <strong>#${orderNumber}</strong> telah berhasil dikonfirmasi oleh pemilik akomodasi (tenant).</p>
    <p>Status pemesanan Anda kini telah berubah menjadi <strong>Dikonfirmasi (Processed)</strong>. Silakan periksa kembali rincian pemesanan Anda pada halaman dashboard pengguna.</p>
    <p>Terima kasih telah mempercayai PropRent!</p>
    `
  );

  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: `Pembayaran Dikonfirmasi - Order #${orderNumber}`,
    html,
  });
};

export const sendBookingReminderEmail = async (email: string, orderNumber: string, propertyName: string) => {
  const html = getEmailWrapper(
    'Pengingat Check-in Besok - PropRent',
    `
    <h2>Pengingat Jadwal Check-in Besok</h2>
    <p>Halo,</p>
    <p>Ini adalah pengingat bahwa jadwal menginap Anda untuk properti <strong>${propertyName}</strong> (Order <strong>#${orderNumber}</strong>) adalah besok.</p>
    <p>Harap persiapkan dokumen penting Anda dan hubungi kontak properti jika membutuhkan bantuan panduan arah atau proses check-in.</p>
    <p>Semoga perjalanan dan masa menginap Anda menyenangkan!</p>
    `
  );

  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: `Pengingat Check-in: Besok! - Order #${orderNumber}`,
    html,
  });
};

export const sendCancellationEmail = async (email: string, orderNumber: string, reason: string) => {
  const html = getEmailWrapper(
    'Pemesanan Dibatalkan - PropRent',
    `
    <h2>Pembatalan Transaksi Pemesanan</h2>
    <p>Halo,</p>
    <p>Kami ingin menginformasikan bahwa pesanan Anda dengan nomor <strong>#${orderNumber}</strong> telah dibatalkan.</p>
    <div style="background-color: #f8fafc; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-weight: bold; color: #ef4444;">Alasan Pembatalan:</p>
      <p style="margin: 5px 0 0 0; color: #475569;">${reason}</p>
    </div>
    <p>Jika pembatalan disebabkan oleh habisnya batas waktu pembayaran, Anda masih dapat mencari akomodasi lain yang tersedia dan melakukan pemesanan ulang.</p>
    `
  );

  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: `Pesanan Dibatalkan - Order #${orderNumber}`,
    html,
  });
};

export const sendPaymentRejectionEmail = async (email: string, orderNumber: string, reason: string = 'Bukti pembayaran tidak terbaca atau tidak valid') => {
  const html = getEmailWrapper(
    'Bukti Pembayaran Ditolak - PropRent',
    `
    <h2>Bukti Pembayaran Ditolak</h2>
    <p>Halo,</p>
    <p>Bukti pembayaran yang Anda unggah untuk nomor pesanan <strong>#${orderNumber}</strong> ditolak karena alasan berikut:</p>
    <div style="background-color: #f8fafc; border-left: 4px solid #f97316; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-weight: bold; color: #f97316;">Alasan Penolakan:</p>
      <p style="margin: 5px 0 0 0; color: #475569;">${reason}</p>
    </div>
    <p><strong>Penting:</strong> Status pesanan Anda telah dikembalikan menjadi <strong>Menunggu Pembayaran</strong>.</p>
    <p>Silakan masuk ke dashboard akun Anda untuk mengunggah ulang bukti pembayaran yang valid sebelum batas waktu pembayaran Anda berakhir untuk mencegah pembatalan otomatis.</p>
    `
  );

  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: `Bukti Pembayaran Ditolak - Order #${orderNumber}`,
    html,
  });
};
