# README - Frontend PURWALOKA

Frontend PURWALOKA adalah aplikasi React/Vite untuk Property Renting Web App.
Aplikasi ini melayani halaman publik, alur auth, dashboard user, dan dashboard
tenant.

Final Project Purwadhika JCWDBGPM-11, Group 1:

- Muhammad Ali Akbar - Fitur 1
- Anggita Zahra Kamila - Fitur 2

## Tech Stack

- React 19
- Vite 8
- TypeScript 6
- React Router 7
- Tailwind CSS 4
- Axios
- Zustand
- React Hook Form
- Zod
- Recharts
- React Day Picker
- Lucide React
- React Hot Toast
- Leaflet dan React Leaflet
- Google OAuth client

## Struktur Folder

```text
frontend/
  public/
  src/
    assets/
    components/
      common/
      layout/
      property/
      tenant/
      user/
      ui/
    hooks/
    lib/
    pages/
      auth/
      tenant/
      user/
    router/
    services/
    stores/
    types/
    validations/
    App.tsx
    main.tsx
  README-FRONTEND.md
  package.json
```

## Route dan Halaman

Public dan user:

- `/` - `src/pages/user/HomePage.tsx`
- `/properties/:id` - `src/pages/user/PropertyDetailPage.tsx`
- `/about` - `src/pages/AboutPage.tsx`
- `/contact` - `src/pages/ContactPage.tsx`
- `/profile` - `src/pages/user/ProfilePage.tsx`
- `/booking` - `src/pages/user/BookingPage.tsx`
- `/orders` - `src/pages/user/OrdersPage.tsx`
- `/payment/success` - `src/pages/user/PaymentSuccessPage.tsx`

Auth:

- `/auth/login`
- `/auth/register`
- `/auth/register/user`
- `/auth/register/tenant`
- `/auth/verify-email/:token`
- `/auth/verify-email-change/:token`
- `/auth/forgot-password`
- `/auth/reset-password`

Tenant:

- `/tenant/dashboard` - `src/pages/tenant/DashboardPage.tsx`
- `/tenant/properties` - `src/pages/tenant/PropertiesListPage.tsx`
- `/tenant/properties/new` - `src/pages/tenant/PropertyFormPage.tsx`
- `/tenant/properties/:id/edit` - `src/pages/tenant/PropertyFormPage.tsx`
- `/tenant/properties/:id/rooms` - `src/pages/tenant/RoomsPage.tsx`
- `/tenant/orders` - `src/pages/tenant/OrdersPage.tsx`
- `/tenant/reviews` - `src/pages/tenant/ReviewsPage.tsx`
- `/tenant/profile` - `src/pages/user/ProfilePage.tsx`
- `/tenant/reports` - `src/pages/tenant/ReportsPage.tsx`

Routing utama ada di `src/router/index.tsx` dan proteksi role ada di
`src/router/ProtectedRoute.tsx`.

## Fitur 1 di Frontend

| Requirement                          | Status  | Folder/file                                                                                                                                   |
| ------------------------------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Homepage dan landing content         | Selesai | `src/pages/user/HomePage.tsx`, `src/components/user/HeroSection.tsx`                                                                          |
| Search properti                      | Selesai | `src/components/user/SearchForm.tsx`, `src/components/user/propertyFilterDropdown/`, `src/stores/filterStore.ts`                              |
| Filter harga minimal 0 dan fasilitas | Selesai | `src/stores/filterStore.ts`, `src/components/user/PropertyFilterModal.tsx`, `src/components/user/propertyFilterDropdown/PriceRangeFields.tsx` |
| Property list default terbaru        | Selesai | `src/pages/user/HomePage.tsx`                                                                                                                 |
| Property detail, fasilitas, review   | Selesai | `src/pages/user/PropertyDetailPage.tsx`, `src/components/property/`                                                                           |
| Auth dan profile                     | Selesai | `src/pages/auth/`, `src/pages/user/ProfilePage.tsx`, `src/components/user/profile/`, `src/stores/authStore.ts`                                |
| Tenant property dan room management  | Selesai | `src/pages/tenant/PropertiesListPage.tsx`, `src/pages/tenant/PropertyFormPage.tsx`, `src/pages/tenant/RoomsPage.tsx`                          |
| Tenant category management           | Selesai | `src/pages/tenant/CategoriesPage.tsx`, `src/components/tenant/category/`, `src/components/layout/tenantNavigation.ts`                         |

## Fitur 2 di Frontend

| Requirement                 | Status                 | Folder/file                                                                                                                                                              |
| --------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Booking user                | Selesai                | `src/pages/user/BookingPage.tsx`, `src/components/user/BookingSummary.tsx`                                                                                               |
| Payment manual dan Midtrans | Selesai dengan catatan | `src/components/user/PaymentMethodSelector.tsx`, `src/services/orderService.ts`; perlu E2E test Midtrans.                                                                |
| Riwayat order user          | Selesai                | `src/pages/user/OrdersPage.tsx`, `src/components/user/OrderCard.tsx`                                                                                                     |
| Review user                 | Selesai                | `src/components/user/ReviewModal.tsx`, `src/services/reviewService.ts`                                                                                                   |
| Tenant order management     | Selesai                | `src/pages/tenant/OrdersPage.tsx`, `src/components/tenant/OrdersTable.tsx`, `src/components/tenant/OrderMobileCard.tsx`                                                  |
| Tenant review reply         | Selesai                | `src/pages/tenant/ReviewsPage.tsx`                                                                                                                                       |
| Tenant report dan analytics | Selesai                | `src/pages/tenant/ReportsPage.tsx`, `src/pages/tenant/DashboardPage.tsx`, `src/components/tenant/OrderStatusPieChart.tsx`, `src/components/tenant/OccupancyCalendar.tsx` |

## Services

- `src/services/api.ts` - Axios instance dengan `withCredentials`.
- `src/services/authService.ts` - Login, register, logout, auth session.
- `src/services/propertyService.ts` - Property list, detail, categories.
- `src/services/availabilityService.ts` - Public dan tenant room availability.
- `src/services/orderService.ts` - Create order, order list, upload proof, update status.
- `src/services/reviewService.ts` - Create review.
- `src/services/tenantService.ts` - Tenant property, room, image, peak rate, availability.
- `src/services/tenantReportService.ts` - Dashboard analytics dan report.
- `src/services/tenantReviewService.ts` - Review tenant dan reply.
- `src/services/userService.ts` - Profile user/tenant.

## Environment

Buat file `.env` di folder `frontend/` dengan acuan `frontend/.env.example`.

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=PURWALOKA - Boutique Vacation Homes
VITE_GOOGLE_CLIENT_ID=
VITE_LOCATIONIQ_API_KEY=
VITE_MIDTRANS_CLIENT_KEY=
```

Catatan: `VITE_MIDTRANS_CLIENT_KEY` dipakai di
`src/pages/user/BookingPage.tsx`. Variabel ini belum tercantum di
`.env.example`, sehingga perlu ditambahkan pada perbaikan berikutnya.

## Menjalankan Frontend

```bash
npm install
npm run dev
```

Perintah lain:

```bash
npm run lint
npm run build
npm run preview
```

Default local frontend: `http://localhost:5173`.

## Catatan Audit Frontend

Audit Final dilakukan pada 03 Juni 2026 pukul 21:30 WIB.

- Identitas Visual (UI/UX) telah sepenuhnya menggunakan Tema _Deep Slate_, Palet _Azure Allure_, dan Tipografi lokal _Geomanist_.
- Keamanan Lingkungan (ENV) telah diverifikasi; tidak ada _secrets_ sensitif backend yang terekspos di client-side.
- Input komponen `CustomDatePickerPopup.tsx` diimplementasikan secara terpusat untuk menjamin konsistensi UI kalender di seluruh aplikasi.

- `npm run lint` lulus tanpa error.
- `npm run build` selesai tanpa error (exit code 0).
- `node_modules/.bin/tsc -b --noEmit` lulus tanpa error.
- Tidak ada file di `src` yang melebihi 200 baris (diverifikasi via scan PowerShell, hasil 0 file).
- Seluruh fungsi/komponen/hook di frontend sesuai aturan maksimal 15 baris (tidak ada pelanggaran di sisi frontend).
- Rute-rute pemanggilan API untuk Tenant sudah bermigrasi penuh menggunakan endpoint RESTful `/tenants/me/...` (menggantikan `/tenant/...`).
- `TenantOrdersConfirmModal.tsx` dikonfirmasi sudah ada dan menggunakan `ConfirmModal` sebelum setiap aksi perubahan status order (termasuk pembatalan), memenuhi syarat PURWADHIKA.
- Route tenant profile sudah diarahkan ke `src/pages/user/ProfilePage.tsx`.
- Dashboard tenant mobile sudah memakai `TenantMobileTopbar` dan `TenantSidebar`.
- Validasi dinamis tanggal check-out (`min = check-in + 1 hari`) berfungsi di `SearchForm.tsx`.
- Jumlah anak dan bayi dibatasi maksimal sejumlah dewasa di `GuestCounter.tsx`.
