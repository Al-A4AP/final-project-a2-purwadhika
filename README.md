# PURWALOKA - Property Renting Web App

PURWALOKA adalah aplikasi web penyewaan properti untuk menghubungkan penyewa (`USER`) dan pemilik properti (`TENANT`). Aplikasi mencakup pencarian properti, detail harga dan ketersediaan kamar, pemesanan, pembayaran manual/Midtrans, dashboard tenant, laporan penjualan, laporan properti, okupasi kamar, serta review setelah masa inap.

Final Project Purwadhika JCWDBGPM-11, Group 1:

- Muhammad Ali Akbar - Fitur 1
- Anggita Zahra Kamila - Fitur 2

## Status Audit Terakhir

Audit dokumentasi diperbarui pada 07 Juni 2026 dengan acuan `docs/guidelines/PURWADHIKA.md` dan `docs/guidelines/REST_API_GUIDELINES.md`.

| Area                           | Status                  | Catatan                                                                                                                  |
| ------------------------------ | ----------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Fitur utama                    | Selesai                 | User, tenant, booking, payment, review, report, dan ownership tersedia                                                   |
| Frontend Architecture & UI/UX  | Selesai                 | Logika tersentralisasi di hooks, otorisasi UI tenant ketat (view-only mode), dan komponen premium (Love Badge konsisten) |
| Fitur 1                        | Selesai                 | Homepage, auth/profile, katalog properti, detail properti, tenant CRUD property/room/category, availability, peak season |
| Fitur 2                        | Selesai                 | Booking, manual payment, Midtrans, tenant order management, review, laporan pendapatan/properti/okupasi                  |
| File source >200 baris         | Sesuai                  | Tidak ditemukan pada `backend/src`, `backend/tests`, `frontend/src`                                                      |
| Function maksimal 15 baris     | Dipantau                | `npm run audit:functions` tersedia sebagai advisory tool; hasil terbaru 87 kandidat manual review                        |
| `any`, `debugger`, `console.*` | Sesuai                  | Tidak ditemukan pada source utama                                                                                        |
| Frontend lint/build            | Lulus                   | `npm.cmd run lint` dan `npm.cmd run build` lulus                                                                         |
| Backend build                  | Lulus                   | `npm.cmd run build` lulus                                                                                                |
| Ownership test                 | Lulus                   | `npm.cmd run test:ownership` lulus, 7/7                                                                                  |
| REST API                       | Sesuai pada jalur utama | Legacy alias masih aktif untuk backward compatibility                                                                    |
| Browser storage                | Aman                    | Auth token tidak disimpan di localStorage                                                                                |
| UAT browser lanjutan           | Selesai                 | Temuan UAT browser 07 Juni 2026 telah dieksekusi sepenuhnya                                                              |

Laporan lengkap tersedia di:

- [`docs/audits/AUDIT_PURWADHIKA_FINAL.md`](./docs/audits/AUDIT_PURWADHIKA_FINAL.md)
- [`docs/audits/AUDIT_CLEAN_CODE_REST_API_GUIDELINES.md`](./docs/audits/AUDIT_CLEAN_CODE_REST_API_GUIDELINES.md)
- [`docs/audits/AUDIT_OWNERSHIP_SECURITY.md`](./docs/audits/AUDIT_OWNERSHIP_SECURITY.md)
- [`docs/plans/RENCANA_PERBAIKAN_DETAIL.md`](./docs/plans/RENCANA_PERBAIKAN_DETAIL.md)

## Kebijakan Dokumentasi

README hanya dipertahankan di:

- `README.md` pada root project.
- `docs/README.md` pada folder dokumentasi.

README di folder `frontend` dan `backend` sudah dihapus dan tidak dibuat ulang. Detail frontend/backend dirangkum di README ini dan dokumen audit pada folder `docs`.

## Eksternal API yang Digunakan

1. **LocationIQ API**: geocoding dan reverse geocoding melalui backend proxy.
2. **Midtrans API**: payment gateway untuk pembayaran digital dan webhook notifikasi status.
3. **Cloudinary API**: penyimpanan gambar profil, properti, kamar, dan bukti transfer.
4. **Supabase PostgreSQL**: database relasional utama melalui Prisma ORM.
5. **Google OAuth API**: social sign-in/sign-up untuk user dan tenant.
6. **SMTP Nodemailer**: email verifikasi, reset password, perubahan email, dan reminder check-in.

## Fitur 1 - Property Renting Core

| Requirement                                       | Status  | Folder/file terkait                                                                                                                                                        |
| ------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Homepage/Landing page                             | Selesai | `frontend/src/pages/user/HomePage.tsx`, `frontend/src/components/user/HeroSection.tsx`, `frontend/src/components/user/SearchForm.tsx`                                      |
| Search destination, date, guest, price, amenities | Selesai | `frontend/src/components/user/search/`, `frontend/src/components/user/propertyFilterDropdown/`, `frontend/src/stores/filterStore.ts`, `backend/src/services/propertyList/` |
| Explore property list                             | Selesai | `frontend/src/pages/user/ExplorePage.tsx`; desktop memakai sidebar search/filter/sort, mobile memakai panel filter                                                         |
| Sort dan pagination properti                      | Selesai | `backend/src/services/propertyService.ts`, `backend/src/services/propertyPriceSortService.ts`, `frontend/src/pages/user/home/`                                             |
| Auth/register/verify/login/logout                 | Selesai | `frontend/src/pages/auth/`, `frontend/src/hooks/auth/`, `backend/src/routes/authRoutes.ts`, `backend/src/services/authService.ts`                                          |
| Profile USER/TENANT                               | Selesai | `frontend/src/pages/user/ProfilePage.tsx`, `frontend/src/components/user/profile/`, `backend/src/routes/userRoutes.ts`, `backend/src/services/userService.ts`              |
| Property detail, gallery, map, facilities, review | Selesai | `frontend/src/pages/user/PropertyDetailPage.tsx`, `frontend/src/components/property/`, `backend/src/services/propertyDetailService.ts`                                     |
| Public calendar dan availability                  | Selesai | `frontend/src/components/property/`, `frontend/src/services/availabilityService.ts`, `backend/src/services/publicAvailabilityService.ts`                                   |
| Tenant property CRUD                              | Selesai | `frontend/src/pages/tenant/PropertiesListPage.tsx`, `frontend/src/pages/tenant/PropertyFormPage.tsx`, `backend/src/services/tenantPropertyService.ts`                      |
| Tenant room CRUD dan room images                  | Selesai | `frontend/src/pages/tenant/RoomsPage.tsx`, `frontend/src/components/tenant/room-form/`, `backend/src/services/tenantRoomService.ts`                                        |
| Tenant category management                        | Selesai | `frontend/src/pages/tenant/CategoriesPage.tsx`, `backend/src/services/categoryService.ts`                                                                                  |
| Peak season management                            | Selesai | `frontend/src/pages/tenant/PeakSeasonPage.tsx`, `backend/src/services/pricing/`, `backend/src/services/tenantRoom/`                                                        |

## Fitur 2 - Transaction, Review, Report

| Requirement                                   | Status  | Folder/file terkait                                                                                                                     |
| --------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| User booking flow                             | Selesai | `frontend/src/pages/user/BookingPage.tsx`, `backend/src/routes/orderRoutes.ts`, `backend/src/services/orderService.ts`                  |
| Payment manual dan Midtrans                   | Selesai | `frontend/src/components/user/PaymentMethodSelector.tsx`, `frontend/src/lib/midtransSnap.ts`, `backend/src/services/midtransService.ts` |
| Payment proof 1 jam                           | Selesai | `backend/src/constants/orderConstants.ts`, `backend/src/cron/`                                                                          |
| Tenant transaction management                 | Selesai | `frontend/src/pages/tenant/OrdersPage.tsx`, `backend/src/services/orderService.ts`                                                      |
| Auto-cancel unpaid reservations               | Selesai | `backend/src/cron/cronScheduler.ts`, `backend/src/cron/cronTasks.ts`, `ENABLE_CRON=true`                                                |
| Review setelah menginap                       | Selesai | `frontend/src/pages/user/UserReviewsPage.tsx`, `backend/src/services/reviewService.ts`                                                  |
| Tenant reply/delete review dan rating summary | Selesai | `frontend/src/pages/tenant/ReviewsPage.tsx`, `frontend/src/pages/tenant/reviews/`, `backend/src/services/tenantReviewService.ts`        |
| Laporan pendapatan                            | Selesai | `frontend/src/pages/tenant/ReportsPage.tsx`, `backend/src/services/tenantReport/`                                                       |
| Laporan properti dan okupasi kamar            | Selesai | `frontend/src/pages/tenant/PropertyReportPage.tsx`, `frontend/src/pages/tenant/OccupancyPage.tsx`                                       |

## Struktur Project

```text
final-pro-a2/
  backend/
    prisma/
      migrations/
      scripts/
      seed/
      schema.prisma
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
    server.ts
  docs/
    audits/
    guidelines/
    plans/
    README.md
  frontend/
    src/
      assets/
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
    audit-function-length.js
  README.md
```

## Tech Stack

Frontend:

- React 19, Vite, TypeScript, React Router 7
- Tailwind CSS 4
- Zustand
- React Hook Form dan Zod
- Recharts
- React Day Picker
- Lucide React
- Leaflet/React Leaflet
- Google OAuth client

Backend:

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- Supabase PostgreSQL
- Cloudinary
- Midtrans
- Nodemailer
- node-cron
- Zod
- express-rate-limit

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
- `ENABLE_CRON`
- `ALLOWED_ORIGINS`
- `FRONTEND_URL`
- `LOCATIONIQ_API_KEY`

Frontend:

- `VITE_API_BASE_URL`
- `VITE_APP_NAME`
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_MIDTRANS_CLIENT_KEY`

## Database dan Seed

```bash
cd backend
npx prisma db seed
```

Untuk melengkapi fasilitas properti existing tanpa menghapus data:

```bash
cd backend
npm run backfill:amenities
```

Mode apply membutuhkan environment:

```bash
set APPLY_AMENITIES=true
npm run backfill:amenities
```

Pastikan koneksi database mengarah ke Supabase yang benar sebelum menjalankan script yang menulis data.

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

## Deployment

Backend sebaiknya dideploy sebagai persistent Node.js process, bukan serverless, karena aplikasi membutuhkan:

- Long-running Express API server.
- Booking management.
- Scheduled tasks untuk auto-cancel unpaid reservations.
- Auto-complete order setelah checkout.
- Authentication dan role management.
- Upload file ke Cloudinary.

Frontend dapat dideploy sebagai static Vite app. Backend harus memiliki environment production, CORS production, dan `ENABLE_CRON=true` pada platform yang mendukung persistent process seperti Render, Railway, VPS, atau layanan setara.

## Catatan Final

Project memiliki fondasi fitur utama yang lengkap dan verifikasi teknis terakhir lulus. Seluruh rencana aktif berdasarkan UAT browser terbaru pada 07 Juni 2026 telah selesai dieksekusi, termasuk penyempurnaan UI/UX voucher, pembatasan diskon, mode sewa properti, validasi tamu, serta notifikasi penolakan pembayaran. Proyek ini sekarang dapat diklaim final. Sisa rencana opsional jangka panjang tetap tersedia di [`docs/plans/RENCANA_PERBAIKAN_DETAIL.md`](./docs/plans/RENCANA_PERBAIKAN_DETAIL.md).
