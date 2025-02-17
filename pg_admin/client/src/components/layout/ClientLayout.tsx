// "use client";

// import { usePathname } from 'next/navigation';
// import { Header } from "@/components/layout/Header";
// import { Sidebar } from "@/components/layout/Sidebar";

// export function ClientLayout({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname();
//   const isAuthPage = pathname === '/login' || pathname === '/register';

//   if (isAuthPage) {
//     return children;
//   }

//   return (
//     <div className="min-h-screen">
//       <Header />
//       <div className="pt-16">
//         <Sidebar />
//         <main className="ml-20 lg:ml-64 transition-all duration-300">
//           <div className="p-6">
//             {children}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }



"use client";

import { usePathname } from 'next/navigation';
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const publicPaths = ['/login', '/register'];

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicPage = publicPaths.includes(pathname);

  if (isPublicPage) {
    return children;
  }

  return (
    <ProtectedRoute>
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
    </ProtectedRoute>
  );
}