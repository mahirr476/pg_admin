import express from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorization.middleware';
import { CSRController } from '../../controllers/group/csr.controller';

const router = express.Router();
router.use(authMiddleware);

// Create a new csr
router.post('/csr', authorize(['paragon_group_create']), CSRController.create);

// Get all CSR items
router.get('/csr', authorize(['paragon_group_view']), CSRController.getAll);

// Create a new CSR detail
router.post('/csr/detail', authorize(['paragon_group_create']), CSRController.createDetail);

// Get all CSR details
router.get('/csr/detail', authorize(['paragon_group_view']), CSRController.getAllcsrDetail);

export default router;