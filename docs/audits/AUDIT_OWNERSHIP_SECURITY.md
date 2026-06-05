# Audit Ownership dan Keamanan

Tanggal audit: 05 Juni 2026  
Project: PURWALOKA - Property Renting Web App  
Acuan: ownership data, authorization, storage browser, dan hardening backend

## Ringkasan

Ownership dan keamanan sudah berada pada kondisi baik. Route tenant memakai `requireAuth`, `requireRole(['TENANT'])`, dan middleware ownership untuk properti, kamar, peak rate, serta review. Auth token disimpan sebagai HTTP-only cookie, bukan localStorage. Security headers dan rate limiter sudah aktif pada backend.

Sisa rekomendasi utama bersifat production hardening: pertimbangkan CSRF token jika deployment cookie-auth berjalan cross-origin, dan gunakan persistent token blacklist jika backend berjalan multi-instance.

## Verifikasi

| Pemeriksaan | Hasil |
| --- | --- |
| `backend npm.cmd run test:ownership` | Lulus, 7/7 test pass |
| Scan storage browser | Tidak ada auth token di localStorage |
| Scan secret frontend | Tidak ditemukan `VITE_LOCATIONIQ_API_KEY` pada source frontend |
| Build backend | Lulus |
| Lint frontend | Lulus |

## Ownership

### Proteksi Tenant Resource

Status: sesuai.

Route tenant dilindungi oleh:

- `requireAuth`
- `requireRole(['TENANT'])`
- `verifyPropertyOwnership`
- `verifyRoomOwnership`
- `verifyPeakRateOwnership`

File utama:

- `backend/src/routes/tenantRoutes.ts`
- `backend/src/middlewares/authMiddleware.ts`
- `backend/src/middlewares/ownershipMiddleware.ts`
- `backend/src/middlewares/ownership/`

### Regression Test Ownership

Status: sesuai.

Test ownership tersedia di:

- `backend/tests/ownership/ownership.test.ts`

Kasus yang sudah diuji:

- User tidak bisa membatalkan order milik user lain.
- User tidak bisa retry Midtrans order milik user lain.
- Tenant tidak bisa akses properti tenant lain.
- Tenant tidak bisa akses kamar tenant lain.
- Tenant tidak bisa akses peak rate tenant lain.
- Tenant tidak bisa reply review property tenant lain.
- Tenant tidak bisa delete review property tenant lain.

## Auth dan Session Security

### Auth Token

Status: baik.

Auth token diset dari backend sebagai HTTP-only cookie:

- `backend/src/config/authCookie.ts`
- cookie name: `auth_token`
- `httpOnly: true`
- `sameSite: strict`
- `secure: true` saat production

Frontend tidak menyimpan JWT auth di localStorage. Ini menurunkan risiko token dicuri lewat XSS.

### Logout

Status: cukup baik.

Logout menghapus cookie dan memasukkan token ke blacklist service. Catatan: token blacklist saat ini bersifat in-memory, sehingga untuk deployment multi-instance/persistent production lebih kuat jika dipindahkan ke Redis atau database.

## Browser Storage

Storage yang masih dipakai:

| Lokasi | Tujuan | Risiko |
| --- | --- | --- |
| `frontend/src/stores/theme/themeStorage.ts` | Preferensi tema | Rendah |
| `frontend/src/hooks/savedPropertiesStorage.ts` | Saved properties lokal | Rendah-menengah jika ingin data lintas device |
| `frontend/src/lib/authNotice.ts` | Notice sementara setelah auth redirect | Rendah |
| `frontend/src/lib/browserStorageCleanup.ts` | Membersihkan legacy auth storage | Positif |

Tidak ditemukan penyimpanan auth token/user sensitive baru di localStorage.

## Security Hardening

### Yang Sudah Baik

- `backend/src/middlewares/securityHeaders.ts` menambahkan header dasar keamanan.
- CORS dikendalikan oleh `getAllowedOrigins()`.
- Rate limiter tersedia untuk global API, auth, order, resend, dan webhook.
- LocationIQ token berada di backend lewat proxy geocoding, bukan frontend env.
- Upload menggunakan middleware Multer dan validasi controller.
- Query/body divalidasi lewat Zod.

### Sisa Risiko dan Rekomendasi

| Risiko | Skala | Rekomendasi |
| --- | --- | --- |
| Belum ada CSRF token eksplisit untuk cookie-auth | Menengah | Tambahkan CSRF token jika production memakai cookie cross-origin atau integrasi multi-domain |
| Token blacklist in-memory | Menengah | Gunakan Redis/database jika backend deploy multi-instance |
| Legacy endpoint alias masih aktif | Rendah-menengah | Tetap aman karena protected, tetapi sebaiknya deprecated/dihapus setelah regression test |
| Saved properties masih localStorage | Rendah-menengah | Jika fitur akun ingin konsisten lintas device, pindahkan ke backend |

## Kesimpulan

Ownership sudah teruji dan keamanan utama sudah baik. Tidak ditemukan celah kritikal dari audit statis terbaru. Rekomendasi yang tersisa lebih mengarah ke hardening production dan penyempurnaan jangka panjang.
