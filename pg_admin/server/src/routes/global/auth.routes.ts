import express from 'express';
import { createUserHandler, getAllUsersHandler, getInactiveUsersHandler, getUserByIdHandler, loginUserHandler, registerUserHandler, updateUserHandler } from '../../controllers/global/auth.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = express.Router();

router.post('/register', registerUserHandler);
router.post('/login', loginUserHandler);
router.post('/create', authMiddleware, createUserHandler);
router.get('/all', authMiddleware, getAllUsersHandler);
router.get('/:id', authMiddleware, getUserByIdHandler);
router.put('/:id', authMiddleware, updateUserHandler);
router.get('/inactive-users', authMiddleware, getInactiveUsersHandler);

export default router;
