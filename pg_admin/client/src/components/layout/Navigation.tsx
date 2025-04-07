
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

// Find the "Business Activities" item in the paragon config and modify it to include subItems
// This is part of the websiteConfigs object in the original code

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
      { 
        icon: Briefcase, 
        label: 'Business Activities', 
        path: '/admin/paragon/business', 
        requiredPermission: 'paragon_group_view',
        subItems: [
          { icon: Briefcase, label: 'Business', path: '/admin/paragon/business/main', requiredPermission: 'paragon_group_view' },
          { icon: Settings, label: 'Operations', path: '/admin/paragon/business/operations', requiredPermission: 'paragon_group_view' },
          { icon: ClipboardList, label: 'Products', path: '/admin/paragon/business/products', requiredPermission: 'paragon_group_view' },
          { icon: Users, label: 'Business Unit', path: '/admin/paragon/business/business-unit', requiredPermission: 'paragon_group_view' },
          { icon: Shield, label: 'Certificate', path: '/admin/paragon/business/certificate', requiredPermission: 'paragon_group_view' }
        ]
      },
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
  
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [userPermissions, setUserPermissions] = useState<UserPermissions | null>(null)
  const [websiteList] = useState<Website[]>([
    { id: 1, name: 'Parasole', slug: 'parasole' },
    { id: 2, name: 'Paragon', slug: 'paragon' }
  ])

  // Function to check if user is a super admin
  const isSuperAdmin = (): boolean => {
    // Adjust this based on how you identify super admin in your system
    // This might be a specific role ID or a special flag
    return currentUser?.role === 'superadmin' || currentUser?.roleId === 1; // Assuming roleId 1 is superadmin
  }

  // Function to check if user has specific permission
  const hasSpecificPermission = (permission: string): boolean => {
    if (isSuperAdmin()) return true;
    return userPermissions?.[permission] === true;
  }
  
  // Function to check if user has ANY website permission
  const hasAnyWebsitePermission = (): boolean => {
    if (isSuperAdmin()) return true;
    
    // Check if user has permission to view any website
    return hasSpecificPermission('parasole_view') || 
           hasSpecificPermission('paragon_group_view');
  }
  
  // Function to check if user has user management permission
  const hasUserManagementPermission = (): boolean => {
    if (isSuperAdmin()) return true;
    
    // Check if user has any permission related to user management
    // Adjust these permission names according to your actual schema
    return hasSpecificPermission('user_view') || 
           hasSpecificPermission('user_create') ||
           hasSpecificPermission('user_edit') ||
           hasSpecificPermission('user_delete') ||
           hasSpecificPermission('role_view') ||
           hasSpecificPermission('role_create') ||
           hasSpecificPermission('role_edit') ||
           hasSpecificPermission('role_delete');
  }
  
  // Function to check if user has audit permission
  const hasAuditPermission = (): boolean => {
    if (isSuperAdmin()) return true;
    
    // Adjust this permission name according to your actual schema
    return hasSpecificPermission('audit_view');
  }

  // Toggle dropdown function
  const toggleDropdownHandler = (section: string): void => {
    if (propToggleDropdown) {
      propToggleDropdown(section)
    } else {
      setLocalOpenDropdowns(prev => ({ ...prev, [section]: !prev[section] }))
    }
  }

  // Close all dropdowns and open only a specific one
  const openOnlyThisDropdown = (dropdownName: string): void => {
    if (propToggleDropdown) {
      // If we're using external toggle function, we'd need more complex handling
      propToggleDropdown(dropdownName);
    } else {
      // Close all dropdowns first
      const newDropdowns = { ...localOpenDropdowns };
      Object.keys(newDropdowns).forEach(key => {
        newDropdowns[key] = false;
      });
      // Then open only the selected dropdown
      newDropdowns[dropdownName] = true;
      setLocalOpenDropdowns(newDropdowns);
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
    if (isSuperAdmin()) return true;
    return userPermissions?.[permission] === true
  }

  // Check if user can edit content for the current website
  const canEdit = (websiteSlug: string): boolean => {
    if (isSuperAdmin()) return true;
    
    if (websiteSlug === 'parasole') {
      return userPermissions?.parasole_edit === true;
    } else if (websiteSlug === 'paragon') {
      return userPermissions?.paragon_group_edit === true;
    }
    
    return false;
  }

  // Check if user can create content for the current website
  const canCreate = (websiteSlug: string): boolean => {
    if (isSuperAdmin()) return true;
    
    if (websiteSlug === 'parasole') {
      return userPermissions?.parasole_create === true;
    } else if (websiteSlug === 'paragon') {
      return userPermissions?.paragon_group_create === true;
    }
    
    return false;
  }

  // Check if user has view permission for a specific website
  const canViewWebsite = (websiteSlug: string): boolean => {
    if (isSuperAdmin()) return true;
    
    if (websiteSlug === 'parasole') {
      return userPermissions?.parasole_view === true;
    } else if (websiteSlug === 'paragon') {
      return userPermissions?.paragon_group_view === true;
    }
    
    return false;
  }

  // Fetch user data
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
          const user = data.users[0]
          setCurrentUser(user)
          
          // Fetch permissions
          const permResponse = await fetch(`http://localhost:7000/api/v1/role_permission/${user.roleId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
          
          if (permResponse.ok) {
            const permData = await permResponse.json()
            
            if (permData.status === "success" && permData.rolePermission) {
              setUserPermissions(permData.rolePermission)
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
        setSelectedWebsite(websiteFromUrl)
        
        // Open only the modules dropdown for this website
        openOnlyThisDropdown(`${websiteFromUrl.slug}Modules`)
        return; // Exit if we've set the website from URL
      }
    }
    
    // Auto-select website based on permissions
    if (userPermissions) {
      const hasParasoleAccess = hasSpecificPermission('parasole_view');
      const hasParagonAccess = hasSpecificPermission('paragon_group_view');
      
      // If user has only Paragon access, select Paragon
      if (!hasParasoleAccess && hasParagonAccess) {
        const paragonWebsite = websiteList.find(w => w.slug === 'paragon');
        if (paragonWebsite) {
          setSelectedWebsite(paragonWebsite);
          openOnlyThisDropdown(`paragonModules`);
        }
      } 
      // If user has only Parasole access, select Parasole
      else if (hasParasoleAccess && !hasParagonAccess) {
        const parasoleWebsite = websiteList.find(w => w.slug === 'parasole');
        if (parasoleWebsite) {
          setSelectedWebsite(parasoleWebsite);
          openOnlyThisDropdown(`parasoleModules`);
        }
      }
    }
  }, [pathname, websiteList, userPermissions, selectedWebsite, propSelectedWebsite, propToggleDropdown, canViewWebsite, setSelectedWebsite, isLoading]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
          <p className="text-gray-600 font-medium">Loading navigation...</p>
        </div>
      </div>
    )
  }

  // Get the websites the user has access to
  const accessibleWebsites = websiteList.filter(website => canViewWebsite(website.slug));
  
  // Determine if we should show the Website section (only if user has access to at least one website)
  const showWebsiteSection = accessibleWebsites.length > 0;

  return (
    <div className={`h-full flex flex-col bg-white border-r border-gray-200 transition-all duration-300 shadow-md 
      ${isSidebarOpen ? 'w-64' : 'w-20'} overflow-y-auto`}>
      
      {/* Toggle Button */}
      {toggleSidebar && (
        <div className="flex justify-end p-3">
          <button 
            onClick={toggleSidebar} 
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all"
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isSidebarOpen ? (
              <ArrowLeftFromLine size={18} />
            ) : (
              <ArrowRightFromLine size={18} />
            )}
          </button>
        </div>
      )}

      {/* Main Navigation */}
      <div className="flex-1 px-3 py-4 overflow-y-auto">
        <style jsx global>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-4px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
            70% { box-shadow: 0 0 0 6px rgba(59, 130, 246, 0); }
            100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
          }
          
          .nav-item-active {
            animation: pulse 2s infinite;
          }
        `}</style>
        
        <div className="space-y-6">
          {/* Core Navigation */}
          <div className="space-y-1">
            {isSidebarOpen && (
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Main Navigation
              </div>
            )}
            
            {/* Dashboard */}
            <NavItem 
              icon={LayoutDashboard} 
              label="Dashboard" 
              path="/admin/dashboard" 
              isActive={isActivePath('/admin/dashboard')}
              onClick={() => router.push('/admin/dashboard')}
              isSidebarOpen={isSidebarOpen}
            />
            
            {/* Audit Logs - Only show if user has permission */}
            {hasAuditPermission() && (
              <NavItem 
                icon={ClipboardList} 
                label="Audit Logs" 
                path="/admin/audit" 
                isActive={isActivePath('/admin/audit')}
                onClick={() => router.push('/admin/audit')}
                isSidebarOpen={isSidebarOpen}
              />
            )}
            
            {/* User Management - Only show if user has permission */}
            {hasUserManagementPermission() && (
              <NavDropdown
                icon={Users}
                label="User Management"
                isActive={isActivePath('/admin/users') || isActivePath('/admin/manageUser')}
                isOpen={openDropdowns['UserManagement']}
                onClick={() => toggleDropdownHandler('UserManagement')}
                isSidebarOpen={isSidebarOpen}
              >
                {isSidebarOpen && (
                  <div className="pl-2 mt-1 space-y-1">
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
                  </div>
                )}
              </NavDropdown>
            )}
            
            {/* Analytics */}
            <NavItem 
              icon={BarChart} 
              label="Analytics" 
              path="/admin/analytics" 
              isActive={isActivePath('/admin/analytics')}
              onClick={() => router.push('/admin/analytics')}
              isSidebarOpen={isSidebarOpen}
            />
            
            {/* Settings */}
            <NavItem 
              icon={Settings} 
              label="Settings" 
              path="/admin/settings" 
              isActive={isActivePath('/admin/settings')}
              onClick={() => router.push('/admin/settings')}
              isSidebarOpen={isSidebarOpen}
            />
          </div>
          
          {/* Website Section - Only show if user has permission */}
          {showWebsiteSection && (
            <div className="space-y-1">
              {isSidebarOpen && (
                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Websites
                </div>
              )}
              
              {/* Website Selector */}
              {accessibleWebsites.length > 1 ? (
                <NavDropdown
                  icon={Globe}
                  label={selectedWebsite ? selectedWebsite.name : 'Select Website'}
                  isActive={selectedWebsite !== null}
                  isOpen={openDropdowns['WebsiteSelector']}
                  onClick={() => toggleDropdownHandler('WebsiteSelector')}
                  isSidebarOpen={isSidebarOpen}
                  highlight={true}
                >
                  {isSidebarOpen && (
                    <div className="mt-1 space-y-1">
                      {accessibleWebsites.map((website, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all
                            ${selectedWebsite?.slug === website.slug 
                              ? 'bg-blue-50 text-blue-600 font-medium' 
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                          onClick={() => {
                            setSelectedWebsite(website)
                            // Close the website selector dropdown
                            toggleDropdownHandler('WebsiteSelector')
                            // Open the module menu for this website only
                            openOnlyThisDropdown(`${website.slug}Modules`)
                            router.push(`/admin/${website.slug}/home`)
                          }}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            selectedWebsite?.slug === website.slug ? 'bg-blue-500' : 'bg-gray-400'
                          }`} />
                          <span>{website.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </NavDropdown>
              ) : (
                // For users with only ONE website permission, just show the website name
                <div className="px-4 py-2 flex items-center gap-2 text-blue-600 font-medium">
                  <Globe className="h-5 w-5 text-blue-500" />
                  {isSidebarOpen && (
                    <span>
                      {accessibleWebsites.length > 0 ? accessibleWebsites[0].name : ""}
                    </span>
                  )}
                </div>
              )}
              
              {/* Website Modules - Now using a dropdown for each website */}
              {selectedWebsite && websiteConfigs[selectedWebsite.slug] && canViewWebsite(selectedWebsite.slug) && (
                <NavDropdown
                  icon={Globe}
                  label={`${selectedWebsite.name} Modules`}
                  isActive={isActivePath(`/admin/${selectedWebsite.slug}`)}
                  isOpen={openDropdowns[`${selectedWebsite.slug}Modules`]}
                  onClick={() => toggleDropdownHandler(`${selectedWebsite.slug}Modules`)}
                  isSidebarOpen={isSidebarOpen}
                  highlight={true}
                >
                  {isSidebarOpen && (
                    <div className="mt-1 space-y-1">
                      {websiteConfigs[selectedWebsite.slug].navItems
                        .filter(item => {
                          // Basic permission check
                          let hasBasicPermission = false;
                          
                          if (selectedWebsite.slug === 'paragon' && item.requiredPermission === 'paragon_group_view') {
                            hasBasicPermission = hasSpecificPermission('paragon_group_view');
                          }
                          else if (selectedWebsite.slug === 'parasole' && item.requiredPermission === 'parasole_view') {
                            hasBasicPermission = hasSpecificPermission('parasole_view');
                          }
                          else {
                            hasBasicPermission = hasPermission(item.requiredPermission || '');
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
                              >
                                {isSidebarOpen && (
                                  <div className="pl-4 mt-1 space-y-1">
                                    {item.subItems.map((subItem, subIndex) => (
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
                                  </div>
                                )}
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
                </NavDropdown>
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
        w-full flex items-center rounded-lg transition-all duration-200
        ${isChild 
          ? 'py-2 px-3 text-sm' 
          : 'py-2.5 px-3'
        }
        ${isActive 
          ? 'bg-blue-500 text-white font-medium' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }
      `}
    >
      <Icon className={`flex-shrink-0 ${isChild ? 'h-4 w-4' : 'h-5 w-5'} ${isActive ? 'stroke-[2px]' : ''}`} />
      {isSidebarOpen && (
        <span className={`ml-3 ${isChild ? 'text-sm' : ''} ${isActive ? 'font-medium' : ''}`}>
          {label}
        </span>
      )}
      {isActive && !isSidebarOpen && (
        <div className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full"></div>
      )}
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
  highlight = false
}: { 
  icon: LucideIcon, 
  label: string, 
  isActive: boolean,
  isOpen: boolean,
  onClick: () => void,
  children: React.ReactNode,
  isSidebarOpen: boolean,
  highlight?: boolean
}) => {
  return (
    <div>
      <button
        onClick={onClick}
        aria-label={label}
        className={`
          w-full flex items-center justify-between rounded-lg transition-all duration-200 py-2.5 px-3
          ${highlight
            ? 'bg-blue-50 text-blue-600 font-medium'
            : isActive 
              ? 'text-gray-900 font-medium' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }
        `}
      >
       <div className="flex items-center">
          <Icon className={`flex-shrink-0 h-5 w-5 ${isActive || highlight ? 'text-blue-500' : ''}`} />
          {isSidebarOpen && <span className="ml-3">{label}</span>}
        </div>
        {isSidebarOpen && (
          <ChevronDown 
            className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          />
        )}
      </button>
      
      {isOpen && (
        <div 
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export default Navigation;