import express from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorization.middleware';
import { MediaController  } from '../../controllers/group/media.controller';

const router = express.Router();

// Public routes (no auth required)
router.post('/media/contact', MediaController.submitContact);


// Apply authentication middleware for all routes
router.use(authMiddleware);

// Create a new media 
router.post('/media', authorize(['paragon_group_create']), MediaController.createMedia);

// Get all media
router.get('/media', authorize(['paragon_group_view']), MediaController.getAllMedia);

// Update a media
router.put('/media/:id', authorize(['paragon_group_edit']), MediaController.updateMedia);

// Delete a media
router.delete('/media/:id', authorize(['paragon_group_delete']), MediaController.deleteMedia);


// Create a new Media Gallery
router.post('/media/gallery', authorize(['paragon_group_create']), MediaController.createGallery);

// Get all Media Gallery
router.get('/media/gallery', authorize(['paragon_group_view']), MediaController.getAllGallery);

// Update a media Media Gallery
router.put('/media/gallery/:id', authorize(['paragon_group_edit']), MediaController.updateGallery);

// Delete a media Media Gallery
router.delete('/media/gallery/:id', authorize(['paragon_group_delete']), MediaController.deleteGallery);


// Create a new Media News
router.post('/media/news', authorize(['paragon_group_create']), MediaController.createNews);

// Get all Media News
router.get('/media/news', authorize(['paragon_group_view']), MediaController.getAllNews);

// Update a Media News
router.put('/media/news/:id', authorize(['paragon_group_edit']), MediaController.updateNews);

// Delete a Media News
router.delete('/media/news/:id', authorize(['paragon_group_delete']), MediaController.deleteNews);


// Get Media Inquery
router.get('/media/inquery', authorize(['paragon_group_view']), MediaController.getInquery);

// Create or Update Media Inquery
router.post('/media/inquery', authorize(['paragon_group_create', 'paragon_group_edit']), MediaController.handleInquery);



// Get all Media Contacts Form
router.get('/media/contact', authorize(['paragon_group_view']), MediaController.getAllContacts);

// Delete a Media Contacts Form
router.delete('/media/contact/:id', authorize(['paragon_group_delete']), MediaController.deleteContact);

export default router;