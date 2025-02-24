"use client"

import { useRouter } from 'next/navigation'
import { 
  Home,
  Info,
  Shield,
  Settings,
  Users,
  Phone,
  Trophy,
  Briefcase,
  Building2,
  UserPlus,
  Image as ImageIcon,
  LucideIcon
} from 'lucide-react'
import { Button } from "@/components/ui/button"

// Define types
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

// Define website configurations
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

interface WebsiteNavigationProps {
  selectedWebsite: { slug: string; name: string } | null
  isSidebarOpen: boolean
  pathname: string
}

export function WebsiteNavigation({ selectedWebsite, isSidebarOpen, pathname }: WebsiteNavigationProps) {
  const router = useRouter()
  
  // Find current website config
  const currentWebsite = websiteConfigs.find(config => config.slug === selectedWebsite?.slug)

  if (!currentWebsite || !selectedWebsite) {
    return null
  }

  const isActivePath = (path: string) => pathname.startsWith(path)

  return (
    <div className="space-y-1">
      {/* Website Section Header */}
      <div className="px-3 py-2">
        {isSidebarOpen && (
          <div className="text-sm font-medium text-gray-500">
            {currentWebsite.name} Modules
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <div className="space-y-1">
        {currentWebsite.navItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            className={`
              w-full justify-start gap-2 
              ${isActivePath(item.path) ? 'bg-blue-50 text-blue-600' : ''}
              transition-colors duration-200
            `}
            onClick={() => router.push(item.path)}
          >
            <item.icon className="h-4 w-4" />
            {isSidebarOpen && <span>{item.label}</span>}
          </Button>
        ))}
      </div>
    </div>
  )
}