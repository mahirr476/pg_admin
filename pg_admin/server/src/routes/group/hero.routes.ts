import express from 'express';
import { HeroController } from '../../controllers/group/hero.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = express.Router();

// Create a new hero
router.post("/hero", authMiddleware, HeroController.create);

export default router;