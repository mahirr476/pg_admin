import express from 'express';
import { RoleController } from '../../controllers/global/role.controller';

const router = express.Router();

// Create a new role
router.post('/', RoleController.create);

// Get all roles
router.get('/', RoleController.getAll);

// Update a role
router.put('/:id', RoleController.update);

// Deactivate a role 
router.patch('/:id/deactivate', RoleController.deactivate);

export default router;