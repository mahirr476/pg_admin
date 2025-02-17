import express from 'express';
import { registerUserHandler } from '../../controllers/global/auth.controller';

const router = express.Router();

router.post('/register', registerUserHandler);

export default router;
