import  global  from '../../config/db.config';

// Create a new permission
export const createPermission = async (data: { name: string }) => {

    // Check if the permission already exists
    const existingPermission = await global.permission.findUnique({ where: { name: data.name } })
    if (existingPermission) {
        throw new Error('A permission with this name already exists');
      }

    return await global.permission.create({
        data: {
            name: data.name,
        },
    });

};

// Get all permissions
export const getAllPermissions = async () => {
    return await global.permission.findMany();
};

// Get a permission by ID
export const getPermissionById = async (id: number) => {
    const permission = await global.permission.findUnique({ where: { id } });
    if (!permission) {
      throw new Error('Permission not found');
    }
    return permission;
};

// Update a permission
export const updatePermission = async (id: number, data: { name?: string }) => {
    
    // Check if the role exists
    const existingPermission = await global.permission.findUnique({ where: { id } });
    if (!existingPermission) {
      throw new Error('Permission not found');
    }
  
    // If updating the name, ensure it's unique
    if (data.name) {
      const duplicatePermission = await global.permission.findUnique({ where: { name: data.name } });
      if (duplicatePermission && duplicatePermission.id !== id) {
        throw new Error('A permission with this name already exists');
      }
    }
  
    // Update the permission
    return await global.permission.update({
      where: { id },
      data: {
        name: data.name,
      },
    });

};