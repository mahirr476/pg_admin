

// "use client"

// import { useState } from 'react';
// import { ChevronDown } from 'lucide-react';
// import { useWebsite } from '@/providers/WebsiteProvider';
// import { Website } from '@/providers/WebsiteProvider';

// const websites: Website[] = [
//   { id: 1, name: 'Parasole', slug: 'parasole' },
//   { id: 2, name: 'Paragon Group', slug: 'paragon' }
// ];

// export function WebsiteSelector() {
//   const { selectedWebsite, setSelectedWebsite } = useWebsite();
//   const [isWebsiteDropdownOpen, setWebsiteDropdownOpen] = useState(false);

//   const handleWebsiteSelect = (website: Website) => {
//     setSelectedWebsite(website);
//     setWebsiteDropdownOpen(false);
//     window.location.href = `/admin/${website.slug}/home`;
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
//         `}
//       >
//         <span>{selectedWebsite ? selectedWebsite.name : 'Select Website'}</span>
//         <ChevronDown className={`w-4 h-4 transition-transform duration-200 
//           ${isWebsiteDropdownOpen ? 'rotate-180' : ''}`} />
//       </button>
      
//       {isWebsiteDropdownOpen && (
//         <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border 
//                      border-gray-100 py-2 z-50 transform transition-all duration-200">
//           {websites.map((website) => (
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




"use client"

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useWebsite } from '@/providers/WebsiteProvider';
import { Website } from '@/providers/WebsiteProvider';
import Cookies from 'js-cookie';

// Define default websites
const defaultWebsites: Website[] = [
  { id: 1, name: 'Parasole', slug: 'parasole' },
  { id: 2, name: 'Paragon Group', slug: 'paragon' }
];

export function WebsiteSelector() {
  const { selectedWebsite, setSelectedWebsite } = useWebsite();
  const [isWebsiteDropdownOpen, setWebsiteDropdownOpen] = useState(false);
  const [websiteList, setWebsiteList] = useState<Website[]>(defaultWebsites);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = Cookies.get('token');

  useEffect(() => {
    // Check URL for slug and set default website
    const pathSegments = window.location.pathname.split('/');
    const slugFromUrl = pathSegments[2]; // Assuming URL pattern is /admin/[slug]/...

    if (slugFromUrl) {
      const defaultWebsite = defaultWebsites.find(w => w.slug === slugFromUrl);
      if (defaultWebsite) {
        setSelectedWebsite(defaultWebsite);
      }
    }
  }, []);

  useEffect(() => {
    const fetchWebsites = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:7000/api/v1/website', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          // If API fails, fallback to default websites
          setWebsiteList(defaultWebsites);
          return;
        }
        
        const data = await response.json();
        // Merge API data with default websites if needed
        const websites = data.websites || defaultWebsites;
        setWebsiteList(websites);
      } catch (err) {
        console.error('Error fetching websites:', err);
        // Fallback to default websites on error
        setWebsiteList(defaultWebsites);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWebsites();
  }, [token]);

  const handleWebsiteSelect = (website: Website) => {
    setSelectedWebsite(website);
    setWebsiteDropdownOpen(false);
    window.location.href = `/admin/${website.slug}/home`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setWebsiteDropdownOpen(!isWebsiteDropdownOpen)}
        className={`
          flex items-center gap-2 px-4 py-2.5 
          ${selectedWebsite ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-700'} 
          border border-gray-200 rounded-xl hover:bg-gray-100 
          transition-colors duration-200
          ${isLoading ? 'opacity-50' : ''}
        `}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            Loading...
          </span>
        ) : (
          <>
            <span>{selectedWebsite ? selectedWebsite.name : 'Select Website'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 
              ${isWebsiteDropdownOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>
      
      {isWebsiteDropdownOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border 
                     border-gray-100 py-2 z-50 transform transition-all duration-200">
          {websiteList.map((website) => (
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
  );
}








// "use client"

// import { useState, useEffect } from 'react';
// import { ChevronDown, Plus, Edit, Trash } from 'lucide-react';
// import { useWebsite } from '@/providers/WebsiteProvider';
// import { Website } from '@/providers/WebsiteProvider';
// import Cookies from 'js-cookie';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Alert, AlertDescription } from "@/components/ui/alert";

// // Types
// interface WebsiteFormData {
//   name: string;
//   slug: string;
//   // Add other fields as needed
// }

// // WebsiteSelector Component
// export function WebsiteSelector() {
//   const { selectedWebsite, setSelectedWebsite } = useWebsite();
//   const [isWebsiteDropdownOpen, setWebsiteDropdownOpen] = useState(false);
//   const [websiteList, setWebsiteList] = useState<Website[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [showAddDialog, setShowAddDialog] = useState(false);
//   const [showEditDialog, setShowEditDialog] = useState(false);
//   const [editingWebsite, setEditingWebsite] = useState<Website | null>(null);

//   const token = Cookies.get('token');

//   const fetchWebsites = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await fetch('http://localhost:7000/api/v1/website', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       if (!response.ok) {
//         throw new Error('Failed to fetch websites');
//       }
//       const data = await response.json();
//       setWebsiteList(data.websites || []);
//     } catch (err) {
//       setError('Error loading websites');
//       console.error('Error:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchWebsites();
//   }, [token]);

//   const handleWebsiteSelect = async (website: Website) => {
//     try {
//       const response = await fetch(`http://localhost:7000/api/v1/website/${website.id}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       if (!response.ok) {
//         throw new Error('Failed to fetch website details');
//       }
//       const data = await response.json();
//       const detailedWebsite = data.website;
      
//       setSelectedWebsite(detailedWebsite);
//       setWebsiteDropdownOpen(false);
//       window.location.href = `/admin/${detailedWebsite.slug}/home`;
//     } catch (err) {
//       console.error('Error fetching website details:', err);
//       setSelectedWebsite(website);
//       setWebsiteDropdownOpen(false);
//       window.location.href = `/admin/${website.slug}/home`;
//     }
//   };

//   const handleAddWebsite = async (formData: WebsiteFormData) => {
//     try {
//       const response = await fetch('http://localhost:7000/api/v1/website', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(formData)
//       });

//       if (!response.ok) {
//         throw new Error('Failed to add website');
//       }

//       await fetchWebsites();
//       setShowAddDialog(false);
//     } catch (err) {
//       console.error('Error adding website:', err);
//       setError('Failed to add website');
//     }
//   };

//   const handleEditWebsite = async (id: number, formData: WebsiteFormData) => {
//     try {
//       const response = await fetch(`http://localhost:7000/api/v1/website/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(formData)
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update website');
//       }

//       await fetchWebsites();
//       setShowEditDialog(false);
//       setEditingWebsite(null);
//     } catch (err) {
//       console.error('Error updating website:', err);
//       setError('Failed to update website');
//     }
//   };

//   return (
//     <div className="relative">
//       {/* Website Selector Button */}
//       <div className="flex items-center gap-2">
//         <button
//           onClick={() => setWebsiteDropdownOpen(!isWebsiteDropdownOpen)}
//           className={`
//             flex items-center gap-2 px-4 py-2.5 
//             ${selectedWebsite ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-700'} 
//             border border-gray-200 rounded-xl hover:bg-gray-100 
//             transition-colors duration-200
//             ${isLoading ? 'opacity-50 cursor-wait' : ''}
//             ${error ? 'border-red-300 bg-red-50' : ''}
//           `}
//           disabled={isLoading}
//         >
//           {isLoading ? (
//             <span className="flex items-center gap-2">
//               <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//               Loading...
//             </span>
//           ) : (
//             <>
//               <span>{selectedWebsite ? selectedWebsite.name : 'Select Website'}</span>
//               <ChevronDown className={`w-4 h-4 transition-transform duration-200 
//                 ${isWebsiteDropdownOpen ? 'rotate-180' : ''}`} />
//             </>
//           )}
//         </button>

//         <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
//           <DialogTrigger asChild>
//             <Button variant="outline" className="gap-2">
//               <Plus className="w-4 h-4" />
//               Add Website
//             </Button>
//           </DialogTrigger>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Add New Website</DialogTitle>
//             </DialogHeader>
//             <WebsiteForm onSubmit={handleAddWebsite} />
//           </DialogContent>
//         </Dialog>
//       </div>
      
//       {/* Dropdown Content */}
//       {isWebsiteDropdownOpen && !isLoading && !error && (
//         <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border 
//                      border-gray-100 py-2 z-50 transform transition-all duration-200">
//           {websiteList.length > 0 ? (
//             websiteList.map((website) => (
//               <div
//                 key={website.id}
//                 className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50"
//               >
//                 <button
//                   onClick={() => handleWebsiteSelect(website)}
//                   className={`
//                     flex items-center gap-2 flex-grow text-left
//                     ${selectedWebsite?.slug === website.slug 
//                       ? 'text-blue-600' 
//                       : 'text-gray-700'}
//                   `}
//                 >
//                   <div className={`w-2 h-2 rounded-full ${
//                     selectedWebsite?.slug === website.slug ? 'bg-blue-500' : 'bg-gray-300'
//                   }`} />
//                   {website.name}
//                 </button>
//                 <div className="flex items-center gap-2">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => {
//                       setEditingWebsite(website);
//                       setShowEditDialog(true);
//                     }}
//                   >
//                     <Edit className="w-4 h-4" />
//                   </Button>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="px-4 py-2 text-gray-500">No websites found</div>
//           )}
//         </div>
//       )}

//       {/* Edit Dialog */}
//       <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Edit Website</DialogTitle>
//           </DialogHeader>
//           {editingWebsite && (
//             <WebsiteForm 
//               initialData={editingWebsite}
//               onSubmit={(formData) => handleEditWebsite(editingWebsite.id, formData)} 
//             />
//           )}
//         </DialogContent>
//       </Dialog>

//       {error && isWebsiteDropdownOpen && (
//         <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border 
//                      border-red-100 py-2 z-50">
//           <div className="px-4 py-2 text-red-600">{error}</div>
//         </div>
//       )}
//     </div>
//   );
// }

// // WebsiteForm Component
// function WebsiteForm({ 
//   onSubmit, 
//   initialData 
// }: { 
//   onSubmit: (data: WebsiteFormData) => void;
//   initialData?: Website;
// }) {
//   const [formData, setFormData] = useState<WebsiteFormData>({
//     name: initialData?.name || '',
//     slug: initialData?.slug || ''
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div className="space-y-2">
//         <label className="text-sm font-medium">Website Name</label>
//         <Input
//           value={formData.name}
//           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//           placeholder="Enter website name"
//           required
//         />
//       </div>
//       <div className="space-y-2">
//         <label className="text-sm font-medium">Slug</label>
//         <Input
//           value={formData.slug}
//           onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
//           placeholder="enter-slug"
//           required
//         />
//       </div>
//       <Button type="submit" className="w-full">
//         {initialData ? 'Update Website' : 'Add Website'}
//       </Button>
//     </form>
//   );
// }




// // components/WebsiteSelector.tsx
// "use client"

// import { useState, useEffect } from 'react';
// import { ChevronDown, Plus, Edit } from 'lucide-react';
// import { useWebsite } from '@/providers/WebsiteProvider';
// import { Website } from '@/types/website';
// import Cookies from 'js-cookie';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { WebsiteForm } from './WebsiteForm';

// export function WebsiteSelector() {
//   const { selectedWebsite, setSelectedWebsite } = useWebsite();
//   const [isWebsiteDropdownOpen, setWebsiteDropdownOpen] = useState(false);
//   const [websiteList, setWebsiteList] = useState<Website[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [showAddDialog, setShowAddDialog] = useState(false);
//   const [showEditDialog, setShowEditDialog] = useState(false);
//   const [editingWebsite, setEditingWebsite] = useState<Website | null>(null);

//   const token = Cookies.get('token');

//   const fetchWebsites = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await fetch('http://localhost:7000/api/v1/website', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       if (!response.ok) {
//         throw new Error('Failed to fetch websites');
//       }
//       const data = await response.json();
//       setWebsiteList(data.websites || []);
//     } catch (err) {
//       setError('Error loading websites');
//       console.error('Error:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchWebsites();
//   }, [token]);

//   const handleWebsiteSelect = async (website: Website) => {
//     try {
//       const response = await fetch(`http://localhost:7000/api/v1/website/${website.id}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       if (!response.ok) {
//         throw new Error('Failed to fetch website details');
//       }
//       const data = await response.json();
//       const detailedWebsite = data.website;
      
//       setSelectedWebsite(detailedWebsite);
//       setWebsiteDropdownOpen(false);
//       window.location.href = `/admin/${detailedWebsite.slug}/home`;
//     } catch (err) {
//       console.error('Error fetching website details:', err);
//       setSelectedWebsite(website);
//       setWebsiteDropdownOpen(false);
//       window.location.href = `/admin/${website.slug}/home`;
//     }
//   };

//   const handleAddSuccess = () => {
//     setShowAddDialog(false);
//     fetchWebsites();
//   };

//   const handleEditSuccess = () => {
//     setShowEditDialog(false);
//     setEditingWebsite(null);
//     fetchWebsites();
//   };

//   return (
//     <div className="relative">
//       {/* Website Selector Button */}
//       <div className="flex items-center gap-2">
//         <button
//           onClick={() => setWebsiteDropdownOpen(!isWebsiteDropdownOpen)}
//           className={`
//             flex items-center gap-2 px-4 py-2.5 
//             ${selectedWebsite ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-700'} 
//             border border-gray-200 rounded-xl hover:bg-gray-100 
//             transition-colors duration-200
//             ${isLoading ? 'opacity-50 cursor-wait' : ''}
//             ${error ? 'border-red-300 bg-red-50' : ''}
//           `}
//           disabled={isLoading}
//         >
//           {isLoading ? (
//             <span className="flex items-center gap-2">
//               <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//               Loading...
//             </span>
//           ) : (
//             <>
//               <span>{selectedWebsite ? selectedWebsite.name : 'Select Website'}</span>
//               <ChevronDown className={`w-4 h-4 transition-transform duration-200 
//                 ${isWebsiteDropdownOpen ? 'rotate-180' : ''}`} />
//             </>
//           )}
//         </button>

//         <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
//           <DialogTrigger asChild>
//             <Button variant="outline" className="gap-2">
//               <Plus className="w-4 h-4" />
//               Add Website
//             </Button>
//           </DialogTrigger>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Add New Website</DialogTitle>
//             </DialogHeader>
//             <WebsiteForm onSuccess={handleAddSuccess} />
//           </DialogContent>
//         </Dialog>
//       </div>
      
//       {/* Dropdown Content */}
//       {isWebsiteDropdownOpen && !isLoading && !error && (
//         <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border 
//                      border-gray-100 py-2 z-50 transform transition-all duration-200">
//           {websiteList.length > 0 ? (
//             websiteList.map((website) => (
//               <div
//                 key={website.id}
//                 className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50"
//               >
//                 <button
//                   onClick={() => handleWebsiteSelect(website)}
//                   className={`
//                     flex items-center gap-2 flex-grow text-left
//                     ${selectedWebsite?.slug === website.slug 
//                       ? 'text-blue-600' 
//                       : 'text-gray-700'}
//                   `}
//                 >
//                   <div className={`w-2 h-2 rounded-full ${
//                     selectedWebsite?.slug === website.slug ? 'bg-blue-500' : 'bg-gray-300'
//                   }`} />
//                   {website.name}
//                 </button>
//                 <div className="flex items-center gap-2">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => {
//                       setEditingWebsite(website);
//                       setShowEditDialog(true);
//                     }}
//                   >
//                     <Edit className="w-4 h-4" />
//                   </Button>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="px-4 py-2 text-gray-500">No websites found</div>
//           )}
//         </div>
//       )}

//       {/* Edit Dialog */}
//       <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Edit Website</DialogTitle>
//           </DialogHeader>
//           {editingWebsite && (
//             <WebsiteForm 
//               initialData={editingWebsite}
//               onSuccess={handleEditSuccess}
//             />
//           )}
//         </DialogContent>
//       </Dialog>

//       {error && isWebsiteDropdownOpen && (
//         <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border 
//                      border-red-100 py-2 z-50">
//           <div className="px-4 py-2 text-red-600">{error}</div>
//         </div>
//       )}
//     </div>
//   );
// }




// "use client";

// import { useState, useEffect } from 'react';
// import { ChevronDown, Plus, Edit, Trash } from 'lucide-react';
// import { useWebsite } from '@/providers/WebsiteProvider';
// import { Website } from '@/providers/WebsiteProvider';
// import Cookies from 'js-cookie';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Alert, AlertDescription } from "@/components/ui/alert";

// // Types
// interface WebsiteFormData {
//   name: string;
//   slug: string;
//   // Add other fields as needed
// }

// // WebsiteSelector Component
// export function WebsiteSelector() {
//   const { selectedWebsite, setSelectedWebsite } = useWebsite();
//   const [isWebsiteDropdownOpen, setWebsiteDropdownOpen] = useState(false);
//   const [websiteList, setWebsiteList] = useState<Website[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [showAddDialog, setShowAddDialog] = useState(false);
//   const [showEditDialog, setShowEditDialog] = useState(false);
//   const [editingWebsite, setEditingWebsite] = useState<Website | null>(null);

//   const token = Cookies.get('token');

//   const fetchWebsites = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await fetch('http://localhost:7000/api/v1/website', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       if (!response.ok) {
//         throw new Error('Failed to fetch websites');
//       }
//       const data = await response.json();
//       setWebsiteList(data.websites || []);
//     } catch (err) {
//       setError('Error loading websites');
//       console.error('Error:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchWebsites();
//   }, [token]);

//   const handleWebsiteSelect = async (website: Website) => {
//     try {
//       const response = await fetch(`http://localhost:7000/api/v1/website/${website.id}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       if (!response.ok) {
//         throw new Error('Failed to fetch website details');
//       }
//       const data = await response.json();
//       const detailedWebsite = data.websites;

//       setSelectedWebsite(detailedWebsite);
//       setWebsiteDropdownOpen(false);
//       window.location.href = `/admin/${detailedWebsite.slug}/home`;
//     } catch (err) {
//       console.error('Error fetching website details:', err);
//       setSelectedWebsite(website);
//       setWebsiteDropdownOpen(false);
//       window.location.href = `/admin/${website.slug}/home`;
//     }
//   };

//   const handleAddWebsite = async (formData: WebsiteFormData) => {
//     try {
//       const response = await fetch('http://localhost:7000/api/v1/website', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(formData)
//       });

//       if (!response.ok) {
//         throw new Error('Failed to add website');
//       }

//       await fetchWebsites();
//       setShowAddDialog(false);
//     } catch (err) {
//       console.error('Error adding website:', err);
//       setError('Failed to add website');
//     }
//   };

//   const handleEditWebsite = async (id: number, formData: WebsiteFormData) => {
//     try {
//       const response = await fetch(`http://localhost:7000/api/v1/website/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(formData)
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update website');
//       }

//       await fetchWebsites();
//       setShowEditDialog(false);
//       setEditingWebsite(null);
//     } catch (err) {
//       console.error('Error updating website:', err);
//       setError('Failed to update website');
//     }
//   };

//   return (
//     <div>
//       {/* Website Selector Button */}
//       <Button
//         onClick={() => setWebsiteDropdownOpen(!isWebsiteDropdownOpen)}
//         className={`
//           flex items-center gap-2 px-4 py-2.5 
//           ${selectedWebsite ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-700'} 
//           border border-gray-200 rounded-xl hover:bg-gray-100 
//           transition-colors duration-200
//           ${isLoading ? 'opacity-50 cursor-wait' : ''}
//           ${error ? 'border-red-300 bg-red-50' : ''}
//         `}
//         disabled={isLoading}
//       >
//         {isLoading ? (
//           <span>Loading...</span>
//         ) : (
//           <>
//             {selectedWebsite ? selectedWebsite.name : 'Select Website'}
//             <ChevronDown size={16} />
//           </>
//         )}
//       </Button>

//       {/* Add Website Button */}
//       <Button
//         onClick={() => setShowAddDialog(true)}
//         className="ml-2"
//       >
//         <Plus size={16} /> Add Website
//       </Button>

//       {/* Dropdown Content */}
//       {isWebsiteDropdownOpen && !isLoading && !error && (
//         <div className="mt-2 border border-gray-200 rounded-lg shadow-lg bg-white">
//           {websiteList.length > 0 ? (
//             websiteList.map((website) => (
//               <div
//                 key={website.id}
//                 onClick={() => handleWebsiteSelect(website)}
//                 className={`
//                   flex items-center gap-2 flex-grow text-left px-4 py-2 cursor-pointer
//                   ${selectedWebsite?.slug === website.slug 
//                     ? 'text-blue-600' 
//                     : 'text-gray-700 hover:bg-gray-50'}
//                 `}
//               >
//                 {website.name}
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setEditingWebsite(website);
//                     setShowEditDialog(true);
//                   }}
//                   className="ml-auto text-gray-500 hover:text-gray-700"
//                 >
//                   <Edit size={16} />
//                 </button>
//               </div>
//             ))
//           ) : (
//             <div className="px-4 py-2 text-gray-500">No websites found</div>
//           )}
//         </div>
//       )}

//       {/* Add Website Dialog */}
//       <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Add New Website</DialogTitle>
//           </DialogHeader>
//           <WebsiteForm onSubmit={handleAddWebsite} />
//         </DialogContent>
//       </Dialog>

//       {/* Edit Website Dialog */}
//       <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Edit Website</DialogTitle>
//           </DialogHeader>
//           {editingWebsite && (
//             <WebsiteForm
//               onSubmit={(formData) => handleEditWebsite(editingWebsite.id, formData)}
//               initialData={editingWebsite}
//             />
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Error Alert */}
//       {error && isWebsiteDropdownOpen && (
//         <Alert variant="destructive" className="mt-2">
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}
//     </div>
//   );
// }

// // WebsiteForm Component
// function WebsiteForm({
//   onSubmit,
//   initialData
// }: {
//   onSubmit: (data: WebsiteFormData) => void;
//   initialData?: Website;
// }) {
//   const [formData, setFormData] = useState<WebsiteFormData>({
//     name: initialData?.name || '',
//     slug: initialData?.slug || ''
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700">Website Name</label>
//         <Input
//           type="text"
//           value={formData.name}
//           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//           placeholder="Enter website name"
//           required
//         />
//       </div>
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700">Slug</label>
//         <Input
//           type="text"
//           value={formData.slug}
//           onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
//           placeholder="enter-slug"
//           required
//         />
//       </div>
//       <Button type="submit">{initialData ? 'Update Website' : 'Add Website'}</Button>
//     </form>
//   );
// }