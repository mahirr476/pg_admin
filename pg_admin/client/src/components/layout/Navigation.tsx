

// // "use client"

// // import { 
// //   LayoutDashboard, 
// //   BarChart, 
// //   Settings, 
// //   Users, 
// //   FileText, 
// //   Folder, 
// //   Bell, 
// //   Shield, 
// //   Briefcase, 
// //   TrendingUp, 
// //   CreditCard, 
// //   Globe,
// //   UserRound,
// //   UserCog,
// //   Lock,
// //   Key,
// //   ScrollText,
// //   Activity,
// //   Server,
// //   List,
// //   ChevronDown
// // } from 'lucide-react';
// // import { motion, AnimatePresence } from 'framer-motion';

// // const defaultNavItems = [
// //   { 
// //     icon: LayoutDashboard, 
// //     label: 'Dashboard', 
// //     path: '/admin/dashboard' 
// //   },
// //   { 
// //     icon: Users, 
// //     label: 'User Management', 
// //     subItems: [
// //       { 
// //         icon: UserRound, 
// //         label: 'All Users', 
// //         path: '/admin/users' 
// //       },
// //       { 
// //         icon: UserCog, 
// //         label: 'User Roles', 
// //         path: '/admin/users/roles' 
// //       },
// //       { 
// //         icon: Lock, 
// //         label: 'Permissions', 
// //         path: '/admin/users/permissions' 
// //       },
// //       { 
// //         icon: Key, 
// //         label: 'Access Control', 
// //         path: '/admin/users/access-control' 
// //       }
// //     ]
// //   },
// //   { 
// //     icon: BarChart, 
// //     label: 'Analytics', 
// //     path: '/admin/analytics' 
// //   },
// //   { 
// //     icon: FileText, 
// //     label: 'Reports', 
// //     subItems: [
// //       { 
// //         icon: ScrollText, 
// //         label: 'User Reports', 
// //         path: '/admin/reports/users' 
// //       },
// //       { 
// //         icon: Activity, 
// //         label: 'Activity Logs', 
// //         path: '/admin/reports/activity' 
// //       },
// //       { 
// //         icon: Server, 
// //         label: 'System Logs', 
// //         path: '/admin/reports/system' 
// //       },
// //       { 
// //         icon: List, 
// //         label: 'Comprehensive Reports', 
// //         path: '/admin/reports/comprehensive' 
// //       }
// //     ]
// //   },
// //   { 
// //     icon: Settings, 
// //     label: 'Settings', 
// //     path: '/admin/settings' 
// //   }
// // ];

// // const websiteNavItems = {
// //   parasole: [
// //     { icon: Folder, label: 'Products', path: '/admin/parasole/products' },
// //     { icon: CreditCard, label: 'Orders', path: '/admin/parasole/orders' },
// //     { icon: TrendingUp, label: 'Inventory', path: '/admin/parasole/inventory' },
// //     { icon: Bell, label: 'Notifications', path: '/admin/parasole/notifications' }
// //   ],
// //   paragon: [
// //     { icon: Globe, label: 'Properties', path: '/admin/paragon/properties' },
// //     { icon: Briefcase, label: 'Projects', path: '/admin/paragon/projects' },
// //     { icon: Shield, label: 'Leads', path: '/admin/paragon/leads' },
// //     { icon: FileText, label: 'Contracts', path: '/admin/paragon/contracts' }
// //   ]
// // };

// // interface NavigationProps {
// //   isSidebarOpen: boolean;
// //   selectedWebsite: { slug: string } | null;
// //   openDropdowns: { [key: string]: boolean };
// //   toggleDropdown: (title: string) => void;
// // }

// // export function Navigation({ 
// //   isSidebarOpen, 
// //   selectedWebsite, 
// //   openDropdowns, 
// //   toggleDropdown 
// // }: NavigationProps) {
// //   return (
// //     <nav className="p-2">
// //       <ul className="space-y-1">
// //         {defaultNavItems.map((item, index) => (
// //           <li key={index} className="relative">
// //             {item.subItems ? (
// //               <div>
// //                 <motion.button
// //                   whileTap={{ scale: 0.95 }}
// //                   onClick={() => toggleDropdown(item.label)}
// //                   className={`
// //                     w-full flex items-center gap-3 px-3 py-2 
// //                     text-gray-700 hover:bg-gray-100 rounded-lg 
// //                     transition-colors duration-200
// //                     ${openDropdowns[item.label] ? 'bg-gray-100' : ''}
// //                   `}
// //                 >
// //                   <item.icon size={20} className="flex-shrink-0" />
// //                   {isSidebarOpen && (
// //                     <>
// //                       <span className="flex-grow truncate">{item.label}</span>
// //                       {item.subItems && (
// //                         <motion.span 
// //                           animate={{ 
// //                             rotate: openDropdowns[item.label] ? 180 : 0 
// //                           }}
// //                           transition={{ duration: 0.2 }}
// //                           className="ml-auto"
// //                         >
// //                           <ChevronDown size={16} />
// //                         </motion.span>
// //                       )}
// //                     </>
// //                   )}
// //                 </motion.button>
                
// //                 <AnimatePresence>
// //                   {isSidebarOpen && openDropdowns[item.label] && (
// //                     <motion.ul
// //                       initial={{ opacity: 0, height: 0 }}
// //                       animate={{ 
// //                         opacity: 1, 
// //                         height: 'auto',
// //                         transition: { 
// //                           duration: 0.3,
// //                           height: { duration: 0.3 }
// //                         }
// //                       }}
// //                       exit={{ 
// //                         opacity: 0, 
// //                         height: 0,
// //                         transition: { 
// //                           duration: 0.2,
// //                           height: { duration: 0.2 }
// //                         }
// //                       }}
// //                       className="pl-8 space-y-1 mt-1 overflow-hidden"
// //                     >
// //                       {item.subItems.map((subItem, subIndex) => (
// //                         <motion.li 
// //                           key={subIndex}
// //                           initial={{ opacity: 0, x: -10 }}
// //                           animate={{ opacity: 1, x: 0 }}
// //                           exit={{ opacity: 0, x: -10 }}
// //                           transition={{ 
// //                             delay: subIndex * 0.05,
// //                             duration: 0.2
// //                           }}
// //                         >
// //                           <a
// //                             href={subItem.path}
// //                             className="
// //                               flex items-center gap-3 px-3 py-2 
// //                               text-gray-600 hover:bg-gray-100 
// //                               rounded-lg text-sm 
// //                               transition-colors duration-200
// //                             "
// //                           >
// //                             <subItem.icon size={16} className="flex-shrink-0" />
// //                             <span className="truncate">{subItem.label}</span>
// //                           </a>
// //                         </motion.li>
// //                       ))}
// //                     </motion.ul>
// //                   )}
// //                 </AnimatePresence>
// //               </div>
// //             ) : (
// //               <motion.a
// //                 whileTap={{ scale: 0.95 }}
// //                 href={item.path}
// //                 className="
// //                   flex items-center gap-3 px-3 py-2 
// //                   text-gray-700 hover:bg-gray-100 
// //                   rounded-lg 
// //                   transition-colors duration-200
// //                 "
// //               >
// //                 <item.icon size={20} className="flex-shrink-0" />
// //                 {isSidebarOpen && <span className="truncate">{item.label}</span>}
// //               </motion.a>
// //             )}
// //           </li>
// //         ))}

// //         {selectedWebsite && websiteNavItems[selectedWebsite.slug] && (
// //           <>
// //             <div className="my-2 border-t" />
// //             {websiteNavItems[selectedWebsite.slug].map((item, index) => (
// //               <motion.li 
// //                 key={`website-${index}`}
// //                 whileTap={{ scale: 0.95 }}
// //               >
// //                 <a
// //                   href={item.path}
// //                   className="
// //                     flex items-center gap-3 px-3 py-2 
// //                     text-gray-700 hover:bg-gray-100 
// //                     rounded-lg 
// //                     transition-colors duration-200
// //                   "
// //                 >
// //                   {item.icon && <item.icon size={20} className="flex-shrink-0" />}
// //                   {isSidebarOpen && <span className="truncate">{item.label}</span>}
// //                 </a>
// //               </motion.li>
// //             ))}
// //           </>
// //         )}
// //       </ul>
// //     </nav>
// //   );
// // }


// // src/components/layout/Navigation.tsx
// "use client"

// import { 
//   LayoutDashboard, 
//   BarChart, 
//   Settings, 
//   Users, 
//   FileText, 
//   Folder, 
//   Bell, 


//   TrendingUp, 
//   CreditCard, 

//   UserRound,
//   UserCog,
//   Lock,
//   Key,
//   ScrollText,
//   Activity,
//   Server,
//   List,
//   ChevronDown,
//   Home,           
//   Info,          
//   Trophy,         
//   Building2,    
//   UserPlus,      
//   Image,         
//   Phone   
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Website } from '@/components/providers/WebsiteProvider';

// const defaultNavItems = [
//   { 
//     icon: LayoutDashboard, 
//     label: 'Dashboard', 
//     path: '/admin/dashboard' 
//   },
//   { 
//     icon: Users, 
//     label: 'User Management', 
//     subItems: [
//       { 
//         icon: UserRound, 
//         label: 'All Users', 
//         path: '/admin/users' 
//       },
//       { 
//         icon: UserCog, 
//         label: 'User Roles', 
//         path: '/admin/users/roles' 
//       },
//       { 
//         icon: Lock, 
//         label: 'Permissions', 
//         path: '/admin/users/permissions' 
//       },
//       { 
//         icon: Key, 
//         label: 'Access Control', 
//         path: '/admin/users/access-control' 
//       }
//     ]
//   },
//   { 
//     icon: BarChart, 
//     label: 'Analytics', 
//     path: '/admin/analytics' 
//   },
//   { 
//     icon: FileText, 
//     label: 'Reports', 
//     subItems: [
//       { 
//         icon: ScrollText, 
//         label: 'User Reports', 
//         path: '/admin/reports/users' 
//       },
//       { 
//         icon: Activity, 
//         label: 'Activity Logs', 
//         path: '/admin/reports/activity' 
//       },
//       { 
//         icon: Server, 
//         label: 'System Logs', 
//         path: '/admin/reports/system' 
//       },
//       { 
//         icon: List, 
//         label: 'Comprehensive Reports', 
//         path: '/admin/reports/comprehensive' 
//       }
//     ]
//   },
//   { 
//     icon: Settings, 
//     label: 'Settings', 
//     path: '/admin/settings' 
//   }
// ];

// const websiteNavItems = {
//   parasole: [
//     { icon: Folder, label: 'Products', path: '/admin/parasole/products' },
//     { icon: CreditCard, label: 'Orders', path: '/admin/parasole/orders' },
//     { icon: TrendingUp, label: 'Inventory', path: '/admin/parasole/inventory' },
//     { icon: Bell, label: 'Notifications', path: '/admin/parasole/notifications' }
//   ],
//   // paragon: [
//   //   { icon: Globe, label: 'Properties', path: '/admin/paragon/properties' },
//   //   { icon: Briefcase, label: 'Projects', path: '/admin/paragon/projects' },
//   //   { icon: Shield, label: 'Leads', path: '/admin/paragon/leads' },
//   //   { icon: FileText, label: 'Contracts', path: '/admin/paragon/contracts' }
//   // ]
//   paragon: [
//     { icon: Home, label: 'Home', path: '/admin/paragon/home' },
//     { icon: Info, label: 'About', path: '/admin/paragon/about' },
//     { icon: Trophy, label: 'Milestones', path: '/admin/paragon/milestones' },
//     { icon: Activity, label: 'Business Activities', path: '/admin/paragon/business' },
//     { icon: Building2, label: 'Companies', path: '/admin/paragon/companies' },
//     { icon: UserPlus, label: 'Career', path: '/admin/paragon/career' },
//     { icon: Image, label: 'Media', path: '/admin/paragon/media' },
//     { icon: Phone, label: 'Contact', path: '/admin/paragon/contact' }
// ]
// };

// interface NavigationProps {
//   isSidebarOpen: boolean;
//   selectedWebsite: Website | null;
//   openDropdowns: { [key: string]: boolean };
//   toggleDropdown: (title: string) => void;
// }

// export function Navigation({ 
//   isSidebarOpen, 
//   selectedWebsite, 
//   openDropdowns, 
//   toggleDropdown 
// }: NavigationProps) {
//   return (
//     <nav className="p-2">
//       <ul className="space-y-1">
//         {defaultNavItems.map((item, index) => (
//           <li key={index} className="relative">
//             {item.subItems ? (
//               <div>
//                 <motion.button
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => toggleDropdown(item.label)}
//                   className={`
//                     w-full flex items-center gap-3 px-3 py-2 
//                     text-gray-700 hover:bg-gray-100 rounded-lg 
//                     transition-colors duration-200
//                     ${openDropdowns[item.label] ? 'bg-gray-100' : ''}
//                   `}
//                 >
//                   <item.icon size={20} className="flex-shrink-0" />
//                   {isSidebarOpen && (
//                     <>
//                       <span className="flex-grow truncate">{item.label}</span>
//                       {item.subItems && (
//                         <motion.span 
//                           animate={{ 
//                             rotate: openDropdowns[item.label] ? 180 : 0 
//                           }}
//                           transition={{ duration: 0.2 }}
//                           className="ml-auto"
//                         >
//                           <ChevronDown size={16} />
//                         </motion.span>
//                       )}
//                     </>
//                   )}
//                 </motion.button>
                
//                 <AnimatePresence>
//                   {isSidebarOpen && openDropdowns[item.label] && (
//                     <motion.ul
//                       initial={{ opacity: 0, height: 0 }}
//                       animate={{ 
//                         opacity: 1, 
//                         height: 'auto',
//                         transition: { 
//                           duration: 0.3,
//                           height: { duration: 0.3 }
//                         }
//                       }}
//                       exit={{ 
//                         opacity: 0, 
//                         height: 0,
//                         transition: { 
//                           duration: 0.2,
//                           height: { duration: 0.2 }
//                         }
//                       }}
//                       className="pl-8 space-y-1 mt-1 overflow-hidden"
//                     >
//                       {item.subItems.map((subItem, subIndex) => (
//                         <motion.li 
//                           key={subIndex}
//                           initial={{ opacity: 0, x: -10 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           exit={{ opacity: 0, x: -10 }}
//                           transition={{ 
//                             delay: subIndex * 0.05,
//                             duration: 0.2
//                           }}
//                         >
//                           <a
//                             href={subItem.path}
//                             className="
//                               flex items-center gap-3 px-3 py-2 
//                               text-gray-600 hover:bg-gray-100 
//                               rounded-lg text-sm 
//                               transition-colors duration-200
//                             "
//                           >
//                             <subItem.icon size={16} className="flex-shrink-0" />
//                             <span className="truncate">{subItem.label}</span>
//                           </a>
//                         </motion.li>
//                       ))}
//                     </motion.ul>
//                   )}
//                 </AnimatePresence>
//               </div>
//             ) : (
//               <motion.a
//                 whileTap={{ scale: 0.95 }}
//                 href={item.path}
//                 className="
//                   flex items-center gap-3 px-3 py-2 
//                   text-gray-700 hover:bg-gray-100 
//                   rounded-lg 
//                   transition-colors duration-200
//                 "
//               >
//                 <item.icon size={20} className="flex-shrink-0" />
//                 {isSidebarOpen && <span className="truncate">{item.label}</span>}
//               </motion.a>
//             )}
//           </li>
//         ))}

//         {selectedWebsite && websiteNavItems[selectedWebsite.slug] && (
//           <>
//             <div className="my-2 border-t border-gray-200" />
//             {websiteNavItems[selectedWebsite.slug].map((item, index) => (
//               <motion.li 
//                 key={`website-${index}`}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <a
//                   href={item.path}
//                   className="
//                     flex items-center gap-3 px-3 py-2 
//                     text-gray-700 hover:bg-gray-100 
//                     rounded-lg 
//                     transition-colors duration-200
//                   "
//                 >
//                   {item.icon && <item.icon size={20} className="flex-shrink-0" />}
//                   {isSidebarOpen && <span className="truncate">{item.label}</span>}
//                 </a>
//               </motion.li>
//             ))}
//           </>
//         )}
//       </ul>
//     </nav>
//   );
// }




// src/components/layout/Navigation.tsx
"use client"

import { 
 
  Shield,

  LayoutDashboard, 
  BarChart, 
  Settings, 
  Users, 


  UserRound,
  UserCog,
  Lock,

  ChevronDown,
  Home,           
  Info,          
  Trophy,        
  Building2,    
  UserPlus,      
  Image,         
  Phone,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Website } from '@/components/providers/WebsiteProvider';
import { usePathname } from 'next/navigation';

const defaultNavItems = [
  { 
    icon: LayoutDashboard, 
    label: 'Dashboard', 
    path: '/admin/dashboard' 
  },
  { 
    icon: Users, 
    label: 'User Management', 
    subItems: [
      { 
        icon: UserRound, 
        label: 'All Users', 
        path: '/admin/users' 
      },
      { 
        icon: UserCog, 
        label: 'User Roles', 
        path: '/admin/users/roles' 
      },
      { 
        icon: Lock, 
        label: 'Permissions', 
        path: '/admin/users/permissions' 
      }
    ]
  },
  { 
    icon: BarChart, 
    label: 'Analytics', 
    path: '/admin/analytics' 
  },
  { 
    icon: Settings, 
    label: 'Settings', 
    path: '/admin/settings' 
  }
];

const websiteNavItems = {
  parasole: [
    { icon: Home, label: 'Home', path: '/admin/parasole/home' },
    { icon: Info, label: 'About', path: '/admin/parasole/about' },
    { icon: Shield, label: 'Compliance', path: '/admin/parasole/compliance' },
    { icon: Settings, label: 'Operations', path: '/admin/parasole/operations' },
    { icon: Users, label: 'Buyers', path: '/admin/parasole/buyers' },
    { icon: Phone, label: 'Contact', path: '/admin/parasole/contact' }
],
 
  paragon: [
    { icon: Home, label: 'Home', path: '/admin/paragon/home' },
    { icon: Info, label: 'About', path: '/admin/paragon/about' },
    { icon: Trophy, label: 'Milestones', path: '/admin/paragon/milestones' },
    { icon: Briefcase, label: 'Business Activities', path: '/admin/paragon/buisness' },
    { icon: Building2, label: 'Companies', path: '/admin/paragon/companies' },
    { icon: UserPlus, label: 'Career', path: '/admin/paragon/career' },
    { icon: Image, label: 'Media', path: '/admin/paragon/media' },
    { icon: Phone, label: 'Contact', path: '/admin/paragon/contact' }
  ]
};

interface NavigationProps {
  isSidebarOpen: boolean;
  selectedWebsite: Website | null;
  openDropdowns: { [key: string]: boolean };
  toggleDropdown: (title: string) => void;
}

export default function Navigation({ 
  isSidebarOpen, 
  selectedWebsite, 
  openDropdowns, 
  toggleDropdown 
}: NavigationProps) {
  const pathname = usePathname();

  const isActivePath = (path: string) => pathname.startsWith(path);

  return (
    <nav className="p-2">
      <ul className="space-y-1">
        {defaultNavItems.map((item, index) => (
          <li key={index} className="relative">
            {item.subItems ? (
              <div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleDropdown(item.label)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 
                    text-gray-700 hover:bg-gray-100 rounded-lg 
                    transition-colors duration-200
                    ${openDropdowns[item.label] ? 'bg-gray-100' : ''}
                    ${isActivePath(item.path) ? 'bg-blue-50 text-blue-600' : ''}
                  `}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  {isSidebarOpen && (
                    <>
                      <span className="flex-grow truncate">{item.label}</span>
                      {item.subItems && (
                        <motion.span 
                          animate={{ 
                            rotate: openDropdowns[item.label] ? 180 : 0 
                          }}
                          transition={{ duration: 0.2 }}
                          className="ml-auto"
                        >
                          <ChevronDown size={16} />
                        </motion.span>
                      )}
                    </>
                  )}
                </motion.button>
                
                <AnimatePresence>
                  {isSidebarOpen && openDropdowns[item.label] && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ 
                        opacity: 1, 
                        height: 'auto',
                        transition: { duration: 0.3 }
                      }}
                      exit={{ 
                        opacity: 0, 
                        height: 0,
                        transition: { duration: 0.2 }
                      }}
                      className="pl-8 space-y-1 mt-1 overflow-hidden"
                    >
                      {item.subItems.map((subItem, subIndex) => (
                        <motion.li 
                          key={subIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ delay: subIndex * 0.05 }}
                        >
                          <a
                            href={subItem.path}
                            className={`
                              flex items-center gap-3 px-3 py-2 
                              text-gray-600 hover:bg-gray-100 
                              rounded-lg text-sm 
                              transition-colors duration-200
                              ${isActivePath(subItem.path) ? 'bg-blue-50 text-blue-600' : ''}
                            `}
                          >
                            <subItem.icon size={16} className="flex-shrink-0" />
                            <span className="truncate">{subItem.label}</span>
                          </a>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.a
                whileTap={{ scale: 0.95 }}
                href={item.path}
                className={`
                  flex items-center gap-3 px-3 py-2 
                  text-gray-700 hover:bg-gray-100 
                  rounded-lg transition-colors duration-200
                  ${isActivePath(item.path) ? 'bg-blue-50 text-blue-600' : ''}
                `}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {isSidebarOpen && <span className="truncate">{item.label}</span>}
              </motion.a>
            )}
          </li>
        ))}

        {selectedWebsite && websiteNavItems[selectedWebsite.slug] && (
          <>
            <div className="my-2 border-t border-gray-200" />
            {websiteNavItems[selectedWebsite.slug].map((item, index) => (
              <motion.li 
                key={`website-${index}`}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-2 
                    text-gray-700 hover:bg-gray-100 
                    rounded-lg transition-colors duration-200
                    ${isActivePath(item.path) ? 'bg-blue-50 text-blue-600' : ''}
                  `}
                >
                  {item.icon && (
                    <item.icon 
                      size={20} 
                      className={`flex-shrink-0 ${isActivePath(item.path) ? 'text-blue-600' : ''}`} 
                    />
                  )}
                  {isSidebarOpen && <span className="truncate">{item.label}</span>}
                </a>
              </motion.li>
            ))}
          </>
        )}
      </ul>
    </nav>
  );
}