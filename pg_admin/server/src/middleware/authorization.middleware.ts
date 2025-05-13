import { Request, Response, NextFunction } from 'express';
import { getRolePermission } from "../services/global/role_permission.service";
import { global } from '../config/db.config';

// Define a union type of all possible permissions
type Permission =
  | 'dashboard'
  | 'analytics_view'
  | 'paragon_group_view'
  | 'paragon_group_create'
  | 'paragon_group_edit'
  | 'paragon_group_delete'
  | 'parasole_view'
  | 'parasole_create'
  | 'parasole_edit'
  | 'parasole_delete'
    // 'aqua_view'
    // 'aqua_create'
    // 'aqua_edit'
    // 'aqua_delete'
    // 'agro_view'
    // 'agro_create'
    // 'agro_edit'
    // 'agro_delete'
    // 'feed_view'
    // 'feed_create'
    // 'feed_edit'
    // 'feed_delete'
    // 'plastics_view'
    // 'plastics_create'
    // 'plastics_edit'
    // 'plastics_delete'
    // 'plast_fiber_view'
    // 'plast_fiber_create'
    // 'plast_fiber_edit'
    // 'plast_fiber_delete'
    // 'poultry_view'
    // 'poultry_create'
    // 'poultry_edit'
    // 'poultry_delete'
    // 'extra1_view'
    // 'extra1_create'
    // 'extra1_edit'
    // 'extra1_delete'
  | 'settings_view'
  | 'settings_create'
  | 'settings_edit'
  | 'user_view'
  | 'user_create'
  | 'user_edit'
  | 'user_delete';

// Middleware to check permissions
export const authorize = (requiredPermissions: Permission[]): any => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the user's ID from the request (set by authMiddleware)
      const user = (req as any).user; // Cast to access the user property
      // console.log("JWT User data:", user);
     
      const userId = user?.userId || user?.id;
     
      if (!userId) {
        return res.status(403).json({
          status: "error",
          message: "User ID not found in token",
        });
      }
     
      // Fetch the user to get their roleId
      const userData = await global.user.findUnique({
        where: { id: userId },
        select: { roleId: true }
      });
     
      // console.log("User data from DB:", userData);
     
      if (!userData || !userData.roleId) {
        return res.status(403).json({
          status: "error",
          message: "User role not found",
        });
      }
     
      // Fetch the RolePermission for the user's role
      const rolePermission = await getRolePermission(userData.roleId);
     
      if (!rolePermission) {
        return res.status(403).json({
          status: "error",
          message: "RolePermission not found",
        });
      }
     
      // Check if the user has all the required permissions
      const hasPermissions = requiredPermissions.every(
        (permission) => rolePermission[permission as keyof typeof rolePermission] === true
      );
     
      if (!hasPermissions) {
        return res.status(403).json({
          status: "error",
          message: "You do not have the required permissions",
        });
      }
     
      // If the user has the required permissions, proceed to the next middleware/route handler
      next();
    } catch (error) {
      console.error("Error in authorization middleware:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error. Please try again later.",
      });
    }
  };
};



// import { Request, Response, NextFunction } from 'express';
// import { getRolePermission } from "../services/global/role_permission.service";
// import { global } from '../config/db.config';

// // Define an interface for permissions
// export interface Permissions {
//   dashboard?: boolean;
//   analytics_view?: boolean;
//   paragon_group_view?: boolean;
//   paragon_group_create?: boolean;
//   paragon_group_edit?: boolean;
//   paragon_group_delete?: boolean;
//   parasole_view?: boolean;
//   parasole_create?: boolean;
//   parasole_edit?: boolean;
//   parasole_delete?: boolean;
//   settings_view?: boolean;
//   settings_create?: boolean;
//   settings_edit?: boolean;
//   user_view?: boolean;
//   user_create?: boolean;
//   user_edit?: boolean;
//   user_delete?: boolean;
//   [key: string]: boolean | undefined; // Index signature to allow string indexing
// }

// // Middleware to check permissions
// export const authorize = (requiredPermissions: string[]) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       // Extract the user's ID from the request (set by authMiddleware)
//       const user = (req as any).user;
//       const userId = user?.userId || user?.id;
     
//       if (!userId) {
//         return res.status(403).json({
//           status: "error",
//           message: "User ID not found in token",
//         });
//       }
     
//       // Fetch the user to get their roleId
//       const userData = await global.user.findUnique({
//         where: { id: userId },
//         select: { roleId: true }
//       });
     
//       if (!userData || !userData.roleId) {
//         return res.status(403).json({
//           status: "error",
//           message: "User role not found",
//         });
//       }
     
//       // Fetch the RolePermission for the user's role
//       // const rolePermission = await getRolePermission(userData.roleId) as Permissions;
//       const rolePermission = await getRolePermission(userData.roleId);
     
//       if (!rolePermission) {
//         return res.status(403).json({
//           status: "error",
//           message: "RolePermission not found",
//         });
//       }
     
//       // Check if the user has all the required permissions
//       const hasPermissions = requiredPermissions.every(
//         // (permission) => rolePermission[permission] === true
//         (permission) => rolePermission[permission as keyof typeof rolePermission] === true
//       );
     
//       if (!hasPermissions) {
//         return res.status(403).json({
//           status: "error",
//           message: "You do not have the required permissions",
//         });
//       }
     
//       // If the user has the required permissions, proceed to the next middleware/route handler
//       next();
//     } catch (error) {
//       console.error("Error in authorization middleware:", error);
//       res.status(500).json({
//         status: "error",
//         message: "Internal server error. Please try again later.",
//       });
//     }
//   };
// };