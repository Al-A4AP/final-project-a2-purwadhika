# Audit Clean Code dan REST API Guidelines

Tanggal audit: 07 Juni 2026  
Project: PURWALOKA - Property Renting Web App  
Acuan: `docs/guidelines/PURWADHIKA.md` bagian Clean Code dan `docs/guidelines/REST_API_GUIDELINES.md`

## Ringkasan

Audit teknis terakhir menunjukkan source utama aman dari sisi clean code, build, lint, dan type-safety. Tidak ada file `.ts`, `.tsx`, `.js`, atau `.jsx` di `backend/src`, `backend/tests`, dan `frontend/src` yang melebihi 200 baris. Tidak ditemukan `any`, `debugger`, atau `console.*` pada source utama. `console.*` hanya ditemukan di `tools/audit-function-length.js`, karena file tersebut memang script audit CLI.

REST API jalur utama sudah mengikuti pola resource-oriented. Beberapa legacy alias masih aktif untuk backward compatibility dan dicatat sebagai rencana cleanup opsional sebelum standar REST dibuat sangat ketat.

Catatan terbaru: Seluruh temuan UAT browser 07 Juni 2026 yang menyangkut perubahan lanjutan pada dashboard, schema kategori/properti, voucher, booking, alasan penolakan order, dan navigasi profil telah diselesaikan dengan sukses. Audit clean code dan REST API telah dipastikan aman pasca eksekusi.

## Verifikasi yang Dijalankan

| Pemeriksaan | Hasil |
| --- | --- |
| `frontend npm.cmd run lint` | Lulus |
| `frontend npm.cmd run build` | Lulus |
| `backend npm.cmd run build` | Lulus |
| `backend npm.cmd run test:ownership` | Lulus, 7/7 test pass |
| Scan file source >200 baris | Tidak ditemukan di `backend/src`, `backend/tests`, `frontend/src` |
| Scan `console.*` dan `debugger` | Tidak ditemukan di source utama; hanya ada di `tools/audit-function-length.js` |
| Scan `any`, `as any`, `unknown as`, `as unknown` | Tidak ditemukan di area audit |
| `npm run audit:functions` | Advisory only; 87 kandidat manual review, 84 frontend dan 3 backend |

## Clean Code

### Frontend Architecture & UI/UX (Update 07 Juni 2026)

Status: sangat baik dan terstruktur (*Clean Architecture*).

*   **Pemisahan Logika (Separation of Concerns):** Seluruh logika bisnis pada area *User* maupun *Tenant* telah dimigrasikan sepenuhnya ke direktori `hooks/` (misal: `hooks/tenant/reports/`), sehingga `pages/` kini 100% bertindak sebagai *Presentational Layer* murni.
*   **Otorisasi UX Lintas Peran:** Antarmuka secara ketat memblokir akses reservasi bagi peran `TENANT`. Jika diakses oleh Tenant, UI secara cerdas beralih ke *View-Only Mode* dengan menyembunyikan *Reservation Panel*, pemilih tanggal, serta melebarkan tata letak secara dinamis agar estetika tetap elegan dan terpusat (*Quiet Luxury*).
*   **Konsistensi Komponen Global:** Komponen aksi (seperti *Love Badge* / `SavePropertyButton`) menggunakan pola `variant` (`overlay` vs `outline`) guna menghapus kebergantungan pada *CSS forced-overrides* (`!important`), memecahkan isu visibilitas di *Light Mode*, dan memastikan ikon merah menyala (`fill-rose-500`) seragam di seluruh halaman.

### Batas File 200 Baris

Status: sesuai.

Area yang dicek:

- `backend/src`
- `backend/tests`
- `frontend/src`

Tidak ada file source utama yang melewati 200 baris. `backend/prisma/schema.prisma` berisi 261 baris dan tetap dicatat sebagai pengecualian teknis karena Prisma schema bersifat deklaratif dan lazim berada dalam satu file pusat.

### Function Maksimal 15 Baris

Status: terkendali dengan audit otomatis advisory.

Script tersedia melalui:

```bash
npm run audit:functions
```

Hasil terbaru:

- 87 kandidat di atas 15 baris.
- 84 kandidat berada di `frontend/src`.
- 3 kandidat berada di `backend/src`.
- Script selalu exit `0` dan tidak menjadi hard rule.

### Snapshot Kandidat Function-Length Advisory

Daftar ini adalah snapshot tracking, bukan hard rule dan bukan daftar final yang harus dipecah semuanya. Ringkasan terbaru per 07 Juni 2026 menunjukkan 87 kandidat. Untuk daftar lengkap aktual, jalankan `npm run audit:functions` karena hasil dapat berubah setiap kali ada refactor.

Kandidat prioritas terbaru:

- `frontend/src/pages/tenant/rooms-page/RoomsListView.tsx`
- `frontend/src/pages/tenant/properties-list/PropertiesListView.tsx`
- `frontend/src/pages/tenant/property-form/PropertyImageField.tsx`
- `frontend/src/hooks/tenant/room-form/useRoomImageField.ts`
- `frontend/src/components/user/OrderCard.tsx`
- `backend/src/services/categoryService.ts`
- `backend/src/services/tenantPropertyService.ts`

| No | File | Baris | Fungsi/Component | Kind | Jumlah Baris |
| --- | --- | ---: | --- | --- | ---: |
| 1 | `frontend/src/components/tenant/room-form/RoomImageField.tsx` | 20 | `RoomImageField` | ArrowFunction | 193 |
| 2 | `frontend/src/pages/user/booking/ReservationStepper.tsx` | 14 | `ReservationStepper` | ArrowFunction | 145 |
| 3 | `frontend/src/pages/tenant/rooms-page/RoomsListView.tsx` | 16 | `RoomsListView` | ArrowFunction | 128 |
| 4 | `frontend/src/pages/tenant/properties-list/PropertiesListView.tsx` | 15 | `PropertiesListView` | ArrowFunction | 122 |
| 5 | `frontend/src/pages/tenant/property-form/PropertyImageField.tsx` | 6 | `PropertyImageField` | ArrowFunction | 104 |
| 6 | `frontend/src/components/user/OrderCard.tsx` | 9 | `OrderCard` | ArrowFunction | 96 |
| 7 | `frontend/src/pages/user/UserReviewsPage.tsx` | 12 | `UserReviewsPage` | ArrowFunction | 90 |
| 8 | `frontend/src/pages/user/BookingDetailPage.tsx` | 12 | `BookingDetailPage` | ArrowFunction | 89 |
| 9 | `frontend/src/components/common/ImageCropperModal.tsx` | 18 | `ImageCropperModal` | ArrowFunction | 88 |
| 10 | `frontend/src/pages/tenant/categories/CategoryListView.tsx` | 24 | `CategoryListView` | ArrowFunction | 81 |
| 11 | `frontend/src/pages/tenant/tenant-dashboard/HostRecentReservations.tsx` | 11 | `HostRecentReservations` | ArrowFunction | 75 |
| 12 | `frontend/src/pages/user/SavedPropertiesPage.tsx` | 9 | `SavedPropertiesPage` | ArrowFunction | 75 |
| 13 | `frontend/src/components/property/ReservationPanel.tsx` | 13 | `ReservationPanel` | ArrowFunction | 73 |
| 14 | `frontend/src/pages/user/dashboard/DashboardUpcomingStay.tsx` | 11 | `DashboardUpcomingStay` | ArrowFunction | 70 |
| 15 | `frontend/src/components/tenant/room-form/RoomFormFields.tsx` | 27 | `RoomFormFields` | ArrowFunction | 69 |
| 16 | `frontend/src/pages/tenant/categories/CategoryFormModal.tsx` | 15 | `CategoryFormModal` | ArrowFunction | 69 |
| 17 | `frontend/src/pages/user/saved-properties/SavedPropertyCard.tsx` | 14 | `SavedPropertyCard` | ArrowFunction | 60 |
| 18 | `frontend/src/pages/user/orders/BookingPropertySummary.tsx` | 6 | `BookingPropertySummary` | ArrowFunction | 59 |
| 19 | `frontend/src/pages/tenant/rooms-page/RoomsSummary.tsx` | 10 | `RoomsSummary` | ArrowFunction | 55 |
| 20 | `frontend/src/pages/tenant/tenant-dashboard/HostKpiGrid.tsx` | 10 | `HostKpiGrid` | ArrowFunction | 55 |
| 21 | `frontend/src/pages/user/orders/UserOrdersContent.tsx` | 15 | `UserOrdersContent` | ArrowFunction | 52 |
| 22 | `frontend/src/pages/user/PaymentSuccessPage.tsx` | 6 | `PaymentSuccessPage` | ArrowFunction | 52 |
| 23 | `frontend/src/pages/user/PropertyDetailPage.tsx` | 26 | `PropertyDetailView` | ArrowFunction | 52 |
| 24 | `frontend/src/pages/user/orders/BookingStatusTimeline.tsx` | 5 | `BookingStatusTimeline` | ArrowFunction | 50 |
| 25 | `frontend/src/components/property/PropertyGallery.tsx` | 11 | `PropertyGallery` | ArrowFunction | 47 |
| 26 | `frontend/src/pages/tenant/occupancy/OccupancyContent.tsx` | 29 | `AvailabilitySummary` | ArrowFunction | 47 |
| 27 | `frontend/src/pages/tenant/PropertiesListPage.tsx` | 13 | `PropertiesListPage` | ArrowFunction | 45 |
| 28 | `frontend/src/pages/user/orders/BookingPaymentPanel.tsx` | 6 | `BookingPaymentPanel` | ArrowFunction | 44 |
| 29 | `frontend/src/pages/tenant/property-form/PropertyLocationFields.tsx` | 6 | `PropertyLocationFields` | ArrowFunction | 43 |
| 30 | `frontend/src/pages/user/reviews/EligibleReviewCard.tsx` | 10 | `EligibleReviewCard` | ArrowFunction | 42 |
| 31 | `frontend/src/pages/user/reviews/ReviewSummaryCards.tsx` | 10 | `ReviewSummaryCards` | ArrowFunction | 41 |
| 32 | `frontend/src/pages/tenant/CategoriesPage.tsx` | 37 | `useCategoryViewState` | ArrowFunction | 39 |
| 33 | `frontend/src/pages/tenant/RoomsPage.tsx` | 38 | `RoomsPageLayout` | ArrowFunction | 39 |
| 34 | `frontend/src/pages/tenant/property-form/PropertyBasicFields.tsx` | 7 | `PropertyBasicFields` | ArrowFunction | 37 |
| 35 | `frontend/src/pages/user/reviews/SubmittedReviewCard.tsx` | 9 | `SubmittedReviewCard` | ArrowFunction | 37 |
| 36 | `frontend/src/pages/tenant/tenant-dashboard/HostRevenuePanel.tsx` | 12 | `HostRevenuePanel` | ArrowFunction | 36 |
| 37 | `frontend/src/components/tenant/room-form/RoomImageField.tsx` | 50 | `handleCropComplete` | ArrowFunction | 33 |
| 38 | `frontend/src/pages/tenant/rooms-page/RoomsPageHeader.tsx` | 11 | `RoomsPageHeader` | ArrowFunction | 33 |
| 39 | `frontend/src/pages/user/UserDashboardPage.tsx` | 11 | `UserDashboardPage` | ArrowFunction | 33 |
| 40 | `frontend/src/pages/tenant/rooms-page/RoomsFormSection.tsx` | 18 | `RoomsFormSection` | ArrowFunction | 31 |
| 41 | `frontend/src/pages/user/dashboard/DashboardRecent.tsx` | 11 | `DashboardRecent` | ArrowFunction | 31 |
| 42 | `frontend/src/lib/cropImage.ts` | 17 | `getCroppedImg` | ArrowFunction | 29 |
| 43 | `frontend/src/components/common/navbar/ProfileDropdown.tsx` | 20 | `ProfileDropdownLinks` | ArrowFunction | 28 |
| 44 | `frontend/src/pages/user/dashboard/DashboardReviewReminders.tsx` | 10 | `DashboardReviewReminders` | ArrowFunction | 27 |
| 45 | `frontend/src/pages/tenant/CategoriesPage.tsx` | 77 | `CategoryPageView` | ArrowFunction | 25 |
| 46 | `backend/src/services/categoryService.ts` | 62 | `listCategories` | ArrowFunction | 24 |
| 47 | `frontend/src/hooks/useSavedProperties.ts` | 21 | `useSavedPropertyActions` | ArrowFunction | 24 |
| 48 | `frontend/src/pages/tenant/DashboardPage.tsx` | 10 | `DashboardPage` | ArrowFunction | 23 |
| 49 | `frontend/src/components/property/InlineAvailabilitySection.tsx` | 21 | `InlineAvailabilitySection` | ArrowFunction | 22 |
| 50 | `frontend/src/pages/tenant/categories/CategoriesHeader.tsx` | 8 | `CategoriesHeader` | ArrowFunction | 22 |
| 51 | `frontend/src/pages/tenant/properties-list/PropertiesHeader.tsx` | 5 | `PropertiesHeader` | ArrowFunction | 22 |
| 52 | `frontend/src/pages/tenant/reviews/ReviewsSkeleton.tsx` | 3 | `ReviewsSkeleton` | ArrowFunction | 22 |
| 53 | `frontend/src/pages/tenant/reviews/TenantReviewsContent.tsx` | 11 | `TenantReviewsContent` | ArrowFunction | 22 |
| 54 | `frontend/src/pages/tenant/tenant-dashboard/HostOperationsGrid.tsx` | 27 | `HostOperationsGrid` | ArrowFunction | 22 |
| 55 | `frontend/src/pages/tenant/orders/TenantOrdersContent.tsx` | 13 | `TenantOrdersContent` | ArrowFunction | 21 |
| 56 | `frontend/src/pages/tenant/reports/ReportsContent.tsx` | 6 | `ReportsContent` | ArrowFunction | 21 |
| 57 | `frontend/src/pages/user/dashboard/DashboardWelcome.tsx` | 8 | `DashboardWelcome` | ArrowFunction | 21 |
| 58 | `frontend/src/pages/user/orders/BookingDetailHeader.tsx` | 7 | `BookingDetailHeader` | ArrowFunction | 21 |
| 59 | `frontend/src/hooks/auth/login/useLoginPageState.ts` | 109 | `handleGoogleSuccess` | ArrowFunction | 20 |
| 60 | `frontend/src/pages/tenant/occupancy/OccupancyContent.tsx` | 8 | `OccupancyContent` | ArrowFunction | 20 |
| 61 | `frontend/src/pages/tenant/property-form/PropertyBasicFields.tsx` | 45 | `CategoryField` | ArrowFunction | 20 |
| 62 | `frontend/src/pages/tenant/reports/ReportOrderItem.tsx` | 6 | `ReportOrderItem` | ArrowFunction | 20 |
| 63 | `frontend/src/pages/tenant/rooms-page/RoomsListSection.tsx` | 16 | `RoomsListSection` | ArrowFunction | 20 |
| 64 | `frontend/src/pages/tenant/property-form/PropertyFormHeader.tsx` | 5 | `PropertyFormHeader` | ArrowFunction | 19 |
| 65 | `frontend/src/pages/tenant/reports/KPICard.tsx` | 10 | `KPICard` | ArrowFunction | 19 |
| 66 | `frontend/src/pages/tenant/reports/ReportOrdersCard.tsx` | 7 | `ReportOrdersCard` | ArrowFunction | 19 |
| 67 | `frontend/src/hooks/tenant/properties-list/usePropertiesFilters.ts` | 3 | `usePropertiesFilters` | ArrowFunction | 18 |
| 68 | `frontend/src/pages/tenant/reports/ReportsFilterPanel.tsx` | 23 | `ReportsFilterPanel` | ArrowFunction | 18 |
| 69 | `frontend/src/pages/tenant/reviews/TenantReviewCard.tsx` | 10 | `TenantReviewCard` | ArrowFunction | 18 |
| 70 | `backend/src/services/tenantPropertyService.ts` | 82 | `updateProperty` | ArrowFunction | 17 |
| 71 | `frontend/src/pages/tenant/property-form/PropertySubmitButton.tsx` | 4 | `PropertySubmitButton` | ArrowFunction | 17 |
| 72 | `frontend/src/pages/user/profile/AvatarUploadSection.tsx` | 8 | `AvatarUploadSection` | ArrowFunction | 17 |
| 73 | `frontend/src/pages/user/profile/useAvatarUpload.ts` | 23 | `useAvatarCropActions` | ArrowFunction | 17 |
| 74 | `frontend/src/components/property/InlineDatePicker.tsx` | 17 | `InlineDatePicker` | ArrowFunction | 16 |
| 75 | `frontend/src/pages/tenant/occupancy/OccupancyContent.tsx` | 77 | `renderContent` | ArrowFunction | 16 |
| 76 | `frontend/src/pages/tenant/reports/ReportOrdersCard.tsx` | 27 | `ReportOrdersList` | ArrowFunction | 16 |
| 77 | `frontend/src/pages/tenant/reviews/ReviewsHeader.tsx` | 4 | `ReviewsHeader` | ArrowFunction | 16 |
| 78 | `frontend/src/pages/tenant/tenant-dashboard/HostDashboardHeader.tsx` | 4 | `HostDashboardHeader` | ArrowFunction | 16 |

Kandidat prioritas jika ingin refactor lanjutan:

- `frontend/src/components/tenant/room-form/RoomImageField.tsx`
- `frontend/src/pages/user/booking/ReservationStepper.tsx`
- `frontend/src/pages/tenant/rooms-page/RoomsListView.tsx`
- `frontend/src/pages/tenant/properties-list/PropertiesListView.tsx`
- `frontend/src/pages/tenant/property-form/PropertyImageField.tsx`
- `backend/src/services/categoryService.ts`
- `backend/src/services/tenantPropertyService.ts`

Rekomendasi: refactor hanya dilakukan jika pemecahan function/component membuat kode lebih jelas. Banyak kandidat frontend berupa JSX presentasional panjang, sehingga tetap perlu penilaian manual.

### Log Production dan Debugger

Status: sesuai.

Tidak ditemukan `console.*` atau `debugger` aktif pada source utama. `console.log` dan `console.table` pada `tools/audit-function-length.js` diterima karena script tersebut adalah CLI reporting tool.

### Type Safety

Status: sesuai.

Tidak ditemukan `any`, `as any`, `unknown as`, atau `as unknown` pada area audit. Type assertion yang tersisa tidak memakai `any` dan masih dalam batas wajar TypeScript.

## REST API Guidelines

### Rencana Aktif yang Menyentuh REST dan Clean Code

Rencana UAT browser terbaru memiliki dampak REST dan clean code berikut:

| Tahap | Dampak REST | Dampak Clean Code |
| --- | --- | --- |
| Dashboard tenant date logic | Query `GET /api/tenants/me/dashboard` perlu enum periode baru dan validasi query | Pisahkan date range helper agar service dashboard tetap ringkas |
| Category description dan rental type | Body `POST/PATCH /api/tenants/me/categories` bertambah field resource | Update schema Zod dan service tanpa controller logic panjang |
| Property rental type | Body property create/update bertambah `rental_type` | Form/schema/payload dipisahkan agar page tetap presentasional |
| Voucher UX dan validasi | Endpoint voucher tetap sama; validasi body diperketat | Hindari native confirm, pecah form date/value/code field |
| Tenant reject payment reason | `POST /api/orders/:id/status-transitions` menerima `reason` untuk transisi reject | Modal alasan dan service transition tetap terpisah |
| Booking guest data validation | Tidak perlu endpoint baru | Validasi step frontend dipisah dari checkout submit akhir |

Prinsip: jangan membuat endpoint pseudo-action baru jika endpoint resource-oriented yang ada masih cukup.

### Endpoint Jalur Utama yang Sudah Sesuai

Contoh endpoint resource-oriented yang aktif:

- `GET /api/users/me/orders`
- `PATCH /api/users/me`
- `PATCH /api/users/me/avatar`
- `POST /api/users/me/email-change-requests`
- `GET /api/tenants/me/orders`
- `GET /api/tenants/me/properties`
- `POST /api/tenants/me/properties`
- `GET /api/tenants/me/properties/:id`
- `POST /api/tenants/me/properties/:id/images`
- `GET /api/tenants/me/properties/:propertyId/rooms`
- `POST /api/tenants/me/rooms/:roomId/availability-ranges`
- `GET /api/tenants/me/reports`
- `GET /api/tenants/me/reports/occupancy`
- `POST /api/orders/:id/payments`
- `POST /api/orders/:id/status-transitions`
- `POST /api/reviews/:reviewId/replies`
- `GET /api/locations/geocodes`
- `GET /api/locations/reverse-geocodes`

### Response Format

Status: sesuai.

Backend memakai response helper terpusat:

- `backend/src/utils/response.ts`
- `sendSuccess<T>`
- `sendError`

Controller utama memakai format response konsisten untuk success dan error.

### Validasi Query dan Body

Status: sesuai.

Validasi dipusatkan pada:

- `backend/src/validations/queryValidation.ts`
- `backend/src/validations/orderValidation.ts`
- `backend/src/validations/propertyValidation.ts`
- `backend/src/validations/reviewValidation.ts`
- middleware `validate`

### Sisa Legacy Alias REST

Status: bukan blocker runtime, tetapi masih menjadi rekomendasi cleanup.

| Endpoint | Catatan | Rekomendasi |
| --- | --- | --- |
| `GET /api/orders/user` | Legacy alias | Gunakan `GET /api/users/me/orders` |
| `GET /api/orders/tenant` | Legacy alias | Gunakan `GET /api/tenants/me/orders` |
| `POST /api/orders/:id/payment-attempts` | Legacy alias | Gunakan `POST /api/orders/:id/payments` |
| `PATCH /api/orders/:id/status` | Shortcut lama | Gunakan `POST /api/orders/:id/status-transitions` |
| `POST /api/reviews/:reviewId/reply` | Legacy alias | Gunakan `POST /api/reviews/:reviewId/replies` |
| `POST /api/tenants/me/rooms/:roomId/availability/range` | Legacy alias | Gunakan `POST /api/tenants/me/rooms/:roomId/availability-ranges` |
| `PATCH /api/tenants/me/rooms/:roomId/images/:imageId/main` | Pseudo-action | Pertimbangkan `PATCH /images/:imageId` dengan body `{ "is_main": true }` |

## Struktur Dokumentasi

Status: sesuai dengan arahan terbaru.

README hanya dipertahankan di:

- `README.md`
- `docs/README.md`

README di folder `frontend` dan `backend` sudah dihapus oleh user dan tidak dibuat ulang.

## Kesimpulan

Clean code dan REST API berada pada kondisi teknis baik berdasarkan verifikasi terakhir. Namun, setelah rencana UAT browser dieksekusi, audit ini harus diperbarui ulang karena beberapa perubahan menyentuh schema, validasi REST body/query, dan flow transaksi.
