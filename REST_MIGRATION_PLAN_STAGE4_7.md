# Rencana Lanjutan REST API Migration — Tahap 4 sampai 7

**Tanggal:** 02 Juni 2026
**Status saat ini:** Tahap 1-3 selesai

---

## AUDIT STATUS TAHAP 1–3

### Tahap 1 — Orders Action Endpoint (SELESAI)

Kondisi aktual `orderRoutes.ts`:

```
POST /:id/cancellations      <-- BARU (RESTful)
POST /:id/payment-attempts   <-- BARU (RESTful)
PATCH /:id/payment-method    <-- BARU (RESTful)
PATCH /:id/cancel            <-- LAMA (masih ada sebagai compatibility)
POST /:id/midtrans/retry     <-- LAMA (masih ada sebagai compatibility)
PATCH /:id/payment-method/manual <-- LAMA (masih ada sebagai compatibility)
```

Frontend `orderService.ts`: **Belum dimigrasi ke endpoint baru.**
Fungsi `cancelOrder`, `retryMidtransPayment`, `switchPaymentToManual` **tidak ditemukan
di `orderService.ts` saat ini**. Artinya kemungkinan dipanggil langsung dari hook/komponen,
atau belum ada di service. Ini perlu dicek lebih lanjut sebelum menghapus endpoint lama.

**Tindakan sebelum lanjut Tahap 4:**
- Verifikasi bahwa frontend sudah memakai endpoint baru (atau belum ada sama sekali).
- Jika belum: migrasi frontend ke `/cancellations`, `/payment-attempts`, `/payment-method`.
- Jika sudah: endpoint lama bisa ditandai deprecated.

---

### Tahap 2 — User Profile Endpoint (SELESAI)

Kondisi aktual `userRoutes.ts`:

```
PATCH /me                    <-- BARU (RESTful)
PATCH /me/avatar             <-- BARU (RESTful)
PATCH /me/password           <-- BARU (RESTful)
POST  /me/email-change-requests <-- BARU (RESTful)
PATCH /profile               <-- LAMA (compatibility)
PATCH /email-change          <-- LAMA (compatibility)
PATCH /avatar                <-- LAMA (compatibility)
PATCH /change-password       <-- LAMA (compatibility)
```

Frontend `userService.ts`: **Sudah dimigrasi penuh ke endpoint baru.**

```
updateProfile   -> PATCH /users/me           (BARU)
requestEmailChange -> POST /users/me/email-change-requests (BARU)
updateAvatar    -> PATCH /users/me/avatar    (BARU)
changePassword  -> PATCH /users/me/password  (BARU)
```

**Status: Endpoint lama SIAP untuk dihapus.**
Frontend sudah 100% memakai route baru. Endpoint lama (`/profile`, `/avatar`,
`/change-password`, `/email-change`) adalah dead code di backend.

---

### Tahap 3 — Public Geocode dan Availability (SELESAI)

Kondisi aktual:

```
GET /api/locations/geocodes  <-- BARU (locationRoutes.ts)
GET /api/rooms/:roomId/availability <-- BARU (roomRoutes.ts)
GET /api/properties/geocode  <-- LAMA (masih di propertyRoutes.ts)
GET /api/properties/rooms/:roomId/availability <-- LAMA (masih di propertyRoutes.ts)
```

Frontend `locationService.ts`:
```
geocode -> GET /locations/geocodes   (BARU - sudah dimigrasi)
```

Frontend `availabilityService.ts`:
```
getRoomAvailability -> GET /rooms/:roomId/availability (BARU - sudah dimigrasi)
getTenantRoomAvailability -> GET /tenant/rooms/:roomId/availability (tidak berubah)
```

**Status: Endpoint lama SIAP untuk dihapus.**
Frontend sudah 100% memakai route baru.

---

## TEMUAN PENTING — Response Format Tidak Seragam (Tahap 6)

Dari audit controller saat ini, ditemukan **4 pola response berbeda**:

| Pola | Contoh | Controller yang Pakai |
|------|--------|----------------------|
| `sendSuccess/sendError` (standar) | `{ success, data, message }` | `authController`, `orderController`, `userController`, dsb |
| `res.json({ data })` (semi-standar) | `{ data: ... }` | `reviewController`, `tenantReportController` |
| `res.json({ success, data })` (campuran) | `{ success: true, data }` | `tenantReviewController` |
| `res.json({ message, data })` | `{ message: '...', data }` | `reviewController` (create & reply) |

**File yang perlu distandarisasi:**
- `reviewController.ts` — 4 response berbeda
- `tenantReportController.ts` — pakai `{ data }` tanpa `success`
- `tenantReviewController.ts` — pakai `{ success, data }` tapi bukan via `sendSuccess`

Frontend yang terdampak perlu dicek apakah akses `.data.data` atau `.data` langsung.

---

## RENCANA TAHAP 4: Tenant Namespace

### Tujuan
Migrasi `/api/tenant/...` ke `/api/tenants/me/...`

### Kondisi Saat Ini
`tenantRoutes.ts` terdaftar di `server.ts` sebagai:
```
app.use('/api/tenant', tenantRoutes);
```

Frontend `tenantService.ts` menggunakan:
```
/tenant/dashboard
/tenant/properties
/tenant/properties/:id
/tenant/properties/:propertyId/rooms
/tenant/categories
/tenant/rooms/:roomId
/tenant/peak-rates/:rateId
/tenant/reports/occupancy
/tenant/reviews
```

### Perubahan Backend

**`server.ts`** — Tambah mount baru, jangan hapus yang lama:
```typescript
app.use('/api/tenant', tenantRoutes);      // Lama — tetap (compatibility)
app.use('/api/tenants/me', tenantRoutes);  // Baru — alias RESTful
```

Ini cara paling aman: satu file route, dua mount point. Tidak ada perubahan
di `tenantRoutes.ts` sama sekali, tidak ada controller baru.

### Perubahan Frontend

File `frontend/src/services/tenantService.ts` (128 baris):
Ganti semua prefix `/tenant/` menjadi `/tenants/me/`.

> **Peringatan file size:** `tenantService.ts` saat ini 132 baris. Perubahan
> prefix tidak menambah baris. Aman.

Pemetaan perubahan:
```
/tenant/dashboard            -> /tenants/me/dashboard
/tenant/properties           -> /tenants/me/properties
/tenant/properties/:id       -> /tenants/me/properties/:id
/tenant/properties/:id/rooms -> /tenants/me/properties/:id/rooms
/tenant/categories           -> /tenants/me/categories
/tenant/rooms/:roomId        -> /tenants/me/rooms/:roomId
/tenant/peak-rates/:rateId   -> /tenants/me/peak-rates/:rateId
/tenant/reports/occupancy    -> /tenants/me/reports/occupancy
/tenant/reviews              -> /tenants/me/reviews
```

> **Catatan:** `replyToReview` dan `deleteReview` di `tenantService.ts` sudah
> memakai `/reviews/:id/reply` dan `/reviews/:id` (bukan prefix tenant), tidak perlu diubah.

### Urutan Eksekusi Tahap 4
1. Edit `server.ts` — tambah mount `/api/tenants/me` (2 baris tambahan)
2. `npm run build` backend — pastikan tidak ada error
3. Edit `tenantService.ts` frontend — ganti semua prefix
4. Test manual: dashboard, properties, rooms, categories, reports, reviews
5. `npm run build` frontend — pastikan tidak ada error

---

## RENCANA TAHAP 5: Auth Endpoint (Prioritas Rendah)

### Penilaian
Auth endpoint dengan action naming (`login`, `logout`, `verify-email`) adalah
**konvensi yang diterima luas di industri**. Sebagian besar framework dan
dokumentasi REST resmi pun mengecualikan auth dari aturan noun-only.

**Rekomendasi: Tunda atau skip tahap ini.**

Jika tetap ingin dilakukan, perubahan minimal yang aman:

| Endpoint Lama | Endpoint Baru | Prioritas |
|---------------|---------------|-----------|
| `POST /auth/google-login` | `POST /auth/google-sessions` | Rendah |
| `POST /auth/forgot-password` | `POST /auth/password-reset-requests` | Rendah |
| `POST /auth/verify-email` | `POST /auth/email-verifications` | Rendah |
| `POST /auth/login` | Biarkan | Skip |
| `POST /auth/logout` | Biarkan | Skip |
| `GET /auth/me` | Biarkan | Skip |

Dampak: Banyak halaman frontend (`LoginPage`, `ForgotPasswordPage`, `VerifyEmailPage`)
perlu diperbarui. Risiko tinggi, manfaat kosmetik rendah.

---

## RENCANA TAHAP 6: Standarisasi Response Format

### Tujuan
Semua controller menggunakan `sendSuccess` / `sendError` secara konsisten.

### File Terdampak dan Perubahan Detail

#### `reviewController.ts` — 4 respons berbeda, perlu distandarisasi

| Fungsi | Sekarang | Setelah |
|--------|---------|---------|
| `createReviewCtrl` | `{ message, data }` | `sendSuccess(res, review, 'Review berhasil dikirim', 201)` |
| `getPropertyReviewsCtrl` | `{ data }` | `sendSuccess(res, reviews, 'Daftar ulasan')` |
| `replyReviewCtrl` | `{ message, data }` | `sendSuccess(res, reply, 'Balasan berhasil dikirim', 201)` |
| `deleteReviewCtrl` | `{ message }` | `sendSuccess(res, null, 'Ulasan berhasil dihapus')` |

**Cek frontend:** `tenantService.ts` mengakses `.data.data` untuk reply dan delete.
Harus dipastikan frontend tetap bisa menerima format baru.

#### `tenantReportController.ts` — pakai `{ data }` tanpa `success`

| Fungsi | Sekarang | Setelah |
|--------|---------|---------|
| `getDashboardAnalyticsCtrl` | `res.json({ data })` | `sendSuccess(res, analytics, 'Data analytics')` |
| `getOccupancyCalendarCtrl` | `res.json({ data })` | `sendSuccess(res, calendar, 'Data kalender')` |

**Cek frontend:** `tenantService.ts` mengakses `response.data.data`.
Format `sendSuccess` → `{ success, data, message }` → frontend `.data.data` tetap bekerja.
Aman.

#### `tenantReviewController.ts` — pakai `{ success, data }` tanpa helper

Ganti ke `sendSuccess`/`sendError`.

**Cek frontend:** `tenantService.ts` mengakses `response.data.data`.
Aman karena format konsisten.

#### `orderController.ts` baris 93–96 — Midtrans webhook
```typescript
res.status(200).json({ status: 'ok' }); // Midtrans expects 200 OK
```
**Jangan diubah.** Midtrans webhook membutuhkan format ini persis.

### Urutan Eksekusi Tahap 6
1. Standarisasi `tenantReportController.ts` (paling aman, frontend tidak perlu ubah)
2. Standarisasi `tenantReviewController.ts`
3. Standarisasi `reviewController.ts` + verifikasi frontend tidak rusak
4. `npm run build` backend dan frontend

---

## RENCANA TAHAP 7: Hapus Endpoint Lama (Deprecation)

Setelah tahap 4–6 selesai dan diverifikasi:

### Endpoint yang Sudah Aman Dihapus SEKARANG (Frontend Sudah Migrasi)

**`userRoutes.ts`** — 4 endpoint lama (Tahap 2 sudah selesai):
```typescript
// HAPUS INI:
router.patch('/profile', ...)
router.patch('/email-change', ...)
router.patch('/avatar', ...)
router.patch('/change-password', ...)
```

**`propertyRoutes.ts`** — 2 endpoint lama (Tahap 3 sudah selesai):
```typescript
// HAPUS INI:
router.get('/geocode', ...)
router.get('/rooms/:roomId/availability', ...)
```

### Endpoint yang Harus Dicek Dulu Sebelum Dihapus

**`orderRoutes.ts`** — 3 endpoint lama (Tahap 1):
```
PATCH /:id/cancel
POST /:id/midtrans/retry
PATCH /:id/payment-method/manual
```
Perlu audit apakah ada komponen/hook frontend yang memanggil endpoint ini secara langsung
(bukan via `orderService.ts`).

**`server.ts`** — Mount `/api/tenant` lama (setelah Tahap 4 selesai):
```typescript
// HAPUS setelah frontend selesai ke /tenants/me:
app.use('/api/tenant', tenantRoutes);
```

---

## URUTAN EKSEKUSI YANG DISARANKAN

```
Saat ini (Tahap 1-3 selesai)
        |
        v
[A] SEGERA: Hapus endpoint lama userRoutes + propertyRoutes
    (sudah aman, frontend sudah migrasi penuh)
        |
        v
[B] Tahap 6: Standarisasi response controller
    tenantReportController -> tenantReviewController -> reviewController
        |
        v
[C] Tahap 4: Tenant Namespace
    server.ts tambah mount + migrasi tenantService.ts frontend
        |
        v
[D] Tahap 7 lanjutan: Hapus /api/tenant lama dari server.ts
        |
        v
[E] Audit order endpoint lama — hapus jika aman
        |
        v
[F] Tahap 5 (Opsional): Auth strict REST — hanya jika ada waktu
```

---

## CHECKLIST PER TAHAP

### [A] Hapus Endpoint Lama — Langsung Bisa Dilakukan

- [ ] Hapus `PATCH /profile` dari `userRoutes.ts`
- [ ] Hapus `PATCH /email-change` dari `userRoutes.ts`
- [ ] Hapus `PATCH /avatar` dari `userRoutes.ts`
- [ ] Hapus `PATCH /change-password` dari `userRoutes.ts`
- [ ] Hapus `GET /geocode` dari `propertyRoutes.ts`
- [ ] Hapus `GET /rooms/:roomId/availability` dari `propertyRoutes.ts`
- [ ] `npm run build` backend — verifikasi
- [ ] Test frontend — verifikasi tidak ada 404 di profile & availability

### [B] Tahap 6 — Standarisasi Response

- [ ] Perbarui `tenantReportController.ts`
- [ ] Perbarui `tenantReviewController.ts`
- [ ] Perbarui `reviewController.ts`
- [ ] `npm run build` backend
- [ ] Test: review create, reply, delete, laporan tenant

### [C] Tahap 4 — Tenant Namespace

- [ ] Tambah `app.use('/api/tenants/me', tenantRoutes)` di `server.ts`
- [ ] `npm run build` backend
- [ ] Edit `tenantService.ts` — ganti semua prefix `/tenant/` ke `/tenants/me/`
- [ ] `npm run build` frontend
- [ ] Test semua halaman tenant: dashboard, properties, rooms, categories, reports, reviews

### [D] Deprecate `/api/tenant`

- [ ] Hapus `app.use('/api/tenant', tenantRoutes)` dari `server.ts`
- [ ] `npm run build` backend — verifikasi
- [ ] Test browser semua fitur tenant

### [E] Audit dan Hapus Order Lama

- [ ] Search frontend untuk `/cancel`, `/midtrans/retry`, `/payment-method/manual`
- [ ] Jika tidak ada: hapus 3 endpoint lama dari `orderRoutes.ts`
- [ ] `npm run build` backend dan frontend

---

## CATATAN PENTING

> Tahap 4 (Tenant Namespace) adalah yang paling berdampak luas karena
> `tenantService.ts` memanggil lebih dari 15 endpoint. Pastikan build frontend
> berjalan tanpa error sebelum lanjut ke deployment.

> Jangan hapus `/api/tenant` dari `server.ts` sebelum semua halaman tenant
> diverifikasi bekerja melalui `/api/tenants/me`.

> Response format Midtrans webhook di `orderController.ts` baris 93
> (`{ status: 'ok' }`) **jangan diubah** karena Midtrans mengharuskan format ini.
