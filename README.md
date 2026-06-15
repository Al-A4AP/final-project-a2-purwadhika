# PURWALOKA - Property Renting Web App

PURWALOKA adalah aplikasi web penyewaan properti untuk menghubungkan penyewa (`USER`) dan pemilik properti (`TENANT`). Aplikasi mencakup pencarian properti, detail harga dan ketersediaan kamar, pemesanan, pembayaran manual/Midtrans, dashboard tenant, laporan penjualan, laporan properti, okupasi kamar, serta review setelah masa inap.

Final Project Purwadhika JCWDBGPM-11, Group 1:

- Muhammad Ali Akbar - Fitur 1
- Anggita Zahra Kamila - Fitur 2

## Live Deployment

- Frontend: [https://final-project-a2-purwadhika-fronten.vercel.app](https://final-project-a2-purwadhika-fronten.vercel.app)
- Backend API: [https://final-project-a2-purwadhika-backend.vercel.app](https://final-project-a2-purwadhika-backend.vercel.app)

## Status Audit Terakhir

Tanggal audit dokumentasi: 15 Juni 2026.

Acuan:

- `docs/guidelines/PURWADHIKA.md`
- `docs/guidelines/REST_API_GUIDELINES.md`
- `docs/guidelines/CODE_LINE_CHECK_GUIDELINES.md`
- `docs/guidelines/TOOLS_GUIDELINE.md`

Update limited scope terakhir menyelesaikan room max 5, referral non-migration removal, voucher nominal non-migration removal, Free Stay display, dan cleanup lint. Tidak ada destructive migration, commit, atau push.

| Area | Status aktual | Catatan |
| --- | --- | --- |
| Fitur utama | Mayoritas tersedia | User, tenant, booking, payment, review, report, ownership sudah ada |
| Frontend build | Lulus | `frontend npm run build` lulus |
| Backend build | Lulus | `backend npm run build` lulus |
| Ownership test | Lulus | `backend npm run test:ownership` lulus 7/7 |
| Frontend lint | Lulus | `frontend npm run lint` lulus |
| File source >200 baris | Belum sesuai | 1 file source utama >200 baris: `backend/src/utils/emailService.ts` |
| Function-length advisory | Dipantau | 155 kandidat manual review, bukan hard rule |
| `any`, `console.*`, `debugger` | Ada residue | `as any`, `as unknown`, dan `console.*` masih ditemukan pada beberapa file |
| REST API | Jalur utama baik | Legacy alias masih aktif untuk backward compatibility |
| Ownership/security | Baik dengan catatan | Ownership test lulus; PII/order response dan transaction flow perlu review lanjutan |
| Transaction voucher/payment | Perlu perbaikan | Prisma interactive transaction bisa timeout saat voucher dipakai |
| Referral | Source flow non-migration selesai | UI/payload/service aktif sudah dilepas; schema/data legacy belum di-drop |
| Voucher nominal | Source flow non-migration selesai | Form tidak menyediakan nominal; backend menolak nominal; enum/data legacy belum di-drop |
| Free Stay voucher | Selesai | Tampil sebagai `Gratis X Malam` |
| `domicile_address` | Akan dihapus | Masih ada di schema/type/payload, tidak lagi digunakan UI |

Laporan lengkap:

- [`docs/audits/AUDIT_PURWADHIKA_FINAL.md`](./docs/audits/AUDIT_PURWADHIKA_FINAL.md)
- [`docs/audits/AUDIT_CLEAN_CODE_REST_API_GUIDELINES.md`](./docs/audits/AUDIT_CLEAN_CODE_REST_API_GUIDELINES.md)
- [`docs/audits/AUDIT_OWNERSHIP_SECURITY.md`](./docs/audits/AUDIT_OWNERSHIP_SECURITY.md)
- [`docs/audits/AUDIT_ZOD_RESOLVER_BUG.md`](./docs/audits/AUDIT_ZOD_RESOLVER_BUG.md)
- [`docs/plans/RENCANA_PERBAIKAN_DETAIL.md`](./docs/plans/RENCANA_PERBAIKAN_DETAIL.md)

## Prioritas Perbaikan Aktif

P0:

1. Perpendek scope `prisma.$transaction` pada create order, terutama saat voucher digunakan.
2. Tambahkan guard anti double booking yang aman untuk request paralel.

P1:

1. Perbaiki bug change password kosong yang bisa membuat loading tidak berhenti.
2. Hapus schema/data legacy referral setelah konfirmasi migration.
3. Hapus enum/data legacy voucher nominal setelah konfirmasi migration.
5. Hapus `domicile_address` setelah migration disetujui.
6. Perbaiki clean code regression yang tersisa.

P2:

1. Cleanup legacy REST alias setelah regression test.
2. Review function-length advisory secara manual.
3. Update UI/UX minor setelah bug kritikal selesai.

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
| Profile USER/TENANT | Tersedia dengan bug password | `frontend/src/pages/user/ProfilePage.tsx`, `frontend/src/components/user/profile/`, `backend/src/services/userService.ts` |
| Property detail | Tersedia | `frontend/src/pages/user/PropertyDetailPage.tsx`, `frontend/src/components/property/`, `backend/src/services/propertyDetailService.ts` |
| Tenant property CRUD | Tersedia | `frontend/src/pages/tenant/PropertiesListPage.tsx`, `frontend/src/pages/tenant/PropertyFormPage.tsx`, `backend/src/services/tenantPropertyService.ts` |
| Tenant room CRUD | Tersedia dengan rule max 5 jenis kamar | `frontend/src/pages/tenant/RoomsPage.tsx`, `backend/src/services/tenantRoomService.ts` |
| Tenant category management | Tersedia | `frontend/src/pages/tenant/CategoriesPage.tsx`, `backend/src/services/categoryService.ts` |
| Peak season management | Tersedia | `frontend/src/pages/tenant/PeakSeasonPage.tsx`, `backend/src/services/tenantRoom/` |

## Fitur 2 - Transaction, Review, Report

| Requirement | Status | Folder/file terkait |
| --- | --- | --- |
| User booking flow | Tersedia, transaction perlu hardening | `frontend/src/pages/user/BookingPage.tsx`, `backend/src/services/orderService.ts` |
| Manual payment dan Midtrans | Tersedia | `frontend/src/lib/midtransSnap.ts`, `backend/src/services/midtransService.ts` |
| Payment proof deadline | Tersedia, perlu konfirmasi final durasi | `backend/src/constants/orderConstants.ts`, `backend/src/cron/` |
| Tenant transaction management | Tersedia | `frontend/src/pages/tenant/OrdersPage.tsx`, `backend/src/services/order/tenantOrderStatus.ts` |
| Auto-cancel unpaid reservations | Tersedia | `backend/src/cron/cronTasks.ts`, `backend/src/routes/webhookRoutes.ts` |
| Review setelah menginap | Tersedia | `frontend/src/pages/user/UserReviewsPage.tsx`, `backend/src/services/reviewService.ts` |
| Tenant reply/delete review | Tersedia | `frontend/src/pages/tenant/ReviewsPage.tsx`, `backend/src/services/tenantReviewService.ts` |
| Laporan pendapatan/properti/okupasi | Tersedia | `frontend/src/pages/tenant/ReportsPage.tsx`, `frontend/src/pages/tenant/PropertyReportPage.tsx`, `frontend/src/pages/tenant/OccupancyPage.tsx` |

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

Status 15 Juni 2026:

- Frontend lint: lulus.
- Frontend build: lulus.
- Backend build: lulus.
- Backend ownership test: lulus 7/7.

## Deployment

Frontend dideploy sebagai Vite app. Backend berjalan sebagai Express API dengan Prisma, Supabase PostgreSQL, Cloudinary, Midtrans, dan webhook cron. Untuk deployment yang memakai cookie auth lintas domain, pastikan konfigurasi proxy/CORS/cookie sama dengan konfigurasi production yang diuji.

## Catatan Final

Project memiliki fitur utama yang luas dan sebagian besar requirement Purwadhika sudah tersedia. Namun status audit 15 Juni 2026 belum boleh dianggap final-ready sampai P0/P1 pada dokumen audit dan plan diselesaikan, terutama transaction timeout saat voucher digunakan, potensi double booking paralel, bug profile password, migration legacy referral/voucher jika disetujui, `domicile_address`, dan clean code regression tersisa.
