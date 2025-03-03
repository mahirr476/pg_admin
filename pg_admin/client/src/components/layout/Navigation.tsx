
// "use client"

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
//   LucideIcon
// } from 'lucide-react'
// import { WebsiteNavigation } from './WebsiteNavigation'
// import { WebsiteSelector } from './WebsiteSelector'

// interface NavItem {
//   icon: LucideIcon
//   label: string
//   path: string
//   subItems?: Omit<NavItem, 'subItems'>[]
// }

// const globalNavItems: NavItem[] = [
//   { 
//     icon: LayoutDashboard, 
//     label: 'Dashboard', 
//     path: '/admin/dashboard' 
//   },
//   { 
//     icon: Users, 
//     label: 'User Management', 
//     path: '/admin/users',
//     subItems: [
//       { 
//         icon: UserRound, 
//         label: 'All Users', 
//         path: '/admin/manageUser/users' 
//       },
//       { 
//         icon: UserCog, 
//         label: 'Roles', 
//         path: '/admin/manageUser/roles' 
//       },
//       { 
//         icon: UserCog, 
//         label: 'Permissions', 
//         path: '/admin/manageUser/permissions' 
//       },
//     ]
//   },
//   { 
//     icon: BarChart, 
//     label: 'Analytics', 
//     path: '/admin/analytics' 
//   },
//   { 
//     icon: Settings, 
//     label: 'Settings', 
//     path: '/admin/settings' 
//   }
// ]

// interface NavigationProps {
//   isSidebarOpen: boolean
//   selectedWebsite: { slug: string; name: string } | null
//   openDropdowns: { [key: string]: boolean }
//   toggleDropdown: (section: string) => void
// }

// export function Navigation({
//   isSidebarOpen,
//   selectedWebsite,
//   openDropdowns,
//   toggleDropdown
// }: NavigationProps) {
//   const router = useRouter()
//   const pathname = usePathname()

//   const isActivePath = (path: string) => pathname.startsWith(path)

//   return (
//     <nav className="p-2">
//       <div className="space-y-6">
//         {/* Global Navigation */}
//         <div className="space-y-1">
//           {globalNavItems.map((item, index) => (
//             <div key={index}>
//               {item.subItems ? (
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
//                         <ChevronDown 
//                           className={`h-4 w-4 transition-transform duration-200 
//                             ${openDropdowns[item.label] ? 'rotate-180' : ''}`
//                           } 
//                         />
//                       </>
//                     )}
//                   </motion.button>

//                   <AnimatePresence>
//                     {isSidebarOpen && openDropdowns[item.label] && (
//                       <motion.div
//                         initial={{ opacity: 0, height: 0 }}
//                         animate={{ opacity: 1, height: 'auto' }}
//                         exit={{ opacity: 0, height: 0 }}
//                         transition={{ duration: 0.2 }}
//                         className="mt-1 ml-4 space-y-1"
//                       >
//                         {item.subItems.map((subItem, subIndex) => (
//                           <motion.div
//                             key={subIndex}
//                             initial={{ opacity: 0, x: -10 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ delay: subIndex * 0.05 }}
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
// <WebsiteSelector/>
//         {/* Website-specific Navigation */}
//         {selectedWebsite && (
//           <WebsiteNavigation 
//             selectedWebsite={selectedWebsite}
//             isSidebarOpen={isSidebarOpen}
//             pathname={pathname}
//           />
//         )}
//       </div>
//     </nav>
//   )
// }





// dynamic fetching api for websitw

// "use client"

// import { useState, useEffect } from 'react'
// import { useRouter, usePathname } from 'next/navigation'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Button } from "@/components/ui/button"
// import Cookies from 'js-cookie'
// import { PlusCircle } from 'lucide-react'
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
//   LucideIcon
// } from 'lucide-react'

// // Types
// interface NavItem {
//   icon: LucideIcon
//   label: string
//   path: string
//   subItems?: Omit<NavItem, 'subItems'>[]
// }

// interface Website {
//   id: number
//   name: string
//   slug: string
//   domain?: string
// }

// // Global navigation items
// const globalNavItems: NavItem[] = [
//   { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
//   { 
//     icon: Users, 
//     label: 'User Management', 
//     path: '/admin/users',
//     subItems: [
//       { icon: UserRound, label: 'All Users', path: '/admin/manageUser/users' },
//       { icon: UserCog, label: 'Roles', path: '/admin/manageUser/roles' },
//       { icon: UserCog, label: 'Permissions', path: '/admin/manageUser/permissions' },
//     ]
//   },
//   { icon: BarChart, label: 'Analytics', path: '/admin/analytics' },
//   { icon: Settings, label: 'Settings', path: '/admin/settings' }
// ]

// // Website-specific configuration
// const websiteConfigs = {
//   parasole: {
//     name: 'Parasole',
//     navItems: [
//       { icon: Home, label: 'Home', path: '/admin/parasole/home' },
//       { icon: Info, label: 'About', path: '/admin/parasole/about' },
//       { icon: Shield, label: 'Compliance', path: '/admin/parasole/compliance' },
//       { icon: Settings, label: 'Operations', path: '/admin/parasole/operations' },
//       { icon: Users, label: 'Buyers', path: '/admin/parasole/buyers' },
//       { icon: Phone, label: 'Contact', path: '/admin/parasole/contact' }
//     ]
//   },
//   paragon: {
//     name: 'Paragon',
//     navItems: [
//       { icon: Home, label: 'Home', path: '/admin/paragon/home' },
//       { icon: Info, label: 'About', path: '/admin/paragon/about' },
//       { icon: Trophy, label: 'Milestones', path: '/admin/paragon/milestones' },
//       { icon: Briefcase, label: 'Business Activities', path: '/admin/paragon/business' },
//       { icon: Building2, label: 'Companies', path: '/admin/paragon/companies' },
//       { icon: UserPlus, label: 'Career', path: '/admin/paragon/career' },
//       { icon: ImageIcon, label: 'Media', path: '/admin/paragon/media' },
//       { icon: Phone, label: 'Contact', path: '/admin/paragon/contact' }
//     ]
//   }
// }

// // Default websites
// const defaultWebsites: Website[] = [
//   { id: 1, name: 'Parasole', slug: 'parasole' },
//   { id: 2, name: 'Paragon', slug: 'paragon' }
// ]

// export function Navigation({ isSidebarOpen = true }) {
//   const router = useRouter()
//   const pathname = usePathname()
  
//   // State
//   const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({})
//   const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null)
//   const [isWebsiteDropdownOpen, setWebsiteDropdownOpen] = useState(false)
//   const [websiteList, setWebsiteList] = useState<Website[]>(defaultWebsites)
//   const [isLoading, setIsLoading] = useState(false)
//   const [showCreateWebsiteForm, setShowCreateWebsiteForm] = useState(false)
//   const [newWebsite, setNewWebsite] = useState({ name: '', slug: '' })

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
//     setWebsiteDropdownOpen(false)
//     router.push(`/admin/${website.domain}/home`)
//   }
  
//   const handleCreateWebsite = async (e: React.FormEvent) => {
//     e.preventDefault()
    
//     if (!newWebsite.name || !newWebsite.slug) {
//       alert('Please fill in all fields')
//       return
//     }
    
//     // Validate slug format (lowercase, alphanumeric, hyphens only)
//     if (!/^[a-z0-9-]+$/.test(newWebsite.slug)) {
//       alert('Slug must contain only lowercase letters, numbers, and hyphens')
//       return
//     }
    
//     const token = Cookies.get('token')
//     if (!token) {
//       alert('You must be logged in to create a website')
//       return
//     }
    
//     setIsLoading(true)
//     try {
//       const response = await fetch('http://localhost:7000/api/v1/website', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           name: newWebsite.name,
//           slug: newWebsite.slug
//         })
//       })
      
//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.message || 'Failed to create website')
//       }
      
//       const data = await response.json()
      
//       // Add new website to the list
//       const createdWebsite = data.website || { 
//         id: Date.now(), // Temporary ID if not provided by API
//         name: newWebsite.name, 
//         slug: newWebsite.slug 
//       }
      
//       setWebsiteList(prev => [...prev, createdWebsite])
      
//       // Select the newly created website
//       setSelectedWebsite(createdWebsite)
      
//       // Reset form and close it
//       setNewWebsite({ name: '', slug: '' })
//       setShowCreateWebsiteForm(false)
//       setWebsiteDropdownOpen(false)
      
//       // Navigate to the new website
//       router.push(`/admin/${createdWebsite.slug}/home`)
      
//     } catch (err) {
//       console.error('Error creating website:', err)
//       alert(err instanceof Error ? err.message : 'Failed to create website')
//     } finally {
//       setIsLoading(false)
//     }
//   }
  
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setNewWebsite(prev => ({ ...prev, [name]: value }))
    
//     // Auto-generate slug from name if slug is empty
//     if (name === 'name' && !newWebsite.slug) {
//       setNewWebsite(prev => ({ 
//         ...prev, 
//         slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') 
//       }))
//     }
//   }

//   // Set website from URL on component mount
//   useEffect(() => {
//     const pathSegments = pathname.split('/')
//     if (pathSegments.length > 2) {
//       const slugFromUrl = pathSegments[2]
//       const websiteFromUrl = defaultWebsites.find(w => w.slug === slugFromUrl)
//       if (websiteFromUrl) {
//         setSelectedWebsite(websiteFromUrl)
//       }
//     }
//   }, [pathname])

//   // Fetch websites from API
//   useEffect(() => {
//     const fetchWebsites = async () => {
//       const token = Cookies.get('token')
//       if (!token) return
      
//       setIsLoading(true)
//       try {
//         const response = await fetch('http://localhost:7000/api/v1/website', {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         })
        
//         if (!response.ok) {
//           // Fallback to default websites if API fails
//           setWebsiteList(defaultWebsites)
//           return
//         }
        
//         const data = await response.json()
//         const websites = data.websites || defaultWebsites
//         setWebsiteList(websites)
//       } catch (err) {
//         console.error('Error fetching websites:', err)
//         setWebsiteList(defaultWebsites)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchWebsites()
//   }, [])

//   return (
//     <nav className="p-2">
//       <div className="space-y-6">
//         {/* Global Navigation */}
//         <div className="space-y-1">
//           {globalNavItems.map((item, index) => (
//             <div key={index}>
//               {item.subItems ? (
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
//                         <ChevronDown 
//                           className={`h-4 w-4 transition-transform duration-200 
//                             ${openDropdowns[item.label] ? 'rotate-180' : ''}`
//                           } 
//                         />
//                       </>
//                     )}
//                   </motion.button>

//                   <AnimatePresence>
//                     {isSidebarOpen && openDropdowns[item.label] && (
//                       <motion.div
//                         initial={{ opacity: 0, height: 0 }}
//                         animate={{ opacity: 1, height: 'auto' }}
//                         exit={{ opacity: 0, height: 0 }}
//                         transition={{ duration: 0.2 }}
//                         className="mt-1 ml-4 space-y-1"
//                       >
//                         {item.subItems.map((subItem, subIndex) => (
//                           <motion.div
//                             key={subIndex}
//                             initial={{ opacity: 0, x: -10 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ delay: subIndex * 0.05 }}
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

//         {/* Website Selector */}
//         <div className="relative">
//           <button
//             onClick={() => setWebsiteDropdownOpen(!isWebsiteDropdownOpen)}
//             className={`
//               w-full flex items-center gap-2 px-3 py-2.5 
//               ${selectedWebsite ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-700'} 
//               border border-gray-200 rounded-lg hover:bg-gray-100 
//               transition-colors duration-200
//               ${isLoading ? 'opacity-50' : ''}
//             `}
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <span className="flex items-center gap-2">
//                 <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//                 {isSidebarOpen && "Loading..."}
//               </span>
//             ) : (
//               <>
//                 {!isSidebarOpen ? (
//                   <div className="w-4 h-4 flex items-center justify-center">
//                     <div className={`w-2 h-2 rounded-full ${selectedWebsite ? 'bg-blue-500' : 'bg-gray-300'}`} />
//                   </div>
//                 ) : (
//                   <>
//                     <span>{selectedWebsite ? selectedWebsite.name : 'Select Website'}</span>
//                     <ChevronDown className={`h-4 w-4 transition-transform duration-200 
//                       ${isWebsiteDropdownOpen ? 'rotate-180' : ''}`} />
//                   </>
//                 )}
//               </>
//             )}
//           </button>
          
//           {isWebsiteDropdownOpen && isSidebarOpen && (
//             <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg 
//                          border border-gray-100 py-1 z-50">
//               {websiteList.map((website) => (
//                 <button
//                   key={website.id}
//                   onClick={() => handleWebsiteSelect(website)}
//                   className={`
//                     w-full px-3 py-2 text-left flex items-center gap-2
//                     ${selectedWebsite?.slug === website.slug 
//                       ? 'bg-blue-50 text-blue-600' 
//                       : 'text-gray-700 hover:bg-gray-50'}
//                   `}
//                 >
//                   <div className={`w-2 h-2 rounded-full ${
//                     selectedWebsite?.slug === website.slug ? 'bg-blue-500' : 'bg-gray-300'
//                   }`} />
//                   <span className="text-sm">{website.name}</span>
//                 </button>
//               ))}
              
//               {/* Add New Website Button */}
//               <div className="border-t border-gray-100 mt-1 pt-1">
//                 <button
//                   onClick={() => {
//                     setShowCreateWebsiteForm(!showCreateWebsiteForm)
//                   }}
//                   className="w-full px-3 py-2 text-left flex items-center gap-2 text-blue-600 hover:bg-blue-50"
//                 >
//                   <div className="w-4 h-4 flex items-center justify-center">+</div>
//                   <span className="text-sm font-medium">Add New Website</span>
//                 </button>
//               </div>
              
//               {/* Create Website Form */}
//               {showCreateWebsiteForm && (
//                 <div className="p-3 border-t border-gray-100">
//                   <form onSubmit={handleCreateWebsite} className="space-y-3">
//                     <div className="space-y-1">
//                       <label className="text-xs font-medium text-gray-700">Website Name</label>
//                       <input
//                         type="text"
//                         name="name"
//                         value={newWebsite.name}
//                         onChange={handleInputChange}
//                         className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
//                         placeholder="My Website"
//                         required
//                       />
//                     </div>
                    
//                     <div className="space-y-1">
//                       <label className="text-xs font-medium text-gray-700">
//                         Slug (URL identifier)
//                       </label>
//                       <input
//                         type="text"
//                         name="slug"
//                         value={newWebsite.slug}
//                         onChange={handleInputChange}
//                         className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
//                         placeholder="my-website"
//                         pattern="[a-z0-9-]+"
//                         title="Lowercase letters, numbers, and hyphens only"
//                         required
//                       />
//                       <p className="text-xs text-gray-500">
//                         Used in URL: /admin/<span className="text-blue-600">{newWebsite.slug || 'slug'}</span>/...
//                       </p>
//                     </div>
                    
//                     <div className="flex gap-2">
//                       <button
//                         type="submit"
//                         className="flex-1 px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 
//                                  transition-colors disabled:opacity-50"
//                         disabled={isLoading}
//                       >
//                         {isLoading ? 'Creating...' : 'Create Website'}
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => setShowCreateWebsiteForm(false)}
//                         className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 
//                                  transition-colors"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Website-specific Navigation */}
//         {selectedWebsite && websiteConfigs[selectedWebsite.slug as keyof typeof websiteConfigs] && (
//           <div className="space-y-1">
//             {isSidebarOpen && (
//               <div className="px-3 py-2 text-sm font-medium text-gray-500">
//                 {websiteConfigs[selectedWebsite.slug as keyof typeof websiteConfigs].name} Modules
//               </div>
//             )}

//             {websiteConfigs[selectedWebsite.slug as keyof typeof websiteConfigs].navItems.map((item, index) => (
//               <Button
//                 key={index}
//                 variant="ghost"
//                 className={`
//                   w-full justify-start gap-2 
//                   ${isActivePath(item.path) ? 'bg-blue-50 text-blue-600' : ''}
//                 `}
//                 onClick={() => router.push(item.path)}
//               >
//                 <item.icon className="h-4 w-4" />
//                 {isSidebarOpen && <span>{item.label}</span>}
//               </Button>
//             ))}
//           </div>
//         )}
//       </div>
//     </nav>
//   )
// }







// static


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
  PlusCircle,
  LucideIcon
} from 'lucide-react'

// Types
interface NavItem {
  icon: LucideIcon
  label: string
  path: string
  subItems?: Omit<NavItem, 'subItems'>[]
}

interface Website {
  id: number
  name: string
  slug: string
}

// Global navigation items
const globalNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { 
    icon: Users, 
    label: 'User Management', 
    path: '/admin/users',
    subItems: [
      { icon: UserRound, label: 'All Users', path: '/admin/manageUser/users' },
      { icon: UserCog, label: 'Roles', path: '/admin/manageUser/roles' },
      { icon: UserCog, label: 'Permissions', path: '/admin/manageUser/permissions' },
    ]
  },
  { icon: BarChart, label: 'Analytics', path: '/admin/analytics' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' }
]

// Website-specific navigation items by slug
const websiteNavItems: Record<string, NavItem[]> = {
  'parasole': [
    { icon: Home, label: 'Home', path: '/admin/parasole/home' },
    { icon: Info, label: 'About', path: '/admin/parasole/about' },
    { icon: Shield, label: 'Compliance', path: '/admin/parasole/compliance' },
    { icon: Settings, label: 'Operations', path: '/admin/parasole/operations' },
    { icon: Users, label: 'Buyers', path: '/admin/parasole/buyers' },
    { icon: Phone, label: 'Contact', path: '/admin/parasole/contact' }
  ],
  'paragon': [
    { icon: Home, label: 'Home', path: '/admin/paragon/home' },
    { icon: Info, label: 'About', path: '/admin/paragon/about' },
    { icon: Trophy, label: 'Milestones', path: '/admin/paragon/milestones' },
    { icon: Briefcase, label: 'Business Activities', path: '/admin/paragon/business' },
    { icon: Building2, label: 'Companies', path: '/admin/paragon/companies' },
    { icon: UserPlus, label: 'Career', path: '/admin/paragon/career' },
    { icon: ImageIcon, label: 'Media', path: '/admin/paragon/media' },
    { icon: Phone, label: 'Contact', path: '/admin/paragon/contact' }
  ]
}

// Default websites
const defaultWebsites: Website[] = [
  { id: 1, name: 'Parasole', slug: 'parasole' },
  { id: 2, name: 'Paragon', slug: 'paragon' }
]

export function Navigation({ isSidebarOpen = true }) {
  const router = useRouter()
  const pathname = usePathname()
  
  // State
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({})
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null)
  const [isWebsiteDropdownOpen, setWebsiteDropdownOpen] = useState(false)
  const [websiteList, setWebsiteList] = useState<Website[]>(defaultWebsites)
  const [showCreateWebsiteForm, setShowCreateWebsiteForm] = useState(false)
  const [newWebsite, setNewWebsite] = useState({ name: '', slug: '' })

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
    setWebsiteDropdownOpen(false)
    router.push(`/admin/${website.slug}/home`)
  }
  
  const handleCreateWebsite = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newWebsite.name || !newWebsite.slug) {
      alert('Please fill in all fields')
      return
    }
    
    // Validate slug format (lowercase, alphanumeric, hyphens only)
    if (!/^[a-z0-9-]+$/.test(newWebsite.slug)) {
      alert('Slug must contain only lowercase letters, numbers, and hyphens')
      return
    }
    
    // Check if slug already exists
    if (websiteList.some(website => website.slug === newWebsite.slug)) {
      alert('A website with this slug already exists')
      return
    }
    
    // Create new website (static)
    const createdWebsite = { 
      id: websiteList.length + 1,
      name: newWebsite.name, 
      slug: newWebsite.slug 
    }
    
    // Add new website to the list
    setWebsiteList(prev => [...prev, createdWebsite])
    
    // Create default navigation items for the new website
    websiteNavItems[newWebsite.slug] = [
      { icon: Home, label: 'Home', path: `/admin/${newWebsite.slug}/home` },
      { icon: Info, label: 'About', path: `/admin/${newWebsite.slug}/about` },
      { icon: Phone, label: 'Contact', path: `/admin/${newWebsite.slug}/contact` }
    ]
    
    // Select the newly created website
    setSelectedWebsite(createdWebsite)
    
    // Reset form and close it
    setNewWebsite({ name: '', slug: '' })
    setShowCreateWebsiteForm(false)
    setWebsiteDropdownOpen(false)
    
    // Navigate to the new website
    router.push(`/admin/${createdWebsite.slug}/home`)
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewWebsite(prev => ({ ...prev, [name]: value }))
    
    // Auto-generate slug from name if slug is empty
    if (name === 'name' && !newWebsite.slug) {
      setNewWebsite(prev => ({ 
        ...prev, 
        slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') 
      }))
    }
  }

  // Set website from URL on component mount
  useEffect(() => {
    const pathSegments = pathname.split('/')
    if (pathSegments.length > 2) {
      const slugFromUrl = pathSegments[2]
      const websiteFromUrl = websiteList.find(w => w.slug === slugFromUrl)
      if (websiteFromUrl) {
        setSelectedWebsite(websiteFromUrl)
      }
    }
  }, [pathname, websiteList])

  return (
    <nav className="p-2">
      <div className="space-y-6">
        {/* Global Navigation */}
        <div className="space-y-1">
          {globalNavItems.map((item, index) => (
            <div key={index}>
              {item.subItems ? (
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
                        <ChevronDown 
                          className={`h-4 w-4 transition-transform duration-200 
                            ${openDropdowns[item.label] ? 'rotate-180' : ''}`
                          } 
                        />
                      </>
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {isSidebarOpen && openDropdowns[item.label] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-1 ml-4 space-y-1"
                      >
                        {item.subItems.map((subItem, subIndex) => (
                          <motion.div
                            key={subIndex}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: subIndex * 0.05 }}
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

        {/* Website Selector */}
        <div className="relative">
          <button
            onClick={() => setWebsiteDropdownOpen(!isWebsiteDropdownOpen)}
            className={`
              w-full flex items-center gap-2 px-3 py-2.5 
              ${selectedWebsite ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-700'} 
              border border-gray-200 rounded-lg hover:bg-gray-100 
              transition-colors duration-200
            `}
          >
            {!isSidebarOpen ? (
              <div className="w-4 h-4 flex items-center justify-center">
                <div className={`w-2 h-2 rounded-full ${selectedWebsite ? 'bg-blue-500' : 'bg-gray-300'}`} />
              </div>
            ) : (
              <>
                <span>{selectedWebsite ? selectedWebsite.name : 'Select Website'}</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 
                  ${isWebsiteDropdownOpen ? 'rotate-180' : ''}`} />
              </>
            )}
          </button>
          
          {isWebsiteDropdownOpen && isSidebarOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg 
                          border border-gray-100 py-1 z-50">
              {websiteList.map((website) => (
                <button
                  key={website.id}
                  onClick={() => handleWebsiteSelect(website)}
                  className={`
                    w-full px-3 py-2 text-left flex items-center gap-2
                    ${selectedWebsite?.slug === website.slug 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-50'}
                  `}
                >
                  <div className={`w-2 h-2 rounded-full ${
                    selectedWebsite?.slug === website.slug ? 'bg-blue-500' : 'bg-gray-300'
                  }`} />
                  <span className="text-sm">{website.name}</span>
                </button>
              ))}
              
              {/* Add New Website Button */}
              <div className="border-t border-gray-100 mt-1 pt-1">
                <button
                  onClick={() => {
                    setShowCreateWebsiteForm(!showCreateWebsiteForm)
                  }}
                  className="w-full px-3 py-2 text-left flex items-center gap-2 text-blue-600 hover:bg-blue-50"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Add New Website</span>
                </button>
              </div>
              
              {/* Create Website Form */}
              {showCreateWebsiteForm && (
                <div className="p-3 border-t border-gray-100">
                  <form onSubmit={handleCreateWebsite} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-700">Website Name</label>
                      <input
                        type="text"
                        name="name"
                        value={newWebsite.name}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        placeholder="My Website"
                        required
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-700">
                        Slug (URL identifier)
                      </label>
                      <input
                        type="text"
                        name="slug"
                        value={newWebsite.slug}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        placeholder="my-website"
                        pattern="[a-z0-9-]+"
                        title="Lowercase letters, numbers, and hyphens only"
                        required
                      />
                      <p className="text-xs text-gray-500">
                        Used in URL: /admin/<span className="text-blue-600">{newWebsite.slug || 'slug'}</span>/...
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 
                                 transition-colors"
                      >
                        Create Website
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCreateWebsiteForm(false)}
                        className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 
                                 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Website-specific Navigation */}
        {selectedWebsite && websiteNavItems[selectedWebsite.slug] && (
          <div className="space-y-1">
            {isSidebarOpen && (
              <div className="px-3 py-2 text-sm font-medium text-gray-500">
                {selectedWebsite.name} Modules
              </div>
            )}

            {websiteNavItems[selectedWebsite.slug].map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className={`
                  w-full justify-start gap-2 
                  ${isActivePath(item.path) ? 'bg-blue-50 text-blue-600' : ''}
                `}
                onClick={() => router.push(item.path)}
              >
                <item.icon className="h-4 w-4" />
                {isSidebarOpen && <span>{item.label}</span>}
              </Button>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}