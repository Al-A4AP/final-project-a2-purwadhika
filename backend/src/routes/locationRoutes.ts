import { Router } from 'express';
import { geocodePropertyLocationController, reverseGeocodeLocationController } from '../controllers/propertyController';

const router = Router();

router.get('/geocodes', geocodePropertyLocationController);
router.get('/reverse-geocodes', reverseGeocodeLocationController);

export default router;
