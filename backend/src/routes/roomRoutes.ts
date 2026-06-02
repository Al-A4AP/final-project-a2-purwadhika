import { Router } from 'express';
import { getPublicRoomAvailabilityController } from '../controllers/propertyController';

const router = Router();

router.get('/:roomId/availability', getPublicRoomAvailabilityController);

export default router;
