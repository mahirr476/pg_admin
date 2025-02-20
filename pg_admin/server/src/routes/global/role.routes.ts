import express from 'express';
import { RoleController } from '../../controllers/global/role.controller';

const router = express.Router();

// Create a new role
router.post('/', RoleController.create);

// Get all roles
router.get('/', RoleController.getAll);

export default router;