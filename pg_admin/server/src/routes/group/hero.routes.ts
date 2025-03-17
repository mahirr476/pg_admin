import express from 'express';
import { HeroController } from '../../controllers/group/hero.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorization.middleware';

const router = express.Router();

// Create a new hero
router.post("/hero", authMiddleware, authorize(['paragon_group_create']), HeroController.create);

// router.post("/hero", authMiddleware, authorize(['paragon_group_create']), HeroController.createOrUpdate);

// Update an existing hero
router.put("/hero/:id", authMiddleware, authorize(['paragon_group_edit']), HeroController.update);

// Get all heroes
router.get('/hero', authMiddleware, authorize(['paragon_group_view']), HeroController.getAll);

export default router;