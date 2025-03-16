import express from 'express';
import { ImpactController } from '../../controllers/group/impact.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorization.middleware';

const router = express.Router();

// Create or update impact
// router.post("/impact", authMiddleware, authorize(['paragon_group_create']), ImpactController.update);


// Create impact
router.post("/impact", authMiddleware, authorize(['paragon_group_create']), ImpactController.create);

// Get impact
router.get('/impact', authMiddleware, authorize(['paragon_group_view']), ImpactController.get);

export default router;