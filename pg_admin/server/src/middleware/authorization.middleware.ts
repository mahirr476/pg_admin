// import { Request, Response, NextFunction } from 'express';
// import { getRolePermission } from "../services/global/role_permission.service";
// import { global } from '../config/db.config';

// export const authorize = (requiredPermissions: string[]) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       // Extract the user's ID from the request (set by authMiddleware)
//       const user = (req as any).user; // Cast to access the user property
//       // console.log("JWT User data:", user);
      
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
      
//       // console.log("User data from DB:", userData);
      
//       if (!userData || !userData.roleId) {
//         return res.status(403).json({
//           status: "error",
//           message: "User role not found",
//         });
//       }
      
//       // Fetch the RolePermission for the user's role
//       const rolePermission = await getRolePermission(userData.roleId);
      
//       if (!rolePermission) {
//         return res.status(403).json({
//           status: "error",
//           message: "RolePermission not found",
//         });
//       }
      
//       // Check if the user has all the required permissions
//       const hasPermissions = requiredPermissions.every(
//         (permission) => rolePermission[permission as keyof typeof rolePermission]
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
  | 'settings_view'
  | 'settings_create'
  | 'settings_edit'
  | 'user_view'
  | 'user_create'
  | 'user_edit'
  | 'user_delete';

// Middleware to check permissions
export const authorize = (requiredPermissions: Permission[]) => {
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

// // Define permission constants to use throughout the application
// export const PERMISSIONS = {
//   DASHBOARD: 'dashboard',
//   ANALYTICS_VIEW: 'analytics_view',
//   PARAGON_GROUP_VIEW: 'paragon_group_view',
//   PARAGON_GROUP_CREATE: 'paragon_group_create',
//   PARAGON_GROUP_EDIT: 'paragon_group_edit',
//   PARAGON_GROUP_DELETE: 'paragon_group_delete',
//   PARASOLE_VIEW: 'parasole_view',
//   PARASOLE_CREATE: 'parasole_create',
//   PARASOLE_EDIT: 'parasole_edit',
//   PARASOLE_DELETE: 'parasole_delete',
//   SETTINGS_VIEW: 'settings_view',
//   SETTINGS_CREATE: 'settings_create',
//   SETTINGS_EDIT: 'settings_edit',
//   USER_VIEW: 'user_view',
//   USER_CREATE: 'user_create',
//   USER_EDIT: 'user_edit',
//   USER_DELETE: 'user_delete'
// } as const;

// // Define the permission type from the constants
// type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// // Middleware to check permissions
// export const authorize = (requiredPermissions: Permission[]) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       // Extract the user's ID from the request (set by authMiddleware)
//       const user = (req as any).user; // Cast to access the user property
      
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
//       const rolePermission = await getRolePermission(userData.roleId);
      
//       if (!rolePermission) {
//         return res.status(403).json({
//           status: "error",
//           message: "RolePermission not found",
//         });
//       }
      
//       // Check if the user has all the required permissions
//       const hasPermissions = requiredPermissions.every(
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