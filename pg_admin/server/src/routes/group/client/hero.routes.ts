import express from 'express';
// import { ClientHeroController } from '../../../controllers/group/hero.controller';
import { HeroController } from '../../../controllers/group/hero.controller';

const router = express.Router();

router.get('/heroes', HeroController.getAll);


export default router;