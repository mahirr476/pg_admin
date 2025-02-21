import { global } from '../../config/db.config';

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