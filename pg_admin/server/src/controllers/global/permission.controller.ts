import { Request, Response } from 'express';
import { createPermission, getAllPermissions } from '../../services/global/permission.service';

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

};