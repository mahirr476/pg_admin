// // contexts/AuthContext.tsx
// 'use client';

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import Cookies from 'js-cookie';

// type Role = 'Super Admin' | 'Admin' | 'User';

// interface User {
//   id: number;
//   firstName: string;
//   lastName: string;
//   roleId: number;
//   email: string;
//   permissions: {
//     pargon: string[];
//     parasole: string[];
//     user: string[];
//     settings: string[];
//     analytics: string[];
//   };
// }

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   hasPermission: (module: string, action: string) => boolean;
//   hasRole: (role: Role) => boolean;
//   isSuperAdmin: boolean;
//   isAdmin: boolean;
//   isUser: boolean;
// }

// const AuthContext = createContext<AuthContextType | null>(null);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   // Fetch user on mount
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const token = Cookies.get('token');
//         if (!token) {
//           setLoading(false);
//           return;
//         }

//         // Fetch user profile
//         const response = await fetch('http://localhost:7000/api/v1/user/profile', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error('Failed to fetch user profile');
//         }

//         const userData = await response.json();
        
//         // Initialize permissions if missing
//         userData.permissions = userData.permissions || {
//           pargon: [],
//           parasole: [],
//           user: [],
//           settings: [],
//           analytics: []
//         };
        
//         setUser(userData);
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   // Get role name from roleId
//   const getRoleName = (roleId: number): Role => {
//     switch (roleId) {
//       case 1: return 'Super Admin';
//       case 2: return 'Admin';
//       case 3: return 'User';
//       default: return 'User';
//     }
//   };

//   // Check if user has permission
//   const hasPermission = (module: string, action: string): boolean => {
//     if (!user || !user.permissions) return false;
//     return user.permissions[module]?.includes(action) || false;
//   };

//   // Check if user has role
//   const hasRole = (role: Role): boolean => {
//     if (!user) return false;
//     const userRole = getRoleName(user.roleId);
    
//     // Role hierarchy: Super Admin > Admin > User
//     switch (role) {
//       case 'Super Admin':
//         return userRole === 'Super Admin';
//       case 'Admin':
//         return userRole === 'Super Admin' || userRole === 'Admin';
//       case 'User':
//         return userRole === 'Super Admin' || userRole === 'Admin' || userRole === 'User';
//       default:
//         return false;
//     }
//   };

//   const isSuperAdmin = hasRole('Super Admin');
//   const isAdmin = hasRole('Admin');
//   const isUser = hasRole('User');

//   return (
//     <AuthContext.Provider value={{
//       user,
//       loading,
//       hasPermission,
//       hasRole,
//       isSuperAdmin,
//       isAdmin,
//       isUser
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };


