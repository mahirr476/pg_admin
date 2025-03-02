
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




"use client"

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, Users, BarChart, Settings, UserRound, UserCog, ChevronDown,
  Home, Info, Shield, Phone, Trophy, Briefcase, Building2, UserPlus, ImageIcon 
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useWebsite } from '@/providers/WebsiteProvider'
import Cookies from 'js-cookie'
import { Website } from '@/providers/WebsiteProvider'

type LucideIcon = typeof Home

interface NavItem {
  icon: LucideIcon
  label: string
  path: string
  subItems?: Omit<NavItem, 'subItems'>[]
}

interface WebsiteNavItem {
  icon: LucideIcon
  label: string
  path: string
}

interface WebsiteConfig {
  name: string
  slug: string
  navItems: WebsiteNavItem[]
}

const globalNavItems: NavItem[] = [
  { 
    icon: LayoutDashboard, 
    label: 'Dashboard', 
    path: '/admin/dashboard' 
  },
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

const websiteConfigs: WebsiteConfig[] = [
  {
    name: 'Parasole',
    slug: 'parasole',
    navItems: [
      { icon: Home, label: 'Home', path: '/admin/parasole/home' },
      { icon: Info, label: 'About', path: '/admin/parasole/about' },
      { icon: Shield, label: 'Compliance', path: '/admin/parasole/compliance' },
      { icon: Settings, label: 'Operations', path: '/admin/parasole/operations' },
      { icon: Users, label: 'Buyers', path: '/admin/parasole/buyers' },
      { icon: Phone, label: 'Contact', path: '/admin/parasole/contact' }
    ]
  },
  {
    name: 'Paragon',
    slug: 'paragon',
    navItems: [
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
]

export function Navigation({ isSidebarOpen }: { isSidebarOpen: boolean }) {
  const router = useRouter()
  const pathname = usePathname()
  const { selectedWebsite, setSelectedWebsite } = useWebsite()
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({})
  const [websiteList, setWebsiteList] = useState<Website[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const isActivePath = (path: string) => pathname.startsWith(path)
  const toggleDropdown = (section: string) => setOpenDropdowns(prev => ({ ...prev, [section]: !prev[section] }))

  useEffect(() => {
    const fetchWebsites = async () => {
      setIsLoading(true)
      try {
        const token = Cookies.get('token')
        const response = await fetch('http://localhost:7000/api/v1/website', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        const data = await response.ok ? await response.json() : { websites: websiteConfigs }
        setWebsiteList(data.websites || websiteConfigs)
        
        // Set initial website from URL
        const slugFromUrl = window.location.pathname.split('/')[2]
        const initialWebsite = data.websites?.find((w: Website) => w.slug === slugFromUrl) || websiteConfigs[0]
        setSelectedWebsite(initialWebsite)
      } catch (err) {
        setWebsiteList(websiteConfigs)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWebsites()
  }, [])

  const handleWebsiteSelect = (website: Website) => {
    setSelectedWebsite(website)
    router.push(`/admin/${website.slug}/home`)
  }

  const currentWebsite = websiteList.find(config => config.slug === selectedWebsite?.slug)

  return (
    <nav className="p-2 space-y-6">
      {/* Website Selector */}
      <div className="relative mb-4">
        <button
          onClick={() => setOpenDropdowns(prev => ({ ...prev, website: !prev.website }))}
          className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors
            ${selectedWebsite ? 'bg-blue-50 text-blue-600' : 'bg-gray-50'} border border-gray-200`}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              Loading...
            </div>
          ) : (
            <>
              <span>{selectedWebsite?.name || 'Select Website'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${openDropdowns.website ? 'rotate-180' : ''}`} />
            </>
          )}
        </button>

        <AnimatePresence>
          {openDropdowns.website && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-100"
            >
              {websiteList.map(website => (
                <button
                  key={website.slug}
                  onClick={() => handleWebsiteSelect(website)}
                  className={`w-full px-4 py-2.5 text-left flex items-center gap-2
                    ${selectedWebsite?.slug === website.slug ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                >
                  <div className={`w-2 h-2 rounded-full ${selectedWebsite?.slug === website.slug ? 'bg-blue-500' : 'bg-gray-300'}`} />
                  {website.name}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Global Navigation */}
      <div className="space-y-1">
        {globalNavItems.map((item, index) => (
          <div key={index}>
            {item.subItems ? (
              <>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleDropdown(item.label)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
                    ${openDropdowns[item.label] || isActivePath(item.path) ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                >
                  <item.icon className="h-4 w-4" />
                  {isSidebarOpen && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${openDropdowns[item.label] ? 'rotate-180' : ''}`} />
                    </>
                  )}
                </motion.button>

                <AnimatePresence>
                  {isSidebarOpen && openDropdowns[item.label] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-4 space-y-1"
                    >
                      {item.subItems.map((subItem, subIndex) => (
                        <Button
                          key={subIndex}
                          variant="ghost"
                          className={`w-full justify-start gap-2 text-sm ${isActivePath(subItem.path) ? 'bg-blue-50' : ''}`}
                          onClick={() => router.push(subItem.path)}
                        >
                          <subItem.icon className="h-4 w-4" />
                          {isSidebarOpen && <span>{subItem.label}</span>}
                        </Button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Button
                variant="ghost"
                className={`w-full justify-start gap-2 ${isActivePath(item.path) ? 'bg-blue-50 text-blue-600' : ''}`}
                onClick={() => router.push(item.path)}
              >
                <item.icon className="h-4 w-4" />
                {isSidebarOpen && <span>{item.label}</span>}
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Website-specific Navigation */}
      {currentWebsite && (
        <div className="space-y-1">
          {isSidebarOpen && (
            <div className="px-3 py-2 text-sm font-medium text-gray-500">
              {currentWebsite.name} Modules
            </div>
          )}
          {currentWebsite.navItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className={`w-full justify-start gap-2 ${isActivePath(item.path) ? 'bg-blue-50 text-blue-600' : ''}`}
              onClick={() => router.push(item.path)}
            >
              <item.icon className="h-4 w-4" />
              {isSidebarOpen && <span>{item.label}</span>}
            </Button>
          ))}
        </div>
      )}
    </nav>
  )
}