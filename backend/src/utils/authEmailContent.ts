import { buildCenteredLink, buildCopyLinkInfo } from "./emailFormatters";

export const buildVerificationEmailBody = (url: string) => `
    <h2>Verifikasi Email Akun Anda</h2>
    <p>Halo,</p>
    <p>Terima kasih telah mendaftar di PURWALOKA. Silakan klik tombol di bawah ini untuk memverifikasi alamat email Anda dan mengaktifkan akun Anda:</p>
    ${buildCenteredLink(url, "Verifikasi Email")}
    ${buildCopyLinkInfo(url)}
    <p><strong>Catatan:</strong> Tautan ini hanya berlaku selama 1 jam.</p>
  `;

export const buildEmailChangeVerificationBody = (url: string) => `
    <h2>Verifikasi Email Baru</h2>
    <p>Halo,</p>
    <p>Kami menerima permintaan perubahan email akun PURWALOKA Anda. Klik tombol di bawah ini untuk mengaktifkan email baru ini:</p>
    ${buildCenteredLink(url, "Verifikasi Email Baru")}
    ${buildCopyLinkInfo(url)}
    <p><strong>Catatan:</strong> Tautan ini hanya berlaku selama 1 jam.</p>
  `;

export const buildPasswordResetBody = (url: string) => `
    <h2>Permintaan Reset Password</h2>
    <p>Halo,</p>
    <p>Kami menerima permintaan untuk mereset password akun Anda di PURWALOKA. Silakan klik tombol di bawah ini untuk mengubah password Anda:</p>
    ${buildCenteredLink(url, "Reset Password")}
    ${buildCopyLinkInfo(url)}
    <p>Jika Anda tidak merasa melakukan permintaan ini, silakan abaikan email ini.</p>
    <p><strong>Catatan:</strong> Tautan ini hanya berlaku selama 1 jam.</p>
  `;

export const buildFailedLoginWarningBody = () => `
    <h2>Percobaan Login Gagal</h2>
    <p>Halo,</p>
    <p>Ada beberapa percobaan masuk yang gagal pada akun PURWALOKA Anda.</p>
    <p>Jika ini bukan Anda, abaikan email ini dan pertimbangkan untuk mengganti password melalui fitur lupa password.</p>
    <p>Kami tidak pernah meminta password, kode OTP, atau token melalui email.</p>
  `;
