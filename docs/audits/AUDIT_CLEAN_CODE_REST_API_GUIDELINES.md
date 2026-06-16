# Audit Clean Code dan REST API Guidelines

Tanggal audit: 16 Juni 2026  
Project: PURWALOKA - Property Renting Web App  
Acuan: `docs/guidelines/PURWADHIKA.md`, `docs/guidelines/REST_API_GUIDELINES.md`, `docs/guidelines/CODE_LINE_CHECK_GUIDELINES.md`, `docs/guidelines/TOOLS_GUIDELINE.md`

## Ringkasan

Audit final hardening menunjukkan type-safety dan script logging residue sudah dibersihkan. Frontend lint, frontend build, backend build, dan ownership test lulus.

Namun scan terbaru menemukan 3 file backend masih melewati 200 baris. Function-length audit tetap dipakai sebagai alat bantu, bukan hard rule otomatis. Hasil terbaru menemukan 145 kandidat function/component yang perlu dinilai manual.

REST API jalur utama tetap resource-oriented. Beberapa legacy alias masih ada untuk backward compatibility dan dapat dibersihkan setelah regression test aman.

## Verifikasi yang Dijalankan

| Pemeriksaan | Hasil |
| --- | --- |
| `frontend npm run lint` | Lulus |
| `frontend npm run build` | Lulus |
| `backend npm run build` | Lulus |
| `backend npm run test:ownership` | Lulus, 7/7 |
| Scan file source >200 baris | 3 file backend |
| Scan `console.*` dan `debugger` | Tidak ditemukan |
| Scan `any`, `as any`, `as unknown as` | Tidak ditemukan |
| `npm run audit:functions` | 145 kandidat manual review, advisory only |

## File Source >200 Baris

Status: belum sesuai batas file clean code.

Hasil:

| Lines | File |
| ---: | --- |
| 219 | `backend/src/services/orderService.ts` |
| 216 | `backend/src/services/voucherService.ts` |
| 207 | `backend/src/utils/emailContent.ts` |

Catatan:

- File dokumentasi, generated file, dependency, dan migration tidak dihitung sebagai target clean code utama.
- Batas ini harus dipantau setelah refactor booking, voucher, report, atau UI besar berikutnya.

## Function-Length Advisory

Status: dipantau, bukan hard rule mekanis.

Hasil `npm run audit:functions`:

- Total kandidat: 145.
- `frontend/src`: 131 kandidat.
- `backend/src`: 14 kandidat.

Top kandidat terbaru:

| No | File | Line | Function/Component | Lines |
| ---: | --- | ---: | --- | ---: |
| 1 | `frontend/src/pages/user/dashboard/DashboardUpcomingStay.tsx` | 11 | `DashboardUpcomingStay` | 113 |
| 2 | `frontend/src/pages/user/UserReviewsPage.tsx` | 13 | `UserReviewsPage` | 110 |
| 3 | `frontend/src/pages/tenant/tenant-dashboard/TenantRecentReservations.tsx` | 12 | `TenantRecentReservations` | 106 |
| 4 | `frontend/src/pages/tenant/property-form/PropertyImageField.tsx` | 6 | `PropertyImageField` | 104 |
| 5 | `frontend/src/hooks/tenant/room-form/useRoomImageField.ts` | 21 | `useRoomImageField` | 100 |
| 6 | `frontend/src/pages/tenant/categories/CategoryFormModal.tsx` | 15 | `CategoryFormModal` | 91 |
| 7 | `frontend/src/pages/user/BookingDetailPage.tsx` | 12 | `BookingDetailPage` | 89 |
| 8 | `frontend/src/components/common/ImageCropperModal.tsx` | 44 | `ImageCropperModal` | 88 |
| 9 | `frontend/src/pages/user/orders/UserOrdersContent.tsx` | 16 | `UserOrdersContent` | 82 |
| 10 | `frontend/src/pages/user/SavedPropertiesPage.tsx` | 10 | `SavedPropertiesPage` | 78 |
| 11 | `frontend/src/components/property/ReservationPanel.tsx` | 13 | `ReservationPanel` | 73 |
| 12 | `frontend/src/pages/tenant/vouchers/AssignVoucherModal.tsx` | 14 | `AssignVoucherModal` | 70 |
| 13 | `frontend/src/components/tenant/room-form/RoomFormFields.tsx` | 28 | `RoomFormFields` | 69 |
| 14 | `frontend/src/pages/tenant/property-report/PropertyReportContent.tsx` | 95 | `ReportBody` | 69 |
| 15 | `frontend/src/pages/tenant/tenant-dashboard/RevenueTrendChart.tsx` | 9 | `RevenueTrendChart` | 67 |

Catatan:

- `PropertiesListView`, `RoomsListView`, dan `OrderCard` sudah turun dari top kandidat setelah refactor batch 2-4.
- Banyak kandidat berupa JSX presentasional panjang.
- Refactor hanya disarankan jika meningkatkan keterbacaan, reuse, atau pemisahan logic.
- Jangan memecah komponen secara mekanis jika hasilnya lebih sulit dirawat.

## Type Safety dan Debug Residue

Status: residue target sudah selesai.

Perubahan:

- Cast property detail di `propertyDetailService.ts` diganti dengan tipe domain property detail.
- `as any` di `roomStatus.ts` diganti dengan `RoomAvailabilityContext`.
- `ImageCropperModal.tsx` memakai typed adapter untuk `react-easy-crop`.
- `backend/src/scripts/backfill.ts` memakai logger lokal berbasis stdout/stderr.
- Scan `any`, `as any`, `as unknown as`, `console.*`, dan `debugger` pada `backend/src` dan `frontend/src` tidak menemukan residue.

## Clean Code Status

| Area | Status |
| --- | --- |
| File maksimal 200 baris | Belum sesuai, 3 file backend >200 |
| Function maksimal 15 baris | Belum sepenuhnya, 145 kandidat advisory |
| Unused code/import | Frontend lint lulus |
| `console.*` production source | Tidak ditemukan pada scan source |
| `any` / unsafe cast | Tidak ditemukan pada scan source |
| Refactor batch 1-4 | Selesai |

## REST API Guidelines

Status: jalur utama cukup baik.

Endpoint resource-oriented yang digunakan:

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

## Area REST yang Terdampak Hardening

| Area | Dampak REST |
| --- | --- |
| Booking creation | Order dibuat pada tahap `Lanjut ke Pembayaran`; tidak perlu endpoint baru |
| Payment window | Status order tetap memakai resource order/payment yang ada |
| Manual confirmation window | Cron/backend source of truth; UI hanya menampilkan status |
| Referral removal | Selesai pada source flow aktif; `referral_code` tidak lagi digunakan pada booking/voucher/dashboard/reward |
| Voucher simplification | Source flow aktif hanya menerima `PERCENTAGE` dan `FREE_NIGHTS` |
| Domicile removal | Tidak ditemukan pada source aktif |
| Room max 5 dan stock max 20 | Backend menjadi source of truth, frontend hanya UX guard |
| Persistent token blacklist | Tidak mengubah public REST contract |

## Rekomendasi

1. Refactor 3 file backend >200 baris per batch kecil.
2. Lanjutkan function-length refactor per batch kecil, mulai dari area presentasional.
3. Pertahankan typed adapter cropper sebagai workaround React 19/library typing.
4. Pertahankan logger lokal script tanpa output langsung dari console.
5. Jangan hapus legacy REST alias sebelum frontend dan QA benar-benar aman.
6. Jalankan lint/build/test setiap batch.

## Kesimpulan

Clean code sudah membaik pada sisi type-safety dan logging residue: scan target tidak lagi menemukan `any`, `as any`, `as unknown as`, `console.*`, atau `debugger`. Pekerjaan lanjutan utama adalah 3 file backend >200 baris, function-length advisory, dan REST legacy alias.
