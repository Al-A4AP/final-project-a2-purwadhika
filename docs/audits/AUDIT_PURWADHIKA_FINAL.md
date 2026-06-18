# Audit Keseluruhan PURWADHIKA

Tanggal audit: 18 Juni 2026
Project: PURWALOKA - Property Renting Web App  
Acuan: `docs/guidelines/PURWADHIKA.md`

## Ringkasan Eksekutif

Project PURWALOKA sudah memiliki cakupan fitur utama yang luas dan semakin mendekati final-ready. Audit lanjutan 18 Juni 2026 menunjukkan lint/build/test utama lulus, category ownership/limit diperkuat, dan function advisory turun secara aman.

Perubahan penting yang sudah tercermin pada kondisi project:

- Booking order dibuat saat user klik `Lanjut ke Pembayaran`, bukan saat klik `Reservasi`.
- `WAITING_PAYMENT` berlaku 1 jam dan otomatis dibatalkan jika lewat.
- Manual payment `WAITING_CONFIRMATION` berlaku maksimal 2 jam dan otomatis dibatalkan jika tidak dikonfirmasi tenant.
- Persistent token blacklist sudah database-backed dengan SHA256 hash dan cron cleanup.
- Login attempt guard sudah aktif: 5 gagal login -> lock 15 menit.
- Referral sudah dihapus dari booking, voucher, dashboard, dan reward active flow.
- Voucher nominal sudah dihapus dari active flow; voucher aktif hanya `PERCENTAGE` dan `FREE_NIGHTS`.
- Free nights voucher memakai `discountedNights = min(freeNights, stayNights)`, menggratiskan malam termurah terlebih dahulu jika nightly breakdown tersedia, dan tampil sebagai `Gratis X Malam`.
- Zero-payment dari voucher langsung menjadi `PROCESSED` tanpa transaksi Midtrans.
- `domicile_address` sudah tidak ditemukan pada source aktif.
- Rule maksimal 5 jenis kamar dan stock maksimal 20 sudah diterapkan.
- Double booking protection sudah memakai advisory lock, availability recheck, dan atomic voucher update.
- Explore search query inconsistency sudah diselesaikan: tombol `Cari` dan `Terapkan Filter` memakai helper query Explore yang sama.
- Tenant category maksimal 5 milik sendiri; kategori global dan tenant lain tetap dapat dipakai serta tidak dihitung.

Catatan utama: perlindungan double booking tetap membutuhkan manual concurrency QA sebelum dinyatakan selesai secara operasional.

## Resolved Items

Item berikut sudah dipindahkan ke resolved pada source flow aktif:

- Voucher nominal removed dari active flow.
- Referral system removed dari active flow.
- Login empty form stuck.
- Profile resolver bug.
- Free nights voucher bug.
- Upload payment proof flow.
- Whole property availability bug.
- Explore search query inconsistency.
- Persistent token blacklist.
- Login lock protection.

## Verifikasi Terbaru

| Pemeriksaan | Hasil |
| --- | --- |
| Frontend lint | Lulus |
| Frontend build | Lulus |
| Backend build | Lulus |
| Backend ownership test | Lulus, 10/10 |
| File source >200 baris | Tidak ditemukan pada `frontend/src` dan `backend/src` |
| Function length audit advisory | 122 kandidat manual review |
| Frontend function advisory | 109 kandidat |
| Backend function advisory | 13 kandidat |
| `any` / cast residue | Tidak ditemukan pada scan source |
| `console.*` | Tidak ditemukan pada scan source |
| `debugger` | Tidak ditemukan |
| REST API | Jalur utama baik, beberapa legacy alias masih ada |
| Ownership | Test utama lulus |

## Main Features

| Requirement | Status | Catatan |
| --- | --- | --- |
| Web app property renting | Tersedia | User dan tenant flow tersedia |
| Role user dan tenant | Tersedia | Protected route dan backend role middleware tersedia |
| User mencari properti berdasarkan destinasi/tanggal | Tersedia | Homepage dan Explore memakai search/filter/sort/pagination |
| Perbandingan harga/ketersediaan | Tersedia | Detail properti dan modal availability tersedia |
| Tenant kelola harga musiman | Tersedia | Halaman `/tenant/peak-season` tersedia |
| Tenant kelola ketersediaan | Tersedia | Availability calendar dan range update tersedia |
| Tenant punya lebih dari satu room | Tersedia | Rule maksimal 5 jenis kamar sudah diterapkan |
| Tenant melihat laporan penjualan | Tersedia | Reports, property report, occupancy tersedia |
| Review setelah menginap | Tersedia | User review dan tenant reply/delete tersedia |
| Voucher tenant | Tersedia | Percentage dan free nights aktif |

## Feature 1

### Homepage / Landing Page

Status: tersedia.

File terkait:

- `frontend/src/pages/user/HomePage.tsx`
- `frontend/src/pages/user/ExplorePage.tsx`
- `frontend/src/components/user/HeroSection.tsx`
- `frontend/src/components/user/SearchForm.tsx`
- `frontend/src/hooks/user/home/`
- `frontend/src/stores/filterStore.ts`

Catatan:

- Referral promo sudah tidak menjadi bagian flow aktif.
- Search/filter diarahkan ke browse/explore flow.
- Tombol `Cari` dan `Terapkan Filter` pada Explore sudah memakai helper query yang sama agar query tidak divergen.

### User / Tenant Authentication and Profiles

Status: tersedia.

File terkait:

- `backend/src/routes/authRoutes.ts`
- `backend/src/controllers/authController.ts`
- `backend/src/services/authService.ts`
- `backend/src/services/userService.ts`
- `backend/src/services/tokenBlacklistService.ts`
- `frontend/src/pages/auth/`
- `frontend/src/pages/user/ProfilePage.tsx`
- `frontend/src/components/user/profile/`

Catatan:

- Password form resolver sudah diperbaiki agar empty submit tidak stuck loading.
- Persistent token blacklist sudah implemented.
- Login attempt guard sudah implemented.
- Customer profile: User Name, KTP Number, KTP Name, KTP Address, Phone.
- Tenant profile: User Name, Phone, Operational Address.
- `domicile_address` removed dari source aktif.

### Property Catalog dan Search

Status: tersedia.

File terkait:

- `backend/src/routes/propertyRoutes.ts`
- `backend/src/services/propertyService.ts`
- `backend/src/services/propertyList/`
- `frontend/src/pages/user/ExplorePage.tsx`

Catatan:

- REST jalur utama cukup baik.
- Legacy alias dapat dibersihkan setelah regression test aman.

### Property Detail dan Booking Entry

Status: tersedia.

File terkait:

- `frontend/src/pages/user/PropertyDetailPage.tsx`
- `frontend/src/components/property/`
- `backend/src/services/propertyDetailService.ts`
- `backend/src/services/propertyDetail/`

Catatan:

- Flow order tidak dibuat pada klik `Reservasi`.
- Klik `Reservasi` membawa user ke form booking.

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

- Rule maksimal 5 jenis kamar sudah diterapkan.
- Rule stock maksimal 20 sudah diterapkan.
- Rule maksimal 5 kategori milik sendiri per tenant sudah diterapkan di backend.
- Kategori sistem/global dan kategori tenant lain tetap selectable dan tidak mengurangi kuota.
- Edit/delete kategori tetap owner-only; tombol tambah dinonaktifkan saat kuota habis.
- Whole-property/room quantity logic tetap harus memakai backend sebagai source of truth.

## Feature 2

### User Transaction Process

Status: tersedia dan sudah di-hardening.

Flow terbaru:

1. Property Detail.
2. Reservasi.
3. Form Booking.
4. Tinjauan & Persetujuan.
5. Lanjut ke Pembayaran.
6. Order Created (`WAITING_PAYMENT`).
7. Inventory Locked.

File terkait:

- `backend/src/routes/orderRoutes.ts`
- `backend/src/controllers/orderController.ts`
- `backend/src/services/orderService.ts`
- `backend/src/services/order/bookingLocks.ts`
- `backend/src/services/voucherService.ts`
- `backend/src/services/voucher/voucherDiscount.ts`
- `backend/src/services/voucher/voucherPreviewPricing.ts`
- `frontend/src/pages/user/BookingPage.tsx`

Catatan:

- `WAITING_PAYMENT` berlaku 1 jam.
- CTA pembayaran/retry hanya aktif untuk `WAITING_PAYMENT` yang belum expired.
- Inventory release saat auto cancel.
- Voucher transaction timeout sudah diperbaiki.
- Double booking guard sudah implemented, tetapi manual concurrency QA masih wajib.

### Tenant Transaction Management

Status: tersedia.

File terkait:

- `backend/src/services/order/tenantOrderStatus.ts`
- `backend/src/services/order/tenantOrderList.ts`
- `frontend/src/pages/tenant/OrdersPage.tsx`

Catatan:

- Manual payment `WAITING_CONFIRMATION` maksimal 2 jam.
- Jika tenant tidak konfirmasi, sistem auto cancel.
- PII/KTP pada list tenant order tetap perlu data minimization review.

### Voucher

Status: tersedia.

Supported:

- `PERCENTAGE`
- `FREE_NIGHTS`

Removed from active flow:

- `NOMINAL`

Catatan:

- Free nights harus tampil `Gratis X Malam`.
- Free nights memakai `discountedNights = min(freeNights, stayNights)`.
- Jika nightly breakdown tersedia, diskon diterapkan pada malam termurah terlebih dahulu.
- Jika total pembayaran menjadi Rp0, sistem tidak membuat transaksi Midtrans dan order langsung `PROCESSED`.
- Migration destructive untuk legacy enum/data hanya boleh dilakukan setelah konfirmasi.

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
- `frontend/src/pages/tenant/PropertyReportPage.tsx`
- `frontend/src/components/tenant/OccupancyCalendar.tsx`

Catatan:

- Report query/response perlu ditinjau untuk data minimization PII.

## Standardization

### Validation

Status: baik dengan cleanup lanjutan.

- Password form resolver sudah diperbaiki.
- Voucher validation hanya menerima `PERCENTAGE` dan `FREE_NIGHTS`.
- Room max 5 dan stock max 20 sudah divalidasi.
- `domicile_address` sudah tidak ditemukan pada source aktif.
- Category description, property description, dan review comment memiliki batas maksimal 100 karakter.
- Phone regex single source of truth: `^+?[0-9]{8,15}$`.

### Pagination, Filtering, Sorting

Status: sebagian besar tersedia.

Catatan:

- Collection utama sudah memakai pagination/filter/sort di banyak area.
- Tetap perlu regression test browser setelah perubahan UI besar.

### Frontend

Status: buildable dan lint lulus.

Catatan:

- Tidak ada file >200 baris.
- 109 kandidat function/component frontend masih menjadi advisory manual review.

### Backend

Status: buildable dan ownership test lulus.

Catatan:

- Tidak ditemukan file source aktif >200 baris pada `frontend/src` dan `backend/src`.
- 13 kandidat function backend masih menjadi advisory manual review.
- Sisa file >200 baris perlu dibersihkan bertahap.

### Clean Code

Status: membaik pada type/log residue, masih perlu file-size cleanup.

Temuan tersisa:

- Tidak ditemukan file source aktif >200 baris pada `frontend/src` dan `backend/src`.
- 122 function-length advisory candidates.
- Tidak ditemukan `as any`, `as unknown as`, `console.*`, atau `debugger` pada scan source.
- `orderService.ts` sudah turun dari sekitar 377 baris menjadi 184 baris.
- `voucherService.ts` sudah turun dari 203 baris menjadi 116 baris.
- `emailContent.ts` sudah dipecah per domain.

## Rekomendasi Lanjutan

| Prioritas | Rekomendasi | Risiko |
| --- | --- | --- |
| P0/P1 | Manual QA concurrency untuk double booking dan payment expiry | Sedang |
| P1 | PII/data minimization pada order/report list | Sedang |
| P1 | Audit legacy referral/voucher schema sebelum migration | Tinggi jika destructive |
| P2 | Function-length batch kecil | Rendah-sedang |
| P2 | Cleanup folder occupancy kosong | Rendah |
| P2 | REST legacy alias cleanup | Sedang |

## Kesimpulan

Project sudah jauh lebih stabil dibanding audit sebelumnya. Status 18 Juni 2026 adalah **mendekati final-ready**, dengan catatan manual QA concurrency/payment expiry dan privacy minimization masih perlu diselesaikan sebelum klaim final produksi.
