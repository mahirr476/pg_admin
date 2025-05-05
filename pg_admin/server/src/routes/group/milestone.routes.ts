import express from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorization.middleware';
import { MilestoneController } from '../../controllers/group/milestone.controller';

const router = express.Router();
router.use(authMiddleware);

// Create a new milestone
router.post('/milestone', authorize(['paragon_group_create']), MilestoneController.create);

// Get all milestone
router.get('/milestone', authorize(['paragon_group_view']), MilestoneController.getAll);

//Update a milestone
router.put('/milestone/:id', authorize(['paragon_group_edit']), MilestoneController.update);

// Delete a milestone
router.delete('/milestone/:id', authorize(['paragon_group_delete']), MilestoneController.delete);


// Create a new milestone detail
router.post('/milestone/detail', authorize(['paragon_group_create']), MilestoneController.createMilestoneDetail);

// Get all milestone detail
router.get('/milestone/detail', authorize(['paragon_group_view']), MilestoneController.getAllMDetail);

//Update a milestone detail
router.put('/milestone/detail/:id', authorize(['paragon_group_edit']), MilestoneController.updateMDetail);

// Delete a milestone detail
router.delete('/milestone/detail/:id', authorize(['paragon_group_delete']), MilestoneController.DeleteMDetail);


export default router;