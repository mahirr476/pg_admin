import express from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorization.middleware';
import { CSRController } from '../../controllers/group/csr.controller';

const router = express.Router();

// Create a new csr
router.post('/csr', authMiddleware, authorize(['paragon_group_create']), CSRController.create);

// Get all CSR items
router.get('/csr', authMiddleware, authorize(['paragon_group_view']), CSRController.getAll);

export default router;