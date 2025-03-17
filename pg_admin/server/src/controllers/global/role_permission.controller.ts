import { upsertRolePermission, getRolePermission } from '../../services/global/role_permission.service';
import { Request, Response } from 'express';

export const RolePermission = {

    // Update or Insert RolePermission by ID
    upsertById: async (req: Request, res: Response) => {
        try {
            const roleId = Number(req.params.roleId);

            if (!roleId) {
                res.status(400).json({
                    status: "error",
                    message: "Invalid role ID",
                });
                return;
            }

            const updatedPermissions = req.body;

            const rolePermission = await upsertRolePermission(roleId, updatedPermissions);

            res.status(200).json({
                status: "success",
                message: "RolePermission upserted successfully",
                rolePermission,
            });
        } catch (error) {
            // console.error("Error upserting RolePermission:", error);
            res.status(500).json({
                status: "error",
                message: "Internal server error. Please try again later.",
            });
        }
    },

    // Get a role_permission by ID
    getById: async (req: Request, res: Response) => {
        try {
            const roleId = Number(req.params.roleId);
    
            if (!roleId) {
                res.status(400).json({
                    status: "error",
                    message: "Invalid role ID",
                });
                return;
            }
    
            const rolePermission = await getRolePermission(roleId);
    
            if (!rolePermission) {
                res.status(404).json({
                    status: "error",
                    message: "RolePermission not found",
                });
                return;
            }
    
            res.status(200).json({
                status: "success",
                message: "RolePermission retrieved successfully",
                rolePermission,
            });
        } catch (error) {
            // console.error("Error fetching RolePermission:", error);
            res.status(500).json({
                status: "error",
                message: "Internal server error. Please try again later.",
            });
        }
    },

};