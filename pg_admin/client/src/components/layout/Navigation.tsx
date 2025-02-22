"use client"

import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useWebsite } from '@/providers/WebsiteProvider'
import { Button } from "@/components/ui/button"
import { LucideIcon, LayoutGrid } from 'lucide-react'
import { 
  LayoutDashboard, 
  Users, 
  BarChart, 
  Settings,
  UserRound,
  UserCog,
  Lock,
  ChevronDown,
  Home,
  Info,
  Shield,
  Building2,
  UserPlus,
  Image as ImageIcon,
  Phone,
  Trophy,
  Briefcase,
  ChevronRight
} from 'lucide-react'
import { useState } from 'react'

interface NavItem {
  icon: LucideIcon
  label: string
  path: string
  subItems?: Omit<NavItem, 'subItems'>[]
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
    path: '/admin/users', // Added this line to fix the error
    subItems: [
      { 
        icon: UserRound, 
        label: 'All Users', 
        path: '/admin/manageUser/users' 
      },
      { 
        icon: UserCog, 
        label: 'Roles', 
        path: '/admin/manageUser/roles' 
      },
      { 
        icon: UserCog, 
        label: 'Permissions', 
        path: '/admin/manageUser/permissions' 
      },
   
    ]
  },
  { 
    icon: BarChart, 
    label: 'Analytics', 
    path: '/admin/analytics' 
  },
  { 
    icon: Settings, 
    label: 'Settings', 
    path: '/admin/settings' 
  }
]


const websiteNavItems: Record<string, { icon: LucideIcon; label: string; path: string }[]> = {
  parasole: [
    { icon: Home, label: 'Home', path: '/admin/parasole/home' },
    { icon: Info, label: 'About', path: '/admin/parasole/about' },
    { icon: Shield, label: 'Compliance', path: '/admin/parasole/compliance' },
    { icon: Settings, label: 'Operations', path: '/admin/parasole/operations' },
    { icon: Users, label: 'Buyers', path: '/admin/parasole/buyers' },
    { icon: Phone, label: 'Contact', path: '/admin/parasole/contact' }
  ],
  paragon: [
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

const websites = [
  { id: 1, name: 'Parasole', slug: 'parasole' },
  { id: 2, name: 'Paragon Group', slug: 'paragon' }
] as const

interface NavigationProps {
  isSidebarOpen: boolean
  selectedWebsite: { slug: 'parasole' | 'paragon'; name: string } | null
  openDropdowns: { [key: string]: boolean }
  toggleDropdown: (section: string) => void
}

export function Navigation({
  isSidebarOpen,
  selectedWebsite,
  openDropdowns,
  toggleDropdown
}: NavigationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { setSelectedWebsite } = useWebsite()
  const [isWebsiteDropdownOpen, setWebsiteDropdownOpen] = useState(false)

  const isActivePath = (path: string) => pathname.startsWith(path)

  const handleWebsiteSelect = (website: typeof websites[number]) => {
    setSelectedWebsite(website)
    setWebsiteDropdownOpen(false)
    router.push(`/admin/${website.slug}/home`)
  }

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

        {/* Website Selector Section
        <div className="space-y-1 ">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setWebsiteDropdownOpen(!isWebsiteDropdownOpen)}
            className={`
              w-full flex items-center gap-2 px-3 py-2 border-2
              text-gray-700 hover:bg-gray-100 rounded-lg 
              transition-colors duration-200
              ${isWebsiteDropdownOpen ? 'bg-gray-100' : ''}
            `}
          >
            <LayoutGrid className="h-4 w-4" />
            {isSidebarOpen && (
              <>
                <span className="flex-1">
                  {selectedWebsite ? selectedWebsite.name : 'Select Website'}
                </span>
                <ChevronDown 
                  className={`h-4 w-4 transition-transform duration-200 
                    ${isWebsiteDropdownOpen ? 'rotate-180' : ''}`
                  } 
                />
              </>
            )}
          </motion.button>

          <AnimatePresence>
            {isSidebarOpen && isWebsiteDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-1 ml-4 space-y-1"
              >
                {websites.map((website) => (
                  <motion.div
                    key={website.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 }}
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
              </motion.div>
            )}
          </AnimatePresence>
        </div> */}

        {/* Website-specific Navigation */}
        {selectedWebsite && websiteNavItems[selectedWebsite.slug] && (
          <div className="space-y-1">
            <div className="px-3 text-sm font-medium text-gray-500">
              {isSidebarOpen ? `${selectedWebsite.name} Modules` : null}
            </div>
            {websiteNavItems[selectedWebsite.slug].map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className={`w-full justify-start gap-2 ${
                  isActivePath(item.path) ? 'bg-blue-50 text-blue-600' : ''
                }`}
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