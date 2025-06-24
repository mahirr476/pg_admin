

"use client";

import { usePathname } from 'next/navigation';
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SidebarProvider } from '@/providers/SidebarContext';

const publicPaths = ['/login', '/register'];

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicPage = publicPaths.includes(pathname);

  if (isPublicPage) {
    return children;
  }

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="min-h-screen">
          <Header />
          <div className="pt-16">
            <Sidebar />
            <main className="ml-20 lg:ml-64 transition-all duration-300">
              <div className="p-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}