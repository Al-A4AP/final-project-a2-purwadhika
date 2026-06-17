# PURWALOKA - Property Renting Web App

PURWALOKA adalah aplikasi web penyewaan properti untuk menghubungkan penyewa (`USER`) dan pemilik properti (`TENANT`). Aplikasi mencakup pencarian properti, detail harga dan ketersediaan kamar, booking, pembayaran manual/Midtrans, dashboard tenant, laporan penjualan, laporan properti, okupasi kamar, voucher, serta review setelah masa inap.

Final Project Purwadhika JCWDBGPM-11, Group 1:

- Muhammad Ali Akbar - Fitur 1
- Anggita Zahra Kamila - Fitur 2

## Live Deployment

- Frontend: [https://final-project-a2-purwadhika-fronten.vercel.app](https://final-project-a2-purwadhika-fronten.vercel.app)
- Backend API: [https://final-project-a2-purwadhika-backend.vercel.app](https://final-project-a2-purwadhika-backend.vercel.app)

## Status Audit Terakhir

Tanggal audit dokumentasi: 16 Juni 2026.

Acuan:

- `docs/guidelines/PURWADHIKA.md`
- `docs/guidelines/REST_API_GUIDELINES.md`
- `docs/guidelines/CODE_LINE_CHECK_GUIDELINES.md`
- `docs/guidelines/TOOLS_GUIDELINE.md`

| Area | Status aktual |
| --- | --- |
| Frontend lint | Lulus |
| Frontend build | Lulus |
| Backend build | Lulus |
| Backend ownership test | Lulus, 7/7 |
| File source >200 baris | 1 file backend: `backend/src/services/orderService.ts` (343 baris) |
| Function-length advisory | 145 kandidat manual review: 131 frontend, 14 backend |
| `any/as any/as unknown` | Tidak ditemukan pada scan `backend/src` dan `frontend/src` |
| `console.*` | Tidak ditemukan pada scan `backend/src` dan `frontend/src` |
| `debugger` | Tidak ditemukan |
| REST API | Jalur utama resource-oriented; beberapa legacy alias masih aktif |
| Ownership/security | Ownership test lulus; PII response minimization tetap perlu review |

## Final Hardening Update

Perubahan terakhir yang sudah tercermin di source:

- Booking order dibuat saat user klik `Lanjut ke Pembayaran` pada tahap `Tinjauan & Persetujuan`, bukan saat klik `Reservasi`.
- Flow booking terbaru: Property Detail -> Reservasi -> Form Booking -> Tinjauan & Persetujuan -> Lanjut ke Pembayaran -> order dibuat (`WAITING_PAYMENT`) -> inventory dikunci.
- `WAITING_PAYMENT` berlaku 1 jam. Jika lewat, order auto-cancel dan inventory dilepas.
- Upload bukti bayar manual mengubah status menjadi `WAITING_CONFIRMATION`.
- `WAITING_CONFIRMATION` maksimal 2 jam. Jika tenant tidak konfirmasi, sistem auto-cancel.
- CTA pembayaran/retry hanya aktif untuk order `WAITING_PAYMENT` yang belum expired.
- Double booking protection sudah memakai Postgres advisory lock + availability recheck di transaction.
- Voucher quota update dibuat atomic untuk mengurangi race condition.
- Transaction checkout dipersingkat agar voucher tidak membuat interactive transaction timeout.
- Password change form memakai resolver custom, bukan `zodResolver` langsung.
- Persistent token blacklist sudah database-backed (`RevokedToken`), memakai SHA256 token hash, aman untuk multi-instance, dan punya cleanup cron.
- `domicile_address` sudah tidak digunakan di source/schema aktif.
- Referral system sudah tidak digunakan pada booking, voucher, dashboard, reward flow aktif. Schema/data legacy referral masih ada dan hanya boleh dihapus lewat migration setelah konfirmasi.
- Voucher aktif mendukung `PERCENTAGE` dan `FREE_NIGHTS`. Voucher `NOMINAL` tidak tersedia di form dan ditolak oleh service aktif; enum/data legacy masih menunggu migration jika disetujui.
- Free nights voucher memakai `discountedNights = min(freeNights, stayNights)`. Jika nightly breakdown tersedia, malam termurah digratiskan terlebih dahulu.
- Free nights voucher tampil sebagai `Gratis X Malam`, bukan `X Rp`. Jika total pembayaran menjadi Rp0, sistem tidak membuat transaksi Midtrans dan order langsung masuk `PROCESSED`.
- Rule kamar: maksimal 5 jenis kamar per properti dan stok kamar maksimal 20.
- Refactor batch 1-4 selesai: email service, tenant properties list, tenant rooms list, dan user order card.

## Dokumen Audit

- [`docs/audits/AUDIT_PURWADHIKA_FINAL.md`](./docs/audits/AUDIT_PURWADHIKA_FINAL.md)
- [`docs/audits/AUDIT_CLEAN_CODE_REST_API_GUIDELINES.md`](./docs/audits/AUDIT_CLEAN_CODE_REST_API_GUIDELINES.md)
- [`docs/audits/AUDIT_OWNERSHIP_SECURITY.md`](./docs/audits/AUDIT_OWNERSHIP_SECURITY.md)
- [`docs/audits/AUDIT_ZOD_RESOLVER_BUG.md`](./docs/audits/AUDIT_ZOD_RESOLVER_BUG.md)
- [`docs/plans/RENCANA_PERBAIKAN_DETAIL.md`](./docs/plans/RENCANA_PERBAIKAN_DETAIL.md)

## Prioritas Perbaikan Aktif

P0 saat ini tidak ditemukan dari verifikasi build/lint/ownership, tetapi ada QA manual penting:

1. Uji concurrency booking paralel di Supabase untuk memastikan advisory lock menolak double booking.
2. Uji end-to-end manual payment: `WAITING_PAYMENT` 1 jam dan `WAITING_CONFIRMATION` 2 jam.

P1:

1. PII response minimization pada tenant order/report list.
2. Cleanup legacy REST alias setelah regression test.
3. Migration legacy referral/voucher nominal hanya jika user menyetujui.
4. Refactor `backend/src/services/orderService.ts` yang masih melewati 200 baris tanpa mengubah business logic.
5. Review function-length advisory bertahap tanpa memecah JSX secara mekanis.

## Kebijakan Dokumentasi

README hanya dipertahankan di:

- `README.md` pada root project.
- `docs/README.md` pada folder dokumentasi.

README di folder `frontend` dan `backend` tidak dibuat ulang.

## Eksternal API yang Digunakan

1. LocationIQ API: geocoding dan reverse geocoding melalui backend proxy.
2. Midtrans API: payment gateway dan webhook status pembayaran.
3. Cloudinary API: penyimpanan gambar profil, properti, kamar, dan bukti transfer.
4. Supabase PostgreSQL: database utama melalui Prisma ORM.
5. Google OAuth API: social sign-in/sign-up.
6. SMTP Nodemailer: email verifikasi, reset password, perubahan email, reminder, dan notifikasi transaksi.

## Fitur 1 - Property Renting Core

| Requirement | Status | Folder/file terkait |
| --- | --- | --- |
| Homepage/landing page | Tersedia | `frontend/src/pages/user/HomePage.tsx`, `frontend/src/components/user/HeroSection.tsx`, `frontend/src/components/user/SearchForm.tsx` |
| Explore property list | Tersedia | `frontend/src/pages/user/ExplorePage.tsx`, `backend/src/services/propertyList/` |
| Auth/register/verify/login/logout | Tersedia | `frontend/src/pages/auth/`, `frontend/src/hooks/auth/`, `backend/src/routes/authRoutes.ts` |
| Profile USER/TENANT | Tersedia | `frontend/src/pages/user/ProfilePage.tsx`, `frontend/src/components/user/profile/`, `backend/src/services/userService.ts` |
| Property detail | Tersedia | `frontend/src/pages/user/PropertyDetailPage.tsx`, `frontend/src/components/property/`, `backend/src/services/propertyDetailService.ts` |
| Tenant property CRUD | Tersedia | `frontend/src/pages/tenant/PropertiesListPage.tsx`, `frontend/src/pages/tenant/PropertyFormPage.tsx`, `backend/src/services/tenantPropertyService.ts` |
| Tenant room CRUD | Tersedia | `frontend/src/pages/tenant/RoomsPage.tsx`, `backend/src/services/tenantRoomService.ts` |
| Tenant category management | Tersedia | `frontend/src/pages/tenant/CategoriesPage.tsx`, `backend/src/services/categoryService.ts` |
| Peak season management | Tersedia | `frontend/src/pages/tenant/PeakSeasonPage.tsx`, `backend/src/services/tenantRoom/` |

## Fitur 2 - Transaction, Review, Report

| Requirement | Status | Folder/file terkait |
| --- | --- | --- |
| User booking flow | Tersedia dan sudah di-hardening | `frontend/src/pages/user/BookingPage.tsx`, `frontend/src/hooks/user/booking/`, `backend/src/services/orderService.ts` |
| Manual payment dan Midtrans | Tersedia | `frontend/src/lib/midtransSnap.ts`, `backend/src/services/midtransService.ts` |
| Payment proof deadline | 1 jam | `backend/src/constants/orderConstants.ts`, `backend/src/cron/` |
| Tenant manual confirmation deadline | 2 jam | `backend/src/cron/cronTasks.ts`, `backend/src/cron/cronQueries.ts` |
| Tenant transaction management | Tersedia | `frontend/src/pages/tenant/OrdersPage.tsx`, `backend/src/services/order/tenantOrderStatus.ts` |
| Auto-cancel unpaid/manual-confirmation reservations | Tersedia | `backend/src/cron/cronTasks.ts`, `backend/src/routes/webhookRoutes.ts` |
| Review setelah menginap | Tersedia | `frontend/src/pages/user/UserReviewsPage.tsx`, `backend/src/services/reviewService.ts` |
| Tenant reply/delete review | Tersedia | `frontend/src/pages/tenant/ReviewsPage.tsx`, `backend/src/services/tenantReviewService.ts` |
| Laporan pendapatan/properti/okupasi | Tersedia | `frontend/src/pages/tenant/ReportsPage.tsx`, `frontend/src/pages/tenant/PropertyReportPage.tsx`, `frontend/src/pages/tenant/OccupancyPage.tsx` |

## Profile Data

Customer:

- User Name
- KTP Number
- KTP Name
- KTP Address
- Phone

Tenant:

- User Name
- Phone
- Operational Address

`domicile_address`: removed from active source/schema.

## Struktur Project

```text
final-pro-a2/
  backend/
    prisma/
    src/
      config/
      constants/
      controllers/
      cron/
      middlewares/
      routes/
      services/
      types/
      utils/
      validations/
    tests/
  docs/
    audits/
    guidelines/
    plans/
  frontend/
    src/
      components/
      hooks/
      lib/
      pages/
      router/
      services/
      stores/
      types/
      validations/
  tools/
```

## Setup Local

Install dependency dari root workspace:

```bash
npm install
```

Backend:

```bash
cd backend
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

Default local URL:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`

## Environment Penting

Backend:

- `DATABASE_URL`
- `DIRECT_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_HOST`, `EMAIL_PORT`
- `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `MIDTRANS_SERVER_KEY`, `MIDTRANS_CLIENT_KEY`, `MIDTRANS_IS_PRODUCTION`
- `PORT`
- `NODE_ENV`
- `CRON_SECRET`
- `ALLOWED_ORIGINS`
- `FRONTEND_URL`
- `LOCATIONIQ_TOKEN`

Frontend:

- `VITE_API_BASE_URL`
- `VITE_APP_NAME`
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_MIDTRANS_CLIENT_KEY`

## Verifikasi

```bash
npm run audit:functions
cd frontend
npm run lint
npm run build
cd ../backend
npm run build
npm run test:ownership
```

Status 16 Juni 2026:

- Frontend lint: lulus.
- Frontend build: lulus.
- Backend build: lulus.
- Backend ownership test: lulus 7/7.
- File source >200 baris: 1 file backend.
- Function-length advisory: 145 kandidat.

## Deployment

Frontend dideploy sebagai Vite app. Backend berjalan sebagai Express API dengan Prisma, Supabase PostgreSQL, Cloudinary, Midtrans, dan webhook cron. Untuk deployment yang memakai cookie auth lintas domain, pastikan konfigurasi proxy/CORS/cookie sama dengan konfigurasi production yang diuji.

## Catatan Final

Project sudah lebih stabil dibanding audit 15 Juni 2026: P0 transaction timeout, double booking guard, password resolver, deadline payment, type-safety residue, script logging residue, dan FREE_NIGHTS pricing sudah ditangani. Status tetap memerlukan QA manual concurrency/payment window sebelum final demo, cleanup `orderService.ts` >200 baris, review lanjutan untuk PII minimization, dan cleanup legacy migration yang bersifat destructive.
