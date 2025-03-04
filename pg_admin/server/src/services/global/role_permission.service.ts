import { global } from '../../config/db.config';

// Upsert RolePermission by Role ID
export const upsertRolePermission = async (roleId: number, updatedPermissions: any) => {
    try {
        return await global.rolePermission.upsert({
            where: { roleId }, // Find the record by roleId
            update: {
                // Paragon group permissions
                paragon_group_view: updatedPermissions.paragon_group_view,
                paragon_group_create: updatedPermissions.paragon_group_create,
                paragon_group_edit: updatedPermissions.paragon_group_edit,
                paragon_group_delete: updatedPermissions.paragon_group_delete,

                // Parasole permissions
                parasole_view: updatedPermissions.parasole_view,
                parasole_create: updatedPermissions.parasole_create,
                parasole_edit: updatedPermissions.parasole_edit,
                parasole_delete: updatedPermissions.parasole_delete,

                // User permissions
                user_view: updatedPermissions.user_view,
                user_create: updatedPermissions.user_create,
                user_edit: updatedPermissions.user_edit,
                user_delete: updatedPermissions.user_delete,

                // Settings permissions
                settings_view: updatedPermissions.settings_view,
                settings_create: updatedPermissions.settings_create,
                settings_edit: updatedPermissions.settings_edit,

                dashboard: updatedPermissions.dashboard,
                analytics_view: updatedPermissions.analytics_view,
                
            },
            create: {
                roleId,
                // Paragon group permissions
                paragon_group_view: updatedPermissions.paragon_group_view || false,
                paragon_group_create: updatedPermissions.paragon_group_create || false,
                paragon_group_edit: updatedPermissions.paragon_group_edit || false,
                paragon_group_delete: updatedPermissions.paragon_group_delete || false,

                // Parasole permissions
                parasole_view: updatedPermissions.parasole_view || false,
                parasole_create: updatedPermissions.parasole_create || false,
                parasole_edit: updatedPermissions.parasole_edit || false,
                parasole_delete: updatedPermissions.parasole_delete || false,

                 // User permissions
                 user_view: updatedPermissions.user_view || false,
                 user_create: updatedPermissions.user_create || false,
                 user_edit: updatedPermissions.user_edit || false,
                 user_delete: updatedPermissions.user_delete || false,

                 // Settings permissions
                settings_view: updatedPermissions.settings_view || false,
                settings_create: updatedPermissions.settings_create || false,
                settings_edit: updatedPermissions.settings_edit || false,

                dashboard: updatedPermissions.dashboard || false,
                analytics_view: updatedPermissions.analytics_view || false,
            },
            select: {
                id: true,

                // Paragon group permissions
                paragon_group_view: true,
                paragon_group_create: true,
                paragon_group_edit: true,
                paragon_group_delete: true,

                // Parasole permissions
                parasole_view: true,
                parasole_create: true,
                parasole_edit: true,
                parasole_delete: true,

                // User permissions
                user_view: true,
                user_create: true,
                user_edit: true,
                user_delete: true,

                // Settings permissions
                settings_view: true,
                settings_create: true,
                settings_edit: true,

                dashboard: true,
                analytics_view: true,
            },
        });
    } catch (error) {
        // console.error("Error while upserting RolePermission:", error);
        throw new Error("Failed to upsert RolePermission");
    }
};

// Get RolePermission by Role ID
export const getRolePermission = async (roleId: number) => {
    try {
        return await global.rolePermission.findUnique({
            where: { roleId },
            select: {
                id: true,
                // Paragon group permissions
                paragon_group_view: true,
                paragon_group_create: true,
                paragon_group_edit: true,
                paragon_group_delete: true,

                // Parasole permissions
                parasole_view: true,
                parasole_create: true,
                parasole_edit: true,
                parasole_delete: true,
                dashboard: true,
            },
        });
    } catch (error) {
        // console.error("Error while fetching RolePermission:", error);
        throw new Error("Failed to fetch RolePermission");
    }
};