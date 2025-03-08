
"use client"

import { useState, useEffect, useRef } from 'react'
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
  Globe,
  Loader2,
  Home,
  Info,
  Shield,
  Phone,
  Trophy,
  Briefcase,
  Building2,
  UserPlus,
  Image as ImageIcon
} from 'lucide-react'
import { usePermissions } from '@/providers/permission-context'
import { useWebsite } from '@/providers/WebsiteProvider'
import Cookies from "js-cookie"

// Types
interface Website {
  id: number;
  name: string;
  slug: string;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  requiredPermission: string;
}

interface WebsiteConfig {
  name: string;
  navItems: NavItem[];
}

interface WebsiteConfigs {
  [key: string]: WebsiteConfig;
}

interface User {
  role: string;
  roleId: string;
}

interface Permissions {
  [key: string]: boolean;
}

interface NavigationProps {
  isSidebarOpen?: boolean;
}

// Website-specific configuration
const websiteConfigs: WebsiteConfigs = {
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

export function Navigation({ isSidebarOpen = true }: NavigationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const permissionsContext = usePermissions()
  const { selectedWebsite, setSelectedWebsite } = useWebsite()
  
  // Local state
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({})
  const [websiteList] = useState<Website[]>([
    { id: 1, name: 'Parasole', slug: 'parasole' },
    { id: 2, name: 'Paragon', slug: 'paragon' }
  ])
  const [showUserManagement, setShowUserManagement] = useState<boolean>(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [userPermissions, setUserPermissions] = useState<Permissions | null>(null)
  
  // Refs for measuring dropdown heights
  const userManagementRef = useRef<HTMLDivElement>(null)
  const websiteSelectorRef = useRef<HTMLDivElement>(null)
  const websiteModulesRef = useRef<HTMLDivElement>(null)

  // Toggle dropdown function
  const toggleDropdown = (section: string) => {
    setOpenDropdowns(prev => ({ ...prev, [section]: !prev[section] }))
  }

  // Check if path is active
  const isActivePath = (path: string) => pathname?.startsWith(path) || false
  
  // Handle website selection
  const handleWebsiteSelect = (website: Website) => {
    setSelectedWebsite(website)
    // Close the website selector dropdown
    setOpenDropdowns(prev => ({ ...prev, 'WebsiteSelector': false }))
    // Open the website modules dropdown
    setOpenDropdowns(prev => ({ ...prev, 'WebsiteModules': true }))
    router.push(`/admin/${website.slug}/home`)
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

  // Bypass the permission context and fetch user data directly
  useEffect(() => {
    const fetchCurrentUser = async () => {
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
          
          // If Super Admin, show User Management
          if (isSuperAdmin) {
            setShowUserManagement(true)
            console.log("User Management shown for Super Admin")
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
                console.log("Has user_view permission:", hasUserViewPermission)
                
                setShowUserManagement(hasUserViewPermission)
              } else {
                setShowUserManagement(false)
              }
            } else {
              setShowUserManagement(false)
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

  // Set website from URL on component mount
  useEffect(() => {
    const pathSegments = pathname?.split('/') || []
    if (pathSegments.length > 2) {
      const slugFromUrl = pathSegments[2]
      const websiteFromUrl = websiteList.find(w => w.slug === slugFromUrl)
      if (websiteFromUrl) {
        setSelectedWebsite(websiteFromUrl)
        // Automatically open the Website Modules dropdown when loading from URL
        setOpenDropdowns(prev => ({
          ...prev,
          'WebsiteModules': true
        }))
      }
    }
  }, [pathname, websiteList, setSelectedWebsite])

  // Loading state
  if (isLoading) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-64 bg-white/70 rounded-lg shadow-sm">
        <div className="animate-spin">
          <Loader2 className="h-8 w-8 text-blue-500" />
        </div>
        <span className="mt-4 text-gray-600">Loading navigation...</span>
      </div>
    )
  }

  return (
    <nav className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md transition-all duration-300 ease-in-out">
      <div className="space-y-6">
        {/* Basic Navigation Items */}
        <div className="space-y-1">
          {/* Dashboard (Always visible) */}
          <div className="group">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 transition-all duration-150 group-hover:translate-x-1 ${
                isActivePath('/admin/dashboard') ? 'bg-blue-50 text-blue-600 font-medium' : ''
              }`}
              onClick={() => router.push('/admin/dashboard')}
            >
              <LayoutDashboard className="h-4 w-4" />
              {isSidebarOpen && <span>Dashboard</span>}
            </Button>
          </div>
          
          {/* USER MANAGEMENT - Only shown based on permission check */}
          {showUserManagement && (
            <div>
              <button
                onClick={() => toggleDropdown('UserManagement')}
                className={`
                  w-full flex items-center gap-2 px-3 py-2 
                  text-gray-700 hover:bg-gray-100 rounded-lg 
                  transition-all duration-200 ease-in-out hover:translate-x-1
                  ${openDropdowns['UserManagement'] ? 'bg-gray-100' : ''}
                  ${isActivePath('/admin/users') || isActivePath('/admin/manageUser') ? 'bg-blue-50 text-blue-600 font-medium' : ''}
                `}
              >
                <Users className="h-4 w-4" />
                {isSidebarOpen && (
                  <>
                    <span className="flex-1">User Management</span>
                    <ChevronDown 
                      className={`h-4 w-4 transform transition-transform duration-300 ease-in-out ${openDropdowns['UserManagement'] ? 'rotate-180' : 'rotate-0'}`} 
                    />
                  </>
                )}
              </button>

              {isSidebarOpen && (
                <div 
                  ref={userManagementRef}
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openDropdowns['UserManagement'] 
                      ? 'max-h-40 opacity-100'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="mt-1 ml-4 space-y-1 py-1">
                    <div className="group transition-all duration-200 ease-in-out">
                      <Button
                        variant="ghost"
                        className={`w-full justify-start gap-2 text-sm transition-all duration-200 group-hover:translate-x-1 ${
                          isActivePath('/admin/manageUser/users') ? 'bg-blue-50 text-blue-600 font-medium' : ''
                        }`}
                        onClick={() => router.push('/admin/manageUser/users')}
                      >
                        <UserRound className="h-4 w-4" />
                        <span>All Users</span>
                      </Button>
                    </div>
                    
                    <div className="group transition-all duration-200 ease-in-out">
                      <Button
                        variant="ghost"
                        className={`w-full justify-start gap-2 text-sm transition-all duration-200 group-hover:translate-x-1 ${
                          isActivePath('/admin/manageUser/roles') ? 'bg-blue-50 text-blue-600 font-medium' : ''
                        }`}
                        onClick={() => router.push('/admin/manageUser/roles')}
                      >
                        <UserCog className="h-4 w-4" />
                        <span>User Roles</span>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Analytics */}
          <div className="group">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 transition-all duration-150 group-hover:translate-x-1 ${
                isActivePath('/admin/analytics') ? 'bg-blue-50 text-blue-600 font-medium' : ''
              }`}
              onClick={() => router.push('/admin/analytics')}
            >
              <BarChart className="h-4 w-4" />
              {isSidebarOpen && <span>Analytics</span>}
            </Button>
          </div>
          
          {/* Settings */}
          <div className="group">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 transition-all duration-150 group-hover:translate-x-1 ${
                isActivePath('/admin/settings') ? 'bg-blue-50 text-blue-600 font-medium' : ''
              }`}
              onClick={() => router.push('/admin/settings')}
            >
              <Settings className="h-4 w-4" />
              {isSidebarOpen && <span>Settings</span>}
            </Button>
          </div>
        </div>

        {/* Website Section */}
        {websiteList.length > 0 && (
          <div className="space-y-2 pt-2">
            {isSidebarOpen && (
              <div className="px-3 py-2 text-sm font-medium text-gray-500 border-t border-gray-100 pt-4">
                Websites
              </div>
            )}

            {/* Website Selector Button */}
            <button
              onClick={() => toggleDropdown('WebsiteSelector')}
              className={`
                w-full flex items-center gap-2 px-3 py-2 
                text-gray-700 hover:bg-gray-100 rounded-lg 
                transition-all duration-200 ease-in-out hover:translate-x-1
                ${openDropdowns['WebsiteSelector'] ? 'bg-gray-100' : ''}
                ${selectedWebsite ? 'text-blue-600 font-medium' : ''}
              `}
            >
              <Globe className="h-4 w-4" />
              {isSidebarOpen && (
                <>
                  <span className="flex-1">
                    {selectedWebsite ? selectedWebsite.name : 'Select Website'}
                  </span>
                  <ChevronDown 
                    className={`h-4 w-4 transform transition-transform duration-300 ease-in-out ${openDropdowns['WebsiteSelector'] ? 'rotate-180' : 'rotate-0'}`} 
                  />
                </>
              )}
            </button>
            
            {/* Website List Dropdown */}
            {isSidebarOpen && (
              <div 
                ref={websiteSelectorRef}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openDropdowns['WebsiteSelector'] 
                    ? 'max-h-40 opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="ml-4 space-y-1 py-1">
                  {websiteList.map((website, index) => (
                    <div key={index} className="group transition-all duration-200 ease-in-out">
                      <Button
                        variant="ghost"
                        className={`w-full justify-start gap-2 text-sm transition-all duration-200 group-hover:translate-x-1 ${
                          selectedWebsite?.slug === website.slug ? 'bg-blue-50 text-blue-600 font-medium' : ''
                        }`}
                        onClick={() => handleWebsiteSelect(website)}
                      >
                        <div className={`w-2 h-2 rounded-full ${
                          selectedWebsite?.slug === website.slug ? 'bg-blue-500' : 'bg-gray-300'
                        }`} />
                        <span>{website.name}</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Website Modules - Only show when a website is selected */}
            {selectedWebsite && websiteConfigs[selectedWebsite.slug] && (
              <div className="opacity-100 transition-opacity duration-300 ease-in-out">
                <button
                  onClick={() => toggleDropdown('WebsiteModules')}
                  className={`
                    w-full flex items-center gap-2 px-3 py-2 mt-2
                    text-gray-700 hover:bg-gray-100 rounded-lg 
                    transition-all duration-200 ease-in-out hover:translate-x-1
                    border-t border-gray-100 pt-4
                    ${openDropdowns['WebsiteModules'] ? 'bg-gray-100' : ''}
                  `}
                >
                  <Settings className="h-4 w-4" />
                  {isSidebarOpen && (
                    <>
                      <span className="flex-1 font-medium">
                        {selectedWebsite.name} Modules
                      </span>
                      <ChevronDown 
                        className={`h-4 w-4 transform transition-transform duration-300 ease-in-out ${openDropdowns['WebsiteModules'] ? 'rotate-180' : 'rotate-0'}`} 
                      />
                    </>
                  )}
                </button>
                
                {/* Website Module Items */}
                {isSidebarOpen && (
                  <div 
                    ref={websiteModulesRef}
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openDropdowns['WebsiteModules'] 
                        ? 'max-h-96 opacity-100'
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="ml-4 space-y-1 py-1">
                      {websiteConfigs[selectedWebsite.slug].navItems
                        .filter(item => {
                          // Check if user has permission to see this item
                          if (item.requiredPermission) {
                            // For Paragon website
                            if (selectedWebsite.slug === 'paragon' && item.requiredPermission === 'paragon_group_view') {
                              return currentUser?.role === "Super Admin" || userPermissions?.paragon_group_view === true;
                            }
                            
                            // For Parasole website
                            if (selectedWebsite.slug === 'parasole' && item.requiredPermission === 'parasole_view') {
                              return currentUser?.role === "Super Admin" || userPermissions?.parasole_view === true;
                            }
                          }
                          
                          // Default case: Super Admin sees everything, others need explicit permission
                          return currentUser?.role === "Super Admin" || hasPermission(item.requiredPermission);
                        })
                        .map((item, index) => (
                          <div key={index} className="group transition-all duration-200 ease-in-out">
                            <Button
                              variant="ghost"
                              className={`w-full justify-start gap-2 text-sm transition-all duration-200 group-hover:translate-x-1 ${
                                isActivePath(item.path) ? 'bg-blue-50 text-blue-600 font-medium' : ''
                              }`}
                              onClick={() => router.push(item.path)}
                            >
                              <item.icon className="h-4 w-4" />
                              <span>{item.label}</span>
                            </Button>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}