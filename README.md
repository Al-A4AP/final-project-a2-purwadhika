# PURWALOKA - Property Renting Web App

PURWALOKA adalah aplikasi web penyewaan properti untuk menghubungkan penyewa (`USER`) dan pemilik properti (`TENANT`). Aplikasi mendukung pencarian properti, pengecekan harga dan ketersediaan kamar, booking, pembayaran manual/Midtrans, dashboard tenant, laporan penjualan, laporan properti, voucher, serta review setelah masa inap.

Final Project Purwadhika JCWDBGPM-11, Group 1:

- Muhammad Ali Akbar - Fitur 1
- Anggita Zahra Kamila - Fitur 2

## Live Deployment

- Frontend: [https://final-project-a2-purwadhika-fronten.vercel.app](https://final-project-a2-purwadhika-fronten.vercel.app)
- Backend API: [https://final-project-a2-purwadhika-backend.vercel.app](https://final-project-a2-purwadhika-backend.vercel.app)

## Features

### User

- Registrasi, verifikasi email, login, logout, reset password, dan login Google.
- Pencarian properti berdasarkan kota, tanggal, jumlah tamu, kategori, fasilitas, harga, dan sorting.
- Detail properti dengan galeri, peta lokasi, fasilitas, kamar, harga, availability, dan review.
- Booking dibuat saat user menekan `Lanjut ke Pembayaran` pada tahap tinjauan.
- Pembayaran via Midtrans atau transfer manual.
- Voucher aktif: `PERCENTAGE` dan `FREE_NIGHTS`.
- Riwayat reservasi, properti tersimpan, profile, dan review setelah checkout.
- Love/properti tersimpan hanya tersedia untuk authenticated USER; GUEST dan TENANT tidak menerima kontrol love.

### Tenant

- Dashboard tenant dengan ringkasan operasional.
- CRUD kategori, properti, kamar, ketersediaan, dan peak season; kategori shared dengan limit 5 kategori milik sendiri per tenant.
- Manajemen voucher tenant.
- Manajemen reservasi dan konfirmasi pembayaran manual.
- Laporan pendapatan, laporan properti, dan kalender ketersediaan.
- Review tamu, balasan review, dan penghapusan review sesuai ownership.
- Brand PURWALOKA pada sidebar tenant dapat diklik untuk kembali ke homepage.

## Feature Status PURWADHIKA

### Fitur 1 - Property Renting Core

| Requirement | Status | Folder/file utama |
| --- | --- | --- |
| Homepage / landing page | Tersedia | `frontend/src/pages/user/HomePage.tsx`, `frontend/src/components/user/` |
| Navbar, hero carousel, property list, footer | Tersedia; brand PURWALOKA menuju home | `frontend/src/components/layout/`, `frontend/src/components/user/`, `frontend/src/pages/user/home/` |
| Search kota, tanggal, durasi/tamu | Tersedia | `frontend/src/components/user/search/`, `frontend/src/hooks/user/explore/` |
| Explore property list dengan pagination/filter/sort | Tersedia | `frontend/src/pages/user/ExplorePage.tsx`, `backend/src/services/propertyList/` |
| Auth user dan tenant | Tersedia | `frontend/src/pages/auth/`, `frontend/src/hooks/auth/`, `backend/src/routes/authRoutes.ts` |
| Email verification dan set password | Tersedia | `frontend/src/pages/auth/VerifyEmailPage.tsx`, `backend/src/services/authService.ts` |
| Login, logout, reset password, Google auth | Tersedia | `frontend/src/pages/auth/`, `backend/src/controllers/authController.ts` |
| Profile user dan tenant | Tersedia | `frontend/src/pages/user/ProfilePage.tsx`, `frontend/src/components/user/profile/`, `backend/src/services/userService.ts` |
| Property detail, kamar, harga, availability, review | Tersedia | `frontend/src/pages/user/PropertyDetailPage.tsx`, `frontend/src/components/property/`, `backend/src/services/propertyDetailService.ts` |
| Tenant category CRUD | Tersedia; shared, owner-only mutation, max 5 kategori milik sendiri | `frontend/src/pages/tenant/CategoriesPage.tsx`, `backend/src/services/categoryService.ts` |
| Tenant property CRUD | Tersedia | `frontend/src/pages/tenant/PropertiesListPage.tsx`, `frontend/src/pages/tenant/PropertyFormPage.tsx`, `backend/src/services/tenantPropertyService.ts` |
| Tenant room CRUD | Tersedia | `frontend/src/pages/tenant/RoomsPage.tsx`, `backend/src/services/tenantRoomService.ts` |
| Room availability management | Tersedia | `frontend/src/components/tenant/OccupancyCalendar.tsx`, `backend/src/services/availabilityService.ts` |
| Peak season rate management | Tersedia | `frontend/src/pages/tenant/PeakSeasonPage.tsx`, `backend/src/services/tenantRoom/` |
| Tenant sales report | Tersedia | `frontend/src/pages/tenant/ReportsPage.tsx`, `backend/src/services/tenantReportService.ts` |

### Fitur 2 - Transaction, Review, Report

| Requirement | Status | Folder/file utama |
| --- | --- | --- |
| Room reservation | Tersedia | `frontend/src/pages/user/BookingPage.tsx`, `backend/src/services/orderService.ts` |
| Inventory lock dan double booking guard | Tersedia, perlu QA concurrency manual | `backend/src/services/order/bookingLocks.ts`, `backend/src/services/availabilityService.ts` |
| Manual payment proof upload | Tersedia | `frontend/src/pages/user/booking/ManualProofUpload.tsx`, `backend/src/services/orderService.ts` |
| Midtrans payment | Tersedia | `frontend/src/lib/midtransSnap.ts`, `backend/src/services/midtransService.ts` |
| User order list dan detail | Tersedia | `frontend/src/pages/user/OrdersPage.tsx`, `frontend/src/pages/user/BookingDetailPage.tsx` |
| User cancel unpaid order | Tersedia | `backend/src/services/order/userCancelOrder.ts`, `frontend/src/pages/user/orders/` |
| Auto cancel unpaid order | Tersedia | `backend/src/cron/cronTasks.ts`, `backend/src/cron/cronQueries.ts` |
| Tenant order list | Tersedia | `frontend/src/pages/tenant/OrdersPage.tsx`, `backend/src/services/order/tenantOrderList.ts` |
| Tenant confirm/reject manual payment | Tersedia | `backend/src/services/order/tenantOrderStatus.ts`, `frontend/src/hooks/tenant/orders/` |
| Order reminder/email notification | Tersedia | `backend/src/utils/emailService.ts`, `backend/src/utils/emailContent/` |
| Review setelah checkout | Tersedia | `frontend/src/pages/user/UserReviewsPage.tsx`, `backend/src/services/reviewService.ts` |
| Tenant reply/delete review | Tersedia | `frontend/src/pages/tenant/ReviewsPage.tsx`, `backend/src/services/tenantReviewService.ts` |
| Sales report | Tersedia | `frontend/src/pages/tenant/ReportsPage.tsx`, `backend/src/services/tenantReport/` |
| Property report / occupancy calendar | Tersedia | `frontend/src/pages/tenant/PropertyReportPage.tsx`, `frontend/src/components/tenant/occupancy-calendar/` |

## Tech Stack

Frontend:

- React 19
- Vite
- TypeScript
- Tailwind CSS
- React Router
- React Hook Form
- Zod
- Zustand
- Recharts
- Leaflet / React Leaflet
- Axios

Backend:

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- Supabase PostgreSQL
- Cloudinary
- Midtrans
- Nodemailer
- Zod
- Cookie-based JWT auth

## Architecture Summary

Backend adalah source of truth untuk auth, role access, ownership, booking, availability, payment, voucher, review, status order, dan validasi final. Frontend bertanggung jawab sebagai presentation dan orchestration layer untuk UI, form, route guard, modal, toast, dan client-side UX guard.

Order dibuat pada tahap `Lanjut ke Pembayaran`, kemudian status awal menjadi `WAITING_PAYMENT` dan inventory dikunci. `WAITING_PAYMENT` berlaku 1 jam. Transfer manual yang sudah upload bukti menjadi `WAITING_CONFIRMATION` dan wajib dikonfirmasi tenant maksimal 2 jam. Sistem memiliki auto-cancel via cron, advisory lock untuk mengurangi risiko double booking, dan persistent token blacklist untuk logout multi-instance.

## Folder Structure

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
      constants/
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

## Installation

Install dependencies dari root workspace:

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

## Environment Variables

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

## Build and Test Commands

Root:

```bash
npm run audit:functions
```

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

Backend:

```bash
cd backend
npm run build
npm run test:ownership
```

## Current Project Status

Status dokumentasi terakhir: 19 Juni 2026.

- Frontend lint dan build terakhir lulus.
- Backend build dan ownership test terakhir lulus (10/10).
- File source aktif `frontend/src` dan `backend/src` saat ini tidak melewati 200 baris.
- Function-length audit adalah alat bantu advisory, bukan blocker build; snapshot terbaru 101 kandidat.
- Dokumentasi audit, rencana perbaikan, dan handover tersedia di folder [`docs`](./docs/README.md).
