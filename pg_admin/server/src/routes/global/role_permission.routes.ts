import express from "express";
import { RolePermission } from "../../controllers/global/role_permission.controller";

const router = express.Router();

// Update RolePermission by Role ID
router.put("/:roleId", RolePermission.upsertById);

export default router;