
// "use client"

// import { useState } from 'react';
// import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
// import { Navigation } from './Navigation';

// export function Sidebar() {
//   const [isSidebarOpen, setSidebarOpen] = useState(true);
//   const [selectedWebsite, setSelectedWebsite] = useState<{ slug: string } | null>(null);
//   const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});

//   // Toggle dropdown for menu items
//   const toggleDropdown = (title: string) => {
//     setOpenDropdowns(prev => ({
//       ...prev,
//       [title]: !prev[title]
//     }));
//   };

//   return (
//     <aside
//       className={`${
//         isSidebarOpen ? 'w-64' : 'w-20'
//       } bg-white min-h-screen border-r transition-all duration-300 flex flex-col`}
//     >
//       <div className="p-4 border-b flex items-center justify-between">
//         {isSidebarOpen && (
//           <div className="text-xl font-semibold text-gray-800 truncate">
//             Admin Panel
//           </div>
//         )}
//         <button
//           onClick={() => setSidebarOpen(!isSidebarOpen)}
//           className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//         >
//           {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
//         </button>
//       </div>
      
//       <div className="flex-grow overflow-y-auto">
//         <Navigation 
//           isSidebarOpen={isSidebarOpen}
//           selectedWebsite={selectedWebsite}
//           openDropdowns={openDropdowns}
//           toggleDropdown={toggleDropdown}
//         />
//       </div>

//       {isSidebarOpen && (
//         <div className="p-4 border-t text-sm text-gray-500 text-center">
//           © 2024 Admin Dashboard
//         </div>
//       )}
//     </aside>
//   );
// }




// // src/components/layout/Sidebar.tsx
// "use client"

// import { useState } from 'react';
// import { Menu, X } from 'lucide-react';
// import { Navigation } from './Navigation';
// import { useWebsite } from '@/components/providers/WebsiteProvider';

// export function Sidebar() {
//   const { selectedWebsite } = useWebsite();
//   const [isSidebarOpen, setSidebarOpen] = useState(true);
//   const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});

//   const toggleDropdown = (title: string) => {
//     setOpenDropdowns(prev => ({
//       ...prev,
//       [title]: !prev[title]
//     }));
//   };

//   return (
//     <aside className={`
//       ${isSidebarOpen ? 'w-64' : 'w-20'} 
//       fixed left-0 h-[calc(100vh-4rem)] top-16 
//       bg-white border-r shadow-sm
//       transition-all duration-300 ease-in-out
//     `}>
//       <div className="flex flex-col h-full">
//         <div className="p-4 border-b flex justify-end">
//           <button
//             onClick={() => setSidebarOpen(!isSidebarOpen)}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
//           >
//             {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
//           </button>
//         </div>

//         <div className="flex-1 overflow-y-auto">
//           <Navigation 
//             isSidebarOpen={isSidebarOpen}
//             selectedWebsite={selectedWebsite}
//             openDropdowns={openDropdowns}
//             toggleDropdown={toggleDropdown}
//           />
//         </div>

//         {selectedWebsite && isSidebarOpen && (
//           <div className="p-4 border-t bg-gray-50">
//             <div className="flex items-center gap-2">
//               <div className="w-2 h-2 rounded-full bg-green-500" />
//               <span className="text-sm text-gray-600">
//                 {selectedWebsite.name}
//               </span>
//             </div>
//           </div>
//         )}
//       </div>
//     </aside>
//   );
// }



// src/components/layout/Sidebar.tsx
"use client"

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Navigation from './Navigation';  // Changed this line
import { useWebsite } from '@/components/providers/WebsiteProvider';
import { motion } from 'framer-motion';

export function Sidebar() {
  const { selectedWebsite } = useWebsite();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});

  const toggleDropdown = (title: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`
        ${isSidebarOpen ? 'w-64' : 'w-20'} 
        fixed left-0 h-[calc(100vh-4rem)] top-16 
        bg-white border-r shadow-sm
        transition-all duration-300 ease-in-out
      `}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Toggle Button */}
        <div className="p-4 border-b flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <Navigation 
            isSidebarOpen={isSidebarOpen}
            selectedWebsite={selectedWebsite}
            openDropdowns={openDropdowns}
            toggleDropdown={toggleDropdown}
          />
        </div>

        {/* Selected Website Indicator */}
        {selectedWebsite && isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 border-t bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm font-medium text-gray-600">
                {selectedWebsite.name}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
}