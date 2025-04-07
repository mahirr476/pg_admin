import express from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorization.middleware';
import { ContactController } from '../../controllers/group/contact.controller';

const router = express.Router();

// Public route to get contact information (no auth required)
// router.get('/contact', ContactController.getContactInfo);

// Public endpoint to submit a contact form (no auth required)
router.post('/contact-form', ContactController.submitContactForm);

// Admin route to update contact information (requires auth)
router.use(authMiddleware);

// Get contact information
router.get('/contact', authorize(['paragon_group_view']), ContactController.getContactInfo);

// Create or update contact information
router.post('/contact', authorize(['paragon_group_edit']), ContactController.updateContactInfo);

// Get all contact forms
router.get('/contact-form', authorize(['paragon_group_view']), ContactController.getAllContactForms);

// Delete a contact form
router.delete('/contact-form/:id', authorize(['paragon_group_delete']), ContactController.deleteContactForm);

export default router;