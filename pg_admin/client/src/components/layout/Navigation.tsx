
// // "use client"

// // import { useState, useEffect } from 'react'
// // import { useRouter, usePathname } from 'next/navigation'
// // import { motion, AnimatePresence } from 'framer-motion'
// // import { Button } from "@/components/ui/button"
// // import { 
// //   LayoutDashboard, 
// //   Users, 
// //   BarChart, 
// //   Settings,
// //   UserRound,
// //   UserCog,
// //   ChevronDown,
// //   Home,
// //   Info,
// //   Shield,
// //   Phone,
// //   Trophy,
// //   Briefcase,
// //   Building2,
// //   UserPlus,
// //   Image as ImageIcon,
// //   LucideIcon,
// //   Globe,
// //   Loader2
// // } from 'lucide-react'
// // import { usePermissions } from '@/providers/permission-context'

// // // Types
// // interface NavItem {
// //   icon: LucideIcon
// //   label: string
// //   path: string
// //   requiredPermission?: keyof RolePermission
// //   subItems?: Omit<NavItem, 'subItems'>[]
// // }

// // interface Website {
// //   id: number
// //   name: string
// //   slug: string
// //   domain?: string
// // }

// // interface RolePermission {
// //   paragon_group_view: boolean
// //   paragon_group_create: boolean
// //   paragon_group_edit: boolean
// //   paragon_group_delete: boolean
// //   parasole_view: boolean
// //   parasole_create: boolean
// //   parasole_edit: boolean
// //   parasole_delete: boolean
// //   user_view: boolean
// //   user_create: boolean
// //   user_edit: boolean
// //   user_delete: boolean
// //   settings_view: boolean
// //   settings_create: boolean
// //   settings_edit: boolean
// //   dashboard: boolean
// //   analytics_view: boolean
// // }

// // // Global navigation items with permission requirements
// // const globalNavItems: NavItem[] = [
// //   { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard', requiredPermission: 'dashboard' },
// //   { 
// //     icon: Users, 
// //     label: 'User Management', 
// //     path: '/admin/users',
// //     requiredPermission: 'user_view',
// //     subItems: [
// //       { icon: UserRound, label: 'All Users', path: '/admin/manageUser/users', requiredPermission: 'user_view' },
// //       { icon: UserCog, label: 'User Roles', path: '/admin/manageUser/roles', requiredPermission: 'user_view' },
// //     ]
// //   },
// //   { icon: BarChart, label: 'Analytics', path: '/admin/analytics', requiredPermission: 'analytics_view' },
// //   { icon: Settings, label: 'Settings', path: '/admin/settings', requiredPermission: 'settings_view' }
// // ]

// // // Website-specific configuration with permission requirements
// // const websiteConfigs = {
// //   parasole: {
// //     name: 'Parasole',
// //     navItems: [
// //       { icon: Home, label: 'Home', path: '/admin/parasole/home', requiredPermission: 'parasole_view' },
// //       { icon: Info, label: 'About', path: '/admin/parasole/about', requiredPermission: 'parasole_view' },
// //       { icon: Shield, label: 'Compliance', path: '/admin/parasole/compliance', requiredPermission: 'parasole_view' },
// //       { icon: Settings, label: 'Operations', path: '/admin/parasole/operations', requiredPermission: 'parasole_view' },
// //       { icon: Users, label: 'Buyers', path: '/admin/parasole/buyers', requiredPermission: 'parasole_view' },
// //       { icon: Phone, label: 'Contact', path: '/admin/parasole/contact', requiredPermission: 'parasole_view' }
// //     ]
// //   },
// //   paragon: {
// //     name: 'Paragon',
// //     navItems: [
// //       { icon: Home, label: 'Home', path: '/admin/paragon/home', requiredPermission: 'paragon_group_view' },
// //       { icon: Info, label: 'About', path: '/admin/paragon/about', requiredPermission: 'paragon_group_view' },
// //       { icon: Trophy, label: 'Milestones', path: '/admin/paragon/milestones', requiredPermission: 'paragon_group_view' },
// //       { icon: Briefcase, label: 'Business Activities', path: '/admin/paragon/business', requiredPermission: 'paragon_group_view' },
// //       { icon: Building2, label: 'Companies', path: '/admin/paragon/companies', requiredPermission: 'paragon_group_view' },
// //       { icon: UserPlus, label: 'Career', path: '/admin/paragon/career', requiredPermission: 'paragon_group_view' },
// //       { icon: ImageIcon, label: 'Media', path: '/admin/paragon/media', requiredPermission: 'paragon_group_view' },
// //       { icon: Phone, label: 'Contact', path: '/admin/paragon/contact', requiredPermission: 'paragon_group_view' }
// //     ]
// //   }
// // }

// // // Default websites
// // const defaultWebsites: Website[] = [
// //   { id: 1, name: 'Parasole', slug: 'parasole' },
// //   { id: 2, name: 'Paragon', slug: 'paragon' }
// // ]

// // // Animation variants
// // const dropdownVariants = {
// //   hidden: { 
// //     opacity: 0, 
// //     height: 0,
// //     overflow: 'hidden'
// //   },
// //   visible: { 
// //     opacity: 1, 
// //     height: 'auto',
// //     transition: { 
// //       duration: 0.3, 
// //       ease: "easeInOut" 
// //     }
// //   },
// //   exit: { 
// //     opacity: 0, 
// //     height: 0,
// //     transition: { 
// //       duration: 0.2, 
// //       ease: "easeInOut" 
// //     }
// //   }
// // }

// // const itemVariants = {
// //   hidden: { 
// //     opacity: 0, 
// //     x: -15 
// //   },
// //   visible: (i: number) => ({ 
// //     opacity: 1, 
// //     x: 0,
// //     transition: { 
// //       delay: i * 0.05,
// //       duration: 0.3
// //     }
// //   }),
// //   exit: { 
// //     opacity: 0, 
// //     x: -15,
// //     transition: { 
// //       duration: 0.2 
// //     }
// //   }
// // }

// // export function Navigation({ isSidebarOpen = true }) {
// //   const router = useRouter()
// //   const pathname = usePathname()
// //   const { hasPermission, loading, isSuperAdmin, isAdmin } = usePermissions()
  
// //   // State
// //   const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({})
// //   const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null)
// //   const [websiteList] = useState<Website[]>(defaultWebsites)

// //   // Functions
// //   const toggleDropdown = (section: string) => {
// //     setOpenDropdowns(prev => ({
// //       ...prev,
// //       [section]: !prev[section]
// //     }))
// //   }

// //   const isActivePath = (path: string) => pathname.startsWith(path)
  
// //   const handleWebsiteSelect = (website: Website) => {
// //     setSelectedWebsite(website)
    
// //     // Open the Website Modules dropdown automatically
// //     setOpenDropdowns(prev => ({
// //       ...prev,
// //       'WebsiteModules': true
// //     }))
    
// //     router.push(`/admin/${website.slug}/home`)
// //   }

// //   // Set website from URL on component mount
// //   useEffect(() => {
// //     const pathSegments = pathname.split('/')
// //     if (pathSegments.length > 2) {
// //       const slugFromUrl = pathSegments[2]
// //       const websiteFromUrl = websiteList.find(w => w.slug === slugFromUrl)
// //       if (websiteFromUrl) {
// //         setSelectedWebsite(websiteFromUrl)
        
// //         // Open the Website Modules dropdown
// //         setOpenDropdowns(prev => ({
// //           ...prev,
// //           'WebsiteModules': true
// //         }))
// //       }
// //     }
// //   }, [pathname, websiteList])

// //   // Filter navItems based on user permissions
// //   const filteredGlobalNavItems = globalNavItems.filter(item => {
// //     // Super admin can see all items
// //     if (isSuperAdmin) return true;
    
// //     // Admin can see all items except anything you want to restrict
// //     if (isAdmin) {
// //       // You can add specific restrictions for Admin here if needed
// //       // For example: if (item.path.includes('/some-restricted-path')) return false;
// //       return true;
// //     }
    
// //     // Regular users - check specific permissions
// //     if (!item.requiredPermission) return true
// //     return hasPermission(item.requiredPermission)
// //   }).map(item => {
// //     if (item.subItems) {
// //       return {
// //         ...item,
// //         subItems: item.subItems.filter(subItem => {
// //           // Super admin can see all items
// //           if (isSuperAdmin) return true;
          
// //           // Admin can see all items except anything you want to restrict
// //           if (isAdmin) {
// //             // You can add specific restrictions for Admin here
// //             return true;
// //           }
          
// //           // Regular users - check specific permissions
// //           if (!subItem.requiredPermission) return true
// //           return hasPermission(subItem.requiredPermission)
// //         })
// //       }
// //     }
// //     return item
// //   })

// //   // Don't render navigation during permission loading
// //   if (loading) {
// //     return (
// //       <nav className="p-2">
// //         <div className="h-screen flex flex-col items-center justify-start pt-20">
// //           <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
// //           <p className="text-sm text-gray-500 mt-2">Loading navigation...</p>
// //         </div>
// //       </nav>
// //     )
// //   }

// //   return (
// //     <nav className="p-2">
// //       <div className="space-y-6">
// //         {/* Global Navigation */}
// //         <div className="space-y-1">
// //           {filteredGlobalNavItems.map((item, index) => (
// //             <div key={index}>
// //               {item.subItems && item.subItems.length > 0 ? (
// //                 <>
// //                   <motion.button
// //                     whileTap={{ scale: 0.98 }}
// //                     onClick={() => toggleDropdown(item.label)}
// //                     className={`
// //                       w-full flex items-center gap-2 px-3 py-2 
// //                       text-gray-700 hover:bg-gray-100 rounded-lg 
// //                       transition-colors duration-200
// //                       ${openDropdowns[item.label] ? 'bg-gray-100' : ''}
// //                       ${isActivePath(item.path) ? 'bg-blue-50 text-blue-600' : ''}
// //                     `}
// //                   >
// //                     <item.icon className="h-4 w-4" />
// //                     {isSidebarOpen && (
// //                       <>
// //                         <span className="flex-1">{item.label}</span>
// //                         <motion.div
// //                           animate={{ rotate: openDropdowns[item.label] ? 180 : 0 }}
// //                           transition={{ duration: 0.3 }}
// //                         >
// //                           <ChevronDown className="h-4 w-4" />
// //                         </motion.div>
// //                       </>
// //                     )}
// //                   </motion.button>

// //                   <AnimatePresence>
// //                     {isSidebarOpen && openDropdowns[item.label] && (
// //                       <motion.div
// //                         variants={dropdownVariants}
// //                         initial="hidden"
// //                         animate="visible"
// //                         exit="exit"
// //                         className="mt-1 ml-4 space-y-1"
// //                       >
// //                         {item.subItems.map((subItem, subIndex) => (
// //                           <motion.div
// //                             key={subIndex}
// //                             custom={subIndex}
// //                             variants={itemVariants}
// //                             initial="hidden"
// //                             animate="visible"
// //                             exit="exit"
// //                           >
// //                             <Button
// //                               variant="ghost"
// //                               className={`w-full justify-start gap-2 text-sm ${
// //                                 isActivePath(subItem.path) ? 'bg-blue-50 text-blue-600' : ''
// //                               }`}
// //                               onClick={() => router.push(subItem.path)}
// //                             >
// //                               <subItem.icon className="h-4 w-4" />
// //                               <span>{subItem.label}</span>
// //                             </Button>
// //                           </motion.div>
// //                         ))}
// //                       </motion.div>
// //                     )}
// //                   </AnimatePresence>
// //                 </>
// //               ) : (
// //                 <Button
// //                   variant="ghost"
// //                   className={`w-full justify-start gap-2 ${
// //                     isActivePath(item.path) ? 'bg-blue-50 text-blue-600' : ''
// //                   }`}
// //                   onClick={() => router.push(item.path)}
// //                 >
// //                   <item.icon className="h-4 w-4" />
// //                   {isSidebarOpen && <span>{item.label}</span>}
// //                 </Button>
// //               )}
// //             </div>
// //           ))}
// //         </div>

// //         {/* Website Section */}
// //         <div className="space-y-1">
// //           {isSidebarOpen && (
// //             <div className="px-3 py-2 text-sm font-medium text-gray-500">
// //               Websites
// //             </div>
// //           )}

// //           {/* Website Selector Dropdown */}
// //           <motion.button
// //             whileTap={{ scale: 0.98 }}
// //             onClick={() => toggleDropdown('WebsiteSelector')}
// //             className={`
// //               w-full flex items-center gap-2 px-3 py-2 
// //               text-gray-700 hover:bg-gray-100 rounded-lg 
// //               transition-colors duration-200
// //               ${openDropdowns['WebsiteSelector'] ? 'bg-gray-100' : ''}
// //               ${selectedWebsite ? 'text-blue-600' : ''}
// //             `}
// //           >
// //             <Globe className="h-4 w-4" />
// //             {isSidebarOpen && (
// //               <>
// //                 <span className="flex-1">
// //                   {selectedWebsite ? selectedWebsite.name : 'Select Website'}
// //                 </span>
// //                 <motion.div
// //                   animate={{ rotate: openDropdowns['WebsiteSelector'] ? 180 : 0 }}
// //                   transition={{ duration: 0.3 }}
// //                 >
// //                   <ChevronDown className="h-4 w-4" />
// //                 </motion.div>
// //               </>
// //             )}
// //           </motion.button>
          
// //           {/* Website List Dropdown */}
// //           <AnimatePresence>
// //             {isSidebarOpen && openDropdowns['WebsiteSelector'] && (
// //               <motion.div
// //                 variants={dropdownVariants}
// //                 initial="hidden"
// //                 animate="visible"
// //                 exit="exit"
// //                 className="ml-4 overflow-hidden"
// //               >
// //                 <div className="space-y-1 py-1">
// //                   {websiteList.filter(website => {
// //                     // Super admin can see all websites
// //                     if (isSuperAdmin) return true;
                    
// //                     // Admin can see all websites
// //                     if (isAdmin) return true;
                    
// //                     // Regular users - check specific permissions
// //                     if (website.slug === 'parasole') {
// //                       return hasPermission('parasole_view')
// //                     }
// //                     if (website.slug === 'paragon') {
// //                       return hasPermission('paragon_group_view')
// //                     }
// //                     return true
// //                   }).map((website, websiteIndex) => (
// //                     <motion.div
// //                       key={websiteIndex}
// //                       custom={websiteIndex}
// //                       variants={itemVariants}
// //                       initial="hidden"
// //                       animate="visible"
// //                       exit="exit"
// //                     >
// //                       <Button
// //                         variant="ghost"
// //                         className={`w-full justify-start gap-2 text-sm ${
// //                           selectedWebsite?.slug === website.slug ? 'bg-blue-50 text-blue-600' : ''
// //                         }`}
// //                         onClick={() => handleWebsiteSelect(website)}
// //                       >
// //                         <div className={`w-2 h-2 rounded-full ${
// //                           selectedWebsite?.slug === website.slug ? 'bg-blue-500' : 'bg-gray-300'
// //                         }`} />
// //                         <span>{website.name}</span>
// //                       </Button>
// //                     </motion.div>
// //                   ))}
// //                 </div>
// //               </motion.div>
// //             )}
// //           </AnimatePresence>
          
// //           {/* Website Modules Dropdown */}
// //           {selectedWebsite && (
// //             <>
// //               <motion.button
// //                 whileTap={{ scale: 0.98 }}
// //                 onClick={() => toggleDropdown('WebsiteModules')}
// //                 className={`
// //                   w-full flex items-center gap-2 px-3 py-2 mt-1
// //                   text-gray-700 hover:bg-gray-100 rounded-lg 
// //                   transition-colors duration-200
// //                   ${openDropdowns['WebsiteModules'] ? 'bg-gray-100' : ''}
// //                 `}
// //               >
// //                 <Settings className="h-4 w-4" />
// //                 {isSidebarOpen && (
// //                   <>
// //                     <span className="flex-1">
// //                       {selectedWebsite.name} Modules
// //                     </span>
// //                     <motion.div
// //                       animate={{ rotate: openDropdowns['WebsiteModules'] ? 180 : 0 }}
// //                       transition={{ duration: 0.3 }}
// //                     >
// //                       <ChevronDown className="h-4 w-4" />
// //                     </motion.div>
// //                   </>
// //                 )}
// //               </motion.button>
              
// //               {/* Website Modules Items */}
// //               <AnimatePresence>
// //                 {isSidebarOpen && openDropdowns['WebsiteModules'] && 
// //                   websiteConfigs[selectedWebsite.slug as keyof typeof websiteConfigs] && (
// //                   <motion.div
// //                     variants={dropdownVariants}
// //                     initial="hidden"
// //                     animate="visible"
// //                     exit="exit"
// //                     className="ml-4 overflow-hidden"
// //                   >
// //                     <div className="space-y-1 py-1">
// //                       {websiteConfigs[selectedWebsite.slug as keyof typeof websiteConfigs].navItems
// //                         .filter(item => {
// //                           // Super admin can see all items
// //                           if (isSuperAdmin) return true;
                          
// //                           // Admin can see all items
// //                           if (isAdmin) return true;
                          
// //                           // Regular users - check specific permissions
// //                           if (!item.requiredPermission) return true
// //                           return hasPermission(item.requiredPermission)
// //                         })
// //                         .map((item, index) => (
// //                           <motion.div
// //                             key={index}
// //                             custom={index}
// //                             variants={itemVariants}
// //                             initial="hidden"
// //                             animate="visible"
// //                             exit="exit"
// //                           >
// //                             <Button
// //                               variant="ghost"
// //                               className={`w-full justify-start gap-2 text-sm ${
// //                                 isActivePath(item.path) ? 'bg-blue-50 text-blue-600' : ''
// //                               }`}
// //                               onClick={() => router.push(item.path)}
// //                             >
// //                               <item.icon className="h-4 w-4" />
// //                               <span>{item.label}</span>
// //                             </Button>
// //                           </motion.div>
// //                         ))
// //                       }
// //                     </div>
// //                   </motion.div>
// //                 )}
// //               </AnimatePresence>
// //             </>
// //           )}
// //         </div>
// //       </div>
// //     </nav>
// //   )
// // }




// "use client"

// import { useState, useEffect } from 'react'
// import { useRouter, usePathname } from 'next/navigation'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Button } from "@/components/ui/button"
// import { 
//   LayoutDashboard, 
//   Users, 
//   BarChart, 
//   Settings,
//   UserRound,
//   UserCog,
//   ChevronDown,
//   Home,
//   Info,
//   Shield,
//   Phone,
//   Trophy,
//   Briefcase,
//   Building2,
//   UserPlus,
//   Image as ImageIcon,
//   LucideIcon,
//   Globe,
//   Loader2
// } from 'lucide-react'
// import { usePermissions } from '@/providers/permission-context'

// // Types
// interface NavItem {
//   icon: LucideIcon
//   label: string
//   path: string
//   requiredPermission?: keyof RolePermission
//   subItems?: Omit<NavItem, 'subItems'>[]
// }

// interface Website {
//   id: number
//   name: string
//   slug: string
//   domain?: string
// }

// interface RolePermission {
//   paragon_group_view: boolean
//   paragon_group_create: boolean
//   paragon_group_edit: boolean
//   paragon_group_delete: boolean
//   parasole_view: boolean
//   parasole_create: boolean
//   parasole_edit: boolean
//   parasole_delete: boolean
//   user_view: boolean
//   user_create: boolean
//   user_edit: boolean
//   user_delete: boolean
//   settings_view: boolean
//   settings_create: boolean
//   settings_edit: boolean
//   dashboard: boolean
//   analytics_view: boolean
// }

// // Global navigation items with permission requirements
// const globalNavItems: NavItem[] = [
//   { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard', requiredPermission: 'dashboard' },
//   { 
//     icon: Users, 
//     label: 'User Management', 
//     path: '/admin/users',
//     requiredPermission: 'user_view',
//     subItems: [
//       { icon: UserRound, label: 'All Users', path: '/admin/manageUser/users', requiredPermission: 'user_view' },
//       { icon: UserCog, label: 'User Roles', path: '/admin/manageUser/roles', requiredPermission: 'user_view' },
//     ]
//   },
//   { icon: BarChart, label: 'Analytics', path: '/admin/analytics', requiredPermission: 'analytics_view' },
//   { icon: Settings, label: 'Settings', path: '/admin/settings', requiredPermission: 'settings_view' }
// ]

// // Website-specific configuration with permission requirements
// const websiteConfigs = {
//   parasole: {
//     name: 'Parasole',
//     navItems: [
//       { icon: Home, label: 'Home', path: '/admin/parasole/home', requiredPermission: 'parasole_view' },
//       { icon: Info, label: 'About', path: '/admin/parasole/about', requiredPermission: 'parasole_view' },
//       { icon: Shield, label: 'Compliance', path: '/admin/parasole/compliance', requiredPermission: 'parasole_view' },
//       { icon: Settings, label: 'Operations', path: '/admin/parasole/operations', requiredPermission: 'parasole_view' },
//       { icon: Users, label: 'Buyers', path: '/admin/parasole/buyers', requiredPermission: 'parasole_view' },
//       { icon: Phone, label: 'Contact', path: '/admin/parasole/contact', requiredPermission: 'parasole_view' }
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
//       { icon: Phone, label: 'Contact', path: '/admin/paragon/contact', requiredPermission: 'paragon_group_view' }
//     ]
//   }
// }

// // Default websites
// const defaultWebsites: Website[] = [
//   { id: 1, name: 'Parasole', slug: 'parasole' },
//   { id: 2, name: 'Paragon', slug: 'paragon' }
// ]

// // Animation variants
// const dropdownVariants = {
//   hidden: { 
//     opacity: 0, 
//     height: 0,
//     overflow: 'hidden'
//   },
//   visible: { 
//     opacity: 1, 
//     height: 'auto',
//     transition: { 
//       duration: 0.3, 
//       ease: "easeInOut" 
//     }
//   },
//   exit: { 
//     opacity: 0, 
//     height: 0,
//     transition: { 
//       duration: 0.2, 
//       ease: "easeInOut" 
//     }
//   }
// }

// const itemVariants = {
//   hidden: { 
//     opacity: 0, 
//     x: -15 
//   },
//   visible: (i: number) => ({ 
//     opacity: 1, 
//     x: 0,
//     transition: { 
//       delay: i * 0.05,
//       duration: 0.3
//     }
//   }),
//   exit: { 
//     opacity: 0, 
//     x: -15,
//     transition: { 
//       duration: 0.2 
//     }
//   }
// }

// export function Navigation({ isSidebarOpen = true }) {
//   const router = useRouter()
//   const pathname = usePathname()
//   const { hasPermission, loading, isSuperAdmin, isAdmin } = usePermissions()
  
//   // State
//   const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({})
//   const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null)
//   const [websiteList, setWebsiteList] = useState<Website[]>([])
//   const [visibleGlobalNavItems, setVisibleGlobalNavItems] = useState<NavItem[]>([])

//   // Functions
//   const toggleDropdown = (section: string) => {
//     setOpenDropdowns(prev => ({
//       ...prev,
//       [section]: !prev[section]
//     }))
//   }

//   const isActivePath = (path: string) => pathname.startsWith(path)
  
//   const handleWebsiteSelect = (website: Website) => {
//     setSelectedWebsite(website)
    
//     // Open the Website Modules dropdown automatically
//     setOpenDropdowns(prev => ({
//       ...prev,
//       'WebsiteModules': true
//     }))
    
//     router.push(`/admin/${website.slug}/home`)
//   }

//   // Set website from URL on component mount
//   useEffect(() => {
//     const pathSegments = pathname.split('/')
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
//   }, [pathname, websiteList])

//   // Filter items based on permissions
//   useEffect(() => {
//     if (loading) return;

//     // Filter global nav items
//     const filteredGlobalItems = globalNavItems.filter(item => {
//       // Super admin can see all items
//       if (isSuperAdmin) return true;
      
//       // Admin can see most items
//       if (isAdmin) return true;
      
//       // Regular users - check specific permissions
//       if (!item.requiredPermission) return true;
//       return hasPermission(item.requiredPermission);
//     }).map(item => {
//       if (item.subItems) {
//         // Filter subitems
//         const filteredSubItems = item.subItems.filter(subItem => {
//           if (isSuperAdmin) return true;
//           if (isAdmin) return true;
//           if (!subItem.requiredPermission) return true;
//           return hasPermission(subItem.requiredPermission);
//         });
        
//         // Only include parent item if it has visible subitems or no subitems
//         if (filteredSubItems.length > 0 || !item.subItems) {
//           return {
//             ...item,
//             subItems: filteredSubItems,
//           };
//         }
//         // If no subitems are visible, don't include the parent item
//         return null;
//       }
//       return item;
//     }).filter(Boolean) as NavItem[]; // Filter out null items
    
//     setVisibleGlobalNavItems(filteredGlobalItems);
    
//     // Filter website list
//     const filteredWebsites = defaultWebsites.filter(website => {
//       if (isSuperAdmin) return true;
//       if (isAdmin) return true;
      
//       if (website.slug === 'parasole') {
//         return hasPermission('parasole_view');
//       }
//       if (website.slug === 'paragon') {
//         return hasPermission('paragon_group_view');
//       }
//       return true;
//     });
    
//     setWebsiteList(filteredWebsites);
//   }, [loading, hasPermission, isSuperAdmin, isAdmin]);

//   // Don't render navigation during permission loading
//   if (loading) {
//     return (
//       <nav className="p-2">
//         <div className="h-screen flex flex-col items-center justify-start pt-20">
//           <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
//           <p className="text-sm text-gray-500 mt-2">Loading navigation...</p>
//         </div>
//       </nav>
//     )
//   }
  
//   // If there are no permissions, show minimal navigation
//   if (!visibleGlobalNavItems.length && !websiteList.length) {
//     return (
//       <nav className="p-2">
//         <div className="space-y-1">
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
//         </div>
//       </nav>
//     )
//   }

//   return (
//     <nav className="p-2">
//       <div className="space-y-6">
//         {/* Global Navigation */}
//         <div className="space-y-1">
//           {visibleGlobalNavItems.map((item, index) => (
//             <div key={index}>
//               {item.subItems && item.subItems.length > 0 ? (
//                 <>
//                   <motion.button
//                     whileTap={{ scale: 0.98 }}
//                     onClick={() => toggleDropdown(item.label)}
//                     className={`
//                       w-full flex items-center gap-2 px-3 py-2 
//                       text-gray-700 hover:bg-gray-100 rounded-lg 
//                       transition-colors duration-200
//                       ${openDropdowns[item.label] ? 'bg-gray-100' : ''}
//                       ${isActivePath(item.path) ? 'bg-blue-50 text-blue-600' : ''}
//                     `}
//                   >
//                     <item.icon className="h-4 w-4" />
//                     {isSidebarOpen && (
//                       <>
//                         <span className="flex-1">{item.label}</span>
//                         <motion.div
//                           animate={{ rotate: openDropdowns[item.label] ? 180 : 0 }}
//                           transition={{ duration: 0.3 }}
//                         >
//                           <ChevronDown className="h-4 w-4" />
//                         </motion.div>
//                       </>
//                     )}
//                   </motion.button>

//                   <AnimatePresence>
//                     {isSidebarOpen && openDropdowns[item.label] && (
//                       <motion.div
//                         variants={dropdownVariants}
//                         initial="hidden"
//                         animate="visible"
//                         exit="exit"
//                         className="mt-1 ml-4 space-y-1"
//                       >
//                         {item.subItems.map((subItem, subIndex) => (
//                           <motion.div
//                             key={subIndex}
//                             custom={subIndex}
//                             variants={itemVariants}
//                             initial="hidden"
//                             animate="visible"
//                             exit="exit"
//                           >
//                             <Button
//                               variant="ghost"
//                               className={`w-full justify-start gap-2 text-sm ${
//                                 isActivePath(subItem.path) ? 'bg-blue-50 text-blue-600' : ''
//                               }`}
//                               onClick={() => router.push(subItem.path)}
//                             >
//                               <subItem.icon className="h-4 w-4" />
//                               <span>{subItem.label}</span>
//                             </Button>
//                           </motion.div>
//                         ))}
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </>
//               ) : (
//                 <Button
//                   variant="ghost"
//                   className={`w-full justify-start gap-2 ${
//                     isActivePath(item.path) ? 'bg-blue-50 text-blue-600' : ''
//                   }`}
//                   onClick={() => router.push(item.path)}
//                 >
//                   <item.icon className="h-4 w-4" />
//                   {isSidebarOpen && <span>{item.label}</span>}
//                 </Button>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Website Section - Only show if there are visible websites */}
//         {websiteList.length > 0 && (
//           <div className="space-y-1">
//             {isSidebarOpen && (
//               <div className="px-3 py-2 text-sm font-medium text-gray-500">
//                 Websites
//               </div>
//             )}

//             {/* Website Selector Dropdown */}
//             <motion.button
//               whileTap={{ scale: 0.98 }}
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
//                   <motion.div
//                     animate={{ rotate: openDropdowns['WebsiteSelector'] ? 180 : 0 }}
//                     transition={{ duration: 0.3 }}
//                   >
//                     <ChevronDown className="h-4 w-4" />
//                   </motion.div>
//                 </>
//               )}
//             </motion.button>
            
//             {/* Website List Dropdown */}
//             <AnimatePresence>
//               {isSidebarOpen && openDropdowns['WebsiteSelector'] && (
//                 <motion.div
//                   variants={dropdownVariants}
//                   initial="hidden"
//                   animate="visible"
//                   exit="exit"
//                   className="ml-4 overflow-hidden"
//                 >
//                   <div className="space-y-1 py-1">
//                     {websiteList.map((website, websiteIndex) => (
//                       <motion.div
//                         key={websiteIndex}
//                         custom={websiteIndex}
//                         variants={itemVariants}
//                         initial="hidden"
//                         animate="visible"
//                         exit="exit"
//                       >
//                         <Button
//                           variant="ghost"
//                           className={`w-full justify-start gap-2 text-sm ${
//                             selectedWebsite?.slug === website.slug ? 'bg-blue-50 text-blue-600' : ''
//                           }`}
//                           onClick={() => handleWebsiteSelect(website)}
//                         >
//                           <div className={`w-2 h-2 rounded-full ${
//                             selectedWebsite?.slug === website.slug ? 'bg-blue-500' : 'bg-gray-300'
//                           }`} />
//                           <span>{website.name}</span>
//                         </Button>
//                       </motion.div>
//                     ))}
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
            
//             {/* Website Modules Dropdown - Only show if a website is selected */}
//             {selectedWebsite && (
//               <>
//                 <motion.button
//                   whileTap={{ scale: 0.98 }}
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
//                       <motion.div
//                         animate={{ rotate: openDropdowns['WebsiteModules'] ? 180 : 0 }}
//                         transition={{ duration: 0.3 }}
//                       >
//                         <ChevronDown className="h-4 w-4" />
//                       </motion.div>
//                     </>
//                   )}
//                 </motion.button>
                
//                 {/* Website Modules Items */}
//                 <AnimatePresence>
//                   {isSidebarOpen && openDropdowns['WebsiteModules'] && 
//                     websiteConfigs[selectedWebsite.slug as keyof typeof websiteConfigs] && (
//                     <motion.div
//                       variants={dropdownVariants}
//                       initial="hidden"
//                       animate="visible"
//                       exit="exit"
//                       className="ml-4 overflow-hidden"
//                     >
//                       <div className="space-y-1 py-1">
//                         {websiteConfigs[selectedWebsite.slug as keyof typeof websiteConfigs].navItems
//                           .filter(item => {
//                             // Super admin can see all items
//                             if (isSuperAdmin) return true;
                            
//                             // Admin can see all items
//                             if (isAdmin) return true;
                            
//                             // Regular users - check specific permissions
//                             if (!item.requiredPermission) return true
//                             return hasPermission(item.requiredPermission)
//                           })
//                           .map((item, index) => (
//                             <motion.div
//                               key={index}
//                               custom={index}
//                               variants={itemVariants}
//                               initial="hidden"
//                               animate="visible"
//                               exit="exit"
//                             >
//                               <Button
//                                 variant="ghost"
//                                 className={`w-full justify-start gap-2 text-sm ${
//                                   isActivePath(item.path) ? 'bg-blue-50 text-blue-600' : ''
//                                 }`}
//                                 onClick={() => router.push(item.path)}
//                               >
//                                 <item.icon className="h-4 w-4" />
//                                 <span>{item.label}</span>
//                               </Button>
//                             </motion.div>
//                           ))
//                         }
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
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
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  Users, 
  BarChart, 
  Settings,
  UserRound,
  UserCog,
  ChevronDown,
  Home,
  Info,
  Shield,
  Phone,
  Trophy,
  Briefcase,
  Building2,
  UserPlus,
  Image as ImageIcon,
  LucideIcon,
  Globe,
  Loader2
} from 'lucide-react'
import { usePermissions } from '@/providers/permission-context'

// Types
interface NavItem {
  icon: LucideIcon
  label: string
  path: string
  requiredPermission?: keyof RolePermission
  strictPermission?: boolean // Indicates if this permission is required for all users regardless of role
  subItems?: Omit<NavItem, 'subItems'>[]
}

interface Website {
  id: number
  name: string
  slug: string
  domain?: string
}

interface RolePermission {
  paragon_group_view: boolean
  paragon_group_create: boolean
  paragon_group_edit: boolean
  paragon_group_delete: boolean
  parasole_view: boolean
  parasole_create: boolean
  parasole_edit: boolean
  parasole_delete: boolean
  user_view: boolean
  user_create: boolean
  user_edit: boolean
  user_delete: boolean
  settings_view: boolean
  settings_create: boolean
  settings_edit: boolean
  dashboard: boolean
  analytics_view: boolean
}

// Global navigation items with permission requirements and strict flags
const globalNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard', requiredPermission: 'dashboard' },
  { 
    icon: Users, 
    label: 'User Management', 
    path: '/admin/users',
    requiredPermission: 'user_view',
    strictPermission: true, // This makes the permission required for everyone, including Super Admins
    subItems: [
      { icon: UserRound, label: 'All Users', path: '/admin/manageUser/users', requiredPermission: 'user_view', strictPermission: true },
      { icon: UserCog, label: 'User Roles', path: '/admin/manageUser/roles', requiredPermission: 'user_view', strictPermission: true },
    ]
  },
  { icon: BarChart, label: 'Analytics', path: '/admin/analytics', requiredPermission: 'analytics_view' },
  { icon: Settings, label: 'Settings', path: '/admin/settings', requiredPermission: 'settings_view' }
]

// Website-specific configuration with permission requirements
const websiteConfigs = {
  parasole: {
    name: 'Parasole',
    navItems: [
      { icon: Home, label: 'Home', path: '/admin/parasole/home', requiredPermission: 'parasole_view' },
      { icon: Info, label: 'About', path: '/admin/parasole/about', requiredPermission: 'parasole_view' },
      { icon: Shield, label: 'Compliance', path: '/admin/parasole/compliance', requiredPermission: 'parasole_view' },
      { icon: Settings, label: 'Operations', path: '/admin/parasole/operations', requiredPermission: 'parasole_view' },
      { icon: Users, label: 'Buyers', path: '/admin/parasole/buyers', requiredPermission: 'parasole_view' },
      { icon: Phone, label: 'Contact', path: '/admin/parasole/contact', requiredPermission: 'parasole_view' }
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
      { icon: Phone, label: 'Contact', path: '/admin/paragon/contact', requiredPermission: 'paragon_group_view' }
    ]
  }
}

// Default websites
const defaultWebsites: Website[] = [
  { id: 1, name: 'Parasole', slug: 'parasole' },
  { id: 2, name: 'Paragon', slug: 'paragon' }
]

// Animation variants
const dropdownVariants = {
  hidden: { 
    opacity: 0, 
    height: 0,
    overflow: 'hidden'
  },
  visible: { 
    opacity: 1, 
    height: 'auto',
    transition: { 
      duration: 0.3, 
      ease: "easeInOut" 
    }
  },
  exit: { 
    opacity: 0, 
    height: 0,
    transition: { 
      duration: 0.2, 
      ease: "easeInOut" 
    }
  }
}

const itemVariants = {
  hidden: { 
    opacity: 0, 
    x: -15 
  },
  visible: (i: number) => ({ 
    opacity: 1, 
    x: 0,
    transition: { 
      delay: i * 0.05,
      duration: 0.3
    }
  }),
  exit: { 
    opacity: 0, 
    x: -15,
    transition: { 
      duration: 0.2 
    }
  }
}

export function Navigation({ isSidebarOpen = true }) {
  const router = useRouter()
  const pathname = usePathname()
  const { hasPermission, loading, isSuperAdmin, isAdmin, permissions } = usePermissions()
  
  // State
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({})
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null)
  const [websiteList, setWebsiteList] = useState<Website[]>([])
  const [visibleGlobalNavItems, setVisibleGlobalNavItems] = useState<NavItem[]>([])

  // Functions
  const toggleDropdown = (section: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const isActivePath = (path: string) => pathname.startsWith(path)
  
  const handleWebsiteSelect = (website: Website) => {
    setSelectedWebsite(website)
    
    // Open the Website Modules dropdown automatically
    setOpenDropdowns(prev => ({
      ...prev,
      'WebsiteModules': true
    }))
    
    router.push(`/admin/${website.slug}/home`)
  }

  // Check permission with strict mode handling
  const checkPermission = (item: NavItem): boolean => {
    if (!item.requiredPermission) return true;
    
    // For strict permissions, always check the actual permission regardless of role
    if (item.strictPermission) {
      return permissions ? !!permissions[item.requiredPermission] : false;
    }
    
    // For regular permissions, use the hasPermission function which handles role-based overrides
    return hasPermission(item.requiredPermission);
  }

  // Set website from URL on component mount
  useEffect(() => {
    const pathSegments = pathname.split('/')
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
      }
    }
  }, [pathname, websiteList])

  // Filter items based on permissions
  useEffect(() => {
    if (loading) return;

    // Filter global nav items
    const filteredGlobalItems = globalNavItems.filter(item => checkPermission(item))
      .map(item => {
        if (item.subItems) {
          // Filter subitems
          const filteredSubItems = item.subItems.filter(subItem => checkPermission(subItem));
          
          // Only include parent item if it has visible subitems or no subitems
          if (filteredSubItems.length > 0 || !item.subItems) {
            return {
              ...item,
              subItems: filteredSubItems,
            };
          }
          // If no subitems are visible, don't include the parent item
          return null;
        }
        return item;
      }).filter(Boolean) as NavItem[]; // Filter out null items
    
    setVisibleGlobalNavItems(filteredGlobalItems);
    
    // Filter website list
    const filteredWebsites = defaultWebsites.filter(website => {
      if (website.slug === 'parasole') {
        return hasPermission('parasole_view');
      }
      if (website.slug === 'paragon') {
        return hasPermission('paragon_group_view');
      }
      return true;
    });
    
    setWebsiteList(filteredWebsites);
  }, [loading, hasPermission, permissions]);

  // Don't render navigation during permission loading
  if (loading) {
    return (
      <nav className="p-2">
        <div className="h-screen flex flex-col items-center justify-start pt-20">
          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
          <p className="text-sm text-gray-500 mt-2">Loading navigation...</p>
        </div>
      </nav>
    )
  }
  
  // If there are no permissions, show minimal navigation
  if (!visibleGlobalNavItems.length && !websiteList.length) {
    return (
      <nav className="p-2">
        <div className="space-y-1">
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
        </div>
      </nav>
    )
  }

  return (
    <nav className="p-2">
      <div className="space-y-6">
        {/* Global Navigation */}
        <div className="space-y-1">
          {visibleGlobalNavItems.map((item, index) => (
            <div key={index}>
              {item.subItems && item.subItems.length > 0 ? (
                <>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleDropdown(item.label)}
                    className={`
                      w-full flex items-center gap-2 px-3 py-2 
                      text-gray-700 hover:bg-gray-100 rounded-lg 
                      transition-colors duration-200
                      ${openDropdowns[item.label] ? 'bg-gray-100' : ''}
                      ${isActivePath(item.path) ? 'bg-blue-50 text-blue-600' : ''}
                    `}
                  >
                    <item.icon className="h-4 w-4" />
                    {isSidebarOpen && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        <motion.div
                          animate={{ rotate: openDropdowns[item.label] ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </motion.div>
                      </>
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {isSidebarOpen && openDropdowns[item.label] && (
                      <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="mt-1 ml-4 space-y-1"
                      >
                        {item.subItems.map((subItem, subIndex) => (
                          <motion.div
                            key={subIndex}
                            custom={subIndex}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                          >
                            <Button
                              variant="ghost"
                              className={`w-full justify-start gap-2 text-sm ${
                                isActivePath(subItem.path) ? 'bg-blue-50 text-blue-600' : ''
                              }`}
                              onClick={() => router.push(subItem.path)}
                            >
                              <subItem.icon className="h-4 w-4" />
                              <span>{subItem.label}</span>
                            </Button>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-2 ${
                    isActivePath(item.path) ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                  onClick={() => router.push(item.path)}
                >
                  <item.icon className="h-4 w-4" />
                  {isSidebarOpen && <span>{item.label}</span>}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Website Section - Only show if there are visible websites */}
        {websiteList.length > 0 && (
          <div className="space-y-1">
            {isSidebarOpen && (
              <div className="px-3 py-2 text-sm font-medium text-gray-500">
                Websites
              </div>
            )}

            {/* Website Selector Dropdown */}
            <motion.button
              whileTap={{ scale: 0.98 }}
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
                  <motion.div
                    animate={{ rotate: openDropdowns['WebsiteSelector'] ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.div>
                </>
              )}
            </motion.button>
            
            {/* Website List Dropdown */}
            <AnimatePresence>
              {isSidebarOpen && openDropdowns['WebsiteSelector'] && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="ml-4 overflow-hidden"
                >
                  <div className="space-y-1 py-1">
                    {websiteList.map((website, websiteIndex) => (
                      <motion.div
                        key={websiteIndex}
                        custom={websiteIndex}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <Button
                          variant="ghost"
                          className={`w-full justify-start gap-2 text-sm ${
                            selectedWebsite?.slug === website.slug ? 'bg-blue-50 text-blue-600' : ''
                          }`}
                          onClick={() => handleWebsiteSelect(website)}
                        >
                          <div className={`w-2 h-2 rounded-full ${
                            selectedWebsite?.slug === website.slug ? 'bg-blue-500' : 'bg-gray-300'
                          }`} />
                          <span>{website.name}</span>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Website Modules Dropdown - Only show if a website is selected */}
            {selectedWebsite && (
              <>
                <motion.button
                  whileTap={{ scale: 0.98 }}
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
                      <motion.div
                        animate={{ rotate: openDropdowns['WebsiteModules'] ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </motion.div>
                    </>
                  )}
                </motion.button>
                
                {/* Website Modules Items */}
                <AnimatePresence>
                  {isSidebarOpen && openDropdowns['WebsiteModules'] && 
                    websiteConfigs[selectedWebsite.slug as keyof typeof websiteConfigs] && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="ml-4 overflow-hidden"
                    >
                      <div className="space-y-1 py-1">
                        {websiteConfigs[selectedWebsite.slug as keyof typeof websiteConfigs].navItems
                          .filter(item => {
                            if (!item.requiredPermission) return true
                            return hasPermission(item.requiredPermission)
                          })
                          .map((item, index) => (
                            <motion.div
                              key={index}
                              custom={index}
                              variants={itemVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                            >
                              <Button
                                variant="ghost"
                                className={`w-full justify-start gap-2 text-sm ${
                                  isActivePath(item.path) ? 'bg-blue-50 text-blue-600' : ''
                                }`}
                                onClick={() => router.push(item.path)}
                              >
                                <item.icon className="h-4 w-4" />
                                <span>{item.label}</span>
                              </Button>
                            </motion.div>
                          ))
                        }
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}