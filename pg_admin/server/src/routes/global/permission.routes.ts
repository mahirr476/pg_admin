import express from 'express';
import { PermissionController } from '../../controllers/global/permission.controller';

const router = express.Router();

// Create a new permission
router.post('/', PermissionController.create);

// Get all permissions
router.get('/', PermissionController.getAll);

export default router;