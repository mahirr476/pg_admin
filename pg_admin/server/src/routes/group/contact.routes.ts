import express from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorization.middleware';
import { ContactController } from '../../controllers/group/contact.controller';

const router = express.Router();

// Public route to get contact information (no auth required)
router.get('/contact', ContactController.getContactInfo);

// Admin route to update contact information (requires auth)
router.use(authMiddleware);
router.post('/contact', authorize(['paragon_group_edit']), ContactController.updateContactInfo);

export default router;