// // app/admin/parasole/home/page.tsx
// "use client";

// import { useState, useRef } from "react";
// import { toast, Toaster } from "sonner";
// import Image from "next/image";
// import { Plus, Pencil, Trash2, CheckCircle, XCircle, ImageIcon, AlertCircle } from "lucide-react";

// // Types
// interface HomePageItem {
//   id: number;
//   title: string;
//   description: string;
//   imageUrl: string;
//   status: "active" | "inactive";
// }

// export default function ParasoleHomePage() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const modalRef = useRef<HTMLDivElement>(null);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  
//   const [items, setItems] = useState<HomePageItem[]>([
//     // Sample data - replace with API call
//     {
//       id: 1,
//       title: "Welcome to Parasole Footwear",
//       description: "Premium footwear designed for comfort and style. Explore our sustainable collection.",
//       imageUrl: "/sample-images/hero-image.jpg",
//       status: "active"
//     },
//     {
//       id: 2,
//       title: "Summer Collection 2025",
//       description: "Lightweight and breathable footwear for the warmer months. Perfect for outdoor adventures.",
//       imageUrl: "/sample-images/summer-collection.jpg",
//       status: "active"
//     },
//     {
//       id: 3,
//       title: "About Our Materials",
//       description: "We use eco-friendly materials sourced from sustainable suppliers around the world.",
//       imageUrl: "/sample-images/materials.jpg",
//       status: "inactive"
//     }
//   ]);
  
//   const [currentItem, setCurrentItem] = useState<Partial<HomePageItem>>({
//     title: "",
//     description: "",
//     imageUrl: "",
//     status: "active"
//   });
  
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [isEditing, setIsEditing] = useState(false);
  
//   // Close modal when clicking outside
//   const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (modalRef.current && !modalRef.current.contains(e.target as Node) && !isLoading) {
//       handleCloseModal();
//     }
//   };
  
//   const resetForm = () => {
//     setCurrentItem({
//       title: "",
//       description: "",
//       imageUrl: "",
//       status: "active"
//     });
//     setSelectedFile(null);
//     setIsEditing(false);
//   };
  
//   const handleOpenModal = (item?: HomePageItem) => {
//     if (item) {
//       setCurrentItem(item);
//       setIsEditing(true);
//     } else {
//       resetForm();
//     }
//     setIsModalOpen(true);
//   };
  
//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     resetForm();
//   };
  
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setSelectedFile(e.target.files[0]);
//       // Create a preview URL for the image
//       setCurrentItem({
//         ...currentItem,
//         imageUrl: URL.createObjectURL(e.target.files[0])
//       });
//     }
//   };
  
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setCurrentItem({
//       ...currentItem,
//       [name]: value
//     });
//   };
  
//   const handleStatusChange = (id: number) => {
//     setItems(items.map(item => {
//       if (item.id === id) {
//         const newStatus = item.status === "active" ? "inactive" : "active";
        
//         // Show custom toast for status change
//         toast.success(`Status changed to ${newStatus.toUpperCase()}`, {
//           description: `Item "${item.title}" is now ${newStatus}.`,
//           position: "top-right"
//         });
        
//         return {
//           ...item,
//           status: newStatus
//         };
//       }
//       return item;
//     }));
//   };
  
//   const handleConfirmDelete = (id: number) => {
//     setShowDeleteConfirm(id);
//   };
  
//   const handleDelete = (id: number) => {
//     const itemToDelete = items.find(item => item.id === id);
    
//     // In a real application, you would make an API call here
//     setItems(items.filter(item => item.id !== id));
//     setShowDeleteConfirm(null);
    
//     // Show custom toast for delete
//     toast.error("Item Deleted", {
//       description: `"${itemToDelete?.title}" has been permanently removed.`,
//       position: "top-right"
//     });
//   };
  
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
    
//     // Validate inputs
//     if (!currentItem.title || !currentItem.description) {
//       toast.error("Missing Information", {
//         description: "Please fill in all required fields.",
//         position: "top-right"
//       });
//       setIsLoading(false);
//       return;
//     }
    
//     // Simulate API call
//     setTimeout(() => {
//       if (isEditing && currentItem.id) {
//         // Update existing item
//         setItems(items.map(item => 
//           item.id === currentItem.id 
//             ? { ...item, ...currentItem as HomePageItem } 
//             : item
//         ));
        
//         // Show custom toast for edit
//         toast.success("Item Updated Successfully", {
//           description: `Changes to "${currentItem.title}" have been saved.`,
//           position: "top-right"
//         });
//       } else {
//         // Add new item
//         const newItem = {
//           ...currentItem,
//           id: Math.max(0, ...items.map(item => item.id)) + 1,
//           status: currentItem.status as "active" | "inactive" || "active"
//         } as HomePageItem;
        
//         setItems([...items, newItem]);
        
//         // Show custom toast for add
//         toast.success("New Item Added", {
//           description: `"${newItem.title}" has been created successfully.`,
//           position: "top-right"
//         });
//       }
      
//       setIsLoading(false);
//       handleCloseModal();
//     }, 800);
//   };

//   return (
//     <div className="space-y-6">
//       {/* Toaster component for toast notifications in top right corner */}
//       <Toaster position="top-right" />
      
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-2xl font-bold text-gray-800">Home Page Content Management</h1>
//         <button 
//           onClick={() => handleOpenModal()} 
//           className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center shadow-sm"
//         >
//           <Plus className="mr-2 h-4 w-4" /> Add New Content
//         </button>
//       </div>
      
//       <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
//         <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//           <h2 className="text-lg font-semibold text-gray-800">Home Page Items</h2>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {items.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
//                     <div className="flex flex-col items-center justify-center space-y-3">
//                       <ImageIcon className="h-10 w-10 text-gray-400" />
//                       <p>No content items found.</p>
//                       <button
//                         onClick={() => handleOpenModal()}
//                         className="text-blue-600 hover:text-blue-800 text-sm font-medium"
//                       >
//                         Add your first content item
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 items.sort((a, b) => a.id - b.id).map((item) => (
//                   <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.title}</td>
//                     <td className="px-6 py-4 text-sm text-gray-700 max-w-[300px]">
//                       <p className="truncate" title={item.description}>
//                         {item.description}
//                       </p>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
//                         {item.imageUrl ? (
//                           <Image
//                             src={item.imageUrl}
//                             alt={item.title}
//                             fill
//                             sizes="64px"
//                             style={{ objectFit: "cover" }}
//                           />
//                         ) : (
//                           <div className="flex items-center justify-center h-full text-gray-400">
//                             <ImageIcon className="h-6 w-6" />
//                           </div>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <button
//                         onClick={() => handleStatusChange(item.id)}
//                         className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
//                           item.status === "active"
//                             ? "bg-green-100 text-green-800 hover:bg-green-200"
//                             : "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                         }`}
//                       >
//                         {item.status === "active" ? (
//                           <CheckCircle className="mr-1 h-3 w-3" />
//                         ) : (
//                           <XCircle className="mr-1 h-3 w-3" />
//                         )}
//                         {item.status === "active" ? "Active" : "Inactive"}
//                       </button>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                       {showDeleteConfirm === item.id ? (
//                         <div className="flex items-center justify-end space-x-2">
//                           <span className="text-xs text-gray-500">Confirm?</span>
//                           <button
//                             onClick={() => handleDelete(item.id)}
//                             className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-1 rounded transition-colors duration-200"
//                           >
//                             <CheckCircle className="h-4 w-4" />
//                           </button>
//                           <button
//                             onClick={() => setShowDeleteConfirm(null)}
//                             className="text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 p-1 rounded transition-colors duration-200"
//                           >
//                             <XCircle className="h-4 w-4" />
//                           </button>
//                         </div>
//                       ) : (
//                         <div className="flex items-center justify-end space-x-2">
//                           <button
//                             onClick={() => handleOpenModal(item)}
//                             className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 p-1 rounded transition-colors duration-200"
//                             title="Edit"
//                           >
//                             <Pencil className="h-4 w-4" />
//                           </button>
//                           <button
//                             onClick={() => handleConfirmDelete(item.id)}
//                             className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-1 rounded transition-colors duration-200"
//                             title="Delete"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//         {items.length > 0 && (
//           <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-right text-xs text-gray-500">
//             Showing {items.length} item{items.length !== 1 ? 's' : ''}
//           </div>
//         )}
//       </div>
      
//       {/* Add/Edit Modal */}
//       {isModalOpen && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
//           onClick={handleClickOutside}
//         >
//           <div 
//             ref={modalRef}
//             className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto overflow-hidden"
//             onClick={e => e.stopPropagation()}
//           >
//             <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//               <h2 className="text-lg font-semibold text-gray-800">
//                 {isEditing ? "Edit Content Item" : "Add New Content Item"}
//               </h2>
//             </div>
            
//             <form onSubmit={handleSubmit} className="p-6 space-y-6">
//               <div className="space-y-5">
//                 <div>
//                   <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
//                     Title <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     id="title"
//                     name="title"
//                     type="text"
//                     value={currentItem.title || ""}
//                     onChange={handleInputChange}
//                     placeholder="Enter title"
//                     required
//                     className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
//                   />
//                 </div>
                
//                 <div>
//                   <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
//                     Description <span className="text-red-500">*</span>
//                   </label>
//                   <textarea
//                     id="description"
//                     name="description"
//                     value={currentItem.description || ""}
//                     onChange={handleInputChange}
//                     placeholder="Enter description"
//                     rows={4}
//                     required
//                     className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
//                   />
//                 </div>
                
//                 <div>
//                   <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
//                     Image
//                   </label>
//                   <div className="flex items-start space-x-4">
//                     <div className="relative h-24 w-24 rounded-md overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
//                       {currentItem.imageUrl ? (
//                         <Image
//                           src={currentItem.imageUrl}
//                           alt="Preview"
//                           fill
//                           sizes="96px"
//                           style={{ objectFit: "cover" }}
//                         />
//                       ) : (
//                         <div className="flex items-center justify-center h-full w-full text-gray-400">
//                           <ImageIcon className="h-10 w-10" />
//                         </div>
//                       )}
//                     </div>
//                     <div className="flex-1">
//                       <input
//                         id="image"
//                         type="file"
//                         accept="image/*"
//                         onChange={handleFileChange}
//                         className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
//                       />
//                       <p className="mt-1 text-xs text-gray-500">
//                         Recommended size: 1200 x 800 pixels. Max size: 2MB.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Status
//                   </label>
//                   <div className="flex items-center space-x-4">
//                     <button
//                       type="button"
//                       onClick={() => 
//                         setCurrentItem({
//                           ...currentItem,
//                           status: "active"
//                         })
//                       }
//                       className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
//                         currentItem.status === "active"
//                           ? "bg-green-100 text-green-800 ring-2 ring-green-600"
//                           : "bg-gray-100 text-gray-800 hover:bg-green-50"
//                       }`}
//                     >
//                       <CheckCircle className="mr-2 h-4 w-4" />
//                       Active
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => 
//                         setCurrentItem({
//                           ...currentItem,
//                           status: "inactive"
//                         })
//                       }
//                       className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
//                         currentItem.status === "inactive"
//                           ? "bg-gray-200 text-gray-800 ring-2 ring-gray-400"
//                           : "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                       }`}
//                     >
//                       <XCircle className="mr-2 h-4 w-4" />
//                       Inactive
//                     </button>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="flex justify-end space-x-3 pt-6 border-t">
//                 <button
//                   type="button"
//                   onClick={handleCloseModal}
//                   disabled={isLoading}
//                   className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-colors duration-200"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
//                 >
//                   {isLoading ? (
//                     <span className="flex items-center">
//                       <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Processing...
//                     </span>
//                   ) : (
//                     isEditing ? "Update" : "Save"
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





// components/parasole/home/home.tsx
"use client";

import { useState } from "react";
import { Toaster } from "sonner";
import { Plus } from "lucide-react";
import { HomeTable } from "./home-table";
import { HomeItemForm } from "./home-item-form";
import { useHomeItem } from "@/hooks/parasole/home/use-home-item";
import { HomePageItem, HomePageItemFormData } from "@/types/parasole/home/home";

export function Home() {
  const { 
    items, 
    isLoading, 
    addItem, 
    updateItem, 
    deleteItem, 
    toggleItemStatus 
  } = useHomeItem();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<HomePageItem | undefined>(undefined);
  
  const handleOpenModal = (item?: HomePageItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(undefined);
  };
  
  const handleSubmit = async (data: HomePageItemFormData) => {
    if (selectedItem) {
      return await updateItem(selectedItem.id, data);
    } else {
      return await addItem(data);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toaster component for toast notifications in top right corner */}
      <Toaster position="top-right" />
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Home Page Content Management</h1>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Content
        </button>
      </div>
      
      <HomeTable 
        items={items}
        onEdit={handleOpenModal}
        onDelete={deleteItem}
        onToggleStatus={toggleItemStatus}
        isLoading={isLoading}
      />
      
      <HomeItemForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={selectedItem}
        isLoading={isLoading}
      />
    </div>
  );
}