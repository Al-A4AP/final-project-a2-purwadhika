# README - Backend PURWALOKA

Backend PURWALOKA adalah REST API berbasis Node.js, Express.js, TypeScript, dan
Prisma ORM untuk aplikasi Property Renting Web App. Backend menangani auth,
property, room, booking, payment, review, report tenant, image upload, dan
scheduled tasks.

Final Project Purwadhika JCWDBGPM-11, Group 1:

- Muhammad Ali Akbar - Fitur 1
- Anggita Zahra Kamila - Fitur 2

## Tech Stack

- Node.js
- Express.js 5
- TypeScript 6
- Prisma ORM 7
- PostgreSQL/Supabase
- Cloudinary
- Midtrans
- Nodemailer
- node-cron
- Zod
- JWT
- bcryptjs
- cookie-parser
- multer
- express-rate-limit

## Struktur Folder

```text
backend/
  prisma/
    migrations/
    scripts/
      backfillAmenities.ts
    seed/
      amenities.ts
      cleanup.ts
      data.ts
      images.ts
      log.ts
      orders.ts
      properties.ts
      rooms.ts
      summary.ts
      users.ts
    schema.prisma
    seed.ts
  src/
    config/
      cloudinary.ts
      midtrans.ts
      prisma.ts
    constants/
      orderConstants.ts
    controllers/
    middlewares/
    routes/
    services/
    types/
    utils/
    validations/
    cron.ts
  server.ts
  package.json
  README-BACKEND.md
```

## Domain API

| Domain | Route utama | File terkait |
| --- | --- | --- |
| Auth | `/api/auth` | `src/routes/authRoutes.ts`, `src/controllers/authController.ts`, `src/services/authService.ts` |
| Properties public | `/api/properties` | `src/routes/propertyRoutes.ts`, `src/controllers/propertyController.ts`, `src/services/propertyService.ts` |
| Orders user | `/api/orders` | `src/routes/orderRoutes.ts`, `src/controllers/orderController.ts`, `src/services/orderService.ts`, `src/services/userOrderService.ts` |
| User profile | `/api/users` | `src/routes/userRoutes.ts`, `src/controllers/userController.ts`, `src/services/userService.ts` |
| Reviews | `/api/orders/:orderId/reviews`, tenant review routes | `src/controllers/reviewController.ts`, `src/services/reviewService.ts`, `src/services/tenantReviewService.ts` |
| Tenant | `/api/tenant` | `src/routes/tenantRoutes.ts`, tenant controllers, tenant services |

## Fitur 1 di Backend

| Requirement | Status | Folder/file |
| --- | --- | --- |
| Auth USER/TENANT | Selesai | `src/services/authService.ts`, `src/controllers/authController.ts`, `src/middlewares/authMiddleware.ts` |
| Email verification, email change, dan reset password | Selesai | `src/services/authService.ts`, `src/services/userEmailService.ts`, `src/utils/emailService.ts`, `src/utils/emailTemplate.ts` |
| Google OAuth | Selesai | `src/services/googleAuthService.ts`, `src/services/authGoogleService.ts` |
| Public property list dan detail | Selesai | `src/services/propertyService.ts`, `src/services/propertyQueryService.ts` |
| Server-side filter harga, kota, kategori, fasilitas | Selesai | `src/services/propertyQueryService.ts` |
| Sort dan pagination property | Selesai | `src/services/propertyService.ts`, `src/services/propertyPriceSortService.ts`; sort requirement `name` dan `price` sudah tersedia dengan pagination server-side. |
| Public calendar availability | Selesai | `src/services/publicAvailabilityService.ts`; maksimal 90 hari per request. |
| Tenant property CRUD | Selesai | `src/services/tenantPropertyService.ts`, `src/controllers/tenantPropertyController.ts` |
| Tenant room CRUD dan room images | Selesai | `src/services/tenantRoomService.ts`, `src/controllers/tenantRoomController.ts` |
| Peak rates dan room availability | Selesai | `src/services/tenantRoomService.ts`, `src/services/availabilityService.ts` |
| Tenant category CRUD | Selesai | `src/controllers/categoryController.ts`, `src/services/categoryService.ts`, `src/routes/tenantRoutes.ts` |

## Fitur 2 di Backend

| Requirement | Status | Folder/file |
| --- | --- | --- |
| Booking dan validasi ketersediaan | Selesai | `src/services/orderService.ts`, `src/services/pricingService.ts`, `src/services/availabilityService.ts` |
| Payment manual dan Midtrans | Selesai | `src/services/orderService.ts`, `src/services/midtransService.ts`, `src/config/midtrans.ts` |
| Payment proof deadline 1 jam | Selesai | `src/constants/orderConstants.ts` |
| Tenant update status order | Selesai | `src/services/orderService.ts`, `src/controllers/orderController.ts` |
| Auto-cancel unpaid reservations | Selesai | `src/cron.ts`, `src/services/orderService.ts` |
| Auto-complete PROCESSED setelah checkout | Selesai | `src/cron.ts` |
| Reminder checkout H-1 | Selesai | `src/cron.ts`, `src/utils/emailService.ts` |
| Review setelah checkout | Selesai | `src/services/reviewService.ts` |
| Tenant reply review | Selesai | `src/services/tenantReviewService.ts` |
| Report dan analytics tenant | Selesai | `src/services/tenantReportService.ts`, `src/controllers/tenantReportController.ts` |

## Environment

Buat file `.env` di folder `backend/` dengan acuan `backend/.env.example`.

```env
DATABASE_URL=
DIRECT_URL=

JWT_SECRET=
JWT_EXPIRES_IN=7d

EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=false

PORT=5000
NODE_ENV=development
ENABLE_CRON=true
ALLOWED_ORIGINS=
FRONTEND_URL=http://localhost:5173
```

## Database

Generate Prisma client:

```bash
npx prisma generate
```

Jalankan migration development:

```bash
npx prisma migrate dev
```

Jalankan seed dummy data:

```bash
npx prisma db seed
```

Jalankan Prisma Studio:

```bash
npx prisma studio
```

Script fasilitas untuk data existing:

```bash
npm run backfill:amenities
```

Mode dry-run adalah default. Untuk menulis perubahan ke database:

```bash
set APPLY_AMENITIES=true
npm run backfill:amenities
```

Gunakan script backfill hanya setelah memastikan `DATABASE_URL` mengarah ke
database yang benar.

## Menjalankan Backend

```bash
npm install
npm run dev
```

Perintah lain:

```bash
npm run build
npm start
npm run seed
npm run backfill:amenities
```

Default local backend:

- API base: `http://localhost:5000/api`
- Health check: `http://localhost:5000/api/health`

## Deployment

Backend harus dideploy sebagai persistent Node.js server, bukan serverless.
Alasannya:

- Express API perlu berjalan terus.
- Cron job di `src/cron.ts` memproses auto-cancel unpaid reservations.
- Cron job juga memproses reminder dan auto-complete order.
- Booking management dan auth membutuhkan proses server yang stabil.
- Upload Cloudinary dan Midtrans notification membutuhkan endpoint backend aktif.

Platform yang cocok: Render, Railway, VPS, atau platform lain yang menjalankan
long-running Node process. Set `ENABLE_CRON=true` hanya di environment yang
memang menjalankan persistent process.

## Catatan Audit Backend

- `node_modules/.bin/tsc --noEmit` lulus tanpa error pada audit 01 Juni 2026.
- Tidak ada file di `src` atau `prisma` yang melebihi 200 baris (diverifikasi via scan PowerShell, hasil 0 file).
- Seluruh service telah di-refactor menjadi fungsi-fungsi mikro rata-rata 8-14 baris, sesuai aturan maksimal 15 baris.
- Scan source tidak menemukan `console.log` aktif yang tidak terpakai.
- `npm test` masih placeholder, sehingga automated test belum tersedia.
- File `.env` lokal tidak ikut Git jika `.gitignore` tetap dipatuhi; jangan
  commit credential Supabase, Cloudinary, Midtrans, atau email.
