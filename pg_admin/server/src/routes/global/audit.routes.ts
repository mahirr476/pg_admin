import express from 'express';
import { AuditController } from '../../controllers/global/audit-log.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorization.middleware';

const router = express.Router();

// // GET /audit-logs
router.get('/', authMiddleware, authorize(['user_view']), AuditController.getAll);

export default router;