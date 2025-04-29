import express from 'express';
import { ComplianceController } from '../../../controllers/parasole/admin/compliance.controller';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { authorize } from '../../../middleware/authorization.middleware';

const router = express.Router();

// Create a new compliance
router.post("/compliance", authMiddleware, authorize(['parasole_create']), ComplianceController.create);

// // Get all compliances
router.get('/compliance', authMiddleware, authorize(['parasole_view']), ComplianceController.getAll);

// // Get a compliance by ID
router.get('/compliance/:id', authMiddleware, authorize(['parasole_view']), ComplianceController.getById);

// // Update an existing compliance
router.put("/compliance/:id", authMiddleware, authorize(['parasole_edit']), ComplianceController.update);

// // Delete an existing about
router.delete("/compliance/:id", authMiddleware, authorize(['parasole_delete']), ComplianceController.delete);



// ===========================  For About Detail Route Manage ===========================


// // // Create a new about detail
// router.post("/about-detail", authMiddleware, authorize(['parasole_create']), AboutController.createAboutDetail);

// // // // Get all about details
// router.get('/about-detail', authMiddleware, authorize(['parasole_view']), AboutController.getAllAboutDetail);

// // // // Get a about detail by ID
// router.get('/about-detail/:id', authMiddleware, authorize(['parasole_view']), AboutController.getAboutDetailById);

// // // // Update an existing about detail
// router.put("/about-detail/:id", authMiddleware, authorize(['parasole_edit']), AboutController.updateAboutDetail);

// // // // Delete an existing about detail
// router.delete("/about-detail/:id", authMiddleware, authorize(['parasole_delete']), AboutController.deleteAboutDetail);


export default router;