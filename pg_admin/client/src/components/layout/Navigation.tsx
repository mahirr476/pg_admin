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
  ClipboardList,
  ArrowLeftFromLine,
  ArrowRightFromLine,
  Bell,
  HeartHandshake
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
  selectedWebsite?: Website | null;
  openDropdowns?: { [key: string]: boolean };
  toggleDropdown?: (section: string) => void;
  toggleSidebar?: () => void;
}

// Website-specific configuration with permission requirements
const websiteConfigs: WebsiteConfigs = {
  parasole: {
    name: 'Parasole',
    navItems: [
      { icon: Home, label: 'Home', path: '/admin/parasole/home', requiredPermission: 'parasole_view' },
      { 
        icon: Info, 
        label: 'About', 
        path: '/admin/parasole/about', 
        requiredPermission: 'parasole_view',
      },
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
      { 
        icon: Info, 
        label: 'About', 
        path: '/admin/paragon/about', 
        requiredPermission: 'paragon_group_view',
        subItems: [
          { icon: Users, label: 'About Us', path: '/admin/paragon/about/about-us', requiredPermission: 'paragon_group_view' },
          { icon: HeartHandshake, label: 'CSR', path: '/admin/paragon/about/csr', requiredPermission: 'paragon_group_view' }
        ]
      },
      { icon: Trophy, label: 'Milestones', path: '/admin/paragon/milestones', requiredPermission: 'paragon_group_view' },
      { icon: Briefcase, label: 'Business Activities', path: '/admin/paragon/business', requiredPermission: 'paragon_group_view' },
      { icon: Building2, label: 'Companies', path: '/admin/paragon/companies', requiredPermission: 'paragon_group_view' },
      { icon: UserPlus, label: 'Career', path: '/admin/paragon/career', requiredPermission: 'paragon_group_view' },
      { icon: ImageIcon, label: 'Media', path: '/admin/paragon/media', requiredPermission: 'paragon_group_view' },
      { icon: Phone, label: 'Contact', path: '/admin/paragon/contact', requiredPermission: 'paragon_group_view' }
    ]
  }
}

export function Navigation({ 
  isSidebarOpen = true,
  selectedWebsite: propSelectedWebsite,
  openDropdowns: propOpenDropdowns,
  toggleDropdown: propToggleDropdown,
  toggleSidebar
}: NavigationProps): JSX.Element {
  const router = useRouter()
  const pathname = usePathname()
  const permissionsContext = usePermissions()
  const { selectedWebsite: contextSelectedWebsite, setSelectedWebsite } = useWebsite()
  
  // Use either props or internal state for selectedWebsite and dropdowns
  const selectedWebsite = propSelectedWebsite || contextSelectedWebsite
  
  // Local state
  const [localOpenDropdowns, setLocalOpenDropdowns] = useState<{ [key: string]: boolean }>({})
  const openDropdowns = propOpenDropdowns || localOpenDropdowns
  
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
  const toggleDropdownHandler = (section: string): void => {
    if (propToggleDropdown) {
      propToggleDropdown(section)
    } else {
      setLocalOpenDropdowns(prev => ({ ...prev, [section]: !prev[section] }))
    }
  }

  // Check if path is active
  const isActivePath = (path: string): boolean => {
    return pathname?.startsWith(path) || false
  }

  // Check if about path is active
  const isAboutPath = (): boolean => {
    return pathname?.includes('/about') || false
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

  // Check if user has view permission for a specific website
  const canViewWebsite = (websiteSlug: string): boolean => {
    if (currentUser?.role === "Super Admin") return true;
    
    if (websiteSlug === 'parasole') {
      return userPermissions?.parasole_view === true;
    } else if (websiteSlug === 'paragon') {
      return userPermissions?.paragon_group_view === true;
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

  // Set website from URL or auto-select based on permissions
  useEffect(() => {
    // Skip this logic if we're using selectedWebsite from props or if we're still loading
    if (propSelectedWebsite || isLoading) return;
    
    // First try to get website from URL
    const pathSegments = pathname?.split('/') || []
    if (pathSegments.length > 2) {
      const slugFromUrl = pathSegments[2]
      const websiteFromUrl = websiteList.find(w => w.slug === slugFromUrl)
      
      // Check if user can view this website
      if (websiteFromUrl && canViewWebsite(websiteFromUrl.slug)) {
        console.log(`Setting website from URL: ${websiteFromUrl.name}`)
        setSelectedWebsite(websiteFromUrl)
        
        // Open the Website Modules dropdown
        if (!propToggleDropdown) {
          setLocalOpenDropdowns(prev => ({
            ...prev,
            'WebsiteModules': true
          }))
        }
        return; // Exit if we've set the website from URL
      }
    }
    
    // Auto-select website based on permissions
    if (userPermissions) {
      const hasParasoleAccess = userPermissions.parasole_view === true;
      const hasParagonAccess = userPermissions.paragon_group_view === true;
      
      console.log(`User permissions - Parasole: ${hasParasoleAccess}, Paragon: ${hasParagonAccess}`);
      
      // If user has only Paragon access, select Paragon
      if (!hasParasoleAccess && hasParagonAccess) {
        const paragonWebsite = websiteList.find(w => w.slug === 'paragon');
        if (paragonWebsite) {
          console.log("Auto-selecting Paragon based on permissions");
          setSelectedWebsite(paragonWebsite);
          if (!propToggleDropdown) {
            setLocalOpenDropdowns(prev => ({
              ...prev,
              'WebsiteModules': true
            }));
          }
        }
      } 
      // If user has only Parasole access, select Parasole
      else if (hasParasoleAccess && !hasParagonAccess) {
        const parasoleWebsite = websiteList.find(w => w.slug === 'parasole');
        if (parasoleWebsite) {
          console.log("Auto-selecting Parasole based on permissions");
          setSelectedWebsite(parasoleWebsite);
          if (!propToggleDropdown) {
            setLocalOpenDropdowns(prev => ({
              ...prev,
              'WebsiteModules': true
            }));
          }
        }
      }
      // If user has access to both, don't auto-select
    }
  }, [pathname, websiteList, userPermissions, selectedWebsite, propSelectedWebsite, propToggleDropdown, canViewWebsite, setSelectedWebsite, isLoading]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-50 to-indigo-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative h-16 w-16">
            <Loader2 className="absolute inset-0 h-full w-full animate-spin text-indigo-600 opacity-75" />
            <Loader2 className="absolute inset-0 h-full w-full animate-spin text-indigo-400 opacity-75" style={{ animationDelay: '0.2s' }} />
          </div>
          <p className="text-indigo-800 font-medium text-lg">Loading navigation...</p>
        </div>
      </div>
    )
  }

  // Get the websites the user has access to
  const accessibleWebsites = websiteList.filter(website => canViewWebsite(website.slug));
  
  // Determine if we should show the Website section (only if user has access to at least one website)
  const showWebsiteSection = accessibleWebsites.length > 0;

  return (
    <div className={`h-full flex flex-col bg-gradient-to-br from-indigo-50 via-white to-violet-50 border-r border-indigo-100 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-16'} overflow-x-hidden shadow-lg shadow-indigo-100/20`}>
      {/* Toggle Button */}
      <div className="flex justify-end px-2 pt-2">
        {toggleSidebar && (
          <button 
            onClick={toggleSidebar} 
            className="text-indigo-400 hover:text-indigo-600 p-1 rounded-full hover:bg-white/80 transition-all duration-200 shadow-sm"
          >
            {isSidebarOpen ? (
              <ArrowLeftFromLine size={18} className="stroke-2" />
            ) : (
              <ArrowRightFromLine size={18} className="stroke-2" />
            )}
          </button>
        )}
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 px-3 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(129, 140, 248, 0.3);
            border-radius: 20px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: rgba(129, 140, 248, 0.5);
          }
          
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgba(129, 140, 248, 0.3) transparent;
          }
        `}</style>
        <div className="space-y-4">
          {/* Core Navigation */}
          <div className="space-y-1 pt-1">
            <NavItem 
              icon={LayoutDashboard} 
              label="Dashboard" 
              path="/admin/dashboard" 
              isActive={isActivePath('/admin/dashboard')}
              onClick={() => router.push('/admin/dashboard')}
              isSidebarOpen={isSidebarOpen}
            />
            
            {showAuditLogs && (
              <NavItem 
                icon={ClipboardList} 
                label="Audit Logs" 
                path="/admin/audit" 
                isActive={isActivePath('/admin/audit')}
                onClick={() => router.push('/admin/audit')}
                isSidebarOpen={isSidebarOpen}
              />
            )}
            
            {showUserManagement && (
              <NavDropdown
                icon={Users}
                label="User Management"
                isActive={isActivePath('/admin/users') || isActivePath('/admin/manageUser')}
                isOpen={openDropdowns['UserManagement']}
                onClick={() => toggleDropdownHandler('UserManagement')}
                isSidebarOpen={isSidebarOpen}
              >
                {isSidebarOpen && (
                  <>
                    <NavItem 
                      icon={UserRound} 
                      label="All Users" 
                      path="/admin/manageUser/users" 
                      isActive={isActivePath('/admin/manageUser/users')}
                      onClick={() => router.push('/admin/manageUser/users')}
                      isSidebarOpen={isSidebarOpen}
                      isChild
                    />
                    <NavItem 
                      icon={UserCog} 
                      label="User Roles" 
                      path="/admin/manageUser/roles" 
                      isActive={isActivePath('/admin/manageUser/roles')}
                      onClick={() => router.push('/admin/manageUser/roles')}
                      isSidebarOpen={isSidebarOpen}
                      isChild
                    />
                  </>
                )}
              </NavDropdown>
            )}
            
            <NavItem 
              icon={BarChart} 
              label="Analytics" 
              path="/admin/analytics" 
              isActive={isActivePath('/admin/analytics')}
              onClick={() => router.push('/admin/analytics')}
              isSidebarOpen={isSidebarOpen}
            />
            
            <NavItem 
              icon={Settings} 
              label="Settings" 
              path="/admin/settings" 
              isActive={isActivePath('/admin/settings')}
              onClick={() => router.push('/admin/settings')}
              isSidebarOpen={isSidebarOpen}
            />
          </div>
          
          {/* Website Section - Only show if user has access to at least one website */}
          {showWebsiteSection && (
            <div className="space-y-2 mt-2">
              {isSidebarOpen && (
                <div className="px-3 pt-2 text-sm font-semibold text-indigo-900/60 uppercase tracking-wider">
                  Websites
                </div>
              )}
              
              {/* Website Selector - Only show if user has access to MULTIPLE websites */}
              {accessibleWebsites.length > 1 ? (
                <NavDropdown
                  icon={Globe}
                  label={selectedWebsite ? selectedWebsite.name : 'Select Website'}
                  isActive={selectedWebsite !== null}
                  isOpen={openDropdowns['WebsiteSelector']}
                  onClick={() => toggleDropdownHandler('WebsiteSelector')}
                  isSidebarOpen={isSidebarOpen}
                  activeColor="text-violet-700"
                  badgeColor="bg-violet-500"
                >
                  {isSidebarOpen && (
                    <>
                      {accessibleWebsites.map((website, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg cursor-pointer transition-all duration-200
                            ${selectedWebsite?.slug === website.slug 
                              ? 'bg-violet-100 text-violet-700 font-medium' 
                              : 'text-slate-600 hover:bg-violet-50 hover:text-violet-600'
                            }`}
                          onClick={() => {
                            setSelectedWebsite(website)
                            toggleDropdownHandler('WebsiteModules')
                            router.push(`/admin/${website.slug}/home`)
                          }}
                        >
                          <div className={`w-2 h-2 rounded-full ${
                            selectedWebsite?.slug === website.slug ? 'bg-violet-500' : 'bg-slate-300'
                          }`} />
                          <span>{website.name}</span>
                        </div>
                      ))}
                    </>
                  )}
                </NavDropdown>
              ) : (
                // For users with only ONE website permission, just show the website name
                <div className="px-3 py-2 flex items-center gap-2 text-violet-700 font-medium">
                  <Globe className="h-4.5 w-4.5 text-violet-500" />
                  {isSidebarOpen && (
                    <span>
                      {accessibleWebsites.length > 0 ? accessibleWebsites[0].name : ""}
                    </span>
                  )}
                </div>
              )}
              
              {/* Website Modules */}
              {selectedWebsite && websiteConfigs[selectedWebsite.slug] && canViewWebsite(selectedWebsite.slug) && (
                <div className="space-y-1">
                  {websiteConfigs[selectedWebsite.slug].navItems
                    .filter(item => {
                      // Basic permission check
                      let hasBasicPermission = false;
                      
                      if (selectedWebsite.slug === 'paragon' && item.requiredPermission === 'paragon_group_view') {
                        hasBasicPermission = currentUser?.role === "Super Admin" || 
                                            userPermissions?.paragon_group_view === true;
                      }
                      else if (selectedWebsite.slug === 'parasole' && item.requiredPermission === 'parasole_view') {
                        hasBasicPermission = currentUser?.role === "Super Admin" || 
                                            userPermissions?.parasole_view === true;
                      }
                      else {
                        hasBasicPermission = currentUser?.role === "Super Admin" || 
                                            hasPermission(item.requiredPermission || '');
                      }
                      
                      if (!hasBasicPermission) return false;
                      
                      // Additional permission checks
                      if (item.requiresEdit && !canEdit(selectedWebsite.slug)) return false;
                      if (item.requiresCreate && !canCreate(selectedWebsite.slug)) return false;
                      
                      return true;
                    })
                    .map((item, index) => {
                      // Check if item has subitems (dropdown)
                      if (item.subItems && item.subItems.length > 0) {
                        return (
                          <NavDropdown
                            key={index}
                            icon={item.icon}
                            label={item.label}
                            isActive={isActivePath(item.path)}
                            isOpen={openDropdowns[`${item.label}Dropdown`]}
                            onClick={() => toggleDropdownHandler(`${item.label}Dropdown`)}
                            isSidebarOpen={isSidebarOpen}
                            activeColor="text-violet-700"
                            badgeColor="bg-violet-500"
                          >
                            {isSidebarOpen && item.subItems.map((subItem, subIndex) => (
                              <NavItem 
                                key={subIndex}
                                icon={subItem.icon} 
                                label={subItem.label} 
                                path={subItem.path} 
                                isActive={isActivePath(subItem.path)}
                                onClick={() => router.push(subItem.path)}
                                isSidebarOpen={isSidebarOpen}
                                isChild
                              />
                            ))}
                          </NavDropdown>
                        );
                      }
                      
                      // Regular item (no dropdown)
                      return (
                        <NavItem 
                          key={index}
                          icon={item.icon} 
                          label={item.label} 
                          path={item.path} 
                          isActive={isActivePath(item.path)}
                          onClick={() => router.push(item.path)}
                          isSidebarOpen={isSidebarOpen}
                        />
                      );
                    })
                  }
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// NavItem Component
const NavItem = ({ 
  icon: Icon, 
  label, 
  path, 
  isActive,
  onClick,
  isSidebarOpen,
  isChild = false
}: { 
  icon: LucideIcon, 
  label: string, 
  path: string, 
  isActive: boolean,
  onClick: () => void,
  isSidebarOpen: boolean,
  isChild?: boolean
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center rounded-lg transition-all duration-300
        ${isChild 
          ? 'py-2 px-4 text-sm' 
          : 'py-2.5 px-3 text-base'
        }
        ${isActive 
          ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-200 translate-x-1' 
          : 'text-slate-700 hover:bg-white hover:shadow-sm hover:translate-x-1'
        }
      `}
    >
      <Icon className={`flex-shrink-0 ${isChild ? 'h-4 w-4' : 'h-5 w-5'} ${isActive ? 'stroke-[2.5px]' : ''}`} />
      {isSidebarOpen && <span className={`ml-2.5 ${isChild ? 'text-sm' : 'text-base font-medium'} ${isActive ? 'font-semibold' : ''}`}>{label}</span>}
    </button>
  )
}

// NavDropdown Component
const NavDropdown = ({ 
  icon: Icon, 
  label, 
  isActive,
  isOpen,
  onClick,
  children,
  isSidebarOpen,
  activeColor = 'text-indigo-600',
  badgeColor = 'bg-indigo-500'
}: { 
  icon: LucideIcon, 
  label: string, 
  isActive: boolean,
  isOpen: boolean,
  onClick: () => void,
  children: React.ReactNode,
  isSidebarOpen: boolean,
  activeColor?: string,
  badgeColor?: string
}) => {
  return (
    <div>
      <button
        onClick={onClick}
        aria-label={label}
        className={`
          w-full flex items-center justify-between rounded-lg transition-all duration-300 py-2.5 px-3 text-base
          ${isActive 
            ? `bg-white ${activeColor} shadow-sm font-medium` 
            : 'text-slate-700 hover:bg-white hover:shadow-sm'
          }
          ${isOpen 
            ? 'bg-white shadow-sm rounded-b-none border-b border-indigo-100/50' 
            : ''
          }
        `}
      >
        <div className="flex items-center">
          <div className="relative">
            <Icon className="flex-shrink-0 h-5 w-5" />
            {isOpen && (
              <span 
                className={`absolute -top-0.5 -right-0.5 w-2 h-2 ${badgeColor} rounded-full ring-2 ring-white`}
              ></span>
            )}
          </div>
          {isSidebarOpen && <span className="ml-2.5 font-medium">{label}</span>}
        </div>
        {isSidebarOpen && (
          <ChevronDown 
            className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} 
          />
        )}
      </button>
      
      {isOpen && (
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out max-h-96
            ${isSidebarOpen ? 'pl-1.5' : ''} 
            ${isOpen ? 'bg-white/80 rounded-b-lg shadow-sm mb-2' : ''}
          `}
          style={{
            animation: 'slideDown 0.3s ease-in-out'
          }}
        >
          <div className="py-1 space-y-1">
            {children}
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes slideDown {
          from {
            max-height: 0;
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            max-height: 500px;
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default Navigation;