import express from 'express';
import { HeroController } from '../../../controllers/parasole/admin/hero.controller';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { authorize } from '../../../middleware/authorization.middleware';

const router = express.Router();

// Create a new hero
router.post("/hero", authMiddleware, authorize(['parasole_create']), HeroController.create);

// Get all heroes
router.get('/hero', authMiddleware, authorize(['parasole_view']), HeroController.getAll);

// Get a hero by ID
router.get('/hero/:id', authMiddleware, authorize(['parasole_view']), HeroController.getById);

// Update an existing hero
router.put("/hero/:id", authMiddleware, authorize(['parasole_edit']), HeroController.update);

// Delete an existing hero
router.delete("/hero/:id", authMiddleware, authorize(['parasole_delete']), HeroController.delete);


export default router;