import { global } from '../../config/db.config';

// Create a new role
export const createRole = async (data: { name: string }) => {
    
    // Check if the role already exists
    const existingRole = await global.role.findUnique({ where: { name: data.name } });
    if (existingRole) {
      throw new Error('A role with this name already exists');
    }
  
    // Create the role in the database
    return await global.role.create({
      data: {
        name: data.name,
      },
    });
};

// Get all roles
export const getAllRoles = async () => {
    return await global.role.findMany();
};

// Update a role
export const updateRole = async (id: number, data: { name?: string }) => {
    
    // Check if the role exists
    const existingRole = await global.role.findUnique({ where: { id } });
    if (!existingRole) {
      throw new Error('Role not found');
    }
  
    // If updating the name, ensure it's unique
    if (data.name) {
      const duplicateRole = await global.role.findUnique({ where: { name: data.name } });
      if (duplicateRole && duplicateRole.id !== id) {
        throw new Error('A role with this name already exists');
      }
    }
  
    // Update the role
    return await global.role.update({
      where: { id },
      data: {
        name: data.name,
      },
    });
};

// Delete a role
export const deactivateRole = async (id: number) => {
    
    // Check if the role exists
    const existingRole = await global.role.findUnique({ where: {id} });
    if (!existingRole) {
        throw new Error('Role not found');
    }

    // Update the status to INACTIVE
    return await global.role.update({
        where: { id },
        data: { status: 'INACTIVE' },
      });

};