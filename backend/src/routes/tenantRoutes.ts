import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { upload } from '../middlewares/uploadMiddleware';
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
import { getDashboardAnalyticsCtrl } from '../controllers/tenantReportController';

const router = Router();
const isTenant = [requireAuth, requireRole(['TENANT'])];

// Dashboard
router.get('/dashboard', ...isTenant, getDashboard);

// Properties
router.get('/properties', ...isTenant, getPropertiesCtrl);
router.post('/properties', ...isTenant, upload.single('featured_image'), validate(createPropertySchema), createPropertyCtrl);
router.get('/properties/:id', ...isTenant, getPropertyCtrl);
router.patch('/properties/:id', ...isTenant, upload.single('featured_image'), validate(updatePropertySchema), updatePropertyCtrl);
router.delete('/properties/:id', ...isTenant, deletePropertyCtrl);

// Property Images
router.post('/properties/:id/images', ...isTenant, upload.single('image'), addImageCtrl);
router.delete('/properties/:id/images/:imageId', ...isTenant, deleteImageCtrl);

// Rooms
router.get('/properties/:propertyId/rooms', ...isTenant, getRoomsCtrl);
router.post('/properties/:propertyId/rooms', ...isTenant, validate(createRoomSchema), createRoomCtrl);
router.patch('/rooms/:roomId', ...isTenant, validate(updateRoomSchema), updateRoomCtrl);
router.delete('/rooms/:roomId', ...isTenant, deleteRoomCtrl);

// Peak Season Rates
router.get('/rooms/:roomId/peak-rates', ...isTenant, getPeakRatesCtrl);
router.post('/rooms/:roomId/peak-rates', ...isTenant, validate(peakRateSchema), createPeakRateCtrl);
router.delete('/peak-rates/:rateId', ...isTenant, deletePeakRateCtrl);

// Room Availability
router.get('/rooms/:roomId/availability', ...isTenant, getRoomAvailabilitiesCtrl);
router.post('/rooms/:roomId/availability', ...isTenant, setRoomAvailabilityCtrl);

// Reporting
router.get('/reports', ...isTenant, getDashboardAnalyticsCtrl);

export default router;
