// "use client"

// import { createContext, useContext, useState } from 'react'

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
//   children: React.ReactNode
//   defaultOpen?: boolean 
// }) {
//   const [isOpen, setIsOpen] = useState(defaultOpen)
//   const [isLocked, setIsLocked] = useState(defaultOpen)

//   const toggle = () => {
//     setIsOpen(!isOpen)
//     setIsLocked(!isLocked)
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



"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

interface SidebarContextType {
  isOpen: boolean
  isLocked: boolean
  setIsOpen: (value: boolean) => void
  setIsLocked: (value: boolean) => void
  toggle: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ 
  children,
  defaultOpen = true 
}: { 
  children: ReactNode
  defaultOpen?: boolean 
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [isLocked, setIsLocked] = useState(defaultOpen)

  const toggle = () => {
    setIsOpen(prev => !prev)
    setIsLocked(prev => !prev)
  }

  const contextValue = { 
    isOpen, 
    isLocked,
    setIsOpen, 
    setIsLocked,
    toggle 
  }

  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}