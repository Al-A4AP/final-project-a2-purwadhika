# Audit Ownership dan Keamanan

Tanggal audit: 15 Juni 2026  
Project: PURWALOKA - Property Renting Web App  
Acuan: ownership data, authorization, browser storage, PII, transaksi, dan hardening backend.

## Ringkasan

Ownership dasar berada pada kondisi baik. Regression test ownership lulus 7/7. Auth token memakai HTTP-only cookie, bukan localStorage.

Namun audit terbaru menemukan beberapa risiko yang perlu ditangani sebelum dinyatakan final-ready:

- Potensi double booking pada request paralel.
- Prisma transaction timeout saat voucher digunakan.
- PII/KTP pada response list tenant/report perlu data minimization.
- Referral source flow aktif sudah dilepas tanpa destructive migration; schema/data legacy belum di-drop.
- Voucher nominal sudah dilepas dari UI/validation/service aktif tanpa destructive migration; schema/data legacy belum di-drop.
- `domicile_address` tidak digunakan lagi tetapi masih ada di schema/type.

## Verifikasi

| Pemeriksaan | Hasil |
| --- | --- |
| `backend npm run test:ownership` | Lulus, 7/7 |
| `backend npm run build` | Lulus |
| `frontend npm run build` | Lulus |
| `frontend npm run lint` | Lulus |
| Scan browser storage | Tidak ditemukan auth token aktif di localStorage |

## Ownership

### Proteksi Tenant Resource

Status: baik.

Route tenant utama dilindungi:

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

### Regression Test Ownership

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

## P0 Security/Data Integrity

### Potensi Double Booking Paralel

Severity: P0

Root cause:

Availability check masih berbasis read/count order aktif. Belum ada lock/constraint yang menjamin dua request paralel tidak sama-sama lolos untuk stok terbatas.

File:

- `backend/src/services/orderService.ts`
- `backend/src/services/availabilityService.ts`
- `backend/src/services/availability/availabilityQueries.ts`
- `backend/src/services/availability/availabilityRules.ts`

Risk:

- Overbooking kamar/properti.
- Tenant/user melihat status ketersediaan yang tidak konsisten.

Recommended fix:

- Tambahkan guard atomic, misalnya Postgres advisory lock per room/property + date, atau inventory lock table jika migration disetujui.

### Transaction Timeout Saat Voucher Digunakan

Severity: P0

Root cause:

Interactive transaction create order masih terlalu panjang dan mencakup availability, pricing, voucher, profile sync, dan create order.

File:

- `backend/src/services/orderService.ts`
- `backend/src/services/voucherService.ts`
- `backend/src/services/pricingService.ts`

Risk:

- User gagal checkout saat voucher digunakan.
- Order/payment state bisa membingungkan jika frontend sudah masuk flow pembayaran.

Recommended fix:

- Perpendek transaction scope.
- Pastikan Midtrans dan email tetap di luar transaction.
- Buat voucher quota update atomic.

## P1 Security and Privacy

### PII/KTP Response Minimization

Severity: P1

Root cause:

Query order tenant/report memakai Prisma `include`, sehingga scalar field order dapat ikut terkirim default, termasuk guest PII.

File yang perlu diaudit saat fix:

- `backend/src/services/order/tenantOrderList.ts`
- `backend/src/services/tenantReport/reportQueries.ts`
- `frontend/src/types/order.ts`

Risk:

- Data sensitif dikirim lebih luas dari kebutuhan UI.

Recommended fix:

- Ganti `include` menjadi `select` eksplisit.
- Pisahkan response list summary dan detail order.
- Jangan kirim KTP/alamat penuh pada list jika tidak dibutuhkan.

### Referral Legacy Migration

Severity: P1

Root cause:

Referral sudah dilepas dari UI, create order payload, voucher summary, Midtrans processed flow, dan tenant approval flow. Schema/data legacy belum dihapus karena itu membutuhkan destructive migration.

Risk:

- Jika destructive migration dilakukan tanpa audit data, histori order/user lama bisa rusak.
- Migration drop table/column bersifat destructive.

Recommended fix:

- Pertahankan kondisi source flow non-migration yang sudah selesai.
- Migration hanya setelah user konfirmasi.

### Voucher Nominal Removal

Severity: P1

Root cause:

`NOMINAL` masih ada sebagai enum/schema/type legacy, tetapi tidak lagi tersedia di form tenant dan ditolak oleh backend validation/service aktif.

Risk:

- Existing data `NOMINAL` bisa menghambat enum migration.

Recommended fix:

- Pertahankan non-migration layer yang sudah selesai.
- Soft-delete/convert data nominal existing sebelum migration enum.

### `domicile_address` Removal

Severity: P1

Root cause:

Field tidak dipakai UI tetapi masih ada di schema/type/payload.

Risk:

- API contract drift.
- Migration drop column menghapus data lama.

Recommended fix:

- Hapus dari code path dulu.
- Migration drop column hanya setelah user konfirmasi.

## Auth dan Session Security

Status: baik.

Auth token:

- Cookie: `auth_token`
- HTTP-only cookie dari backend
- Tidak disimpan di localStorage

File:

- `backend/src/config/authCookie.ts`
- `backend/src/services/tokenBlacklistService.ts`
- `backend/src/middlewares/authMiddleware.ts`

Catatan:

- Dokumentasi lama yang menyebut token blacklist masih in-memory sudah tidak akurat jika code memakai model `RevokedToken`.
- Tetap pastikan deployment production menjalankan cleanup revoked token.

## Browser Storage

Storage yang masih dipakai:

| Lokasi | Storage | Tujuan | Risiko |
| --- | --- | --- | --- |
| `frontend/src/stores/theme/themeStorage.ts` | localStorage | Preferensi tema | Rendah |
| `frontend/src/hooks/savedPropertiesStorage.ts` | localStorage | Wishlist lokal | Rendah-menengah |
| `frontend/src/lib/authNotice.ts` | sessionStorage | Notice auth sementara | Rendah |
| `frontend/src/lib/browserStorageCleanup.ts` | localStorage remove | Bersihkan legacy auth storage | Positif |

Tidak ditemukan JWT auth token aktif di localStorage.

## Upload Security

Status: cukup, perlu hardening jika produksi ketat.

Catatan:

- Upload divalidasi oleh Multer dari size dan mimetype.
- Untuk hardening lebih kuat, validasi magic bytes/file signature dapat ditambahkan.
- Cloudinary delete/upload property image sudah dipisah dari DB transaction pada flow utama.

## Kesimpulan

Ownership dasar baik dan test lulus. Risiko utama saat ini bukan cross-tenant access, melainkan data integrity dan privacy: double booking paralel, transaction timeout saat voucher, dan PII response minimization. Referral/voucher nominal sudah dilepas dari source flow aktif, tetapi migration legacy referral/voucher nominal dan `domicile_address` tetap perlu rencana bertahap agar tidak merusak data existing.
