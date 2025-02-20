import express from 'express';
import { RoleController } from '../../controllers/global/role.controller';

const router = express.Router();

// Create a new role
router.post('/', RoleController.create);


export default router;