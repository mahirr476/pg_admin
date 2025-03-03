

// "use client"

// import { useState, useEffect } from 'react';
// import { ChevronDown } from 'lucide-react';
// import { useWebsite } from '@/providers/WebsiteProvider';
// import { Website } from '@/providers/WebsiteProvider';
// import Cookies from 'js-cookie';

// // Define default websites
// const defaultWebsites: Website[] = [
//   { id: 1, name: 'Parasole', slug: 'parasole' },
//   { id: 2, name: 'Paragon ', slug: 'paragon' }
// ];

// export function WebsiteSelector() {
//   const { selectedWebsite, setSelectedWebsite } = useWebsite();
//   const [isWebsiteDropdownOpen, setWebsiteDropdownOpen] = useState(false);
//   const [websiteList, setWebsiteList] = useState<Website[]>(defaultWebsites);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const token = Cookies.get('token');

//   useEffect(() => {
//     // Check URL for slug and set default website
//     const pathSegments = window.location.pathname.split('/');
//     const slugFromUrl = pathSegments[2]; // Assuming URL pattern is /admin/[slug]/...

//     if (slugFromUrl) {
//       const defaultWebsite = defaultWebsites.find(w => w.slug === slugFromUrl);
//       if (defaultWebsite) {
//         setSelectedWebsite(defaultWebsite);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const fetchWebsites = async () => {
//       setIsLoading(true);
//       try {
//         const response = await fetch('http://localhost:7000/api/v1/website', {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });
        
//         if (!response.ok) {
//           // If API fails, fallback to default websites
//           setWebsiteList(defaultWebsites);
//           return;
//         }
        
//         const data = await response.json();
//         console.log('Website data:', data);
//         // Merge API data with default websites if needed
//         const websites = data.websites || defaultWebsites;
//         setWebsiteList(websites);
//       } catch (err) {
//         console.error('Error fetching websites:', err);
//         // Fallback to default websites on error
//         setWebsiteList(defaultWebsites);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchWebsites();
//   }, [token]);

//   const handleWebsiteSelect = (website: Website) => {
//     setSelectedWebsite(website);
//     setWebsiteDropdownOpen(false);
//     window.location.href = `/admin/${website.domain}/home`;
//   };

//   return (
//     <div className="relative">
//       <button
//         onClick={() => setWebsiteDropdownOpen(!isWebsiteDropdownOpen)}
//         className={`
//           flex items-center gap-2 px-4 py-2.5 
//           ${selectedWebsite ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-700'} 
//           border border-gray-200 rounded-xl hover:bg-gray-100 
//           transition-colors duration-200
//           ${isLoading ? 'opacity-50' : ''}
//         `}
//         disabled={isLoading}
//       >
//         {isLoading ? (
//           <span className="flex items-center gap-2">
//             <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//             Loading...
//           </span>
//         ) : (
//           <>
//             <span>{selectedWebsite ? selectedWebsite.name : 'Select Website'}</span>
//             <ChevronDown className={`w-4 h-4 transition-transform duration-200 
//               ${isWebsiteDropdownOpen ? 'rotate-180' : ''}`} />
//           </>
//         )}
//       </button>
      
//       {isWebsiteDropdownOpen && (
//         <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border 
//                      border-gray-100 py-2 z-50 transform transition-all duration-200">
//           {websiteList.map((website) => (
//             <button
//               key={website.id}
//               onClick={() => handleWebsiteSelect(website)}
//               className={`
//                 w-full px-4 py-2.5 text-left flex items-center gap-2
//                 ${selectedWebsite?.slug === website.slug 
//                   ? 'bg-blue-50 text-blue-600' 
//                   : 'text-gray-700 hover:bg-gray-50'}
//               `}
//             >
//               <div className={`w-2 h-2 rounded-full ${
//                 selectedWebsite?.slug === website.slug ? 'bg-blue-500' : 'bg-gray-300'
//               }`} />
//               {website.name}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }






