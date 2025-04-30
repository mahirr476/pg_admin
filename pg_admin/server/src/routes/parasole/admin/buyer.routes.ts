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


// Create a new compliance detail
// router.post("/compliance-detail", authMiddleware, authorize(['parasole_create']), ComplianceController.createComplianceDetail);

// // Get all compliance details
// router.get('/compliance-detail', authMiddleware, authorize(['parasole_view']), ComplianceController.getAllComplianceDetail);

// // Get a compliance detail by ID
// router.get('/compliance-detail/:id', authMiddleware, authorize(['parasole_view']), ComplianceController.getComplianceDetailById);

// // Update an existing compliance detail
// router.put("/compliance-detail/:id", authMiddleware, authorize(['parasole_edit']), ComplianceController.updateComplianceDetail);

// // Delete an existing compliance detail
// router.delete("/compliance-detail/:id", authMiddleware, authorize(['parasole_delete']), ComplianceController.deleteComplianceDetail);


export default router;