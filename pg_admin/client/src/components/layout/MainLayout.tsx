

"use client"

import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { SidebarProvider } from '@/providers/SidebarContext'
import { WebsiteProvider } from '@/providers/WebsiteProvider'
import { TooltipProvider } from "@/components/ui/tooltip"
import { ReactNode } from 'react'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <WebsiteProvider>
        <SidebarProvider>
          <div className="flex flex-col h-screen overflow-hidden">
            <div className="relative z-50">
              <Header />
            </div>
            
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              
              <main className="flex-1 h-full overflow-auto">
                <div className="h-full w-full">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </WebsiteProvider>
    </TooltipProvider>
  )
}