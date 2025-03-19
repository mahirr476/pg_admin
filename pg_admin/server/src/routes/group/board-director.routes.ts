import express from 'express';
import { BoardController  } from '../../controllers/group/board-director.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorization.middleware';

const router = express.Router();

router.post('/board/content', authMiddleware, authorize(['paragon_group_create', 'paragon_group_edit']), BoardController.upsert);
router.get('/board/content', authMiddleware, authorize(['paragon_group_view']), BoardController.getAll);

router.post('/board', authMiddleware, authorize(['paragon_group_create']), BoardController.createDirector);


export default router;
