
// // "use client"

// // import Link from 'next/link';
// // import { useState, useEffect } from 'react';
// // import { User, LogOut, Bell, Settings, ChevronDown, Loader2 } from 'lucide-react';
// // import Image from 'next/image';
// // import { useAuth } from '@/providers/auth-provider';
// // import { useRouter } from 'next/navigation';
// // import Cookies from 'js-cookie';
// // // import { WebsiteSelector } from './WebsiteSelector';

// // interface UserData {
// //   id: number;
// //   firstName: string;
// //   lastName: string;
// //   email: string;
// //   status: string;
// //   roleId: number;
// //   role?: string; // Optional role property
// // }

// // export function Header() {
// //   const router = useRouter();
// //   const { logout } = useAuth();
// //   const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
// //   const [userData, setUserData] = useState<UserData | null>(null);
// //   const [role, setRole] = useState<string>('');
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);

// //   // Fetch user data from API
// //   useEffect(() => {
// //     const fetchUserData = async () => {
// //       setIsLoading(true);
// //       setError(null);
      
// //       try {
// //         const token = Cookies.get("token");
        
// //         if (!token) {
// //           console.log("No authentication token found");
// //           setIsLoading(false);
// //           setError("Authentication token not found");
// //           return;
// //         }
        
// //         // Fetch all users data
// //         const response = await fetch("http://localhost:7000/api/v1/user/all", {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             "Content-Type": "application/json",
// //           },
// //         });
        
// //         if (!response.ok) {
// //           console.warn(`Failed to fetch user data: ${response.status}`);
// //           setIsLoading(false);
// //           setError(`Failed to fetch user data: ${response.status}`);
// //           return;
// //         }
        
// //         const data = await response.json();
        
// //         if (data.status === "success" && data.users && data.users.length > 0) {
// //           // Get the first user (in production, you'd get the current logged-in user)
// //           const user = data.users[0];
// //           setUserData(user);
          
// //           // Set the role directly from the user object
// //           if (user.role) {
// //             setRole(user.role);
// //           } else {
// //             setRole("User");
// //           }
// //         } else {
// //           setError("No user data found");
// //         }
// //       } catch (error) {
// //         console.error("Error fetching user data:", error);
// //         setError("Failed to fetch user data");
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };
    
// //     fetchUserData();
// //   }, []);

// //   const handleLogout = async () => {
// //     try {
// //       Cookies.remove('token');
// //       localStorage.removeItem('rememberedEmail');
// //       localStorage.removeItem('accessToken');
// //       logout();
// //       setProfileDropdownOpen(false);
// //       router.push('/login');
// //     } catch (error) {
// //       console.error('Logout error:', error);
// //     }
// //   };

// //   // Handle click outside of dropdown to close it
// //   useEffect(() => {
// //     const handleClickOutside = (event: MouseEvent) => {
// //       const dropdown = document.getElementById('profile-dropdown');
// //       const button = document.getElementById('profile-button');
      
// //       if (
// //         dropdown && 
// //         button && 
// //         !dropdown.contains(event.target as Node) && 
// //         !button.contains(event.target as Node)
// //       ) {
// //         setProfileDropdownOpen(false);
// //       }
// //     };
    
// //     document.addEventListener('mousedown', handleClickOutside);
    
// //     return () => {
// //       document.removeEventListener('mousedown', handleClickOutside);
// //     };
// //   }, []);

// //   // Get initials for avatar
// //   const getInitials = () => {
// //     if (!userData) return 'U';
// //     return `${userData.firstName?.charAt(0) || ''}${userData.lastName?.charAt(0) || ''}`;
// //   };

// //   return (
// //     <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 shadow-sm z-50 backdrop-blur-sm bg-white/95">
// //       <div className="max-w-[1920px] mx-auto flex items-center justify-between px-6 py-3">
// //         {/* Logo and Brand */}
// //         <Link 
// //           href="/" 
// //           className="flex items-center gap-3 hover:bg-blue-50 rounded-lg p-2 transition-all duration-200 group"
// //         >
// //           <div className="relative w-10 h-10 overflow-hidden rounded-lg shadow-md transition-transform duration-200 group-hover:scale-105">
// //             <Image
// //               src="/plogoTop.jpg"
// //               alt="Logo"
// //               fill
// //               className="object-cover"
// //             />
// //           </div>
// //           <div className="transition-all duration-200 group-hover:translate-x-1">
// //             <h1 className="text-lg font-bold text-gray-800 tracking-tight">Global Admin</h1>
// //             <p className="text-xs text-blue-600 font-medium">Paragon Group</p>
// //           </div>
// //         </Link>
// //         {/* Right Section */}
// //         <div className="flex items-center gap-3">
// //           {/* <WebsiteSelector /> */}

// //           <button className="relative p-2 hover:bg-blue-50 rounded-lg text-gray-500 transition-all duration-200 hover:text-blue-600 hover:scale-105">
// //             <Bell size={20} />
// //             <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
// //           </button>

// //           <Link 
// //             href="/settings" 
// //             className="p-2 hover:bg-blue-50 rounded-lg text-gray-500 transition-all duration-200 hover:text-blue-600 hover:scale-105"
// //           >
// //             <Settings size={20} />
// //           </Link>

// //           <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block" />

// //           <div className="relative">
// //             <button
// //               id="profile-button"
// //               onClick={() => setProfileDropdownOpen(!isProfileDropdownOpen)}
// //               className="flex items-center gap-3 hover:bg-blue-50 p-2 rounded-lg transition-all duration-200 group"
// //             >
// //               <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-md overflow-hidden transition-all duration-200 group-hover:scale-105">
// //                 {isLoading ? (
// //                   <div className="w-full h-full bg-blue-500 flex items-center justify-center">
// //                     <Loader2 size={20} className="animate-spin text-white" />
// //                   </div>
// //                 ) : (
// //                   <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-bold text-base">
// //                     {getInitials()}
// //                   </div>
// //                 )}
// //               </div>
// //               <div className="text-right mr-2 transition-all duration-200 group-hover:translate-x-1">
// //                 {isLoading ? (
// //                   <>
// //                     <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
// //                     <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
// //                   </>
// //                 ) : error ? (
// //                   <>
// //                     <p className="font-medium text-gray-900">User</p>
// //                     <div className="text-xs text-gray-600">{userData?.role || role || 'User'}</div>
// //                   </>
// //                 ) : (
// //                   <>
// //                     <div className="text-sm font-semibold text-gray-800">{`${userData?.firstName} ${userData?.lastName}`}</div>
// //                     <div className="text-xs font-medium text-blue-600">{userData?.role || role || 'User'}</div>
// //                   </>
// //                 )}
// //               </div>
// //               <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 
// //                                    ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
// //             </button>

// //             {isProfileDropdownOpen && (
// //               <div 
// //                 id="profile-dropdown"
// //                 className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border 
// //                         border-gray-100 py-2 z-50 transition-all duration-300 ease-in-out animate-fadeIn"
// //               >
// //                 <div className="px-4 py-3 border-b border-gray-100">
// //                   {isLoading ? (
// //                     <div className="space-y-2">
// //                       <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
// //                       <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
// //                     </div>
// //                   ) : error ? (
// //                     <>
// //                       <p className="font-medium text-gray-900">User</p>
// //                       <div className="text-xs text-gray-600">{userData?.role || role || 'User'}</div>
// //                     </>
// //                   ) : (
// //                     <div className="flex items-start gap-3">
// //                       <div className="w-12 h-12 rounded-lg flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-md">
// //                         {getInitials()}
// //                       </div>
// //                       <div>
// //                         <div className="font-semibold text-gray-900">{`${userData?.firstName} ${userData?.lastName}`}</div>
// //                         <div className="text-sm font-medium text-blue-600">{userData?.role || role || 'User'}</div>
// //                         <div className="text-xs text-gray-500 mt-1">{userData?.email}</div>
// //                       </div>
// //                     </div>
// //                   )}
// //                 </div>
// //                 <div className="py-2">
// //                   <Link 
// //                     href="/admin/settings" 
// //                     className="flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-blue-50 text-gray-700 transition-colors duration-200"
// //                   >
// //                     <User size={16} className="text-gray-500" />
// //                     <span>Profile Settings</span>
// //                   </Link>
// //                   <Link 
// //                     href="/admin/settings" 
// //                     className="flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-blue-50 text-gray-700 transition-colors duration-200"
// //                   >
// //                     <Settings size={16} className="text-gray-500" />
// //                     <span>Preferences</span>
// //                   </Link>
// //                 </div>
// //                 <div className="border-t border-gray-100 pt-2">
// //                   <button 
// //                     onClick={handleLogout}
// //                     className="w-full px-4 py-2.5 text-left hover:bg-red-50 text-red-600 flex items-center gap-2 transition-colors duration-200"
// //                   >
// //                     <LogOut size={16} />
// //                     <span className="font-medium">Sign Out</span>
// //                   </button>
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }





// "use client"

// import Link from 'next/link';
// import { useState, useEffect } from 'react';
// import { User, LogOut, Bell, Settings, ChevronDown, Loader2 } from 'lucide-react';
// import Image from 'next/image';
// import { useAuth } from '@/providers/auth-provider';
// import { useRouter } from 'next/navigation';
// import Cookies from 'js-cookie';
// // import { WebsiteSelector } from './WebsiteSelector';

// interface UserData {
//   id: number;
//   firstName: string;
//   lastName: string;
//   email: string;
//   status: string;
//   roleId: number;
//   role?: string; // Optional role property
// }

// export function Header() {
//   const router = useRouter();
//   const { logout } = useAuth();
//   const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [role, setRole] = useState<string>('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Fetch user data from API
//   useEffect(() => {
//     const fetchUserData = async () => {
//       setIsLoading(true);
//       setError(null);
      
//       try {
//         const token = Cookies.get("token");
        
//         if (!token) {
//           console.log("No authentication token found");
//           setIsLoading(false);
//           setError("Authentication token not found");
//           return;
//         }
        
//         // Check if we already have user ID in localStorage (set during login)
//         const storedUserId = localStorage.getItem('userId');
//         const storedUserEmail = localStorage.getItem('userEmail') || localStorage.getItem('rememberedEmail');
        
//         if (storedUserId) {
//           console.log("Using stored user ID:", storedUserId);
//           // If we have user ID, fetch specific user
//           await fetchSpecificUser(storedUserId, token);
//           return;
//         }
        
//         // Fetch all users data as fallback
//         const response = await fetch("http://localhost:7000/api/v1/user/all", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
        
//         if (!response.ok) {
//           console.warn(`Failed to fetch user data: ${response.status}`);
//           setIsLoading(false);
//           setError(`Failed to fetch user data: ${response.status}`);
//           return;
//         }
        
//         const data = await response.json();
        
//         if (data.status === "success" && data.users && data.users.length > 0) {
//           // Try to find the current user by email
//           let currentUser = null;
          
//           if (storedUserEmail) {
//             console.log("Looking for user with email:", storedUserEmail);
//             // Find user by email
//             currentUser = data.users.find(user => user.email && user.email.toLowerCase() === storedUserEmail.toLowerCase());
            
//             if (currentUser) {
//               console.log("Found user by email:", currentUser.email);
//             } else {
//               console.log("User with email not found in users list");
//             }
//           }
          
//           // If we couldn't find by email, look at the token to see if it has user info
//           if (!currentUser) {
//             try {
//               // Some JWT tokens include user info in the payload
//               const tokenParts = token.split('.');
//               if (tokenParts.length === 3) {
//                 const payload = JSON.parse(atob(tokenParts[1]));
//                 console.log("Token payload:", payload);
                
//                 // If token has userId or sub field
//                 if (payload.userId || payload.sub) {
//                   const tokenUserId = payload.userId || payload.sub;
//                   currentUser = data.users.find(user => user.id.toString() === tokenUserId.toString());
                  
//                   if (currentUser) {
//                     console.log("Found user by token ID:", currentUser.id);
//                   }
//                 }
//               }
//             } catch (e) {
//               console.error("Error parsing token:", e);
//             }
//           }
          
//           // If still no match, use first user as fallback
//           if (!currentUser) {
//             console.warn("Could not identify current user, using first user as fallback");
            
//             // Log all users for debugging
//             console.log("Available users:", data.users.map(u => ({ 
//               id: u.id, 
//               email: u.email,
//               roleId: u.roleId,
//               role: u.role
//             })));
            
//             currentUser = data.users[0];
//           }
          
//           // Store the selected user in component state
//           setUserData(currentUser);
          
//           // Also store in localStorage for future use
//           localStorage.setItem('userId', currentUser.id);
//           localStorage.setItem('userEmail', currentUser.email);
//           localStorage.setItem('userRoleId', currentUser.roleId);
          
//           // Determine and store role
//           let roleName = currentUser.role;
//           if (!roleName) {
//             // Derive role name from roleId
//             switch(currentUser.roleId) {
//               case 1:
//                 roleName = "Super Admin";
//                 break;
//               case 2:
//                 roleName = "Admin";
//                 break;
//               case 3:
//                 roleName = "User";
//                 break;
//               default:
//                 roleName = "User";
//             }
//           }
          
//           localStorage.setItem('userRole', roleName);
//           setRole(roleName);
          
//           console.log('Stored in localStorage:', {
//             userId: currentUser.id,
//             userEmail: currentUser.email,
//             userRole: roleName,
//             userRoleId: currentUser.roleId
//           });
//         } else {
//           setError("No user data found");
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//         setError("Failed to fetch user data");
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     // Function to fetch a specific user by ID
//     const fetchSpecificUser = async (userId, token) => {
//       try {
//         const response = await fetch(`http://localhost:7000/api/v1/user/${userId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
        
//         if (!response.ok) {
//           console.warn(`Failed to fetch specific user: ${response.status}`);
//           throw new Error(`Failed to fetch specific user: ${response.status}`);
//         }
        
//         const data = await response.json();
        
//         if (data.status === "success" && data.user) {
//           console.log("Successfully fetched specific user:", data.user.id);
//           setUserData(data.user);
          
//           // Determine and set role
//           let roleName = data.user.role;
//           if (!roleName) {
//             // Derive role name from roleId
//             switch(data.user.roleId) {
//               case 1:
//                 roleName = "Super Admin";
//                 break;
//               case 2:
//                 roleName = "Admin";
//                 break;
//               case 3:
//                 roleName = "User";
//                 break;
//               default:
//                 roleName = "User";
//             }
//           }
          
//           setRole(roleName);
          
//           // Make sure localStorage is consistent
//           localStorage.setItem('userId', data.user.id);
//           localStorage.setItem('userEmail', data.user.email);
//           localStorage.setItem('userRoleId', data.user.roleId);
//           localStorage.setItem('userRole', roleName);
          
//           return true;
//         } else {
//           throw new Error("User data not found in response");
//         }
//       } catch (error) {
//         console.error("Error fetching specific user:", error);
//         throw error;
//       }
//     };
    
//     fetchUserData();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       Cookies.remove('token');
      
//       // Clear all user-related data
//       localStorage.removeItem('userId');
//       localStorage.removeItem('userEmail');
//       localStorage.removeItem('userRole');
//       localStorage.removeItem('userRoleId');
//       localStorage.removeItem('rememberedEmail');
//       localStorage.removeItem('accessToken');
      
//       logout();
//       setProfileDropdownOpen(false);
//       router.push('/login');
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   // Handle click outside of dropdown to close it
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       const dropdown = document.getElementById('profile-dropdown');
//       const button = document.getElementById('profile-button');
      
//       if (
//         dropdown && 
//         button && 
//         !dropdown.contains(event.target as Node) && 
//         !button.contains(event.target as Node)
//       ) {
//         setProfileDropdownOpen(false);
//       }
//     };
    
//     document.addEventListener('mousedown', handleClickOutside);
    
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   // Get initials for avatar
//   const getInitials = () => {
//     if (!userData) return 'U';
//     return `${userData.firstName?.charAt(0) || ''}${userData.lastName?.charAt(0) || ''}`;
//   };

//   return (
//     <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 shadow-sm z-50 backdrop-blur-sm bg-white/95">
//       <div className="max-w-[1920px] mx-auto flex items-center justify-between px-6 py-3">
//         {/* Logo and Brand */}
//         <Link 
//           href="/" 
//           className="flex items-center gap-3 hover:bg-blue-50 rounded-lg p-2 transition-all duration-200 group"
//         >
//           <div className="relative w-10 h-10 overflow-hidden rounded-lg shadow-md transition-transform duration-200 group-hover:scale-105">
//             <Image
//               src="/plogoTop.jpg"
//               alt="Logo"
//               fill
//               className="object-cover"
//             />
//           </div>
//           <div className="transition-all duration-200 group-hover:translate-x-1">
//             <h1 className="text-lg font-bold text-gray-800 tracking-tight">Global Admin</h1>
//             <p className="text-xs text-blue-600 font-medium">Paragon Group</p>
//           </div>
//         </Link>
//         {/* Right Section */}
//         <div className="flex items-center gap-3">
//           {/* <WebsiteSelector /> */}

//           <button className="relative p-2 hover:bg-blue-50 rounded-lg text-gray-500 transition-all duration-200 hover:text-blue-600 hover:scale-105">
//             <Bell size={20} />
//             <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
//           </button>

//           <Link 
//             href="/settings" 
//             className="p-2 hover:bg-blue-50 rounded-lg text-gray-500 transition-all duration-200 hover:text-blue-600 hover:scale-105"
//           >
//             <Settings size={20} />
//           </Link>

//           <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block" />

//           <div className="relative">
//             <button
//               id="profile-button"
//               onClick={() => setProfileDropdownOpen(!isProfileDropdownOpen)}
//               className="flex items-center gap-3 hover:bg-blue-50 p-2 rounded-lg transition-all duration-200 group"
//             >
//               <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-md overflow-hidden transition-all duration-200 group-hover:scale-105">
//                 {isLoading ? (
//                   <div className="w-full h-full bg-blue-500 flex items-center justify-center">
//                     <Loader2 size={20} className="animate-spin text-white" />
//                   </div>
//                 ) : (
//                   <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-bold text-base">
//                     {getInitials()}
//                   </div>
//                 )}
//               </div>
//               <div className="text-right mr-2 transition-all duration-200 group-hover:translate-x-1">
//                 {isLoading ? (
//                   <>
//                     <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
//                     <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
//                   </>
//                 ) : error ? (
//                   <>
//                     <p className="font-medium text-gray-900">User</p>
//                     <div className="text-xs text-gray-600">{userData?.role || role || 'User'}</div>
//                   </>
//                 ) : (
//                   <>
//                     <div className="text-sm font-semibold text-gray-800">{`${userData?.firstName} ${userData?.lastName}`}</div>
//                     <div className="text-xs font-medium text-blue-600">{userData?.role || role || 'User'}</div>
//                   </>
//                 )}
//               </div>
//               <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 
//                                    ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
//             </button>

//             {isProfileDropdownOpen && (
//               <div 
//                 id="profile-dropdown"
//                 className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border 
//                         border-gray-100 py-2 z-50 transition-all duration-300 ease-in-out animate-fadeIn"
//               >
//                 <div className="px-4 py-3 border-b border-gray-100">
//                   {isLoading ? (
//                     <div className="space-y-2">
//                       <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
//                       <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
//                     </div>
//                   ) : error ? (
//                     <>
//                       <p className="font-medium text-gray-900">User</p>
//                       <div className="text-xs text-gray-600">{userData?.role || role || 'User'}</div>
//                     </>
//                   ) : (
//                     <div className="flex items-start gap-3">
//                       <div className="w-12 h-12 rounded-lg flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-md">
//                         {getInitials()}
//                       </div>
//                       <div>
//                         <div className="font-semibold text-gray-900">{`${userData?.firstName} ${userData?.lastName}`}</div>
//                         <div className="text-sm font-medium text-blue-600">{userData?.role || role || 'User'}</div>
//                         <div className="text-xs text-gray-500 mt-1">{userData?.email}</div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//                 <div className="py-2">
//                   <Link 
//                     href="/admin/settings" 
//                     className="flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-blue-50 text-gray-700 transition-colors duration-200"
//                   >
//                     <User size={16} className="text-gray-500" />
//                     <span>Profile Settings</span>
//                   </Link>
//                   <Link 
//                     href="/admin/settings" 
//                     className="flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-blue-50 text-gray-700 transition-colors duration-200"
//                   >
//                     <Settings size={16} className="text-gray-500" />
//                     <span>Preferences</span>
//                   </Link>
//                 </div>
//                 <div className="border-t border-gray-100 pt-2">
//                   <button 
//                     onClick={handleLogout}
//                     className="w-full px-4 py-2.5 text-left hover:bg-red-50 text-red-600 flex items-center gap-2 transition-colors duration-200"
//                   >
//                     <LogOut size={16} />
//                     <span className="font-medium">Sign Out</span>
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





// "use client"

// import Link from 'next/link';
// import { useState, useEffect } from 'react';
// import { User, LogOut, Bell, Settings, ChevronDown, Loader2 } from 'lucide-react';
// import Image from 'next/image';
// import { useAuth } from '@/providers/auth-provider';
// import { useRouter } from 'next/navigation';
// import Cookies from 'js-cookie';
// // import { WebsiteSelector } from './WebsiteSelector';

// interface UserData {
//   id: number;
//   firstName: string;
//   lastName: string;
//   email: string;
//   status: string;
//   roleId: number;
//   role?: string; // Optional role property
// }

// export function Header() {
//   const router = useRouter();
//   const { logout } = useAuth();
//   const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [role, setRole] = useState<string>('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Fetch user profile data
//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       setIsLoading(true);
//       setError(null);
      
//       try {
//         const token = Cookies.get("token");
        
//         if (!token) {
//           console.log("No authentication token found");
//           setIsLoading(false);
//           setError("Authentication token not found");
//           return;
//         }
        
//         // Fetch user profile
//         const response = await fetch("http://localhost:7000/api/v1/user/profile", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
        
//         if (!response.ok) {
//           console.warn(`Failed to fetch user profile: ${response.status}`);
//           setIsLoading(false);
//           setError(`Failed to fetch user profile: ${response.status}`);
//           return;
//         }
        
//         const data = await response.json();
        
//         if (data.status === "success" && data.user) {
//           console.log("Successfully fetched user profile:", data.user);
//           setUserData(data.user);
          
//           // Determine role name if not provided
//           let roleName = data.user.role;
//           if (!roleName) {
//             // Derive role name from roleId
//             switch(data.user.roleId) {
//               case 1:
//                 roleName = "Super Admin";
//                 break;
//               case 2:
//                 roleName = "Admin";
//                 break;
//               case 3:
//                 roleName = "User";
//                 break;
//               default:
//                 roleName = "User";
//             }
//           }
          
//           setRole(roleName);
          
//           // Store user data in localStorage for potential use elsewhere
//           localStorage.setItem('userId', data.user.id);
//           localStorage.setItem('userEmail', data.user.email);
//           localStorage.setItem('userRoleId', data.user.roleId);
//           localStorage.setItem('userRole', roleName);
          
//           console.log('User profile data processed:', {
//             userId: data.user.id,
//             email: data.user.email,
//             role: roleName
//           });
//         } else {
//           setError("No user data found in profile response");
//         }
//       } catch (error) {
//         console.error("Error fetching user profile:", error);
//         setError("Failed to fetch user profile");
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     fetchUserProfile();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       Cookies.remove('token');
      
//       // Clear all user-related data
//       localStorage.removeItem('userId');
//       localStorage.removeItem('userEmail');
//       localStorage.removeItem('userRole');
//       localStorage.removeItem('userRoleId');
//       localStorage.removeItem('rememberedEmail');
//       localStorage.removeItem('accessToken');
      
//       logout();
//       setProfileDropdownOpen(false);
//       router.push('/login');
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   // Handle click outside of dropdown to close it
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       const dropdown = document.getElementById('profile-dropdown');
//       const button = document.getElementById('profile-button');
      
//       if (
//         dropdown && 
//         button && 
//         !dropdown.contains(event.target as Node) && 
//         !button.contains(event.target as Node)
//       ) {
//         setProfileDropdownOpen(false);
//       }
//     };
    
//     document.addEventListener('mousedown', handleClickOutside);
    
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   // Get initials for avatar
//   const getInitials = () => {
//     if (!userData) return 'U';
//     return `${userData.firstName?.charAt(0) || ''}${userData.lastName?.charAt(0) || ''}`;
//   };

//   return (
//     <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 shadow-sm z-50 backdrop-blur-sm bg-white/95">
//       <div className="max-w-[1920px] mx-auto flex items-center justify-between px-6 py-3">
//         {/* Logo and Brand */}
//         <Link 
//           href="/" 
//           className="flex items-center gap-3 hover:bg-blue-50 rounded-lg p-2 transition-all duration-200 group"
//         >
//           <div className="relative w-10 h-10 overflow-hidden rounded-lg shadow-md transition-transform duration-200 group-hover:scale-105">
//             <Image
//               src="/plogoTop.jpg"
//               alt="Logo"
//               fill
//               className="object-cover"
//             />
//           </div>
//           <div className="transition-all duration-200 group-hover:translate-x-1">
//             <h1 className="text-lg font-bold text-gray-800 tracking-tight">Global Admin</h1>
//             <p className="text-xs text-blue-600 font-medium">Paragon Group</p>
//           </div>
//         </Link>
//         {/* Right Section */}
//         <div className="flex items-center gap-3">
//           {/* <WebsiteSelector /> */}

//           <button className="relative p-2 hover:bg-blue-50 rounded-lg text-gray-500 transition-all duration-200 hover:text-blue-600 hover:scale-105">
//             <Bell size={20} />
//             <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
//           </button>

//           <Link 
//             href="/settings" 
//             className="p-2 hover:bg-blue-50 rounded-lg text-gray-500 transition-all duration-200 hover:text-blue-600 hover:scale-105"
//           >
//             <Settings size={20} />
//           </Link>

//           <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block" />

//           <div className="relative">
//             <button
//               id="profile-button"
//               onClick={() => setProfileDropdownOpen(!isProfileDropdownOpen)}
//               className="flex items-center gap-3 hover:bg-blue-50 p-2 rounded-lg transition-all duration-200 group"
//             >
//               <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-md overflow-hidden transition-all duration-200 group-hover:scale-105">
//                 {isLoading ? (
//                   <div className="w-full h-full bg-blue-500 flex items-center justify-center">
//                     <Loader2 size={20} className="animate-spin text-white" />
//                   </div>
//                 ) : (
//                   <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-bold text-base">
//                     {getInitials()}
//                   </div>
//                 )}
//               </div>
//               <div className="text-right mr-2 transition-all duration-200 group-hover:translate-x-1">
//                 {isLoading ? (
//                   <>
//                     <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
//                     <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
//                   </>
//                 ) : error ? (
//                   <>
//                     <p className="font-medium text-gray-900">User</p>
//                     <div className="text-xs text-gray-600">{userData?.role || role || 'User'}</div>
//                   </>
//                 ) : (
//                   <>
//                     <div className="text-sm font-semibold text-gray-800">{`${userData?.firstName || 'User'} ${userData?.lastName || ''}`}</div>
//                     <div className="text-xs font-medium text-blue-600">{userData?.role || role || 'User'}</div>
//                   </>
//                 )}
//               </div>
//               <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 
//                                    ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
//             </button>

//             {isProfileDropdownOpen && (
//               <div 
//                 id="profile-dropdown"
//                 className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border 
//                         border-gray-100 py-2 z-50 transition-all duration-300 ease-in-out animate-fadeIn"
//               >
//                 <div className="px-4 py-3 border-b border-gray-100">
//                   {isLoading ? (
//                     <div className="space-y-2">
//                       <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
//                       <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
//                     </div>
//                   ) : error ? (
//                     <>
//                       <p className="font-medium text-gray-900">User</p>
//                       <div className="text-xs text-gray-600">{userData?.role || role || 'User'}</div>
//                     </>
//                   ) : (
//                     <div className="flex items-start gap-3">
//                       <div className="w-12 h-12 rounded-lg flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-md">
//                         {getInitials()}
//                       </div>
//                       <div>
//                         <div className="font-semibold text-gray-900">{`${userData?.firstName || 'User'} ${userData?.lastName || ''}`}</div>
//                         <div className="text-sm font-medium text-blue-600">{userData?.role || role || 'User'}</div>
//                         <div className="text-xs text-gray-500 mt-1">{userData?.email || 'No email available'}</div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//                 <div className="py-2">
//                   <Link 
//                     href="/admin/settings" 
//                     className="flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-blue-50 text-gray-700 transition-colors duration-200"
//                   >
//                     <User size={16} className="text-gray-500" />
//                     <span>Profile Settings</span>
//                   </Link>
//                   <Link 
//                     href="/admin/settings" 
//                     className="flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-blue-50 text-gray-700 transition-colors duration-200"
//                   >
//                     <Settings size={16} className="text-gray-500" />
//                     <span>Preferences</span>
//                   </Link>
//                 </div>
//                 <div className="border-t border-gray-100 pt-2">
//                   <button 
//                     onClick={handleLogout}
//                     className="w-full px-4 py-2.5 text-left hover:bg-red-50 text-red-600 flex items-center gap-2 transition-colors duration-200"
//                   >
//                     <LogOut size={16} />
//                     <span className="font-medium">Sign Out</span>
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




"use client"

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { User, LogOut, Bell, Settings, ChevronDown, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  roleId: number;
  role?: string;
}

export function Header() {
  const router = useRouter();
  const { logout } = useAuth();
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Static user data since API has been removed
  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    
    // Set static user data after a brief delay to simulate loading
    const timer = setTimeout(() => {
      const staticUserData = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        role: "Administrator",
        status: "active"
      };
      
      setUserData(staticUserData);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    try {
      Cookies.remove('token');
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('accessToken');
      logout();
      setProfileDropdownOpen(false);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Handle click outside of dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('profile-dropdown');
      const button = document.getElementById('profile-button');
      
      if (
        dropdown && 
        button && 
        !dropdown.contains(event.target as Node) && 
        !button.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get initials for avatar
  const getInitials = () => {
    if (!userData) return 'U';
    return `${userData.firstName?.charAt(0) || ''}${userData.lastName?.charAt(0) || ''}`;
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 shadow-sm z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo and Brand */}
        <Link 
          href="/" 
          className="flex items-center gap-3 hover:bg-blue-50 rounded-lg p-2 transition-all duration-200 group"
        >
          <div className="relative w-10 h-10 overflow-hidden rounded-lg shadow-md transition-transform duration-200 group-hover:scale-105">
            <Image
              src="/plogoTop.jpg"
              alt="Logo"
              fill
              className="object-cover"
            />
          </div>
          <div className="transition-all duration-200 group-hover:translate-x-1">
            <h1 className="text-lg font-bold text-gray-800 tracking-tight">Global Admin</h1>
            <p className="text-xs text-blue-600 font-medium">Paragon Group</p>
          </div>
        </Link>
        {/* Right Section */}
        <div className="flex items-center gap-3">
          <button className="relative p-2 hover:bg-blue-50 rounded-lg text-gray-500 transition-all duration-200 hover:text-blue-600 hover:scale-105">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>

          <Link 
            href="/settings" 
            className="p-2 hover:bg-blue-50 rounded-lg text-gray-500 transition-all duration-200 hover:text-blue-600 hover:scale-105"
          >
            <Settings size={20} />
          </Link>

          <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block" />

          <div className="relative">
            <button
              id="profile-button"
              onClick={() => setProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-3 hover:bg-blue-50 p-2 rounded-lg transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-md overflow-hidden transition-all duration-200 group-hover:scale-105">
                {isLoading ? (
                  <div className="w-full h-full bg-blue-500 flex items-center justify-center">
                    <Loader2 size={20} className="animate-spin text-white" />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-bold text-base">
                    {getInitials()}
                  </div>
                )}
              </div>
              <div className="text-right mr-2 transition-all duration-200 group-hover:translate-x-1">
                {isLoading ? (
                  <>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </>
                ) : error ? (
                  <>
                    <p className="font-medium text-gray-900">User</p>
                    <div className="text-xs text-gray-600">User</div>
                  </>
                ) : (
                  <>
                    <div className="text-sm font-semibold text-gray-800">{`${userData?.firstName} ${userData?.lastName}`}</div>
                    <div className="text-xs font-medium text-blue-600">{userData?.role || 'User'}</div>
                  </>
                )}
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 
                                   ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProfileDropdownOpen && (
              <div 
                id="profile-dropdown"
                className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border 
                        border-gray-100 py-2 z-50 transition-all duration-300 ease-in-out animate-fadeIn"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  {isLoading ? (
                    <div className="space-y-2">
                      <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ) : error ? (
                    <>
                      <p className="font-medium text-gray-900">User</p>
                      <div className="text-xs text-gray-600">User</div>
                    </>
                  ) : (
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {getInitials()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{`${userData?.firstName} ${userData?.lastName}`}</div>
                        <div className="text-sm font-medium text-blue-600">{userData?.role || 'User'}</div>
                        <div className="text-xs text-gray-500 mt-1">{userData?.email}</div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="py-2">
                  <Link 
                    href="/admin/settings" 
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-blue-50 text-gray-700 transition-colors duration-200"
                  >
                    <User size={16} className="text-gray-500" />
                    <span>Profile Settings</span>
                  </Link>
                  <Link 
                    href="/admin/settings" 
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-blue-50 text-gray-700 transition-colors duration-200"
                  >
                    <Settings size={16} className="text-gray-500" />
                    <span>Preferences</span>
                  </Link>
                </div>
                <div className="border-t border-gray-100 pt-2">
                  <button 
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left hover:bg-red-50 text-red-600 flex items-center gap-2 transition-colors duration-200"
                  >
                    <LogOut size={16} />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}