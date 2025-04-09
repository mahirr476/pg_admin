import express from 'express';
import { ImpactController } from '../../controllers/group/impact.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorization.middleware';

const router = express.Router();


// Create impact
router.post("/impact", authMiddleware, authorize(['paragon_group_create']), ImpactController.create);

// Update an existing impact
router.put("/impact/:id", authMiddleware, authorize(['paragon_group_edit']), ImpactController.update);

// Get impact
router.get('/impact', authMiddleware, authorize(['paragon_group_view']), ImpactController.getAll);

// Delete an existing impact
router.delete("/impact/:id", authMiddleware, authorize(['paragon_group_delete']), ImpactController.delete);

export default router;