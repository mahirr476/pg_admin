import express from 'express';
import { BuyerController } from '../../../controllers/parasole/admin/buyer.controller';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { authorize } from '../../../middleware/authorization.middleware';

const router = express.Router();

// Create a new buyer
router.post("/buyer", authMiddleware, authorize(['parasole_create']), BuyerController.create);

// Get all buyers
router.get('/buyer', authMiddleware, authorize(['parasole_view']), BuyerController.getAll);

// Get a buyer by ID
router.get('/buyer/:id', authMiddleware, authorize(['parasole_view']), BuyerController.getById);

// Update an existing buyer
router.put("/buyer/:id", authMiddleware, authorize(['parasole_edit']), BuyerController.update);

// Delete an existing about
router.delete("/buyer/:id", authMiddleware, authorize(['parasole_delete']), BuyerController.delete);



// ===========================  For Compliance Detail Route Manage ===========================


// Create a new buyer detail
router.post("/buyer-detail", authMiddleware, authorize(['parasole_create']), BuyerController.createBuyerDetail);

// Get all buyer details
router.get('/buyer-detail', authMiddleware, authorize(['parasole_view']), BuyerController.getAllBuyerDetails);

// Get a buyer detail by ID
router.get('/buyer-detail/:id', authMiddleware, authorize(['parasole_view']), BuyerController.getBuyerDetailById);

// Update an existing buyer detail
router.put("/buyer-detail/:id", authMiddleware, authorize(['parasole_edit']), BuyerController.updateBuyerDetail);

// Delete an existing buyer detail
router.delete("/buyer-detail/:id", authMiddleware, authorize(['parasole_delete']), BuyerController.deleteBuyerDetail);


export default router;