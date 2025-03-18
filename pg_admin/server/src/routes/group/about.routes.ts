import express from 'express';
import { AboutController } from '../../controllers/group/about.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorization.middleware';

const router = express.Router();

// Create or update about information
router.post('/about', authMiddleware, authorize(['paragon_group_create']), AboutController.upsert);

// Get about information
router.get('/about', authMiddleware, authorize(['paragon_group_view']), AboutController.get);

export default router;