import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { upload } from '../middlewares/uploadMiddleware';
import {
  verifyPropertyOwnership,
  verifyRoomOwnership,
  verifyPeakRateOwnership
} from '../middlewares/ownershipMiddleware';
import { createPropertySchema, updatePropertySchema, createRoomSchema, updateRoomSchema, peakRateSchema } from '../validations/propertyValidation';
import {
  getDashboard, getPropertiesCtrl, getPropertyCtrl,
  createPropertyCtrl, updatePropertyCtrl, deletePropertyCtrl,
  addImageCtrl, deleteImageCtrl,
} from '../controllers/tenantPropertyController';
import {
  getRoomsCtrl, createRoomCtrl, updateRoomCtrl, deleteRoomCtrl,
  getPeakRatesCtrl, createPeakRateCtrl, deletePeakRateCtrl,
  getRoomAvailabilitiesCtrl, setRoomAvailabilityCtrl
} from '../controllers/tenantRoomController';
import { getDashboardAnalyticsCtrl, getOccupancyCalendarCtrl } from '../controllers/tenantReportController';

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
router.post('/properties/:propertyId/rooms', ...isTenant, verifyPropertyOwnership, validate(createRoomSchema), createRoomCtrl);
router.patch('/rooms/:roomId', ...isTenant, verifyRoomOwnership, validate(updateRoomSchema), updateRoomCtrl);
router.delete('/rooms/:roomId', ...isTenant, verifyRoomOwnership, deleteRoomCtrl);

// Peak Season Rates
router.get('/rooms/:roomId/peak-rates', ...isTenant, verifyRoomOwnership, getPeakRatesCtrl);
router.post('/rooms/:roomId/peak-rates', ...isTenant, verifyRoomOwnership, validate(peakRateSchema), createPeakRateCtrl);
router.delete('/peak-rates/:rateId', ...isTenant, verifyPeakRateOwnership, deletePeakRateCtrl);

// Room Availability
router.get('/rooms/:roomId/availability', ...isTenant, verifyRoomOwnership, getRoomAvailabilitiesCtrl);
router.post('/rooms/:roomId/availability', ...isTenant, verifyRoomOwnership, setRoomAvailabilityCtrl);

// Reporting
router.get('/reports', ...isTenant, getDashboardAnalyticsCtrl);
router.get('/reports/occupancy', ...isTenant, getOccupancyCalendarCtrl);

export default router;
