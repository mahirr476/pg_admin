import express from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorization.middleware';
import { MediaController  } from '../../controllers/group/media.controller';

const router = express.Router();
router.use(authMiddleware);

// Create a new media entry
router.post('/media', authorize(['paragon_group_create']), MediaController.createMedia);

// Get all media entries
router.get('/media', authorize(['paragon_group_view']), MediaController.getAllMedia);

// Update a media
router.put('/media/:id', authorize(['paragon_group_edit']), MediaController.updateMedia);

// Delete a media
router.delete('/media/:id', authorize(['paragon_group_delete']), MediaController.deleteMedia);


export default router;