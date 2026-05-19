# 🖥️ FRONTEND — Instruksi Pengerjaan

> File ini adalah panduan teknis untuk AI agent dalam mengerjakan bagian **frontend** dari Property Renting Web App.

---

## ⚙️ Setup & Inisialisasi

```bash
npm create vite@latest . -- --template react-ts
npm install tailwindcss @tailwindcss/vite
npm install axios
npm install zod
npm install zustand
npm install motion
npm install lucide-react
npm install @supabase/supabase-js
npm install react-router-dom
npm install react-hot-toast             # notifikasi toast
npm install react-datepicker            # kalender/date picker
npm install @types/react-datepicker
```

### Konfigurasi Tailwind CSS v4
Di `vite.config.ts`:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

Di `src/index.css`:
```css
@import "tailwindcss";
```

---

## 📁 Struktur Folder Frontend

```
src/
├── assets/                    # Gambar, icon, font statis
├── components/
│   ├── common/                # Button, Input, Modal, Badge, Spinner, Pagination
│   ├── layout/                # Navbar, Footer, Sidebar, PageWrapper
│   ├── user/                  # Komponen khusus halaman user
│   └── tenant/                # Komponen khusus halaman tenant
├── pages/
│   ├── user/
│   │   ├── HomePage.tsx
│   │   ├── PropertyListPage.tsx
│   │   ├── PropertyDetailPage.tsx
│   │   ├── OrderPage.tsx
│   │   ├── OrderListPage.tsx
│   │   └── ProfilePage.tsx
│   ├── tenant/
│   │   ├── TenantDashboardPage.tsx
│   │   ├── PropertyManagePage.tsx
│   │   ├── RoomManagePage.tsx
│   │   ├── OrderManagePage.tsx
│   │   └── SalesReportPage.tsx
│   └── auth/
│       ├── LoginPage.tsx
│       ├── RegisterPage.tsx
│       ├── VerifyEmailPage.tsx
│       └── ResetPasswordPage.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useProperty.ts
│   ├── useOrder.ts
│   └── useDebounce.ts
├── stores/
│   ├── authStore.ts            # Zustand — user session & profile
│   ├── propertyStore.ts        # Zustand — property list & filter state
│   └── orderStore.ts           # Zustand — order state
├── services/
│   ├── api.ts                  # Axios instance + interceptors
│   ├── authService.ts
│   ├── propertyService.ts
│   ├── roomService.ts
│   ├── orderService.ts
│   ├── reviewService.ts
│   ├── reportService.ts
│   └── uploadService.ts        # Cloudinary upload helper
├── lib/
│   ├── supabaseClient.ts       # Supabase JS client init
│   ├── locationiq.ts           # LocationIQ helper functions
│   └── utils.ts                # Format date, currency, dll
├── types/
│   ├── auth.types.ts
│   ├── property.types.ts
│   ├── room.types.ts
│   ├── order.types.ts
│   └── review.types.ts
├── validations/
│   ├── authValidation.ts       # Zod schemas untuk login, register
│   ├── propertyValidation.ts
│   ├── orderValidation.ts
│   └── reviewValidation.ts
├── router/
│   └── AppRouter.tsx           # React Router v6 — semua routes
├── App.tsx
└── main.tsx
```

---

## 🔀 Routing & Proteksi Halaman

Gunakan **React Router v6** dengan `<Navigate>` untuk route protection.

```tsx
// router/AppRouter.tsx
// Pola route protection:
// - /user/* → hanya role "user"
// - /tenant/* → hanya role "tenant"
// - /auth/* → hanya jika belum login
// - / → public (homepage)

// ProtectedRoute wrapper:
// Cek authStore → jika belum login, redirect ke /auth/login
// Cek role → jika salah role, redirect ke homepage
```

**Daftar Routes Lengkap:**

| Path                            | Halaman                        | Akses       |
|---------------------------------|--------------------------------|-------------|
| `/`                             | Homepage / Landing Page        | Public      |
| `/properties`                   | Property List                  | Public      |
| `/properties/:id`               | Property Detail                | Public      |
| `/auth/login`                   | Login (user)                   | Guest only  |
| `/auth/login/tenant`            | Login (tenant)                 | Guest only  |
| `/auth/register`                | Register (user)                | Guest only  |
| `/auth/register/tenant`         | Register (tenant)              | Guest only  |
| `/auth/verify-email`            | Verifikasi email + set password| Guest only  |
| `/auth/reset-password`          | Kirim link reset password      | Guest only  |
| `/auth/confirm-reset-password`  | Konfirmasi + password baru     | Guest only  |
| `/user/profile`                 | Profil user                    | User only   |
| `/user/orders`                  | Riwayat pesanan user           | User only   |
| `/user/orders/:id`              | Detail pesanan                 | User only   |
| `/tenant/dashboard`             | Dashboard tenant               | Tenant only |
| `/tenant/properties`            | Kelola properti                | Tenant only |
| `/tenant/properties/:id/rooms`  | Kelola room                    | Tenant only |
| `/tenant/orders`                | Kelola pesanan                 | Tenant only |
| `/tenant/reports`               | Laporan penjualan              | Tenant only |

---

## 🔐 Autentikasi (Supabase + Google Login)

### Inisialisasi Supabase Client
```ts
// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

### Zustand Auth Store
```ts
// stores/authStore.ts
// State: user | null, role: 'user' | 'tenant' | null, isLoading
// Actions: login, logout, setUser, refreshSession
// Persist session menggunakan Supabase onAuthStateChange
```

### Google Login
```ts
// Gunakan supabase.auth.signInWithOAuth({ provider: 'google' })
// Setelah callback, cek role dari tabel users/tenants di DB
// Simpan ke authStore
```

### Alur Register Email
1. User isi form → POST ke `/api/auth/register`
2. Backend kirim email verifikasi berisi link dengan token (exp: 1 jam)
3. User klik link → halaman `/auth/verify-email?token=xxx`
4. User isi password → POST ke `/api/auth/verify-email`
5. Redirect ke halaman login

---

## 🏘️ Fitur — Homepage / Landing Page

**Komponen yang harus ada:**
- `Navbar` — menu navigasi, tombol login/register, nama user jika sudah login
- `HeroCarousel` — carousel promosi menggunakan Motion atau library carousel
- `SearchForm` — dropdown kota (dari LocationIQ), date picker tanggal check-in, input durasi, jumlah tamu
- `PropertyList` — list properti featured (max 6 item)
- `Footer` — info aplikasi, link navigasi

**SearchForm Logic:**
```tsx
// State: destinationCity, checkInDate, duration, guestCount
// LocationIQ: fetch cities Indonesia berdasarkan input user (debounced)
// Saat submit → navigate ke /properties?city=...&checkIn=...&duration=...&guests=...
```

---

## 🔎 Fitur — Property List & Search

**Query Params dari URL:**
- `city`, `checkIn` (YYYY-MM-DD), `duration` (number), `guests` (number)
- `page`, `limit` (pagination)
- `sortBy`: `name_asc` | `name_desc` | `price_asc` | `price_desc`
- `category` (filter by category)
- `search` (filter by property name)

**Server-side processing** — semua filter, sort, pagination dikirim ke backend via query params.

**UI yang harus ada:**
- Filter bar: input nama, dropdown kategori, sort selector
- Property card: foto, nama, kota, harga terendah per malam (dari room termurah yang available), badge kategori
- Pagination component
- Loading skeleton saat fetching
- Empty state jika tidak ada hasil

---

## 🏠 Fitur — Property Detail

**Konten halaman:**
- Foto properti (carousel jika lebih dari 1)
- Nama, kategori, lokasi, deskripsi
- Room list — setiap room ditampilkan dengan harga per malam
- **Price Calendar** — kalender interaktif menampilkan harga per tanggal (min 1 bulan)
  - Harga normal = base price room
  - Harga peak = base price ± persentase/nominal sesuai konfigurasi tenant
  - Tanggal tidak tersedia = ditampilkan dengan warna berbeda / disabled
- Tombol "Pesan Sekarang" → redirect ke `/user/orders/new` (jika sudah login) atau prompt login

---

## 📦 Fitur — User Order

### Buat Pesanan Baru
- Form konfirmasi: nama properti, room, tanggal, durasi, total harga
- POST ke `/api/orders` → dapat `orderId` dan batas waktu bayar
- Redirect ke halaman detail order

### Upload Bukti Bayar
- Input file: hanya `.jpg` / `.png`, max 1MB — validasi dengan Zod
- Upload ke **Cloudinary** terlebih dahulu → dapat URL
- PATCH ke `/api/orders/:id/payment-proof` dengan URL gambar
- Countdown timer sampai batas waktu (1 jam) — jika habis, order dibatalkan otomatis

### Order List (User)
- Tab: "Aktif", "Selesai", "Dibatalkan"
- Filter: tanggal, nomor order
- Pagination server-side

### Cancel Order
- Hanya bisa dibatalkan sebelum upload bukti bayar
- Modal konfirmasi sebelum proses cancel

---

## 🏗️ Fitur — Tenant: Kelola Properti

### Property List (Tenant)
- Tabel properti milik tenant dengan kolom: nama, kategori, jumlah room, status
- Tombol: tambah, edit, hapus (konfirmasi modal)

### Form Tambah / Edit Properti
- Field: Nama, Kategori (dropdown dari API), Deskripsi, Foto (upload Cloudinary)
- Validasi: semua field required, foto max 1MB, format `.jpg/.jpeg/.png`

### Room Management
- Per-properti: list room dengan nama, harga, deskripsi
- Form tambah/edit room: Nama room, Harga dasar, Deskripsi
- Set ketersediaan room: pilih rentang tanggal → room tersedia / tidak tersedia

### Peak Season Rate
- Pilih tanggal atau rentang tanggal
- Tipe perubahan harga: `PERCENTAGE` atau `NOMINAL`
- Nilai: angka positif (kenaikan) atau negatif (penurunan)
- Preview harga setelah adjustment

---

## 📋 Fitur — Tenant: Kelola Order

- Tabel pesanan masuk, difilter per status
- Aksi: **Terima** atau **Tolak** bukti bayar (tampilkan gambar bukti di modal)
- Tolak → status kembali ke "Menunggu Pembayaran"
- Terima → status "Dikonfirmasi" + kirim email otomatis ke user (via backend)
- Cancel order yang belum ada bukti bayar (konfirmasi modal)

---

## ⭐ Fitur — Review

- Hanya muncul setelah tanggal checkout
- Form: textarea komentar (required)
- Satu review per satu transaksi
- Tenant bisa balas review (textarea, satu balasan per review)
- Tampilkan review di halaman Property Detail

---

## 📊 Fitur — Laporan (Tenant)

### Sales Report
- Tab / filter: berdasarkan Property, Transaction, atau User
- Filter date range (dari–sampai)
- Sort: tanggal, total penjualan
- Export/print opsional
- Tabel dengan pagination

### Property Report (Kalender)
- Kalender visual per-properti menampilkan status ketersediaan setiap hari
- Warna berbeda: tersedia (hijau), dipesan (merah/abu), tidak aktif

---

## 🖼️ Upload Gambar dengan Cloudinary

```ts
// services/uploadService.ts
// Gunakan unsigned upload preset dari Cloudinary dashboard
// Endpoint: https://api.cloudinary.com/v1_1/{cloud_name}/image/upload

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  )
  const data = await res.json()
  return data.secure_url
}
```

**Validasi sebelum upload (Zod):**
```ts
const imageSchema = z.object({
  file: z
    .instanceof(File)
    .refine(f => f.size <= 1_000_000, 'Ukuran file maksimal 1MB')
    .refine(
      f => ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(f.type),
      'Format hanya .jpg, .jpeg, .png, .gif'
    ),
})
```

---

## 📍 LocationIQ — Kota Destinasi

```ts
// lib/locationiq.ts
// Gunakan API key dari VITE_LOCATIONIQ_API_KEY
// Endpoint: https://us1.locationiq.com/v1/autocomplete
// Query: fokus ke Indonesia (countrycodes=id)

export const searchCities = async (query: string) => {
  const res = await axios.get('https://us1.locationiq.com/v1/autocomplete', {
    params: {
      key: import.meta.env.VITE_LOCATIONIQ_API_KEY,
      q: query,
      countrycodes: 'id',
      limit: 5,
      format: 'json',
    },
  })
  return res.data
}
```

Gunakan `useDebounce` (300ms) sebelum memanggil API LocationIQ.

---

## 🧰 Axios Setup

```ts
// services/api.ts
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // jika pakai cookie session
})

// Request interceptor — attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') // atau dari Supabase session
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor — handle 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      // logout dan redirect ke login
    }
    return Promise.reject(err)
  }
)

export default api
```

---

## ✅ Aturan Validasi Zod (Client-Side)

Buat schema Zod di folder `validations/`. Semua form harus menggunakan schema Zod.

```ts
// validations/authValidation.ts
import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Format email tidak valid'),
})

export const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

export const setPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password minimal 8 karakter'),
    confirmPassword: z.string(),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword'],
  })
```

---

## 🎨 Design System — Terinspirasi Hipcamp

> Gaya visual mengacu pada **Hipcamp** — clean, photo-forward, warm & inviting —
> namun difokuskan pada kategori **hotel, apartemen, rumah, dan kost** di Indonesia.
> Kesan yang ingin dibangun: **modern, hangat, terpercaya, dan mudah digunakan**.

---

### 🎨 Color Palette & Dark Mode

Gunakan CSS custom properties di `src/index.css`. Sistem tema mendukung tiga mode:
**Light** (default), **Dark**, dan **System** (mengikuti preferensi perangkat).

```css
/* src/index.css */
@import "tailwindcss";

@layer base {

  /* ── LIGHT MODE (default) ── */
  :root {
    /* Primary — Hijau hangat, terinspirasi Hipcamp */
    --color-primary-50:  #f0fdf4;
    --color-primary-100: #dcfce7;
    --color-primary-200: #bbf7d0;
    --color-primary-500: #22c55e;
    --color-primary-600: #16a34a;  /* tombol utama & aksen */
    --color-primary-700: #15803d;
    --color-primary-900: #14532d;

    /* Neutral — Warm gray */
    --color-neutral-50:  #fafaf9;
    --color-neutral-100: #f5f5f4;
    --color-neutral-200: #e7e5e4;
    --color-neutral-400: #a8a29e;
    --color-neutral-600: #57534e;
    --color-neutral-800: #292524;
    --color-neutral-900: #1c1917;

    /* Accent — Oranye hangat untuk badge & peak price */
    --color-accent-400: #fb923c;
    --color-accent-500: #f97316;
    --color-accent-600: #ea580c;

    /* Semantic */
    --color-success: #16a34a;
    --color-warning: #d97706;
    --color-error:   #dc2626;
    --color-info:    #0284c7;

    /* Surface (token yang dipakai komponen) */
    --color-bg:           #fafaf9;   /* background halaman */
    --color-surface:      #ffffff;   /* background card, modal */
    --color-surface-2:    #f5f5f4;   /* background input, badge */
    --color-border:       #e7e5e4;
    --color-text:         #292524;   /* body text utama */
    --color-text-muted:   #57534e;   /* text sekunder */
    --color-text-subtle:  #a8a29e;   /* placeholder */
    --color-heading:      #1c1917;
  }

  /* ── DARK MODE ── */
  /* Aktif saat class "dark" ada di <html>, ATAU saat system prefer dark (lihat JS) */
  .dark {
    --color-bg:           #18181b;   /* zinc-900 */
    --color-surface:      #27272a;   /* zinc-800 */
    --color-surface-2:    #3f3f46;   /* zinc-700 */
    --color-border:       #3f3f46;
    --color-text:         #f4f4f5;   /* zinc-100 */
    --color-text-muted:   #a1a1aa;   /* zinc-400 */
    --color-text-subtle:  #71717a;   /* zinc-500 */
    --color-heading:      #ffffff;

    /* Primary sedikit lebih terang agar kontras di dark bg */
    --color-primary-600:  #22c55e;
    --color-primary-700:  #16a34a;
    --color-primary-50:   #14532d;
    --color-primary-100:  #166534;
  }

  body {
    font-family: var(--font-body);
    background-color: var(--color-bg);
    color: var(--color-text);
    -webkit-font-smoothing: antialiased;
    transition: background-color 0.2s ease, color 0.2s ease;
  }
}
```

---

### 🌗 Dark Mode — Implementasi Lengkap

#### 1. Zustand Theme Store
```ts
// stores/themeStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface ThemeStore {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'  // hasil akhir setelah resolve "system"
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark' : 'light',

      setTheme: (theme) => {
        const resolved = theme === 'system'
          ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
          : theme
        applyTheme(resolved)
        set({ theme, resolvedTheme: resolved })
      },
    }),
    { name: 'theme-preference' }  // disimpan ke localStorage
  )
)

// Helper: toggle class "dark" di <html>
function applyTheme(resolved: 'light' | 'dark') {
  const root = document.documentElement
  if (resolved === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
}
```

#### 2. Init di `main.tsx` (sebelum render)
```tsx
// main.tsx
// Jalankan sebelum ReactDOM.createRoot agar tidak ada flash of wrong theme (FOWT)

const stored = localStorage.getItem('theme-preference')
const pref: string = stored ? JSON.parse(stored).state?.theme ?? 'system' : 'system'

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const resolved = pref === 'dark' || (pref === 'system' && prefersDark)

if (resolved) document.documentElement.classList.add('dark')

// Listener untuk perubahan system preference secara real-time
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  const currentPref = JSON.parse(
    localStorage.getItem('theme-preference') ?? '{}'
  ).state?.theme
  if (currentPref === 'system') {
    if (e.matches) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }
})
```

#### 3. Komponen ThemeToggle
```tsx
// components/common/ThemeToggle.tsx
// Tombol toggle 3 opsi: Light | Dark | System
// Tampilkan icon: Sun (light), Moon (dark), Monitor (system) — dari lucide-react
// Letakkan di Navbar kanan, sebelum tombol auth
// Gunakan useThemeStore untuk get & set theme
// Saat klik, panggil setTheme() — class "dark" di <html> otomatis berubah
```

**UI ThemeToggle:**
```
Tampilan: pill dengan 3 icon (Sun / Moon / Monitor)
Icon aktif: bg-[var(--color-primary-600)] text-white rounded-lg
Icon non-aktif: text-[var(--color-text-muted)] hover:text-[var(--color-text)]
Ukuran: h-9, setiap icon p-2
Animasi: motion whileTap scale-90, transition 150ms
```

#### 4. Panduan class di komponen
```
JANGAN pakai warna hardcode seperti: bg-white, text-gray-900, border-gray-200
SELALU pakai CSS var token yang sudah didefinisikan:

bg-[var(--color-bg)]          → background halaman
bg-[var(--color-surface)]     → card, modal, navbar
bg-[var(--color-surface-2)]   → input, badge, tab
border-[var(--color-border)]  → semua border
text-[var(--color-text)]      → body text
text-[var(--color-text-muted)] → text sekunder
text-[var(--color-heading)]   → semua heading
text-[var(--color-text-subtle)] → placeholder

Pengecualian yang BOLEH hardcode:
- Tombol primary: bg-[var(--color-primary-600)] (sudah override di .dark)
- Warna semantic (success/error/warning): tetap pakai var masing-masing
- Foto & gambar: tidak perlu dark mode treatment
```

**Panduan penggunaan warna (berlaku di light & dark):**
| Elemen                        | Token CSS Var                   |
|-------------------------------|---------------------------------|
| Tombol primary (CTA)          | `--color-primary-600`           |
| Tombol hover                  | `--color-primary-700`           |
| Background halaman            | `--color-bg`                    |
| Background card               | `--color-surface`               |
| Background input / badge      | `--color-surface-2`             |
| Heading (h1–h3)               | `--color-heading`               |
| Body text                     | `--color-text`                  |
| Text sekunder / label         | `--color-text-muted`            |
| Placeholder input             | `--color-text-subtle`           |
| Border card / input           | `--color-border`                |
| Badge harga peak / promo      | `--color-accent-500`            |
| Status "Dikonfirmasi"         | `--color-success`               |
| Status "Menunggu"             | `--color-warning`               |
| Status "Dibatalkan"           | `--color-error`                 |

---

### ✍️ Typography

Gunakan **Google Fonts** — dua typeface saja:

```html
<!-- index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Lora:wght@600;700&display=swap" rel="stylesheet">
```

```css
/* src/index.css */
@layer base {
  :root {
    --font-heading: 'Lora', Georgia, serif;       /* judul hero, nama properti */
    --font-body:    'Plus Jakarta Sans', sans-serif; /* semua teks lainnya */
  }

  body {
    font-family: var(--font-body);
    color: var(--color-neutral-800);
    background-color: var(--color-bg);
    -webkit-font-smoothing: antialiased;
  }
}
```

**Type scale:**
| Token       | Size    | Weight | Penggunaan                          |
|-------------|---------|--------|-------------------------------------|
| `display`   | 3rem    | 700    | Hero headline (font-heading)        |
| `h1`        | 2rem    | 700    | Judul halaman (font-heading)        |
| `h2`        | 1.5rem  | 600    | Section title                       |
| `h3`        | 1.25rem | 600    | Card title, nama properti           |
| `h4`        | 1rem    | 600    | Sub-section, label form             |
| `body-lg`   | 1rem    | 400    | Body text utama                     |
| `body-sm`   | 0.875rem| 400    | Caption, metadata, badge text       |
| `caption`   | 0.75rem | 400    | Timestamp, helper text              |

---

### 📐 Spacing & Layout

```
Prinsip: banyak whitespace = terasa premium (ala Hipcamp / Airbnb)

Base unit: 4px (Tailwind default)
Section padding vertical:  py-16 (64px) desktop, py-10 (40px) mobile
Card gap dalam grid:       gap-6 (24px)
Padding dalam card:        p-4 (16px) mobile, p-5 (20px) desktop
Border radius card:        rounded-2xl (16px)
Border radius tombol:      rounded-xl (12px)
Border radius input:       rounded-lg (8px)
```

**Grid layout property list:**
```
Mobile  (< 640px):  1 kolom
Tablet  (640–1024): 2 kolom
Desktop (> 1024px): 3 kolom
Wide    (> 1280px): 4 kolom
```

---

### 🧩 Komponen UI — Panduan Visual

#### Property Card
```
- Foto: aspect-ratio 4/3, object-cover, rounded-2xl, full-width
- Overlay tipis di bawah foto untuk badge kategori
- Nama properti: font-heading, font-semibold, 1 baris (truncate)
- Kota: icon MapPin (lucide) + teks kecil, warna neutral-600
- Harga: highlight warna primary-600, font-bold
  "Mulai dari Rp 250.000 / malam"
- Badge "Tersedia" / "Penuh": pojok kanan atas foto
- Hover effect: shadow-lg + scale-[1.01] dengan transition 200ms
```

#### Tombol
```
Primary:   bg-primary-600, text-white, hover:bg-primary-700, rounded-xl, px-6 py-3
Secondary: border border-primary-600, text-primary-600, hover:bg-primary-50, rounded-xl
Ghost:     text-neutral-600, hover:text-neutral-900, hover:bg-neutral-100
Danger:    bg-error, text-white, hover:bg-red-700
Ukuran:    sm (px-4 py-2 text-sm), md (px-6 py-3), lg (px-8 py-4 text-lg)
```

#### Input & Form
```
- Border: border border-neutral-200, focus:border-primary-600, focus:ring-2 focus:ring-primary-100
- Background: bg-white
- Label: text-sm font-medium text-neutral-700, mb-1.5
- Error message: text-xs text-error mt-1
- Icon di dalam input (search, calendar): pl-10
- Rounded: rounded-lg
```

#### Navbar
```
- Background: white dengan border-b border-neutral-200 saat di-scroll (sticky)
- Logo: kiri, teks brand dengan aksen warna primary-600
- Menu: tengah (desktop), hamburger (mobile)
- Auth buttons: kanan — "Masuk" (ghost) + "Daftar" (primary)
- Saat user login: avatar foto + nama, dropdown menu
- Height: h-16 (64px)
```

#### Hero Section
```
- Full-width, min-height 80vh (desktop), 60vh (mobile)
- Background: foto properti Indonesia berkualitas tinggi
- Overlay gradient: from-black/50 to-transparent (dari bawah)
- Headline: font-heading, text-white, display size
  Contoh: "Temukan tempat tinggal sempurna di Indonesia"
- Sub-headline: text-white/80, body-lg
- Search form: card putih di bawah headline, rounded-2xl, shadow-xl
  Field: Kota tujuan | Tanggal check-in | Durasi | Tamu | Tombol Cari
```

#### Badge / Chip
```
- Kategori:     bg-primary-50 text-primary-700 rounded-full px-3 py-1 text-xs font-medium
- Peak price:   bg-accent-500 text-white rounded-full px-2 py-0.5 text-xs
- Status order: pill berwarna sesuai semantic color
```

#### Skeleton Loading
```
- Gunakan animate-pulse dari Tailwind
- Warna: bg-neutral-200
- Bentuk mengikuti layout konten asli (bukan generic bar)
- Property card skeleton: blok foto + 3 baris teks
```

#### Modal / Dialog
```
- Backdrop: bg-black/50, blur-sm
- Container: bg-white, rounded-2xl, shadow-2xl, max-w-md mx-auto
- Padding: p-6
- Animasi: motion — scale dari 0.95 ke 1, fade in 200ms
- Close button: pojok kanan atas
```

---

### 🖼️ Foto & Imagery

```
- Selalu gunakan foto properti berkualitas tinggi (dari Cloudinary)
- Aspect ratio konsisten: 4/3 untuk card, 16/9 untuk hero room detail
- Fallback jika foto tidak ada: placeholder abu-abu dengan icon Building2 (lucide)
- Foto profil user: aspect-ratio 1/1, rounded-full
- Jangan stretch foto — selalu object-cover
```

---

### ✨ Animasi & Motion

Gunakan `motion` (Framer Motion) secara **minimal dan purposeful**:

```tsx
// Page transition — fade + slide up
const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

// Card hover — subtle scale
// whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}

// Modal — scale + fade
// initial={{ opacity: 0, scale: 0.95 }}
// animate={{ opacity: 1, scale: 1 }}

// List item stagger — properti card muncul berurutan
// variants={{ container: { staggerChildren: 0.05 } }}
```

**Aturan animasi:**
- Durasi: maks **300ms** untuk semua transisi UI
- Jangan animasi yang berlebihan — satu elemen, satu animasi
- Skeleton loading pakai Tailwind `animate-pulse`, bukan motion

---

### 📱 Breakpoints & Responsive

```
sm:  640px  → layout 2 kolom, navbar full
md:  768px  → form horizontal, sidebar muncul
lg:  1024px → 3 kolom property grid, hero full
xl:  1280px → 4 kolom, container max-w-7xl
```

Navbar berubah dari hamburger menu (mobile) ke full menu (≥ sm).
Search form berubah dari stacked vertical (mobile) ke horizontal row (≥ md).

---

### 🔔 Feedback & Notifikasi

- Aksi berhasil → `toast.success('...')` — muncul di kanan atas, 3 detik
- Error API → `toast.error(err.response?.data?.message ?? 'Terjadi kesalahan')`
- Aksi destruktif (hapus, cancel) → **modal konfirmasi** dulu, bukan toast langsung
- Form submit → tombol disabled + spinner saat loading, cegah double submit
- **Loading state**: setiap fetch data harus ada skeleton atau spinner
- **Error state**: setiap error API harus ditampilkan ke user
- **Empty state**: jika data kosong, tampilkan ilustrasi + teks + tombol aksi

---

### 💬 Floating WhatsApp Button

Komponen fixed di pojok kanan bawah layar, tampil di **semua halaman** (termasuk halaman tenant).
Pasang langsung di `__root` layout (dalam `components/layout/PageWrapper.tsx` atau langsung di `App.tsx`).

```tsx
// components/common/WhatsAppButton.tsx
import { motion } from 'motion'
import { MessageCircle } from 'lucide-react'

const WA_NUMBER  = '628xxxxxxxxxx'          // ← ganti nomor CS (format internasional, tanpa +)
const WA_MESSAGE = 'Halo, saya ingin bertanya mengenai properti di NamaBrand.'

export default function WhatsAppButton() {
  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi Customer Service via WhatsApp"
      className="
        fixed bottom-6 right-6 z-50
        flex items-center gap-2
        bg-[#25D366] text-white
        rounded-full shadow-lg
        px-4 py-3
        hover:bg-[#1ebe5d]
        focus:outline-none focus:ring-4 focus:ring-[#25D366]/40
      "
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Icon WA — gunakan SVG resmi WhatsApp, bukan lucide */}
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white shrink-0">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15
          -.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475
          -.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52
          .149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207
          -.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372
          -.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2
          5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085
          1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.557 4.14 1.535 5.876L0 24l6.332-1.512
          A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818
          a9.818 9.818 0 01-5.006-1.371l-.36-.213-3.72.889.933-3.613-.234-.373
          A9.77 9.77 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12
          17.42 21.818 12 21.818z"/>
      </svg>

      <span className="text-sm font-semibold whitespace-nowrap hidden sm:inline">
        Butuh bantuan?
      </span>
    </motion.a>
  )
}
```

**Aturan komponen:**
- Nomor & pesan WA disimpan di file `.env` sebagai `VITE_WA_NUMBER` dan `VITE_WA_MESSAGE` — tidak boleh hardcode di komponen
- Muncul dengan animasi spring setelah 1 detik delay (tidak mengganggu loading awal)
- Di mobile: hanya tampil icon (label disembunyikan). Di ≥ sm: tampil icon + teks "Butuh bantuan?"
- `target="_blank"` + `rel="noopener noreferrer"` wajib ada untuk keamanan
- `aria-label` wajib ada untuk aksesibilitas

Tambahkan ke `.env`:
```env
VITE_WA_NUMBER=628xxxxxxxxxx
VITE_WA_MESSAGE=Halo, saya ingin bertanya mengenai properti di NamaBrand.
```

---

### 🇮🇩 Bahasa & Konten — Default Indonesia

Seluruh teks UI, label, pesan error, placeholder, dan notifikasi **wajib dalam Bahasa Indonesia**.
Tidak menggunakan library i18n (seperti i18next) — cukup konstanta terpusat.

#### Prinsip
- Bahasa formal tapi ramah — hindari bahasa terlalu kaku ("Anda") maupun terlalu kasual
- Gunakan kata yang familiar di konteks properti Indonesia: "menginap", "pemesan", "tuan rumah"
- Angka mata uang: format Rupiah → `Rp 250.000` (titik sebagai pemisah ribuan)
- Format tanggal: `DD MMMM YYYY` → contoh: `12 Agustus 2025`
- Format waktu: `HH:mm WIB` → contoh: `14:30 WIB`

#### Konstanta teks (`lib/constants/text.ts`)
```ts
// lib/constants/text.ts
// Semua string UI yang dipakai lebih dari 1 tempat disimpan di sini

export const TEXT = {
  // Auth
  login:              'Masuk',
  register:           'Daftar',
  logout:             'Keluar',
  email:              'Email',
  password:           'Kata Sandi',
  confirmPassword:    'Konfirmasi Kata Sandi',
  forgotPassword:     'Lupa kata sandi?',
  name:               'Nama Lengkap',
  loginWithGoogle:    'Lanjutkan dengan Google',

  // Navigasi
  home:               'Beranda',
  myOrders:           'Pesanan Saya',
  myProfile:          'Profil Saya',
  dashboard:          'Dasbor',
  myProperties:       'Properti Saya',
  manageOrders:       'Kelola Pesanan',
  salesReport:        'Laporan Penjualan',

  // Properti
  searchPlaceholder:  'Cari kota atau nama properti...',
  destination:        'Kota Tujuan',
  checkIn:            'Tanggal Check-in',
  duration:           'Durasi (malam)',
  guests:             'Jumlah Tamu',
  search:             'Cari',
  lowestPrice:        'Mulai dari',
  perNight:           '/ malam',
  available:          'Tersedia',
  fullyBooked:        'Penuh',
  noProperties:       'Belum ada properti yang sesuai.',
  seeDetail:          'Lihat Detail',

  // Order
  bookNow:            'Pesan Sekarang',
  uploadProof:        'Unggah Bukti Pembayaran',
  cancelOrder:        'Batalkan Pesanan',
  confirmPayment:     'Konfirmasi Pembayaran',
  rejectPayment:      'Tolak Pembayaran',
  orderNumber:        'Nomor Pesanan',
  checkOut:           'Tanggal Check-out',
  totalPrice:         'Total Harga',
  paymentDeadline:    'Batas Waktu Pembayaran',

  // Status order
  status: {
    WAITING_PAYMENT:      'Menunggu Pembayaran',
    WAITING_CONFIRMATION: 'Menunggu Konfirmasi',
    CONFIRMED:            'Dikonfirmasi',
    CANCELLED:            'Dibatalkan',
    COMPLETED:            'Selesai',
  },

  // Feedback
  success: {
    orderCreated:    'Pesanan berhasil dibuat!',
    paymentUploaded: 'Bukti pembayaran berhasil diunggah.',
    orderCancelled:  'Pesanan berhasil dibatalkan.',
    profileUpdated:  'Profil berhasil diperbarui.',
    reviewSubmitted: 'Ulasan berhasil dikirim.',
  },
  error: {
    generic:       'Terjadi kesalahan. Silakan coba lagi.',
    unauthorized:  'Sesi habis. Silakan masuk kembali.',
    notFound:      'Data tidak ditemukan.',
    fileTooLarge:  'Ukuran file maksimal 1MB.',
    invalidFormat: 'Format file hanya .jpg, .jpeg, .png, .gif.',
  },

  // Konfirmasi
  confirm: {
    cancelOrder:    'Apakah Anda yakin ingin membatalkan pesanan ini?',
    deleteProperty: 'Properti yang dihapus tidak dapat dikembalikan. Lanjutkan?',
    deleteRoom:     'Kamar yang dihapus tidak dapat dikembalikan. Lanjutkan?',
    rejectPayment:  'Tolak bukti pembayaran? Status pesanan akan kembali ke Menunggu Pembayaran.',
  },

  // Tombol umum
  save:     'Simpan',
  cancel:   'Batal',
  delete:   'Hapus',
  edit:     'Ubah',
  add:      'Tambah',
  back:     'Kembali',
  next:     'Lanjut',
  confirm:  'Konfirmasi',
  close:    'Tutup',
  loading:  'Memuat...',
  sending:  'Mengirim...',
  saving:   'Menyimpan...',
} as const
```

#### Format Rupiah & Tanggal (`lib/utils.ts`)
```ts
// lib/utils.ts

export const formatRupiah = (amount: number): string =>
  new Intl.NumberFormat('id-ID', {
    style:    'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
// Output: "Rp 250.000"

export const formatDate = (date: string | Date): string =>
  new Intl.DateTimeFormat('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(date))
// Output: "12 Agustus 2025"

export const formatDateTime = (date: string | Date): string =>
  new Intl.DateTimeFormat('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
  }).format(new Date(date))
// Output: "12 Agustus 2025, 14.30 WIB"
```

#### `<html lang>` di `index.html`
```html
<!-- index.html -->
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NamaBrand — Temukan Tempat Menginap Terbaik</title>
    <meta name="description"
      content="Cari dan pesan hotel, apartemen, rumah, dan kost terbaik di seluruh Indonesia." />
  </head>
```

---

## 📏 Clean Code Rules

- ❌ Maksimal **200 baris per file** — refactor jika lebih
- ❌ Maksimal **15 baris per function** — pecah menjadi sub-function
- ❌ Tidak boleh ada `console.log` di production
- ❌ Tidak boleh ada kode yang tidak dipakai
- ✅ Nama file: `PascalCase` untuk komponen (`.tsx`), `camelCase` untuk hooks/utils (`.ts`)
- ✅ Gunakan ekstensi `.tsx` untuk file yang mengandung JSX
- ✅ Setiap komponen maksimal satu tanggung jawab (Single Responsibility)
- ✅ Logic yang kompleks pindah ke custom hook (`hooks/`)
- ✅ Semua string API URL hanya ada di `services/`, bukan di komponen

---

## 🧪 Contoh Struktur Komponen yang Benar

```tsx
// components/common/Pagination.tsx
// Komponen menerima: currentPage, totalPages, onPageChange
// Ukuran < 50 baris, tidak ada logic fetch di dalamnya

// pages/user/PropertyListPage.tsx
// Tanggung jawab: render layout + manggil useProperty hook
// Tidak boleh ada fetch langsung di sini (pakai service/hook)

// hooks/useProperty.ts
// Logic: fetch properti, handle loading/error, update filter/sort/page
// Kembalikan: properties, isLoading, error, pagination, setFilter, setSort
```

---

## 🔔 Notifikasi & Feedback

- Setiap aksi berhasil (create, update, delete, order) → `toast.success('...')`
- Setiap error dari API → `toast.error(err.response?.data?.message ?? 'Terjadi kesalahan')`
- Aksi destruktif (hapus properti, cancel order) → tampilkan modal konfirmasi dulu
- Form submit → disable tombol submit saat loading untuk cegah double submit

---

## 📎 Catatan Penting untuk AI Agent

1. **Jangan buat fetch langsung di komponen** — selalu gunakan custom hook atau service
2. **Jangan hardcode URL** — pakai `import.meta.env.VITE_*`
3. **Semua tipe data harus ada di `types/`** — tidak boleh `any`
4. **Pagination, filter, dan sort selalu dihandle oleh backend** — hanya kirim query params
5. **State global** (auth, cart, notif) pakai Zustand — state lokal (form, toggle) pakai `useState`
6. **Jika file > 200 baris**, langsung refactor sebelum lanjut ke fitur berikutnya
7. **Selalu buat loading state** untuk setiap operasi async
8. **Gunakan TypeScript secara ketat** — tidak boleh menggunakan `any` kecuali terpaksa dan harus dikomentari alasannya
9. **Dark mode** — JANGAN gunakan warna hardcode seperti `bg-white` atau `text-gray-900`. Selalu pakai CSS token `var(--color-*)` agar otomatis menyesuaikan tema
10. **Theme toggle** dikelola oleh `themeStore.ts` (Zustand + persist). Inisialisasi tema harus dijalankan di `main.tsx` **sebelum** `ReactDOM.createRoot` untuk mencegah flash of wrong theme (FOWT)
11. **WhatsApp button** (`WhatsAppButton.tsx`) dipasang di root layout sehingga muncul di semua halaman. Nomor dan pesan WA wajib dari `.env` (`VITE_WA_NUMBER`, `VITE_WA_MESSAGE`)
12. **Semua teks UI dalam Bahasa Indonesia** — gunakan konstanta dari `lib/constants/text.ts`, tidak boleh menulis string UI langsung di komponen
13. **Format angka dan tanggal** selalu menggunakan `formatRupiah()` dan `formatDate()` dari `lib/utils.ts` — tidak boleh format manual
14. **`<html lang="id">`** sudah diset di `index.html` — jangan diubah
