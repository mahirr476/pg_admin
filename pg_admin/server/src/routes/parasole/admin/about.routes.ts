import express from 'express';
import { AboutController } from '../../../controllers/parasole/admin/about.controller';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { authorize } from '../../../middleware/authorization.middleware';

const router = express.Router();

// Create a new about
router.post("/about", authMiddleware, authorize(['parasole_create']), AboutController.create);

// // Get all abouts
router.get('/about', authMiddleware, authorize(['parasole_view']), AboutController.getAll);

// // Get a about by ID
router.get('/about/:id', authMiddleware, authorize(['parasole_view']), AboutController.getById);

// // Update an existing about
router.put("/about/:id", authMiddleware, authorize(['parasole_edit']), AboutController.update);

// // Delete an existing about
router.delete("/about/:id", authMiddleware, authorize(['parasole_delete']), AboutController.delete);



// ===========================  For About Detail Route Manage ===========================


// // Create a new about detail
router.post("/about-detail", authMiddleware, authorize(['parasole_create']), AboutController.createAboutDetail);

// // // Get all about details
router.get('/about-detail', authMiddleware, authorize(['parasole_view']), AboutController.getAllAboutDetail);

// // // Get a about detail by ID
router.get('/about-detail/:id', authMiddleware, authorize(['parasole_view']), AboutController.getAboutDetailById);

// // // Update an existing about detail
router.put("/about-detail/:id", authMiddleware, authorize(['parasole_edit']), AboutController.updateAboutDetail);

// // // Delete an existing about detail
router.delete("/about-detail/:id", authMiddleware, authorize(['parasole_delete']), AboutController.deleteAboutDetail);


export default router;