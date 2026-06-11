# Audit Ownership dan Keamanan

Tanggal audit: 11 Juni 2026  
Project: PURWALOKA - Property Renting Web App  
Acuan: ownership data, authorization, browser storage, dan hardening backend

## Ringkasan

Ownership dan keamanan berada pada kondisi baik. Route tenant dan user utama sudah memakai `requireAuth`, `requireRole`, validasi input, dan middleware ownership untuk resource tenant seperti properti, kamar, peak rate, availability, dan review. Regression test ownership terbaru lulus 7/7.

Auth token disimpan sebagai HTTP-only cookie dari backend, bukan localStorage. LocalStorage frontend hanya dipakai untuk preferensi UI dan saved properties lokal. Risiko keamanan yang tersisa bersifat production hardening, bukan blocker fitur final.

Catatan UAT browser terbaru: Seluruh temuan perbaikan 07 Juni 2026 yang menyentuh *ownership* data kategori, properti, voucher, dan penolakan *order* telah dieksekusi dengan tetap mempertahankan keamanan berlapis. Selain itu, hardening pada 11 Juni memastikan pemesanan *Whole Property* tidak bisa tumpang tindih (*double-booking*) melalui sinkronisasi kalender dan CTA.

## Verifikasi

| Pemeriksaan | Hasil |
| --- | --- |
| `backend npm.cmd run test:ownership` | Lulus, 7/7 test pass |
| `backend npm.cmd run build` | Lulus |
| `frontend npm.cmd run lint` | Lulus |
| Scan localStorage/sessionStorage | Tidak ada JWT auth token di localStorage |
| Scan frontend secret LocationIQ | LocationIQ request memakai backend proxy |
| Scan `document.cookie` frontend | Tidak ditemukan penggunaan langsung di frontend |

## Ownership

### Dampak Rencana UAT Browser 07 Juni 2026

Area yang perlu dijaga saat implementasi:

| Area | Risiko Ownership | Mitigasi |
| --- | --- | --- |
| Category description dan rental type | Tenant mencoba edit/delete kategori default sistem | Default category tetap `tenantId = null` dan read-only untuk tenant |
| Property rental type | Tenant mengubah property milik tenant lain | Tetap gunakan `verifyPropertyOwnership` dan filter `tenantId` di service |
| Voucher tenant | Tenant melihat/mengubah voucher reward private user | Voucher reward dengan `user_vouchers` tetap tidak muncul di voucher management tenant |
| Tenant reject payment reason | Tenant mengubah order tenant lain atau user melihat alasan order lain | Tetap validasi property ownership pada order dan filter user order by `userId` |
| Booking guest data | Data guest milik order user terekspos ke user lain | User order endpoint tetap filter by authenticated `userId` |
| Sinkronisasi Ketersediaan Whole Property | User dapat memesan properti yang sudah dipesan user lain (*double booking*) pada rentang tanggal sama | Sinkronisasi UX Kalender-CTA di sisi frontend; tetap ada *guard backend* pada `createOrder` yang mengecek `PROPERTY_ID` agar database tidak kebobolan |

Tambahkan regression test jika perubahan membuka surface ownership baru, terutama pada category/property rental type dan tenant order rejection reason.

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
- `backend/src/services/tenantRoom/roomOwnership.ts`

### Route Ownership yang Terlihat

Contoh proteksi yang sudah diterapkan:

- Tenant property detail/update/delete memakai `verifyPropertyOwnership`.
- Property image add/delete memakai `verifyPropertyOwnership`.
- Room CRUD/image/availability/peak-rate memakai `verifyRoomOwnership`.
- Peak rate update/delete memakai `verifyPeakRateOwnership`.
- Tenant review reply/delete diuji melalui ownership regression.

### Regression Test Ownership

Status: sesuai.

File:

- `backend/tests/ownership/ownership.test.ts`

Kasus yang lulus:

- User tidak bisa cancel manual order milik user lain.
- User tidak bisa retry Midtrans order milik user lain.
- Tenant tidak bisa akses properti tenant lain.
- Tenant tidak bisa akses kamar tenant lain.
- Tenant tidak bisa akses peak rate tenant lain.
- Tenant tidak bisa reply review property tenant lain.
- Tenant tidak bisa delete review property tenant lain.

## Auth dan Session Security

### Auth Token

Status: baik.

Auth token diset dari backend sebagai cookie:

- file: `backend/src/config/authCookie.ts`
- cookie name: `auth_token`
- `httpOnly: true`
- `sameSite: strict`
- `secure: true` saat production

Frontend tidak menyimpan JWT auth di localStorage, sehingga risiko pencurian token melalui XSS lebih rendah.

### Logout dan Token Revocation

Status: sangat baik.

Logout menghapus cookie dan memasukkan token ke blacklist service. 

### Persistent Token Revocation

Status: IMPLEMENTED

Implementation:
- PostgreSQL-backed blacklist
- SHA256 token hashing
- Multi-instance safe
- Automatic cleanup cron

Risk Eliminated:
- Logout bypass after server restart
- Multi-instance token resurrection

## Browser Storage

Storage yang masih dipakai:

| Lokasi | Storage | Tujuan | Risiko |
| --- | --- | --- | --- |
| `frontend/src/stores/theme/themeStorage.ts` | localStorage | Preferensi tema | Rendah |
| `frontend/src/hooks/savedPropertiesStorage.ts` | localStorage | Wishlist/saved properties lokal | Rendah-menengah |
| `frontend/src/lib/authNotice.ts` | sessionStorage | Notice sementara setelah redirect auth | Rendah |
| `frontend/src/lib/browserStorageCleanup.ts` | localStorage remove | Membersihkan legacy auth storage | Positif |

Tidak ditemukan penyimpanan auth token aktif di localStorage.

## Security Hardening

### Yang Sudah Baik

- Security headers tersedia di `backend/src/middlewares/securityHeaders.ts`.
- CORS dikendalikan lewat allowed origins.
- Rate limiter tersedia untuk global API, auth, resend, order, dan Midtrans webhook.
- Upload file memakai middleware Multer dan validasi ukuran/extension sesuai area.
- LocationIQ request diproxy dari backend sehingga token tidak perlu diekspos sebagai frontend source.
- Response error memakai helper terpusat.
- Query/body divalidasi dengan Zod.

### Sisa Risiko dan Rekomendasi

| Risiko | Skala | Rekomendasi |
| --- | --- | --- |
| Belum ada CSRF token eksplisit untuk cookie-auth | Menengah | Tambahkan CSRF token jika production memakai cookie cross-origin atau domain kompleks |
| Token blacklist masih in-memory | Menengah | Gunakan Redis/database jika backend deploy multi-instance |
| Legacy endpoint alias masih aktif | Rendah-menengah | Deprecate atau hapus setelah regression test |
| Saved properties masih localStorage | Rendah-menengah | Pindahkan ke backend jika wishlist wajib sinkron lintas device |

## Kesimpulan

Tidak ditemukan celah kritikal dari audit statis terbaru. Ownership sudah teruji dan keamanan utama sudah baik. Sisa rekomendasi lebih mengarah ke hardening production dan penyempurnaan jangka panjang.
