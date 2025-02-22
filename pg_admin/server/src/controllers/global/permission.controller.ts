import { Request, Response } from 'express';
import { createPermission, getAllPermissions, getPermissionById, updatePermission } from '../../services/global/permission.service';

export const PermissionController = {

    // Create a new permission
    create: async (req: Request, res: Response) => {
        try {
            const { name } = req.body;
            const permission = await createPermission({ name });
            res.status(201).json({ 
                status: "success",
                message: 'Permission created successfully', 
                permission 
            });
        } catch (error) {
            // console.error('Error creating permission:', error);
            res.status(400).json({
                error: (error as Error).message || 'Failed to create permission.',
                });
        }
    },

    // Get all permissions
    getAll: async (req: Request, res: Response) => {
        try {
            const permissions = await getAllPermissions();
            res.status(200).json({ 
                status: "success",
                message: 'Permission fetched successfully', 
                permissions 
            });
        } catch (error) {
            // console.error('Error fetch permissions:', error);
            res.status(500).json({ 
                error: (error as Error).message || 'Failed to fetch permissions' });
        }
    },

    // Get a permission by ID
    getById: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const permission = await getPermissionById(Number(id));
            res.status(200).json({
                status: "success",
                message: 'Permission fetched successfully',
                permission,
            });
        } catch (error) {
            res.status(404).json({
                error: (error as Error).message || 'Permission not found.',
            });
        }
    },

    // Update a permission
    update: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const updatedPermission = await updatePermission(Number(id), req.body);
            res.status(200).json({
                status: "success",
                message: 'Permission updated successfully',
                permission: updatedPermission,
            });
        } catch (error) {
            res.status(400).json({
                error: (error as Error).message || 'Failed to update permission.',
            });
        }
    },


};