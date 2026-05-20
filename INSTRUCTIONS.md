# INSTRUCTIONS.md

## Project Identity

Build a production-level Property Renting Web App inspired by the UX quality, search experience, spacing system, and visual hierarchy of https://www.hipcamp.com/ 

This project is a final project for Purwadhika and MUST strictly follow all requirements from the project brief document. The system is a multi-role property rental marketplace with:

- USER role
- TENANT role
- Separate dashboard and authorization access
- Dynamic pricing system
- Property booking system
- Manual payment confirmation
- Review and reporting system

Current stack already used in the project:

## Existing Tech Stack (DO NOT CHANGE)

### Frontend

- React 19
- TypeScript
- Vite
- TailwindCSS v4
- React Router DOM v7
- Zustand
- Axios
- React Hook Form
- Zod
- Framer Motion
- Lucide React
- Leaflet / React Leaflet

### Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL (Supabase)
- JWT Authentication
- bcryptjs
- multer
- Cloudinary
- Nodemailer
- Midtrans
- node-cron

### Architecture

- Monorepo style
- Separate frontend and backend
- MVC + Service Layer pattern
- REST API architecture
- Server-side pagination/filter/sorting

---

# PRIMARY OBJECTIVE

The main objective is NOT only making features work.

The objective is:

1. Fulfill ALL Purwadhika mandatory requirements
2. Build production-quality architecture
3. Create polished UI/UX inspired by Hipcamp
4. Maintain clean scalable codebase
5. Build maintainable and reusable systems
6. Ensure responsive mobile-first implementation
7. Build strong separation between USER and TENANT systems
8. Ensure all validation exists on both frontend and backend

---

# IMPORTANT DEVELOPMENT PRINCIPLES

## Mandatory Rules

### Code Quality

- Maximum 200 lines per file
- Maximum 15 lines per function
- Refactor aggressively
- Avoid duplicated logic
- Use reusable abstractions
- Use feature-based architecture
- Remove unused imports/logs/code
- Use strict typing
- Avoid any type unless absolutely necessary

### UI/UX Quality

The UI MUST feel modern and premium.

Target feel:

- Hipcamp
- Airbnb
- Booking.com modern mobile experience

Must have:

- Excellent spacing
- Soft shadows
- Rounded corners
- Modern cards
- Smooth transitions
- Skeleton loading
- Empty states
- Error states
- Disabled states
- Success feedback
- Toast notifications
- Smooth hover/focus states
- Responsive layouts
- Mobile-first design

### Design Direction

Use:

- Large hero search area
- Immersive property cards
- Large image galleries
- Sticky booking sidebar
- Clean typography
- Strong visual hierarchy
- Spacious layouts
- Minimal but premium interface

Avoid:

- Admin template look
- Dense tables everywhere
- Outdated dashboard styles
- Overly colorful UI
- Sharp edges
- Poor spacing

---

# REQUIRED CORE FEATURES

# AUTHENTICATION SYSTEM

## Multi Role Authentication

Roles:

- USER
- TENANT

Rules:

- User cannot access tenant pages
- Tenant cannot access user-only features
- Unauthorized users redirected to homepage
- Protected routes required
- Backend authorization required

## Registration

Separate registration pages:

- /register/user
- /register/tenant

Support:

- Email registration
- Google login

Requirements:

- Email uniqueness validation
- Email verification flow
- Password setup after verification
- Expired verification token handling
- Resend verification email

## Login

Separate login pages:

- /login/user
- /login/tenant

Features:

- Remember session
- JWT auth
- Refresh handling if implemented
- Protected persistent auth state

## Reset Password

Required pages:

- Request reset password
- Confirm reset password

Requirements:

- Secure token
- One-time usage
- Expiration validation

## Profile Management

Features:

- Edit profile
- Upload profile picture
- Change password
- Change email with re-verification

Validation:

- jpg/jpeg/png/gif only
- max 1MB

---

# LANDING PAGE

## Main Objective

Landing page MUST resemble premium travel/property booking platforms.

## Required Sections

### Navigation

Include:

- Logo
- Search trigger
- Login/Register
- Become a Tenant CTA
- Profile dropdown
- Responsive mobile menu

### Hero Section

Must contain:

- Large search form
- Destination selector
- Date picker
- Guest count
- Duration
- Strong visual imagery

### Property Discovery Section

Include:

- Featured properties
- Trending destinations
- Categories
- Promotions
- Testimonials

### Footer

Include:

- Company links
- Support
- Terms
- Social links
- Copyright

---

# PROPERTY SYSTEM

# Property Catalog

## Search & Filtering

Mandatory:

- Server-side pagination
- Server-side filtering
- Server-side sorting

Filters:

- Destination city
- Property category
- Price range
- Guest capacity
- Availability
- Property name

Sorting:

- Price ASC/DESC
- Name ASC/DESC
- Newest

## Property Card Requirements

Each card MUST contain:

- Property image
- Property name
- Category
- Location
- Lowest room price
- Rating
- Availability status
- Capacity
- CTA button

## Property Detail Page

Must include:

- Large gallery
- Image carousel
- Property details
- Amenities
- Room list
- Availability calendar
- Dynamic pricing calendar
- Reviews
- Similar properties
- Sticky booking section

Calendar MUST:

- Show daily pricing
- Show unavailable dates
- Support monthly navigation
- Support comparison between dates

---

# TENANT MANAGEMENT SYSTEM

## Tenant Dashboard

Must include:

- Analytics summary
- Booking statistics
- Revenue summary
- Property management shortcut
- Recent transactions

## Property Management

Tenant can:

- Create property
- Edit property
- Delete property
- Manage images
- Manage rooms
- Manage pricing
- Manage availability

## Property Fields

Mandatory:

- Name
- Category
- Description
- Address
- City
- Province
- Latitude
- Longitude
- Images
- Amenities

## Room Management

Each property can contain multiple rooms.

Room fields:

- Room name
- Capacity
- Price
- Description
- Quantity
- Images

## Peak Season Pricing

Support:

- Percentage increase
- Nominal increase
- Date range
- Specific dates

Must dynamically affect:

- Search result pricing
- Property detail pricing
- Checkout pricing

## Availability System

Tenant can:

- Block dates
- Open dates
- Manage room availability

Unavailable rooms MUST NOT be bookable.

---

# BOOKING SYSTEM

# Reservation Flow

Flow:

1. Search property
2. Open detail
3. Select room
4. Select dates
5. Calculate price
6. Checkout
7. Upload payment proof
8. Tenant confirmation
9. Booking processed

## Checkout Requirements

Must calculate:

- Base price
- Peak season adjustment
- Duration
- Total nights
- Final total

## Order Statuses

Mandatory statuses:

- WAITING_PAYMENT
- WAITING_CONFIRMATION
- PROCESSED
- CANCELLED
- COMPLETED

## Payment Proof Upload

Validation:

- jpg/png only
- max 1MB

Rules:

- Auto cancel after expiration
- Countdown timer
- Manual confirmation by tenant

## Auto Cancellation

Use cron jobs.

Requirements:

- Cancel unpaid bookings automatically
- Restore room availability automatically

---

# REVIEW SYSTEM

Rules:

- User can review after checkout
- One review per booking
- Tenant can reply

Review data:

- Rating
- Comment
- Reply
- Created date

---

# REPORTING SYSTEM

# Tenant Reports

Required:

- Sales report
- Transaction report
- Revenue analytics
- Property occupancy

Filters:

- Date range
- Property
- Status

Visualization:

- Charts
- KPI cards
- Calendar occupancy

---

# EMAIL SYSTEM

Required email flows:

- Email verification
- Reset password
- Booking confirmation
- Payment confirmation
- Booking reminder H-1
- Booking cancellation

Email templates MUST:

- Look professional
- Responsive
- Branded
- Reusable

---

# DATABASE RULES

## Prisma Requirements

Use:

- Proper relational modeling
- Enum types
- Soft delete where necessary
- createdAt/updatedAt
- Indexes for performance

Critical relations:

- User -> Property
- Property -> Room
- Room -> Booking
- Booking -> Review

---

# FRONTEND ENGINEERING RULES

## Component Structure

Preferred structure:

```txt
src/
  components/
    common/
    ui/
    forms/
    property/
    booking/
    tenant/
  pages/
  hooks/
  services/
  stores/
  lib/
  types/
  layouts/
```

## State Management

Use Zustand for:

- Auth state
- Theme state
- Search filters
- Booking flow

Avoid excessive prop drilling.

## Forms

Use:

- React Hook Form
- Zod validation

Validation MUST exist:

- Client-side
- Server-side

## API Layer

Centralize API calls.

Requirements:

- Axios instance
- Interceptors
- Auth token injection
- Global error handling

---

# BACKEND ENGINEERING RULES

## API Standards

Use RESTful conventions.

Examples:

```txt
GET /properties
GET /properties/:id
POST /properties
PATCH /properties/:id
DELETE /properties/:id
```

## Required Layers

```txt
controllers/
services/
repositories/ (optional)
routes/
middlewares/
validators/
utils/
```

## Backend Validation

Use Zod.

Validate:

- body
- params
- query
- uploaded files

## Security

Must implement:

- JWT verification
- Role authorization
- Password hashing
- Rate limiting if possible
- Secure upload validation
- Environment variable protection

---

# PERFORMANCE REQUIREMENTS

Must optimize:

- Lazy loading
- Image optimization
- Pagination
- Query optimization
- Debounced search
- Skeleton loading
- Code splitting

---

# RESPONSIVE REQUIREMENTS

Must support:

- Mobile
- Tablet
- Desktop

Primary approach:

- Mobile first

Critical:

- Search form mobile UX
- Mobile navbar
- Mobile booking flow
- Responsive calendar
- Responsive tables/cards

---

# ACCESSIBILITY REQUIREMENTS

Must include:

- Semantic HTML
- Keyboard navigation
- Focus states
- Proper labels
- Proper button states
- Accessible forms

---

# UI COMPONENT PRIORITY

Build reusable components:

High Priority:

- Button
- Input
- Modal
- Dialog
- Dropdown
- Calendar
- PropertyCard
- RoomCard
- BookingCard
- Pagination
- Table
- EmptyState
- Skeleton
- Toast

---

# SEARCH EXPERIENCE PRIORITY

The search experience is one of the MOST IMPORTANT features.

Must feel premium like:

- Hipcamp
- Airbnb
- Booking platforms

Search UX should include:

- Instant feedback
- Smart filtering
- Clear availability display
- Dynamic pricing visibility
- Smooth loading

---

# AI AGENT EXECUTION PRIORITIES

When implementing features:

Priority order:

1. Architecture quality
2. Feature completeness
3. Validation completeness
4. Authorization/security
5. Responsive UI
6. UX polish
7. Performance optimization
8. Animations/micro interactions

---

# DEVELOPMENT STRATEGY

Recommended order:

## Phase 1

- Setup architecture
- Database schema
- Authentication
- Authorization
- Layout system
- UI foundation

## Phase 2

- Landing page
- Property catalog
- Property detail
- Search/filtering

## Phase 3

- Tenant dashboard
- Property CRUD
- Room management
- Availability management

## Phase 4

- Booking flow
- Payment upload
- Transaction system
- Order management

## Phase 5

- Review system
- Reporting
- Notifications
- Email automation

## Phase 6

- Optimization
- Refactoring
- Accessibility
- UI polish
- Testing

---

# CRITICAL FINAL CHECKLIST

Before considering feature complete, verify:

## Mandatory Technical Checks

- All lists use pagination
- All lists use server-side processing
- All forms validated client/server
- All uploads validated
- All protected routes secured
- All roles isolated correctly
- All APIs authorized properly
- All responsive layouts working
- No console.log left
- No unused imports
- No oversized files/functions

## Mandatory UX Checks

- Mobile UX polished
- Empty states exist
- Error states exist
- Loading states exist
- Disabled states exist
- Toast feedback exists
- Proper confirmation dialogs exist
- Premium spacing consistency
- Modern typography consistency

## Mandatory Business Logic Checks

- Availability validation works
- Double booking prevented
- Pricing calculation accurate
- Peak pricing works
- Auto cancel works
- Booking expiration works
- Review restrictions enforced
- Tenant isolation enforced

---

# FINAL OUTPUT EXPECTATION

The final application should feel like:

- A real startup product
- Production-ready SaaS
- Premium booking platform
- Modern travel marketplace

NOT like:

- Basic campus CRUD project
- Generic admin template
- Minimal unfinished MVP

The quality target is a polished modern marketplace platform with strong UX, scalable architecture, and complete business logic.
