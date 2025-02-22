import express from 'express';
import { WebsiteController } from '../../controllers/global/website.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = express.Router();

// Create a new website
router.post('/', authMiddleware, WebsiteController.create);

// Get all websites
router.get('/', authMiddleware, WebsiteController.getAll);

// Get a website by ID
router.get('/:id', authMiddleware, WebsiteController.getById);

// Update a website
router.put('/:id', authMiddleware, WebsiteController.update);

export default router;