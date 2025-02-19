import express from 'express';
import { getActiveUsersHandler, loginUserHandler, registerUserHandler } from '../../controllers/global/auth.controller';

const router = express.Router();

router.post('/register', registerUserHandler);
router.post('/login', loginUserHandler);
router.get('/active-users', getActiveUsersHandler);

export default router;
