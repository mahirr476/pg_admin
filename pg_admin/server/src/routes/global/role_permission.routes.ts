import express from "express";
import { RolePermission } from "../../controllers/global/role_permission.controller";

const router = express.Router();

// Update RolePermission by Role ID
router.put("/:roleId", RolePermission.upsertById);

// Get RolePermission by Role ID
router.get("/:roleId", RolePermission.getById);

export default router;