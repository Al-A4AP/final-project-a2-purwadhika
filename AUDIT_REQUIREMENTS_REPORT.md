# Laporan Audit Requirements

Project: Property Renting Web App  
Dokumen pembanding: `INSTRUCTIONS.md` dan `PURWADHIKA.md`  
Scope audit: struktur project, backend, frontend, database, business logic, UX, validasi, security, dan clean code  
Mode audit: read-only terhadap source code, kecuali pembuatan file laporan ini sesuai permintaan

## Ringkasan Eksekutif

Project sudah memiliki fondasi awal yang cukup jelas untuk final project Property Renting Web App:

- Monorepo dengan folder `backend` dan `frontend`.
- Backend Express + TypeScript + Prisma + PostgreSQL.
- Frontend React + TypeScript + Vite + TailwindCSS.
- JWT authentication dasar.
- Property catalog dasar.
- Tenant dashboard dan CRUD property/room dasar.
- Booking/order dasar.
- Upload payment proof.
- Midtrans integration dasar.
- Review dasar.
- Tenant report sederhana.
- Cron job dasar.

Namun project belum dapat dinyatakan sesuai penuh dengan `INSTRUCTIONS.md` dan `PURWADHIKA.md`. Beberapa requirement wajib masih belum terpenuhi, sebagian masih mock, dan sebagian baru tersedia di data model/API tetapi belum terhubung ke flow bisnis utama.

Area paling kritis:

- Email verification dan set password flow belum benar.
- Role isolation belum aman di backend.
- Dynamic pricing belum diterapkan ke search, detail, dan checkout.
- Availability belum mencegah double booking.
- Booking expiration tidak sesuai brief.
- Order lifecycle belum lengkap.
- Server-side pagination/filter/sort belum diterapkan di semua list.
- Reporting masih minimal.
- Frontend type-check gagal.
- Beberapa file melanggar aturan maksimal 200 baris.

Kesimpulan: project berada di tahap MVP/fondasi fitur, belum production-ready dan belum memenuhi seluruh mandatory requirements.

## Hasil Pemeriksaan Teknis

### Command Yang Dijalankan

Audit dilakukan tanpa menjalankan migrate/seed/build yang berpotensi mengubah output project. Pemeriksaan read-only yang dijalankan:

```bash
npx.cmd tsc --noEmit --pretty false
```

Lokasi: `backend`

Hasil:

- Lolos.

```bash
npx.cmd tsc -p tsconfig.app.json --noEmit --pretty false --incremental false
```

Lokasi: `frontend`

Hasil:

- Gagal.

Error frontend:

- `frontend/src/pages/tenant/ReportsPage.tsx:89`
  - `order.property` is possibly `undefined`.
- `frontend/src/pages/tenant/ReportsPage.tsx:90`
  - `order.user` is possibly `undefined`.
- `frontend/src/pages/user/PropertyDetailPage.tsx:38`
  - route param `id` bisa `undefined`.
- `frontend/src/pages/user/PropertyDetailPage.tsx:39`
  - route param `id` bisa `undefined`.

```bash
npm.cmd run lint
```

Lokasi: `frontend`

Hasil:

- Lolos.

### Git Status Saat Audit

Sebelum pembuatan file laporan ini, status Git menunjukkan:

```txt
?? AUDIT_REPORT.md
?? INSTRUCTIONS.md
```

Artinya `AUDIT_REPORT.md` dan `INSTRUCTIONS.md` sudah berada dalam kondisi untracked sebelum laporan baru ini dibuat.

## Status Kesesuaian Per Area

| Area | Status | Catatan |
|---|---:|---|
| Monorepo frontend/backend | Parsial sesuai | Struktur ada, tetapi root `package.json` belum menjadi workspace/dev script terpadu. |
| Tech stack utama | Sebagian besar sesuai | Stack utama tersedia, namun beberapa dependency tidak dipakai maksimal. |
| Multi-role auth | Parsial | Role ada, tetapi flow route dan guard belum sesuai penuh. |
| Registration | Belum sesuai | Masih input password langsung, bukan email verification lalu set password. |
| Email verification | Belum sesuai | Token dibuat tetapi tidak disimpan/diproses; page verify mock success. |
| Login user/tenant terpisah | Belum sesuai | Hanya `/auth/login`, bukan `/login/user` dan `/login/tenant`. |
| Social login | Belum ada | Tidak ditemukan Google/Facebook/Twitter OAuth flow. |
| Reset password | Parsial | Token hashed dan one-time tersedia, tetapi hanya flow dasar. |
| Profile management | Parsial | Edit profile, avatar, password ada; change email + reverification belum ada. |
| Landing page | Parsial | Ada hero search dan property list, tetapi belum carousel/promotions/testimonials/trending lengkap. |
| Property catalog | Parsial | Pagination/filter/sort dasar ada, tetapi availability/date/price-range belum jalan. |
| Property detail | Parsial | Gallery/rooms/reviews ada, tetapi price calendar, similar properties, sticky booking sidebar belum lengkap. |
| Tenant property CRUD | Parsial | CRUD dasar ada; category CRUD, amenities, province, full image management belum lengkap. |
| Room management | Parsial | CRUD room ada; quantity dan room image belum ada. |
| Peak season rate | Parsial | Model/API ada; belum dipakai di pricing utama. |
| Availability management | Parsial | Tenant bisa set tanggal blocked, tetapi booking tidak memvalidasinya. |
| Booking flow | Parsial | Bisa create order, tetapi belum aman secara business logic. |
| Payment proof upload | Parsial | Upload ada, tetapi deadline dan validasi payment proof belum tepat. |
| Manual tenant confirmation | Parsial | Tenant bisa update status, tetapi transition rules belum ketat. |
| Auto cancellation | Parsial | Cron ada, tetapi deadline 24 jam dan tidak restore availability. |
| Review system | Parsial | Review/reply ada, tetapi belum cek checkout date/COMPLETED. |
| Reports | Parsial rendah | KPI/chart sederhana, belum sesuai filter/sort/report requirement. |
| Email system | Parsial rendah | Email dasar ada, template belum reusable/responsive/professional. |
| Database modeling | Parsial | Relasi dasar ada, tetapi field/index/status/updatedAt belum lengkap. |
| Frontend validation | Parsial | Beberapa form pakai Zod/RHF; belum semua input dan file divalidasi client-side. |
| Backend validation | Parsial | Zod body validation ada; query/params/upload belum lengkap. |
| Security | Parsial | JWT/bcrypt ada; rate limit/env hardening/role guard masih kurang. |
| Responsive UI | Parsial | Banyak class responsive ada, tetapi belum diverifikasi menyeluruh. |
| Accessibility | Parsial rendah | Label dasar ada, tetapi keyboard/focus/semantic/form states belum konsisten. |
| Clean code | Belum sesuai | Ada file >200 baris, banyak `any`, strict false, alert/confirm, komentar dev. |

## Temuan Detail

### 1. Authentication dan Authorization

#### 1.1 Route auth tidak sesuai requirement

Requirement:

- `/register/user`
- `/register/tenant`
- `/login/user`
- `/login/tenant`

Implementasi saat ini:

- Backend hanya punya:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
- Frontend hanya punya:
  - `/auth/register`
  - `/auth/login`

Evidence:

- `backend/src/routes/authRoutes.ts`
- `frontend/src/router/index.tsx`

Dampak:

- Requirement halaman terpisah untuk role USER dan TENANT belum terpenuhi.
- UX role-specific belum jelas.
- Potensi akun salah role karena role dipilih dari dropdown, bukan entry point berbeda.

Rekomendasi:

- Tambahkan route frontend:
  - `/register/user`
  - `/register/tenant`
  - `/login/user`
  - `/login/tenant`
- Backend bisa tetap memakai service yang sama, tetapi endpoint/flow harus memvalidasi role sesuai route.
- Hindari memilih role bebas dari satu dropdown untuk flow final project.

#### 1.2 Registration flow belum sesuai brief

Requirement:

- Registrasi email tidak perlu memasukkan password.
- User menerima email verification.
- Saat verifikasi, user memasukkan password.
- Token hanya berlaku 1 jam dan hanya bisa dipakai sekali.
- User belum verified tidak bisa membuat pesanan.

Implementasi saat ini:

- Register langsung meminta password.
- Password langsung di-hash dan disimpan.
- `verified_at` langsung diisi `new Date()`.
- Verification token dibuat tetapi tidak disimpan ke database.
- Halaman verify email hanya mock success.

Evidence:

- `backend/src/services/authService.ts`
- `frontend/src/pages/auth/RegisterPage.tsx`
- `frontend/src/pages/auth/VerifyEmailPage.tsx`

Dampak:

- Requirement email verification tidak terpenuhi.
- Tidak ada expired verification token handling.
- Tidak ada resend verification email.
- Tidak ada proses set password setelah verification.
- User yang belum verified tidak pernah benar-benar ada dalam flow normal.

Rekomendasi:

- Ubah register agar membuat user dengan `password_hash` kosong/null-compatible atau gunakan pending registration table.
- Simpan hash token di `EmailVerification`.
- Buat endpoint:
  - `POST /api/auth/register/user`
  - `POST /api/auth/register/tenant`
  - `POST /api/auth/verify-email`
  - `POST /api/auth/resend-verification`
- Pada verify email, validasi token:
  - token ada,
  - belum used,
  - belum expired,
  - lalu set password hash dan `verified_at`.
- Login dan booking harus menolak user yang belum verified.

#### 1.3 Social login belum ada

Requirement:

- Google login atau social login lain.

Implementasi:

- Tidak ditemukan OAuth/Google login flow.

Dampak:

- Requirement mandatory auth belum lengkap.

Rekomendasi:

- Implement Google OAuth minimal untuk USER dan TENANT.
- Simpan provider metadata, misalnya `provider`, `provider_id`.
- Reset password hanya berlaku untuk email/password user, bukan social login.

#### 1.4 Role isolation belum kuat

Requirement:

- User tidak boleh mengakses tenant page.
- Tenant tidak boleh memakai user-only features.
- Backend authorization required.

Implementasi:

- Tenant layout sudah redirect jika bukan TENANT.
- User route `profile`, `booking`, `orders` hanya memakai `ProtectedRoute`, tanpa role `USER`.
- Backend create order hanya `requireAuth`, bukan `requireRole(['USER'])`.

Evidence:

- `frontend/src/router/ProtectedRoute.tsx`
- `frontend/src/router/index.tsx`
- `backend/src/routes/orderRoutes.ts`

Dampak:

- Tenant masih bisa memanggil API order creation.
- Role isolation belum end-to-end.

Rekomendasi:

- Tambahkan role guard USER untuk:
  - booking page,
  - user orders,
  - create order API,
  - upload payment proof API,
  - create review API.
- Tambahkan role guard TENANT untuk semua tenant API.
- Tambahkan test manual/API untuk cross-role access.

### 2. Profile Management

Requirement:

- Edit profile.
- Upload profile picture.
- Change password.
- Change email dengan re-verification.
- File avatar jpg/jpeg/png/gif max 1MB.

Implementasi:

- Edit name/phone ada.
- Upload avatar ada.
- Change password ada.
- Change email belum ada; email disabled di UI.
- Upload middleware mengizinkan jpg/jpeg/png/gif dan max 1MB.

Evidence:

- `frontend/src/pages/user/ProfilePage.tsx`
- `backend/src/routes/userRoutes.ts`
- `backend/src/services/userService.ts`
- `backend/src/middlewares/uploadMiddleware.ts`

Dampak:

- Requirement change email + re-verification belum terpenuhi.

Rekomendasi:

- Tambahkan endpoint request email change.
- Kirim token verification ke email baru.
- Jangan update email sampai token valid.
- Setelah email berubah, pertimbangkan invalidasi session lama.

### 3. Landing Page dan User Discovery

Requirement:

- Navigation: logo, search trigger, login/register, become tenant CTA, profile dropdown, mobile menu.
- Hero: large search form, destination selector, date picker, guest count, duration, strong visual imagery.
- Property discovery: featured properties, trending destinations, categories, promotions, testimonials.
- Footer lengkap.

Implementasi:

- Navbar ada.
- Mobile menu ada.
- Login/register ada.
- Search form ada.
- Footer ada.
- Strong visual imagery belum ada; hero masih gradient.
- Search trigger navbar belum ada.
- Become tenant CTA belum menonjol di navbar.
- Featured/trending/categories/promotions/testimonials belum lengkap.

Evidence:

- `frontend/src/pages/user/HomePage.tsx`
- `frontend/src/components/user/SearchForm.tsx`
- `frontend/src/components/common/Navbar.tsx`
- `frontend/src/components/common/Footer.tsx`

Dampak:

- Landing page belum mencapai target premium travel marketplace.
- Belum mirip UX discovery Hipcamp/Airbnb secara lengkap.

Rekomendasi:

- Ganti hero gradient dengan image/real property visual.
- Tambahkan section:
  - featured properties,
  - trending destinations,
  - categories,
  - promotions,
  - testimonials.
- Tambahkan CTA "Become a Tenant" yang jelas.
- Tambahkan profile dropdown, bukan hanya link profil/logout.

### 4. Property Catalog dan Search

Requirement:

- Server-side pagination.
- Server-side filtering.
- Server-side sorting.
- Filter city, category, price range, capacity, availability, property name.
- Sort price asc/desc, name asc/desc, newest.
- Price yang tampil adalah lowest available room price sesuai tanggal.

Implementasi:

- Pagination dasar ada.
- Filtering name/city/category/capacity ada.
- Sorting dasar ada.
- Price range belum diterapkan backend.
- Availability date belum diterapkan backend.
- `check_in_date` dan `check_out_date` ada di interface tetapi tidak dipakai.
- Lowest price masih dari `base_price`, bukan dynamic price dan bukan filtered availability.

Evidence:

- `backend/src/services/propertyService.ts`
- `frontend/src/validations/search.ts`
- `frontend/src/components/user/PropertyCard.tsx`

Dampak:

- Search result bisa menampilkan properti/kamar yang tidak available.
- Harga yang tampil bisa salah saat peak season.
- Requirement utama aplikasi, yaitu komparasi harga berdasarkan tanggal, belum terpenuhi.

Rekomendasi:

- Backend `GET /properties` harus menerima:
  - city,
  - check_in_date,
  - check_out_date,
  - capacity,
  - min_price,
  - max_price,
  - category,
  - search,
  - sort,
  - page,
  - limit.
- Query harus mengecualikan room yang:
  - blocked di `RoomAvailability`,
  - memiliki overlapping order aktif,
  - tidak memenuhi capacity.
- Hitung dynamic price per malam berdasarkan peak rates.
- Return `min_price` dari room available termurah untuk range tanggal tersebut.

### 5. Property Detail

Requirement:

- Large gallery.
- Image carousel.
- Details.
- Amenities.
- Room list.
- Availability calendar.
- Dynamic pricing calendar.
- Reviews.
- Similar properties.
- Sticky booking section.
- Calendar menampilkan daily pricing, unavailable dates, monthly navigation, comparison between dates.

Implementasi:

- Gallery dasar ada.
- Details ada.
- Room list ada.
- Review ada.
- Modal availability dasar ada.
- Amenities tidak ada.
- Dynamic pricing calendar tidak ada.
- Similar properties tidak ada.
- Sticky booking sidebar belum sesuai; CTA booking berada di room card.
- Calendar hanya menunjukkan blocked dates, bukan harga harian.

Evidence:

- `frontend/src/pages/user/PropertyDetailPage.tsx`

Dampak:

- Core UX "komparasi harga berdasarkan tanggal" belum tercapai.
- User belum bisa melihat perbandingan harga antar tanggal minimal satu bulan.

Rekomendasi:

- Tambahkan endpoint daily price calendar:
  - `GET /properties/:id/prices?month=&year=&roomId=`
- Return per date:
  - base price,
  - peak adjustment,
  - final price,
  - available/unavailable,
  - reason jika blocked/booked.
- Tampilkan calendar bulanan dengan harga di setiap date cell.
- Tambahkan sticky booking panel yang menghitung total berdasarkan room + date range.

### 6. Tenant Property Management

Requirement:

- Tenant create/edit/delete property.
- Manage images.
- Manage rooms.
- Manage pricing.
- Manage availability.
- Field property wajib: name, category, description, address, city, province, latitude, longitude, images, amenities.
- Tenant hanya melihat property miliknya.
- Property category CRUD.

Implementasi:

- Property CRUD dasar ada.
- Tenant ownership check ada di beberapa service.
- Upload featured image ada.
- Additional property image API ada.
- UI image management penuh belum terlihat.
- Province belum ada.
- Amenities belum ada.
- Property category CRUD belum ada.
- Tenant property list tidak server-side pagination/filter/sort; sorting dilakukan client-side.

Evidence:

- `backend/src/services/tenantPropertyService.ts`
- `backend/src/routes/tenantRoutes.ts`
- `frontend/src/pages/tenant/PropertiesListPage.tsx`
- `frontend/src/pages/tenant/PropertyFormPage.tsx`

Dampak:

- Beberapa mandatory fields tidak bisa diinput.
- Standardization pagination/filter/sort untuk semua list belum terpenuhi.
- Tenant management belum lengkap.

Rekomendasi:

- Tambahkan field database:
  - province,
  - amenities.
- Tambahkan UI multi-image management.
- Tambahkan property category CRUD khusus tenant/admin sesuai brief.
- Ubah tenant property list agar server-side pagination/filter/sort.

### 7. Room Management

Requirement:

- Satu property bisa punya banyak room.
- Field room: room name/type, capacity, price, description, quantity, images.
- Manage availability.
- Manage peak pricing.

Implementasi:

- Room CRUD ada.
- Room capacity/base_price/description ada.
- `child_price` ada di schema dan frontend type/form, tetapi backend validation tidak memasukkannya.
- Quantity tidak ada.
- Room image tidak ada.
- Peak rate API ada.
- UI create peak rate belum terlihat di RoomsPage walaupun service tersedia.

Evidence:

- `backend/prisma/schema.prisma`
- `backend/src/validations/propertyValidation.ts`
- `frontend/src/pages/tenant/RoomsPage.tsx`
- `frontend/src/services/tenantService.ts`

Dampak:

- Ketersediaan berdasarkan jumlah room/unit belum bisa dimodelkan.
- Double booking prevention sulit karena tidak ada quantity.
- Feature room image belum terpenuhi.
- `child_price` kemungkinan tidak tersimpan dari form karena backend schema tidak menerima field tersebut.

Rekomendasi:

- Tambahkan `quantity` di model Room.
- Tambahkan `RoomImage`.
- Update validation create/update room untuk menerima `child_price` jika memang dipakai.
- Tambahkan UI peak rate CRUD.
- Pisahkan Room form, Availability modal, PeakRate form agar file tidak terlalu besar.

### 8. Peak Season Pricing

Requirement:

- Percentage increase.
- Nominal increase.
- Date range.
- Specific dates.
- Harus mempengaruhi:
  - search result pricing,
  - property detail pricing,
  - checkout pricing.

Implementasi:

- Model `PeakSeasonRate` ada.
- Rate type percentage/nominal ada.
- Create/delete API ada.
- Belum diterapkan di search/detail/checkout.
- Tidak ada helper pricing reusable.

Evidence:

- `backend/prisma/schema.prisma`
- `backend/src/services/tenantRoomService.ts`
- `backend/src/services/orderService.ts`
- `backend/src/services/propertyService.ts`

Dampak:

- Core business requirement belum berjalan.
- Total checkout bisa salah.
- Display price bisa salah.

Rekomendasi:

- Buat shared backend pricing service, misalnya `pricingService.ts`:
  - `getNightlyPrice(roomId, date)`
  - `calculateBookingTotal(roomId, checkIn, checkOut)`
  - `getLowestAvailablePrice(propertyId, dateRange, capacity)`
- Gunakan service ini di:
  - property catalog,
  - property detail price calendar,
  - create order,
  - Midtrans gross amount.

### 9. Availability dan Double Booking

Requirement:

- Tenant bisa block/open dates.
- Unavailable rooms tidak boleh bookable.
- Double booking harus dicegah.
- Auto cancel harus restore availability.

Implementasi:

- Tenant bisa set `RoomAvailability`.
- User bisa melihat blocked dates di modal.
- Create order tidak mengecek `RoomAvailability`.
- Create order tidak mengecek overlapping orders.
- Tidak ada DB-level protection untuk overlap booking.
- Cron cancel tidak restore availability karena order creation tidak pernah mengunci availability.

Evidence:

- `backend/src/services/tenantRoomService.ts`
- `backend/src/services/orderService.ts`
- `frontend/src/pages/user/PropertyDetailPage.tsx`

Dampak:

- User bisa booking tanggal yang blocked.
- User bisa double book kamar yang sama untuk tanggal overlap.
- Data booking bisa tidak valid.

Rekomendasi:

- Saat create order:
  - cek blocked dates pada seluruh malam,
  - cek overlapping orders dengan status aktif,
  - validasi room belongs to property,
  - validasi capacity.
- Gunakan transaction Prisma.
- Untuk room quantity > 1, hitung active overlapping order count < quantity.
- Status aktif minimal:
  - WAITING_PAYMENT,
  - WAITING_CONFIRMATION,
  - PROCESSED.

### 10. Booking dan Transaction Flow

Requirement:

Flow:

1. Search property.
2. Open detail.
3. Select room.
4. Select dates.
5. Calculate price.
6. Checkout.
7. Upload payment proof.
8. Tenant confirmation.
9. Booking processed.

Checkout harus menghitung:

- base price,
- peak season adjustment,
- duration,
- total nights,
- final total.

Implementasi:

- Flow dasar ada.
- Checkout menghitung base price x nights.
- Tidak ada peak season adjustment.
- Tidak ada availability validation.
- Guest count belum dikirim ke backend create order.
- Room/property relation tidak divalidasi saat create order.

Evidence:

- `frontend/src/pages/user/BookingPage.tsx`
- `backend/src/services/orderService.ts`

Dampak:

- Checkout bisa membuat order invalid.
- Harga tidak akurat.
- Requirement komparasi harga belum terpenuhi.

Rekomendasi:

- Tambahkan payload:
  - guest_count,
  - adults,
  - children,
  - babies jika memang dipakai.
- Backend tidak boleh percaya total dari frontend.
- Backend harus menghitung total final.
- Return breakdown pricing ke frontend.

### 11. Order Status dan Payment

Requirement `INSTRUCTIONS.md`:

- WAITING_PAYMENT
- WAITING_CONFIRMATION
- PROCESSED
- CANCELLED
- COMPLETED

Implementasi:

- `COMPLETED` belum ada.

Evidence:

- `backend/prisma/schema.prisma`
- `frontend/src/types/index.ts`
- `backend/src/validations/orderValidation.ts`

Dampak:

- Review dan checkout completion lifecycle tidak bisa dimodelkan sesuai requirement.
- Order yang sudah selesai menginap tidak dibedakan dari order yang sudah diproses.

Rekomendasi:

- Tambahkan `COMPLETED`.
- Buat cron/logic untuk mark completed setelah checkout date lewat.
- Review hanya boleh dibuat jika:
  - order status COMPLETED,
  - user pemilik order,
  - belum pernah review.

#### Payment proof validation

Requirement:

- Payment proof jpg/png only.
- Max 1MB.

Implementasi:

- Upload middleware global mengizinkan jpg/jpeg/png/gif.
- Frontend accept `image/*`, bukan jpg/png saja.

Evidence:

- `backend/src/middlewares/uploadMiddleware.ts`
- `frontend/src/pages/user/OrdersPage.tsx`

Dampak:

- Payment proof bisa menerima GIF, tidak sesuai requirement.

Rekomendasi:

- Pisahkan upload middleware:
  - avatar: jpg/jpeg/png/gif max 1MB.
  - payment proof: jpg/png max 1MB.
  - property image: sesuai kebutuhan.
- Tambahkan client-side validation size/type sebelum upload.

#### Auto cancellation

Requirement:

- Manual payment upload deadline sekitar 1 jam.
- Deskripsi user di brief juga menyebut maksimal 2 jam setelah booking.
- Auto cancel unpaid bookings.

Implementasi:

- Cron membatalkan setelah 24 jam.

Evidence:

- `backend/src/cron.ts`

Dampak:

- Tidak sesuai requirement deadline.

Rekomendasi:

- Tentukan final rule: 1 jam atau 2 jam.
- Simpan `expires_at` di Order.
- Cron query berdasarkan `expires_at`.
- Frontend tampilkan countdown timer.

### 12. Tenant Order Management

Requirement:

- Tenant melihat order berdasarkan status.
- Tenant confirm/reject payment hanya untuk property miliknya.
- Jika reject, status kembali ke Waiting Payment.
- Jika accept, status menjadi Processed.
- Notifikasi ke user.
- Tenant hanya cancel ketika bukti belum upload.

Implementasi:

- Tenant bisa melihat semua order miliknya.
- Tenant bisa update status generic.
- Confirm accept ada via status PROCESSED.
- Reject saat UI memakai CANCELLED, bukan kembali WAITING_PAYMENT.
- Transition rules belum ketat di service.
- Filter status/pagination belum ada.

Evidence:

- `backend/src/services/orderService.ts`
- `frontend/src/pages/tenant/OrdersPage.tsx`

Dampak:

- Status bisa diubah ke state yang tidak valid.
- Requirement reject payment belum terpenuhi.
- List bisa membesar tanpa server-side processing.

Rekomendasi:

- Buat endpoint eksplisit:
  - `PATCH /orders/:id/confirm-payment`
  - `PATCH /orders/:id/reject-payment`
  - `PATCH /orders/:id/cancel`
- Validasi state transition.
- Reject payment:
  - clear payment_proof_url atau simpan rejection history,
  - status kembali WAITING_PAYMENT,
  - set new payment deadline jika requirement meminta.
- Tambahkan pagination/filter/sort server-side.

### 13. Review System

Requirement:

- Review setelah checkout.
- One review per booking.
- Review berupa komentar satu arah.
- Tenant dapat reply menurut `INSTRUCTIONS.md`.

Implementasi:

- Review one per booking dijaga unique `orderId`.
- Tenant reply ada.
- Review diizinkan untuk status PROCESSED, tanpa cek checkout date.
- Tidak ada backend Zod validation untuk rating/comment.
- Rating hanya di frontend input number 1-5.

Evidence:

- `backend/src/services/reviewService.ts`
- `frontend/src/pages/user/OrdersPage.tsx`

Dampak:

- User bisa review sebelum tanggal menginap selesai.
- Input invalid bisa masuk jika memanggil API langsung.

Rekomendasi:

- Tambahkan `COMPLETED`.
- Review hanya boleh jika status COMPLETED atau `check_out_date < now`.
- Tambahkan Zod validation:
  - rating integer 1-5,
  - comment min/max length.
- Batasi tenant reply sesuai policy, misalnya satu reply per review atau thread terbatas.

### 14. Reporting

Requirement:

- Sales report.
- Transaction report.
- Revenue analytics.
- Property occupancy.
- Filter by date range, property, status.
- Sort by date, total sales.
- Visualization charts, KPI cards, calendar occupancy.

Implementasi:

- KPI total revenue dan total order ada.
- Chart by status ada.
- Recent orders ada.
- Tidak ada filter date range/property/status.
- Tidak ada sales report by property/transaction/user.
- Tidak ada sort by date/total sales.
- Tidak ada occupancy calendar.

Evidence:

- `backend/src/services/tenantReportService.ts`
- `frontend/src/pages/tenant/ReportsPage.tsx`

Dampak:

- Report hanya dashboard analytics sederhana, belum memenuhi brief.

Rekomendasi:

- Tambahkan endpoint:
  - `GET /tenant/reports/sales`
  - `GET /tenant/reports/transactions`
  - `GET /tenant/reports/occupancy`
- Query params:
  - start_date,
  - end_date,
  - propertyId,
  - status,
  - sort,
  - order,
  - page,
  - limit.
- Tambahkan occupancy calendar per property/room.

### 15. Email System

Requirement:

- Email verification.
- Reset password.
- Booking confirmation.
- Payment confirmation.
- Booking reminder H-1.
- Booking cancellation.
- Professional, responsive, branded, reusable templates.

Implementasi:

- Email verification function ada, tetapi flow tidak valid.
- Reset password email ada.
- Payment confirmation email ada.
- Reminder H-1 ada via cron.
- Cancellation email ada.
- Booking confirmation terpisah belum jelas.
- Template masih HTML inline sangat sederhana.

Evidence:

- `backend/src/utils/emailService.ts`
- `backend/src/cron.ts`

Dampak:

- Email requirement baru parsial.
- Branding/professional/responsive belum terpenuhi.

Rekomendasi:

- Buat template builder reusable:
  - layout,
  - header,
  - button,
  - footer,
  - responsive inline CSS.
- Tambahkan email booking created/booking confirmation.
- Pastikan verification token flow benar.

### 16. Database Modeling

Requirement:

- Proper relational modeling.
- Enum types.
- Soft delete where necessary.
- createdAt/updatedAt.
- Indexes for performance.
- Critical relations:
  - User -> Property.
  - Property -> Room.
  - Room -> Booking.
  - Booking -> Review.

Implementasi:

- Relasi utama ada.
- Enum role/status/payment/rate ada.
- Soft delete ada di beberapa model.
- `created_at` ada.
- `updated_at` belum ada.
- Index performa belum ada.
- `COMPLETED` belum ada.
- Property belum punya province/amenities.
- Room belum punya quantity/images.
- Order belum punya expires_at.

Evidence:

- `backend/prisma/schema.prisma`

Dampak:

- Query search/report bisa tidak optimal.
- Lifecycle booking belum lengkap.
- Requirement data mandatory belum lengkap.

Rekomendasi:

- Tambahkan `updated_at @updatedAt` ke model utama.
- Tambahkan index:
  - property city/category/deleted_at,
  - room propertyId/deleted_at/capacity,
  - order roomId/check_in/check_out/status,
  - order userId/status,
  - order propertyId/status,
  - review propertyId.
- Tambahkan missing fields:
  - Property province, amenities.
  - Room quantity.
  - RoomImage.
  - Order expires_at.
  - Order completed_at.

### 17. Backend Engineering dan Security

Hal yang sudah ada:

- MVC + service layer.
- JWT middleware.
- Role middleware.
- Zod body validation dasar.
- Multer memory upload.
- Cloudinary upload.
- Global error handler dasar.

Kekurangan:

- `strict` TypeScript false.
- Banyak `any`.
- Validate middleware hanya body, belum query/params.
- Rate limiting belum ada.
- Environment variable validation belum ada.
- Role guards belum diterapkan di semua user-only API.
- State transition order belum aman.
- Upload validation belum kontekstual.

Evidence:

- `backend/tsconfig.json`
- `backend/src/middlewares/validateMiddleware.ts`
- `backend/src/middlewares/authMiddleware.ts`
- `backend/src/services/orderService.ts`

Rekomendasi:

- Aktifkan strict secara bertahap.
- Tambahkan env validation saat app startup.
- Tambahkan rate limit untuk auth endpoints.
- Buat validation middleware untuk body/query/params.
- Gunakan typed error helper, bukan manual `any` error object.
- Tambahkan integration tests untuk auth/order.

### 18. Frontend Engineering

Hal yang sudah ada:

- React Router.
- Zustand auth/filter/theme.
- Axios instance + auth interceptor.
- React Hook Form + Zod di beberapa form.
- Loading skeleton di beberapa halaman.
- Responsive Tailwind classes.

Kekurangan:

- Type-check gagal.
- File besar.
- Banyak alert/confirm native.
- Toast notification dependency tidak terlihat dipakai.
- Route user-only belum role-specific.
- Search form belum menyimpan semua state via form secara rapi.
- Tidak ada code splitting/lazy routes.
- Leaflet dependency ada tetapi map belum dipakai.
- Motion dependency ada tetapi motion belum dipakai.

Evidence:

- `frontend/src/router/index.tsx`
- `frontend/src/services/api.ts`
- `frontend/src/pages/user/PropertyDetailPage.tsx`
- `frontend/src/pages/user/BookingPage.tsx`
- `frontend/src/pages/tenant/RoomsPage.tsx`

Rekomendasi:

- Perbaiki TypeScript errors.
- Pecah file besar:
  - detail gallery,
  - room card,
  - booking panel,
  - availability calendar,
  - review list,
  - tenant room form.
- Ganti `alert`/`confirm` dengan toast/modal reusable.
- Tambahkan protected route role USER untuk user pages.
- Tambahkan lazy loading untuk pages.

### 19. UI/UX dan Accessibility

Hal yang sudah baik:

- UI sudah memakai Tailwind modern.
- Ada card, shadow, rounded, dark mode.
- Ada responsive grid.
- Ada loading skeleton di beberapa tempat.
- Ada empty state dasar.

Kekurangan:

- Hero masih gradient, belum strong visual imagery.
- Global CSS `#root` membatasi width dan text-align center, berpotensi membuat layout app kurang natural.
- Banyak card dengan `rounded-xl`; requirement internal mengarah ke radius 8px atau mengikuti design system, perlu konsistensi.
- Banyak native alert/confirm.
- Toast feedback belum dipakai.
- Calendar price comparison belum ada.
- Mobile booking flow belum terbukti matang.
- Accessibility belum diaudit dengan keyboard/focus secara lengkap.

Evidence:

- `frontend/src/index.css`
- `frontend/src/pages/user/HomePage.tsx`
- `frontend/src/components/user/SearchForm.tsx`
- `frontend/src/pages/user/PropertyDetailPage.tsx`

Rekomendasi:

- Rework root CSS agar app full-width natural.
- Tambahkan real hero image.
- Buat design system kecil:
  - Button,
  - Input,
  - Modal/Dialog,
  - Toast,
  - EmptyState,
  - Skeleton,
  - Pagination,
  - Calendar.
- Pastikan semua button punya disabled/loading state.
- Pastikan focus ring dan label form konsisten.

## Clean Code Findings

### File Lebih Dari 200 Baris

Requirement:

- Maksimal 200 baris per file.

Temuan:

- `backend/prisma/seed.ts`: 386 baris.
- `frontend/src/pages/user/PropertyDetailPage.tsx`: 306 baris.
- `frontend/src/pages/tenant/RoomsPage.tsx`: 226 baris.
- `frontend/src/pages/user/BookingPage.tsx`: 213 baris.
- `frontend/src/types/index.ts`: 208 baris.

Rekomendasi:

- Pecah page besar menjadi komponen kecil.
- Pecah `types/index.ts` menjadi:
  - `types/auth.ts`,
  - `types/property.ts`,
  - `types/order.ts`,
  - `types/review.ts`,
  - `types/tenant.ts`.
- Pecah seed berdasarkan domain data.

### Type Safety

Temuan:

- Backend `strict: false`.
- Frontend `noUnusedLocals: false`.
- Frontend `noUnusedParameters: false`.
- Banyak `any` di backend.

Rekomendasi:

- Aktifkan strict bertahap.
- Buat DTO/request types.
- Hindari `any` pada service/controller.
- Gunakan Prisma generated types.

### Alert/Confirm Native

Temuan:

- Banyak `alert()` dan `confirm()` di frontend.

Dampak:

- UX kurang premium.
- Sulit dikustomisasi dan diuji.

Rekomendasi:

- Gunakan toast untuk success/error.
- Gunakan confirmation dialog untuk destructive actions.
- Gunakan modal untuk payment/review flows.

## Prioritas Rekomendasi

### P0 - Blocker Wajib Sebelum Penilaian Final

1. Perbaiki frontend TypeScript errors.
2. Implement email verification + set password flow.
3. Pisahkan route login/register USER dan TENANT.
4. Tambahkan role guard USER di backend order/review/profile user-only.
5. Implement availability validation dan double booking prevention.
6. Implement pricing service untuk peak season dan gunakan di search/detail/checkout.
7. Tambahkan status `COMPLETED` dan order lifecycle yang benar.
8. Sesuaikan auto-cancel deadline dan tambahkan countdown.
9. Perbaiki payment proof validation agar jpg/png max 1MB.
10. Pastikan tenant reject payment kembali ke WAITING_PAYMENT, bukan langsung CANCELLED.

### P1 - Requirement Penting

1. Tambahkan property category management.
2. Tambahkan province, amenities, room quantity, room images.
3. Tambahkan daily pricing calendar di property detail.
4. Tambahkan server-side pagination/filter/sort untuk tenant property list dan order list.
5. Tambahkan report filter date range/property/status.
6. Tambahkan occupancy calendar.
7. Tambahkan change email + reverification.
8. Tambahkan resend verification email.
9. Tambahkan Google login.
10. Tambahkan booking confirmation email.

### P2 - Production Quality

1. Refactor file >200 baris.
2. Kurangi `any`.
3. Aktifkan TypeScript strict bertahap.
4. Tambahkan environment validation.
5. Tambahkan rate limit auth.
6. Tambahkan reusable UI components.
7. Ganti alert/confirm dengan toast/dialog.
8. Tambahkan code splitting/lazy routes.
9. Tambahkan professional email templates.
10. Tambahkan tests untuk auth/order/pricing.

### P3 - UX Polish

1. Rework landing page dengan visual imagery kuat.
2. Tambahkan featured properties, trending destinations, categories, promotions, testimonials.
3. Tambahkan sticky booking sidebar yang lengkap.
4. Tambahkan similar properties.
5. Tambahkan better mobile booking flow.
6. Tambahkan map view jika Leaflet tetap dipakai.
7. Tambahkan micro-interactions dengan Motion jika memang dibutuhkan.

## Checklist Requirement

### Authentication

- [x] JWT login dasar.
- [x] Password hashing.
- [x] Role field USER/TENANT.
- [ ] Login USER/TENANT terpisah.
- [ ] Register USER/TENANT terpisah.
- [ ] Register tanpa password awal.
- [ ] Email verification valid.
- [ ] Set password saat verification.
- [ ] Expired verification token handling.
- [ ] Resend verification email.
- [ ] Google/social login.
- [x] Forgot password dasar.
- [x] Reset password one-time token.
- [ ] Change email + reverification.
- [ ] Verified-only booking enforcement.

### Property

- [x] Property list.
- [x] Property detail dasar.
- [x] Room list.
- [x] Server-side pagination catalog.
- [x] Filter name/city/category/capacity dasar.
- [x] Sort dasar.
- [ ] Availability filter by date.
- [ ] Price range filter backend.
- [ ] Lowest available dynamic price.
- [ ] Daily price calendar.
- [ ] Similar properties.
- [ ] Amenities.
- [ ] Province.
- [ ] Property category CRUD.

### Tenant

- [x] Tenant dashboard dasar.
- [x] Tenant property CRUD.
- [x] Tenant room CRUD.
- [x] Tenant availability set blocked/open.
- [x] Peak season model/API.
- [ ] Peak season UI lengkap.
- [ ] Peak season effect end-to-end.
- [ ] Room quantity.
- [ ] Room images.
- [ ] Server-side tenant list processing.

### Booking

- [x] Create order dasar.
- [x] Manual payment proof upload.
- [x] Tenant confirmation dasar.
- [x] Midtrans integration dasar.
- [ ] Availability validation.
- [ ] Double booking prevention.
- [ ] Dynamic price calculation.
- [ ] Pricing breakdown.
- [ ] Payment deadline sesuai brief.
- [ ] Countdown timer.
- [ ] Restore availability after cancel.
- [ ] Status COMPLETED.
- [ ] Valid state transitions.

### Review

- [x] Create review.
- [x] One review per order via unique orderId.
- [x] Tenant reply.
- [ ] Review only after checkout/completed.
- [ ] Backend validation rating/comment.

### Reports

- [x] KPI sederhana.
- [x] Chart status sederhana.
- [x] Recent orders.
- [ ] Sales report by property/transaction/user.
- [ ] Date range filter.
- [ ] Property filter.
- [ ] Status filter.
- [ ] Sort by date/total sales.
- [ ] Occupancy calendar.

### Email

- [x] Reset password email.
- [x] Payment confirmation email dasar.
- [x] Booking reminder H-1 dasar.
- [x] Cancellation email dasar.
- [ ] Verification email flow valid.
- [ ] Booking confirmation email lengkap.
- [ ] Professional responsive templates.

### Clean Code

- [ ] Semua file <= 200 baris.
- [ ] Function <= 15 baris secara konsisten.
- [ ] No unused logs/comments.
- [ ] Strict typing.
- [ ] Avoid `any`.
- [ ] No native alert/confirm for production UX.

## Rekomendasi Urutan Perbaikan

Urutan paling aman untuk menyelesaikan requirement:

1. Stabilkan build frontend.
2. Benahi auth dan role isolation.
3. Benahi database schema untuk missing lifecycle fields.
4. Buat pricing service.
5. Buat availability service yang mencegah double booking.
6. Rework order creation memakai transaction + pricing + availability.
7. Tambahkan order expiration + countdown.
8. Tambahkan COMPLETED lifecycle + review rule.
9. Lengkapi property detail calendar.
10. Lengkapi tenant reports.
11. Refactor file besar dan reusable components.
12. Polish UI/UX landing, detail, booking, dashboard.

## Catatan Akhir

Project ini sudah berada di jalur yang benar secara struktur awal, tetapi belum memenuhi definisi akhir dari `INSTRUCTIONS.md`, yaitu production-level property rental marketplace dengan UX premium dan business logic yang kuat.

Fokus terbesar bukan menambah tampilan baru terlebih dahulu, melainkan memastikan aturan bisnis inti benar:

- user/tenant benar-benar terpisah,
- user verified saja yang bisa booking,
- harga selalu akurat sesuai tanggal,
- kamar yang tidak tersedia tidak bisa dipesan,
- double booking tidak mungkin terjadi,
- order lifecycle lengkap,
- report tenant bisa dipakai untuk evaluasi bisnis.

Jika area tersebut sudah kuat, polish UI/UX dan refactor akan jauh lebih efektif.
