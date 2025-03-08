

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

// Website-specific configuration
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

export function Navigation({ isSidebarOpen = true }) {
  const router = useRouter()
  const pathname = usePathname()
  const permissionsContext = usePermissions()
  const { selectedWebsite, setSelectedWebsite } = useWebsite()
  
  // Local state
  const [openDropdowns, setOpenDropdowns] = useState({})
  const [websiteList] = useState([
    { id: 1, name: 'Parasole', slug: 'parasole' },
    { id: 2, name: 'Paragon', slug: 'paragon' }
  ])
  const [showUserManagement, setShowUserManagement] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userPermissions, setUserPermissions] = useState(null)

  // Toggle dropdown function
  const toggleDropdown = (section) => {
    setOpenDropdowns(prev => ({ ...prev, [section]: !prev[section] }))
  }

  // Check if path is active
  const isActivePath = (path) => pathname?.startsWith(path)
  
  // Handle website selection
  const handleWebsiteSelect = (website) => {
    setSelectedWebsite(website)
    toggleDropdown('WebsiteModules')
    router.push(`/admin/${website.slug}/home`)
  }

  // Function to check if user has a specific permission
  const hasPermission = (permission) => {
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
        
        // Open the Website Modules dropdown
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

        {/* Website Section */}
        {websiteList.length > 0 && (
          <div className="space-y-1">
            {isSidebarOpen && (
              <div className="px-3 py-2 text-sm font-medium text-gray-500">
                Websites
              </div>
            )}

            {/* Website Selector Button */}
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
                  <ChevronDown className="h-4 w-4" style={{ transform: openDropdowns['WebsiteSelector'] ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </>
              )}
            </button>
            
            {/* Website List Dropdown */}
            {isSidebarOpen && openDropdowns['WebsiteSelector'] && (
              <div className="ml-4 space-y-1 py-1">
                {websiteList.map((website, index) => (
                  <Button
                    key={index}
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
                ))}
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
                      <ChevronDown className="h-4 w-4" style={{ transform: openDropdowns['WebsiteModules'] ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                    </>
                  )}
                </button>
                
                {/* Website Module Items */}
                {isSidebarOpen && openDropdowns['WebsiteModules'] && (
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