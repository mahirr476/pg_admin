

"use client"

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useWebsite, Website } from '@/providers/WebsiteProvider'
import { useSidebar } from '@/providers/SidebarContext'
import { Navigation } from './Navigation'

// Use string index signature for dropdowns
type OpenDropdowns = { [key: string]: boolean }

export function Sidebar() {
  const { selectedWebsite } = useWebsite()
  const { isOpen, isLocked, setIsOpen, toggle } = useSidebar()
  const [isHovered, setIsHovered] = useState(false)
  const [openDropdowns, setOpenDropdowns] = useState<OpenDropdowns>({})

  const shouldBeOpen = isLocked ? isOpen : isHovered

  const toggleDropdown = (section: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      onMouseEnter={() => !isLocked && setIsHovered(true)}
      onMouseLeave={() => !isLocked && setIsHovered(false)}
      className={`
        ${shouldBeOpen ? 'w-64' : 'w-20'} 
        fixed left-0 h-[calc(100vh-3.5rem)] top-14
        bg-white border-r shadow-sm
        transition-all duration-300 ease-in-out
        z-40
      `}
    >
      <div className="flex flex-col h-full pt-10">
        {/* Header with Icon and Toggle */}
        <div className="flex items-center gap-2 px-4 py-2 border-b">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggle}
            className="ml-auto p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            {isLocked && shouldBeOpen ? (
              <ChevronLeft className="h-4 w-4 transition-transform duration-200" />
            ) : (
              <ChevronRight className="h-4 w-4 transition-transform duration-200" />
            )}
          </motion.button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <Navigation 
            isSidebarOpen={shouldBeOpen}
            selectedWebsite={selectedWebsite}
            openDropdowns={openDropdowns}
            toggleDropdown={toggleDropdown}
          />
        </div>

        {/* Selected Website Indicator */}
        {selectedWebsite && shouldBeOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 border-t bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm font-medium text-gray-600">
                {selectedWebsite.name}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.aside>
  )
}





// "use client"

// import { createContext, useContext, useState, ReactNode } from 'react'

// interface SidebarContextType {
//   isOpen: boolean
//   isLocked: boolean
//   setIsOpen: (value: boolean) => void
//   setIsLocked: (value: boolean) => void
//   toggle: () => void
// }

// const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

// export function SidebarProvider({ 
//   children,
//   defaultOpen = true 
// }: { 
//   children: ReactNode
//   defaultOpen?: boolean 
// }) {
//   const [isOpen, setIsOpenState] = useState(defaultOpen)
//   const [isLocked, setIsLockedState] = useState(defaultOpen)

//   const setIsOpen = (value: boolean) => {
//     setIsOpenState(value)
//     setIsLockedState(value)
//   }

//   const setIsLocked = (value: boolean) => {
//     setIsLockedState(value)
//   }

//   const toggle = () => {
//     setIsOpen(!isOpen)
//   }

//   return (
//     <SidebarContext.Provider 
//       value={{ 
//         isOpen, 
//         isLocked,
//         setIsOpen, 
//         setIsLocked,
//         toggle 
//       }}
//     >
//       {children}
//     </SidebarContext.Provider>
//   )
// }

// export function useSidebar() {
//   const context = useContext(SidebarContext)
//   if (context === undefined) {
//     throw new Error('useSidebar must be used within a SidebarProvider')
//   }
//   return context
// }