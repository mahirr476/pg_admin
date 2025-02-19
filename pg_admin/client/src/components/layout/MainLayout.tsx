// // "use client"

// // import { Header } from './Header'
// // import { Sidebar } from './Sidebar'
// // import { SidebarProvider, useSidebar } from '@/providers/SidebarContext'
// // import { WebsiteProvider } from '@/providers/WebsiteProvider'
// // import { TooltipProvider } from "@/components/ui/tooltip"

// // interface MainLayoutWrapperProps {
// //   children: React.ReactNode
// // }

// // // Separate wrapper component to use the useSidebar hook
// // function MainLayoutWrapper({ children }: MainLayoutWrapperProps) {
// //   const { isOpen } = useSidebar()

// //   return (
// //     <div className="flex flex-col h-screen overflow-hidden">
// //       <div className="relative z-50">
// //         <Header />
// //       </div>
      
// //       <div className="flex flex-1 overflow-hidden">
// //         <Sidebar />
        
// //         <main className={`
// //           flex-1 h-full overflow-auto
// //           transition-all duration-300 ease-in-out
// //           ${isOpen ? 'ml-64' : 'ml-20'}
// //         `}>
// //           <div className="h-full w-full">
// //             {children}
// //           </div>
// //         </main>
// //       </div>
// //     </div>
// //   )
// // }

// // // Main layout component with providers
// // export function MainLayout({ children }: MainLayoutWrapperProps) {
// //   return (
// //     <TooltipProvider delayDuration={300}>
// //       <WebsiteProvider>
// //         <SidebarProvider defaultOpen={true}>
// //           <MainLayoutWrapper>
// //             {children}
// //           </MainLayoutWrapper>
// //         </SidebarProvider>
// //       </WebsiteProvider>
// //     </TooltipProvider>
// //   )
// // }



// "use client"

// import { Header } from './Header'
// import { Sidebar } from './Sidebar'
// import { SidebarProvider, useSidebar } from '@/providers/SidebarContext'
// import { WebsiteProvider } from '@/providers/WebsiteProvider'
// import { TooltipProvider } from "@/components/ui/tooltip"
// import { ReactNode } from 'react'

// interface MainLayoutWrapperProps {
//   children: ReactNode
// }

// // Main layout component with providers
// export function MainLayout({ children }: MainLayoutWrapperProps) {
//   return (
//     <TooltipProvider delayDuration={300}>
//       <WebsiteProvider>
//         <SidebarProvider defaultOpen={true}>
//           <MainLayoutInner>
//             {children}
//           </MainLayoutInner>
//         </SidebarProvider>
//       </WebsiteProvider>
//     </TooltipProvider>
//   )
// }

// // Inner layout component that can use the sidebar context
// function MainLayoutInner({ children }: MainLayoutWrapperProps) {
//   const { isOpen } = useSidebar()

//   return (
//     <div className="flex flex-col h-screen overflow-hidden">
//       <div className="relative z-50">
//         <Header />
//       </div>
      
//       <div className="flex flex-1 overflow-hidden">
//         <Sidebar />
        
//         <main className={`
//           flex-1 h-full overflow-auto
//           transition-all duration-300 ease-in-out
//           ${isOpen ? 'ml-64' : 'ml-20'}
//         `}>
//           <div className="h-full w-full">
//             {children}
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }



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