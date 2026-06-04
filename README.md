# PURWALOKA - Property Renting Web App

PURWALOKA adalah aplikasi web penyewaan properti untuk menghubungkan penyewa
(`USER`) dan pemilik properti (`TENANT`). Aplikasi mencakup pencarian properti,
detail harga dan ketersediaan kamar, pemesanan, pembayaran manual/Midtrans,
dashboard tenant, laporan penjualan, serta review setelah masa inap.

Final Project Purwadhika JCWDBGPM-11, Group 1:

- Muhammad Ali Akbar - Fitur 1
- Anggita Zahra Kamila - Fitur 2

## Status Audit Terakhir

Audit Final dilakukan pada 03 Juni 2026 pukul 21:30 WIB dengan acuan
`PURWADHIKA.md` dan `REST_API_GUIDELINES.md`. Laporan detail ada di `AUDIT_PURWADHIKA`
dan `AUDIT_CLEANCODE_REST.md`.

| Area                       | Status              | Catatan                                                                                                                        |
| -------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Fitur utama                | Selesai             | Seluruh 11 fitur utama PURWADHIKA.md telah terimplementasi penuh.                                                              |
| Fitur 1                    | Selesai             | Auth/profile, katalog properti, property detail, tenant property/room/category management, dan public calendar sudah tersedia. |
| Fitur 2                    | Selesai             | Alur transaksi, konfirmasi tenant (pop-up verified), review, dan report sudah tersedia lengkap.                                |
| Batas file 200 baris       | Sesuai              | Scan: 0 file di backend maupun frontend yang melampaui 200 baris.                                                              |
| Function maksimal 15 baris | Sesuai              | Seluruh 11 fungsi logika bisnis di backend telah di-refactor mematuhi batas maksimal 15 baris.                                 |
| Log production             | Sesuai              | Scan: 0 baris `console.log` aktif di seluruh `backend/src` dan `frontend/src`.                                                |
| Frontend lint              | Lulus               | `npm run lint` dan `npm run build` selesai tanpa error; exit code 0.                                                           |
| TypeScript no emit         | Lulus               | `tsc -b` backend dan frontend selesai tanpa error.                                                                             |
| Pop-up konfirmasi tenant   | Selesai             | `TenantOrdersConfirmModal.tsx` menggunakan `ConfirmModal` sebelum setiap perubahan status order.                               |
| REST API Naming & Format   | Lulus               | Seluruh endpoint non-RESTful & alias route telah didepresiasi; standardisasi response `sendSuccess` selesai 100%.              |
| UI/UX & Security           | Lulus               | Identitas visual *Deep Slate*, *Azure Allure*, font *Geomanist*. Keamanan rahasia Frontend (secrets) terjamin aman.            |
| Test suite                 | Belum ada           | Backend `npm test` masih placeholder.                                                                                          |

Laporan lengkap tersedia di
[`AUDIT_PURWADHIKA`](./AUDIT_PURWADHIKA) dan [`AUDIT_CLEANCODE_REST.md`](./AUDIT_CLEANCODE_REST.md).

## Eksternal API yang Digunakan

Proyek ini mengintegrasikan beberapa layanan API eksternal untuk mendukung fungsionalitas utama:

1. **LocationIQ API**: Digunakan untuk fitur geocoding otomatis. API ini mengubah input alamat teks properti menjadi koordinat latitude/longitude di halaman pengelolaan properti oleh Tenant, sekaligus menyajikan visualisasi koordinat di peta interaktif Leaflet.
2. **Midtrans API (Payment Gateway)**: Digunakan untuk memproses transaksi digital. Mendukung snap popup checkout di sisi Frontend dan webhook notification handler di sisi Backend untuk pencatatan status pembayaran secara real-time.
3. **Cloudinary API (Cloud Storage)**: Digunakan untuk mengunggah dan menyimpan file media (seperti foto profil pengguna, foto galeri properti, foto kamar, serta gambar bukti transfer pembayaran manual).
4. **Supabase (PostgreSQL)**: Berperan sebagai Database Relasional awan untuk menyimpan seluruh entitas data transaksi, user, tenant, properti, dan log sistem.
5. **Google OAuth API**: Digunakan sebagai penyedia otentikasi sekali klik (social sign-in/sign-up) untuk mempermudah pendaftaran user/tenant.
6. **SMTP Nodemailer**: Digunakan untuk mengirimkan email sistem secara terprogram, seperti email verifikasi aktivasi akun baru, email perubahan verifikasi email, email reset password, serta email reminder check-in otomatis pada H-1.

---

## Fitur 1 - Property Renting Core

| Requirement                                          | Status  | Folder/file terkait                                                                                                                                                                                                                                              |
| ---------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Homepage/Landing page                                | Selesai | `frontend/src/pages/user/HomePage.tsx`, `frontend/src/components/user/HeroSection.tsx`, `frontend/src/components/user/PropertyGrid.tsx`, `frontend/src/components/common/Navbar.tsx`                                                                             |
| Search destination, date, guest, price, amenities    | Selesai | `frontend/src/components/user/SearchForm.tsx`, `frontend/src/components/user/propertyFilterDropdown/`, `frontend/src/stores/filterStore.ts`, `backend/src/services/propertyQueryService.ts`                                                                      |
| Sort dan pagination properti                         | Selesai | `frontend/src/pages/user/HomePage.tsx`, `backend/src/services/propertyService.ts`, `backend/src/services/propertyPriceSortService.ts`; sort name/created_at dan price tanpa tanggal diproses server-side, price bertanggal memakai availability/pricing dinamis. |
| Auth, register, verify email, login, logout          | Selesai | `frontend/src/pages/auth/`, `frontend/src/stores/authStore.ts`, `backend/src/controllers/authController.ts`, `backend/src/services/authService.ts`, `backend/src/routes/authRoutes.ts`                                                                           |
| Profile USER/TENANT                                  | Selesai | `frontend/src/pages/user/ProfilePage.tsx`, `frontend/src/components/user/profile/`, route `/users/me` dan `/tenants/me`, `backend/src/controllers/userController.ts`, `backend/src/services/userService.ts`, `backend/src/services/userEmailService.ts`      |
| Property detail, gallery, facilities, review display | Selesai | `frontend/src/pages/user/PropertyDetailPage.tsx`, `frontend/src/components/property/`, `backend/src/services/propertyService.ts`                                                                                                                                 |
| Public calendar dan availability                     | Selesai | `frontend/src/components/property/PricingCalendarSection.tsx`, `frontend/src/services/availabilityService.ts`, `backend/src/services/publicAvailabilityService.ts`; backend membatasi maksimal 90 hari per request.                                              |
| Tenant property CRUD                                 | Selesai | `frontend/src/pages/tenant/PropertiesListPage.tsx`, `frontend/src/pages/tenant/PropertyFormPage.tsx`, `backend/src/services/tenantPropertyService.ts`, `backend/src/routes/tenantRoutes.ts`                                                                      |
| Tenant room CRUD, images, availability, peak rates   | Selesai | `frontend/src/pages/tenant/RoomsPage.tsx`, `frontend/src/components/tenant/RoomForm.tsx`, `frontend/src/components/tenant/RoomPeakRatesModal.tsx`, `backend/src/services/tenantRoomService.ts`                                                                   |
| Tenant category management                           | Selesai | `frontend/src/pages/tenant/CategoriesPage.tsx`, `frontend/src/components/tenant/category/`, `backend/src/controllers/categoryController.ts`, `backend/src/routes/tenantRoutes.ts`                                                                                |

## Fitur 2 - Transaction, Review, Report

| Requirement                                     | Status                 | Folder/file terkait                                                                                                                                                                                      |
| ----------------------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| User booking flow                               | Selesai                | `frontend/src/pages/user/BookingPage.tsx`, `frontend/src/components/user/BookingSummary.tsx`, `backend/src/services/orderService.ts`, `backend/src/routes/orderRoutes.ts`                                |
| Payment manual dan Midtrans                     | Selesai dengan catatan | `frontend/src/components/user/PaymentMethodSelector.tsx`, `frontend/src/services/orderService.ts`, `backend/src/services/midtransService.ts`, `backend/src/config/midtrans.ts`; perlu E2E test Midtrans. |
| Payment proof 1 jam                             | Selesai                | `backend/src/constants/orderConstants.ts` menggunakan `60 * 60 * 1000`.                                                                                                                                  |
| Tenant transaction management                   | Selesai                | `frontend/src/pages/tenant/OrdersPage.tsx`, `frontend/src/components/tenant/OrdersTable.tsx`, `frontend/src/components/tenant/OrderMobileCard.tsx`, `backend/src/services/orderService.ts`               |
| Auto-cancel unpaid reservations                 | Selesai                | `backend/src/cron.ts`, `backend/src/services/orderService.ts`, `ENABLE_CRON=true` untuk persistent process.                                                                                              |
| Auto-complete processed orders setelah checkout | Selesai                | `backend/src/cron.ts` mengubah `PROCESSED` menjadi `COMPLETED` setelah checkout.                                                                                                                         |
| Review setelah menginap                         | Selesai                | `frontend/src/pages/user/OrdersPage.tsx`, `frontend/src/components/user/ReviewModal.tsx`, `backend/src/services/reviewService.ts`; `PROCESSED` dengan checkout terlewat juga boleh review.               |
| Tenant reply review                             | Selesai                | `frontend/src/pages/tenant/ReviewsPage.tsx`, `backend/src/services/tenantReviewService.ts`                                                                                                               |
| Report dan analytics tenant                     | Selesai                | `frontend/src/pages/tenant/ReportsPage.tsx`, `frontend/src/pages/tenant/DashboardPage.tsx`, `backend/src/services/tenantReportService.ts`                                                                |

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
      middlewares/
      routes/
      services/
      types/
      utils/
      validations/
    server.ts
    README-BACKEND.md
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
    README-FRONTEND.md
  PURWADHIKA.md
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

Install dependency backend:

```bash
cd backend
npm install
```

Siapkan environment backend dari `backend/.env.example`, lalu jalankan:

```bash
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Install dependency frontend:

```bash
cd frontend
npm install
```

Siapkan environment frontend dari `frontend/.env.example`, lalu jalankan:

```bash
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

Frontend:

- `VITE_API_BASE_URL`
- `VITE_APP_NAME`
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_LOCATIONIQ_API_KEY`
- `VITE_MIDTRANS_CLIENT_KEY`

Catatan audit: `frontend/.env.example` saat ini belum mencantumkan
`VITE_MIDTRANS_CLIENT_KEY`, sementara `BookingPage.tsx` memakai variabel ini
untuk memuat Midtrans Snap.

## Database dan Seed

Perintah seed akan mengisi ulang data dummy sesuai script Prisma:

```bash
```bash
cd backend
npx prisma db seed
```

Untuk melengkapi fasilitas properti existing tanpa menghapus data, gunakan script
backfill yang sudah tersedia:

```bash
cd backend
npm run backfill:amenities
```

Mode apply membutuhkan environment:

```bash
set APPLY_AMENITIES=true
npm run backfill:amenities
```

Pastikan koneksi database mengarah ke Supabase yang benar sebelum menjalankan
script yang menulis data.

## Deployment

Backend sebaiknya dideploy sebagai persistent Node.js process, bukan serverless,
karena aplikasi membutuhkan:

- Long-running Express API server
- Booking management
- Scheduled tasks untuk auto-cancel unpaid reservations
- Auto-complete order setelah checkout
- Authentication dan role management
- Upload file ke Cloudinary

Frontend dapat dideploy sebagai static Vite app. Backend harus memiliki
environment production, CORS production, dan `ENABLE_CRON=true` pada platform
yang mendukung persistent process seperti Render, Railway, VPS, atau layanan
setara.
