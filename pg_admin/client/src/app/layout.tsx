
// File: /app/layout.js

import { Inter } from "next/font/google"
import "./globals.css"
import { WebsiteProvider } from '@/providers/WebsiteProvider'
import { AuthProvider } from '@/providers/auth-provider'
import { PermissionProvider } from '@/providers/permission-context'
import { ClientLayout } from '@/components/layout/ClientLayout'
import Loading from "@/components/loading/page"

const inter = Inter({ subsets: ["latin"] })

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
        <Loading/>
        <AuthProvider>
          <PermissionProvider>
            <WebsiteProvider>
              <ClientLayout>
                {children}
              </ClientLayout>
            </WebsiteProvider>
          </PermissionProvider>
        </AuthProvider>
      </body>
    </html>
  )
}