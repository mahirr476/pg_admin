import { Request, Response } from 'express';

import {
  createRole,

} from '../../services/global/role.service';


export const RoleController = {
    
    // Create a new role
    create: async (req: Request, res: Response) => {
        try {
            const { name } = req.body;
            const role = await createRole({ name });
            res.status(201).json({ 
                status: "success",
                message: 'Role created successfully', 
                role 
            });
        } catch (error) {
            // console.error('Error creating website:', error);
            res.status(400).json({
                error: (error as Error).message || 'Failed to create role.',
              });
        }
    },


};