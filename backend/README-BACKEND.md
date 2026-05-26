# Final Project Purwadhika

jcwdbgpm-11 (Offline Bandung)

    Group 1 :
    - Anggita Zahra Kamila  (Anggi)
    - Muhammad Ali Akbar    (Ali)

## Backend Property Renting Web App

### Tech Stack

npm :

    - npm init -y
    - npm install express cors dotenv
    - npm install @prisma/client
    - npm install -D prisma typescript ts-node @types/express @types/node
    - npm install jsonwebtoken bcryptjs nodemailer
    - npm install -D @types/jsonwebtoken @types/bcryptjs @types/nodemailer
    - npm install zod
    - npm install multer
    - npm install cloudinary
    - npm install midtrans-client
    - npm install node-cron
    - npm install -D nodemon

### Backend Dependencies:

    -  Express.js v5     :  Web framework untuk API routing
    -  Prisma ORM v7.8.0 :  Database ORM dan migration tool
    -  TypeScript v6     :  Type safety dan development
    -  JWT              :  Authentication dan authorization
    -  Bcryptjs         :  Password hashing dengan salt rounds 10
    -  Nodemailer       :  Email notifications (verification, reminders, etc.)
    -  Multer           :  File upload handling
    -  Cloudinary       :  Image storage dan management
    -  Midtrans Client  :  Payment gateway integration
    -  Node Cron        :  Scheduled background jobs
    -  Zod              :  Request validation schemas
    -  CORS             :  Cross-origin requests
    -  Dotenv           :  Environment variables management

### Project Structure

```
backend/src/
├── config/            # Configuration files (database, Cloudinary, Midtrans)
├── controllers/       # Request handlers (16 controllers)
├── middlewares/       # Authentication, error handling, validation
├── routes/            # API route definitions
├── services/          # Business logic layer (16 services)
├── types/             # TypeScript type definitions
├── utils/             # Helper functions (email, upload, response formatting)
└── validations/       # Zod validation schemas
```

### Key Features

1. Multi-role Authentication (USER/TENANT)
2. Email Verification with JWT tokens
3. Google OAuth integration
4. Property Management CRUD with categories
5. Dynamic Pricing with peak season rates
6. Room Availability Management
7. Order/Booking System with 2-hour payment window
8. Payment Processing (Manual transfer + Midtrans)
9. Reviews and Ratings with reply system
10. Analytics and Reports Dashboard
11. Automated Email Notifications
12. Cron Jobs for scheduled tasks

### Database Setup

1. Create .env file with DATABASE_URL and credentials
2. Run: npx prisma migrate dev
3. Optional: npx prisma db seed (for dummy data)
4. Access Prisma Studio: npx prisma studio

### Running the Server

```bash
npm run dev     # Development mode with nodemon
npm run build   # Build TypeScript
npm start       # Production mode
```

### Service Modules (Total: 16 services)

- propertyService - Property retrieval with filtering
- orderService - Order management and Midtrans integration
- authService - Authentication and JWT token management
- tenantPropertyService - Tenant property CRUD
- tenantReportService - Sales reports and analytics
- tenantRoomService - Room management
- emailService - Email template and sending
- availabilityService - Availability checking
- midtransService - Payment gateway integration
- pricingService - Pricing calculations
- reviewService - Review and rating system
- userService - User profile management
- tenantReviewService - Tenant review operations
- And 3 additional utility services

## Pull schema

- npx prisma db pull
- npx prisma generate
- cek perubahan di schema.prisma
- npm run dev
