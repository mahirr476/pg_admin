import { global } from '../../config/db.config';

// Upsert RolePermission by Role ID
export const upsertRolePermission = async (roleId: number, updatedPermissions: any) => {
    try {
        return await global.rolePermission.upsert({
            where: { roleId }, // Find the record by roleId
            update: {
                paragon_group_view: updatedPermissions.paragon_group_view,
                paragon_group_create: updatedPermissions.paragon_group_create,
                paragon_group_edit: updatedPermissions.paragon_group_edit,
                paragon_group_delete: updatedPermissions.paragon_group_delete,
                parasole_view: updatedPermissions.parasole_view,
                parasole_create: updatedPermissions.parasole_create,
                parasole_edit: updatedPermissions.parasole_edit,
                parasole_delete: updatedPermissions.parasole_delete,
                dashboard: updatedPermissions.dashboard,
            },
            create: {
                roleId,
                paragon_group_view: updatedPermissions.paragon_group_view || false,
                paragon_group_create: updatedPermissions.paragon_group_create || false,
                paragon_group_edit: updatedPermissions.paragon_group_edit || false,
                paragon_group_delete: updatedPermissions.paragon_group_delete || false,
                parasole_view: updatedPermissions.parasole_view || false,
                parasole_create: updatedPermissions.parasole_create || false,
                parasole_edit: updatedPermissions.parasole_edit || false,
                parasole_delete: updatedPermissions.parasole_delete || false,
                dashboard: updatedPermissions.dashboard || false,
            },
            select: {
                id: true,
                paragon_group_view: true,
                paragon_group_create: true,
                paragon_group_edit: true,
                paragon_group_delete: true,
                parasole_view: true,
                parasole_create: true,
                parasole_edit: true,
                parasole_delete: true,
                dashboard: true,
            },
        });
    } catch (error) {
        // console.error("Error while upserting RolePermission:", error);
        throw new Error("Failed to upsert RolePermission");
    }
};