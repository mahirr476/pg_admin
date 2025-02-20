import express from 'express';
import { WebsiteController } from '../../controllers/global/website.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = express.Router();

// Create a new website
router.post('/', authMiddleware, WebsiteController.create);

// Get all websites
router.get('/', authMiddleware, WebsiteController.getAll);



export default router;