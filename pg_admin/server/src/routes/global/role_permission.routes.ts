import express from "express";
import { RolePermission } from "../../controllers/global/role_permission.controller";
import { authMiddleware } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorization.middleware';

const router = express.Router();

// Update RolePermission by Role ID
router.put("/:roleId", authMiddleware, authorize(['user_edit']), RolePermission.upsertById);

// Get RolePermission by Role ID
router.get("/:roleId", authMiddleware, authorize(['user_view']), RolePermission.getById);

export default router;