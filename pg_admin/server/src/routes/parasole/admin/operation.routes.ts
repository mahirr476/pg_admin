import express from 'express';
import { OperationController } from '../../../controllers/parasole/admin/operation.controller';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { authorize } from '../../../middleware/authorization.middleware';

const router = express.Router();

// Create a new operation
router.post("/operation", authMiddleware, authorize(['parasole_create']), OperationController.create);

// Get all operations
router.get('/operation', authMiddleware, authorize(['parasole_view']), OperationController.getAll);

// Get a operation by ID
router.get('/operation/:id', authMiddleware, authorize(['parasole_view']), OperationController.getById);

// Update an existing operation
router.put("/operation/:id", authMiddleware, authorize(['parasole_edit']), OperationController.update);

// Delete an existing operation
router.delete("/operation/:id", authMiddleware, authorize(['parasole_delete']), OperationController.delete);



// ===========================  For Compliance Detail Route Manage ===========================


// // Create a new operation detail
// router.post("/operation-detail", authMiddleware, authorize(['parasole_create']), ComplianceController.createComplianceDetail);

// // Get all operation details
// router.get('/operation-detail', authMiddleware, authorize(['parasole_view']), ComplianceController.getAllComplianceDetail);

// // Get a operation detail by ID
// router.get('/operation-detail/:id', authMiddleware, authorize(['parasole_view']), ComplianceController.getComplianceDetailById);

// // Update an existing operation detail
// router.put("/operation-detail/:id", authMiddleware, authorize(['parasole_edit']), ComplianceController.updateComplianceDetail);

// // Delete an existing operation detail
// router.delete("/operation-detail/:id", authMiddleware, authorize(['parasole_delete']), ComplianceController.deleteComplianceDetail);


export default router;