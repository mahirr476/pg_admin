// src/app/layout.tsx
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/providers/auth-provider"
import { Header } from "@/components/layout/Header"
import { Sidebar } from "@/components/layout/Sidebar"


const inter = Inter({ subsets: ["latin"] })

// Static metadata
export const metadata = {
  title: 'Admin Panel | Paragon Group',
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
        <AuthProvider>
          <div className="min-h-screen">
            <Header />
            <div className="flex h-[calc(100vh-3.5rem)]">
              <Sidebar />
              <main className="flex-1 overflow-y-auto">
                <div className="p-6">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}