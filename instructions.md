# 🏡 Property Renting Web App - Development Instructions

**Project:** Property Renting Web App (Hipcamp-inspired untuk Indonesia)  
**Group:** Muhammad Ali Akbar & Anggita Zahra Kamila  
**Fitur Utama:** Booking properti dengan dynamic pricing berdasarkan tanggal  
**Tahun:** 2026  

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Environment Setup](#environment-setup)
5. [UI/UX Guidelines](#uiux-guidelines)
6. [Payment Integration](#payment-integration)
7. [Feature Breakdown](#feature-breakdown)
8. [Database Schema](#database-schema)
9. [Standardisasi Wajib](#standardisasi-wajib-akan-dinilai-juri)
10. [API Conventions](#api-conventions)
11. [Development Patterns](#development-patterns)
12. [Development Workflow](#development-workflow)

---

## 🎯 Project Overview

**Platform e-commerce** untuk penyewaan properti (hotel, apartemen, rumah, kost) di Indonesia dengan perbandingan harga berdasarkan tanggal. Terinspirasi dari Hipcamp dengan design clean, photo-forward, dan warm.

---

## 🔧 Technology Stack

### Frontend
React 19.2.6 | React Router 7.15.1 | Tailwind CSS 4.3.0 | Axios 1.16.1 | Zustand 5.0.13 | Zod 4.4.3 | Motion 12.38.0 | Lucide React 1.16.0 | Leaflet 1.9.4 | React Leaflet 5.0.0 | Vite 8.0.12

### Backend
Express 5.2.1 | Prisma 7.8.0 | PostgreSQL (Supabase) | JWT 9.0.3 | Bcryptjs 3.0.3 | Nodemailer 8.0.7 | Multer 2.1.1 | Cloudinary | Node Cron 4.2.1 | Zod 4.4.3

---

## 📁 Project Structure

```
final-pro-a2/
├── instructions.md           ← Panduan development (single source of truth)
├── README.md
├── Purwadhika.md             ← Project requirements
├── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/            ← Page components
│   │   ├── components/       ← Reusable components (max 200 lines)
│   │   ├── hooks/            ← Custom hooks
│   │   ├── stores/           ← Zustand state
│   │   ├── services/         ← API integration
│   │   ├── types/            ← TypeScript types
│   │   ├── validations/      ← Zod schemas
│   │   ├── lib/              ← Utilities
│   │   ├── router/           ← Routes
│   │   └── assets/           ← Images
│   └── .env                  ← Frontend env
│
└── backend/
    ├── src/
    │   ├── controllers/      ← Request handlers (max 200 lines)
    │   ├── routes/           ← API endpoints
    │   ├── middlewares/      ← Express middlewares
    │   ├── services/         ← Business logic
    │   ├── utils/            ← Helper functions
    │   ├── types/            ← TypeScript types
    │   ├── validations/      ← Zod schemas
    │   └── config/           ← Configuration
    ├── prisma/
    │   └── schema.prisma     ← Database schema
    ├── server.ts             ← Entry point
    └── .env                  ← Backend env
```

---

## 🔐 Environment Setup

### Frontend `.env`
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Property Renting Web App
```

### Backend `.env`
```env
# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# JWT
JWT_SECRET=x0X!Purwadhika123?
JWT_EXPIRES_IN=7d

# Email
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=app_password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# Cloudinary
CLOUDINARY_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# LocationIQ
LOCATIONIQ_TOKEN=...

# Midtrans (Payment)
MIDTRANS_SERVER_KEY=...
MIDTRANS_CLIENT_KEY=...
MIDTRANS_IS_PRODUCTION=false

# Server
PORT=5000
NODE_ENV=development

# AI untuk fitur chatbot (belum akan dipakai, nanti setelah siap baru akan dipakai)
OPENROUTER_API_KEY=
```

---

## 🎨 UI/UX Guidelines

### Design: Hipcamp-Inspired
- Clean & minimal layout
- Photo-forward (galeri besar)
- Warm color palette (cream, peach, sage)
- Mobile-first responsive

### 🌗 Dark Mode (Tailwind + Zustand)
```typescript
// Automatic: detects system preference
// Manual toggle: light/dark/system
// Apply: dark: prefix di tailwind classes
```

### 💬 Floating WhatsApp Button
- Fixed di bottom-right semua halaman
- Redirect ke CS WhatsApp
- Hidden di mobile jika space terbatas

### 🇮🇩 Lokalisasi Indonesia
```typescript
// formatPrice(1500000) → Rp 1.500.000
// formatDate(date) → 18 Mei 2026
// formatDateTime(date) → 18 Mei 2026 14:30
```

---

## 💳 Payment Integration

### 1️⃣ Manual Bank Transfer (Pembayaran Manual)

**Flow:**
1. User membuat order → status: **WAITING_PAYMENT**
2. Backend generate nomor rekening & virtual account
3. User upload bukti transfer (jpg/png, max 1MB)
4. Status → **WAITING_CONFIRMATION**
5. Tenant verifikasi bukti pembayaran
6. Jika approve → status: **PROCESSED** + kirim email detail kamar
7. **Auto-cancel jika tidak upload dalam 2 jam**

**Backend Implementation:**
```typescript
// routes/orderRoutes.ts
POST   /api/orders              - Create order (status: WAITING_PAYMENT)
POST   /api/orders/:id/payment  - Upload payment proof
PUT    /api/orders/:id/confirm  - Tenant confirm payment

// Database tambahan
orders: { payment_proof_url, payment_verified_at }
```

**Frontend:**
- Order list dengan status badge
- Payment upload form (validasi file)
- H-1 reminder & auto-cancel notification

---

### 2️⃣ Midtrans Integration (QRIS/E-Wallet)

**Flow:**
1. User membuat order
2. Backend buat payment via Midtrans API → return snap token
3. Frontend redirect ke Midtrans Snap widget
4. User bayar via QRIS/E-wallet/Transfer virtual account
5. Midtrans callback → update order status → **PROCESSED**
6. Kirim email confirmation otomatis

**Backend Implementation:**
```typescript
// services/paymentService.ts
export const createMidtransPayment = async (orderId: string) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  
  const snap = new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
  });

  const parameter = {
    transaction_details: {
      order_id: order.order_number,
      gross_amount: order.total_price,
    },
    customer_details: {
      email: order.user.email,
      phone: order.user.phone,
    },
  };

  const transaction = await snap.createTransaction(parameter);
  return transaction.token;
};

// routes/orderRoutes.ts
POST   /api/orders/:id/midtrans-token  - Get Midtrans snap token
POST   /api/payment/callback           - Midtrans webhook callback
```

**Frontend:**
```typescript
import { loadMidtransScript } from '@/lib/midtrans';

// Di payment page
const handlePaymentMidtrans = async () => {
  const response = await axios.post(`/orders/${orderId}/midtrans-token`);
  
  window.snap.pay(response.data.token, {
    onSuccess: (result) => { /* update order status */ },
    onPending: (result) => { /* show pending */ },
    onError: (result) => { /* handle error */ },
  });
};
```

**Webhook Handling:**
```typescript
// POST /api/payment/callback
export const handleMidtransCallback = async (req: Request, res: Response) => {
  const { order_id, transaction_status } = req.body;

  if (transaction_status === 'settlement') {
    // Payment successful
    await prisma.order.update({
      where: { order_number: order_id },
      data: { status: 'PROCESSED', payment_verified_at: new Date() }
    });
    await emailService.sendPaymentConfirmation(order);
  }
  
  res.json({ success: true });
};
```

**Database Tambahan:**
```prisma
orders: {
  payment_method: ('MANUAL' | 'MIDTRANS')
  midtrans_transaction_id: String?
  payment_proof_url: String?        // Hanya untuk MANUAL
  payment_verified_at: DateTime?
}
```

---

## 🎯 Feature Breakdown

### Ali - Feature 1 (50 Poin)

#### 1.1 Homepage (10 Poin)
- Navbar, hero carousel, search form, property grid, footer
- Search: destinasi (dropdown), tanggal (calendar), durasi, jumlah orang
- Property cards dengan lazy loading

#### 1.2 Authentication (40 Poin)
- Register/Login (email, social login optional)
- Email verification (1 jam expiry)
- Set password saat verifikasi
- Reset password
- User profile (edit, foto, email)
- Authorization: redirect unverified users, disable features

#### 1.3 Property Management (40 Poin) - Tenant
- CRUD property (nama, deskripsi, kategori, foto, lokasi)
- CRUD room (tipe, harga base, deskripsi)
- Property categories management
- Room availability calendar
- Peak season rates (nominal/percentage, perbulan/perhari)

### Anggi - Feature 2 (40 Poin)

#### 2.1 Booking & Payment (35 Poin)
- Create order/reservation (check-in, check-out, total price)
- Manual payment upload + Midtrans integration
- Order list dengan pagination, filter, sort
- Cancel order (sebelum upload bukti)
- Auto-cancel 2 jam jika tidak upload bukti manual
- Payment confirmation workflow (tenant approve/reject)

#### 2.2 Tenant Order Management (25 Poin)
- Order list (filter by status)
- Confirm/reject payment
- Auto-email saat payment confirmed
- H-1 check-in reminder (cron job)
- Cancel order

#### 2.3 Review (15 Poin)
- Create review (setelah check-out)
- Rating 1-5, text comment
- Tenant reply ke review
- Show reviews on property detail

#### 2.4 Report & Analysis (15 Poin)
- Sales report (property, transaction, user)
- Filter date range, sort by date/total
- Property availability calendar

---

## 🗄️ Database Schema

### Users & Auth
```prisma
model User {
  id String @id @default(cuid())
  email String @unique
  password_hash String
  role Role @default(USER)    // USER | TENANT
  name String
  phone String?
  avatar_url String?
  verified_at DateTime?
  deleted_at DateTime?         // Soft delete
  created_at DateTime @default(now())
  
  // Relations
  orders Order[]
  reviews Review[]
  tenantProperties Property[]
  reviewReplies ReviewReply[]
}

enum Role {
  USER
  TENANT
}
```

### Properties & Rooms
```prisma
model Property {
  id String @id @default(cuid())
  tenantId String
  tenant User @relation("TenantProperties", fields: [tenantId], references: [id])
  
  name String
  description String
  featured_image_url String?
  address String
  city String
  latitude Float?
  longitude Float?
  deleted_at DateTime?         // Soft delete
  
  // Relations
  images PropertyImage[]
  rooms Room[]
  orders Order[]
  reviews Review[]
}

model PropertyImage {
  id String @id @default(cuid())
  propertyId String
  property Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  image_url String
  deleted_at DateTime?         // Soft delete
}

model Room {
  id String @id @default(cuid())
  propertyId String
  property Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  
  room_type String
  base_price Int
  description String?
  capacity Int
  deleted_at DateTime?         // Soft delete
  
  // Relations
  availability RoomAvailability[]
  peakRates PeakSeasonRate[]
  orders Order[]
}

model PeakSeasonRate {
  id String @id @default(cuid())
  roomId String
  room Room @relation(fields: [roomId], references: [id], onDelete: Cascade)
  
  start_date DateTime
  end_date DateTime
  rate_type RateType         // PERCENTAGE | NOMINAL
  rate_value Int
  description String?
  deleted_at DateTime?       // Soft delete
}

enum RateType {
  PERCENTAGE
  NOMINAL
}
```

### Orders & Payment
```prisma
model Order {
  id String @id @default(cuid())
  order_number String @unique @default(nanoid())
  userId String
  user User @relation(fields: [userId], references: [id])
  roomId String
  room Room @relation(fields: [roomId], references: [id])
  
  check_in_date DateTime
  check_out_date DateTime
  total_price Int
  status OrderStatus
  
  payment_method PaymentMethod     // MANUAL | MIDTRANS
  payment_proof_url String?        // Hanya MANUAL
  midtrans_transaction_id String?  // Hanya MIDTRANS
  payment_verified_at DateTime?
  
  review Review?
  deleted_at DateTime?            // Soft delete
  canceled_at DateTime?
  created_at DateTime @default(now())
}

enum OrderStatus {
  WAITING_PAYMENT
  WAITING_CONFIRMATION
  PROCESSED
  CANCELLED
}

enum PaymentMethod {
  MANUAL
  MIDTRANS
}
```

### Reviews
```prisma
model Review {
  id String @id @default(cuid())
  orderId String @unique
  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)
  propertyId String
  property Property @relation(fields: [propertyId], references: [id])
  userId String
  user User @relation(fields: [userId], references: [id])
  
  rating Int    // 1-5
  comment String
  replies ReviewReply[]
  deleted_at DateTime?    // Soft delete
  created_at DateTime @default(now())
}

model ReviewReply {
  id String @id @default(cuid())
  reviewId String
  review Review @relation(fields: [reviewId], references: [id], onDelete: Cascade)
  tenantId String
  tenant User @relation(fields: [tenantId], references: [id])
  
  reply_text String
  deleted_at DateTime?    // Soft delete
  created_at DateTime @default(now())
}
```

---

## 📏 Standardisasi Wajib (Akan Dinilai Juri)

### ✅ Validasi Input

**Client-Side (Frontend - Zod):**
```typescript
// validations/auth.ts
export const registerSchema = z.object({
  email: z.string().email('Email tidak valid'),
  name: z.string().min(3, 'Min 3 karakter'),
  password: z.string().min(8, 'Min 8 karakter'),
});

export const bookingSchema = z.object({
  check_in_date: z.date().min(new Date()),
  check_out_date: z.date(),
  notes: z.string().max(500),
}).refine(d => d.check_out_date > d.check_in_date);
```

**Server-Side (Backend - Zod):**
```typescript
// validations/auth.ts
export const registerValidation = registerSchema;

// middlewares/validator.ts
export const validate = (schema: z.ZodSchema) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({ errors: error.errors });
    }
  };

// routes/authRoutes.ts
router.post('/register', validate(registerValidation), registerController);
```

**File Upload Validation:**
```typescript
// 📏 RULES:
// - Allowed: .jpg, .jpeg, .png, .gif
// - Max size: 1MB (1,048,576 bytes)

// Frontend
const validateFile = (file: File) => {
  const allowed = ['image/jpeg', 'image/png', 'image/gif'];
  const maxSize = 1 * 1024 * 1024; // 1MB
  
  if (!allowed.includes(file.type)) {
    throw new Error('Hanya JPG, PNG, GIF yang diperbolehkan');
  }
  if (file.size > maxSize) {
    throw new Error('Ukuran maksimal 1MB');
  }
};

// Backend (Multer)
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif/;
    if (!allowed.test(file.mimetype)) {
      return cb(new Error('Invalid file type'));
    }
    cb(null, true);
  },
  limits: { fileSize: 1 * 1024 * 1024 }
});
```

**Konfirmasi untuk Aksi Destruktif:**
```typescript
// Modal konfirmasi sebelum delete
const handleDelete = () => {
  setShowConfirmation(true);
};

const confirmDelete = async () => {
  await deleteProperty(id);
  setShowConfirmation(false);
  navigate('/properties');
};

// Render
{showConfirmation && (
  <Modal>
    <p>Yakin ingin menghapus properti ini?</p>
    <button onClick={confirmDelete}>Hapus</button>
    <button onClick={() => setShowConfirmation(false)}>Batal</button>
  </Modal>
)}
```

---

### ✅ Pagination, Filter & Sort (Server-Side)

**Backend Route:**
```typescript
// GET /api/properties?page=1&limit=10&sort=name&order=asc&search=Jakarta&category=hotel
router.get('/properties', listPropertiesController);

// Controller (Max 15 baris per function)
export const listPropertiesController = async (req: Request, res: Response) => {
  const { page = 1, limit = 10, sort = 'created_at', order = 'desc', search, category } = req.query;
  
  const where = buildWhere(search, category);
  const skip = (Number(page) - 1) * Number(limit);
  
  const [items, total] = await Promise.all([
    prisma.property.findMany({ where, skip, take: Number(limit), orderBy: { [sort]: order } }),
    prisma.property.count({ where })
  ]);
  
  res.json({ data: { items, pagination: { total, page, limit, pages: Math.ceil(total / limit) } } });
};

// Helper function (Max 15 baris)
const buildWhere = (search?: string, category?: string) => {
  const where: any = { deleted_at: null };
  if (search) where.name = { contains: search, mode: 'insensitive' };
  if (category) where.categoryId = category;
  return where;
};
```

**Frontend:**
```typescript
// Panggil API dengan query params
const fetchProperties = async (page: number, search: string) => {
  const response = await axios.get('/api/properties', {
    params: { page, limit: 10, search, sort: 'name', order: 'asc' }
  });
  setProperties(response.data.data.items);
  setPagination(response.data.data.pagination);
};

// Render pagination UI
{pagination.pages > 1 && (
  <div className="flex gap-2">
    {Array.from({ length: pagination.pages }).map((..., i) => (
      <button 
        key={i} 
        onClick={() => fetchProperties(i + 1, search)}
        className={i + 1 === pagination.page ? 'bg-blue-600' : ''}
      >
        {i + 1}
      </button>
    ))}
  </div>
)}
```

---

### ✅ Frontend Standards

**Responsive Design:**
```typescript
// Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Column 1 di mobile, 2 di tablet, 3 di desktop */}
</div>

// Breakpoints: 640px (md), 1024px (lg), 1280px (xl)
```

**Title & Favicon:**
```html
<!-- index.html -->
<title>Property Renting - Jelajahi Akomodasi Terbaik</title>
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

**File Naming Convention:**
```
Components:    PropertyCard.tsx, PriceCalendar.tsx (PascalCase)
Pages:         HomePage.tsx, PropertyDetailPage.tsx (PascalCase)
Utilities:     formatters.ts, helpers.ts (camelCase)
Types:         user.ts, property.ts (camelCase)
Stores:        authStore.ts, propertyStore.ts (camelCase)
```

**JSX Extension:**
```
.tsx = file yang berisi JSX (React components)
.ts  = file TypeScript pure (utilities, types, constants)

✅ PropertyCard.tsx      (contains JSX)
✅ formatters.ts         (no JSX, only functions)
❌ PropertyCard.ts       (should be .tsx)
❌ formatters.tsx        (should be .ts)
```

---

### ✅ Backend Standards

**REST API Conventions:**
```
GET    /api/resource           - List (dengan pagination)
GET    /api/resource/:id       - Detail
POST   /api/resource           - Create
PUT    /api/resource/:id       - Full update
PATCH  /api/resource/:id       - Partial update
DELETE /api/resource/:id       - Delete

✅ GET /api/properties/:propertyId/rooms
✅ POST /api/orders/:orderId/payment
❌ GET /api/getProperties (should be /api/properties)
❌ POST /api/createOrder (should be POST /api/orders)
```

**Authorization Pattern:**
```typescript
// Middleware untuk authorization
export const requireAuth = authMiddleware;
export const requireRole = (roles: Role[]) => 
  (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };

// Route dengan authorization
router.post('/properties', requireAuth, requireRole(['TENANT']), createPropertyController);
router.put('/orders/:id/confirm', requireAuth, requireRole(['TENANT']), confirmPaymentController);
```

---

### ✅ Clean Code Standards

**Max 200 Lines Per File:**
```typescript
// ❌ File terlalu panjang (> 200 baris)
// services/propertyService.ts (250+ baris)
// - Pecah menjadi: propertyService.ts, roomService.ts, pricingService.ts

// ✅ Terstruktur baik
// services/propertyService.ts (150 baris)
// services/roomService.ts (80 baris)
// services/pricingService.ts (120 baris)
```

**Max 15 Lines Per Function:**
```typescript
// ❌ Function terlalu panjang
export const calculatePrice = (roomId, checkIn, checkOut) => {
  const room = await prisma.room.findUnique(...);
  let totalPrice = 0;
  // ... 30+ lines of logic
};

// ✅ Dipecah menjadi sub-functions
export const calculatePrice = async (roomId, checkIn, checkOut) => {
  const room = await getRoom(roomId);
  const dailyPrices = await getDailyPrices(room, checkIn, checkOut);
  return sumPrices(dailyPrices);
};

const getRoom = async (roomId) => await prisma.room.findUnique(...);

const getDailyPrices = async (room, checkIn, checkOut) => {
  // Logic untuk hitung harga per hari
  return dailyPrices;
};

const sumPrices = (prices) => prices.reduce((a, b) => a + b, 0);
```

**Hapus Semua Console.log:**
```typescript
// ❌ Sebelum production
console.log('User:', user);
console.log('Debugging:', result);

// ✅ Sesudah production
// Gunakan proper logging atau remove entirely
logger.info('User created', { userId: user.id });

// Jika butuh logging:
// npm install pino (atau winston)
```

**Hapus Unused Code:**
```typescript
// ❌ Kode tidak terpakai
import { unusedFunction } from './helpers'; // Tidak dipakai
const tempVar = 'test'; // Tidak dipakai
function oldLogic() {} // Deprecated, tidak dipakai

// ✅ Bersih
import { validateEmail } from './helpers';
// Hanya import yang dipakai
```

---

### ✅ Database Delete Strategy

**Soft Delete vs Hard Delete:**

```prisma
// SOFT DELETE - untuk data penting (User, Order, Property, Review)
model User {
  id String @id @default(cuid())
  email String @unique
  deleted_at DateTime?    // Null = active, set = deleted
}

// Hard Delete - untuk image/file di storage
model PropertyImage {
  id String @id @default(cuid())
  propertyId String
  image_url String       // Hapus dari Cloudinary
  // Tidak ada deleted_at
}

// Query dengan soft delete
const activeUsers = await prisma.user.findMany({
  where: { deleted_at: null }
});

// Saat delete
await prisma.user.update({
  where: { id },
  data: { deleted_at: new Date() }
});
```

**Implementation:**
```typescript
// Delete property (soft delete - tetap di database)
export const deleteProperty = async (propertyId: string) => {
  return await prisma.property.update({
    where: { id: propertyId },
    data: { deleted_at: new Date() }
  });
};

// Delete property image (hard delete - hapus dari Cloudinary)
export const deletePropertyImage = async (imageId: string) => {
  const image = await prisma.propertyImage.findUnique({ where: { id: imageId } });
  
  // Hapus dari Cloudinary
  await cloudinary.v2.uploader.destroy(image.cloudinary_public_id);
  
  // Hapus dari database
  await prisma.propertyImage.delete({ where: { id: imageId } });
};
```

---

## 🔌 API Conventions

**Response Format:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Data berhasil diambil",
  "data": { /* response data */ }
}
```

**Status Codes:**
```
200 - OK              201 - Created
400 - Bad Request     401 - Unauthorized
403 - Forbidden       404 - Not Found
500 - Internal Error
```

---

## 🎨 Development Patterns

### Component Pattern (Max 200 lines)
```typescript
// components/PropertyCard.tsx
import { FC } from 'react';
import { Property } from '@/types';

interface Props {
  property: Property;
  onClick?: () => void;
}

const PropertyCard: FC<Props> = ({ property, onClick }) => {
  const handleClick = () => onClick?.();
  
  return (
    <div onClick={handleClick} className="...">
      {/* JSX */}
    </div>
  );
};

export default PropertyCard;
```

### Service Pattern (Max 200 lines)
```typescript
// services/propertyService.ts
import axios from '@/lib/api';

export const propertyService = {
  async getProperties(filters: FilterParams) {
    return axios.get('/properties', { params: filters });
  },
  
  async getPropertyDetail(id: string) {
    return axios.get(`/properties/${id}`);
  }
};
```

### Store Pattern (Zustand)
```typescript
// stores/authStore.ts
import { create } from 'zustand';

interface AuthStore {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  login: async (email, password) => {
    const { data } = await authService.login(email, password);
    set({ user: data.user });
  }
}));
```

---

## 🚀 Development Workflow

### Git Flow
```bash
git checkout -b feature/auth-login
git add .
git commit -m "feat: implement login"
git push origin feature/auth-login
# Create PR on GitHub
```

### Run Development
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Database Migration
```bash
cd backend
npx prisma migrate dev --name add_users_table
```

---

## ✅ Pre-Production Checklist

- [ ] Semua input divalidasi (client + server)
- [ ] File upload validasi (type, size)
- [ ] Aksi destruktif ada konfirmasi user
- [ ] Pagination/filter/sort server-side
- [ ] Responsive mobile + desktop
- [ ] Title & favicon set
- [ ] File naming konsisten
- [ ] .tsx untuk JSX, .ts untuk pure TS
- [ ] REST API RESTful
- [ ] Authorization diterapkan
- [ ] Max 200 lines per file
- [ ] Max 15 lines per function
- [ ] Semua console.log dihapus
- [ ] Unused code dihapus
- [ ] Soft delete untuk data penting
- [ ] Hard delete untuk images
- [ ] Database migration clean
- [ ] Error handling proper
- [ ] Email notifications working
- [ ] Cron jobs tested

---

**Last Updated:** May 18, 2026 | **Version:** 1.1.0 | **Status:** Ready for Development 🚀
