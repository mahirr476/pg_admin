import express from 'express';
import { getActiveUsersHandler, loginUserHandler, registerUserHandler } from '../../controllers/global/auth.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = express.Router();

router.post('/register', registerUserHandler);
router.post('/login', loginUserHandler);
router.get('/active-users', authMiddleware, getActiveUsersHandler);

export default router;
