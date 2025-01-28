// src/components/layout/Sidebar.tsx
"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Menu } from "lucide-react"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Navigation } from "./Navigation"

const sidebarVariants = {
  expanded: {
    width: 256,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 25,
      mass: 0.8
    }
  },
  collapsed: {
    width: 64,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 25,
      mass: 0.8
    }
  }
}

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({})

  const toggleDropdown = (title: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  return (
    <motion.aside
      initial="expanded"
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      className="fixed left-0 h-[calc(100vh-3.5rem)] top-14 bg-white border-r z-40 overflow-hidden"
    >
      <motion.div 
        className="p-4 border-b flex justify-end"
        initial={false}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100/80 transition-colors duration-200"
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <Menu className="w-5 h-5" />
          </motion.div>
        </motion.button>
      </motion.div>
      
      <ScrollArea className="h-[calc(100vh-7.5rem)]">
        <AnimatePresence mode="wait">
          <Navigation
            isCollapsed={isCollapsed}
            openDropdowns={openDropdowns}
            toggleDropdown={toggleDropdown}
            pathname={pathname}
          />
        </AnimatePresence>
      </ScrollArea>
    </motion.aside>
  )
}