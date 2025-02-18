// // src/app/layout.tsx
// import { Inter } from "next/font/google"
// import "./globals.css"
// import { AuthProvider } from "@/components/providers/WebsiteProvider"
// import { Header } from "@/components/layout/Header"
// import { Sidebar } from "@/components/layout/Sidebar"


// const inter = Inter({ subsets: ["latin"] })

// // Static metadata
// export const metadata = {
//   title: 'Global Admin Panel',
//   description: 'Administrative dashboard for Paragon Group',
//   icons: {
//     icon: '/plogoTop.jpg',
//   },
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body className={inter.className}>
//         <AuthProvider>
//           <div className="min-h-screen">
//             <Header />
//             <div className="flex h-[calc(100vh-3.5rem)]">
//               <Sidebar />
//               <main className="flex-1 overflow-y-auto">
//                 <div className="p-6">
//                   {children}
//                 </div>
//               </main>
//             </div>
//           </div>
//         </AuthProvider>
//       </body>
//     </html>
//   )
// }



// src/app/layout.tsx
import { Inter } from "next/font/google"
import "./globals.css"
import { WebsiteProvider } from '@/providers/WebsiteProvider'
import { SidebarProvider } from '@/providers/SidebarContext'
import { TooltipProvider } from "@/components/ui/tooltip"
import { MainLayout } from "@/components/layout/MainLayout"

const inter = Inter({ subsets: ["latin"] })

// Static metadata
export const metadata = {
  title: 'Global Admin Panel',
  description: 'Administrative dashboard for Paragon Group',
  icons: {
    icon: '/plogoTop.jpg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <TooltipProvider delayDuration={300}>
          <WebsiteProvider>
            <SidebarProvider defaultOpen={true}>
              <MainLayout>
                {children}
              </MainLayout>
            </SidebarProvider>
          </WebsiteProvider>
        </TooltipProvider>
      </body>
    </html>
  )
}