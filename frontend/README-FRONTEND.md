# Final Project Purwadhika
  jcwdbgpm-11 (Offline Bandung)

    Group 1 :
    - Anggita Zahra Kamila  (Anggi)
    - Muhammad Ali Akbar    (Ali)

## Frontend Property Renting Web App

### Tech Stack
  npm :

    - npm create vite@latest . -- --template react-ts
    - npm install react@19 react-dom@19
    - npm install tailwindcss @tailwindcss/vite
    - npm install axios
    - npm install zod react-hook-form
    - npm install zustand
    - npm install framer-motion
    - npm install lucide-react
    - npm install react-router-dom
    - npm install react-hot-toast         
    - npm install react-datepicker        
    - npm install @types/react-datepicker
    - npm install recharts
    - npm install leaflet react-leaflet
    - npm install -D @types/leaflet

### Frontend Dependencies:

    -  React 19          : UI framework utama
    -  React Router v7   : Routing dan navigation
    -  Tailwind CSS v4   : Utility-first CSS framework
    -  Vite              : Build tool dan dev server
    -  TypeScript v6     : Type safety
    -  Axios             : HTTP client untuk API calls
    -  Zustand           : State management (authStore, filterStore, themeStore)
    -  Zod               : Schema validation
    -  React Hook Form   : Form state management
    -  Framer Motion     : Animations dan transitions
    -  Lucide React      : Icon library
    -  React DatePicker  : Date range picker
    -  Recharts          : Charts and graphs
    -  Leaflet           : Interactive maps
    -  React Hot Toast   : Notifications system

### Project Structure

```
frontend/src/
├── assets/            # Images, SVG, static files
├── components/        # Reusable UI components (39 total)
│   ├── common/        # Navbar, Footer, Modal, etc.
│   ├── layout/        # Page layout wrappers
│   ├── property/      # Property-specific components
│   ├── tenant/        # Tenant dashboard components
│   └── user/          # User feature components
├── hooks/             # Custom React hooks
├── lib/               # Utilities, constants, formatters
├── pages/             # Page components (22 pages)
├── router/            # Route configuration and protection
├── services/          # API service layer (8 services)
├── stores/            # Zustand state management
├── types/             # TypeScript interfaces and types
└── validations/       # Zod form validation schemas
```

### Pages (Total: 22 pages)

**Authentication Pages (5):**
- LoginPage - Email/password + Google OAuth login
- RegisterPage - User/Tenant registration
- VerifyEmailPage - Email verification flow
- ResetPasswordPage - Password reset confirmation
- ForgotPasswordPage - Password reset request

**User Pages (6):**
- HomePage  - Hero carousel and property search
- PropertyDetailPage  - Full property details with reviews
- BookingPage  - Room selection and booking form
- OrdersPage  - User order history
- ProfilePage  - User account management
- PaymentSuccessPage  - Payment confirmation

**Tenant Pages (8):**
- DashboardPage  - Tenant dashboard overview
- PropertiesListPage - Property management list
- PropertyFormPage  - Create/edit property
- RoomsPage  - Room management and peak rates
- CategoriesPage  - Category CRUD management
- ReviewsPage  - Review management with replies
- OrdersPage  - Tenant order management
- ReportsPage  - Sales analytics and charts

**Public Pages (3):**
- AboutPage  - Company information
- ContactPage (145 lines) - Contact form
- NotFoundPage (35 lines) - 404 error page

### Components (Total: 39)

**Common Components (10):**
- Navbar  - Navigation header
- Footer  - Footer section
- SortFilterBar  - Filter and sort controls
- Modal, ConfirmModal, Pagination, Loading, Skeleton, etc.

**Property Components (7):**
- PricingCalendarSection - Price calendar display
- PropertyGallery, PropertyInfo, PropertyReviews, etc.

**Tenant Components (9):**
- RoomPeakRatesModal - Peak rates editor
- OrdersTable  - Order management table
- OccupancyCalendar - Occupancy visualization

**User Components (10):**
- HeroSection  - Hero carousel
- SearchForm  - Complex search form
- PropertyFilterDropdown  - Filter menu
- PropertyGrid, PropertyCard, OrderCard, etc.

### Key Features

1. Advanced Property Search with multiple filters
2. Responsive design (mobile to desktop)
3. Real-time availability checking
4. Dual payment methods (Manual + Midtrans)
5. Dynamic pricing with peak season rates
6. User reviews and ratings system
7. Tenant property and category management
8. Sales dashboard with analytics
9. Occupancy calendar visualization
10. Email verification and password reset
11. Google OAuth social login
12. Dark/light theme toggle

### Running the Frontend

```bash
npm run dev     # Development server with hot reload
npm run build   # Build for production
npm run preview # Preview production build
```

### Configuration

Create .env file with:
```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_LOCATIONIQ_API_KEY=your_locationiq_key
```
