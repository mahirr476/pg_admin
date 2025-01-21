// src/components/layout/Navigation.tsx
"use client"

import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Home,
  Info,
  Trophy,
  Briefcase,
  Building2,
  Image,
  UserPlus,
  Phone,
  ChevronDown,
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export interface NavItem {
  title: string
  icon: React.ReactNode
  href?: string
  subItems?: { title: string; href: string }[]
}

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    href: "/dashboard"
  },
  {
    title: "Home",
    icon: <Home className="w-5 h-5" />,
    href: "/home"
  },
  {
    title: "About",
    icon: <Info className="w-5 h-5" />,
    subItems: [
      { title: "About Us", href: "/about-us" },
      { title: "CSR", href: "/csr" }
    ]
  },
  {
    title: "Milestones",
    icon: <Trophy className="w-5 h-5" />,
    href: "/milestones"
  },
  {
    title: "Business Activities",
    icon: <Briefcase className="w-5 h-5" />,
    subItems: [
      { title: "Poultry Farming", href: "/business/poultry-farming" },
      { title: "Processing and Further Processing Plant", href: "/business/processing-plant" },
      { title: "Plastic Woven Bags & FIBC", href: "/business/plastic-bags" },
      { title: "Tea Estates & Horticulture", href: "/business/tea-estates" },
      { title: "Bistro Café & Retail Shop", href: "/business/bistro-cafe" },
      { title: "Renewable Energy", href: "/business/renewable-energy" },
      { title: "Feed Mills", href: "/business/feed-mills" },
      { title: "Consumer Foods", href: "/business/consumer-foods" },
      { title: "Fish Hatchery", href: "/business/fish-hatchery" },
      { title: "Organic Fertilizer", href: "/business/organic-fertilizer" },
      { title: "Flour Mill", href: "/business/flour-mill" },
      { title: "Footwear Manufacturing", href: "/business/footwear" },
      { title: "Dairy Project", href: "/business/dairy" }
    ]
  },
  {
    title: "Companies",
    icon: <Building2 className="w-5 h-5" />,
    subItems: [
      { title: "Aqua Breeders Ltd", href: "/companies/aqua-breeders" },
      { title: "Bay Chicks Ltd", href: "/companies/bay-chicks" },
      { title: "Bay Grand Parents Ltd", href: "/companies/bay-grand-parents" },
      { title: "Chittagong Chicks Ltd", href: "/companies/chittagong-chicks" },
      { title: "Chittagong Feed Ltd", href: "/companies/chittagong-feed" },
      { title: "Denm Poultry Complex Pvt Ltd", href: "/companies/denm-poultry" },
      { title: "Jessore Feed Ltd", href: "/companies/jessore-feed" },
      { title: "Moynamoti Hatchery Ltd", href: "/companies/moynamoti-hatchery" },
      { title: "Paragon Agro Ltd", href: "/companies/paragon-agro" },
      { title: "Parasol Energy Ltd", href: "/companies/parasol-energy" },
      { title: "Paragon Feed Ltd", href: "/companies/paragon-feed" },
      { title: "Paragon Plastic Ltd", href: "/companies/paragon-plastic" },
      { title: "Paragon Plast Fiber Ltd", href: "/companies/paragon-plast-fiber" },
      { title: "Paragon Poultry Ltd", href: "/companies/paragon-poultry" },
      { title: "Paragon Press Ltd", href: "/companies/paragon-press" },
      { title: "Parasole Footware Ltd", href: "/companies/parasole-footware" },
      { title: "Rangpur Poultry Ltd", href: "/companies/rangpur-poultry" },
      { title: "Shalbahan Farms Ltd", href: "/companies/shalbahan-farms" },
      { title: "Sympa Solar Power Ltd", href: "/companies/sympa-solar" },
      { title: "Usha Poultry Ltd", href: "/companies/usha-poultry" },
      { title: "Fatehbagh Tea Company Ltd", href: "/companies/fatehbagh-tea" }
    ]
  },
  {
    title: "Media",
    icon: <Image className="w-5 h-5" />,
    href: "/media"
  },
  {
    title: "Career",
    icon: <UserPlus className="w-5 h-5" />,
    href: "/career"
  },
  {
    title: "Contact",
    icon: <Phone className="w-5 h-5" />,
    href: "/contact"
  }
]

interface NavigationProps {
  isCollapsed: boolean
  openDropdowns: { [key: string]: boolean }
  toggleDropdown: (title: string) => void
  pathname: string
}

// Animation variants
const menuItemVariants = {
  hover: {
    x: 4,
    transition: { duration: 0.2 }
  }
}

const dropdownVariants = {
  open: {
    opacity: 1,
    height: "auto",
    transition: {
      type: "spring",
      duration: 0.3,
      delayChildren: 0.1,
      staggerChildren: 0.05
    }
  },
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      type: "spring",
      duration: 0.3
    }
  }
}

export function Navigation({ isCollapsed, openDropdowns, toggleDropdown, pathname }: NavigationProps) {
  return (
    <nav className="p-2">
      {navItems.map((item) => (
        <div key={item.title} className="mb-1">
          {item.href ? (
            <motion.div
              variants={menuItemVariants}
              whileHover="hover"
            >
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 py-2 px-4 rounded-lg transition-colors",
                  "hover:bg-gray-100",
                  pathname === item.href && "bg-gray-100 text-gray-900",
                  "text-gray-600",
                  isCollapsed && "justify-center px-2"
                )}
              >
                {item.icon}
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            </motion.div>
          ) : (
            <>
              <motion.button
                variants={menuItemVariants}
                whileHover="hover"
                onClick={() => toggleDropdown(item.title)}
                className={cn(
                  "w-full flex items-center justify-between py-2 px-4 rounded-lg transition-colors",
                  "hover:bg-gray-100 text-gray-600",
                  openDropdowns[item.title] && "bg-gray-100 text-gray-900",
                  isCollapsed && "justify-center px-2"
                )}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  {!isCollapsed && <span>{item.title}</span>}
                </div>
                {!isCollapsed && (
                  <motion.div
                    initial={false}
                    animate={{ rotate: openDropdowns[item.title] ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                )}
              </motion.button>
              
              <AnimatePresence initial={false}>
                {!isCollapsed && openDropdowns[item.title] && item.subItems && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className="overflow-hidden"
                  >
                    <div className="ml-9 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <motion.div
                          key={subItem.href}
                          variants={menuItemVariants}
                          whileHover="hover"
                        >
                          <Link
                            href={subItem.href}
                            className={cn(
                              "block py-2 px-4 rounded-lg text-sm text-gray-600",
                              "hover:bg-gray-100 hover:text-gray-900",
                              pathname === subItem.href && "bg-gray-100 text-gray-900"
                            )}
                          >
                            {subItem.title}
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      ))}
    </nav>
  )
}