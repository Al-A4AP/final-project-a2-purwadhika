import { Router } from 'express';
import {
  listPropertiesController,
  getPropertyDetailController,
  getCategoriesController,
} from '../controllers/propertyController';
import { getRoomAvailabilitiesCtrl } from '../controllers/tenantRoomController';

const router = Router();

// GET /api/properties?page=1&limit=12&sort=name&order=asc&search=Jakarta&category=Hotel
router.get('/', listPropertiesController);
router.get('/categories', getCategoriesController);
router.get('/:id', getPropertyDetailController);
router.get('/rooms/:roomId/availability', getRoomAvailabilitiesCtrl);

export default router;
