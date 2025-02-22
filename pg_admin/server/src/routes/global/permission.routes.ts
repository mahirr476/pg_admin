import express from 'express';
import { PermissionController } from '../../controllers/global/permission.controller';

const router = express.Router();

// Create a new permission
router.post('/', PermissionController.create);

// Get all permissions
router.get('/', PermissionController.getAll);

// Get a permission by ID
router.get('/:id', PermissionController.getById);

// Update a permission
router.put('/:id', PermissionController.update);

export default router;