import express from 'express';
import { getActiveUsersHandler, getInactiveUsersHandler, loginUserHandler, registerUserHandler } from '../../controllers/global/auth.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = express.Router();

router.post('/register', registerUserHandler);
router.post('/login', loginUserHandler);
router.get('/active-users', authMiddleware, getActiveUsersHandler);
router.get('/inactive-users', authMiddleware, getInactiveUsersHandler);

export default router;
