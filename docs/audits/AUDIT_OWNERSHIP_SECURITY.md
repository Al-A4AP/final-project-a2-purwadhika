# Audit Ownership dan Keamanan

Tanggal audit: 19 Juni 2026
Project: PURWALOKA - Property Renting Web App  
Acuan: ownership data, authorization, browser storage, PII, transaksi, dan hardening backend.

## Ringkasan

Ownership dasar berada pada kondisi baik. Regression test ownership lulus 10/10, termasuk category owner scope dan category quota scope. Auth token memakai HTTP-only cookie, bukan localStorage. Persistent token blacklist sudah database-backed dan bukan in-memory, sehingga aman untuk deployment multi-instance.

Risiko besar yang sebelumnya aktif sudah diturunkan:

- Double booking sudah diberi advisory lock, availability recheck, dan atomic voucher update.
- Transaction timeout saat voucher digunakan sudah diperbaiki dengan scope transaction yang lebih pendek.
- Free nights voucher sudah memakai pricing backend terbaru: `discountedNights = min(freeNights, stayNights)` dan malam termurah digratiskan lebih dulu jika breakdown tersedia.
- Referral sudah dihapus dari active flow.
- Voucher nominal sudah dihapus dari active flow.
- `domicile_address` tidak ditemukan pada source aktif.
- Login attempt guard sudah aktif: 5 gagal login -> lock sementara 15 menit.

Risiko yang masih perlu ditindaklanjuti:

- Manual concurrency QA untuk double booking.
- Manual QA payment expiry 1 jam dan manual confirmation 2 jam.
- PII/KTP pada response list tenant/report perlu data minimization.
- Legacy schema/data referral/voucher nominal hanya boleh dibersihkan dengan migration setelah konfirmasi.

## Verifikasi

| Pemeriksaan | Hasil |
| --- | --- |
| `backend npm run test:ownership` | Lulus, 10/10 |
| `backend npm run build` | Lulus |
| `frontend npm run build` | Lulus |
| `frontend npm run lint` | Lulus |
| Scan browser storage | Tidak ditemukan auth token aktif di localStorage |
| File source >200 baris | Tidak ditemukan pada `frontend/src` dan `backend/src` |
| Function-length advisory | 112 kandidat: 99 frontend, 13 backend |
| Unsafe type/log residue | Tidak ditemukan `any`, `as any`, `as unknown as`, `console.log`, atau `debugger` pada scan source |

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
- Tenant tidak bisa update kategori tenant lain.
- Tenant tidak bisa membuat kategori milik sendiri ke-6.
- Penghitungan limit kategori hanya memakai kategori milik tenant terautentikasi.

### Category Ownership dan Quota

Status: implemented.

- Semua tenant dapat memilih kategori sistem/global dan kategori tenant lain.
- Edit/delete hanya diperbolehkan untuk pemilik kategori.
- Tenant maksimal membuat 5 kategori milik sendiri.
- Kategori sistem/global dan kategori tenant lain tidak dihitung dalam kuota.
- Create memakai transaction advisory lock per tenant untuk mencegah request paralel melewati limit.
- Frontend disable tombol tambah adalah UX guard; backend tetap source of truth.

### Saved Property Role Scope

Status: implemented.

- Saved property tidak memiliki endpoint atau model backend; storage tetap localStorage.
- Route `/saved-properties` tetap dilindungi sebagai USER-only.
- Tombol love pada property card dan property detail hanya dirender untuk authenticated USER.
- Shared hook memblokir read exposure dan mutation untuk TENANT maupun GUEST.
- Route `/saved-properties` tetap USER-only.
- Tidak ada perubahan API contract.

## Auth dan Session Security

Status: baik.

Auth token:

- Cookie: `auth_token`
- HTTP-only cookie dari backend
- Tidak disimpan di localStorage
- Logout memasukkan token ke persistent blacklist

Persistent token blacklist:

- Database-backed melalui model revoked token.
- Token disimpan sebagai SHA256 hash.
- Multi-instance safe.
- Cleanup expired token dilakukan melalui cron.
- Login attempt guard mencegah brute-force sederhana melalui lock sementara setelah 5 kegagalan login.

File:

- `backend/src/config/authCookie.ts`
- `backend/src/services/tokenBlacklistService.ts`
- `backend/src/services/authService.ts`
- `backend/src/middlewares/authMiddleware.ts`
- `backend/src/cron/cronTasks.ts`

## Booking, Payment, dan Inventory Security

### Double Booking Protection

Status: implemented, perlu manual concurrency QA.

Kontrol yang ada:

- Postgres advisory lock pada flow booking.
- Availability recheck sebelum final write.
- Atomic voucher update untuk mencegah quota race.
- Inventory lock terjadi saat order dibuat pada tahap `Lanjut ke Pembayaran`.
- CTA pembayaran/retry hanya aktif untuk order `WAITING_PAYMENT` yang belum expired.
- Jika voucher membuat total pembayaran Rp0, sistem tidak membuat transaksi Midtrans dan order langsung `PROCESSED`.

File:

- `backend/src/services/orderService.ts`
- `backend/src/services/order/bookingLocks.ts`
- `backend/src/services/availabilityService.ts`
- `backend/src/services/voucherService.ts`
- `backend/src/services/voucher/voucherDiscount.ts`
- `backend/src/services/voucher/voucherPreviewPricing.ts`

Risk tersisa:

- Harus diuji manual dengan dua request paralel pada kamar/property stok terbatas.

### Payment Window

Status: implemented.

- `WAITING_PAYMENT`: 1 jam.
- Setelah 1 jam: auto cancel dan inventory release.
- `WAITING_CONFIRMATION`: 2 jam untuk manual payment proof.
- Setelah 2 jam tanpa konfirmasi tenant: auto cancel.

File:

- `backend/src/constants/orderConstants.ts`
- `backend/src/cron/cronQueries.ts`
- `backend/src/cron/cronTasks.ts`
- `backend/src/services/orderService.ts`

Risk tersisa:

- Manual QA cron dan sync status perlu dilakukan pada environment yang sama dengan deployment target.

## P1 Security and Privacy

### PII/KTP Response Minimization

Severity: P1

Root cause:

Beberapa query order tenant/report berpotensi memakai Prisma `include`, sehingga scalar field order dapat ikut terkirim default, termasuk guest PII.

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

### Referral Legacy Data

Severity: P1 jika migration dilakukan sembarangan.

Status:

- Referral sudah tidak digunakan pada booking, voucher, dashboard, dan reward active flow.
- Jika masih ada schema/data legacy di database, migration destructive belum boleh dilakukan tanpa konfirmasi.

Recommended fix:

- Audit data existing.
- Siapkan migration hanya setelah user setuju.
- Pastikan tidak ada frontend/backend active flow yang masih mengirim `referral_code`.

### Voucher Nominal Legacy Data

Severity: P1 jika migration enum dilakukan langsung.

Status:

- Active flow hanya mendukung `PERCENTAGE` dan `FREE_NIGHTS`.
- `NOMINAL` sudah tidak tersedia pada form dan ditolak service aktif.
- `FREE_NIGHTS` menggunakan jumlah malam gratis maksimal sesuai durasi inap dan mengutamakan malam termurah jika nightly breakdown tersedia.
- Zero-payment dari voucher langsung masuk `PROCESSED` tanpa membuat transaksi Midtrans.

Recommended fix:

- Audit voucher nominal existing.
- Soft-delete atau convert data legacy sebelum enum migration.
- Migration enum hanya setelah data aman dan user konfirmasi.

### Explore Search Query Consistency

Severity: resolved UX/performance issue.

Status:

- Tombol `Cari` dan `Terapkan Filter` di Explore memakai helper query yang sama.
- Jika city kosong, query tidak mengirim city dan tidak memicu geolocation.
- Backend property listing tetap menjadi source of truth.

Risk tersisa:

- Query tanggal tanpa city tetap lebih berat secara natural karena backend perlu mengevaluasi availability pada cakupan properti yang lebih luas.

## Browser Storage

Storage yang masih dipakai:

| Lokasi | Storage | Tujuan | Risiko |
| --- | --- | --- | --- |
| `frontend/src/stores/theme/themeStorage.ts` | localStorage | Preferensi tema | Rendah |
| `frontend/src/hooks/savedPropertiesStorage.ts` | localStorage | Wishlist lokal authenticated USER; GUEST/TENANT diblokir oleh UI dan hook | Rendah-menengah |
| `frontend/src/lib/authNotice.ts` | sessionStorage | Notice auth sementara | Rendah |
| `frontend/src/lib/browserStorageCleanup.ts` | localStorage remove | Bersihkan legacy auth storage | Positif |

Tidak ditemukan JWT auth token aktif di localStorage.

## Upload Security

Status: cukup, perlu hardening jika produksi ketat.

Catatan:

- Upload divalidasi oleh Multer dari size dan mimetype.
- Untuk hardening lebih kuat, validasi magic bytes/file signature dapat ditambahkan.
- Cloudinary dan DB transaction perlu terus dijaga agar tidak membuat orphan file.

## Kesimpulan

Ownership dasar baik dan test lulus. Risiko utama yang tersisa bukan cross-tenant access, melainkan QA operasional dan privacy: concurrency/payment expiry perlu diuji manual, dan response list/report perlu data minimization. Legacy referral/voucher nominal sebaiknya diperlakukan sebagai pekerjaan migration terpisah dengan konfirmasi eksplisit.

## Legacy Folder Note

Audit dokumentasi 17 Juni 2026 menemukan dua folder kosong:

- `frontend/src/hooks/tenant/occupancy`
- `frontend/src/pages/tenant/occupancy`

Folder kosong tersebut aman dihapus pada cleanup terpisah. Route `/tenant/occupancy` tidak boleh langsung dihapus karena masih digunakan sebagai redirect ke `/tenant/property-report`, dan komponen `frontend/src/components/tenant/occupancy-calendar` masih aktif dipakai pada laporan properti.
