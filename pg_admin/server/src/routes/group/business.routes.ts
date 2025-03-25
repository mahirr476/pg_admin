import express from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorization.middleware';
import { BusinessController } from '../../controllers/group/business.controller';

const router = express.Router();
router.use(authMiddleware);

// Business routes

// Create a new business
router.post('/business', authorize(['paragon_group_create']), BusinessController.businessCreate);

// Get all businesses
router.get('/business', authorize(['paragon_group_view']), BusinessController.getAllBusinesses);

// Update a business
router.put('/business/:id', authorize(['paragon_group_edit']), BusinessController.updateBusiness);

// Delete a business
router.delete('/business/:id', authorize(['paragon_group_delete']), BusinessController.deleteBusiness);



// Business operation routes


// Create a new Business operation
router.post('/business/operation', authorize(['paragon_group_create']), BusinessController.operationCreate);

// Get all businesses operation
router.get('/business/operation', authorize(['paragon_group_view']), BusinessController.operationGetAll);

// Update a business operation
router.put('/business/operation/:id', authorize(['paragon_group_edit']), BusinessController.operationUpdate);

// Delete a business operation
router.delete('/business/operation/:id', authorize(['paragon_group_delete']), BusinessController.operationDelete);

export default router;