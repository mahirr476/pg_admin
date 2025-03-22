
import express from 'express';
import heroRoutes from './hero.routes';
import impactRoutes from './impact.routes';
import aboutRoutes from './about.routes';
import boardRoutes from './board-director.routes';
import csrRoutes from './csr.routes';
import milestoneRoutes from './milestone.routes';

const router = express.Router();

// Mount all group-related routes under the /api/v1/group prefix
router.use('/', heroRoutes);
router.use('/', impactRoutes);
router.use('/', aboutRoutes);
router.use('/', boardRoutes);
router.use('/', csrRoutes);
router.use('/', milestoneRoutes);

export default router;