


// // src/components/layout/Header.tsx
// "use client"

// import { useState } from 'react';
// import { Search, ChevronDown, User, LogOut, Bell, Settings } from 'lucide-react';
// import Image from 'next/image';
// import { useWebsite } from '@/components/providers/WebsiteProvider';
// import { Website } from '@/components/providers/WebsiteProvider';

// const websites: Website[] = [
//   { id: 1, name: 'Parasole', slug: 'parasole' },
//   { id: 2, name: 'Paragon Group', slug: 'paragon' }
// ];

// export function Header() {
//   const { selectedWebsite, setSelectedWebsite } = useWebsite();
//   const [isWebsiteDropdownOpen, setWebsiteDropdownOpen] = useState(false);
//   const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
//   const [isSearchFocused, setIsSearchFocused] = useState(false);

//   const handleWebsiteSelect = (website: Website) => {
//     setSelectedWebsite(website);
//     setWebsiteDropdownOpen(false);
//     // Optionally, you can redirect to the website's dashboard
//     window.location.href = `/admin/${website.slug}/home`;
//   };

//   return (
//     <div className="fixed top-0 left-0 right-0 bg-white border-b shadow-sm z-50">
//       <div className="flex items-center justify-between px-6 py-4">
//         {/* Logo and Brand */}
//         <div className="flex items-center gap-3">
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
//         </div>

//         {/* Center Section */}
//         <div className="flex items-center gap-4 flex-1 justify-center max-w-2xl">
//           {/* Search */}
//           <div className="relative flex-1 max-w-md">
//             <div className={`relative transition-all duration-200 ${isSearchFocused ? 'scale-105' : ''}`}>
//               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//               <input
//                 type="text"
//                 placeholder="Search anything..."
//                 className="w-full pl-11 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 
//                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
//                          transition-all duration-200"
//                 onFocus={() => setIsSearchFocused(true)}
//                 onBlur={() => setIsSearchFocused(false)}
//               />
//             </div>
//           </div>

//           {/* Website Selector */}
//           <div className="relative">
//             <button
//               onClick={() => setWebsiteDropdownOpen(!isWebsiteDropdownOpen)}
//               className={`
//                 flex items-center gap-2 px-4 py-2.5 
//                 ${selectedWebsite ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-700'} 
//                 border border-gray-200 rounded-xl hover:bg-gray-100 
//                 transition-colors duration-200
//               `}
//             >
//               <span>{selectedWebsite ? selectedWebsite.name : 'Select Website'}</span>
//               <ChevronDown className={`w-4 h-4 transition-transform duration-200 
//                 ${isWebsiteDropdownOpen ? 'rotate-180' : ''}`} />
//             </button>
            
//             {isWebsiteDropdownOpen && (
//               <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border 
//                            border-gray-100 py-2 z-50 transform transition-all duration-200">
//                 {websites.map((website) => (
//                   <button
//                     key={website.id}
//                     onClick={() => handleWebsiteSelect(website)}
//                     className={`
//                       w-full px-4 py-2.5 text-left flex items-center gap-2
//                       ${selectedWebsite?.slug === website.slug 
//                         ? 'bg-blue-50 text-blue-600' 
//                         : 'text-gray-700 hover:bg-gray-50'}
//                     `}
//                   >
//                     <div className={`w-2 h-2 rounded-full ${
//                       selectedWebsite?.slug === website.slug ? 'bg-blue-500' : 'bg-gray-300'
//                     }`} />
//                     {website.name}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right Section */}
//         <div className="flex items-center gap-3">
//           <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 relative">
//             <Bell size={20} />
//             <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
//           </button>

//           <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
//             <Settings size={20} />
//           </button>

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
//                   <button className="w-full px-4 py-2.5 text-left hover:bg-gray-50 text-gray-700">
//                     Profile Settings
//                   </button>
//                   <button className="w-full px-4 py-2.5 text-left hover:bg-gray-50 text-gray-700">
//                     Preferences
//                   </button>
//                 </div>
//                 <div className="border-t border-gray-100 pt-2">
//                   <button className="w-full px-4 py-2.5 text-left hover:bg-red-50 text-red-600 flex items-center gap-2">
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

// // src/components/layout/Header.tsx
// "use client"

// import Link from 'next/link';
// import { useState } from 'react';
// import { Search, ChevronDown, User, LogOut, Bell, Settings } from 'lucide-react';
// import Image from 'next/image';
// import { useWebsite } from '@/components/providers/WebsiteProvider';
// import { Website } from '@/components/providers/WebsiteProvider';

// const websites: Website[] = [
//   { id: 1, name: 'Parasole', slug: 'parasole' },
//   { id: 2, name: 'Paragon Group', slug: 'paragon' }
// ];

// export function Header() {
//   const { selectedWebsite, setSelectedWebsite } = useWebsite();
//   const [isWebsiteDropdownOpen, setWebsiteDropdownOpen] = useState(false);
//   const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
//   const [isSearchFocused, setIsSearchFocused] = useState(false);

//   const handleWebsiteSelect = (website: Website) => {
//     setSelectedWebsite(website);
//     setWebsiteDropdownOpen(false);
//     // Optionally, you can redirect to the website's dashboard
//     window.location.href = `/admin/${website.slug}/home`;
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

//         {/* Rest of the component remains the same as in the original code */}
//         {/* Center Section */}
//         <div className="flex items-center gap-4 flex-1 justify-center max-w-2xl">
//           {/* Search */}
//           <div className="relative flex-1 max-w-md">
//             <div className={`relative transition-all duration-200 ${isSearchFocused ? 'scale-105' : ''}`}>
//               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//               <input
//                 type="text"
//                 placeholder="Search anything..."
//                 className="w-full pl-11 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 
//                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
//                          transition-all duration-200"
//                 onFocus={() => setIsSearchFocused(true)}
//                 onBlur={() => setIsSearchFocused(false)}
//               />
//             </div>
//           </div>

//           {/* Website Selector */}
//           <div className="relative">
//             <button
//               onClick={() => setWebsiteDropdownOpen(!isWebsiteDropdownOpen)}
//               className={`
//                 flex items-center gap-2 px-4 py-2.5 
//                 ${selectedWebsite ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-700'} 
//                 border border-gray-200 rounded-xl hover:bg-gray-100 
//                 transition-colors duration-200
//               `}
//             >
//               <span>{selectedWebsite ? selectedWebsite.name : 'Select Website'}</span>
//               <ChevronDown className={`w-4 h-4 transition-transform duration-200 
//                 ${isWebsiteDropdownOpen ? 'rotate-180' : ''}`} />
//             </button>
            
//             {isWebsiteDropdownOpen && (
//               <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border 
//                            border-gray-100 py-2 z-50 transform transition-all duration-200">
//                 {websites.map((website) => (
//                   <button
//                     key={website.id}
//                     onClick={() => handleWebsiteSelect(website)}
//                     className={`
//                       w-full px-4 py-2.5 text-left flex items-center gap-2
//                       ${selectedWebsite?.slug === website.slug 
//                         ? 'bg-blue-50 text-blue-600' 
//                         : 'text-gray-700 hover:bg-gray-50'}
//                     `}
//                   >
//                     <div className={`w-2 h-2 rounded-full ${
//                       selectedWebsite?.slug === website.slug ? 'bg-blue-500' : 'bg-gray-300'
//                     }`} />
//                     {website.name}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right Section */}
//         <div className="flex items-center gap-3">
//           <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 relative">
//             <Bell size={20} />
//             <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
//           </button>

//           <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
//             <Settings size={20} />
//           </button>

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
//                   <button className="w-full px-4 py-2.5 text-left hover:bg-gray-50 text-gray-700">
//                     Profile Settings
//                   </button>
//                   <button className="w-full px-4 py-2.5 text-left hover:bg-gray-50 text-gray-700">
//                     Preferences
//                   </button>
//                 </div>
//                 <div className="border-t border-gray-100 pt-2">
//                   <button className="w-full px-4 py-2.5 text-left hover:bg-red-50 text-red-600 flex items-center gap-2">
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



// src/components/layout/Header.tsx
"use client"

import Link from 'next/link';
import { useState } from 'react';
import { Search, ChevronDown, User, LogOut, Bell, Settings } from 'lucide-react';
import Image from 'next/image';
import { useWebsite } from '@/components/providers/WebsiteProvider';
import { Website } from '@/components/providers/WebsiteProvider';

const websites: Website[] = [
  { id: 1, name: 'Parasole', slug: 'parasole' },
  { id: 2, name: 'Paragon Group', slug: 'paragon' }
];

export function Header() {
  const { selectedWebsite, setSelectedWebsite } = useWebsite();
  const [isWebsiteDropdownOpen, setWebsiteDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleWebsiteSelect = (website: Website) => {
    setSelectedWebsite(website);
    setWebsiteDropdownOpen(false);
    // Optionally, you can redirect to the website's dashboard
    window.location.href = `/admin/${website.slug}/home`;
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b shadow-sm z-50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo and Brand */}
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

        {/* Rest of the component remains the same as in the original code */}
        {/* Center Section */}
        <div className="flex items-center gap-4 flex-1 justify-center max-w-2xl">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <div className={`relative transition-all duration-200 ${isSearchFocused ? 'scale-105' : ''}`}>
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>
          </div>

          {/* Website Selector */}
          <div className="relative">
            <button
              onClick={() => setWebsiteDropdownOpen(!isWebsiteDropdownOpen)}
              className={`
                flex items-center gap-2 px-4 py-2.5 
                ${selectedWebsite ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-700'} 
                border border-gray-200 rounded-xl hover:bg-gray-100 
                transition-colors duration-200
              `}
            >
              <span>{selectedWebsite ? selectedWebsite.name : 'Select Website'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 
                ${isWebsiteDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isWebsiteDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border 
                           border-gray-100 py-2 z-50 transform transition-all duration-200">
                {websites.map((website) => (
                  <button
                    key={website.id}
                    onClick={() => handleWebsiteSelect(website)}
                    className={`
                      w-full px-4 py-2.5 text-left flex items-center gap-2
                      ${selectedWebsite?.slug === website.slug 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-700 hover:bg-gray-50'}
                    `}
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      selectedWebsite?.slug === website.slug ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />
                    {website.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <Link 
            href="/settings" 
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
          >
            <Settings size={20} />
          </Link>

          <div className="h-8 w-px bg-gray-200 mx-1" />

          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center 
                           justify-center text-white shadow-sm">
                <User size={18} />
              </div>
              <div className="text-right mr-2">
                <p className="text-sm font-medium text-gray-700">John Doe</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 
                                   ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-xl shadow-lg border 
                           border-gray-100 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-medium text-gray-900">John Doe</p>
                  <p className="text-sm text-gray-500">john.doe@paragon.com</p>
                </div>
                <div className="py-2">
                  <Link 
                    href="/admin/settings" 
                    className="block w-full px-4 py-2.5 text-left hover:bg-gray-50 text-gray-700"
                  >
                    Profile Settings
                  </Link>
                  <Link 
                    href="/admin/settings" 
                    className="block w-full px-4 py-2.5 text-left hover:bg-gray-50 text-gray-700"
                  >
                    Preferences
                  </Link>
                </div>
                <div className="border-t border-gray-100 pt-2">
                  <button className="w-full px-4 py-2.5 text-left hover:bg-red-50 text-red-600 flex items-center gap-2">
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}