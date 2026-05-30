# README — Backend PURWALOKA

**Final Project Purwadhika — jcwdbgpm-11 (Offline Bandung)**

```
Group 1:
- Anggita Zahra Kamila  (Anggi)
- Muhammad Ali Akbar    (Ali)
```

## Backend — Property Renting Web App

---

### Tech Stack (Instalasi)

```bash
npm init -y
npm install express cors dotenv cookie-parser
npm install @prisma/client
npm install -D prisma typescript ts-node @types/express @types/node
npm install jsonwebtoken bcryptjs nodemailer
npm install -D @types/jsonwebtoken @types/bcryptjs @types/nodemailer
npm install zod
npm install multer
npm install cloudinary
npm install midtrans-client
npm install node-cron
npm install -D nodemon
```

---

### Backend Dependencies

| Package | Fungsi |
|---------|--------|
| Express.js v5 | Web framework untuk API routing |
| Prisma ORM v7.8.0 | Database ORM dan migration tool |
| TypeScript v6 | Type safety dan development |
| JWT | Authentication dan authorization |
| Bcryptjs | Password hashing (salt rounds 10) |
| Cookie-parser | Parsing HttpOnly cookie dari request |
| Nodemailer | Email notifications (verification, reminders) |
| Multer | File upload handling |
| Cloudinary | Image storage dan management |
| Midtrans Client | Payment gateway integration |
| Node Cron | Scheduled background jobs |
| Zod | Request validation schemas |
| CORS | Cross-origin requests |
| Dotenv | Environment variables management |

---

### Project Structure

```
backend/src/
├── config/            # Configuration files (database, Cloudinary, Midtrans)
├── controllers/       # Request handlers
├── middlewares/       # Authentication, error handling, validation
├── routes/            # API route definitions
├── services/          # Business logic layer (13 services)
│   ├── authService.ts            # Auth, JWT, email verify, Google OAuth
│   ├── availabilityService.ts    # Room availability checking
│   ├── midtransService.ts        # Payment gateway integration
│   ├── orderService.ts           # Order management & Midtrans
│   ├── pricingService.ts         # Pricing + getValidatedStayDetails (Facade)
│   ├── propertyService.ts        # Property listing dengan filter
│   ├── reviewService.ts          # Review & rating (integer validation)
│   ├── tenantPropertyService.ts  # Tenant property CRUD + transactional image delete
│   ├── tenantReportService.ts    # Sales reports dan analytics
│   ├── tenantReviewService.ts    # Tenant review operations
│   ├── tenantRoomService.ts      # Room management + IDOR protection
│   ├── tokenBlacklistService.ts  # JWT token revocation (server-side logout)
│   └── userService.ts            # User profile management
├── types/             # TypeScript type definitions
├── utils/             # Helper functions (email, upload, response formatting)
└── validations/       # Zod validation schemas
```

---

### Key Features & Security

1. Multi-role Authentication (USER/TENANT) via HttpOnly Cookie
2. Server-side token revocation pada logout (Token Blacklist)
3. Email Verification dengan JWT token
4. Google OAuth integration
5. Property Management CRUD dengan kategori
6. Dynamic Pricing dengan peak season rates (PERCENTAGE/NOMINAL)
   - Validasi tumpang tindih tanggal Peak Season
   - Facade pattern: `getValidatedStayDetails` (cek ketersediaan + harga atomik)
7. Room Availability Management dengan proteksi IDOR (`verifyRoomOwner`)
8. Order/Booking System dengan 2-hour payment window
9. Payment Processing (Manual transfer + Midtrans)
10. Transactional Image Delete (DB-first, Cloudinary-after)
11. Reviews dengan validasi integer rating 1–5
12. Analytics dan Reports Dashboard
13. Automated Email Notifications
14. Cron Jobs untuk scheduled tasks (order expiry, reminders)

---

### Database Setup

```bash
# 1. Buat file .env dengan DATABASE_URL (lihat .env.example)
# 2. Jalankan migrasi
npx prisma migrate dev

# 3. Opsional: isi dummy data
npx prisma db seed

# 4. Akses Prisma Studio
npx prisma studio
```

**Jika ada schema drift (development only):**
```bash
npx prisma migrate reset --force
```

**Pull schema dari database yang sudah ada:**
```bash
npx prisma db pull
npx prisma generate
```

---

### Running the Server

```bash
npm run dev     # Development mode dengan nodemon
npm run build   # Build TypeScript ke dist/
npm start       # Production mode (jalankan dist/server.js)
```

---

### Environment Variables

Buat file `.env` di folder `backend/`:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your_app_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Midtrans
MIDTRANS_SERVER_KEY=your_server_key
MIDTRANS_CLIENT_KEY=your_client_key

# App
FRONTEND_URL=http://localhost:5173
```

Lihat `.env.example` untuk referensi lengkap.

---

### API Endpoints Overview

| Domain | Method | Endpoint |
|--------|--------|----------|
| Auth | POST | `/api/auth/login` `/api/auth/register` `/api/auth/logout` |
| Auth | GET | `/api/auth/me` |
| Property | GET | `/api/properties` `/api/properties/:id` |
| Order | POST | `/api/orders` |
| Review | POST | `/api/reviews/:orderId` |
| Tenant | GET/POST/PUT/DELETE | `/api/tenant/properties` `/api/tenant/rooms` |
| Tenant | GET/POST | `/api/tenant/peak-rates` `/api/tenant/availability` |

---

*Last Updated: May 30, 2026*
