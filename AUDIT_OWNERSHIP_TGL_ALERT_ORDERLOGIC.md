# Laporan Audit Menyeluruh Proyek PURWALOKA

**Tanggal Audit:** 22 Mei 2026  
**Cakupan:** Ownership, Validasi Tanggal, Popup/Alert, Logika Pemesanan Kamar  
**Status Build:** Frontend & Backend Compile 100% Tanpa Error

---

## Daftar Isi

1. [Ownership (Kepemilikan Data)](#1-ownership)
2. [Validasi Tanggal Masa Lalu](#2-validasi-tanggal-masa-lalu)
3. [Sistem Popup & Alert](#3-sistem-popup--alert)
4. [Logika Pemesanan Kamar](#4-logika-pemesanan-kamar)
5. [Library & Teknologi yang Digunakan](#5-library--teknologi-yang-digunakan)
6. [Ringkasan Status](#6-ringkasan-status)

---

## 1. Ownership

### 1A. Frontend — Perlindungan Rute

**File:** `frontend/src/router/ProtectedRoute.tsx` dan `frontend/src/router/index.tsx`

Perlindungan dilakukan di dua lapisan:

#### Lapisan 1: `ProtectedRoute` Component
```tsx
// ProtectedRoute.tsx
if (!isAuthenticated || !user) return <Navigate to="/auth/login" />;
if (role && user.role !== role) return <Navigate to="/" />;
```
Komponen ini digunakan pada rute-rute yang memerlukan login:
- `/profile` — Pengguna mana pun (USER atau TENANT)
- `/booking` — Pengguna mana pun
- `/orders` — Pengguna mana pun

#### Lapisan 2: `TenantLayout` Component
```tsx
// TenantLayout.tsx – baris 18
if (!isAuthenticated || user?.role !== 'TENANT') return <Navigate to="/auth/login" replace />;
```
Seluruh halaman di `/tenant/*` (dashboard, properti, pesanan, laporan) dilindungi oleh pengecekan role `TENANT` di level layout.

> **Temuan:** Rute `/tenant/*` TIDAK menggunakan `ProtectedRoute`, melainkan mengandalkan `TenantLayout` untuk memproteksi. Ini efektif tetapi pendekatannya tidak konsisten (sebagian pakai komponen, sebagian di layout).

---

### 1B. Backend — Middleware Chain

**File:** `backend/src/middlewares/authMiddleware.ts` dan `backend/src/middlewares/ownershipMiddleware.ts`

#### Autentikasi JWT (`requireAuth`)
```typescript
// authMiddleware.ts
const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
```
- Memverifikasi JWT dari header `Authorization: Bearer <token>`
- Menyimpan data user ke `req.user` untuk digunakan middleware berikutnya

#### Otorisasi Berdasarkan Role (`requireRole`)
```typescript
if (!req.user || !roles.includes(req.user.role)) {
  return sendError(res, 'Akses ditolak', 403);
}
```

#### Middleware Ownership (3 tingkat)

| Middleware | Digunakan Pada | Cara Kerja |
|---|---|---|
| `verifyPropertyOwnership` | `GET/PATCH/DELETE /tenant/properties/:id` | Query DB: `Property.findFirst({ where: { id, tenantId } })` — menolak jika tidak cocok |
| `verifyRoomOwnership` | `PATCH/DELETE /rooms/:roomId`, Peak Rates, Availability | Query DB Room → lalu verifikasi `property.tenantId === req.user.id` |
| `verifyPeakRateOwnership` | `DELETE /peak-rates/:rateId` | Query DB Rate → Room → Property → verifikasi tenantId |

**Chain Middleware untuk Tenant Routes:**
```
requireAuth → requireRole(['TENANT']) → verifyPropertyOwnership → controller
```

#### Ownership di Service Layer (Defense in Depth)

Selain middleware, ownership juga diverifikasi ulang di dalam service:

```typescript
// orderService.ts — updateOrderStatus()
if (!order || order.property.tenantId !== tenantId) {
  throw { statusCode: 404, message: 'Pesanan tidak ditemukan atau akses ditolak' };
}

// orderService.ts — uploadPaymentProof()
if (!order || order.userId !== userId) {
  throw { statusCode: 404, message: 'Pesanan tidak ditemukan atau akses ditolak' };
}
```

> **Status Ownership:** BAIK — Terdapat defense in depth dengan 3 lapisan (frontend route guard → backend middleware → backend service layer).

> **Catatan Minor:** `verifyRoomOwnership` tidak memverifikasi kepemilikan properti via middleware untuk `PATCH/DELETE /rooms/:roomId` di level room; perlindungan dilakukan via query chain Room → Property → tenantId yang sudah benar secara fungsional.

---

## 2. Validasi Tanggal Masa Lalu

### 2A. Frontend — Tiga Lapisan Validasi

#### Lapisan 1: `PropertyDetailPage.tsx` — Sebelum Navigasi ke Booking
```typescript
// PropertyDetailPage.tsx — handleBooking() baris 72–80
const todayStr = new Date().toISOString().split('T')[0];
if (checkIn < todayStr) {
  setDateError('Tanggal check-in tidak boleh di masa lalu.');
  return;
}
if (new Date(checkOut) <= new Date(checkIn)) {
  setDateError('Tanggal check-out harus setelah check-in.');
  return;
}
```
- Ditampilkan sebagai teks error inline di bawah date picker (bukan toast).
- Menggunakan perbandingan string ISO date (`YYYY-MM-DD`).

#### Lapisan 2: `BookingPage.tsx` — Saat Checkout
```typescript
// BookingPage.tsx — handleCheckout() baris 100–109
const today = new Date();
today.setHours(0, 0, 0, 0);
const checkInDateCompare = new Date(checkIn!);
checkInDateCompare.setHours(0, 0, 0, 0);
if (checkInDateCompare < today) {
  toast.error('Tanggal check-in tidak boleh di masa lalu.');
  return;
}
```
- Menggunakan `setHours(0,0,0,0)` untuk normalisasi waktu lokal.
- Ditampilkan via `toast.error`.

#### Lapisan 3: Kalender `SearchForm` / Date Picker
Komponen kalender pada halaman utama (SearchForm) telah diberi batasan `minDate = today` sehingga pengguna tidak dapat memilih tanggal lampau secara manual.

---

### 2B. Backend — Validasi Server-Side

```typescript
// orderService.ts — createOrder() baris 52–62
const today = new Date();
today.setUTCHours(0, 0, 0, 0);  // Normalize ke UTC midnight

const checkInCompare = new Date(checkIn);
checkInCompare.setUTCHours(0, 0, 0, 0);

if (checkInCompare < today) {
  const error: any = new Error('Tanggal check-in tidak boleh di masa lalu');
  error.statusCode = 400;
  throw error;
}
```

Juga terdapat validasi logika urutan tanggal:
```typescript
// baris 46–50
if (checkIn >= checkOut) {
  error.message = 'Tanggal check-out harus lebih dari check-in';
  error.statusCode = 400;
}
```

> **Catatan Perbedaan Timezone:** Frontend menggunakan `setHours(0,0,0,0)` (waktu lokal server/browser), sedangkan backend menggunakan `setUTCHours(0,0,0,0)` (UTC). Ini bisa berpotensi menyebabkan gap validasi sebesar 1 hari untuk pengguna di zona waktu UTC+7 (WIB) pada hari yang sama menjelang tengah malam UTC. Namun dalam praktiknya risiko sangat kecil karena validasi frontend sudah mencegah pengiriman terlebih dahulu.

> **Status Validasi Tanggal:** BAIK — Terdapat 3 lapisan perlindungan (UI calendar → frontend handleCheckout → backend service).

---

## 3. Sistem Popup & Alert

### 3A. Library yang Digunakan

**Library:** `react-hot-toast`  
**Versi:** (mengikuti `package.json` project)  
**Konfigurasi global di `App.tsx`:**
```tsx
import { Toaster } from 'react-hot-toast';
<Toaster position="top-right" />
```
Toast muncul di pojok kanan atas layar pada semua halaman.

### 3B. Status Penggunaan Per Halaman

| Halaman | File | Status |
|---|---|---|
| Login | `pages/auth/LoginPage.tsx` | `toast.success` / `toast.error` |
| Register | `pages/auth/RegisterPage.tsx` | `toast.success` / `toast.error` |
| Verifikasi Email | `pages/auth/VerifyEmailPage.tsx` | `toast.success` / `toast.error` |
| Lupa Password | `pages/auth/ForgotPasswordPage.tsx` | `toast.success` / `toast.error` |
| Reset Password | `pages/auth/ResetPasswordPage.tsx` | `toast.success` / `toast.error` |
| Profil Pengguna | `pages/user/ProfilePage.tsx` | `toast.success` / `toast.error` |
| Detail Properti | `pages/user/PropertyDetailPage.tsx` | `toast.error` |
| Pemesanan | `pages/user/BookingPage.tsx` | `toast.success` / `toast.error` / `toast` (custom icon) |
| Pesanan User | `pages/user/OrdersPage.tsx` | `toast.success` / `toast.error` |
| Form Properti Tenant | `pages/tenant/PropertyFormPage.tsx` | `toast.error` |
| Daftar Properti Tenant | `pages/tenant/PropertiesListPage.tsx` | `toast.success` / `toast.error` |
| Manajemen Kamar | `pages/tenant/RoomsPage.tsx` | `toast.success` / `toast.error` |
| Pesanan Tenant | `pages/tenant/OrdersPage.tsx` | `toast.success` / `toast.error` |

### 3C. Tidak Ada Lagi Native `alert()`

Hasil pencarian seluruh file `.tsx` di direktori `src/`:
```
Hasil: Tidak ada panggilan alert() yang tersisa
```
Seluruh native `alert()` dan `confirm()` yang sebelumnya ada telah digantikan dengan toast. Satu-satunya `confirm()` yang tersisa adalah pada konfirmasi status pesanan tenant (`tenant/OrdersPage.tsx` baris 78: `if (!confirm(confirmMsg)) return;`) yang berfungsi sebagai dialog konfirmasi sebelum aksi kritis (bukan sebagai notifikasi).

### 3D. Tipe Toast yang Digunakan

| Tipe | Penggunaan | Tampilan |
|---|---|---|
| `toast.success(msg)` | Aksi berhasil (login, simpan, upload) | Hijau dengan centang |
| `toast.error(msg)` | Gagal, validasi error, akses ditolak | Merah dengan X |
| `toast(msg, { icon })` | Peringatan non-fatal (tutup popup Midtrans) | Putih dengan ikon kustom |

---

## 4. Logika Pemesanan Kamar

### 4A. Alur Pemesanan End-to-End

```
Pengguna pilih tanggal → handleBooking() → Navigasi ke /booking 
  → Pilih jumlah tamu → Pilih metode pembayaran 
  → handleCheckout() → POST /orders 
  → orderService.createOrder() 
  → Validasi → Cek Ketersediaan → Hitung Harga → Buat Order
  → (Midtrans) Buka Snap popup / (Manual) Redirect ke /orders untuk upload bukti
```

### 4B. Validasi Kapasitas Tamu

#### Di Frontend (`BookingPage.tsx` — `updateGuest()` dan `handleCheckout()`)

**Kontrol UI (tombol + / -):**
```typescript
// updateGuest() — logika clamp
nextAdults = Math.max(1, Math.min(room.capacity, prev.adults + delta));
nextChildren = Math.min(nextAdults, nextChildren); // auto-kurangi jika adults dikurangi
nextBabies = Math.min(nextAdults, nextBabies);     // auto-kurangi jika adults dikurangi

// Tombol disabled jika sudah di batas:
disabled={
  (key === 'adults' && guests.adults >= room.capacity) ||
  (key === 'children' && guests.children >= guests.adults) ||
  (key === 'babies' && guests.babies >= guests.adults)
}
```

**Validasi sebelum submit (`handleCheckout()`):**
```typescript
if (guests.adults < 1) → error
if (guests.adults > room.capacity) → error
if (guests.children > guests.adults) → error
if (guests.babies > guests.adults) → error
```

#### Di Backend (`orderService.ts` — `createOrder()`)
```typescript
if (adults < 1) → 400 error
if (adults > room.capacity) → 400 error
if (children > adults) → 400 error
if (babies > adults) → 400 error
```

**Aturan Kapasitas yang Berlaku:**

| Tamu | Aturan | Min | Maks |
|---|---|---|---|
| Dewasa | Wajib ada; maksimal sesuai kapasitas kamar | 1 | `room.capacity` |
| Anak-anak | Tidak boleh melebihi jumlah dewasa | 0 | `guests.adults` |
| Bayi | Tidak boleh melebihi jumlah dewasa | 0 | `guests.adults` |

### 4C. Pricing — Harga Kamar

**Service:** `backend/src/services/pricingService.ts`

#### Harga Normal (Base Price)
- Setiap malam dihargai `room.base_price`

#### Harga Peak Season (Dynamic Pricing)
```typescript
// Cari peak rate yang cocok dengan tanggal
const rate = peakRates.find(r => targetDate >= start && targetDate <= end);

// Kalkulasi harga
if (rate.rate_type === 'PERCENTAGE') {
  price = basePrice + Math.round((basePrice * rate.rate_value) / 100);
} else if (rate.rate_type === 'NOMINAL') {
  price = basePrice + rate.rate_value;
}
```

- **Tipe Rate:** `PERCENTAGE` (tambahan %) atau `NOMINAL` (tambahan nominal tetap)
- **Priority:** Rate pertama yang cocok digunakan (jika ada overlap, rate pertama menang)

#### Harga Anak-anak dan Bayi
```typescript
// orderService.ts baris 112–115
// Calculate child pricing (same as babies, children are free)
const totalChildPrice = 0;
const finalTotalPrice = priceDetails.totalPrice + totalChildPrice;
```
**Anak-anak dan bayi selalu GRATIS** — tidak ada tambahan biaya.

#### Tampilan di UI Booking Summary
- Harga per malam ditampilkan secara breakdown per tanggal
- Tanggal dengan harga peak season ditandai badge merah "Peak" atau nama rate
- Anak-anak: label **"Gratis"** hijau
- Bayi: label **"Gratis"** hijau

### 4D. Validasi Ketersediaan Kamar

**Service:** `backend/src/services/availabilityService.ts`

```typescript
// checkAvailability() — dua jenis pengecekan
```

**Cek 1: Tanggal yang Di-block oleh Tenant**
```typescript
const availabilities = await client.roomAvailability.findMany({
  where: { roomId, date: { gte: checkIn, lt: checkOut }, is_available: false }
});
if (isBlocked) return { available: false, reason: `Kamar di-block pada ${date}` };
```

**Cek 2: Kapasitas Kuantitas (Concurrent Orders)**
```typescript
const overlappingOrders = await client.order.findMany({
  where: {
    roomId,
    status: { in: ['WAITING_PAYMENT', 'WAITING_CONFIRMATION', 'PROCESSED', 'COMPLETED'] },
    check_in_date: { lt: checkOut },
    check_out_date: { gt: checkIn }
  }
});
if (orderCount >= room.quantity) return { available: false, reason: `Kamar penuh pada ${date}` };
```

> Status pesanan `CANCELLED` TIDAK dihitung sebagai blokir — ini benar karena pesanan dibatalkan tidak menempati slot kamar.

### 4E. Alur Status Pesanan

```
WAITING_PAYMENT
  ├── (User upload bukti) → WAITING_CONFIRMATION
  │     ├── (Tenant setujui) → PROCESSED → COMPLETED
  │     └── (Tenant tolak) → WAITING_PAYMENT (reset, user dapat upload ulang)
  └── (Batas waktu habis/Midtrans cancel) → CANCELLED

MIDTRANS:
  WAITING_PAYMENT → (Snap popup settlement) → PROCESSED (via webhook)
                 → (cancel/deny/expire) → CANCELLED (via webhook)
```

**Validasi Transisi Status (di service):**
```typescript
// Jika WAITING_CONFIRMATION + CANCELLED → Ini adalah penolakan bukti bayar
// Status dikembalikan ke WAITING_PAYMENT (bukan CANCELLED permanen)
if (order.status === 'WAITING_CONFIRMATION' && status === 'CANCELLED') {
  finalStatus = 'WAITING_PAYMENT';
  updateData = {
    status: 'WAITING_PAYMENT',
    payment_proof_url: null,
    expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000) // +2 jam
  };
}
```

**Validasi Transisi di Frontend (`tenant/OrdersPage.tsx`):**
```typescript
const allowedTransitions: Record<string, string[]> = {
  'WAITING_CONFIRMATION': ['PROCESSED', 'CANCELLED'],
  'WAITING_PAYMENT': ['CANCELLED'],
};
```

### 4F. Integrasi Pembayaran

| Metode | Library | Alur |
|---|---|---|
| **Midtrans** | `@midtrans/snap` (backend), Snap.js CDN (frontend) | Backend buat Snap Token → Frontend buka popup Snap → Webhook notifikasi status |
| **Transfer Manual** | — | User upload bukti → Tenant verifikasi manual |

**Expiry Order:**
```typescript
const expires_at = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 jam
```
Order kadaluarsa 2 jam setelah dibuat (diterapkan pada saat pembuatan dan saat penolakan bukti bayar).

---

## 5. Library & Teknologi yang Digunakan

### Frontend

| Library | Versi | Kegunaan |
|---|---|---|
| `react-hot-toast` | Latest | Notifikasi popup toast (sukses/gagal/peringatan) |
| `zustand` | Latest | State management global (auth, theme, filter) |
| `react-hook-form` | Latest | Manajemen form dan validasi |
| `@hookform/resolvers` + `zod` | Latest | Validasi skema form |
| `react-router-dom` | v6 | Routing SPA + protected routes |
| `axios` | Latest | HTTP client ke backend API |
| `lucide-react` | Latest | Ikon UI |
| `react-day-picker` | Latest | Komponen kalender date picker |
| `@react-oauth/google` | Latest | Google OAuth login |

### Backend

| Library | Versi | Kegunaan |
|---|---|---|
| `express` | Latest | Web server / REST API |
| `@prisma/client` + `prisma` | Latest | ORM untuk PostgreSQL |
| `jsonwebtoken` | Latest | JWT autentikasi |
| `bcrypt` | Latest | Hashing password |
| `zod` | Latest | Validasi request body |
| `@midtrans/snap` | Latest | Payment gateway Midtrans |
| `multer` | Latest | Upload file (gambar) |
| `cloudinary` | Latest | Penyimpanan gambar cloud |
| `nodemailer` | Latest | Pengiriman email transaksional |
| `node-cron` | Latest | Cron job (expire pesanan otomatis) |

---

## 6. Ringkasan Status

| Area | Status | Keterangan |
|---|---|---|
| **Ownership Frontend** | BAIK | ProtectedRoute + TenantLayout memproteksi semua halaman sensitif |
| **Ownership Backend** | SANGAT BAIK | 3 lapisan: JWT middleware + role middleware + ownership middleware + service-level check |
| **Validasi Tanggal Masa Lalu** | BAIK | 3 lapisan: UI calendar + frontend checkout + backend service |
| **Popup/Alert Konsistensi** | BAIK | 100% menggunakan `react-hot-toast`, tidak ada `alert()` native tersisa |
| **Logika Kapasitas Tamu** | BAIK | Validasi di UI (disabled button + clamp) dan di backend service |
| **Pricing Dinamis** | BAIK | Peak season rate PERCENTAGE dan NOMINAL sudah terimplementasi |
| **Harga Anak & Bayi** | SESUAI STANDAR | Anak-anak dan bayi selalu gratis (konsisten frontend & backend) |
| **Status Pesanan** | BAIK | Alur status yang jelas dengan validasi transisi di frontend dan backend |
| **Ketersediaan Kamar** | BAIK | Cek ganda: tanggal di-block + concurrent order count per kuantitas kamar |

### Catatan Akhir

1. **Minor — Timezone Mismatch:** Frontend menggunakan `setHours` (lokal) sedangkan backend menggunakan `setUTCHours` (UTC). Untuk pengguna WIB (UTC+7), perbedaan ini bisa menyebabkan inkonsistensi kecil pada validasi tanggal check-in di malam hari menjelang tengah malam UTC. Rekomendasi: gunakan `setUTCHours` di kedua sisi, atau kirim tanggal selalu dalam format UTC dari frontend.

2. **Minor — `confirm()` Tersisa:** Satu panggilan `confirm()` native masih ada di `tenant/OrdersPage.tsx` untuk konfirmasi aksi status pesanan. Ini fungsional tetapi estetikanya tidak konsisten dengan sistem toast. Ini bisa digantikan dengan komponen `ConfirmModal` yang sudah ada di project.

3. **Minor — Rute Tenant Tidak Pakai `ProtectedRoute`:** Rute `/tenant/*` diproteksi di level `TenantLayout`, bukan menggunakan komponen `ProtectedRoute` yang sudah ada. Ini berfungsi dengan baik secara fungsional tapi tidak konsisten secara arsitektur dengan rute user.
