

// "use client"

// import Link from 'next/link';
// import { useState } from 'react';
// import { User, LogOut, Bell, Settings, ChevronDown } from 'lucide-react';
// import Image from 'next/image';
// import { useAuth } from '@/providers/auth-provider';
// import { useRouter } from 'next/navigation';
// import Cookies from 'js-cookie';
// import { WebsiteSelector } from './WebsiteSelector';

// export function Header() {
//   const router = useRouter();
//   const { logout } = useAuth();
//   const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);

//   const handleLogout = async () => {
//     try {
//       Cookies.remove('token');
//       localStorage.removeItem('rememberedEmail');
//       localStorage.removeItem('accessToken');
//       logout();
//       setProfileDropdownOpen(false);
//       router.push('/login');
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   return (
//     <div className="fixed top-0 left-0 right-0 bg-white border-b shadow-sm z-50">
//       <div className="flex items-center justify-between px-6 py-4">
//         {/* Logo and Brand */}
//         <Link 
//           href="/" 
//           className="flex items-center gap-3 hover:bg-gray-100 rounded-lg p-2 transition-colors duration-200"
//         >
//           <Image
//             src="/plogoTop.jpg"
//             alt="Logo"
//             width={38}
//             height={38}
//             className="rounded-lg"
//           />
//           <div>
//             <h1 className="text-lg font-semibold text-gray-900">Global Admin</h1>
//             <p className="text-xs text-gray-500">Paragon Group</p>
//           </div>
//         </Link>

//         {/* Right Section */}
//         <div className="flex items-center gap-3">
//           <WebsiteSelector />

//           <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 relative">
//             <Bell size={20} />
//             <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
//           </button>

//           <Link 
//             href="/settings" 
//             className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
//           >
//             <Settings size={20} />
//           </Link>

//           <div className="h-8 w-px bg-gray-200 mx-1" />

//           <div className="relative">
//             <button
//               onClick={() => setProfileDropdownOpen(!isProfileDropdownOpen)}
//               className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200"
//             >
//               <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center 
//                            justify-center text-white shadow-sm">
//                 <User size={18} />
//               </div>
//               <div className="text-right mr-2">
//                 <p className="text-sm font-medium text-gray-700">John Doe</p>
//                 <p className="text-xs text-gray-500">Super Admin</p>
//               </div>
//               <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 
//                                    ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
//             </button>

//             {isProfileDropdownOpen && (
//               <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-xl shadow-lg border 
//                            border-gray-100 py-2 z-50">
//                 <div className="px-4 py-3 border-b border-gray-100">
//                   <p className="font-medium text-gray-900">John Doe</p>
//                   <p className="text-sm text-gray-500">john.doe@paragon.com</p>
//                 </div>
//                 <div className="py-2">
//                   <Link 
//                     href="/admin/settings" 
//                     className="block w-full px-4 py-2.5 text-left hover:bg-gray-50 text-gray-700"
//                   >
//                     Profile Settings
//                   </Link>
//                   <Link 
//                     href="/admin/settings" 
//                     className="block w-full px-4 py-2.5 text-left hover:bg-gray-50 text-gray-700"
//                   >
//                     Preferences
//                   </Link>
//                 </div>
//                 <div className="border-t border-gray-100 pt-2">
//                   <button 
//                     onClick={handleLogout}
//                     className="w-full px-4 py-2.5 text-left hover:bg-red-50 text-red-600 flex items-center gap-2"
//                   >
//                     <LogOut size={18} />
//                     <span>Sign Out</span>
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client"

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { User, LogOut, Bell, Settings, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '@/providers/auth-provider'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { motion, AnimatePresence } from 'framer-motion'
import { useWebsite } from '@/providers/WebsiteProvider'
import { Website } from '@/providers/WebsiteProvider'

export function Header() {
  const router = useRouter()
  const { logout } = useAuth()
  const { selectedWebsite, setSelectedWebsite } = useWebsite()
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [isWebsiteDropdownOpen, setWebsiteDropdownOpen] = useState(false)
  const [websiteList, setWebsiteList] = useState<Website[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch websites on mount
  useEffect(() => {
    const fetchWebsites = async () => {
      setIsLoading(true)
      try {
        const token = Cookies.get('token')
        const response = await fetch('http://localhost:7000/api/v1/website', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        const data = await response.ok ? await response.json() : { websites: [] }
        setWebsiteList(data.websites || [])
        
        // Set initial website from URL
        const slugFromUrl = window.location.pathname.split('/')[2]
        const initialWebsite = data.websites?.find((w: Website) => w.slug === slugFromUrl)
        if(initialWebsite) setSelectedWebsite(initialWebsite)
      } catch (error) {
        console.error('Error fetching websites:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWebsites()
  }, [setSelectedWebsite])

  const handleWebsiteSelect = (website: Website) => {
    setSelectedWebsite(website)
    setWebsiteDropdownOpen(false)
    router.push(`/admin/${website.slug}/home`)
  }

  const handleLogout = async () => {
    try {
      Cookies.remove('token')
      localStorage.removeItem('rememberedEmail')
      localStorage.removeItem('accessToken')
      logout()
      setProfileDropdownOpen(false)
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b shadow-sm z-50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo Section */}
        <Link 
          href="/" 
          className="flex items-center gap-3 hover:bg-gray-100 rounded-lg p-2 transition-colors duration-200"
        >
          <Image
            src="/plogoTop.jpg"
            alt="Logo"
            width={38}
            height={38}
            className="rounded-lg"
          />
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Global Admin</h1>
            <p className="text-xs text-gray-500">Paragon Group</p>
          </div>
        </Link>

        {/* Right Navigation Section */}
        <div className="flex items-center gap-4">
          {/* Website Selector */}
          <div className="relative">
            <button
              onClick={() => setWebsiteDropdownOpen(!isWebsiteDropdownOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors ${
                selectedWebsite ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-700'
              } border border-gray-200 ${isLoading ? 'opacity-50' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  Loading...
                </div>
              ) : (
                <>
                  <span className="truncate max-w-[160px]">
                    {selectedWebsite?.name || 'Select Website'}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${
                    isWebsiteDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </>
              )}
            </button>

            <AnimatePresence>
              {isWebsiteDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 right-0 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                >
                  {websiteList.map(website => (
                    <button
                      key={website.slug}
                      onClick={() => handleWebsiteSelect(website)}
                      className={`w-full px-4 py-2.5 text-left flex items-center gap-2 ${
                        selectedWebsite?.slug === website.slug 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        selectedWebsite?.slug === website.slug ? 'bg-blue-500' : 'bg-gray-300'
                      }`} />
                      <span className="truncate">{website.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notification Bell */}
          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Settings Link */}
          <Link 
            href="/settings" 
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
          >
            <Settings size={20} />
          </Link>

          {/* Separator */}
          <div className="h-8 w-px bg-gray-200 mx-1" />

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                <User size={18} />
              </div>
              <div className="text-right mr-2">
                <p className="text-sm font-medium text-gray-700">John Doe</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                isProfileDropdownOpen ? 'rotate-180' : ''
              }`} />
            </button>

            <AnimatePresence>
              {isProfileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full right-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-medium text-gray-900">John Doe</p>
                    <p className="text-sm text-gray-500">john.doe@paragon.com</p>
                  </div>
                  <div className="py-2">
                    <Link
                      href="/admin/settings"
                      className="block w-full px-4 py-2.5 text-left hover:bg-gray-50 text-gray-700"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <Link
                      href="/admin/preferences"
                      className="block w-full px-4 py-2.5 text-left hover:bg-gray-50 text-gray-700"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Preferences
                    </Link>
                  </div>
                  <div className="border-t border-gray-100 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-left hover:bg-red-50 text-red-600 flex items-center gap-2"
                    >
                      <LogOut size={18} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}