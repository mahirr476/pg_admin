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
  