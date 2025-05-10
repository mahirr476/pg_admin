import express from 'express';
import { ComplianceController } from '../../../controllers/parasole/admin/compliance.controller';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { authorize } from '../../../middleware/authorization.middleware';

const router = express.Router();

// Create a new compliance
router.post("/compliance", authMiddleware, authorize(['parasole_create']), ComplianceController.create);

// Get all compliances
router.get('/compliance', authMiddleware, authorize(['parasole_view']), ComplianceController.getAll);

// Get a compliance by ID
router.get('/compliance/:id', authMiddleware, authorize(['parasole_view']), ComplianceController.getById);

// Update an existing compliance
router.put("/compliance/:id", authMiddleware, authorize(['parasole_edit']), ComplianceController.update);

// Delete an existing about
router.delete("/compliance/:id", authMiddleware, authorize(['parasole_delete']), ComplianceController.delete);



// ===========================  For Compliance Detail Route Manage ===========================


// Create a new compliance detail
router.post("/compliance-detail", authMiddleware, authorize(['parasole_create']), ComplianceController.createComplianceDetail);

// Get all compliance details
router.get('/compliance-detail', authMiddleware, authorize(['parasole_view']), ComplianceController.getAllComplianceDetail);

// Get a compliance detail by ID
router.get('/compliance-detail/:id', authMiddleware, authorize(['parasole_view']), ComplianceController.getComplianceDetailById);

// Update an existing compliance detail
router.put("/compliance-detail/:id", authMiddleware, authorize(['parasole_edit']), ComplianceController.updateComplianceDetail);

// Delete an existing compliance detail
router.delete("/compliance-detail/:id", authMiddleware, authorize(['parasole_delete']), ComplianceController.deleteComplianceDetail);


export default router;