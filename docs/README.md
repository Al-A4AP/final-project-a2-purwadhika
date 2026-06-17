# Project Documentation

Folder ini menyimpan dokumentasi audit, guideline, handover, dan rencana perbaikan PURWALOKA. Root `README.md` sengaja dibuat ringkas untuk reviewer, mentor, recruiter, dan developer baru; detail audit internal diletakkan di folder ini.

Tanggal sinkronisasi dokumentasi terbaru: 17 Juni 2026.

## Document Map

- `audits/AUDIT_CLEAN_CODE_REST_API_GUIDELINES.md`: audit clean code, function-length advisory lengkap, file >200, residue scan, REST API, dan legacy folder.
- `audits/AUDIT_OWNERSHIP_SECURITY.md`: audit ownership, authorization, storage, PII, token blacklist, booking lock, voucher, dan security.
- `audits/AUDIT_PURWADHIKA_FINAL.md`: audit keseluruhan berdasarkan requirement PURWADHIKA.
- `audits/AUDIT_ZOD_RESOLVER_BUG.md`: histori bug resolver React Hook Form/Zod.
- `plans/RENCANA_PERBAIKAN_DETAIL.md`: backlog aktif dan urutan rekomendasi perbaikan.
- `HANDOVER.local.md`: ringkasan local-only untuk agent/developer berikutnya.
- `guidelines/PURWADHIKA.md`: requirement final project. Jangan diubah tanpa instruksi eksplisit.
- `guidelines/REST_API_GUIDELINES.md`: panduan REST resource naming. Jangan diubah tanpa instruksi eksplisit.
- `guidelines/CODE_LINE_CHECK_GUIDELINES.md`: panduan audit batas baris. Jangan diubah tanpa instruksi eksplisit.
- `guidelines/TOOLS_GUIDELINE.md`: panduan penggunaan tool audit advisory. Jangan diubah tanpa instruksi eksplisit.

## README Policy

README hanya dipertahankan di:

- `README.md` pada root project.
- `docs/README.md` di folder dokumentasi ini.

README di folder `frontend` dan `backend` tidak dibuat ulang.

## Audit Snapshot

| Area | Status aktual |
| --- | --- |
| Tanggal audit | 17 Juni 2026 |
| File source >200 baris | Tidak ditemukan pada `frontend/src` dan `backend/src` |
| Function-length advisory | 137 kandidat |
| Frontend advisory | 122 kandidat |
| Backend advisory | 15 kandidat |
| `any` / `as any` / `as unknown as` | Tidak ditemukan pada scan `frontend/src` dan `backend/src` |
| `console.log` | Tidak ditemukan pada scan `frontend/src` dan `backend/src` |
| `debugger` | Tidak ditemukan pada scan `frontend/src` dan `backend/src` |
| Empty legacy folders | `frontend/src/hooks/tenant/occupancy`, `frontend/src/pages/tenant/occupancy` |
| Occupancy route | Masih ada redirect `/tenant/occupancy` ke `/tenant/property-report` |

## Status Fitur PURWADHIKA

### Fitur 1 - Homepage, Auth, Profile, Property Management

| Requirement PURWADHIKA | Status | Catatan | Folder/file terkait |
| --- | --- | --- | --- |
| Homepage / landing page | Tersedia | Landing page menampilkan hero, search, property section, CTA tenant, dan footer | `frontend/src/pages/user/HomePage.tsx`, `frontend/src/pages/user/home/` |
| Navigation bar | Tersedia | User/tenant layout dan route guard tersedia | `frontend/src/components/layout/`, `frontend/src/router/index.tsx` |
| Hero carousel / promosi | Tersedia | Visual homepage tersedia; konten promo disesuaikan dengan flow aktif | `frontend/src/components/user/HeroSection.tsx` |
| Property list pada homepage | Tersedia | Menampilkan properti dan mengarah ke explore/detail | `frontend/src/pages/user/HomePage.tsx`, `frontend/src/components/property/` |
| Form kota, tanggal, durasi/tamu | Tersedia | Search bar dan explore query helper disatukan | `frontend/src/components/user/search/`, `frontend/src/hooks/user/explore/` |
| Explore property catalog | Tersedia | Pagination/filter/sort dan server-side data tersedia | `frontend/src/pages/user/ExplorePage.tsx`, `backend/src/services/propertyList/` |
| Sort harga termurah/termahal dan nama | Tersedia | Sort diproses melalui query API | `frontend/src/hooks/user/explore/`, `backend/src/services/propertyList/` |
| User/tenant authorization | Tersedia | Protected route dan backend middleware role tersedia | `frontend/src/components/auth/ProtectedRoute.tsx`, `backend/src/middlewares/authMiddleware.ts` |
| User dan tenant registration | Tersedia | Register terpisah user/tenant, email verification flow aktif | `frontend/src/pages/auth/`, `backend/src/services/authService.ts` |
| Email verification dan set password | Tersedia | Token verification dan password setup tersedia | `frontend/src/pages/auth/VerifyEmailPage.tsx`, `backend/src/controllers/authController.ts` |
| Login dan logout | Tersedia | Cookie auth, persistent token blacklist, login attempt guard | `frontend/src/pages/auth/LoginPage.tsx`, `backend/src/services/tokenBlacklistService.ts` |
| Reset password | Tersedia | Forgot/reset password memakai resolver custom | `frontend/src/pages/auth/`, `backend/src/services/authService.ts` |
| Profile user/tenant | Tersedia | Customer: KTP/name/address/phone. Tenant: name/phone/operational address | `frontend/src/pages/user/ProfilePage.tsx`, `frontend/src/components/user/profile/` |
| Property detail | Tersedia | Detail properti, kamar, gallery, map, availability, review | `frontend/src/pages/user/PropertyDetailPage.tsx`, `backend/src/services/propertyDetailService.ts` |
| Property category management | Tersedia | Default category dan tenant category management tersedia | `frontend/src/pages/tenant/CategoriesPage.tsx`, `backend/src/services/categoryService.ts` |
| Tenant property CRUD | Tersedia | Property form/list dan ownership guard tersedia | `frontend/src/pages/tenant/PropertyFormPage.tsx`, `backend/src/services/tenantPropertyService.ts` |
| Tenant room CRUD | Tersedia | Max 5 jenis kamar/property dan stock max 20 | `frontend/src/pages/tenant/RoomsPage.tsx`, `backend/src/services/tenantRoomService.ts` |
| Room availability management | Tersedia | Tenant dapat mengatur blocked dates; occupancy calendar tersedia di property report | `frontend/src/components/tenant/OccupancyCalendar.tsx`, `backend/src/services/availabilityService.ts` |
| Peak season rate management | Tersedia | Halaman khusus `/tenant/peak-season` sebagai pusat pengelolaan | `frontend/src/pages/tenant/PeakSeasonPage.tsx`, `backend/src/services/tenantRoom/` |
| Tenant sales report | Tersedia | Laporan pendapatan dan property report tersedia | `frontend/src/pages/tenant/ReportsPage.tsx`, `frontend/src/pages/tenant/PropertyReportPage.tsx` |

### Fitur 2 - Transaction, Review, Report

| Requirement PURWADHIKA | Status | Catatan | Folder/file terkait |
| --- | --- | --- | --- |
| Room reservation | Tersedia | Order dibuat pada `Lanjut ke Pembayaran`, bukan saat klik `Reservasi` | `frontend/src/pages/user/BookingPage.tsx`, `backend/src/services/orderService.ts` |
| Availability check saat booking | Tersedia | Backend tetap source of truth; recheck dilakukan sebelum write | `backend/src/services/availabilityService.ts`, `backend/src/services/orderService.ts` |
| Double booking protection | Tersedia, perlu QA concurrency manual | Advisory lock + availability recheck + atomic voucher update | `backend/src/services/order/bookingLocks.ts`, `backend/src/services/voucherService.ts` |
| Upload payment proof | Tersedia | Validasi upload dan status `WAITING_CONFIRMATION` | `frontend/src/pages/user/booking/ManualProofUpload.tsx`, `backend/src/middlewares/uploadMiddleware.ts` |
| Payment deadline | Tersedia | `WAITING_PAYMENT` 1 jam, auto-cancel via cron | `backend/src/constants/orderConstants.ts`, `backend/src/cron/` |
| Midtrans payment | Tersedia | Payment/retry aktif hanya saat order valid | `frontend/src/lib/midtransSnap.ts`, `backend/src/services/midtransService.ts` |
| Manual payment confirmation | Tersedia | Tenant approve/reject manual proof; timeout 2 jam | `frontend/src/pages/tenant/OrdersPage.tsx`, `backend/src/services/order/tenantOrderStatus.ts` |
| User order list | Tersedia | Filter, detail, cancel/retry sesuai status | `frontend/src/pages/user/OrdersPage.tsx`, `frontend/src/pages/user/orders/` |
| Tenant order list | Tersedia | Ownership scoped ke tenant property | `frontend/src/pages/tenant/OrdersPage.tsx`, `backend/src/services/order/tenantOrderList.ts` |
| Email order reminder/notification | Tersedia | Email content sudah dipecah per domain | `backend/src/utils/emailService.ts`, `backend/src/utils/emailContent/` |
| User cancel order | Tersedia | Cancel hanya untuk kondisi yang valid | `backend/src/services/order/userCancelOrder.ts` |
| Review setelah checkout | Tersedia | Rating wajib, comment optional max 100 karakter | `frontend/src/pages/user/UserReviewsPage.tsx`, `backend/src/services/reviewService.ts` |
| Tenant reply review | Tersedia | Tenant hanya bisa reply review propertinya sendiri | `frontend/src/pages/tenant/ReviewsPage.tsx`, `backend/src/services/tenantReviewService.ts` |
| Sales report | Tersedia | Filter periode dan KPI pendapatan tersedia | `frontend/src/pages/tenant/ReportsPage.tsx`, `backend/src/services/tenantReportService.ts` |
| Property report / occupancy | Tersedia | Kalender okupasi digabung ke property report; `/tenant/occupancy` redirect | `frontend/src/pages/tenant/PropertyReportPage.tsx`, `frontend/src/components/tenant/occupancy-calendar/` |
| Voucher tambahan | Tersedia sebagai pengembangan | Active flow hanya `PERCENTAGE` dan `FREE_NIGHTS`; `NOMINAL` removed | `frontend/src/pages/tenant/VouchersPage.tsx`, `backend/src/services/voucherService.ts` |

## Booking dan Payment Flow Aktual

```text
Property Detail
-> Reservasi
-> Form Booking
-> Tinjauan & Persetujuan
-> Lanjut ke Pembayaran
-> Order Created (WAITING_PAYMENT)
-> Inventory Locked
```

- Order dibuat saat klik `Lanjut ke Pembayaran`.
- `WAITING_PAYMENT` berlaku 1 jam.
- Jika tidak dibayar/upload bukti dalam 1 jam, order auto-cancel dan inventory release.
- CTA pembayaran/retry hanya aktif untuk `WAITING_PAYMENT` yang belum expired.
- Manual payment setelah upload bukti menjadi `WAITING_CONFIRMATION`.
- `WAITING_CONFIRMATION` berlaku maksimal 2 jam.
- Jika tenant tidak konfirmasi dalam 2 jam, sistem auto-cancel.

## Security and Ownership Notes

- Backend adalah source of truth untuk auth, ownership, availability, booking, payment, voucher, review, dan status order.
- Auth token memakai HTTP-only cookie.
- Persistent token blacklist sudah database-backed dengan SHA256 hash.
- Login attempt guard aktif: 5 gagal login mengunci akun sementara selama 15 menit.
- Ownership test terakhir lulus 7/7.
- PII/KTP response minimization pada order/report list tetap menjadi rekomendasi P1.

## Voucher Flow Aktual

- Voucher aktif hanya `PERCENTAGE` dan `FREE_NIGHTS`.
- Voucher `NOMINAL` tidak tersedia pada form/flow aktif.
- `FREE_NIGHTS` memakai `discountedNights = min(freeNights, stayNights)`.
- Jika nightly breakdown tersedia, diskon diterapkan pada malam termurah terlebih dahulu.
- Jika total menjadi Rp0, order langsung `PROCESSED` dan tidak membuat transaksi Midtrans.

## Clean Code Notes

- `npm run audit:functions` adalah alat bantu audit, bukan hard rule build.
- Function-length advisory terbaru: 137 kandidat.
- File source aktif >200 baris: tidak ditemukan pada `frontend/src` dan `backend/src`.
- Residue scan untuk `any`, unsafe cast, `console.log`, dan `debugger` bersih.
- Refactor terakhir memecah beberapa komponen dashboard, review, saved properties, property report, serta presentational UI.

## Legacy Folder Audit

| Folder | Used? | Import Found? | Recommendation |
| --- | --- | --- | --- |
| `frontend/src/hooks/tenant/occupancy` | Tidak, folder kosong | Tidak | Safe to delete folder kosong |
| `frontend/src/pages/tenant/occupancy` | Tidak, folder kosong | Tidak | Safe to delete folder kosong |
| `frontend/src/components/tenant/occupancy-calendar` | Ya | Ya | Do not delete |
| `/tenant/occupancy` route | Ya, redirect | Ya | Do not delete route tanpa keputusan UX |

## Verification Commands

```bash
npm run audit:functions
cd frontend
npm run lint
npm run build
cd ../backend
npm run build
npm run test:ownership
```

