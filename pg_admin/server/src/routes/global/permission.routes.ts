import express from 'express';
import { PermissionController } from '../../controllers/global/permission.controller';

const router = express.Router();

// Create a new permission
router.post('/', PermissionController.create);

export default router;