
// // src/app/layout.tsx
// import { Inter } from "next/font/google"
// import "./globals.css"
// import { WebsiteProvider } from '@/components/providers/WebsiteProvider';
// import { Header } from "@/components/layout/Header"
// import { Sidebar } from "@/components/layout/Sidebar"
// const inter = Inter({ subsets: ["latin"] });

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
//         <WebsiteProvider>
//           <WebsiteProvider>
//             <div className="min-h-screen">
//               <Header />
//               <div className="pt-16"> {/* Add padding-top for fixed header */}
//                 <Sidebar />
//                 <main className="ml-20 lg:ml-64 transition-all duration-300">
//                   <div className="p-6">
//                     {children}
//                   </div>
//                 </main>
//               </div>
//             </div>
//           </WebsiteProvider>
//         </WebsiteProvider>
//       </body>
//     </html>
//   );
// }




// import { Inter } from "next/font/google";
// import "./globals.css";
// import { WebsiteProvider } from '@/components/providers/WebsiteProvider';
// import { AuthProvider } from '@/components/providers/auth-provider';
// import { ClientLayout } from '@/components/layout/ClientLayout';

// const inter = Inter({ subsets: ["latin"] });

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
//           <WebsiteProvider>
//             <ClientLayout>
//               {children}
//             </ClientLayout>
//           </WebsiteProvider>
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }



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