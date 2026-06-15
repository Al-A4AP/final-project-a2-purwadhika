# Audit Clean Code dan REST API Guidelines

Tanggal audit: 15 Juni 2026  
Project: PURWALOKA - Property Renting Web App  
Acuan: `docs/guidelines/PURWADHIKA.md`, `docs/guidelines/REST_API_GUIDELINES.md`, `docs/guidelines/CODE_LINE_CHECK_GUIDELINES.md`, `docs/guidelines/TOOLS_GUIDELINE.md`

## Ringkasan

Audit terbaru menunjukkan project masih buildable dan lint frontend sudah kembali lulus, tetapi belum sepenuhnya sesuai clean code requirement. Dokumentasi lama yang menyebut tidak ada file >200 baris dan hanya 103 kandidat function-length sudah tidak akurat.

REST API jalur utama tetap cukup baik dan resource-oriented, tetapi beberapa legacy alias masih aktif.

## Verifikasi yang Dijalankan

| Pemeriksaan | Hasil |
| --- | --- |
| `frontend npm run lint` | Lulus |
| `frontend npm run build` | Lulus |
| `backend npm run build` | Lulus |
| `backend npm run test:ownership` | Lulus, 7/7 |
| Scan file source >200 baris | 1 file ditemukan |
| Scan `console.*` dan `debugger` | `console.*` ditemukan di script/source tertentu; `debugger` tidak ditemukan |
| Scan `any`, `as any`, `unknown as`, `as unknown` | Masih ada residue |
| `npm run audit:functions` | 155 kandidat manual review, advisory only |

## Frontend Lint

Status: lulus.

Catatan:

- Cleanup limited scope menghapus unused import `Calendar` dari `UserOrdersFilter.tsx`.
- Cleanup limited scope mengubah catch variable yang tidak dipakai di `frontend/test-super-refine.ts`.

## File Source >200 Baris

Status: belum sesuai clean code.

| Lines | File |
| ---: | --- |
| 290 | `backend/src/utils/emailService.ts` |

Rekomendasi:

1. Pecah `emailService.ts` menjadi template/helper per jenis email.
2. Tetap monitor `orderService.ts` dan `voucherService.ts` saat P0 transaction fix agar tidak kembali melewati 200 baris.

## Function-Length Advisory

Status: dipantau, bukan hard rule.

Hasil `npm run audit:functions`:

- Total kandidat: 155.
- `frontend/src`: 131 kandidat.
- `backend/src`: 24 kandidat.

Top kandidat:

| No | File | Line | Function/Component | Lines |
| ---: | --- | ---: | --- | ---: |
| 1 | `frontend/src/pages/tenant/rooms-page/RoomsListView.tsx` | 16 | `RoomsListView` | 128 |
| 2 | `frontend/src/pages/tenant/properties-list/PropertiesListView.tsx` | 15 | `PropertiesListView` | 126 |
| 3 | `frontend/src/pages/user/dashboard/DashboardUpcomingStay.tsx` | 11 | `DashboardUpcomingStay` | 113 |
| 4 | `frontend/src/pages/user/UserReviewsPage.tsx` | 13 | `UserReviewsPage` | 110 |
| 5 | `frontend/src/pages/tenant/tenant-dashboard/TenantRecentReservations.tsx` | 12 | `TenantRecentReservations` | 106 |
| 6 | `frontend/src/pages/tenant/property-form/PropertyImageField.tsx` | 6 | `PropertyImageField` | 104 |
| 7 | `frontend/src/components/user/OrderCard.tsx` | 10 | `OrderCard` | 102 |
| 8 | `frontend/src/hooks/tenant/room-form/useRoomImageField.ts` | 21 | `useRoomImageField` | 100 |
| 9 | `frontend/src/pages/tenant/categories/CategoryFormModal.tsx` | 15 | `CategoryFormModal` | 91 |
| 10 | `frontend/src/pages/user/BookingDetailPage.tsx` | 12 | `BookingDetailPage` | 89 |
| 11 | `frontend/src/components/common/ImageCropperModal.tsx` | 35 | `ImageCropperModal` | 88 |
| 12 | `frontend/src/pages/user/orders/UserOrdersContent.tsx` | 16 | `UserOrdersContent` | 82 |
| 13 | `frontend/src/pages/user/SavedPropertiesPage.tsx` | 10 | `SavedPropertiesPage` | 78 |
| 14 | `frontend/src/components/property/ReservationPanel.tsx` | 13 | `ReservationPanel` | 73 |
| 15 | `frontend/src/pages/tenant/vouchers/AssignVoucherModal.tsx` | 14 | `AssignVoucherModal` | 70 |

Catatan:

- Banyak kandidat frontend berupa JSX presentasional panjang.
- Refactor dilakukan hanya jika meningkatkan keterbacaan, reuse, atau pemisahan logic.
- Jangan memecah komponen secara mekanis jika hasilnya lebih sulit dirawat.

## Type Safety dan Debug Residue

Temuan:

| File | Line | Masalah |
| --- | ---: | --- |
| `backend/src/services/propertyDetailService.ts` | 13 | `property as any` |
| `backend/src/services/propertyDetail/roomStatus.ts` | 47 | `as any` |
| `frontend/src/components/common/ImageCropperModal.tsx` | 33 | `as unknown as FC<EasyCropperProps>` |
| `backend/src/scripts/backfill.ts` | 4, 22, 43, 45, 49 | `console.*` |

Rekomendasi:

1. Ganti `as any` dengan tipe Prisma/domain yang eksplisit.
2. Untuk third-party component cast, dokumentasikan sebagai pengecualian teknis atau bungkus dalam adapter typed.
3. Pindahkan script logs ke logger/script-only policy atau exclude dari source production audit bila memang hanya utility lokal.

## REST API Guidelines

Status: jalur utama cukup baik.

Endpoint resource-oriented yang sudah digunakan:

- `GET /api/users/me/orders`
- `PATCH /api/users/me`
- `POST /api/users/me/email-change-requests`
- `GET /api/tenants/me/orders`
- `GET /api/tenants/me/properties`
- `POST /api/tenants/me/properties`
- `GET /api/tenants/me/properties/:propertyId/rooms`
- `POST /api/tenants/me/rooms/:roomId/availability-ranges`
- `GET /api/tenants/me/reports`
- `GET /api/tenants/me/reports/occupancy`
- `POST /api/orders/:id/payments`
- `POST /api/orders/:id/status-transitions`
- `POST /api/orders/:id/cancellations`
- `POST /api/reviews/:reviewId/replies`
- `GET /api/locations/geocodes`
- `GET /api/locations/reverse-geocodes`

## Legacy Alias REST

Status: masih aktif, bukan blocker runtime.

| Endpoint | Catatan | Rekomendasi |
| --- | --- | --- |
| `GET /api/orders/user` | Legacy alias | Gunakan `GET /api/users/me/orders` |
| `GET /api/orders/tenant` | Legacy alias | Gunakan `GET /api/tenants/me/orders` |
| `POST /api/orders/:id/payment-attempts` | Legacy alias | Gunakan `POST /api/orders/:id/payments` |
| `PATCH /api/orders/:id/status` | Shortcut lama | Gunakan `POST /api/orders/:id/status-transitions` |
| `POST /api/reviews/:reviewId/reply` | Legacy alias | Gunakan `POST /api/reviews/:reviewId/replies` |
| `POST /api/tenants/me/rooms/:roomId/availability/range` | Legacy alias | Gunakan `POST /api/tenants/me/rooms/:roomId/availability-ranges` |
| `PATCH /api/tenants/me/rooms/:roomId/images/:imageId/main` | Pseudo-action | Gunakan `PATCH /images/:imageId` dengan body `is_main` jika sudah aman |

## Area REST yang Terdampak Rencana Baru

| Area | Dampak REST |
| --- | --- |
| Referral removal | Selesai pada source flow aktif; `referral_code` tidak lagi ada pada create order body dan user voucher summary |
| Voucher simplification | Selesai pada source flow aktif; body voucher hanya menerima `PERCENTAGE` dan `FREE_NIGHTS` |
| Domicile removal | Hapus `guest_domicile_address` dari order body/response |
| Room max 5 | Selesai; backend menolak create room ke-6 dan frontend menonaktifkan tombol tambah |
| Profile password | Tidak mengubah endpoint; hanya frontend resolver/UX |
| Transaction timeout | Tidak perlu endpoint baru; service transaction diperbaiki |

## Kesimpulan

Build, lint, dan ownership test masih baik, tetapi clean code belum sesuai standar final karena masih ada 1 file >200 baris dan residue type/log. REST API jalur utama tetap layak, dengan cleanup legacy alias sebagai pekerjaan lanjutan setelah bug P0/P1 selesai.
