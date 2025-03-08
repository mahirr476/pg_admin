import express from 'express';
import { AuditController } from '../../controllers/global/audit-log.controller';

const router = express.Router();

// // GET /audit-logs
router.get('/', AuditController.getAll);

export default router;