
"use client"

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
  LucideIcon
} from 'lucide-react'
import { WebsiteNavigation } from './WebsiteNavigation'

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
    path: '/admin/users',
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

interface NavigationProps {
  isSidebarOpen: boolean
  selectedWebsite: { slug: string; name: string } | null
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

  const isActivePath = (path: string) => pathname.startsWith(path)

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

        {/* Website-specific Navigation */}
        {selectedWebsite && (
          <WebsiteNavigation 
            selectedWebsite={selectedWebsite}
            isSidebarOpen={isSidebarOpen}
            pathname={pathname}
          />
        )}
      </div>
    </nav>
  )
}