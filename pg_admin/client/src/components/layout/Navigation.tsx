
// "use client"

// import { useState, useEffect } from 'react'
// import { useRouter, usePathname } from 'next/navigation'
// import { Button } from "@/components/ui/button"
// import { 
//   LayoutDashboard, 
//   Users, 
//   BarChart, 
//   Settings,
//   UserRound,
//   UserCog,
//   ChevronDown,
//   Loader2,
//   Home,
//   Info,
//   Shield,
//   Phone,
//   Trophy,
//   Briefcase,
//   Building2,
//   UserPlus,
//   Image as ImageIcon,
//   Globe,
//   Edit,
//   Plus,
//   LucideIcon,
//   ClipboardList
// } from 'lucide-react'
// import { usePermissions } from '@/providers/permission-context'
// import { useWebsite, Website } from '@/providers/WebsiteProvider'
// import Cookies from "js-cookie"

// // Define types
// interface NavItem {
//   icon: LucideIcon;
//   label: string;
//   path: string;
//   requiredPermission?: string;
//   requiresEdit?: boolean;
//   requiresCreate?: boolean;
//   subItems?: Omit<NavItem, 'subItems'>[];
// }

// interface WebsiteConfig {
//   name: string;
//   navItems: NavItem[];
// }

// interface WebsiteConfigs {
//   [key: string]: WebsiteConfig;
// }

// interface UserPermissions {
//   [key: string]: boolean;
// }

// interface User {
//   id: number;
//   role: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   status: string;
//   roleId: number;
// }

// interface NavigationProps {
//   isSidebarOpen: boolean;
// }

// // Website-specific configuration with permission requirements
// const websiteConfigs: WebsiteConfigs = {
//   parasole: {
//     name: 'Parasole',
//     navItems: [
//       { icon: Home, label: 'Home', path: '/admin/parasole/home', requiredPermission: 'parasole_view' },
//       { icon: Info, label: 'About', path: '/admin/parasole/about', requiredPermission: 'parasole_view' },
//       { icon: Shield, label: 'Compliance', path: '/admin/parasole/compliance', requiredPermission: 'parasole_view' },
//       { icon: Settings, label: 'Operations', path: '/admin/parasole/operations', requiredPermission: 'parasole_view' },
//       { icon: Users, label: 'Buyers', path: '/admin/parasole/buyers', requiredPermission: 'parasole_view' },
//       { icon: Phone, label: 'Contact', path: '/admin/parasole/contact', requiredPermission: 'parasole_view' },
//       { icon: Edit, label: 'Edit Content', path: '/admin/parasole/edit', requiredPermission: 'parasole_view', requiresEdit: true },
//       { icon: Plus, label: 'Add Content', path: '/admin/parasole/add', requiredPermission: 'parasole_view', requiresCreate: true }
//     ]
//   },
//   paragon: {
//     name: 'Paragon',
//     navItems: [
//       { icon: Home, label: 'Home', path: '/admin/paragon/home', requiredPermission: 'paragon_group_view' },
//       { icon: Info, label: 'About', path: '/admin/paragon/about', requiredPermission: 'paragon_group_view' },
//       { icon: Trophy, label: 'Milestones', path: '/admin/paragon/milestones', requiredPermission: 'paragon_group_view' },
//       { icon: Briefcase, label: 'Business Activities', path: '/admin/paragon/business', requiredPermission: 'paragon_group_view' },
//       { icon: Building2, label: 'Companies', path: '/admin/paragon/companies', requiredPermission: 'paragon_group_view' },
//       { icon: UserPlus, label: 'Career', path: '/admin/paragon/career', requiredPermission: 'paragon_group_view' },
//       { icon: ImageIcon, label: 'Media', path: '/admin/paragon/media', requiredPermission: 'paragon_group_view' },
//       { icon: Phone, label: 'Contact', path: '/admin/paragon/contact', requiredPermission: 'paragon_group_view' },
//       { icon: Edit, label: 'Edit Content', path: '/admin/paragon/edit', requiredPermission: 'paragon_group_view', requiresEdit: true },
//       { icon: Plus, label: 'Add Content', path: '/admin/paragon/add', requiredPermission: 'paragon_group_view', requiresCreate: true }
//     ]
//   }
// }

// export function Navigation({ isSidebarOpen = true }: NavigationProps): JSX.Element {
//   const router = useRouter()
//   const pathname = usePathname()
//   const permissionsContext = usePermissions()
//   const { selectedWebsite, setSelectedWebsite } = useWebsite()
  
//   // Local state
//   const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({})
//   const [showUserManagement, setShowUserManagement] = useState<boolean>(false)
//   const [showAuditLogs, setShowAuditLogs] = useState<boolean>(false)
//   const [currentUser, setCurrentUser] = useState<User | null>(null)
//   const [isLoading, setIsLoading] = useState<boolean>(true)
//   const [userPermissions, setUserPermissions] = useState<UserPermissions | null>(null)
//   const [websiteList] = useState<Website[]>([
//     { id: 1, name: 'Parasole', slug: 'parasole' },
//     { id: 2, name: 'Paragon', slug: 'paragon' }
//   ])

//   // Toggle dropdown function
//   const toggleDropdown = (section: string): void => {
//     setOpenDropdowns(prev => ({ ...prev, [section]: !prev[section] }))
//   }

//   // Check if path is active
//   const isActivePath = (path: string): boolean => {
//     return pathname?.startsWith(path) || false
//   }

//   // Function to check if user has a specific permission
//   const hasPermission = (permission: string): boolean => {
//     // Super Admin has all permissions
//     if (currentUser?.role === "Super Admin") {
//       return true
//     }
    
//     // For regular users, check the permission in the permissions object
//     return userPermissions?.[permission] === true
//   }

//   // Check if user can edit content for the current website
//   const canEdit = (websiteSlug: string): boolean => {
//     if (currentUser?.role === "Super Admin") return true;
    
//     if (websiteSlug === 'parasole') {
//       return userPermissions?.parasole_edit === true;
//     } else if (websiteSlug === 'paragon') {
//       return userPermissions?.paragon_group_edit === true;
//     }
    
//     return false;
//   }

//   // Check if user can create content for the current website
//   const canCreate = (websiteSlug: string): boolean => {
//     if (currentUser?.role === "Super Admin") return true;
    
//     if (websiteSlug === 'parasole') {
//       return userPermissions?.parasole_create === true;
//     } else if (websiteSlug === 'paragon') {
//       return userPermissions?.paragon_group_create === true;
//     }
    
//     return false;
//   }

//   // Bypass the permission context and fetch user data directly
//   useEffect(() => {
//     const fetchCurrentUser = async (): Promise<void> => {
//       setIsLoading(true)
//       try {
//         const token = Cookies.get("token")
        
//         if (!token) {
//           console.log("No authentication token found")
//           setIsLoading(false)
//           return
//         }
        
//         const response = await fetch("http://localhost:7000/api/v1/user/all", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         })
        
//         if (!response.ok) {
//           console.warn(`Failed to fetch user data: ${response.status}`)
//           setIsLoading(false)
//           return
//         }
        
//         const data = await response.json()
        
//         if (data.status === "success" && data.users && data.users.length > 0) {
//           // For debugging, let's get the first user (in production you'd identify the current user)
//           const user = data.users[0]
//           setCurrentUser(user)
          
//           // Check if user is Super Admin
//           const isSuperAdmin = user.role === "Super Admin"
//           console.log("User Role:", user.role)
//           console.log("Is Super Admin:", isSuperAdmin)
          
//           // If Super Admin, show User Management and Audit Logs
//           if (isSuperAdmin) {
//             setShowUserManagement(true)
//             setShowAuditLogs(true)
//             console.log("User Management and Audit Logs shown for Super Admin")
//           } else {
//             // For non-Super Admin, fetch role permissions
//             const permResponse = await fetch(`http://localhost:7000/api/v1/role_permission/${user.roleId}`, {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "application/json",
//               },
//             })
            
//             if (permResponse.ok) {
//               const permData = await permResponse.json()
//               console.log("Permission data:", permData)
              
//               if (permData.status === "success" && permData.rolePermission) {
//                 // Store the permissions for later use
//                 setUserPermissions(permData.rolePermission)
                
//                 // Check for user_view permission
//                 const hasUserViewPermission = permData.rolePermission.user_view === true
//                 // Check for audit_view permission (you'll need to add this to your backend)
//                 const hasAuditViewPermission = permData.rolePermission.audit_view === true
                
//                 console.log("Has user_view permission:", hasUserViewPermission)
//                 console.log("Has audit_view permission:", hasAuditViewPermission)
                
//                 setShowUserManagement(hasUserViewPermission)
//                 setShowAuditLogs(hasAuditViewPermission)
//               } else {
//                 setShowUserManagement(false)
//                 setShowAuditLogs(false)
//               }
//             } else {
//               setShowUserManagement(false)
//               setShowAuditLogs(false)
//             }
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error)
//       } finally {
//         setIsLoading(false)
//       }
//     }
    
//     fetchCurrentUser()
//   }, [])

//   // Set website from URL on component mount
//   useEffect(() => {
//     const pathSegments = pathname?.split('/') || []
//     if (pathSegments.length > 2) {
//       const slugFromUrl = pathSegments[2]
//       const websiteFromUrl = websiteList.find(w => w.slug === slugFromUrl)
//       if (websiteFromUrl) {
//         setSelectedWebsite(websiteFromUrl)
        
//         // Open the Website Modules dropdown
//         setOpenDropdowns(prev => ({
//           ...prev,
//           'WebsiteModules': true
//         }))
//       }
//     }
//   }, [pathname, websiteList, setSelectedWebsite])

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="p-4 flex items-center justify-center">
//         <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
//         <span className="ml-2">Loading navigation...</span>
//       </div>
//     )
//   }

//   return (
//     <nav className="p-2">
//       <div className="space-y-6">
//         {/* Basic Navigation Items */}
//         <div className="space-y-1">
//           {/* Dashboard (Always visible) */}
//           <Button
//             variant="ghost"
//             className={`w-full justify-start gap-2 ${
//               isActivePath('/admin/dashboard') ? 'bg-blue-50 text-blue-600' : ''
//             }`}
//             onClick={() => router.push('/admin/dashboard')}
//           >
//             <LayoutDashboard className="h-4 w-4" />
//             {isSidebarOpen && <span>Dashboard</span>}
//           </Button>
          
//           {/* AUDIT LOGS - Only shown based on permission check */}
//           {showAuditLogs && (
//             <Button
//               variant="ghost"
//               className={`w-full justify-start gap-2 ${
//                 isActivePath('/admin/audit-logs') ? 'bg-blue-50 text-blue-600' : ''
//               }`}
//               onClick={() => router.push('/admin/audit')}
//             >
//               <ClipboardList className="h-4 w-4" />
//               {isSidebarOpen && <span>Audit Logs</span>}
//             </Button>
//           )}
          
//           {/* USER MANAGEMENT - Only shown based on permission check */}
//           {showUserManagement && (
//             <div>
//               <button
//                 onClick={() => toggleDropdown('UserManagement')}
//                 className={`
//                   w-full flex items-center gap-2 px-3 py-2 
//                   text-gray-700 hover:bg-gray-100 rounded-lg 
//                   transition-colors duration-200
//                   ${openDropdowns['UserManagement'] ? 'bg-gray-100' : ''}
//                   ${isActivePath('/admin/users') || isActivePath('/admin/manageUser') ? 'bg-blue-50 text-blue-600' : ''}
//                 `}
//               >
//                 <Users className="h-4 w-4" />
//                 {isSidebarOpen && (
//                   <>
//                     <span className="flex-1">User Management</span>
//                     <ChevronDown className="h-4 w-4" style={{ transform: openDropdowns['UserManagement'] ? 'rotate(180deg)' : 'rotate(0deg)' }} />
//                   </>
//                 )}
//               </button>

//               {isSidebarOpen && openDropdowns['UserManagement'] && (
//                 <div className="mt-1 ml-4 space-y-1">
//                   <Button
//                     variant="ghost"
//                     className={`w-full justify-start gap-2 text-sm ${
//                       isActivePath('/admin/manageUser/users') ? 'bg-blue-50 text-blue-600' : ''
//                     }`}
//                     onClick={() => router.push('/admin/manageUser/users')}
//                   >
//                     <UserRound className="h-4 w-4" />
//                     <span>All Users</span>
//                   </Button>
                  
//                   <Button
//                     variant="ghost"
//                     className={`w-full justify-start gap-2 text-sm ${
//                       isActivePath('/admin/manageUser/roles') ? 'bg-blue-50 text-blue-600' : ''
//                     }`}
//                     onClick={() => router.push('/admin/manageUser/roles')}
//                   >
//                     <UserCog className="h-4 w-4" />
//                     <span>User Roles</span>
//                   </Button>
//                 </div>
//               )}
//             </div>
//           )}
          
//           {/* Analytics */}
//           <Button
//             variant="ghost"
//             className={`w-full justify-start gap-2 ${
//               isActivePath('/admin/analytics') ? 'bg-blue-50 text-blue-600' : ''
//             }`}
//             onClick={() => router.push('/admin/analytics')}
//           >
//             <BarChart className="h-4 w-4" />
//             {isSidebarOpen && <span>Analytics</span>}
//           </Button>
          
//           {/* Settings */}
//           <Button
//             variant="ghost"
//             className={`w-full justify-start gap-2 ${
//               isActivePath('/admin/settings') ? 'bg-blue-50 text-blue-600' : ''
//             }`}
//             onClick={() => router.push('/admin/settings')}
//           >
//             <Settings className="h-4 w-4" />
//             {isSidebarOpen && <span>Settings</span>}
//           </Button>
//         </div>

//         {/* Website Section */}
//         {websiteList.length > 0 && (
//           <div className="space-y-1">
//             {isSidebarOpen && (
//               <div className="px-3 py-2 text-sm font-medium text-gray-500">
//                 Websites
//               </div>
//             )}

//             {/* Website Selector Button */}
//             <button
//               onClick={() => toggleDropdown('WebsiteSelector')}
//               className={`
//                 w-full flex items-center gap-2 px-3 py-2 
//                 text-gray-700 hover:bg-gray-100 rounded-lg 
//                 transition-colors duration-200
//                 ${openDropdowns['WebsiteSelector'] ? 'bg-gray-100' : ''}
//                 ${selectedWebsite ? 'text-blue-600' : ''}
//               `}
//             >
//               <Globe className="h-4 w-4" />
//               {isSidebarOpen && (
//                 <>
//                   <span className="flex-1">
//                     {selectedWebsite ? selectedWebsite.name : 'Select Website'}
//                   </span>
//                   <ChevronDown 
//                     className="h-4 w-4 transition-transform duration-200" 
//                     style={{ transform: openDropdowns['WebsiteSelector'] ? 'rotate(180deg)' : 'rotate(0deg)' }} 
//                   />
//                 </>
//               )}
//             </button>
            
//             {/* Website List Dropdown */}
//             {isSidebarOpen && openDropdowns['WebsiteSelector'] && (
//               <div className="ml-4 space-y-1 py-1 animate-in fade-in slide-in-from-top-5 duration-200">
//                 {websiteList.map((website, index) => (
//                   <Button
//                     key={index}
//                     variant="ghost"
//                     className={`w-full justify-start gap-2 text-sm ${
//                       selectedWebsite?.slug === website.slug ? 'bg-blue-50 text-blue-600' : ''
//                     }`}
//                     onClick={() => {
//                       setSelectedWebsite(website)
//                       toggleDropdown('WebsiteModules')
//                       router.push(`/admin/${website.slug}/home`)
//                     }}
//                   >
//                     <div className={`w-2 h-2 rounded-full ${
//                       selectedWebsite?.slug === website.slug ? 'bg-blue-500' : 'bg-gray-300'
//                     }`} />
//                     <span>{website.name}</span>
//                   </Button>
//                 ))}
//               </div>
//             )}
            
//             {/* Website Modules */}
//             {selectedWebsite && websiteConfigs[selectedWebsite.slug] && (
//               <>
//                 <button
//                   onClick={() => toggleDropdown('WebsiteModules')}
//                   className={`
//                     w-full flex items-center gap-2 px-3 py-2 mt-1
//                     text-gray-700 hover:bg-gray-100 rounded-lg 
//                     transition-colors duration-200
//                     ${openDropdowns['WebsiteModules'] ? 'bg-gray-100' : ''}
//                   `}
//                 >
//                   <Settings className="h-4 w-4" />
//                   {isSidebarOpen && (
//                     <>
//                       <span className="flex-1">
//                         {selectedWebsite.name} Modules
//                       </span>
//                       <ChevronDown 
//                         className="h-4 w-4 transition-transform duration-200" 
//                         style={{ transform: openDropdowns['WebsiteModules'] ? 'rotate(180deg)' : 'rotate(0deg)' }} 
//                       />
//                     </>
//                   )}
//                 </button>
                
//                 {/* Website Module Items */}
//                 {isSidebarOpen && openDropdowns['WebsiteModules'] && (
//                   <div className="ml-4 space-y-1 py-1 animate-in fade-in slide-in-from-top-5 duration-200">
//                     {websiteConfigs[selectedWebsite.slug].navItems
//                       .filter(item => {
//                         // Basic permission check - can they view this item?
//                         let hasBasicPermission = false;
                        
//                         // For Paragon website
//                         if (selectedWebsite.slug === 'paragon' && item.requiredPermission === 'paragon_group_view') {
//                           hasBasicPermission = currentUser?.role === "Super Admin" || 
//                                               userPermissions?.paragon_group_view === true;
//                         }
//                         // For Parasole website
//                         else if (selectedWebsite.slug === 'parasole' && item.requiredPermission === 'parasole_view') {
//                           hasBasicPermission = currentUser?.role === "Super Admin" || 
//                                               userPermissions?.parasole_view === true;
//                         }
//                         else {
//                           // Default permission check
//                           hasBasicPermission = currentUser?.role === "Super Admin" || 
//                                               hasPermission(item.requiredPermission || '');
//                         }
                        
//                         // If they don't have basic permission, hide the item
//                         if (!hasBasicPermission) return false;
                        
//                         // Additional permission checks for edit and create
//                         if (item.requiresEdit && !canEdit(selectedWebsite.slug)) {
//                           return false; // Hide edit options if they can't edit
//                         }
                        
//                         if (item.requiresCreate && !canCreate(selectedWebsite.slug)) {
//                           return false; // Hide create options if they can't create
//                         }
                        
//                         // If they passed all checks, show the item
//                         return true;
//                       })
//                       .map((item, index) => (
//                         <Button
//                           key={index}
//                           variant="ghost"
//                           className={`w-full justify-start gap-2 text-sm ${
//                             isActivePath(item.path) ? 'bg-blue-50 text-blue-600' : ''
//                           }`}
//                           onClick={() => router.push(item.path)}
//                         >
//                           <item.icon className="h-4 w-4" />
//                           <span>{item.label}</span>
//                         </Button>
//                       ))
//                     }
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         )}
//       </div>
//     </nav>
//   )
// }




"use client"

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  Users, 
  BarChart, 
  Settings,
  UserRound,
  UserCog,
  ChevronDown,
  Loader2,
  Home,
  Info,
  Shield,
  Phone,
  Trophy,
  Briefcase,
  Building2,
  UserPlus,
  Image as ImageIcon,
  Globe,
  Edit,
  Plus,
  LucideIcon,
  ClipboardList
} from 'lucide-react'
import { usePermissions } from '@/providers/permission-context'
import { useWebsite, Website } from '@/providers/WebsiteProvider'
import Cookies from "js-cookie"

// Define types
interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
  requiredPermission?: string;
  requiresEdit?: boolean;
  requiresCreate?: boolean;
  subItems?: Omit<NavItem, 'subItems'>[];
}

interface WebsiteConfig {
  name: string;
  navItems: NavItem[];
}

interface WebsiteConfigs {
  [key: string]: WebsiteConfig;
}

interface UserPermissions {
  [key: string]: boolean;
}

interface User {
  id: number;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  roleId: number;
}

interface NavigationProps {
  isSidebarOpen: boolean;
}

// Website-specific configuration with permission requirements
const websiteConfigs: WebsiteConfigs = {
  parasole: {
    name: 'Parasole',
    navItems: [
      { icon: Home, label: 'Home', path: '/admin/parasole/home', requiredPermission: 'parasole_view' },
      { icon: Info, label: 'About', path: '/admin/parasole/about', requiredPermission: 'parasole_view' },
      { icon: Shield, label: 'Compliance', path: '/admin/parasole/compliance', requiredPermission: 'parasole_view' },
      { icon: Settings, label: 'Operations', path: '/admin/parasole/operations', requiredPermission: 'parasole_view' },
      { icon: Users, label: 'Buyers', path: '/admin/parasole/buyers', requiredPermission: 'parasole_view' },
      { icon: Phone, label: 'Contact', path: '/admin/parasole/contact', requiredPermission: 'parasole_view' },
      { icon: Edit, label: 'Edit Content', path: '/admin/parasole/edit', requiredPermission: 'parasole_view', requiresEdit: true },
      { icon: Plus, label: 'Add Content', path: '/admin/parasole/add', requiredPermission: 'parasole_view', requiresCreate: true }
    ]
  },
  paragon: {
    name: 'Paragon',
    navItems: [
      { icon: Home, label: 'Home', path: '/admin/paragon/home', requiredPermission: 'paragon_group_view' },
      { icon: Info, label: 'About', path: '/admin/paragon/about', requiredPermission: 'paragon_group_view' },
      { icon: Trophy, label: 'Milestones', path: '/admin/paragon/milestones', requiredPermission: 'paragon_group_view' },
      { icon: Briefcase, label: 'Business Activities', path: '/admin/paragon/business', requiredPermission: 'paragon_group_view' },
      { icon: Building2, label: 'Companies', path: '/admin/paragon/companies', requiredPermission: 'paragon_group_view' },
      { icon: UserPlus, label: 'Career', path: '/admin/paragon/career', requiredPermission: 'paragon_group_view' },
      { icon: ImageIcon, label: 'Media', path: '/admin/paragon/media', requiredPermission: 'paragon_group_view' },
      { icon: Phone, label: 'Contact', path: '/admin/paragon/contact', requiredPermission: 'paragon_group_view' },
      { icon: Edit, label: 'Edit Content', path: '/admin/paragon/edit', requiredPermission: 'paragon_group_view', requiresEdit: true },
      { icon: Plus, label: 'Add Content', path: '/admin/paragon/add', requiredPermission: 'paragon_group_view', requiresCreate: true }
    ]
  }
}

export function Navigation({ isSidebarOpen = true }: NavigationProps): JSX.Element {
  const router = useRouter()
  const pathname = usePathname()
  const permissionsContext = usePermissions()
  const { selectedWebsite, setSelectedWebsite } = useWebsite()
  
  // Local state
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({})
  const [showUserManagement, setShowUserManagement] = useState<boolean>(false)
  const [showAuditLogs, setShowAuditLogs] = useState<boolean>(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [userPermissions, setUserPermissions] = useState<UserPermissions | null>(null)
  const [websiteList] = useState<Website[]>([
    { id: 1, name: 'Parasole', slug: 'parasole' },
    { id: 2, name: 'Paragon', slug: 'paragon' }
  ])

  // Toggle dropdown function
  const toggleDropdown = (section: string): void => {
    setOpenDropdowns(prev => ({ ...prev, [section]: !prev[section] }))
  }

  // Check if path is active
  const isActivePath = (path: string): boolean => {
    return pathname?.startsWith(path) || false
  }

  // Function to check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    // Super Admin has all permissions
    if (currentUser?.role === "Super Admin") {
      return true
    }
    
    // For regular users, check the permission in the permissions object
    return userPermissions?.[permission] === true
  }

  // Check if user can edit content for the current website
  const canEdit = (websiteSlug: string): boolean => {
    if (currentUser?.role === "Super Admin") return true;
    
    if (websiteSlug === 'parasole') {
      return userPermissions?.parasole_edit === true;
    } else if (websiteSlug === 'paragon') {
      return userPermissions?.paragon_group_edit === true;
    }
    
    return false;
  }

  // Check if user can create content for the current website
  const canCreate = (websiteSlug: string): boolean => {
    if (currentUser?.role === "Super Admin") return true;
    
    if (websiteSlug === 'parasole') {
      return userPermissions?.parasole_create === true;
    } else if (websiteSlug === 'paragon') {
      return userPermissions?.paragon_group_create === true;
    }
    
    return false;
  }

  // Bypass the permission context and fetch user data directly
  useEffect(() => {
    const fetchCurrentUser = async (): Promise<void> => {
      setIsLoading(true)
      try {
        const token = Cookies.get("token")
        
        if (!token) {
          console.log("No authentication token found")
          setIsLoading(false)
          return
        }
        
        const response = await fetch("http://localhost:7000/api/v1/user/all", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        
        if (!response.ok) {
          console.warn(`Failed to fetch user data: ${response.status}`)
          setIsLoading(false)
          return
        }
        
        const data = await response.json()
        
        if (data.status === "success" && data.users && data.users.length > 0) {
          // For debugging, let's get the first user (in production you'd identify the current user)
          const user = data.users[0]
          setCurrentUser(user)
          
          // Check if user is Super Admin
          const isSuperAdmin = user.role === "Super Admin"
          console.log("User Role:", user.role)
          console.log("Is Super Admin:", isSuperAdmin)
          
          // If Super Admin, show User Management and Audit Logs
          if (isSuperAdmin) {
            setShowUserManagement(true)
            setShowAuditLogs(true)
            console.log("User Management and Audit Logs shown for Super Admin")
          } else {
            // For non-Super Admin, fetch role permissions
            const permResponse = await fetch(`http://localhost:7000/api/v1/role_permission/${user.roleId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            })
            
            if (permResponse.ok) {
              const permData = await permResponse.json()
              console.log("Permission data:", permData)
              
              if (permData.status === "success" && permData.rolePermission) {
                // Store the permissions for later use
                setUserPermissions(permData.rolePermission)
                
                // Check for user_view permission
                const hasUserViewPermission = permData.rolePermission.user_view === true
                // Check for audit_view permission
                const hasAuditViewPermission = permData.rolePermission.audit_view === true
                
                console.log("Has user_view permission:", hasUserViewPermission)
                console.log("Has audit_view permission:", hasAuditViewPermission)
                
                setShowUserManagement(hasUserViewPermission)
                setShowAuditLogs(hasAuditViewPermission)
              } else {
                setShowUserManagement(false)
                setShowAuditLogs(false)
              }
            } else {
              setShowUserManagement(false)
              setShowAuditLogs(false)
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchCurrentUser()
  }, [])

  // Set website from URL on component mount or based on permissions
  useEffect(() => {
    // First try to get website from URL
    const pathSegments = pathname?.split('/') || []
    if (pathSegments.length > 2) {
      const slugFromUrl = pathSegments[2]
      const websiteFromUrl = websiteList.find(w => w.slug === slugFromUrl)
      if (websiteFromUrl) {
        setSelectedWebsite(websiteFromUrl)
        
        // Open the Website Modules dropdown
        setOpenDropdowns(prev => ({
          ...prev,
          'WebsiteModules': true
        }))
        return; // Exit if we've set the website from URL
      }
    }
    
    // If URL doesn't have a website or it's invalid, check permissions and auto-select
    if (userPermissions && !selectedWebsite) {
      // If user has only Parasole permission but not Paragon
      if (userPermissions.parasole_view && !userPermissions.paragon_group_view) {
        const parasoleWebsite = websiteList.find(w => w.slug === 'parasole');
        if (parasoleWebsite) {
          setSelectedWebsite(parasoleWebsite);
          setOpenDropdowns(prev => ({
            ...prev,
            'WebsiteModules': true
          }));
        }
      }
      // If user has only Paragon permission but not Parasole
      else if (!userPermissions.parasole_view && userPermissions.paragon_group_view) {
        const paragonWebsite = websiteList.find(w => w.slug === 'paragon');
        if (paragonWebsite) {
          setSelectedWebsite(paragonWebsite);
          setOpenDropdowns(prev => ({
            ...prev,
            'WebsiteModules': true
          }));
        }
      }
      // Both permissions - don't auto-select, let user choose
    }
  }, [pathname, websiteList, setSelectedWebsite, userPermissions, selectedWebsite])

  // Loading state
  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        <span className="ml-2">Loading navigation...</span>
      </div>
    )
  }

  return (
    <nav className="p-2">
      <div className="space-y-6">
        {/* Basic Navigation Items */}
        <div className="space-y-1">
          {/* Dashboard (Always visible) */}
          <Button
            variant="ghost"
            className={`w-full justify-start gap-2 ${
              isActivePath('/admin/dashboard') ? 'bg-blue-50 text-blue-600' : ''
            }`}
            onClick={() => router.push('/admin/dashboard')}
          >
            <LayoutDashboard className="h-4 w-4" />
            {isSidebarOpen && <span>Dashboard</span>}
          </Button>
          
          {/* AUDIT LOGS - Only shown based on permission check */}
          {showAuditLogs && (
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 ${
                isActivePath('/admin/audit-logs') ? 'bg-blue-50 text-blue-600' : ''
              }`}
              onClick={() => router.push('/admin/audit')}
            >
              <ClipboardList className="h-4 w-4" />
              {isSidebarOpen && <span>Audit Logs</span>}
            </Button>
          )}
          
          {/* USER MANAGEMENT - Only shown based on permission check */}
          {showUserManagement && (
            <div>
              <button
                onClick={() => toggleDropdown('UserManagement')}
                className={`
                  w-full flex items-center gap-2 px-3 py-2 
                  text-gray-700 hover:bg-gray-100 rounded-lg 
                  transition-colors duration-200
                  ${openDropdowns['UserManagement'] ? 'bg-gray-100' : ''}
                  ${isActivePath('/admin/users') || isActivePath('/admin/manageUser') ? 'bg-blue-50 text-blue-600' : ''}
                `}
              >
                <Users className="h-4 w-4" />
                {isSidebarOpen && (
                  <>
                    <span className="flex-1">User Management</span>
                    <ChevronDown className="h-4 w-4" style={{ transform: openDropdowns['UserManagement'] ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                  </>
                )}
              </button>

              {isSidebarOpen && openDropdowns['UserManagement'] && (
                <div className="mt-1 ml-4 space-y-1">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-2 text-sm ${
                      isActivePath('/admin/manageUser/users') ? 'bg-blue-50 text-blue-600' : ''
                    }`}
                    onClick={() => router.push('/admin/manageUser/users')}
                  >
                    <UserRound className="h-4 w-4" />
                    <span>All Users</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-2 text-sm ${
                      isActivePath('/admin/manageUser/roles') ? 'bg-blue-50 text-blue-600' : ''
                    }`}
                    onClick={() => router.push('/admin/manageUser/roles')}
                  >
                    <UserCog className="h-4 w-4" />
                    <span>User Roles</span>
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {/* Analytics */}
          <Button
            variant="ghost"
            className={`w-full justify-start gap-2 ${
              isActivePath('/admin/analytics') ? 'bg-blue-50 text-blue-600' : ''
            }`}
            onClick={() => router.push('/admin/analytics')}
          >
            <BarChart className="h-4 w-4" />
            {isSidebarOpen && <span>Analytics</span>}
          </Button>
          
          {/* Settings */}
          <Button
            variant="ghost"
            className={`w-full justify-start gap-2 ${
              isActivePath('/admin/settings') ? 'bg-blue-50 text-blue-600' : ''
            }`}
            onClick={() => router.push('/admin/settings')}
          >
            <Settings className="h-4 w-4" />
            {isSidebarOpen && <span>Settings</span>}
          </Button>
        </div>

        {/* Website Section - Only show if user has permission for at least one website */}
        {websiteList.length > 0 && (currentUser?.role === "Super Admin" || 
          userPermissions?.parasole_view === true || 
          userPermissions?.paragon_group_view === true) && (
          <div className="space-y-1">
            {isSidebarOpen && (
              <div className="px-3 py-2 text-sm font-medium text-gray-500">
                Websites
              </div>
            )}

            {/* Website Selector Button - Only show if user has access to multiple websites */}
            {(currentUser?.role === "Super Admin" || 
              (userPermissions?.parasole_view && userPermissions?.paragon_group_view)) ? (
              <button
                onClick={() => toggleDropdown('WebsiteSelector')}
                className={`
                  w-full flex items-center gap-2 px-3 py-2 
                  text-gray-700 hover:bg-gray-100 rounded-lg 
                  transition-colors duration-200
                  ${openDropdowns['WebsiteSelector'] ? 'bg-gray-100' : ''}
                  ${selectedWebsite ? 'text-blue-600' : ''}
                `}
              >
                <Globe className="h-4 w-4" />
                {isSidebarOpen && (
                  <>
                    <span className="flex-1">
                      {selectedWebsite ? selectedWebsite.name : 'Select Website'}
                    </span>
                    <ChevronDown 
                      className="h-4 w-4 transition-transform duration-200" 
                      style={{ transform: openDropdowns['WebsiteSelector'] ? 'rotate(180deg)' : 'rotate(0deg)' }} 
                    />
                  </>
                )}
              </button>
            ) : (
              // If user has only one website, show it as a title without dropdown
              <div className="px-3 py-2 flex items-center gap-2 text-blue-600 font-medium">
                <Globe className="h-4 w-4" />
                {isSidebarOpen && selectedWebsite && (
                  <span>{selectedWebsite.name}</span>
                )}
              </div>
            )}
            
            {/* Website List Dropdown - Only show if user has permission to multiple websites */}
            {isSidebarOpen && openDropdowns['WebsiteSelector'] && (
              <div className="ml-4 space-y-1 py-1 animate-in fade-in slide-in-from-top-5 duration-200">
                {websiteList
                  .filter(website => {
                    // Only show websites the user has permission to view
                    if (currentUser?.role === "Super Admin") return true;
                    
                    if (website.slug === 'parasole') {
                      return userPermissions?.parasole_view === true;
                    } else if (website.slug === 'paragon') {
                      return userPermissions?.paragon_group_view === true;
                    }
                    
                    return false;
                  })
                  .map((website, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className={`w-full justify-start gap-2 text-sm ${
                        selectedWebsite?.slug === website.slug ? 'bg-blue-50 text-blue-600' : ''
                      }`}
                      onClick={() => {
                        setSelectedWebsite(website)
                        toggleDropdown('WebsiteModules')
                        router.push(`/admin/${website.slug}/home`)
                      }}
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        selectedWebsite?.slug === website.slug ? 'bg-blue-500' : 'bg-gray-300'
                      }`} />
                      <span>{website.name}</span>
                    </Button>
                  ))
                }
              </div>
            )}
            
            {/* Website Modules */}
            {selectedWebsite && websiteConfigs[selectedWebsite.slug] && (
              <>
                <button
                  onClick={() => toggleDropdown('WebsiteModules')}
                  className={`
                    w-full flex items-center gap-2 px-3 py-2 mt-1
                    text-gray-700 hover:bg-gray-100 rounded-lg 
                    transition-colors duration-200
                    ${openDropdowns['WebsiteModules'] ? 'bg-gray-100' : ''}
                  `}
                >
                  <Settings className="h-4 w-4" />
                  {isSidebarOpen && (
                    <>
                      <span className="flex-1">
                        {selectedWebsite.name} Modules
                      </span>
                      <ChevronDown 
                        className="h-4 w-4 transition-transform duration-200" 
                        style={{ transform: openDropdowns['WebsiteModules'] ? 'rotate(180deg)' : 'rotate(0deg)' }} 
                      />
                    </>
                  )}
                </button>
                
                {/* Website Module Items - FIXED FILTERING LOGIC */}
                {isSidebarOpen && openDropdowns['WebsiteModules'] && (
                  <div className="ml-4 space-y-1 py-1 animate-in fade-in slide-in-from-top-5 duration-200">
                    {websiteConfigs[selectedWebsite.slug].navItems
                      .filter(item => {
                        // Basic permission check - can they view this item?
                        let hasBasicPermission = false;
                        
                        // For Paragon website
                        if (selectedWebsite.slug === 'paragon' && item.requiredPermission === 'paragon_group_view') {
                          hasBasicPermission = currentUser?.role === "Super Admin" || 
                                              userPermissions?.paragon_group_view === true;
                        }
                        // For Parasole website
                        else if (selectedWebsite.slug === 'parasole' && item.requiredPermission === 'parasole_view') {
                          hasBasicPermission = currentUser?.role === "Super Admin" || 
                                              userPermissions?.parasole_view === true;
                        }
                        else {
                          // Default permission check
                          hasBasicPermission = currentUser?.role === "Super Admin" || 
                                              hasPermission(item.requiredPermission || '');
                        }
                        
                        // If they don't have basic permission, hide the item
                        if (!hasBasicPermission) return false;
                        
                        // Additional permission checks for edit and create
                        if (item.requiresEdit) {
                          const canEditItem = canEdit(selectedWebsite.slug);
                          if (!canEditItem) return false; // Hide edit options if they can't edit
                        }
                        
                        if (item.requiresCreate) {
                          const canCreateItem = canCreate(selectedWebsite.slug);
                          if (!canCreateItem) return false; // Hide create options if they can't create
                        }
                        
                        // If they passed all checks, show the item
                        return true;
                      })
                      .map((item, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          className={`w-full justify-start gap-2 text-sm ${
                            isActivePath(item.path) ? 'bg-blue-50 text-blue-600' : ''
                          }`}
                          onClick={() => router.push(item.path)}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Button>
                      ))
                    }
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
