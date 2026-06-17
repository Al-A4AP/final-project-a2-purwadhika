import { escapeHtml, formatEmailDate, formatEmailPrice } from "./emailFormatters";

export const buildOrderConfirmationBody = (data: OrderConfirmationData) => `
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
    ["Nomor Order:", `#${escapeHtml(data.orderNumber)}`, false],
    ["Akomodasi:", escapeHtml(data.propertyName), false],
    ["Tipe Kamar:", escapeHtml(data.roomType), false],
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

export const buildPaymentConfirmationBody = (orderNumber: string) => `
    <h2>Pembayaran Diterima & Dikonfirmasi</h2>
    <p>Halo,</p>
    <p>Pembayaran Anda untuk order <strong>#${escapeHtml(orderNumber)}</strong> telah berhasil dikonfirmasi oleh pemilik akomodasi (tenant).</p>
    <p>Status pemesanan Anda kini telah berubah menjadi <strong>Dikonfirmasi (Processed)</strong>. Silakan periksa kembali rincian pemesanan Anda pada halaman dashboard pengguna.</p>
    <p>Terima kasih telah mempercayai PURWALOKA!</p>
  `;

export const buildBookingReminderBody = (orderNumber: string, propertyName: string) => `
    <h2>Pengingat Jadwal Check-in Besok</h2>
    <p>Halo,</p>
    <p>Ini adalah pengingat bahwa jadwal menginap Anda untuk properti <strong>${escapeHtml(propertyName)}</strong> (Order <strong>#${escapeHtml(orderNumber)}</strong>) adalah besok.</p>
    <p>Harap persiapkan dokumen penting Anda dan hubungi kontak properti jika membutuhkan bantuan panduan arah atau proses check-in.</p>
    <p>Semoga perjalanan dan masa menginap Anda menyenangkan!</p>
  `;

export const buildCancellationBody = (orderNumber: string, reason: string, requiresManualRefund: boolean) => `
    <h2>Pembatalan Transaksi Pemesanan</h2>
    <p>Halo,</p>
    <p>Kami ingin menginformasikan bahwa pesanan Anda dengan nomor <strong>#${escapeHtml(orderNumber)}</strong> telah dibatalkan.</p>
    ${buildCancellationReason(reason)}
    ${requiresManualRefund ? buildManualRefundNotice() : ""}
    <p>Jika pembatalan disebabkan oleh habisnya batas waktu pembayaran, Anda masih dapat mencari akomodasi lain yang tersedia dan melakukan pemesanan ulang.</p>
  `;

const buildCancellationReason = (reason: string) => `
    <div style="background-color: #f8fafc; border-left: 4px solid #2980B9; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-weight: bold; color: #2980B9;">Alasan Pembatalan:</p>
      <p style="margin: 5px 0 0 0; color: #475569;">${escapeHtml(reason)}</p>
    </div>`;

const buildManualRefundNotice = () => `
      <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
         <p style="margin: 0; font-weight: bold; color: #d97706;">Informasi Pengembalian Dana:</p>
         <p style="margin: 5px 0 0 0; color: #475569;">Pengembalian dana dilakukan langsung oleh pengelola properti dan berada di luar sistem Purwaloka.</p>
       </div>`;

export const buildManualRefundTenantBody = (data: ManualRefundTenantData) => `
    <h2>Pengembalian Dana Manual Diperlukan</h2>
    <p>Halo,</p>
    <p>Tamu telah membatalkan pesanan yang sebelumnya telah memiliki bukti pembayaran.</p>
    <p>Mohon melakukan pengembalian dana (refund) kepada tamu sesuai dengan kebijakan properti Anda, karena transaksi ini dilakukan secara manual di luar sistem pembayaran otomatis.</p>
    ${buildManualRefundTable(data)}
    <p>Anda dapat berkomunikasi dengan tamu untuk detail pengembalian dana.</p>
  `;

const buildManualRefundTable = (data: ManualRefundTenantData) => `
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <tr><td style="padding: 8px 0; color: #64748b; width: 150px;">Nomor Order:</td><td style="padding: 8px 0; font-weight: bold;">#${escapeHtml(data.orderNumber)}</td></tr>
      <tr><td style="padding: 8px 0; color: #64748b;">Akomodasi:</td><td style="padding: 8px 0; font-weight: bold;">${escapeHtml(data.propertyName)}</td></tr>
      <tr><td style="padding: 8px 0; color: #64748b;">Nama Tamu:</td><td style="padding: 8px 0; font-weight: bold;">${escapeHtml(data.guestName)}</td></tr>
      <tr><td style="padding: 8px 0; color: #64748b;">Check-in:</td><td style="padding: 8px 0; font-weight: bold;">${formatEmailDate(data.checkInDate)}</td></tr>
    </table>`;

export const buildPaymentRejectionBody = (orderNumber: string, reason: string) => `
    <h2>Bukti Pembayaran Ditolak</h2>
    <p>Halo,</p>
    <p>Bukti pembayaran yang Anda unggah untuk nomor pesanan <strong>#${escapeHtml(orderNumber)}</strong> ditolak karena alasan berikut:</p>
    ${buildPaymentRejectionReason(reason)}
    <p><strong>Penting:</strong> Status pesanan Anda telah dikembalikan menjadi <strong>Menunggu Pembayaran</strong>.</p>
    <p>Silakan masuk ke dashboard akun Anda untuk mengunggah ulang bukti pembayaran yang valid sebelum batas waktu pembayaran Anda berakhir untuk mencegah pembatalan otomatis.</p>
  `;

const buildPaymentRejectionReason = (reason: string) => `
    <div style="background-color: #f8fafc; border-left: 4px solid #D4AC0D; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-weight: bold; color: #D4AC0D;">Alasan Penolakan:</p>
      <p style="margin: 5px 0 0 0; color: #475569;">${escapeHtml(reason)}</p>
    </div>`;

export interface OrderConfirmationData {
  orderNumber: string;
  propertyName: string;
  roomType: string;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
}

type OrderDetailRow = readonly [string, string, boolean];

export interface ManualRefundTenantData {
  orderNumber: string;
  guestName: string;
  propertyName: string;
  checkInDate: Date;
}
