import { Router } from 'express';
import { geocodePropertyLocationController } from '../controllers/propertyController';

const router = Router();

router.get('/geocodes', geocodePropertyLocationController);

export default router;
