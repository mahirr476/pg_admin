import express from 'express';
import { createUserHandler, getAllUsersHandler, getInactiveUsersHandler, getUserByIdHandler, loginUserHandler, registerUserHandler, updateUserHandler } from '../../controllers/global/auth.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorization.middleware';

const router = express.Router();

router.post('/register', registerUserHandler);
router.post('/login', loginUserHandler);
router.post('/create', authMiddleware, authorize(['user_create']), createUserHandler);
router.get('/all', authMiddleware, authorize(['user_view']), getAllUsersHandler);
router.get('/:id', authMiddleware, authorize(['user_view']), getUserByIdHandler);
router.put('/:id', authMiddleware, authorize(['user_edit']), updateUserHandler);
router.get('/inactive-users', authMiddleware, authorize(['user_edit']), getInactiveUsersHandler);

export default router;
