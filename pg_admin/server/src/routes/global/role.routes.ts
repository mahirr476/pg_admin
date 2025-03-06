import express from 'express';
import { RoleController } from '../../controllers/global/role.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorization.middleware';

const router = express.Router();

// Create a new role
router.post('/', authMiddleware, authorize(['user_create']), RoleController.create);

// Get all roles
router.get('/', authMiddleware, authorize(['user_view']), RoleController.getAll);

// Get a role by ID
router.get('/:id', authMiddleware, authorize(['user_view']), RoleController.getById);

// Update a role
router.put('/:id', authMiddleware, authorize(['user_edit']), RoleController.update);

// Deactivate a role.
router.patch('/:id/deactivate', RoleController.deactivate);

export default router;