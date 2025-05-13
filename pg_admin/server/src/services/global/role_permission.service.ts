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

                // Aqua Breeder permissions
                aqua_view: updatedPermissions.aqua_view,
                aqua_create: updatedPermissions.aqua_create,
                aqua_edit: updatedPermissions.aqua_edit,
                aqua_delete: updatedPermissions.aqua_delete,

                // Paragon Agro permissions
                agro_view: updatedPermissions.agro_view,
                agro_create: updatedPermissions.agro_create,
                agro_edit: updatedPermissions.agro_edit,
                agro_delete: updatedPermissions.agro_delete,

                // Paragon Feed permissions
                feed_view: updatedPermissions.feed_view,
                feed_create: updatedPermissions.feed_create,
                feed_edit: updatedPermissions.feed_edit,
                feed_delete: updatedPermissions.feed_delete,

                // Paragon Plastics permissions
                plastics_view: updatedPermissions.plastics_view,
                plastics_create: updatedPermissions.plastics_create,
                plastics_edit: updatedPermissions.plastics_edit,
                plastics_delete: updatedPermissions.plastics_delete,

                // Paragon Plast Fiber permissions
                plast_fiber_view: updatedPermissions.plast_fiber_view,
                plast_fiber_create: updatedPermissions.plast_fiber_create,
                plast_fiber_edit: updatedPermissions.plast_fiber_edit,
                plast_fiber_delete: updatedPermissions.plast_fiber_delete,

                // Paragon Poultry permissions
                poultry_view: updatedPermissions.poultry_view,
                poultry_create: updatedPermissions.poultry_create,
                poultry_edit: updatedPermissions.poultry_edit,
                poultry_delete: updatedPermissions.poultry_delete,

                // Extra Filed permissions
                extra1_view: updatedPermissions.extra1_view,
                extra1_create: updatedPermissions.extra1_create,
                extra1_edit: updatedPermissions.extra1_edit,
                extra1_delete: updatedPermissions.extra1_delete,

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

                // Aqua Breeder permissions
                aqua_view: updatedPermissions.aqua_view,
                aqua_create: updatedPermissions.aqua_create,
                aqua_edit: updatedPermissions.aqua_edit,
                aqua_delete: updatedPermissions.aqua_delete,

                // Paragon Agro permissions
                agro_view: updatedPermissions.agro_view,
                agro_create: updatedPermissions.agro_create,
                agro_edit: updatedPermissions.agro_edit,
                agro_delete: updatedPermissions.agro_delete,

                // Paragon Feed permissions
                feed_view: updatedPermissions.feed_view,
                feed_create: updatedPermissions.feed_create,
                feed_edit: updatedPermissions.feed_edit,
                feed_delete: updatedPermissions.feed_delete,

                // Paragon Plastics permissions
                plastics_view: updatedPermissions.plastics_view,
                plastics_create: updatedPermissions.plastics_create,
                plastics_edit: updatedPermissions.plastics_edit,
                plastics_delete: updatedPermissions.plastics_delete,

                // Paragon Plast Fiber permissions
                plast_fiber_view: updatedPermissions.plast_fiber_view,
                plast_fiber_create: updatedPermissions.plast_fiber_create,
                plast_fiber_edit: updatedPermissions.plast_fiber_edit,
                plast_fiber_delete: updatedPermissions.plast_fiber_delete,

                // Paragon Poultry permissions
                poultry_view: updatedPermissions.poultry_view,
                poultry_create: updatedPermissions.poultry_create,
                poultry_edit: updatedPermissions.poultry_edit,
                poultry_delete: updatedPermissions.poultry_delete,

                // Extra Filed permissions
                extra1_view: updatedPermissions.extra1_view,
                extra1_create: updatedPermissions.extra1_create,
                extra1_edit: updatedPermissions.extra1_edit,
                extra1_delete: updatedPermissions.extra1_delete,

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

                // Aqua Breeder permissions
                aqua_view: true,
                aqua_create: true,
                aqua_edit: true,
                aqua_delete: true,

                // Paragon Agro permissions
                agro_view: true,
                agro_create: true,
                agro_edit: true,
                agro_delete: true,

                // Paragon Feed permissions
                feed_view: true,
                feed_create: true,
                feed_edit: true,
                feed_delete: true,

                // Paragon Plastics permissions
                plastics_view: true,
                plastics_create: true,
                plastics_edit: true,
                plastics_delete: true,

                // Paragon Plast Fiber permissions
                plast_fiber_view: true,
                plast_fiber_create: true,
                plast_fiber_edit: true,
                plast_fiber_delete: true,

                // Paragon Poultry permissions
                poultry_view: true,
                poultry_create: true,
                poultry_edit: true,
                poultry_delete: true,

                // Extra Filed permissions
                extra1_view: true,
                extra1_create: true,
                extra1_edit: true,
                extra1_delete: true,

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

                // Aqua Breeder permissions
                aqua_view: true,
                aqua_create: true,
                aqua_edit: true,
                aqua_delete: true,

                // Paragon Agro permissions
                agro_view: true,
                agro_create: true,
                agro_edit: true,
                agro_delete: true,

                // Paragon Feed permissions
                feed_view: true,
                feed_create: true,
                feed_edit: true,
                feed_delete: true,

                // Paragon Plastics permissions
                plastics_view: true,
                plastics_create: true,
                plastics_edit: true,
                plastics_delete: true,

                // Paragon Plast Fiber permissions
                plast_fiber_view: true,
                plast_fiber_create: true,
                plast_fiber_edit: true,
                plast_fiber_delete: true,

                // Paragon Poultry permissions
                poultry_view: true,
                poultry_create: true,
                poultry_edit: true,
                poultry_delete: true,

                // Extra Filed permissions
                extra1_view: true,
                extra1_create: true,
                extra1_edit: true,
                extra1_delete: true,

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
        // console.error("Error while fetching RolePermission:", error);
        throw new Error("Failed to fetch RolePermission");
    }
};