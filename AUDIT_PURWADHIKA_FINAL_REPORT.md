# Audit Final PURWADHIKA - PURWALOKA

Tanggal audit: 31 Mei 2026  
Scope: `backend/`, `frontend/`, `README.md`, `frontend/README-FRONTEND.md`,
`backend/README-BACKEND.md`, dan acuan requirement `PURWADHIKA.md`.

## Batasan Audit

- Tidak ada perubahan source code aplikasi.
- Tidak menjalankan seed, migration, atau build yang dapat membuat artefak baru.
- Perubahan yang dilakukan hanya:
  - Membuat file laporan ini.
  - Memperbarui `README.md`.
  - Memperbarui `frontend/README-FRONTEND.md`.
  - Memperbarui `backend/README-BACKEND.md`.
- Server local tidak sedang aktif saat dicek lewat `http://127.0.0.1:5173/`
  dan `http://127.0.0.1:5000/api/health`. Server tidak dipaksa dijalankan
  karena permintaan audit membatasi perubahan file.

## Ringkasan Eksekutif

Project sudah mencakup mayoritas requirement Property Renting Web App di
`PURWADHIKA.md`. Fitur utama untuk USER dan TENANT sudah tersedia: homepage,
search, auth, profile, property detail, booking, payment manual/Midtrans,
tenant property/room management, availability, peak rate, order confirmation,
review, reply review, report, dan cron booking.

Namun ada beberapa catatan yang masih perlu ditindaklanjuti:

- Automated test belum tersedia.
- Aturan clean code fungsi maksimal 15 baris belum terpenuhi secara ketat.
- Tenant category management sudah ada di backend, tetapi belum ada halaman CRUD
  kategori di dashboard tenant.
- `frontend/.env.example` belum mencantumkan `VITE_MIDTRANS_CLIENT_KEY`, padahal
  `BookingPage.tsx` memakainya untuk Midtrans Snap.
- Sort property untuk `price`, `rating`, dan `popularity` masih diproses
  in-memory setelah query, sehingga belum ideal untuk dataset besar.
- `backend/server.ts` masih memiliki startup `console.log`.

## Pemeriksaan Non-Destructive

| Pemeriksaan | Hasil |
| --- | --- |
| `git status --short` sebelum edit dokumen | Hanya `README.md` sudah modified dari kondisi awal workspace. |
| Jumlah file TS/TSX sumber | 180 file di `frontend/src`, `backend/src`, dan `backend/prisma`. |
| File lebih dari 200 baris | `OVER_200=0`. |
| `console`, `debugger`, `TODO`, `FIXME`, `XXX` | Hanya `backend/server.ts:57` berisi startup `console.log`. |
| Frontend lint | `npm run lint` lulus tanpa error. |
| Backend TypeScript check | `node_modules/.bin/tsc --noEmit` lulus tanpa error. |
| Frontend TypeScript check | `node_modules/.bin/tsc -b --noEmit` lulus tanpa error. |
| Backend test script | `npm test` masih placeholder dan exit 1. |
| Localhost frontend/backend | Tidak aktif saat dicek langsung. |

Catatan: `npx tsc --noEmit` sempat mencoba mengakses registry dan gagal karena
network/sandbox. Pemeriksaan diulang memakai binary lokal `node_modules/.bin`
dan berhasil.

## Kepatuhan Terhadap PURWADHIKA.md

### Standardization

| Requirement | Status | Penjelasan |
| --- | --- | --- |
| Validation | Sesuai dengan catatan | Backend memakai Zod di `backend/src/validations/`; frontend memakai Zod dan React Hook Form di beberapa form. |
| Pagination/filter/sort server-side | Mayoritas sesuai | Query property/order/report menerima page, limit, filter, sort. Catatan: sort `price/rating/popularity` property masih in-memory. |
| Frontend responsive | Mayoritas sesuai | Tenant mobile layout sudah memiliki topbar/hamburger, mobile card order, dan property card responsive. Tetap perlu QA browser real device. |
| Backend REST | Sesuai | Route utama memakai `/api/auth`, `/api/properties`, `/api/orders`, `/api/users`, `/api/tenant`, dan review routes. |
| Auth | Sesuai | JWT HttpOnly cookie, role guard USER/TENANT, token blacklist logout. |
| File maksimal 200 baris | Sesuai | Scan menunjukkan tidak ada file TS/TSX sumber lebih dari 200 baris. |
| Tidak ada log tidak terpakai | Hampir sesuai | Tidak ada `console` di `frontend/src`, `backend/src`, dan `backend/prisma`; masih ada startup log di `backend/server.ts`. |
| Tidak ada unused code | Perlu audit lanjutan | Lint frontend lulus, tetapi backend belum punya lint dan belum ada dead-code tool. |
| Function maksimal 15 baris | Belum sesuai penuh | Scan heuristik menemukan 67 fungsi/komponen/hook melewati 15 baris. Beberapa hasil adalah false positive dari lazy route, tetapi tetap ada fungsi panjang nyata. |

## Fitur 1 - Audit Detail

| Requirement PURWADHIKA | Status | Bukti file |
| --- | --- | --- |
| Homepage/Landing page | Selesai | `frontend/src/pages/user/HomePage.tsx`, `frontend/src/components/user/HeroSection.tsx`, `frontend/src/components/user/PropertyGrid.tsx` |
| Search by destination/date | Selesai | `frontend/src/components/user/SearchForm.tsx`, `frontend/src/stores/filterStore.ts`, `backend/src/services/propertyQueryService.ts` |
| Sort by price | Selesai dengan catatan | `backend/src/services/propertyService.ts`; sort dilakukan setelah data diformat, perlu optimasi DB-side. |
| Date price comparison/calendar | Selesai | `frontend/src/components/property/PricingCalendarSection.tsx`, `backend/src/services/propertyService.ts`, `backend/src/services/publicAvailabilityService.ts` |
| Unavailable dates marked | Selesai | `frontend/src/components/property/AvailabilityModal.tsx`, `frontend/src/components/property/PricingCalendarSection.tsx`, `backend/src/services/publicAvailabilityService.ts` |
| Auth and profile | Selesai | `frontend/src/pages/auth/`, `frontend/src/pages/user/ProfilePage.tsx`, `backend/src/services/authService.ts`, `backend/src/services/userService.ts` |
| Tenant property management | Selesai | `frontend/src/pages/tenant/PropertiesListPage.tsx`, `frontend/src/pages/tenant/PropertyFormPage.tsx`, `backend/src/services/tenantPropertyService.ts` |
| Tenant room management | Selesai | `frontend/src/pages/tenant/RoomsPage.tsx`, `backend/src/services/tenantRoomService.ts` |
| Peak season rates | Selesai | `frontend/src/components/tenant/RoomPeakRatesModal.tsx`, `backend/src/services/tenantRoomService.ts` |
| Availability management | Selesai | `frontend/src/components/tenant/RoomAvailabilityModal.tsx`, `backend/src/services/availabilityService.ts`, `backend/src/services/publicAvailabilityService.ts` |
| Category management | Parsial | Backend CRUD tersedia di `backend/src/controllers/categoryController.ts`; frontend belum memiliki halaman/menu CRUD kategori tenant. |

Kesimpulan Fitur 1: secara fungsional sudah kuat untuk demo dan alur utama.
Kekurangan terbesar adalah UI category management dan optimasi sort database.

## Fitur 2 - Audit Detail

| Requirement PURWADHIKA | Status | Bukti file |
| --- | --- | --- |
| User transaction/booking | Selesai | `frontend/src/pages/user/BookingPage.tsx`, `backend/src/services/orderService.ts` |
| Manual payment proof | Selesai | `frontend/src/components/user/OrderCard.tsx`, `backend/src/controllers/orderController.ts`, `backend/src/middlewares/uploadMiddleware.ts` |
| Payment proof window 1 jam | Selesai | `backend/src/constants/orderConstants.ts` |
| Midtrans payment | Selesai dengan catatan | `backend/src/services/midtransService.ts`, `backend/src/config/midtrans.ts`, `frontend/src/pages/user/BookingPage.tsx`; perlu E2E test. |
| Tenant transaction management | Selesai | `frontend/src/pages/tenant/OrdersPage.tsx`, `frontend/src/components/tenant/OrdersTable.tsx`, `backend/src/services/orderService.ts` |
| Auto-cancel unpaid reservations | Selesai | `backend/src/cron.ts` |
| Auto-complete after checkout | Selesai | `backend/src/cron.ts` mengubah `PROCESSED` menjadi `COMPLETED`. |
| Review after stay | Selesai | `backend/src/services/reviewService.ts` mengizinkan `COMPLETED` atau `PROCESSED` dengan checkout sudah lewat. |
| Tenant reply review | Selesai | `frontend/src/pages/tenant/ReviewsPage.tsx`, `backend/src/services/tenantReviewService.ts` |
| Report and analysis | Selesai | `frontend/src/pages/tenant/ReportsPage.tsx`, `frontend/src/pages/tenant/DashboardPage.tsx`, `backend/src/services/tenantReportService.ts` |

Kesimpulan Fitur 2: requirement utama sudah tersedia. Risiko terbesar adalah
belum adanya automated test untuk payment, order transition, cron, dan review.

## Catatan Web App dan Browser

Pengecekan langsung ke localhost:

- `http://127.0.0.1:5173/` gagal connect karena frontend dev server tidak aktif.
- `http://127.0.0.1:5000/api/health` gagal connect karena backend dev server tidak aktif.

Ini bukan bukti aplikasi rusak, tetapi menunjukkan server belum berjalan pada
saat audit. Karena user meminta tidak mengubah/menambah file selain dokumentasi,
audit tidak menjalankan Vite/backend dev server ulang.

Pemeriksaan statis terkait masalah browser sebelumnya:

- Frontend lint lulus.
- TypeScript frontend lulus.
- Syntax error fatal seperti `missing ) after argument list` tidak terdeteksi
  oleh TypeScript/lint saat audit ini.
- Jika error tersebut muncul lagi di browser, kemungkinan besar perlu cek:
  - cache Vite/browser,
  - ekstensi React DevTools/source map `installHook.js.map`,
  - file bundle hasil dev server,
  - dependency yang berubah setelah install.

## Clean Code

### File lebih dari 200 baris

Status: sesuai.  
Scan terhadap `frontend/src`, `backend/src`, dan `backend/prisma` menunjukkan:

```text
OVER_200=0
```

### Function lebih dari 15 baris

Status: belum sepenuhnya sesuai.  
Scan heuristik menemukan 67 kandidat fungsi/komponen/hook lebih dari 15 baris.
Sebagian hasil dapat berupa false positive karena pola lazy import atau JSX,
tetapi beberapa fungsi nyata memang panjang.

Contoh prioritas refactor:

- `frontend/src/hooks/useRoomsLogic.ts`
- `backend/src/services/availabilityService.ts`
- `backend/src/cron.ts`
- `frontend/src/pages/tenant/OrdersPage.tsx`
- `backend/src/services/midtransService.ts`
- `backend/src/middlewares/ownershipMiddleware.ts`
- `frontend/src/stores/filterStore.ts`
- `frontend/src/stores/authStore.ts`

Rekomendasi refactor:

- Pisahkan helper pure function dari komponen/hook.
- Pecah handler panjang menjadi fungsi kecil.
- Pindahkan format/mapper ke `lib/` atau service helper.
- Hindari refactor besar sekaligus; lakukan per modul dan verifikasi setelahnya.

### Log dan Debug

Hanya ditemukan:

```text
backend/server.ts:57 console.log(`Server berjalan di http://localhost:${PORT}`);
```

Rekomendasi:

- Ganti dengan logger sederhana yang bisa dimatikan di production.
- Atau bungkus dengan `if (process.env.NODE_ENV !== 'production')`.

## Environment dan Secret

File `.env` lokal ada di backend/frontend, tetapi `.gitignore` sudah mengabaikan
`.env`. Jangan commit credential Supabase, Cloudinary, Midtrans, Google OAuth,
LocationIQ, atau email.

Catatan environment:

- Backend `.env.example` sudah cukup lengkap.
- Frontend `.env.example` belum mencantumkan `VITE_MIDTRANS_CLIENT_KEY`, padahal
  `frontend/src/pages/user/BookingPage.tsx` memakai variabel tersebut.

## Deployment

Backend harus memakai persistent process deployment, bukan serverless, karena:

- Express API harus long-running.
- Cron job auto-cancel unpaid reservations berjalan di `backend/src/cron.ts`.
- Cron job auto-complete order setelah checkout juga berjalan di proses backend.
- Reminder checkout H-1 membutuhkan scheduled task.
- Upload Cloudinary dan Midtrans notification membutuhkan endpoint backend aktif.

Rekomendasi platform:

- Render
- Railway
- VPS
- Platform lain yang mendukung long-running Node.js process

Set `ENABLE_CRON=true` hanya pada backend persistent process production.

## Rekomendasi Prioritas

### Prioritas Tinggi

1. Tambahkan automated test untuk auth, booking, payment proof, Midtrans callback,
   tenant order transition, cron auto-cancel, cron auto-complete, dan review.
2. Tambahkan `VITE_MIDTRANS_CLIENT_KEY` ke `frontend/.env.example`.
3. Refactor fungsi panjang secara bertahap sampai mendekati aturan maksimal
   15 baris.
4. Pastikan smoke test local berjalan dengan backend dan frontend aktif:
   - `http://localhost:5173/`
   - `http://localhost:5000/api/health`

### Prioritas Sedang

1. Buat halaman CRUD category tenant jika requirement kategori ingin dinilai
   penuh dari frontend.
2. Optimalkan sort property `price`, `rating`, dan `popularity` agar lebih
   database-side.
3. Tambahkan lint backend atau dead-code check.
4. Tambahkan logger production-safe untuk menggantikan `console.log`.

### Prioritas Rendah

1. Bersihkan komentar encoding mojibake di beberapa file jika ingin dokumentasi
   source lebih rapi.
2. Tambahkan dokumentasi API lebih formal, misalnya OpenAPI/Swagger.
3. Tambahkan screenshot flow untuk README jika diperlukan untuk presentasi.

## Perubahan Dokumentasi yang Dilakukan

File yang dibuat:

- `AUDIT_PURWADHIKA_FINAL_REPORT.md`

File yang diperbarui:

- `README.md`
- `frontend/README-FRONTEND.md`
- `backend/README-BACKEND.md`

Tidak ada source code aplikasi yang diubah dalam audit ini.
