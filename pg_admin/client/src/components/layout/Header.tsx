
// "use client"

// import Link from 'next/link';
// import { useState, useEffect, useRef } from 'react';
// import { User, LogOut, Bell, Settings, ChevronDown, Loader2, HelpCircle, MessageSquare, Sun, Moon, Camera, Upload } from 'lucide-react';
// import Image from 'next/image';
// import { useAuth } from '@/providers/auth-provider';
// import { useRouter } from 'next/navigation';
// import Cookies from 'js-cookie';

// interface UserData {
//   id: number;
//   firstName: string;
//   lastName: string;
//   email: string;
//   status?: string;
//   roleId?: number;
//   role?: string;
//   profileImage?: string;
// }

// export function Header() {
//   const router = useRouter();
//   const { logout } = useAuth();
//   const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
//   const [isNotificationsOpen, setNotificationsOpen] = useState(false);
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Fetch user data from API
//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       setIsLoading(true);
//       try {
//         const response = await fetch('http://localhost:7000/api/v1/user/profile', {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('accessToken') || Cookies.get('token')}`,
//             'Content-Type': 'application/json'
//           }
//         });
        
//         if (!response.ok) {
//           throw new Error('Failed to fetch user profile');
//         }
        
//         const data = await response.json();
        
//         if (data.status === 'success' && data.user) {
//           setUserData(data.user);
//         } else {
//           throw new Error(data.message || 'Failed to retrieve user data');
//         }
//       } catch (err) {
//         console.error('Error fetching user profile:', err);
//         setError(err instanceof Error ? err.message : 'An unknown error occurred');
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     fetchUserProfile();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       Cookies.remove('token');
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
//       const notifDropdown = document.getElementById('notification-dropdown');
//       const notifButton = document.getElementById('notification-button');
      
//       if (
//         dropdown && 
//         button && 
//         !dropdown.contains(event.target as Node) && 
//         !button.contains(event.target as Node)
//       ) {
//         setProfileDropdownOpen(false);
//       }
      
//       if (
//         notifDropdown && 
//         notifButton && 
//         !notifDropdown.contains(event.target as Node) && 
//         !notifButton.contains(event.target as Node)
//       ) {
//         setNotificationsOpen(false);
//       }
//     };
    
//     document.addEventListener('mousedown', handleClickOutside);
    
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   // Toggle dark mode
//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//     // Here you would typically update a theme context or localStorage setting
//   };

//   // Get initials for avatar
//   const getInitials = () => {
//     if (!userData) return 'U';
//     return `${userData.firstName?.charAt(0) || ''}${userData.lastName?.charAt(0) || ''}`;
//   };

//   // Handle file input change
//   const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     if (!files || files.length === 0) return;
    
//     const file = files[0];
    
//     // Check file type
//     if (!file.type.startsWith('image/')) {
//       alert('Please select an image file');
//       return;
//     }
    
//     // Check file size (limit to 5MB)
//     if (file.size > 5 * 1024 * 1024) {
//       alert('File size should not exceed 5MB');
//       return;
//     }
    
//     try {
//       setIsUploading(true);
      
//       // Create FormData
//       const formData = new FormData();
//       formData.append('profileImage', file);
      
//       // Send to server
//       const response = await fetch('http://localhost:7000/api/v1/user/upload-profile-image', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('accessToken') || Cookies.get('token')}`,
//         },
//         body: formData
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to upload image');
//       }
      
//       const data = await response.json();
      
//       if (data.status === 'success' && data.user) {
//         // Update local state with new image URL
//         setUserData({
//           ...userData!,
//           profileImage: data.user.profileImage
//         });
        
//         alert('Profile image updated successfully!');
//       } else {
//         throw new Error(data.message || 'Failed to update profile image');
//       }
//     } catch (err) {
//       console.error('Error uploading profile image:', err);
//       alert(err instanceof Error ? err.message : 'An unknown error occurred during upload');
//     } finally {
//       setIsUploading(false);
//       // Reset file input
//       if (fileInputRef.current) {
//         fileInputRef.current.value = '';
//       }
//     }
//   };

//   // Trigger file input click
//   const handleUploadClick = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   // Notification data
//   const notifications = [
//     {
//       id: 1,
//       title: "New user registered",
//       message: "John Doe has registered as a new user",
//       time: "5 minutes ago",
//       isRead: false,
//       type: "user"
//     },
//     {
//       id: 2,
//       title: "System update",
//       message: "System will be updated tonight at 2:00 AM",
//       time: "1 hour ago",
//       isRead: true,
//       type: "system"
//     },
//     {
//       id: 3,
//       title: "New content published",
//       message: "New content has been published to Parasole",
//       time: "Yesterday",
//       isRead: false,
//       type: "content"
//     }
//   ];

//   return (
//     <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-indigo-50 via-white to-violet-50 border-b border-indigo-100 shadow-md z-50">
//       <div className="max-w-[1920px] mx-auto flex items-center justify-between px-6 py-2">
//         <style jsx global>{`
//           @keyframes slideDown {
//             from {
//               opacity: 0;
//               transform: translateY(-10px) scale(0.98);
//             }
//             to {
//               opacity: 1;
//               transform: translateY(0) scale(1);
//             }
//           }
          
//           .animate-slideDown {
//             animation: slideDown 0.25s ease-out forwards;
//           }
//         `}</style>
        
//         {/* Logo and Brand */}
//         <Link 
//           href="/" 
//           className="flex items-center gap-3 hover:bg-indigo-50 rounded-lg p-2 transition-all duration-200 group"
//         >
//           <div className="relative w-10 h-10 overflow-hidden rounded-lg shadow-lg transition-transform duration-200 group-hover:scale-105 ring-2 ring-indigo-100">
//             <Image
//               src="/plogoTop.jpg"
//               alt="Logo"
//               fill
//               className="object-cover"
//             />
//           </div>
//           <div className="transition-all duration-200 group-hover:translate-x-1">
//             <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-transparent tracking-tight">Global Admin</h1>
//             <p className="text-xs text-indigo-600 font-medium">Paragon Group</p>
//           </div>
//         </Link>

//         {/* Empty Center Section */}
//         <div className="flex-1"></div>

//         {/* Right Section */}
//         <div className="flex items-center gap-2">
//           <button 
//             onClick={toggleDarkMode}
//             className="relative p-2 hover:bg-indigo-50 rounded-lg text-indigo-500 transition-all duration-200 hover:text-indigo-700"
//           >
//             {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
//           </button>

//           <button className="relative p-2 hover:bg-indigo-50 rounded-lg text-indigo-500 transition-all duration-200 hover:text-indigo-700">
//             <HelpCircle size={20} />
//           </button>

//           <button className="relative p-2 hover:bg-indigo-50 rounded-lg text-indigo-500 transition-all duration-200 hover:text-indigo-700">
//             <MessageSquare size={20} />
//           </button>

//           {/* Notifications */}
//           <div className="relative">
//             <button 
//               id="notification-button"
//               onClick={() => setNotificationsOpen(!isNotificationsOpen)}
//               className="relative p-2 hover:bg-indigo-50 rounded-lg text-indigo-500 transition-all duration-200 hover:text-indigo-700"
//             >
//               <Bell size={20} />
//               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
//             </button>

//             {isNotificationsOpen && (
//               <div 
//                 id="notification-dropdown"
//                 className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-indigo-100 py-2 z-50 animate-slideDown origin-top-right"
//               >
//                 <div className="px-4 py-2 border-b border-indigo-50 flex justify-between items-center">
//                   <h3 className="font-semibold text-indigo-800">Notifications</h3>
//                   <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
//                     Mark all as read
//                   </button>
//                 </div>
                
//                 <div className="max-h-72 overflow-y-auto">
//                   {notifications.map((notification) => (
//                     <div 
//                       key={notification.id}
//                       className={`px-4 py-3 border-b border-indigo-50 hover:bg-indigo-50/50 transition-colors duration-200 ${notification.isRead ? 'opacity-70' : ''}`}
//                     >
//                       <div className="flex items-start gap-3">
//                         <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
//                           notification.type === 'user' 
//                             ? 'bg-indigo-100 text-indigo-600' 
//                             : notification.type === 'system' 
//                             ? 'bg-amber-100 text-amber-600'
//                             : 'bg-emerald-100 text-emerald-600'
//                         }`}>
//                           {notification.type === 'user' && <User size={14} />}
//                           {notification.type === 'system' && <Settings size={14} />}
//                           {notification.type === 'content' && <MessageSquare size={14} />}
//                         </div>
//                         <div>
//                           <div className="flex items-center justify-between">
//                             <h4 className="font-medium text-gray-800 text-sm">{notification.title}</h4>
//                             {!notification.isRead && (
//                               <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
//                             )}
//                           </div>
//                           <p className="text-xs text-gray-600 mt-0.5">{notification.message}</p>
//                           <span className="text-xs text-indigo-500 mt-1 block">{notification.time}</span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
                
//                 <div className="px-4 py-2 border-t border-indigo-50 text-center">
//                   <Link 
//                     href="/notifications"
//                     className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
//                   >
//                     View all notifications
//                   </Link>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="h-8 w-px bg-indigo-100 mx-1 hidden sm:block" />

//           {/* User Profile */}
//           <div className="relative">
//             <button
//               id="profile-button"
//               onClick={() => setProfileDropdownOpen(!isProfileDropdownOpen)}
//               className="flex items-center gap-3 hover:bg-indigo-50 p-2 rounded-lg transition-all duration-200 group"
//             >
//               <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md overflow-hidden transition-all duration-200 group-hover:scale-105 relative">
//                 {isLoading ? (
//                   <div className="w-full h-full bg-indigo-400 flex items-center justify-center">
//                     <Loader2 size={20} className="animate-spin text-white" />
//                   </div>
//                 ) : isUploading ? (
//                   <div className="w-full h-full bg-indigo-400 flex items-center justify-center">
//                     <Loader2 size={20} className="animate-spin text-white" />
//                   </div>
//                 ) : userData?.profileImage ? (
//                   <Image
//                     src={userData.profileImage}
//                     alt="Profile"
//                     fill
//                     className="object-cover"
//                   />
//                 ) : (
//                   <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center font-bold text-base">
//                     {getInitials()}
//                   </div>
//                 )}
//               </div>
//               <div className="text-right mr-1 transition-all duration-200 group-hover:translate-x-1">
//                 {isLoading ? (
//                   <>
//                     <div className="h-4 w-16 bg-indigo-100 rounded animate-pulse mb-1"></div>
//                     <div className="h-3 w-20 bg-indigo-100 rounded animate-pulse"></div>
//                   </>
//                 ) : error ? (
//                   <>
//                     <p className="font-medium text-gray-900">User</p>
//                     <div className="text-xs text-gray-600">User</div>
//                   </>
//                 ) : (
//                   <>
//                     <div className="text-sm font-semibold text-gray-800">{`${userData?.firstName} ${userData?.lastName}`}</div>
//                     <div className="text-xs font-medium bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">{userData?.role || 'User'}</div>
//                   </>
//                 )}
//               </div>
//               <ChevronDown className={`w-4 h-4 text-indigo-400 transition-transform duration-300 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
//             </button>

//             {isProfileDropdownOpen && (
//               <div 
//                 id="profile-dropdown"
//                 className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-indigo-100 py-2 z-50 animate-slideDown origin-top-right"
//               >
//                 <div className="px-4 py-3 border-b border-indigo-50">
//                   {isLoading ? (
//                     <div className="space-y-2">
//                       <div className="h-5 w-32 bg-indigo-100 rounded animate-pulse"></div>
//                       <div className="h-4 w-40 bg-indigo-100 rounded animate-pulse"></div>
//                     </div>
//                   ) : error ? (
//                     <>
//                       <p className="font-medium text-gray-900">User</p>
//                       <div className="text-xs text-gray-600">User</div>
//                     </>
//                   ) : (
//                     <div className="flex items-start gap-3">
//                       <div className="relative w-12 h-12 rounded-xl flex-shrink-0 shadow-md overflow-hidden group/avatar">
//                         {isUploading ? (
//                           <div className="w-full h-full bg-indigo-400 flex items-center justify-center">
//                             <Loader2 size={20} className="animate-spin text-white" />
//                           </div>
//                         ) : userData?.profileImage ? (
//                           <>
//                             <Image
//                               src={userData.profileImage}
//                               alt="Profile"
//                               fill
//                               className="object-cover"
//                             />
//                             <div 
//                               className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
//                               onClick={handleUploadClick}
//                             >
//                               <Camera size={16} className="text-white" />
//                             </div>
//                           </>
//                         ) : (
//                           <>
//                             <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-lg">
//                               {getInitials()}
//                             </div>
//                             <div 
//                               className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
//                               onClick={handleUploadClick}
//                             >
//                               <Camera size={16} className="text-white" />
//                             </div>
//                           </>
//                         )}
//                       </div>
//                       <div>
//                         <div className="font-semibold text-gray-900">{`${userData?.firstName} ${userData?.lastName}`}</div>
//                         <div className="text-sm font-medium text-indigo-600">{userData?.role || 'User'}</div>
//                         <div className="text-xs text-gray-500 mt-1">{userData?.email}</div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="py-2">
//                   <div 
//                     className="flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-indigo-50 text-gray-700 transition-colors duration-200 cursor-pointer"
//                     onClick={handleUploadClick}
//                   >
//                     <Upload size={16} className="text-indigo-500" />
//                     <span>Upload Profile Picture</span>
//                   </div>
                  
//                   <Link 
//                     href="/admin/settings" 
//                     className="flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-indigo-50 text-gray-700 transition-colors duration-200"
//                   >
//                     <User size={16} className="text-indigo-500" />
//                     <span>Profile Settings</span>
//                   </Link>
//                   <Link 
//                     href="/admin/settings" 
//                     className="flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-indigo-50 text-gray-700 transition-colors duration-200"
//                   >
//                     <Settings size={16} className="text-indigo-500" />
//                     <span>Preferences</span>
//                   </Link>
//                 </div>
//                 <div className="border-t border-indigo-50 pt-2">
//                   <button 
//                     onClick={handleLogout}
//                     className="w-full px-4 py-2.5 text-left hover:bg-rose-50 text-rose-600 flex items-center gap-2 transition-colors duration-200"
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
      
//       {/* Hidden file input */}
//       <input 
//         type="file" 
//         ref={fileInputRef}
//         onChange={handleFileChange}
//         accept="image/*"
//         className="hidden"
//       />
//     </div>
//   );
// }





"use client"

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { User, LogOut, Bell, Settings, ChevronDown, Loader2, HelpCircle, MessageSquare, Sun, Moon, Camera, Upload } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status?: string;
  roleId?: number;
  role?: string;
  profileImage?: string;
}

export function Header() {
  const router = useRouter();
  const { logout } = useAuth();
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize dark mode from localStorage on component mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Fetch user data from API
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:7000/api/v1/user/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken') || Cookies.get('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        
        const data = await response.json();
        
        if (data.status === 'success' && data.user) {
          setUserData(data.user);
        } else {
          throw new Error(data.message || 'Failed to retrieve user data');
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
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
      const notifDropdown = document.getElementById('notification-dropdown');
      const notifButton = document.getElementById('notification-button');
      
      if (
        dropdown && 
        button && 
        !dropdown.contains(event.target as Node) && 
        !button.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
      
      if (
        notifDropdown && 
        notifButton && 
        !notifDropdown.contains(event.target as Node) && 
        !notifButton.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    // Apply to document
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Get initials for avatar
  const getInitials = () => {
    if (!userData) return 'U';
    return `${userData.firstName?.charAt(0) || ''}${userData.lastName?.charAt(0) || ''}`;
  };

  // Handle file input change
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should not exceed 5MB');
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Create FormData
      const formData = new FormData();
      formData.append('profileImage', file);
      
      // Send to server
      const response = await fetch('http://localhost:7000/api/v1/user/upload-profile-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || Cookies.get('token')}`,
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      
      if (data.status === 'success' && data.user) {
        // Update local state with new image URL
        setUserData({
          ...userData!,
          profileImage: data.user.profileImage
        });
        
        alert('Profile image updated successfully!');
      } else {
        throw new Error(data.message || 'Failed to update profile image');
      }
    } catch (err) {
      console.error('Error uploading profile image:', err);
      alert(err instanceof Error ? err.message : 'An unknown error occurred during upload');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Trigger file input click
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Notification data
  const notifications = [
    {
      id: 1,
      title: "New user registered",
      message: "John Doe has registered as a new user",
      time: "5 minutes ago",
      isRead: false,
      type: "user"
    },
    {
      id: 2,
      title: "System update",
      message: "System will be updated tonight at 2:00 AM",
      time: "1 hour ago",
      isRead: true,
      type: "system"
    },
    {
      id: 3,
      title: "New content published",
      message: "New content has been published to Parasole",
      time: "Yesterday",
      isRead: false,
      type: "content"
    }
  ];

  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-indigo-50 via-white to-violet-50 dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-b border-indigo-100 dark:border-slate-700 shadow-md z-50">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between px-6 py-2">
        <style jsx global>{`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          .animate-slideDown {
            animation: slideDown 0.25s ease-out forwards;
          }
          
          /* Dark mode transitions */
          html.dark {
            color-scheme: dark;
          }

          body {
            transition: background-color 0.3s ease;
          }
          
          html.dark body {
            background-color: hsl(var(--background));
            color: hsl(var(--foreground));
          }
        `}</style>
        
        {/* Logo and Brand */}
        <Link 
          href="/" 
          className="flex items-center gap-3 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-lg p-2 transition-all duration-200 group"
        >
          <div className="relative w-10 h-10 overflow-hidden rounded-lg shadow-lg transition-transform duration-200 group-hover:scale-105 ring-2 ring-indigo-100 dark:ring-slate-600">
            <Image
              src="/plogoTop.jpg"
              alt="Logo"
              fill
              className="object-cover"
            />
          </div>
          <div className="transition-all duration-200 group-hover:translate-x-1">
            <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-700 to-violet-700 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent tracking-tight">Global Admin</h1>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Paragon Group</p>
          </div>
        </Link>

        {/* Empty Center Section */}
        <div className="flex-1"></div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleDarkMode}
            className="relative p-2 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-lg text-indigo-500 dark:text-indigo-400 transition-all duration-200 hover:text-indigo-700 dark:hover:text-indigo-300"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button className="relative p-2 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-lg text-indigo-500 dark:text-indigo-400 transition-all duration-200 hover:text-indigo-700 dark:hover:text-indigo-300">
            <HelpCircle size={20} />
          </button>

          <button className="relative p-2 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-lg text-indigo-500 dark:text-indigo-400 transition-all duration-200 hover:text-indigo-700 dark:hover:text-indigo-300">
            <MessageSquare size={20} />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              id="notification-button"
              onClick={() => setNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-lg text-indigo-500 dark:text-indigo-400 transition-all duration-200 hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-800" />
            </button>

            {isNotificationsOpen && (
              <div 
                id="notification-dropdown"
                className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-indigo-100 dark:border-slate-700 py-2 z-50 animate-slideDown origin-top-right"
              >
                <div className="px-4 py-2 border-b border-indigo-50 dark:border-slate-700 flex justify-between items-center">
                  <h3 className="font-semibold text-indigo-800 dark:text-indigo-300">Notifications</h3>
                  <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">
                    Mark all as read
                  </button>
                </div>
                
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`px-4 py-3 border-b border-indigo-50 dark:border-slate-700 hover:bg-indigo-50/50 dark:hover:bg-slate-700/50 transition-colors duration-200 ${notification.isRead ? 'opacity-70' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          notification.type === 'user' 
                            ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400' 
                            : notification.type === 'system' 
                            ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400'
                            : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400'
                        }`}>
                          {notification.type === 'user' && <User size={14} />}
                          {notification.type === 'system' && <Settings size={14} />}
                          {notification.type === 'content' && <MessageSquare size={14} />}
                        </div>
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-800 dark:text-gray-200 text-sm">{notification.title}</h4>
                            {!notification.isRead && (
                              <span className="w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{notification.message}</p>
                          <span className="text-xs text-indigo-500 dark:text-indigo-400 mt-1 block">{notification.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="px-4 py-2 border-t border-indigo-50 dark:border-slate-700 text-center">
                  <Link 
                    href="/notifications"
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors duration-200"
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="h-8 w-px bg-indigo-100 dark:bg-slate-700 mx-1 hidden sm:block" />

          {/* User Profile */}
          <div className="relative">
            <button
              id="profile-button"
              onClick={() => setProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-3 hover:bg-indigo-50 dark:hover:bg-slate-700 p-2 rounded-lg transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md overflow-hidden transition-all duration-200 group-hover:scale-105 relative">
                {isLoading ? (
                  <div className="w-full h-full bg-indigo-400 dark:bg-indigo-600 flex items-center justify-center">
                    <Loader2 size={20} className="animate-spin text-white" />
                  </div>
                ) : isUploading ? (
                  <div className="w-full h-full bg-indigo-400 dark:bg-indigo-600 flex items-center justify-center">
                    <Loader2 size={20} className="animate-spin text-white" />
                  </div>
                ) : userData?.profileImage ? (
                  <Image
                    src={userData.profileImage}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-violet-600 dark:from-indigo-500 dark:to-violet-500 flex items-center justify-center font-bold text-base">
                    {getInitials()}
                  </div>
                )}
              </div>
              <div className="text-right mr-1 transition-all duration-200 group-hover:translate-x-1">
                {isLoading ? (
                  <>
                    <div className="h-4 w-16 bg-indigo-100 dark:bg-slate-700 rounded animate-pulse mb-1"></div>
                    <div className="h-3 w-20 bg-indigo-100 dark:bg-slate-700 rounded animate-pulse"></div>
                  </>
                ) : error ? (
                  <>
                    <p className="font-medium text-gray-900 dark:text-gray-200">User</p>
                    <div className="text-xs text-gray-600 dark:text-gray-400">User</div>
                  </>
                ) : (
                  <>
                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{`${userData?.firstName} ${userData?.lastName}`}</div>
                    <div className="text-xs font-medium bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">{userData?.role || 'User'}</div>
                  </>
                )}
              </div>
              <ChevronDown className={`w-4 h-4 text-indigo-400 dark:text-indigo-300 transition-transform duration-300 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProfileDropdownOpen && (
              <div 
                id="profile-dropdown"
                className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-indigo-100 dark:border-slate-700 py-2 z-50 animate-slideDown origin-top-right"
              >
                <div className="px-4 py-3 border-b border-indigo-50 dark:border-slate-700">
                  {isLoading ? (
                    <div className="space-y-2">
                      <div className="h-5 w-32 bg-indigo-100 dark:bg-slate-700 rounded animate-pulse"></div>
                      <div className="h-4 w-40 bg-indigo-100 dark:bg-slate-700 rounded animate-pulse"></div>
                    </div>
                  ) : error ? (
                    <>
                      <p className="font-medium text-gray-900 dark:text-gray-200">User</p>
                      <div className="text-xs text-gray-600 dark:text-gray-400">User</div>
                    </>
                  ) : (
                    <div className="flex items-start gap-3">
                      <div className="relative w-12 h-12 rounded-xl flex-shrink-0 shadow-md overflow-hidden group/avatar">
                        {isUploading ? (
                          <div className="w-full h-full bg-indigo-400 dark:bg-indigo-600 flex items-center justify-center">
                            <Loader2 size={20} className="animate-spin text-white" />
                          </div>
                        ) : userData?.profileImage ? (
                          <>
                            <Image
                              src={userData.profileImage}
                              alt="Profile"
                              fill
                              className="object-cover"
                            />
                            <div 
                              className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                              onClick={handleUploadClick}
                            >
                              <Camera size={16} className="text-white" />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-violet-600 dark:from-indigo-500 dark:to-violet-500 flex items-center justify-center text-white font-bold text-lg">
                              {getInitials()}
                            </div>
                            <div 
                              className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                              onClick={handleUploadClick}
                            >
                              <Camera size={16} className="text-white" />
                            </div>
                          </>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-200">{`${userData?.firstName} ${userData?.lastName}`}</div>
                        <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{userData?.role || 'User'}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{userData?.email}</div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="py-2">
                  <div 
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-indigo-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition-colors duration-200 cursor-pointer"
                    onClick={handleUploadClick}
                  >
                    <Upload size={16} className="text-indigo-500 dark:text-indigo-400" />
                    <span>Upload Profile Picture</span>
                  </div>
                  
                  <Link 
                    href="/admin/settings" 
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-indigo-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition-colors duration-200"
                  >
                    <User size={16} className="text-indigo-500 dark:text-indigo-400" />
                    <span>Profile Settings</span>
                  </Link>
                  <Link 
                    href="/admin/settings" 
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-indigo-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition-colors duration-200"
                  >
                    <Settings size={16} className="text-indigo-500 dark:text-indigo-400" />
                    <span>Preferences</span>
                  </Link>
                </div>
                <div className="border-t border-indigo-50 dark:border-slate-700 pt-2">
                  <button 
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 dark:text-rose-400 flex items-center gap-2 transition-colors duration-200"
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
      
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}