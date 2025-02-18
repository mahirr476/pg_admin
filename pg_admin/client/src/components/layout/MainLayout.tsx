"use client"

import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { SidebarProvider, useSidebar } from '@/providers/SidebarContext'
import { WebsiteProvider } from '@/providers/WebsiteProvider'
import { TooltipProvider } from "@/components/ui/tooltip"

interface MainLayoutWrapperProps {
  children: React.ReactNode
}

// Separate wrapper component to use the useSidebar hook
function MainLayoutWrapper({ children }: MainLayoutWrapperProps) {
  const { isOpen } = useSidebar()

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="relative z-50">
        <Header />
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className={`
          flex-1 h-full overflow-auto
          transition-all duration-300 ease-in-out
          ${isOpen ? 'ml-64' : 'ml-20'}
        `}>
          <div className="h-full w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

// Main layout component with providers
export function MainLayout({ children }: MainLayoutWrapperProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <WebsiteProvider>
        <SidebarProvider defaultOpen={true}>
          <MainLayoutWrapper>
            {children}
          </MainLayoutWrapper>
        </SidebarProvider>
      </WebsiteProvider>
    </TooltipProvider>
  )
}