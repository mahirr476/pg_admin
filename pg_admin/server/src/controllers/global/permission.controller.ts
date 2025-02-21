import { Request, Response } from 'express';
import { createPermission } from '../../services/global/permission.service';

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

};