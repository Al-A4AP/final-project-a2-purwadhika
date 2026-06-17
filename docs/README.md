# Project Documentation

Folder ini menyimpan dokumentasi pendukung final project agar root project tetap ringkas dan mudah diperiksa.

Tanggal audit dokumentasi terbaru: 16 Juni 2026.

## Struktur

- `audits/AUDIT_CLEAN_CODE_REST_API_GUIDELINES.md`: audit clean code, function-length advisory, lint/build, dan kepatuhan REST API.
- `audits/AUDIT_OWNERSHIP_SECURITY.md`: audit ownership, authorization, browser storage, PII, token blacklist, dan keamanan.
- `audits/AUDIT_PURWADHIKA_FINAL.md`: audit keseluruhan berdasarkan requirement PURWADHIKA.
- `audits/AUDIT_ZOD_RESOLVER_BUG.md`: histori bug Zod resolver pada React Hook Form.
- `plans/RENCANA_PERBAIKAN_DETAIL.md`: rencana perbaikan aktif berdasarkan audit terbaru.
- `guidelines/PURWADHIKA.md`: requirement final project. Jangan diubah tanpa instruksi eksplisit.
- `guidelines/REST_API_GUIDELINES.md`: panduan REST resource naming. Jangan diubah tanpa instruksi eksplisit.
- `guidelines/CODE_LINE_CHECK_GUIDELINES.md`: panduan pengecekan batas baris. Jangan diubah tanpa instruksi eksplisit.
- `guidelines/TOOLS_GUIDELINE.md`: panduan penggunaan tool audit advisory. Jangan diubah tanpa instruksi eksplisit.

## Kebijakan README

README hanya dipertahankan di:

- `README.md` pada root project.
- `docs/README.md` di folder dokumentasi ini.

README di folder `frontend` dan `backend` tidak dibuat ulang.

## Ringkasan Audit Terbaru

| Area | Status aktual |
| --- | --- |
| Frontend lint | Lulus |
| Frontend build | Lulus |
| Backend build | Lulus |
| Ownership test | Lulus, 7/7 |
| File source >200 baris | 1 file backend: `backend/src/services/orderService.ts` (343 baris) |
| Function length audit | 145 kandidat manual review; advisory only |
| `any/as any/as unknown` | Tidak ditemukan pada scan `backend/src` dan `frontend/src` |
| `console.*` | Tidak ditemukan pada scan `backend/src` dan `frontend/src` |
| `debugger` | Tidak ditemukan |
| REST API | Jalur utama resource-oriented; legacy alias masih dicatat |
| Ownership | Test utama lulus; PII response minimization masih perlu review |
| Transaction | Voucher timeout fix sudah diterapkan; perlu QA manual checkout voucher |
| Double booking | Advisory lock + availability recheck diterapkan; perlu QA concurrency manual |
| Referral | Tidak digunakan pada source flow aktif; schema/data legacy masih menunggu migration konfirmasi |
| Voucher nominal | Tidak tersedia pada source flow aktif; enum/data legacy masih menunggu migration konfirmasi |
| `domicile_address` | Removed dari active source/schema |
| Room rules | Max 5 room type/property dan stock max 20 |

## Booking dan Payment Flow Aktual

Flow booking:

```text
Property Detail
-> Reservasi
-> Form Booking
-> Tinjauan & Persetujuan
-> Lanjut ke Pembayaran
-> Order Created (WAITING_PAYMENT)
-> Inventory Locked
```

Catatan:

- Order dibuat saat klik `Lanjut ke Pembayaran`.
- `WAITING_PAYMENT` berlaku 1 jam.
- Jika tidak dibayar/upload bukti dalam 1 jam, order auto-cancel dan inventory release.
- CTA pembayaran/retry hanya aktif untuk `WAITING_PAYMENT` yang belum expired.
- Manual payment setelah upload bukti menjadi `WAITING_CONFIRMATION`.
- `WAITING_CONFIRMATION` berlaku maksimal 2 jam.
- Jika tenant tidak konfirmasi dalam 2 jam, sistem auto-cancel.

## Voucher Flow Aktual

- Voucher aktif hanya `PERCENTAGE` dan `FREE_NIGHTS`.
- Voucher `NOMINAL` tidak tersedia pada form/flow aktif; enum/data legacy hanya boleh dibersihkan lewat migration setelah konfirmasi.
- `FREE_NIGHTS` memakai `discountedNights = min(freeNights, stayNights)`.
- Jika nightly breakdown tersedia, diskon diterapkan pada malam termurah terlebih dahulu.
- Jika total menjadi Rp0, order langsung `PROCESSED` dan tidak membuat transaksi Midtrans.

## Catatan Clean Code

- `npm run audit:functions` adalah alat bantu audit, bukan hard rule build.
- Banyak kandidat frontend berupa JSX presentasional panjang; refactor tetap perlu penilaian manual.
- File >200 baris tersisa 1 file backend, yaitu `backend/src/services/orderService.ts`.
- `voucherService.ts` dan `emailContent.ts` sudah berada di bawah 200 baris setelah refactor/helper split terbaru.
- Refactor batch 1-4 sudah memecah:
  - `backend/src/utils/emailService.ts`
  - `frontend/src/pages/tenant/properties-list/PropertiesListView.tsx`
  - `frontend/src/pages/tenant/rooms-page/RoomsListView.tsx`
  - `frontend/src/components/user/OrderCard.tsx`

## Catatan REST API

Jalur utama sudah resource-oriented, tetapi legacy alias masih aktif:

- `GET /api/orders/user`
- `GET /api/orders/tenant`
- `POST /api/orders/:id/payment-attempts`
- `PATCH /api/orders/:id/status`
- `POST /api/reviews/:reviewId/reply`
- `POST /api/tenants/me/rooms/:roomId/availability/range`
- `PATCH /api/tenants/me/rooms/:roomId/images/:imageId/main`

Cleanup legacy alias dilakukan setelah regression test.

## Catatan Ownership dan Security

- Auth token memakai HTTP-only cookie, bukan localStorage.
- Persistent token blacklist sudah database-backed melalui `RevokedToken`.
- Token hash memakai SHA256.
- Blacklist aman untuk multi-instance dan memiliki cleanup cron.
- Ownership regression test lulus 7/7.
- Tenant route utama memakai `requireAuth`, `requireRole`, dan ownership middleware.
- PII/KTP pada list order tenant/report perlu ditinjau ulang agar response hanya mengirim field yang dibutuhkan UI.
- Referral removal dan voucher simplification sudah selesai pada source flow aktif tanpa destructive migration.
- Schema/data legacy referral dan voucher nominal hanya boleh dihapus lewat migration setelah konfirmasi user.

## Cara Verifikasi Cepat

```bash
npm run audit:functions
cd frontend
npm run lint
npm run build
cd ../backend
npm run build
npm run test:ownership
```

Status terakhir 16 Juni 2026:

- `frontend npm run lint`: lulus.
- `frontend npm run build`: lulus.
- `backend npm run build`: lulus.
- `backend npm run test:ownership`: lulus 7/7.
