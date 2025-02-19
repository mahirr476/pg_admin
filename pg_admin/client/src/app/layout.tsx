
import { Inter } from "next/font/google";
import "./globals.css";
import { WebsiteProvider } from '@/providers/WebsiteProvider';
import { AuthProvider } from '@/providers/auth-provider';
import { ClientLayout } from '@/components/layout/ClientLayout';

const inter = Inter({ subsets: ["latin"] });


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
        <AuthProvider>
          <WebsiteProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </WebsiteProvider>
        </AuthProvider>
      </body>
    </html>
  )
}