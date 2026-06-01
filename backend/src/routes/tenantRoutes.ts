import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { upload } from '../middlewares/uploadMiddleware';
import {
  verifyPropertyOwnership,
  verifyRoomOwnership,
  verifyPeakRateOwnership
} from '../middlewares/ownershipMiddleware';
import { availabilityRangeSchema, createPropertySchema, updatePropertySchema, createRoomSchema, updateRoomSchema, peakRateSchema } from '../validations/propertyValidation';
import {
  getDashboard, getPropertiesCtrl, getPropertyCtrl,
  createPropertyCtrl, updatePropertyCtrl, deletePropertyCtrl,
  addImageCtrl, deleteImageCtrl,
} from '../controllers/tenantPropertyController';
import {
  getRoomsCtrl, createRoomCtrl, updateRoomCtrl, deleteRoomCtrl,
  getPeakRatesCtrl, createPeakRateCtrl, updatePeakRateCtrl, deletePeakRateCtrl,
  getRoomAvailabilitiesCtrl, setRoomAvailabilityCtrl, setRoomAvailabilityRangeCtrl
} from '../controllers/tenantRoomController';
import { getDashboardAnalyticsCtrl, getOccupancyCalendarCtrl } from '../controllers/tenantReportController';
import { getTenantReviewsCtrl } from '../controllers/tenantReviewController';
import { createCategoryCtrl, deleteCategoryCtrl, getCategoriesCtrl, updateCategoryCtrl } from '../controllers/categoryController';

const router = Router();
const isTenant = [requireAuth, requireRole(['TENANT'])];

// Dashboard
router.get('/dashboard', ...isTenant, getDashboard);

// Properties
router.get('/properties', ...isTenant, getPropertiesCtrl);
router.post('/properties', ...isTenant, upload.single('featured_image'), validate(createPropertySchema), createPropertyCtrl);
router.get('/properties/:id', ...isTenant, verifyPropertyOwnership, getPropertyCtrl);
router.patch('/properties/:id', ...isTenant, verifyPropertyOwnership, upload.single('featured_image'), validate(updatePropertySchema), updatePropertyCtrl);
router.delete('/properties/:id', ...isTenant, verifyPropertyOwnership, deletePropertyCtrl);

// Property Images
router.post('/properties/:id/images', ...isTenant, verifyPropertyOwnership, upload.single('image'), addImageCtrl);
router.delete('/properties/:id/images/:imageId', ...isTenant, verifyPropertyOwnership, deleteImageCtrl);

// Rooms
router.get('/properties/:propertyId/rooms', ...isTenant, verifyPropertyOwnership, getRoomsCtrl);
router.post('/properties/:propertyId/rooms', ...isTenant, verifyPropertyOwnership, upload.single('image'), validate(createRoomSchema), createRoomCtrl);
router.patch('/rooms/:roomId', ...isTenant, verifyRoomOwnership, upload.single('image'), validate(updateRoomSchema), updateRoomCtrl);
router.delete('/rooms/:roomId', ...isTenant, verifyRoomOwnership, deleteRoomCtrl);

// Peak Season Rates
router.get('/rooms/:roomId/peak-rates', ...isTenant, verifyRoomOwnership, getPeakRatesCtrl);
router.post('/rooms/:roomId/peak-rates', ...isTenant, verifyRoomOwnership, validate(peakRateSchema), createPeakRateCtrl);
router.patch('/peak-rates/:rateId', ...isTenant, verifyPeakRateOwnership, validate(peakRateSchema), updatePeakRateCtrl);
router.delete('/peak-rates/:rateId', ...isTenant, verifyPeakRateOwnership, deletePeakRateCtrl);

// Room Availability
router.get('/rooms/:roomId/availability', ...isTenant, verifyRoomOwnership, getRoomAvailabilitiesCtrl);
router.post('/rooms/:roomId/availability/range', ...isTenant, verifyRoomOwnership, validate(availabilityRangeSchema), setRoomAvailabilityRangeCtrl);
router.post('/rooms/:roomId/availability', ...isTenant, verifyRoomOwnership, setRoomAvailabilityCtrl);

// Reporting
router.get('/reports', ...isTenant, getDashboardAnalyticsCtrl);
router.get('/reports/occupancy', ...isTenant, getOccupancyCalendarCtrl);

// Reviews
router.get('/reviews', ...isTenant, getTenantReviewsCtrl);

// Categories (CRUD for tenant)
router.get('/categories', ...isTenant, getCategoriesCtrl);
router.post('/categories', ...isTenant, createCategoryCtrl);
router.patch('/categories/:id', ...isTenant, updateCategoryCtrl);
router.delete('/categories/:id', ...isTenant, deleteCategoryCtrl);

export default router;
