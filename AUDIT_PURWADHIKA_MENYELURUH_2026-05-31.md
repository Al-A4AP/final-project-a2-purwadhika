# Audit Menyeluruh PURWADHIKA - PURWALOKA

Tanggal audit: 31 Mei 2026  
Project: `final-pro-a2`  
Acuan utama: `PURWADHIKA.md`  
Scope: `backend/`, `frontend/`, `backend/prisma/`, konfigurasi package,
route, service, validasi, dan smoke test runtime lokal.

## Batasan Audit

- Audit ini tidak mengubah source code aplikasi.
- File yang dibuat pada audit ini hanya laporan baru:
  `AUDIT_PURWADHIKA_MENYELURUH_2026-05-31.md`.
- Build production tidak dijalankan karena dapat membuat artefak `dist`.
- Seed tidak dijalankan agar data Supabase tidak berubah.
- Migration tidak dijalankan ulang; yang dilakukan hanya `prisma migrate status`.

## Ringkasan Eksekutif

Secara keseluruhan, project sudah memenuhi mayoritas requirement
`PURWADHIKA.md` untuk Property Renting Web App. Fitur utama USER dan TENANT
sudah tersedia: auth, role separation, profile, katalog properti, detail
properti, calendar availability, booking, payment manual/Midtrans, tenant
property/room/category management, order management, review, reply review,
report, dan cron.

Status akhir audit:

| Area | Status | Catatan |
| --- | --- | --- |
| Fitur 1 | Sesuai | Requirement utama sudah tersedia di frontend dan backend. |
| Fitur 2 | Sesuai dengan catatan | Alur utama tersedia; automated/E2E test belum ada. |
| TypeScript backend | Lulus | `backend/node_modules/.bin/tsc.cmd --noEmit`. |
| TypeScript frontend | Lulus | `frontend/node_modules/.bin/tsc.cmd -b --noEmit`. |
| Lint frontend | Lulus | `npm.cmd run lint` di frontend. |
| Runtime backend | Lulus | `/api/health` dan `/api/properties` mengembalikan 200. |
| Runtime frontend | Lulus | Vite root `http://127.0.0.1:5173/` mengembalikan 200. |
| Prisma migration | Sesuai | 6 migration terdeteksi, database schema up to date. |
| File maksimal 200 baris | Sesuai | Tidak ada file TS/TSX sumber yang > 200 baris. |
| Log/debug production | Sesuai | Tidak ditemukan `console.*` atau `debugger` di TS/TSX. |
| Function maksimal 15 baris | Belum sesuai penuh | Scan heuristik menemukan 165 kandidat fungsi/komponen/hook > 15 baris. |
| Automated test | Belum tersedia | Backend `npm test` masih placeholder dan exit 1. |

## Pemeriksaan yang Dilakukan

| Pemeriksaan | Hasil |
| --- | --- |
| `git status --short` awal | Menunjukkan `D AUDIT_PURWADHIKA_FINAL_REPORT.md`; audit ini tidak memulihkan atau mengubah file tersebut. |
| Jumlah file TS/TSX sumber | 209 file di `frontend/src`, `backend/src`, dan `backend/prisma`. |
| File > 200 baris | Tidak ada. |
| `console.log/debug/info/warn/error` | Tidak ditemukan. |
| `debugger` | Tidak ditemukan. |
| `TODO`, `FIXME`, `XXX` | Tidak ditemukan pada file TS/TSX/MD yang dicek. |
| Backend TypeScript | Lulus tanpa error. |
| Frontend TypeScript | Lulus tanpa error. |
| Frontend lint | Lulus tanpa error. |
| Backend test | Gagal karena script placeholder: `Error: no test specified`. |
| Backend health | `HEALTH=200`. |
| Backend property endpoint | `PROPERTIES=200`, `ITEMS=4`, `TOTAL=8`. |
| Frontend root | `FRONTEND=200`. |
| Prisma migration status | `Database schema is up to date!`. |

Catatan: smoke test backend dan migration status membutuhkan akses ke Supabase.
Pemeriksaan dijalankan dengan izin network/DB agar hasil audit tidak tertukar
dengan batasan sandbox.

## Standardization

| Requirement PURWADHIKA | Status | Penjelasan |
| --- | --- | --- |
| Semua input divalidasi client/server | Mayoritas sesuai | Backend memakai Zod di `backend/src/validations/`; frontend memakai Zod dan React Hook Form pada form utama. |
| File upload divalidasi extension/size | Sesuai | Avatar JPG/JPEG/PNG/GIF 1MB; payment proof JPG/JPEG/PNG 1MB. |
| Proses krusial ada approval | Mayoritas sesuai | Delete/action penting memakai modal/konfirmasi pada alur utama; tetap perlu QA manual semua flow destructive. |
| List memakai pagination/filter/sort | Mayoritas sesuai | Property, order, report, category memakai filter/sort/pagination. |
| Processing list di server | Mayoritas sesuai | Query utama diproses backend; sort rating/popularity masih in-memory setelah query kandidat. |
| Responsive mobile/web | Mayoritas sesuai | Tenant mobile topbar/sidebar, mobile card order, responsive grid/form tersedia. Perlu QA visual manual. |
| REST API sesuai role | Sesuai | Route memakai `/api/auth`, `/api/properties`, `/api/orders`, `/api/users`, `/api/tenant`, review routes. |
| Authorization route | Sesuai | `requireAuth`, `requireRole`, `ProtectedRoute`, ownership middleware, dan token blacklist tersedia. |
| File maksimal 200 baris | Sesuai | Scan menghasilkan `OVER_200=0`. |
| Log tidak terpakai dibersihkan | Sesuai | Tidak ditemukan console/debug aktif di TS/TSX. |
| Unused code dibersihkan | Perlu audit lanjutan | Frontend lint lulus, tetapi backend belum punya lint/dead-code checker. |
| Function maksimal 15 baris | Belum sesuai penuh | 165 kandidat fungsi/komponen/hook > 15 baris menurut scan heuristik. |

## Feature 1 - Audit Detail

### Homepage / Landing Page

Status: sesuai.

Bukti:

- `frontend/src/pages/user/HomePage.tsx`
- `frontend/src/components/user/HeroSection.tsx`
- `frontend/src/components/common/Navbar.tsx`
- `frontend/src/components/common/Footer.tsx`
- `frontend/src/components/user/PropertyGrid.tsx`
- `frontend/src/components/user/SearchForm.tsx`

Catatan:

- Homepage sudah memiliki hero, navigasi, search/filter, sort bar, property
  grid, dan pagination.
- Default property list sudah diarahkan ke properti terbaru.
- Visual mobile tetap perlu QA manual karena audit ini tidak menjalankan
  Playwright/screenshot.

### User / Tenant Authorization

Status: sesuai.

Bukti:

- `frontend/src/router/ProtectedRoute.tsx`
- `frontend/src/components/layout/AuthNoticeHandler.tsx`
- `frontend/src/components/property/BookingAccessNotice.tsx`
- `backend/src/middlewares/authMiddleware.ts`
- `backend/src/middlewares/ownershipMiddleware.ts`

Penjelasan:

- USER dan TENANT dipisahkan dengan route guard.
- User/tenant yang belum login atau belum verified diarahkan dan diberi notice.
- Booking UI dibuat disabled/terhalang untuk user belum login atau belum
  verified.
- Tenant hanya dapat mengakses data miliknya melalui ownership middleware.

### Registration, Email Verification, Login

Status: sesuai.

Bukti:

- `frontend/src/pages/auth/UserRegisterPage.tsx`
- `frontend/src/pages/auth/TenantRegisterPage.tsx`
- `frontend/src/pages/auth/UserLoginPage.tsx`
- `frontend/src/pages/auth/TenantLoginPage.tsx`
- `frontend/src/pages/auth/VerifyEmailPage.tsx`
- `backend/src/services/authService.ts`
- `backend/src/services/authGoogleService.ts`
- `backend/src/routes/authRoutes.ts`

Penjelasan:

- Halaman login/register USER dan TENANT sudah terpisah.
- Registrasi email tidak meminta password awal.
- Verifikasi email sekaligus set password memakai token dan expiry 1 jam.
- Resend verification tersedia.
- Google login/register sudah role-aware.
- Akun dengan role berbeda tidak dapat dipakai silang.

### Reset Password

Status: sesuai.

Bukti:

- `frontend/src/pages/auth/ForgotPasswordPage.tsx`
- `frontend/src/pages/auth/ResetPasswordPage.tsx`
- `backend/src/services/authService.ts`
- `backend/prisma/schema.prisma`

Penjelasan:

- Reset password memiliki request page dan confirm reset page.
- Token reset hanya bisa dipakai sekali karena `used_at`.
- Reset password dibatasi untuk akun `auth_provider = EMAIL` dengan
  `password_set_at`.
- Akun Google/social tidak diberi akses reset password aplikasi.

### User Profile

Status: sesuai.

Bukti:

- `frontend/src/pages/user/ProfilePage.tsx`
- `frontend/src/components/user/profile/`
- `backend/src/services/userService.ts`
- `backend/src/services/userEmailService.ts`
- `backend/src/routes/userRoutes.ts`

Penjelasan:

- User/Tenant dapat melihat dan mengubah profil.
- Avatar divalidasi JPG/JPEG/PNG/GIF maksimal 1MB.
- Ubah password tersedia untuk akun email/password.
- Ubah email memakai `pending_email` dan wajib verifikasi ulang melalui token
  khusus email change.

### Property Catalog & Search

Status: sesuai dengan catatan optimasi.

Bukti:

- `frontend/src/pages/user/HomePage.tsx`
- `frontend/src/components/user/propertyFilterDropdown/`
- `frontend/src/stores/filterStore.ts`
- `backend/src/services/propertyService.ts`
- `backend/src/services/propertyQueryService.ts`
- `backend/src/services/propertyPriceSortService.ts`

Penjelasan:

- Filter by property name dan category tersedia.
- Filter city, date, guest/capacity, price, dan amenities tersedia.
- Pagination tersedia.
- Sort by name asc/desc tersedia.
- Sort by price asc/desc tersedia; tanpa date range memakai DB-side
  `MIN(room.base_price)`.
- Date range memakai backend availability dan dynamic pricing.
- Properti publik wajib memiliki minimal satu room aktif.

Catatan:

- Sort tambahan `rating` dan `popularity` masih diproses in-memory setelah query
  kandidat. Ini bukan blocker requirement utama, tetapi berisiko untuk dataset
  besar.

### Property Detail dan Public Calendar

Status: sesuai.

Bukti:

- `frontend/src/pages/user/PropertyDetailPage.tsx`
- `frontend/src/components/property/PricingCalendarSection.tsx`
- `frontend/src/components/property/PropertyGallery.tsx`
- `frontend/src/components/property/PropertyInfo.tsx`
- `frontend/src/components/property/RoomCard.tsx`
- `frontend/src/components/property/WholeUnitCard.tsx`
- `backend/src/services/propertyDetailService.ts`
- `backend/src/services/publicAvailabilityService.ts`

Penjelasan:

- Detail properti menampilkan gallery, kategori, alamat, deskripsi, fasilitas,
  review, dan room.
- Fasilitas tampil di property detail dan room card.
- Calendar menampilkan harga dan availability.
- Backend membatasi public calendar maksimal 90 hari per request.

### Tenant Property, Room, Availability, Peak Rate

Status: sesuai.

Bukti:

- `frontend/src/pages/tenant/PropertiesListPage.tsx`
- `frontend/src/pages/tenant/PropertyFormPage.tsx`
- `frontend/src/pages/tenant/RoomsPage.tsx`
- `frontend/src/components/tenant/RoomForm.tsx`
- `frontend/src/components/tenant/RoomAvailabilityModal.tsx`
- `frontend/src/components/tenant/RoomPeakRatesModal.tsx`
- `backend/src/services/tenantPropertyService.ts`
- `backend/src/services/tenantRoomService.ts`
- `backend/src/services/availabilityService.ts`
- `backend/src/routes/tenantRoutes.ts`

Penjelasan:

- Tenant dapat CRUD property.
- Property memiliki field name, category, description, picture, dan room.
- Tenant dapat CRUD room dengan room type, price, description, capacity, image.
- Tenant dapat set availability.
- Tenant dapat set peak rate nominal/persentase.
- Ownership middleware membatasi akses tenant ke property/room miliknya.

### Property Category Management

Status: sesuai.

Bukti:

- `frontend/src/pages/tenant/CategoriesPage.tsx`
- `frontend/src/components/tenant/category/CategoryForm.tsx`
- `frontend/src/components/tenant/category/CategoryList.tsx`
- `frontend/src/hooks/useTenantCategories.ts`
- `frontend/src/components/layout/tenantNavigation.ts`
- `backend/src/controllers/categoryController.ts`
- `backend/src/services/categoryService.ts`
- `backend/src/routes/tenantRoutes.ts`

Penjelasan:

- Tenant memiliki menu `Kategori`.
- Tenant dapat create, update, delete kategori.
- Halaman mendukung search, sort, pagination, loading state, empty state, dan
  confirm delete.
- Backend menolak delete kategori yang sedang dipakai property aktif.

## Feature 2 - Audit Detail

### Room Reservation dan Booking

Status: sesuai.

Bukti:

- `frontend/src/pages/user/BookingPage.tsx`
- `frontend/src/components/user/BookingSummary.tsx`
- `backend/src/services/orderService.ts`
- `backend/src/services/pricingService.ts`
- `backend/src/services/availabilityService.ts`

Penjelasan:

- Booking dibuat berdasarkan room, check-in, check-out, dan availability.
- Total harga memakai pricing service, termasuk peak rate.
- User belum verified ditolak oleh backend dan dicegah di UI.

### Upload Payment Proof

Status: sesuai.

Bukti:

- `frontend/src/components/user/OrderCard.tsx`
- `backend/src/controllers/orderController.ts`
- `backend/src/middlewares/uploadMiddleware.ts`
- `backend/src/constants/orderConstants.ts`

Penjelasan:

- Manual payment proof upload tersedia.
- Upload hanya untuk status `WAITING_PAYMENT`.
- Payment proof window adalah 1 jam:
  `PAYMENT_PROOF_WINDOW_MS = 60 * 60 * 1000`.
- File proof dibatasi JPG/JPEG/PNG maksimal 1MB.

### Midtrans Payment

Status: sesuai dengan catatan.

Bukti:

- `frontend/src/components/user/PaymentMethodSelector.tsx`
- `frontend/src/pages/user/BookingPage.tsx`
- `backend/src/services/midtransService.ts`
- `backend/src/config/midtrans.ts`
- `backend/src/routes/orderRoutes.ts`

Penjelasan:

- Payment method Midtrans tersedia.
- Backend membuat Snap transaction.
- Callback notification tersedia di `/api/orders/midtrans-notification`.

Catatan:

- Perlu E2E test Midtrans sandbox untuk memastikan semua status callback aman.
- `frontend/.env.example` belum mencantumkan `VITE_MIDTRANS_CLIENT_KEY`, padahal
  `BookingPage.tsx` memakai variabel tersebut untuk Snap script.

### Order List dan Cancel Order

Status: sesuai.

Bukti:

- `frontend/src/pages/user/OrdersPage.tsx`
- `frontend/src/components/user/OrderCard.tsx`
- `backend/src/services/userOrderService.ts`
- `backend/src/services/orderService.ts`

Penjelasan:

- User order list tersedia.
- Cancel order tersedia sebelum bukti pembayaran di-upload.
- Expired unpaid order otomatis dibatalkan oleh cron.

### Tenant Transaction Management

Status: sesuai.

Bukti:

- `frontend/src/pages/tenant/OrdersPage.tsx`
- `frontend/src/components/tenant/OrdersTable.tsx`
- `frontend/src/components/tenant/OrderMobileCard.tsx`
- `backend/src/services/orderService.ts`
- `backend/src/routes/orderRoutes.ts`

Penjelasan:

- Tenant dapat melihat order berdasarkan property miliknya.
- Tenant dapat confirm/reject manual payment proof.
- Jika diterima, status menjadi `PROCESSED`.
- Jika ditolak, status kembali menjadi `WAITING_PAYMENT`.
- Email payment accepted/rejected tersedia.

### Reminder, Auto-Cancel, Auto-Complete

Status: sesuai.

Bukti:

- `backend/src/cron.ts`
- `backend/src/utils/emailService.ts`
- `backend/server.ts`

Penjelasan:

- Cron auto-cancel unpaid reservation berjalan tiap 5 menit.
- Cron auto-complete `PROCESSED` setelah checkout berjalan tiap jam.
- Reminder H-1 check-in berjalan tiap jam.
- Cron hanya aktif jika `ENABLE_CRON=true`.

Catatan deployment:

- Backend harus persistent process, bukan serverless, agar cron berjalan
  stabil.

### Review dan Reply Review

Status: sesuai.

Bukti:

- `frontend/src/pages/user/OrdersPage.tsx`
- `frontend/src/services/reviewService.ts`
- `frontend/src/pages/tenant/ReviewsPage.tsx`
- `backend/src/services/reviewService.ts`
- `backend/src/services/tenantReviewService.ts`
- `backend/src/routes/reviewRoutes.ts`

Penjelasan:

- Review hanya untuk order yang sudah selesai atau `PROCESSED` dengan checkout
  lewat.
- Review satu kali per order dijaga oleh unique `orderId`.
- Tenant dapat reply review pada property miliknya.

### Report & Analysis

Status: sesuai.

Bukti:

- `frontend/src/pages/tenant/ReportsPage.tsx`
- `frontend/src/pages/tenant/DashboardPage.tsx`
- `frontend/src/components/tenant/OccupancyCalendar.tsx`
- `frontend/src/components/tenant/OrderStatusPieChart.tsx`
- `backend/src/services/tenantReportService.ts`
- `backend/src/controllers/tenantReportController.ts`

Penjelasan:

- Tenant dashboard menampilkan analytics.
- Report mendukung filter period/date.
- Occupancy calendar tersedia.
- Backend menyediakan report dan occupancy endpoint.

## Environment dan Secret

| File | Status | Catatan |
| --- | --- | --- |
| `backend/.env.example` | Mayoritas lengkap | Memuat DB, JWT, email, Cloudinary, Midtrans, cron, CORS, frontend URL. |
| `frontend/.env.example` | Perlu dilengkapi | Belum mencantumkan `VITE_MIDTRANS_CLIENT_KEY`. |

Rekomendasi:

- Tambahkan `VITE_MIDTRANS_CLIENT_KEY=` ke `frontend/.env.example`.
- Jangan commit `.env` lokal yang berisi Supabase, Cloudinary, Midtrans,
  Google OAuth, LocationIQ, atau email credentials.

## Database dan Migration

Status: sesuai.

Hasil:

```text
6 migrations found in prisma/migrations
Database schema is up to date!
```

Migration penting:

- `20260518232650_init`
- `20260519165158_add_child_price_to_room`
- `20260520054619_add_province_amenities_quantity_expiry_indexes`
- `20260531090000_add_email_change_verification`
- `20260531093000_add_auth_provider`
- `20260531094500_backfill_google_provider`

## Runtime Smoke Test

Hasil smoke test:

```text
FRONTEND=200
HEALTH=200
PROPERTIES=200
ITEMS=4
TOTAL=8
```

Interpretasi:

- Frontend dev server dapat menyajikan root HTML.
- Backend Express dapat berjalan.
- Backend dapat membaca Supabase untuk public property list.
- Endpoint property list mengembalikan data dan pagination.

Catatan:

- Audit ini tidak memakai Playwright/screenshot, sehingga validasi visual mobile,
  overlap UI, dan browser console error tetap perlu QA manual.

## Clean Code

### File Maksimal 200 Baris

Status: sesuai.

Hasil scan:

```text
OVER_200=0
```

### Function Maksimal 15 Baris

Status: belum sesuai penuh.

Hasil scan heuristik:

```text
FILES=209
FUNCTIONS_OVER_15=165
```

Contoh kandidat refactor prioritas:

- `frontend/src/components/user/SearchForm.tsx`
- `frontend/src/components/common/Navbar.tsx`
- `frontend/src/pages/user/HomePage.tsx`
- `frontend/src/pages/auth/LoginPage.tsx`
- `frontend/src/components/user/HeroSection.tsx`
- `frontend/src/pages/tenant/ReviewsPage.tsx`
- `frontend/src/pages/auth/VerifyEmailPage.tsx`
- `frontend/src/pages/tenant/PropertyFormPage.tsx`
- `frontend/src/components/property/PricingCalendarSection.tsx`
- `backend/src/services/tenantReportService.ts`
- `backend/src/services/availabilityService.ts`

Catatan:

- Sebagian hasil adalah komponen React dengan JSX panjang.
- Walau demikian, aturan Purwadhika menyebut function maksimal 15 baris, jadi
  refactor bertahap tetap direkomendasikan.

### Log dan Debug

Status: sesuai.

Tidak ditemukan:

- `console.log`
- `console.debug`
- `console.info`
- `console.warn`
- `console.error`
- `debugger`

## Risiko Utama

1. Automated test belum tersedia.
   - Backend `npm test` masih placeholder.
   - Tidak ada bukti unit/integration/E2E test untuk auth, booking, payment,
     Midtrans callback, cron, review, dan report.

2. Function maksimal 15 baris belum terpenuhi penuh.
   - Walaupun file sudah <= 200 baris, banyak fungsi/komponen masih panjang.

3. `frontend/.env.example` belum mencantumkan `VITE_MIDTRANS_CLIENT_KEY`.
   - Risiko: developer baru menjalankan Midtrans Snap dengan env tidak lengkap.

4. QA visual browser belum otomatis.
   - Mobile tenant dashboard, property detail calendar, booking modal, order
     cards, dan report perlu dicek manual atau dengan Playwright.

5. Sort `rating` dan `popularity` belum sepenuhnya database-side.
   - Untuk dataset kecil aman.
   - Untuk dataset besar bisa berat karena proses in-memory.

## Rekomendasi Prioritas

### Prioritas Tinggi

1. Tambahkan automated test minimal untuk:
   - auth register/login/verify/reset,
   - property catalog filter/sort/pagination,
   - booking availability,
   - manual payment upload,
   - tenant confirm/reject payment,
   - Midtrans callback,
   - cron auto-cancel dan auto-complete,
   - review dan tenant reply.

2. Tambahkan `VITE_MIDTRANS_CLIENT_KEY=` ke `frontend/.env.example`.

3. Lakukan QA browser manual untuk:
   - homepage desktop/mobile,
   - property detail dan pricing calendar,
   - booking USER,
   - tenant dashboard mobile,
   - tenant property/room/category CRUD,
   - tenant order confirmation,
   - report dan occupancy calendar.

4. Refactor fungsi/komponen panjang secara bertahap dimulai dari file yang
   paling sering disentuh dan berisiko tinggi.

### Prioritas Sedang

1. Tambahkan lint backend atau dead-code checker.
2. Optimalkan sort `rating` dan `popularity` agar lebih database-side.
3. Tambahkan API documentation seperti OpenAPI/Swagger.
4. Tambahkan logging production-safe untuk deployment persistent process.

### Prioritas Rendah

1. Rapikan mojibake encoding pada beberapa teks lama.
2. Tambahkan screenshot alur aplikasi pada README untuk presentasi.
3. Tambahkan monitoring sederhana untuk cron dan payment callback.

## Kesimpulan

Project sudah layak secara fitur utama terhadap `PURWADHIKA.md`. Fitur 1 dan
Fitur 2 sudah tersedia secara end-to-end pada backend dan frontend. Hasil smoke
test juga menunjukkan backend, frontend, Supabase, dan endpoint property list
berjalan.

Sisa pekerjaan yang paling penting bukan lagi kelengkapan fitur inti, melainkan
kualitas penunjang finalisasi:

- automated test,
- refactor function panjang,
- kelengkapan env example Midtrans frontend,
- QA visual/browser menyeluruh.
