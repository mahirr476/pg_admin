import express from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorization.middleware';
import { MilestoneController } from '../../controllers/group/milestone.controller';

const router = express.Router();
router.use(authMiddleware);

// Create a new milestone
router.post('/milestone', authorize(['paragon_group_create']), MilestoneController.create);

// Get all CSR items
router.get('/milestone', authorize(['paragon_group_view']), MilestoneController.getAllMilestone);


export default router;