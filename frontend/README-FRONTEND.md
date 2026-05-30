# README — Frontend PURWALOKA

**Final Project Purwadhika — jcwdbgpm-11 (Offline Bandung)**

```
Group 1:
- Anggita Zahra Kamila  (Anggi)
- Muhammad Ali Akbar    (Ali)
```

## Frontend — Property Renting Web App

---

### Tech Stack (Instalasi)

```bash
npm create vite@latest . -- --template react-ts
npm install react@19 react-dom@19
npm install tailwindcss @tailwindcss/vite
npm install axios
npm install zod react-hook-form
npm install zustand
npm install framer-motion
npm install lucide-react
npm install react-router-dom
npm install react-hot-toast
npm install react-day-picker
npm install recharts
npm install leaflet react-leaflet
npm install -D @types/leaflet
```

---

### Frontend Dependencies

| Package | Versi | Fungsi |
|---------|-------|--------|
| React | 19 | UI framework utama |
| React Router | v7 | Routing dan navigation (Code Splitting via React.Lazy) |
| Tailwind CSS | v4 | Utility-first CSS framework |
| Vite | latest | Build tool dan dev server |
| TypeScript | v6 | Type safety |
| Axios | latest | HTTP client untuk API calls |
| Zustand | latest | State management (authStore, filterStore) |
| Zod | latest | Schema validation |
| React Hook Form | latest | Form state management |
| Framer Motion | latest | Animations dan transitions |
| Lucide React | latest | Icon library |
| React Day Picker | latest | Date range picker kalender |
| Recharts | latest | Charts and graphs (Analytics) |
| Leaflet | latest | Interactive maps |
| React Hot Toast | latest | Notifications system |

---

### Project Structure

```
frontend/src/
├── assets/            # Images, SVG, static files
├── components/        # Reusable UI components (39 total)
│   ├── common/        # Navbar, Footer, Modal, Pagination, etc.
│   ├── layout/        # Page layout wrappers
│   ├── property/      # Property-specific components
│   ├── tenant/        # Tenant dashboard components
│   └── user/          # User feature components
├── hooks/             # Custom React hooks (2 hooks)
│   ├── useGeolocation.ts   # LocationIQ geolocation detection
│   └── useRoomsLogic.ts    # Room management logic
├── lib/               # Utilities, constants, formatters
├── pages/             # Page components (22 pages)
│   ├── auth/          # Authentication pages
│   ├── tenant/        # Tenant dashboard pages
│   └── user/          # User-facing pages
├── router/            # Route configuration and protection
├── services/          # API service layer (10 services)
│   ├── api.ts              # Axios instance (HttpOnly Cookie, withCredentials)
│   ├── authService.ts      # Auth API calls
│   ├── geolocationService.ts  # LocationIQ reverse geocode
│   ├── propertyService.ts  # Property listing & details
│   ├── orderService.ts     # Order management
│   ├── reviewService.ts    # Review & rating
│   ├── tenantService.ts    # Tenant operations
│   ├── tenantReportService.ts # Analytics & reports
│   ├── availabilityService.ts # Room availability
│   └── userService.ts      # User profile
├── stores/            # Zustand state management
│   ├── authStore.ts        # Auth state (HttpOnly Cookie-based)
│   └── filterStore.ts      # Property filter state
├── types/             # TypeScript interfaces and types
└── validations/       # Zod form validation schemas
```

---

### Pages (Total: 22)

**Authentication (5):** LoginPage, RegisterPage, VerifyEmailPage, ResetPasswordPage, ForgotPasswordPage

**User Pages (6):** HomePage, PropertyDetailPage, BookingPage, OrdersPage, ProfilePage, PaymentSuccessPage

**Tenant Pages (8):** DashboardPage, PropertiesListPage, PropertyFormPage, RoomsPage, CategoriesPage, ReviewsPage, OrdersPage, ReportsPage

**Public Pages (3):** AboutPage, ContactPage, NotFoundPage

---

### Key Features

1. Advanced Property Search dengan filter harga, kota, tanggal, fasilitas
2. Deteksi lokasi otomatis via LocationIQ (custom hook `useGeolocation`)
3. Responsive design (mobile to desktop)
4. Real-time availability checking
5. Dual payment (Manual transfer + Midtrans)
6. Dynamic pricing dengan peak season rates
7. User reviews dan ratings (integer 1–5)
8. Tenant property dan category management
9. Sales dashboard dengan analytics (Recharts)
10. Occupancy calendar visualization
11. Email verification dan password reset
12. Google OAuth social login
13. JWT disimpan di HttpOnly Cookie (XSS-safe)
14. Dark/light theme toggle

---

### Running the Frontend

```bash
npm run dev     # Development server dengan hot reload
npm run build   # Build untuk production
npm run preview # Preview production build
```

---

### Environment Variables

Buat file `.env` di folder `frontend/`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_LOCATIONIQ_API_KEY=your_locationiq_key
```

Lihat `.env.example` untuk referensi lengkap.

---

*Last Updated: May 30, 2026*
