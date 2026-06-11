import { Router } from 'express';
import { validate } from '../middlewares/validateMiddleware';
import { createContactMessageSchema } from '../validations/contactValidation';
import { createContactMessageCtrl } from '../controllers/contactController';

const router = Router();

router.post('/', validate(createContactMessageSchema), createContactMessageCtrl);

export default router;
