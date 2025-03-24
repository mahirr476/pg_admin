import express from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorization.middleware';
import { BusinessController } from '../../controllers/group/business.controller';

const router = express.Router();
router.use(authMiddleware);


// Create a new milestone
router.post('/business', authorize(['paragon_group_create']), BusinessController.businessCreate);

// Get all businesses
router.get('/business', authorize(['paragon_group_view']), BusinessController.getAllBusinesses);

export default router;