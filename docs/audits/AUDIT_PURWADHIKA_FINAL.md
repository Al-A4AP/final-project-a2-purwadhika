# Audit Keseluruhan PURWADHIKA

Tanggal audit: 15 Juni 2026  
Project: PURWALOKA - Property Renting Web App  
Acuan: `docs/guidelines/PURWADHIKA.md`

## Ringkasan Eksekutif

Project PURWALOKA sudah memiliki cakupan fitur utama yang luas: homepage, auth user/tenant, profile, catalog, property detail, tenant CRUD, room, category, availability, peak season, booking, payment manual/Midtrans, review, dan report.

Namun berdasarkan audit 15 Juni 2026, project belum boleh dinyatakan final-ready karena masih ada P0/P1 aktif:

- P0: transaction timeout saat voucher digunakan.
- P0: potensi double booking pada request paralel.
- P1: bug profile change password kosong bisa stuck loading.
- P1: referral sudah dilepas dari source flow aktif, tetapi schema/data legacy belum dihapus.
- P1: voucher nominal sudah dilepas dari UI/validation/service aktif, tetapi schema/data legacy belum dihapus.
- P1: `domicile_address` tidak digunakan lagi tetapi masih ada di schema/type/payload.
- P1: rule jenis kamar maksimal 5 sudah diterapkan.
- P1: clean code regression tersisa pada 1 file source >200 baris dan residue type/log.

## Verifikasi Terbaru

| Pemeriksaan | Hasil |
| --- | --- |
| Frontend lint | Lulus |
| Frontend build | Lulus |
| Backend build | Lulus |
| Backend ownership test | Lulus, 7/7 |
| File source >200 baris | 1 file ditemukan |
| Function length audit advisory | 155 kandidat manual review |
| `any`, `debugger`, `console.*` | Masih ada residue `as any`, `as unknown`, dan `console.*` |
| REST API | Jalur utama baik, legacy alias masih ada |
| Ownership | Test utama lulus |

## Main Features

| Requirement | Status | Catatan |
| --- | --- | --- |
| Web app property renting | Tersedia | User dan tenant flow tersedia |
| Role user dan tenant | Tersedia | Protected route dan backend role middleware tersedia |
| User mencari properti berdasarkan destinasi/tanggal | Tersedia | Homepage dan Explore memakai search/filter/sort/pagination |
| Perbandingan harga/ketersediaan | Tersedia | Detail properti dan calendar tersedia |
| Tenant kelola harga musiman | Tersedia | Halaman `/tenant/peak-season` tersedia |
| Tenant kelola ketersediaan | Tersedia | Availability calendar dan range update tersedia |
| Tenant punya lebih dari satu room | Tersedia | Rule maksimal 5 jenis kamar sudah diterapkan |
| Tenant melihat laporan penjualan | Tersedia | Reports, property report, occupancy tersedia |
| Review setelah menginap | Tersedia | User review dan tenant reply/delete tersedia |

## Feature 1

### Homepage / Landing Page

Status: tersedia.

File terkait:

- `frontend/src/pages/user/HomePage.tsx`
- `frontend/src/components/user/HeroSection.tsx`
- `frontend/src/components/user/SearchForm.tsx`
- `frontend/src/hooks/user/home/`
- `frontend/src/stores/filterStore.ts`

Catatan:

- Homepage tidak lagi menampilkan promo referral.
- CTA voucher diarahkan ke penggunaan voucher aktif tenant.

### User / Tenant Authentication and Profiles

Status: tersedia dengan P1 bug.

File terkait:

- `backend/src/routes/authRoutes.ts`
- `backend/src/controllers/authController.ts`
- `backend/src/services/authService.ts`
- `backend/src/services/userService.ts`
- `frontend/src/pages/auth/`
- `frontend/src/pages/user/ProfilePage.tsx`
- `frontend/src/components/user/profile/`

Catatan:

- Change password form masih memakai `zodResolver`.
- Project punya histori bug Zod 4 + `@hookform/resolvers@3.10.0`.
- `domicile_address` tidak lagi dipakai UI tetapi masih ada di schema/type.

### Property Catalog dan Search

Status: tersedia.

File terkait:

- `backend/src/routes/propertyRoutes.ts`
- `backend/src/services/propertyService.ts`
- `backend/src/services/propertyList/`
- `frontend/src/pages/user/ExplorePage.tsx`

Catatan:

- REST jalur utama cukup baik.
- Legacy alias tetap perlu cleanup setelah regression test.

### Property Detail

Status: tersedia.

File terkait:

- `frontend/src/pages/user/PropertyDetailPage.tsx`
- `frontend/src/components/property/`
- `backend/src/services/propertyDetailService.ts`
- `backend/src/services/propertyDetail/`

Catatan:

- Masih ada `as any` di service detail/room status.

### Tenant Property, Room, Category, Availability, Peak Season

Status: tersedia.

File terkait:

- `frontend/src/pages/tenant/PropertiesListPage.tsx`
- `frontend/src/pages/tenant/PropertyFormPage.tsx`
- `frontend/src/pages/tenant/RoomsPage.tsx`
- `frontend/src/pages/tenant/CategoriesPage.tsx`
- `frontend/src/pages/tenant/PeakSeasonPage.tsx`
- `backend/src/routes/tenantRoutes.ts`
- `backend/src/services/tenantPropertyService.ts`
- `backend/src/services/tenantRoomService.ts`
- `backend/src/services/categoryService.ts`

Catatan:

- Rule maksimal 5 jenis kamar sudah diterapkan pada backend dan frontend.
- Whole-property/room quantity logic perlu terus memakai backend sebagai source of truth.

## Feature 2

### User Transaction Process

Status: tersedia dengan P0 risk.

File terkait:

- `backend/src/routes/orderRoutes.ts`
- `backend/src/controllers/orderController.ts`
- `backend/src/services/orderService.ts`
- `backend/src/services/voucherService.ts`
- `frontend/src/pages/user/BookingPage.tsx`

Catatan:

- Create order transaction masih perlu hardening saat voucher digunakan.
- Potensi double booking paralel masih perlu guard atomic.
- `guest_domicile_address` masih ada meski tidak digunakan.

### Tenant Transaction Management

Status: tersedia.

File terkait:

- `backend/src/services/order/tenantOrderStatus.ts`
- `backend/src/services/order/tenantOrderList.ts`
- `frontend/src/pages/tenant/OrdersPage.tsx`

Catatan:

- PII/KTP pada list tenant order perlu data minimization.
- Tenant status flow sudah tidak memicu reward referral, tetapi tetap perlu regression QA.

### Review

Status: tersedia.

File terkait:

- `backend/src/routes/reviewRoutes.ts`
- `backend/src/controllers/reviewController.ts`
- `backend/src/services/reviewService.ts`
- `backend/src/services/tenantReviewService.ts`
- `frontend/src/pages/user/UserReviewsPage.tsx`
- `frontend/src/pages/tenant/ReviewsPage.tsx`

Catatan:

- Ownership test review lulus.

### Report and Analysis

Status: tersedia.

File terkait:

- `backend/src/controllers/tenantReportController.ts`
- `backend/src/services/tenantReport/`
- `frontend/src/pages/tenant/ReportsPage.tsx`
- `frontend/src/pages/tenant/PropertyReportPage.tsx`
- `frontend/src/pages/tenant/OccupancyPage.tsx`

Catatan:

- Report query/response perlu ditinjau untuk data minimization PII.

## Standardization

### Validation

Status: tersedia dengan gap.

Gap:

- Password form perlu custom resolver.
- Voucher validation hanya menerima `PERCENTAGE` dan `FREE_NIGHTS`.
- Room max 5 sudah divalidasi backend.
- `domicile_address` masih divalidasi/payload optional meski tidak digunakan.

### Pagination, Filtering, Sorting

Status: sebagian besar tersedia.

Catatan:

- Collection utama sudah memakai pagination/filter/sort di banyak area.
- Tetap perlu regression test browser setelah referral/voucher non-migration removal.

### Frontend

Status: tersedia dengan clean code gap.

Catatan:

- Build lulus.
- Lint gagal.
- Banyak komponen besar menjadi kandidat review manual.

### Backend

Status: tersedia dengan P0/P1 gap.

Catatan:

- Build lulus.
- `orderService.ts`, `voucherService.ts`, `emailService.ts` melewati 200 baris.
- Transaction order perlu refactor.

### Clean Code

Status: belum final.

Temuan:

- 1 file source >200 baris.
- 155 function-length advisory candidates.
- Lint frontend lulus.
- Masih ada residue `as any`, `as unknown`, `console.*`.

## P0/P1 Rekomendasi

| Prioritas | Rekomendasi | Risiko |
| --- | --- | --- |
| P0 | Refactor create order transaction agar tidak timeout saat voucher | Tinggi |
| P0 | Tambah guard anti double booking paralel | Tinggi |
| P1 | Perbaiki profile password resolver | Rendah |
| P1 | Hapus schema/data legacy referral jika migration disetujui | Tinggi jika migration langsung |
| P1 | Hapus schema/data legacy voucher nominal jika migration disetujui | Sedang-tinggi |
| P1 | Hapus `domicile_address` setelah konfirmasi migration | Sedang |
| P1 | Bersihkan file >200 baris dan residue type/log | Sedang |

## Kesimpulan

Project sudah memiliki fondasi fitur utama yang kuat, tetapi status 15 Juni 2026 adalah **belum final-ready**. Fokus berikutnya sebaiknya P0 transaction/double booking, lalu P1 password form, migration legacy referral/voucher jika disetujui, `domicile_address` removal, dan clean code regression tersisa.
