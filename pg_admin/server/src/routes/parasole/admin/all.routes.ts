
import express from 'express';
import heroRoutes from './hero.routes';
import aboutRoutes from './about.routes';
import complianceRoutes from './compliance.routes';
import operationRoutes from './operation.routes';
import buyerRoutes from './buyer.routes';
import contactRoutes from './contact.routes';

const router = express.Router();

// Mount all parasole-related routes under the /api/v1/parasole prefix
router.use('/', heroRoutes);
router.use('/', aboutRoutes);
router.use('/', complianceRoutes);
router.use('/', operationRoutes);
router.use('/', buyerRoutes);
router.use('/', contactRoutes);

export default router;