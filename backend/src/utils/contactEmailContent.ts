import { escapeHtml } from "./emailFormatters";

export const buildContactMessageBody = (data: ContactMessageData) => `
    <h2>Pesan Baru dari Halaman Kontak</h2>
    <p>Halo Tim Support,</p>
    <p>Anda menerima pesan baru melalui halaman kontak PURWALOKA:</p>
    ${buildContactMessageTable(data)}
    ${buildContactMessageBox(data.message)}
    <p>Silakan balas langsung ke email pengirim: <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>
  `;

const buildContactMessageTable = (data: ContactMessageData) => `
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <tr><td style="padding: 8px 0; color: #64748b; width: 100px;">Nama:</td><td style="padding: 8px 0; font-weight: bold;">${escapeHtml(data.name)}</td></tr>
      <tr><td style="padding: 8px 0; color: #64748b;">Email:</td><td style="padding: 8px 0; font-weight: bold;">${escapeHtml(data.email)}</td></tr>
      <tr><td style="padding: 8px 0; color: #64748b;">Subjek:</td><td style="padding: 8px 0; font-weight: bold;">${escapeHtml(data.subject)}</td></tr>
    </table>`;

const buildContactMessageBox = (message: string) => `
    <div style="background-color: #f8fafc; border-left: 4px solid #2980B9; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-weight: bold; color: #2980B9;">Pesan:</p>
      <p style="margin: 5px 0 0 0; color: #475569; white-space: pre-wrap;">${escapeHtml(message)}</p>
    </div>`;

export interface ContactMessageData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
