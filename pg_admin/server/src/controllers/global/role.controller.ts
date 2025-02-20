import { Request, Response } from 'express';

import {
  createRole,
  getAllRoles,
  updateRole,
  deactivateRole

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

    // Get all roles
    getAll: async (req: Request, res: Response) => {
        try {
            const roles = await getAllRoles();
            res.status(200).json({ 
                status: "success",
                message: 'Roles fetched successfully', 
                roles 
            });
        } catch (error) {
            // console.error('Error fetch roles:', error);
            res.status(500).json({ 
                error: (error as Error).message || 'Failed to fetch roles' });
        }
    },

    // Update a role
    update: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const updatedRole = await updateRole(Number(id), req.body);
            res.status(200).json({ 
                status: "success",
                message: 'Role updated successfully', 
                role: updatedRole 
            });
        } catch (error) {
            console.error('Error Failed to update role:', error);
            res.status(400).json({ 
                error: (error as Error).message || 'Failed to update role' 
            });
        }
    },

      // Deactivate a role
    deactivate: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
        
            // Change role status to inactive
            await deactivateRole(Number(id));
        
            res.status(200).json({ message: 'Role deactivated successfully' });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message || 'Failed to deactivate role' });
        }
    },

};