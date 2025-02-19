import express from 'express';
import { loginUserHandler, registerUserHandler } from '../../controllers/global/auth.controller';

const router = express.Router();

router.post('/register', registerUserHandler);
router.post('/login', loginUserHandler);

export default router;
