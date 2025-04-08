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

// Update CSR items
router.put('/csr/:id', authorize(['paragon_group_edit']), CSRController.update);

// Delete CSR items
router.delete('/csr/:id', authorize(['paragon_group_edit']), CSRController.delete);

// Create a new CSR detail
router.post('/csr/detail', authorize(['paragon_group_create']), CSRController.createDetail);

// Get all CSR details
router.get('/csr/detail', authorize(['paragon_group_view']), CSRController.getAllcsrDetail);

// update CSR detail
router.put('/csr/detail/:id', authorize(['paragon_group_edit']), CSRController.updateCSRDetail);

// Delete CSR detail
router.delete('/csr/detail/:id', authorize(['paragon_group_delete']), CSRController.deleteCSRDetail);

export default router;