# ⚙️ BACKEND — Instruksi Pengerjaan

> File ini adalah panduan teknis untuk AI agent dalam mengerjakan bagian **backend** dari Property Renting Web App.

---

## ⚙️ Setup & Inisialisasi

```bash
npm init -y
npm install express cors dotenv
npm install @supabase/supabase-js
npm install @prisma/client
npm install -D prisma typescript ts-node @types/express @types/node
npm install jsonwebtoken bcryptjs nodemailer
npm install -D @types/jsonwebtoken @types/bcryptjs @types/nodemailer
npm install zod
npm install multer             # untuk handle multipart form (jika perlu)
npm install node-cron           # untuk scheduled jobs (auto-cancel order)
npm install -D nodemon

# Init Prisma
npx prisma init
```

`tsconfig.json` minimal:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true
  }
}
```

---

## 📁 Struktur Folder Backend

```
backend/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Data seed awal
├── src/
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── propertyController.ts
│   │   ├── roomController.ts
│   │   ├── orderController.ts
│   │   ├── reviewController.ts
│   │   └── reportController.ts
│   ├── middlewares/
│   │   ├── authenticate.ts    # Verifikasi JWT/Supabase token
│   │   ├── authorizeRole.ts   # Cek role: user atau tenant
│   │   ├── validateRequest.ts # Middleware Zod validation
│   │   └── errorHandler.ts    # Global error handler
│   ├── routes/
│   │   ├── index.ts           # Mount semua router
│   │   ├── authRoutes.ts
│   │   ├── propertyRoutes.ts
│   │   ├── roomRoutes.ts
│   │   ├── orderRoutes.ts
│   │   ├── reviewRoutes.ts
│   │   └── reportRoutes.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── propertyService.ts
│   │   ├── roomService.ts
│   │   ├── orderService.ts
│   │   ├── reviewService.ts
│   │   ├── reportService.ts
│   │   └── emailService.ts
│   ├── utils/
│   │   ├── prismaClient.ts    # Singleton Prisma instance
│   │   ├── supabaseAdmin.ts   # Supabase admin client
│   │   ├── tokenUtils.ts      # JWT sign/verify helper
│   │   ├── priceCalculator.ts # Hitung harga berdasarkan tanggal
│   │   └── cronJobs.ts        # Scheduled tasks
│   ├── validations/
│   │   ├── authValidation.ts
│   │   ├── propertyValidation.ts
│   │   ├── orderValidation.ts
│   │   └── reviewValidation.ts
│   ├── types/
│   │   └── express.d.ts       # Extend Express Request (req.user)
│   └── app.ts                 # Express app config
├── server.ts                  # Entry point
├── .env
└── BACKEND.md
```

---

## 🗄️ Prisma Schema — Database

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  name          String
  password      String?   // null untuk Google login
  avatarUrl     String?
  isVerified    Boolean   @default(false)
  verifyToken   String?
  verifyTokenExp DateTime?
  resetToken    String?
  resetTokenExp DateTime?
  role          Role      @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  orders        Order[]
  reviews       Review[]
}

model Tenant {
  id          String    @id @default(uuid())
  email       String    @unique
  name        String
  password    String?
  avatarUrl   String?
  isVerified  Boolean   @default(false)
  verifyToken String?
  verifyTokenExp DateTime?
  resetToken  String?
  resetTokenExp DateTime?
  role        Role      @default(TENANT)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  properties  Property[]
}

enum Role {
  USER
  TENANT
}

model PropertyCategory {
  id         String     @id @default(uuid())
  name       String     @unique
  createdAt  DateTime   @default(now())
  properties Property[]
}

model Property {
  id          String           @id @default(uuid())
  name        String
  description String
  city        String
  address     String
  pictureUrl  String?
  tenantId    String
  categoryId  String
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt

  tenant      Tenant           @relation(fields: [tenantId], references: [id])
  category    PropertyCategory @relation(fields: [categoryId], references: [id])
  rooms       Room[]
  reviews     Review[]
}

model Room {
  id          String    @id @default(uuid())
  name        String
  price       Float     // Base price per malam
  description String
  propertyId  String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  property    Property      @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  orders      Order[]
  peakRates   PeakSeasonRate[]
  unavailable RoomUnavailability[]
}

model PeakSeasonRate {
  id         String          @id @default(uuid())
  roomId     String
  startDate  DateTime
  endDate    DateTime
  type       PeakRateType    // PERCENTAGE atau NOMINAL
  value      Float           // positif = naik, negatif = turun
  createdAt  DateTime        @default(now())

  room       Room @relation(fields: [roomId], references: [id], onDelete: Cascade)
}

enum PeakRateType {
  PERCENTAGE
  NOMINAL
}

model RoomUnavailability {
  id        String   @id @default(uuid())
  roomId    String
  startDate DateTime
  endDate   DateTime
  reason    String?

  room      Room @relation(fields: [roomId], references: [id], onDelete: Cascade)
}

model Order {
  id             String      @id @default(uuid())
  orderNumber    String      @unique @default(cuid())
  userId         String
  roomId         String
  checkIn        DateTime
  checkOut       DateTime
  totalNights    Int
  totalPrice     Float
  guestCount     Int
  status         OrderStatus @default(WAITING_PAYMENT)
  paymentProofUrl String?
  paymentDeadline DateTime   // checkIn time + 1 jam
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt

  user           User   @relation(fields: [userId], references: [id])
  room           Room   @relation(fields: [roomId], references: [id])
  review         Review?
}

enum OrderStatus {
  WAITING_PAYMENT
  WAITING_CONFIRMATION
  CONFIRMED
  CANCELLED
  COMPLETED
}

model Review {
  id          String   @id @default(uuid())
  orderId     String   @unique
  userId      String
  propertyId  String
  comment     String
  replyComment String?
  createdAt   DateTime @default(now())

  order       Order    @relation(fields: [orderId], references: [id])
  user        User     @relation(fields: [userId], references: [id])
  property    Property @relation(fields: [propertyId], references: [id])
}
```

---

## 🔌 API Endpoints

### Auth — `/api/auth`

| Method | Path                        | Akses   | Deskripsi                              |
|--------|-----------------------------|---------|----------------------------------------|
| POST   | `/register`                 | Public  | Daftar user baru (email)               |
| POST   | `/register/tenant`          | Public  | Daftar tenant baru (email)             |
| POST   | `/login`                    | Public  | Login user                             |
| POST   | `/login/tenant`             | Public  | Login tenant                           |
| POST   | `/verify-email`             | Public  | Verifikasi email + set password        |
| POST   | `/resend-verification`      | Public  | Kirim ulang email verifikasi           |
| POST   | `/reset-password`           | Public  | Kirim link reset password ke email     |
| POST   | `/confirm-reset-password`   | Public  | Konfirmasi + ubah password             |
| GET    | `/me`                       | Auth    | Ambil data user yang sedang login      |
| PUT    | `/me`                       | Auth    | Update profil (nama, avatar)           |
| PUT    | `/me/email`                 | Auth    | Update email (trigger verifikasi ulang)|
| PUT    | `/me/password`              | Auth    | Ganti password                         |
| POST   | `/google`                   | Public  | Login/register via Google OAuth        |

---

### Properties — `/api/properties`

| Method | Path                        | Akses         | Deskripsi                              |
|--------|-----------------------------|---------------|----------------------------------------|
| GET    | `/`                         | Public        | List properti (filter, sort, paginasi) |
| GET    | `/:id`                      | Public        | Detail properti + daftar room          |
| GET    | `/:id/price-calendar`       | Public        | Harga per tanggal (min 1 bulan)        |
| POST   | `/`                         | Tenant        | Buat properti baru                     |
| PUT    | `/:id`                      | Tenant (owner)| Update properti                        |
| DELETE | `/:id`                      | Tenant (owner)| Hapus properti                         |

Query params untuk GET `/`:
- `city`, `checkIn`, `checkOut`, `guests`
- `search` (nama properti), `category`
- `sortBy`: `name_asc` | `name_desc` | `price_asc` | `price_desc`
- `page`, `limit` (default: 1, 10)

---

### Property Categories — `/api/categories`

| Method | Path   | Akses  | Deskripsi              |
|--------|--------|--------|------------------------|
| GET    | `/`    | Public | List semua kategori    |
| POST   | `/`    | Tenant | Buat kategori baru     |
| PUT    | `/:id` | Tenant | Update kategori        |
| DELETE | `/:id` | Tenant | Hapus kategori         |

---

### Rooms — `/api/properties/:propertyId/rooms`

| Method | Path                   | Akses         | Deskripsi                          |
|--------|------------------------|---------------|------------------------------------|
| GET    | `/`                    | Public        | List room dari suatu properti      |
| POST   | `/`                    | Tenant (owner)| Buat room baru                     |
| PUT    | `/:roomId`             | Tenant (owner)| Update room                        |
| DELETE | `/:roomId`             | Tenant (owner)| Hapus room                         |
| POST   | `/:roomId/peak-rates`  | Tenant (owner)| Set peak season rate               |
| DELETE | `/:roomId/peak-rates/:id` | Tenant     | Hapus peak rate                    |
| POST   | `/:roomId/unavailability` | Tenant     | Set tanggal tidak tersedia         |
| DELETE | `/:roomId/unavailability/:id` | Tenant | Hapus unavailability              |

---

### Orders — `/api/orders`

| Method | Path                      | Akses         | Deskripsi                               |
|--------|---------------------------|---------------|-----------------------------------------|
| GET    | `/`                       | User          | Riwayat order user (filter, paginasi)   |
| GET    | `/:id`                    | User/Tenant   | Detail order                            |
| POST   | `/`                       | User          | Buat order baru                         |
| PATCH  | `/:id/payment-proof`      | User (owner)  | Upload URL bukti bayar                  |
| PATCH  | `/:id/cancel`             | User (owner)  | Batalkan order                          |
| GET    | `/tenant`                 | Tenant        | List semua order properti milik tenant  |
| PATCH  | `/:id/confirm`            | Tenant (owner)| Konfirmasi pembayaran                   |
| PATCH  | `/:id/reject`             | Tenant (owner)| Tolak pembayaran                        |
| PATCH  | `/:id/cancel-by-tenant`   | Tenant (owner)| Tenant batalkan order                   |

---

### Reviews — `/api/reviews`

| Method | Path          | Akses         | Deskripsi                         |
|--------|---------------|---------------|-----------------------------------|
| GET    | `/property/:propertyId` | Public | List review suatu properti    |
| POST   | `/`           | User          | Buat review (setelah checkout)    |
| PATCH  | `/:id/reply`  | Tenant (owner)| Balas review                      |

---

### Reports — `/api/reports`

| Method | Path               | Akses  | Deskripsi                              |
|--------|--------------------|--------|----------------------------------------|
| GET    | `/sales`           | Tenant | Laporan penjualan (filter, sort)       |
| GET    | `/property-calendar` | Tenant | Kalender ketersediaan properti       |

Query params untuk `/sales`:
- `groupBy`: `property` | `transaction` | `user`
- `startDate`, `endDate`
- `sortBy`: `date` | `total`
- `page`, `limit`

---

## 🔐 Middleware

### `authenticate.ts`
```ts
// Verifikasi Bearer token dari header Authorization
// Decode JWT atau verifikasi Supabase token
// Attach data user ke req.user
// Jika tidak valid → 401 Unauthorized
```

### `authorizeRole.ts`
```ts
// authorizeRole('USER')   → hanya role USER yang bisa akses
// authorizeRole('TENANT') → hanya role TENANT yang bisa akses
// Jika role tidak sesuai → 403 Forbidden
```

### `validateRequest.ts`
```ts
// Menerima Zod schema sebagai parameter
// Validasi req.body, req.query, atau req.params
// Jika gagal → 400 Bad Request dengan detail error dari Zod
```

### `errorHandler.ts`
```ts
// Global error handler Express (4 parameter)
// Handle: Prisma errors, Zod errors, custom AppError, generic error
// Format response error konsisten:
// { success: false, message: string, errors?: object }
```

---

## 📧 Email Service

Gunakan **Nodemailer** dengan SMTP (Gmail/Mailtrap untuk dev).

**Template email yang dibutuhkan:**

1. **Verifikasi Email** — subject: "Verifikasi Akun Anda"
   - Konten: link verifikasi (exp 1 jam) + form set password
   - `{FRONTEND_URL}/auth/verify-email?token={token}&email={email}`

2. **Reset Password** — subject: "Reset Password"
   - Konten: link reset password
   - `{FRONTEND_URL}/auth/confirm-reset-password?token={token}`

3. **Konfirmasi Booking** — subject: "Pemesanan Dikonfirmasi"
   - Konten: detail order (nomor order, properti, tanggal, total harga)

4. **Pengingat Check-in** — subject: "Pengingat Check-in Besok"
   - Dikirim H-1 sebelum tanggal check-in secara otomatis (cron job)

---

## ⏱️ Scheduled Jobs (node-cron)

```ts
// utils/cronJobs.ts

// 1. Auto-cancel order — cek setiap menit
// Kondisi: status = WAITING_PAYMENT AND paymentDeadline < now()
// Aksi: ubah status → CANCELLED, bebaskan room

// 2. Pengingat check-in — cek setiap hari pukul 08:00
// Kondisi: status = CONFIRMED AND checkIn = besok (H-1)
// Aksi: kirim email reminder ke user
```

---

## 💰 Kalkulasi Harga Dinamis

```ts
// utils/priceCalculator.ts

// Fungsi: getRoomPriceForDate(roomId, date)
// 1. Ambil base price dari Room
// 2. Cek apakah ada PeakSeasonRate yang mencakup tanggal tersebut
// 3. Jika ada:
//    - PERCENTAGE: finalPrice = basePrice + (basePrice * value / 100)
//    - NOMINAL:    finalPrice = basePrice + value
// 4. Return finalPrice (minimal 0)

// Fungsi: getTotalPriceForBooking(roomId, checkIn, checkOut)
// Loop setiap malam dari checkIn sampai checkOut-1
// Jumlahkan getRoomPriceForDate untuk setiap malam
// Return total

// Fungsi: getPropertyLowestPriceForDate(propertyId, date)
// Ambil semua room dari property yang available di tanggal itu
// Return harga terendah dari getRoomPriceForDate semua room tersebut
```

---

## 🔍 Server-side Pagination, Filter & Sort

**Pola standar query di service layer:**

```ts
// propertyService.ts — getProperties()
// Query params yang diterima: city, checkIn, checkOut, guests,
//                             search, category, sortBy, page, limit

const skip = (page - 1) * limit
const where: Prisma.PropertyWhereInput = {
  city: city ? { contains: city, mode: 'insensitive' } : undefined,
  name: search ? { contains: search, mode: 'insensitive' } : undefined,
  categoryId: category ?? undefined,
  rooms: {
    some: {
      // room yang tidak ada order aktif di rentang tanggal tersebut
      // dan tidak ada unavailability di tanggal tersebut
    },
  },
}

const orderBy = buildOrderBy(sortBy) // helper untuk konversi sortBy string

const [data, total] = await prisma.$transaction([
  prisma.property.findMany({ where, skip, take: limit, orderBy, include: {...} }),
  prisma.property.count({ where }),
])

return {
  data,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  },
}
```

---

## 🏗️ Arsitektur Layer

```
Request → Router → Middleware → Controller → Service → Prisma → Database
                                    ↓
                                Response
```

**Aturan:**
- **Controller**: hanya handle `req`, `res`, `next` — tidak ada logic bisnis
- **Service**: semua logic bisnis dan query database
- **Middleware**: autentikasi, otorisasi, validasi request
- **Utils**: fungsi helper yang dipakai lebih dari satu tempat

---

## 📝 Format Response API

**Sukses:**
```json
{
  "success": true,
  "message": "Berhasil mendapatkan data properti",
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Email atau password salah",
  "errors": {
    "email": "Email tidak terdaftar"
  }
}
```

**HTTP Status Code:**
| Kondisi                       | Status Code |
|-------------------------------|-------------|
| Sukses buat data              | 201         |
| Sukses baca/update/hapus      | 200         |
| Validasi gagal                | 400         |
| Token tidak valid / expired   | 401         |
| Akses ditolak (role)          | 403         |
| Data tidak ditemukan          | 404         |
| Konflik (email sudah ada)     | 409         |
| Internal server error         | 500         |

---

## 🔒 Aturan Otorisasi Kritis

- Tenant hanya bisa **CRUD properti/room miliknya sendiri** — cek `property.tenantId === req.user.id`
- Tenant hanya bisa **konfirmasi/tolak order** dari propertinya sendiri
- User hanya bisa **lihat dan kelola ordernya sendiri** — cek `order.userId === req.user.id`
- User yang **belum terverifikasi** tidak bisa membuat order — cek `user.isVerified`
- Tenant tidak bisa akses endpoint `/api/orders` (user), User tidak bisa akses `/api/reports` (tenant)

---

## ✅ Validasi Zod (Server-Side)

```ts
// validations/orderValidation.ts
import { z } from 'zod'

export const createOrderSchema = z.object({
  body: z.object({
    roomId: z.string().uuid('roomId tidak valid'),
    checkIn: z.string().datetime('Format tanggal tidak valid'),
    checkOut: z.string().datetime('Format tanggal tidak valid'),
    guestCount: z.number().int().min(1, 'Minimal 1 tamu'),
  }).refine(d => new Date(d.checkOut) > new Date(d.checkIn), {
    message: 'checkOut harus setelah checkIn',
  }),
})

export const uploadPaymentProofSchema = z.object({
  body: z.object({
    paymentProofUrl: z.string().url('URL bukti bayar tidak valid'),
  }),
})
```

---

## 🔑 Token & Password

```ts
// utils/tokenUtils.ts
// generateVerifyToken() → random string + exp timestamp (1 jam)
// generateResetToken()  → random string + exp timestamp (1 jam)

// Password hashing: bcryptjs dengan salt rounds 10
// JWT: sign dengan HS256, payload: { userId, role, email }
// JWT expiry: 7 hari (atau sesuai kebutuhan)
```

---

## 📦 Seed Data

Buat `prisma/seed.ts` dengan data awal:
- 3 PropertyCategory: "Hotel", "Villa", "Kost"
- 2 Tenant sample
- 3 Property sample dengan masing-masing 2 Room
- 1 User sample

Jalankan: `npx ts-node prisma/seed.ts`

---

## 📏 Clean Code Rules

- ❌ Maksimal **200 baris per file** — refactor jika lebih
- ❌ Maksimal **15 baris per function** — pecah menjadi sub-function
- ❌ Tidak boleh ada `console.log` di production — gunakan logger atau hapus
- ❌ Tidak boleh ada kode yang tidak dipakai
- ✅ Semua query database hanya ada di **service layer**, tidak di controller
- ✅ Semua validasi input ada di **middleware validateRequest** menggunakan Zod
- ✅ Naming: `camelCase` untuk variabel/fungsi, `PascalCase` untuk class/type
- ✅ Setiap route group ada di file terpisah di folder `routes/`
- ✅ Error selalu di-throw dengan `next(error)` — tidak pernah `res.status()` langsung di try/catch

---

## 🚀 Scripts (`package.json`)

```json
{
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "db:migrate": "npx prisma migrate dev",
    "db:generate": "npx prisma generate",
    "db:studio": "npx prisma studio",
    "db:seed": "npx ts-node prisma/seed.ts"
  }
}
```

---

## 📎 Catatan Penting untuk AI Agent

1. **Selalu gunakan Prisma** untuk semua operasi database — tidak boleh raw SQL kecuali sangat terpaksa
2. **Semua endpoint yang butuh auth** harus pakai middleware `authenticate` dan `authorizeRole`
3. **Cek kepemilikan resource** sebelum update/delete (tenant hanya bisa ubah propertinya sendiri)
4. **Auto-cancel order** dijalankan via cron job di `cronJobs.ts`, bukan endpoint manual
5. **Email** dikirim dari `emailService.ts` secara async — tidak boleh block response HTTP
6. **Harga dinamis** selalu dihitung di backend menggunakan `priceCalculator.ts` — jangan percaya harga dari frontend
7. **Pagination** wajib untuk semua endpoint yang mengembalikan array data
8. **Jangan simpan password plain text** — selalu hash dengan bcryptjs sebelum simpan ke database
9. **Token verifikasi dan reset password** hanya boleh dipakai sekali — hapus/nullkan setelah dipakai
10. **Review** hanya bisa dibuat jika order statusnya `COMPLETED` dan belum pernah direview
