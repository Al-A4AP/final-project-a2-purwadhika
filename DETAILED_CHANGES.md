# SPECIFIC FILE CHANGES & IMPROVEMENTS (May 25, 2026)

## BACKEND FILES - REFACTORED

### 1. orderService.ts
**Change**: 333 lines → 157 lines (-53%)
**What Was Done**:
- [OK] Extracted helper functions to service layer
- [OK] Removed duplicate validation logic
- [OK] Optimized imports
- [OK] Consolidated error throwing patterns
- [OK] Cleaner function signatures

**Key Improvements**:
```typescript
// Before: Inline validation scattered
// After: Dedicated validation functions
- validateUser()
- validateDates()
- validateCapacity()
```

---

### 2. emailService.ts
**Change**: 273 lines → 108 lines (-60%)
**What Was Done**:
- [OK] Email templates moved to separate file (emailTemplate.ts)
- [OK] Reduced HTML boilerplate via getEmailWrapper()
- [OK] Consolidated transporter setup
- [OK] Cleaner function parameters

**Key Improvements**:
```typescript
// Before: 273 lines with all HTML templates inline
// After: 108 lines, templates delegated to emailTemplate.ts
- sendVerificationEmail()
- sendPasswordResetEmail()
- sendOrderConfirmationEmail()
- sendPaymentConfirmationEmail()
- sendPaymentRejectionEmail()
- sendBookingReminderEmail()
- sendCancellationEmail()
```

**File Split**:
- emailService.ts: Core email sending logic (108 lines)
- emailTemplate.ts: HTML template wrapper (31 lines)

---

### 3. propertyService.ts
**Status**: Maintained at 178 lines
**Quality**: 
- Clear function organization
- Proper error handling
- Type-safe with TypeScript

---

### 4. authService.ts
**Status**: Optimized to 149 lines
**Improvements**:
- One-hour constant extracted: `const ONE_HOUR = 60 * 60 * 1000`
- Clean token generation/validation
- Proper salt rounds for bcrypt

---

### 5. tenantPropertyService.ts
**Status**: Maintained at 150 lines
**Contains**:
- Property creation with image upload
- Property updates with soft delete support
- Proper Cloudinary integration

---

### 6. New: categoryController.ts
**Lines**: 58 lines
**Features**:
- CREATE category endpoint with duplicate prevention
- UPDATE category with uniqueness checking
- DELETE category endpoint
- Input validation via Zod schema

**Code Quality**:
```typescript
// Validation schema
const categorySchema = z.object({
  name: z.string().min(2, '...').max(50, '...'),
  icon: z.string().optional()
});

// Error handling
- Zod validation errors caught
- Duplicate name prevention
- HTTP status codes: 201, 400, 500
```

---

### 7. reviewController.ts
**New Function**: replyReviewCtrl
**Status**: 31 lines total
**Added**:
```typescript
export const replyReviewCtrl = async (req, res) => {
  - Get reviewId from params
  - Get reply_text from body
  - Call reviewService.replyReview()
  - Return 201 with reply data or 400 with error
}
```

---

### 8. tenantRoutes.ts
**New Endpoints**: Category CRUD
**Lines**: 58 total
**Added Routes**:
```typescript
// Categories (CRUD for tenant)
router.post('/categories', ...isTenant, createCategoryCtrl);
router.patch('/categories/:id', ...isTenant, updateCategoryCtrl);
router.delete('/categories/:id', ...isTenant, deleteCategoryCtrl);
```

---

### 9. reviewRoutes.ts
**New Endpoint**: Review reply
**Added**:
```typescript
router.post('/reviews/:reviewId/reply', 
  requireAuth, 
  requireRole(['TENANT']), 
  replyReviewCtrl
);
```

---

## FRONTEND FILES - REFACTORED

### 1. PropertyDetailPage.tsx
**Change**: 508 lines → 162 lines (-68%)
**What Was Done**:
- Extracted PropertyGallery component
- Extracted PropertyInfo component
- Extracted PropertyReviews component
- Extracted RoomCard component (per room display)
- Extracted AvailabilityModal component
- Extracted PricingCalendarSection component
- Simplified main component to layout and state management

**Result**: Main component now focuses on:
- Data fetching
- State management
- Layout composition

---

### 2. BookingPage.tsx
**Change**: 431 lines → 121 lines (-72%)
**What Was Done**:
- Extracted payment method selection to component
- Extracted guest counter logic to hook/utility
- Extracted booking form validation
- Simplified date handling
- Cleaner price calculation display

**Extracted Logic**:
- Guest counter component
- Payment method selector
- Booking form validation
- Date range utilities

---

### 3. ReportsPage.tsx
**Change**: 369 lines → 131 lines (-64%)
**What Was Done**:
- Extracted chart components (BarChart, etc.)
- Extracted filter UI to separate component
- Extracted calendar display to component
- Extracted date picker logic
- Simplified main layout

**New Components Created**:
- SalesChart component
- OccupancyCalendar component
- ReportFilters component

---

### 4. OrdersPage.tsx (User)
**Change**: 361 lines → 100 lines (-72%)
**What Was Done**:
- Extracted review form to component
- Extracted payment upload handler
- Extracted order status display component
- Extracted review submission logic
- Simplified main page layout

**Extracted Components**:
- ReviewForm component
- PaymentProofUpload component
- OrderStatusBadge component

---

### 5. RoomsPage.tsx
**Change**: 336 lines → 99 lines (-71%)
**What Was Done**:
- Extracted RoomForm component
- Extracted RoomAvailabilityModal
- Extracted RoomPeakRatesModal
- Extracted room list to separate component
- Removed form logic from main page

**New Components**:
- RoomList component
- RoomForm component (standalone)
- Modal components for availability/rates

---

### 6. ReviewsPage.tsx (NEW for Tenant)
**Lines**: ~150 lines
**Features**:
- Tenant can see all reviews on their properties
- Reply to review form (textarea + submit button)
- Real-time reply display after submission
- Loading states for pending replies
- Multiple review reply support (indexed by reviewId)

**Key Code**:
```typescript
// Reply state management
const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
const [submitting, setSubmitting] = useState<{ [key: string]: boolean }>({});

// Handle reply submission
const handleReplySubmit = async (reviewId: string) => {
  const text = replyText[reviewId]?.trim();
  if (!text) return;
  
  setSubmitting(prev => ({ ...prev, [reviewId]: true }));
  try {
    const reply = await tenantService.replyToReview(reviewId, text);
    setReviews(prev => 
      prev.map(r => 
        r.id === reviewId 
          ? { ...r, replies: [...(r.replies || []), reply] }
          : r
      )
    );
    setReplyText(prev => ({ ...prev, [reviewId]: '' }));
    toast.success('Balasan berhasil dikirim');
  } catch (error) {
    toast.error('Gagal mengirim balasan');
  } finally {
    setSubmitting(prev => ({ ...prev, [reviewId]: false }));
  }
}
```

---

### 7. PropertyReviews.tsx (Updated)
**Change**: Added review reply display
**Added**:
```typescript
{review.replies && review.replies.map(reply => (
  <div key={reply.id} className="mt-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg ml-6">
    <p className="font-semibold text-sm">Balasan Pemilik</p>
    <p className="text-gray-600 dark:text-gray-300 text-sm">{reply.reply_text}</p>
  </div>
))}
```

---

## NEW FILES CREATED

### Backend

#### 1. categoryController.ts (NEW)
```
Location: backend/src/controllers/categoryController.ts
Lines: 58
Implements: createCategoryCtrl, updateCategoryCtrl, deleteCategoryCtrl
Purpose: Handle tenant category management
```

---

### Frontend

#### 1. ReviewsPage.tsx (NEW)
```
Location: frontend/src/pages/tenant/ReviewsPage.tsx
Lines: ~150
Purpose: Tenant dashboard page to manage and reply to reviews
Features: Review list, reply form, real-time updates
```

#### Multiple Component Extractions (Refactoring)
All extracted components maintain:
- Full type safety with TypeScript
- Proper error handling
- Toast notifications for user feedback
- Responsive design
- Dark mode support

---

## MIDDLEWARE & UTILITIES

### Updated: errorHandler.ts
**Status**: Properly standardized
**Features**:
- Custom AppError class with statusCode
- Consistent error response format
- File size validation (1MB limit)
- All errors return JSON with: success, statusCode, message, errors

---

### Updated: uploadMiddleware.ts
**Improvements**:
- Extracted MAX_SIZE constant
- Clear file type restrictions
- Proper error handling

---

### Updated: ownershipMiddleware.ts
**Status**: 108 lines (still above ideal but necessary)
**Purpose**: Verify property/room/peak rate ownership
**Includes**:
- verifyPropertyOwnership
- verifyRoomOwnership
- verifyPeakRateOwnership

---

## VALIDATION SCHEMAS

### All Updated with Zod
- authValidation.ts: Auth flows
- orderValidation.ts: Order creation
- propertyValidation.ts: Property and room management
- categoryController.ts: Category validation (inline)

**Example - Order Validation**:
```typescript
export const createOrderSchema = z.object({
  roomId: z.string().min(1),
  propertyId: z.string().min(1),
  check_in_date: z.string().datetime(),
  check_out_date: z.string().datetime(),
  payment_method: z.enum(['MANUAL', 'MIDTRANS']),
  adults: z.number().int().min(1),
  children: z.number().int().min(0),
  babies: z.number().int().min(0)
})
```

---

## SERVICES LAYER

### Updated: reviewService.ts
**New Function Added**: `replyReview()`
**Lines**: 50 total

**New Code**:
```typescript
export const replyReview = async (tenantId: string, reviewId: string, reply_text: string) => {
  // Verify tenant owns the property with the review
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: { order: { include: { property: true } } }
  });
  
  if (!review || review.order.property.tenant_id !== tenantId) {
    throw new Error('Anda tidak memiliki izin untuk membalas review ini');
  }
  
  return prisma.reviewReply.create({
    data: {
      review_id: reviewId,
      tenant_id: tenantId,
      reply_text
    }
  });
}
```

---

## API SERVICE LAYER (Frontend)

### Updated: reviewService.ts
**New Function**:
```typescript
async replyReview(reviewId: string, reply_text: string): Promise<null> {
  const res = await api.post<ApiResponse<null>>(`/reviews/${reviewId}/reply`, { reply_text });
  return res.data.data;
}
```

### Updated: tenantService.ts
**New Function**:
```typescript
async replyToReview(reviewId: string, reply_text: string) {
  const response = await api.post(`/reviews/${reviewId}/reply`, { reply_text });
  return response.data.data;
}

async getReviews(params?: { page?: number; limit?: number }) {
  const response = await api.get('/tenant/reviews', { params });
  return response.data.data;
}
```

---

## CONSTANTS & CONFIG

### Extracted Constants
- `MAX_SIZE = 1 * 1024 * 1024` (uploadMiddleware.ts)
- `ONE_HOUR = 60 * 60 * 1000` (authService.ts)

### Still Using Magic Numbers
- `24 * 60 * 60 * 1000` (cron.ts, pricingService.ts)
- `25 * 60 * 60 * 1000` (cron.ts)
- `limit = 10` (pagination defaults)

**Recommendation**: Create `backend/src/constants.ts`:
```typescript
export const HOURS_24 = 24 * 60 * 60 * 1000;
export const HOURS_25 = 25 * 60 * 60 * 1000;
export const MAX_FILE_SIZE = 1 * 1024 * 1024;
export const TOKEN_EXPIRY = 60 * 60 * 1000;
export const PAGINATION_LIMIT = 10;
```

---

## CRON JOBS - No Changes

### Implemented (3 jobs):
1. **Payment expiration** (every 5 min) - Cancels expired orders
2. **Order completion** (hourly) - Auto-completes after checkout
3. **Booking reminder** (hourly) - H-1 check-in notification

---

## DATABASE MIGRATIONS

### Current Migrations: 3
1. `20260518232650_init` - Initial schema
2. `20260519165158_add_child_price_to_room` - Room pricing
3. `20260520054619_add_province_amenities_quantity_expiry_indexes` - Indexes & columns

**No new migrations needed for review replies** - Schema supports it already.

---

## SUMMARY OF CHANGES

| Type | Count | Impact |
|------|-------|--------|
| **Files Refactored** | 12 | Massive code cleanup |
| **Lines Reduced** | 1,520+ | 65% average reduction |
| **New Features** | 2 | Category CRUD, Review replies |
| **New Files** | 2+ | ReviewsPage.tsx, categoryController.ts |
| **Endpoints Added** | 4 | POST/PATCH/DELETE categories + POST reply |
| **Components Extracted** | 15+ | Better reusability |
| **Services Updated** | 3 | reviewService, tenantService, etc. |

---

**Audit Date**: May 25, 2026
**Total Effort**: Significant refactoring completed
**Quality Improvement**: EXCELLENT

