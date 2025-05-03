import express from 'express';
import { ContactController } from '../../../controllers/parasole/admin/contact.controller';
import { ContactMediaController } from '../../../controllers/parasole/admin/contactMedia.controller';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { authorize } from '../../../middleware/authorization.middleware';

const router = express.Router();

// Create a new contact
router.post("/contact", authMiddleware, authorize(['parasole_create']), ContactController.create);

// Get all contact
router.get('/contact', authMiddleware, authorize(['parasole_view']), ContactController.getAll);

// Get a contact by ID
router.get('/contact/:id', authMiddleware, authorize(['parasole_view']), ContactController.getById);

// Update an existing contact
router.put("/contact/:id", authMiddleware, authorize(['parasole_edit']), ContactController.update);

// Delete an existing contact
router.delete("/contact/:id", authMiddleware, authorize(['parasole_delete']), ContactController.delete);


// Create a new contact
router.post("/contact-media", authMiddleware, authorize(['parasole_create']), ContactMediaController.upsert);

// Get all contact
router.get('/contact-media', authMiddleware, authorize(['parasole_view']), ContactMediaController.getContactMedia);


export default router;