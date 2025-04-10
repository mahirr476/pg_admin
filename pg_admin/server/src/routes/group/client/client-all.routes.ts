// import express from 'express';
// import heroRoutes from '../../group/client/hero.routes';

// const router = express.Router();

// // Mount all client-facing routes
// router.use('/', heroRoutes);
// // Add more client routes here as you expand your API

// export default router;

import express from 'express';
import { HomeController } from '../../../controllers/group/client/home.controller';
import { AboutController } from '../../../controllers/group/client/about.controller';
import { MilestoneController } from '../../../controllers/group/client/milestone.controller';

const router = express.Router();

router.get('/home', HomeController.getHomepage); 
router.get('/about-us', AboutController.getAllAboutUsData);
router.get('/about-csr', AboutController.getCSRWithDetails);
router.get('/milestone', MilestoneController.getAllData);


export default router;