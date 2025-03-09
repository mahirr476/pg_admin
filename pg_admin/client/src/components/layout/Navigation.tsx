

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
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  // Toggle dropdown function
  const toggleDropdown = (section: string): void => {
    setOpenDropdowns(prev => {
      const newState = { ...prev };
      // Close other dropdowns if they're open
      if (!prev[section]) {
        Object.keys(newState).forEach(key => {
          if (key !== section) newState[key] = false;
        });
      }
      newState[section] = !prev[section];
      return newState;
    });
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
          
          // If Super Admin, show User Management and Audit Logs
          if (isSuperAdmin) {
            setShowUserManagement(true)
            setShowAuditLogs(true)
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
              
              if (permData.status === "success" && permData.rolePermission) {
                // Store the permissions for later use
                setUserPermissions(permData.rolePermission)
                
                // Check for user_view permission
                const hasUserViewPermission = permData.rolePermission.user_view === true
                // Check for audit_view permission
                const hasAuditViewPermission = permData.rolePermission.audit_view === true
                
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

  // Set website from URL on component mount
  useEffect(() => {
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
      }
    }
  }, [pathname, websiteList, setSelectedWebsite])

  // Navigation item styles
  const navItemBaseStyle = "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 font-medium"
  const navItemActiveStyle = "bg-blue-100 text-blue-700 shadow-sm"
  const navItemHoverStyle = "hover:bg-gray-100 hover:shadow-sm"
  const navItemInactiveStyle = "text-gray-700"
  const dropdownItemStyle = "ml-4 px-3 py-2.5 rounded-md text-sm flex items-center gap-2.5 transition-all duration-200"

  // Loading state
  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center h-screen">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-sm font-medium text-gray-700">Loading navigation...</span>
        </div>
      </div>
    )
  }

  return (
    <nav className={`px-3 py-5 h-full overflow-y-auto scrollbar-hide ${isSidebarOpen ? "w-64" : "w-16"} transition-all duration-300 ease-in-out bg-white rounded-lg shadow-sm`}>
      <div className="space-y-6">
        {/* Basic Navigation Items */}
        <div className="space-y-1.5">
          {/* Dashboard (Always visible) */}
          <button
            className={`${navItemBaseStyle} ${
              isActivePath('/admin/dashboard') ? navItemActiveStyle : navItemInactiveStyle
            } ${navItemHoverStyle} group`}
            onClick={() => router.push('/admin/dashboard')}
            onMouseEnter={() => setHoveredItem('dashboard')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className={`${isActivePath('/admin/dashboard') ? "text-blue-600" : "text-gray-500"} 
                            ${hoveredItem === 'dashboard' ? "scale-110" : ""} transition-all duration-200`}>
              <LayoutDashboard className="h-5 w-5" />
            </div>
            {isSidebarOpen && (
              <span className="transition-all duration-200 font-medium">Dashboard</span>
            )}
          </button>
          
          {/* AUDIT LOGS - Only shown based on permission check */}
          {showAuditLogs && (
            <button
              className={`${navItemBaseStyle} ${
                isActivePath('/admin/audit') ? navItemActiveStyle : navItemInactiveStyle
              } ${navItemHoverStyle} group`}
              onClick={() => router.push('/admin/audit')}
              onMouseEnter={() => setHoveredItem('audit')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className={`${isActivePath('/admin/audit') ? "text-blue-600" : "text-gray-500"} 
                              ${hoveredItem === 'audit' ? "scale-110" : ""} transition-all duration-200`}>
                <ClipboardList className="h-5 w-5" />
              </div>
              {isSidebarOpen && (
                <span className="transition-all duration-200 font-medium">Audit Logs</span>
              )}
            </button>
          )}
          
          {/* USER MANAGEMENT - Only shown based on permission check */}
          {showUserManagement && (
            <div className="relative">
              <button
                onClick={() => toggleDropdown('UserManagement')}
                className={`${navItemBaseStyle} ${
                  openDropdowns['UserManagement'] || isActivePath('/admin/manageUser') ? navItemActiveStyle : navItemInactiveStyle
                } ${navItemHoverStyle} group`}
                onMouseEnter={() => setHoveredItem('users')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className={`${openDropdowns['UserManagement'] || isActivePath('/admin/manageUser') ? "text-blue-600" : "text-gray-500"} 
                                ${hoveredItem === 'users' ? "scale-110" : ""} transition-all duration-200`}>
                  <Users className="h-5 w-5" />
                </div>
                {isSidebarOpen && (
                  <>
                    <span className="flex-1 transition-all duration-200 font-medium">User Management</span>
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform duration-300 ${openDropdowns['UserManagement'] ? "rotate-180" : ""}`} 
                    />
                  </>
                )}
              </button>

              {isSidebarOpen && (
                <div 
                  className={`mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                    openDropdowns['UserManagement'] ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <button
                    className={`${dropdownItemStyle} ${
                      isActivePath('/admin/manageUser/users') ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                    }`}
                    onClick={() => router.push('/admin/manageUser/users')}
                  >
                    <UserRound className="h-4 w-4" />
                    <span>All Users</span>
                  </button>
                  
                  <button
                    className={`${dropdownItemStyle} ${
                      isActivePath('/admin/manageUser/roles') ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                    }`}
                    onClick={() => router.push('/admin/manageUser/roles')}
                  >
                    <UserCog className="h-4 w-4" />
                    <span>User Roles</span>
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Analytics */}
          <button
            className={`${navItemBaseStyle} ${
              isActivePath('/admin/analytics') ? navItemActiveStyle : navItemInactiveStyle
            } ${navItemHoverStyle} group`}
            onClick={() => router.push('/admin/analytics')}
            onMouseEnter={() => setHoveredItem('analytics')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className={`${isActivePath('/admin/analytics') ? "text-blue-600" : "text-gray-500"} 
                            ${hoveredItem === 'analytics' ? "scale-110" : ""} transition-all duration-200`}>
              <BarChart className="h-5 w-5" />
            </div>
            {isSidebarOpen && (
              <span className="transition-all duration-200 font-medium">Analytics</span>
            )}
          </button>
          
          {/* Settings */}
          <button
            className={`${navItemBaseStyle} ${
              isActivePath('/admin/settings') ? navItemActiveStyle : navItemInactiveStyle
            } ${navItemHoverStyle} group`}
            onClick={() => router.push('/admin/settings')}
            onMouseEnter={() => setHoveredItem('settings')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className={`${isActivePath('/admin/settings') ? "text-blue-600" : "text-gray-500"} 
                            ${hoveredItem === 'settings' ? "scale-110" : ""} transition-all duration-200`}>
              <Settings className="h-5 w-5" />
            </div>
            {isSidebarOpen && (
              <span className="transition-all duration-200 font-medium">Settings</span>
            )}
          </button>
        </div>

        {/* Divider */}
        {isSidebarOpen && (
          <div className="border-t border-gray-200 my-4"></div>
        )}

        {/* Website Section */}
        {websiteList.length > 0 && (
          <div className="space-y-3">
            {isSidebarOpen && (
              <div className="px-4 py-1 text-xs font-semibold text-blue-600 uppercase tracking-wider">
                Websites
              </div>
            )}

            {/* Website Selector Button */}
            <button
              onClick={() => toggleDropdown('WebsiteSelector')}
              className={`${navItemBaseStyle} ${
                openDropdowns['WebsiteSelector'] ? navItemActiveStyle : navItemInactiveStyle
              } ${navItemHoverStyle} group bg-blue-50 bg-opacity-50 border border-blue-100 rounded-lg`}
              onMouseEnter={() => setHoveredItem('websites')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className={`${openDropdowns['WebsiteSelector'] ? "text-blue-600" : "text-blue-500"} 
                              ${hoveredItem === 'websites' ? "scale-110" : ""} transition-all duration-200`}>
                <Globe className="h-5 w-5" />
              </div>
              {isSidebarOpen && (
                <>
                  <span className="flex-1 transition-all duration-200 font-medium">
                    {selectedWebsite ? selectedWebsite.name : 'Select Website'}
                  </span>
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform duration-300 text-blue-500 ${openDropdowns['WebsiteSelector'] ? "rotate-180" : ""}`} 
                  />
                </>
              )}
            </button>
            
            {/* Website List Dropdown */}
            {isSidebarOpen && (
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openDropdowns['WebsiteSelector'] ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="ml-4 py-1 space-y-1.5">
                  {websiteList.map((website, index) => (
                    <button
                      key={index}
                      className={`${dropdownItemStyle} ${
                        selectedWebsite?.slug === website.slug 
                          ? "bg-blue-100 text-blue-700 font-medium" 
                          : "text-gray-600 hover:bg-blue-50"
                      } rounded-md`}
                      onClick={() => {
                        setSelectedWebsite(website)
                        toggleDropdown('WebsiteSelector')
                        setOpenDropdowns(prev => ({ ...prev, 'WebsiteModules': true }))
                        router.push(`/admin/${website.slug}/home`)
                      }}
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        selectedWebsite?.slug === website.slug ? 'bg-blue-500' : 'bg-gray-300'
                      }`} />
                      <span>{website.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Website Modules */}
            {selectedWebsite && websiteConfigs[selectedWebsite.slug] && (
              <>
                <button
                  onClick={() => toggleDropdown('WebsiteModules')}
                  className={`${navItemBaseStyle} ${
                    openDropdowns['WebsiteModules'] ? navItemActiveStyle : navItemInactiveStyle
                  } ${navItemHoverStyle} group bg-gray-50 border border-gray-100 rounded-lg`}
                  onMouseEnter={() => setHoveredItem('modules')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className={`${openDropdowns['WebsiteModules'] ? "text-blue-600" : "text-gray-600"} 
                                  ${hoveredItem === 'modules' ? "scale-110" : ""} transition-all duration-200`}>
                    <Settings className="h-5 w-5" />
                  </div>
                  {isSidebarOpen && (
                    <>
                      <span className="flex-1 transition-all duration-200 font-medium">
                        {selectedWebsite.name} Modules
                      </span>
                      <ChevronDown 
                        className={`h-4 w-4 transition-transform duration-300 ${openDropdowns['WebsiteModules'] ? "rotate-180" : ""}`}
                      />
                    </>
                  )}
                </button>
                
                {/* Website Module Items */}
                {isSidebarOpen && (
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openDropdowns['WebsiteModules'] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="ml-4 py-1 space-y-2">
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
                          
                          // If they passed all checks, show the item
                          return true;
                        })
                        .map((item, index) => (
                          <button
                            key={index}
                            className={`${dropdownItemStyle} ${
                              isActivePath(item.path) 
                                ? "bg-blue-100 text-blue-700 font-medium" 
                                : "text-gray-600 hover:bg-blue-50"
                            } group rounded-md hover:shadow-sm transition-all`}
                            onClick={() => router.push(item.path)}
                          >
                            <div className={`${isActivePath(item.path) ? "text-blue-500" : "text-gray-500"} 
                                           group-hover:scale-110 transition-all duration-200`}>
                              <item.icon className="h-4 w-4" />
                            </div>
                            <span className="transition-all duration-200">{item.label}</span>
                          </button>
                        ))
                      }
                    </div>
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