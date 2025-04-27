// "use client";

// import React, { useRef, useState, useEffect } from "react";
// import Image from "next/image";
// import { CheckCircle, XCircle, ImageIcon, Loader2, ArrowRight, Upload } from "lucide-react";
// import { HeroItem, HeroItemFormData } from "@/types/parasole/home/home";
// import { formatImageUrl } from "@/hooks/parasole/home/use-home-item";

// interface HomeItemFormProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (data: HeroItemFormData) => Promise<boolean>;
//   initialData?: HeroItem;
//   isLoading: boolean;
// }

// export function HomeItemForm({
//   isOpen,
//   onClose,
//   onSubmit,
//   initialData,
//   isLoading
// }: HomeItemFormProps) {
//   // State initialization
//   const [formData, setFormData] = useState<HeroItemFormData>({
//     title: "",
//     description: "",
//     image: null,
//     index: null as unknown as number,
//     status: "ACTIVE"
//   });
  
//   const [imagePreview, setImagePreview] = useState<string>("");
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const modalRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
  
//   // Reset form when open state or initial data changes
//   useEffect(() => {
//     if (initialData) {
//       setFormData({
//         title: initialData.title,
//         description: initialData.description,
//         image: null, // We don't need to send the image back if not changing it
//         index: initialData.index,
//         status: initialData.status
//       });
      
//       // Set image preview if available
//       if (initialData.image) {
//         setImagePreview(formatImageUrl(initialData.image));
//       } else {
//         setImagePreview("");
//       }
//     } else {
//       // Reset form when no initialData is provided
//       setFormData({
//         title: "",
//         description: "",
//         image: null,
//         index: null as unknown as number,
//         status: "ACTIVE"
//       });
//       setImagePreview("");
//       setErrors({});
//     }
//   }, [initialData, isOpen]);
  
//   // Event handlers
//   const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (modalRef.current && !modalRef.current.contains(e.target as Node) && !isLoading) {
//       onClose();
//     }
//   };
  
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
    
//     // Clear error when user starts typing
//     setErrors(prev => ({ ...prev, [name]: "" }));
    
//     if (name === "index") {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value === "" ? null : parseInt(value)
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }
//   };
  
//   const triggerFileInput = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };
  
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     // Clear error when user selects a file
//     setErrors(prev => ({ ...prev, image: "" }));
    
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
      
//       // Validate file size (max 2MB)
//       if (file.size > 2 * 1024 * 1024) {
//         setErrors(prev => ({ ...prev, image: "Image size exceeds 2MB limit" }));
//         return;
//       }
      
//       // Validate file type
//       if (!file.type.startsWith('image/')) {
//         setErrors(prev => ({ ...prev, image: "Selected file is not an image" }));
//         return;
//       }
      
//       setFormData(prev => ({
//         ...prev,
//         image: file
//       }));
      
//       // Create a preview URL for the image
//       const imageUrl = URL.createObjectURL(file);
//       setImagePreview(imageUrl);
//     }
//   };
  
//   const handleStatusChange = (status: "ACTIVE" | "INACTIVE") => {
//     setFormData(prev => ({ ...prev, status }));
//   };
  
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     // Validate form
//     const newErrors: Record<string, string> = {};
    
//     // Required field validations
//     if (!formData.title.trim()) {
//       newErrors.title = "Title is required";
//     } else if (formData.title.length > 100) {
//       newErrors.title = "Title must be less than 100 characters";
//     }
    
//     if (!formData.description.trim()) {
//       newErrors.description = "Description is required";
//     } else if (formData.description.length > 500) {
//       newErrors.description = "Description must be less than 500 characters";
//     }
    
//     if (formData.index === null || formData.index === undefined) {
//       newErrors.index = "Index is required";
//     } else if (isNaN(Number(formData.index))) {
//       newErrors.index = "Index must be a number";
//     } else if (Number(formData.index) < 0) {
//       newErrors.index = "Index must be a non-negative number";
//     }
    
//     // Image validation for new items
//     if (!initialData && !formData.image) {
//       newErrors.image = "Image is required for new items";
//     }
    
//     // If there are validation errors, stop submission
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }
    
//     // If validation passes, proceed with submission
//     const success = await onSubmit(formData);
//     if (success) {
//       onClose();
//     }
//   };
  
//   // Don't render if modal is closed
//   if (!isOpen) return null;
  
//   return (
//     <div 
//       className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 md:p-6 transition-opacity duration-300 animate-fade-in"
//       onClick={handleClickOutside}
//     >
//       <div 
//         ref={modalRef}
//         className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-auto overflow-hidden transform transition-all duration-300 ease-out max-h-[90vh] flex flex-col animate-scale-up"
//         onClick={e => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-700 text-white sticky top-0 z-10">
//           <h2 className="text-xl font-bold flex items-center">
//             {initialData ? (
//               <>
//                 <span className="bg-white/20 backdrop-blur-sm p-2 rounded-md mr-3 flex items-center justify-center">
//                   <CheckCircle className="h-5 w-5" />
//                 </span>
//                 Edit Content Item
//               </>
//             ) : (
//               <>
//                 <span className="bg-white/20 backdrop-blur-sm p-2 rounded-md mr-3 flex items-center justify-center">
//                   <ImageIcon className="h-5 w-5" />
//                 </span>
//                 Add New Content Item
//               </>
//             )}
//           </h2>
//           <p className="text-blue-100 mt-1 text-sm">
//             {initialData ? 
//               "Update the details of your existing content item" : 
//               "Create a new content item to display on your home page"}
//           </p>
//         </div>
        
//         {/* Form */}
//         <div className="overflow-y-auto p-1">
//           <form onSubmit={handleSubmit} className="p-6 space-y-6">
//             <div className="space-y-6">
//               {/* Image Upload Field - Moved to top for better visibility */}
//               <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
//                 <label className="block text-sm font-medium text-gray-700 mb-3">
//                   Content Image {!initialData && <span className="text-red-500">*</span>}
//                 </label>
//                 <div className="flex flex-col sm:flex-row items-center gap-6">
//                   <div 
//                     className="h-36 w-36 rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm flex items-center justify-center group cursor-pointer hover:shadow-md transition-all duration-300 relative"
//                     onClick={triggerFileInput}
//                   >
//                     {imagePreview ? (
//                       <>
//                         <div className="relative h-full w-full">
//                           <img
//                             src={imagePreview}
//                             alt="Preview"
//                             className="h-full w-full object-cover transition-all duration-300 group-hover:opacity-80"
//                           />
//                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
//                             <Upload className="h-8 w-8 text-white" />
//                           </div>
//                         </div>
//                       </>
//                     ) : (
//                       <div className="flex flex-col items-center justify-center h-full w-full text-gray-400 bg-gray-50 group-hover:bg-gray-100 transition-colors duration-200">
//                         <Upload className="h-10 w-10 mb-2" />
//                         <span className="text-xs text-center px-2">Click to upload image</span>
//                       </div>
//                     )}
//                   </div>
                  
//                   <div className="flex-1 w-full">
//                     <input
//                       ref={fileInputRef}
//                       id="image"
//                       name="image"
//                       type="file"
//                       accept="image/*"
//                       onChange={handleFileChange}
//                       className="hidden"
//                     />
                    
//                     <div 
//                       onClick={triggerFileInput}
//                       className={`w-full py-3 px-4 border-2 border-dashed ${errors.image ? 'border-red-300 bg-red-50' : 'border-blue-200 bg-blue-50'} rounded-lg cursor-pointer hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center`}
//                     >
//                       <div className="text-center">
//                         <Upload className="h-6 w-6 text-blue-500 mx-auto mb-2" />
//                         <p className="text-sm font-medium text-blue-700">
//                           {imagePreview ? "Change image" : "Select an image"}
//                         </p>
//                         <p className="text-xs text-blue-600 mt-1">
//                           Drag and drop or click to browse
//                         </p>
//                       </div>
//                     </div>
                    
//                     {errors.image && (
//                       <p className="mt-2 text-sm text-red-600 flex items-center">
//                         <XCircle className="h-4 w-4 mr-1" /> {errors.image}
//                       </p>
//                     )}
//                     <p className="mt-2 text-xs text-gray-500">
//                       {initialData ? 
//                         "Upload a new image only if you want to change the current one." : 
//                         "Recommended size: 1200 x 800 pixels. Max size: 2MB."}
//                     </p>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Form Fields Group */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Title Field */}
//                 <div className="form-group col-span-2">
//                   <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
//                     Title <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     id="title"
//                     name="title"
//                     type="text"
//                     value={formData.title}
//                     onChange={handleInputChange}
//                     placeholder="Enter title"
//                     maxLength={100}
//                     className={`block w-full rounded-lg border ${errors.title ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900 transition-all duration-200`}
//                   />
//                   {errors.title && (
//                     <p className="mt-1 text-sm text-red-600 flex items-center">
//                       <XCircle className="h-4 w-4 mr-1" /> {errors.title}
//                     </p>
//                   )}
//                 </div>
                
//                 {/* Description Field */}
//                 <div className="form-group col-span-2">
//                   <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
//                     Description <span className="text-red-500">*</span>
//                   </label>
//                   <textarea
//                     id="description"
//                     name="description"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     placeholder="Enter description"
//                     rows={4}
//                     maxLength={500}
//                     className={`block w-full rounded-lg border ${errors.description ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900 transition-all duration-200`}
//                   />
//                   {errors.description && (
//                     <p className="mt-1 text-sm text-red-600 flex items-center">
//                       <XCircle className="h-4 w-4 mr-1" /> {errors.description}
//                     </p>
//                   )}
//                   <p className="mt-1 text-xs text-gray-500 flex justify-end">
//                     {500 - (formData.description?.length || 0)} characters remaining
//                   </p>
//                 </div>
                
//                 {/* Index Field */}
//                 <div className="form-group">
//                   <label htmlFor="index" className="block text-sm font-medium text-gray-700 mb-1">
//                     Display Order <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     id="index"
//                     name="index"
//                     type="number"
//                     value={formData.index === null ? '' : formData.index}
//                     onChange={handleInputChange}
//                     min="0"
//                     placeholder="Enter index number"
//                     className={`block w-full rounded-lg border ${errors.index ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900 transition-all duration-200`}
//                   />
//                   {errors.index && (
//                     <p className="mt-1 text-sm text-red-600 flex items-center">
//                       <XCircle className="h-4 w-4 mr-1" /> {errors.index}
//                     </p>
//                   )}
//                   <p className="mt-1 text-xs text-gray-500">
//                     Lower index items appear first in the sequence
//                   </p>
//                 </div>
                
//                 {/* Status Field */}
//                 <div className="form-group">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Status
//                   </label>
//                   <div className="flex items-center space-x-3">
//                     <button
//                       type="button"
//                       onClick={() => handleStatusChange("ACTIVE")}
//                       className={`flex-1 inline-flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
//                         formData.status === "ACTIVE"
//                           ? "bg-green-100 text-green-800 ring-1 ring-green-500 shadow-sm"
//                           : "bg-gray-50 text-gray-700 hover:bg-green-50 hover:text-green-700"
//                       }`}
//                     >
//                       <CheckCircle className="mr-2 h-4 w-4" />
//                       Active
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => handleStatusChange("INACTIVE")}
//                       className={`flex-1 inline-flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
//                         formData.status === "INACTIVE"
//                           ? "bg-gray-200 text-gray-800 ring-1 ring-gray-400 shadow-sm"
//                           : "bg-gray-50 text-gray-700 hover:bg-gray-200"
//                       }`}
//                     >
//                       <XCircle className="mr-2 h-4 w-4" />
//                       Inactive
//                     </button>
//                   </div>
//                   <p className="mt-1 text-xs text-gray-500">
//                     Inactive items won't be visible to users
//                   </p>
//                 </div>
//               </div>
//             </div>
            
//             {/* Form Actions */}
//             <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100 mt-4">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 disabled={isLoading}
//                 className="px-5 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-all duration-300 hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="px-6 py-3 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
//               >
//                 {isLoading ? (
//                   <span className="flex items-center">
//                     <Loader2 className="animate-spin mr-2 h-4 w-4 text-white" />
//                     Processing...
//                   </span>
//                 ) : (
//                   <>
//                     {initialData ? "Update" : "Save"} 
//                     <ArrowRight className="ml-2 h-4 w-4" />
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
      
//       {/* Global animations */}
//       <style jsx global>{`
//         @keyframes fade-in {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
        
//         @keyframes scale-up {
//           from { transform: scale(0.95); opacity: 0; }
//           to { transform: scale(1); opacity: 1; }
//         }
        
//         .animate-fade-in {
//           animation: fade-in 0.3s ease-out forwards;
//         }
        
//         .animate-scale-up {
//           animation: scale-up 0.4s ease-out forwards;
//         }
//       `}</style>
//     </div>
//   );
// }




"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { CheckCircle, XCircle, ImageIcon, Loader2, ArrowRight, Upload } from "lucide-react";
import { HeroItem, HeroItemFormData } from "@/types/parasole/home/home";
import { formatImageUrl, getFirstImage } from "@/hooks/parasole/home/use-home-item";

interface HomeItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: HeroItemFormData) => Promise<boolean>;
  initialData?: HeroItem;
  isLoading: boolean;
}

export function HomeItemForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading
}: HomeItemFormProps) {
  // State initialization
  const [formData, setFormData] = useState<HeroItemFormData>({
    title: "",
    description: "",
    image: null,
    index: 0, // Use 0 as default instead of null
    status: "ACTIVE"
  });
  
  const [imagePreview, setImagePreview] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Reset form when open state or initial data changes
  useEffect(() => {
    if (initialData) {
      // Convert initialData.index to number to avoid type issues
      const index = typeof initialData.index === 'string' 
        ? parseInt(initialData.index) 
        : initialData.index;
      
      setFormData({
        title: initialData.title,
        description: initialData.description,
        image: null, // We don't need to send the image back if not changing it
        index: isNaN(index) ? 0 : index,
        status: initialData.status
      });
      
      // Set image preview from either images array or image field
      if (initialData.images && Array.isArray(initialData.images) && initialData.images.length > 0) {
        setImagePreview(formatImageUrl(initialData.images[0]));
      } else if (initialData.image) {
        setImagePreview(formatImageUrl(initialData.image));
      } else {
        setImagePreview("");
      }
    } else {
      // Reset form when no initialData is provided
      setFormData({
        title: "",
        description: "",
        image: null,
        index: 0,
        status: "ACTIVE"
      });
      setImagePreview("");
      setErrors({});
    }
  }, [initialData, isOpen]);
  
  // Event handlers
  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node) && !isLoading) {
      onClose();
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Clear error when user starts typing
    setErrors(prev => ({ ...prev, [name]: "" }));
    
    if (name === "index") {
      const parsedValue = parseInt(value);
      setFormData(prev => ({
        ...prev,
        [name]: isNaN(parsedValue) ? 0 : parsedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear error when user selects a file
    setErrors(prev => ({ ...prev, image: "" }));
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: "Image size exceeds 2MB limit" }));
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: "Selected file is not an image" }));
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create a preview URL for the image
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };
  
  const handleStatusChange = (status: "ACTIVE" | "INACTIVE") => {
    setFormData(prev => ({ ...prev, status }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    // Required field validations
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }
    
    // Ensure index is a number
    if (formData.index < 0) {
      newErrors.index = "Index must be a non-negative number";
    }
    
    // Image validation for new items (not required when editing an item that already has images)
    if (!initialData && !formData.image) {
      newErrors.image = "Image is required for new items";
    }
    
    // If there are validation errors, stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Log the form data being submitted for debugging
    console.log("Submitting form data:", formData);
    
    // If validation passes, proceed with submission
    const success = await onSubmit(formData);
    if (success) {
      onClose();
    }
  };
  
  // Don't render if modal is closed
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 md:p-6 transition-opacity duration-300 animate-fade-in"
      onClick={handleClickOutside}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-auto overflow-hidden transform transition-all duration-300 ease-out max-h-[90vh] flex flex-col animate-scale-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-700 text-white sticky top-0 z-10">
          <h2 className="text-xl font-bold flex items-center">
            {initialData ? (
              <>
                <span className="bg-white/20 backdrop-blur-sm p-2 rounded-md mr-3 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5" />
                </span>
                Edit Content Item
              </>
            ) : (
              <>
                <span className="bg-white/20 backdrop-blur-sm p-2 rounded-md mr-3 flex items-center justify-center">
                  <ImageIcon className="h-5 w-5" />
                </span>
                Add New Content Item
              </>
            )}
          </h2>
          <p className="text-blue-100 mt-1 text-sm">
            {initialData ? 
              "Update the details of your existing content item" : 
              "Create a new content item to display on your home page"}
          </p>
        </div>
        
        {/* Form */}
        <div className="overflow-y-auto p-1">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-6">
              {/* Image Upload Field - Moved to top for better visibility */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Content Image {!initialData && <span className="text-red-500">*</span>}
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div 
                    className="h-36 w-36 rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm flex items-center justify-center group cursor-pointer hover:shadow-md transition-all duration-300 relative"
                    onClick={triggerFileInput}
                  >
                    {imagePreview ? (
                      <>
                        <div className="relative h-full w-full">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-full w-full object-cover transition-all duration-300 group-hover:opacity-80"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Upload className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full w-full text-gray-400 bg-gray-50 group-hover:bg-gray-100 transition-colors duration-200">
                        <Upload className="h-10 w-10 mb-2" />
                        <span className="text-xs text-center px-2">Click to upload image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 w-full">
                    <input
                      ref={fileInputRef}
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    
                    <div 
                      onClick={triggerFileInput}
                      className={`w-full py-3 px-4 border-2 border-dashed ${errors.image ? 'border-red-300 bg-red-50' : 'border-blue-200 bg-blue-50'} rounded-lg cursor-pointer hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center`}
                    >
                      <div className="text-center">
                        <Upload className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                        <p className="text-sm font-medium text-blue-700">
                          {imagePreview ? "Change image" : "Select an image"}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Drag and drop or click to browse
                        </p>
                      </div>
                    </div>
                    
                    {errors.image && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <XCircle className="h-4 w-4 mr-1" /> {errors.image}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                      {initialData ? 
                        "Upload a new image only if you want to change the current one." : 
                        "Recommended size: 1200 x 800 pixels. Max size: 2MB."}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Form Fields Group */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title Field */}
                <div className="form-group col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter title"
                    maxLength={100}
                    className={`block w-full rounded-lg border ${errors.title ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900 transition-all duration-200`}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <XCircle className="h-4 w-4 mr-1" /> {errors.title}
                    </p>
                  )}
                </div>
                
                {/* Description Field */}
                <div className="form-group col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter description"
                    rows={4}
                    maxLength={500}
                    className={`block w-full rounded-lg border ${errors.description ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900 transition-all duration-200`}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <XCircle className="h-4 w-4 mr-1" /> {errors.description}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 flex justify-end">
                    {500 - (formData.description?.length || 0)} characters remaining
                  </p>
                </div>
                
                {/* Index Field */}
                <div className="form-group">
                  <label htmlFor="index" className="block text-sm font-medium text-gray-700 mb-1">
                    Display Order <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="index"
                    name="index"
                    type="number"
                    value={formData.index}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="Enter index number"
                    className={`block w-full rounded-lg border ${errors.index ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900 transition-all duration-200`}
                  />
                  {errors.index && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <XCircle className="h-4 w-4 mr-1" /> {errors.index}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Lower index items appear first in the sequence
                  </p>
                </div>
                
                {/* Status Field */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => handleStatusChange("ACTIVE")}
                      className={`flex-1 inline-flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        formData.status === "ACTIVE"
                          ? "bg-green-100 text-green-800 ring-1 ring-green-500 shadow-sm"
                          : "bg-gray-50 text-gray-700 hover:bg-green-50 hover:text-green-700"
                      }`}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Active
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange("INACTIVE")}
                      className={`flex-1 inline-flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        formData.status === "INACTIVE"
                          ? "bg-gray-200 text-gray-800 ring-1 ring-gray-400 shadow-sm"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Inactive
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Inactive items won't be visible to users
                  </p>
                </div>
              </div>
            </div>
            
            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100 mt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-5 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-all duration-300 hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <Loader2 className="animate-spin mr-2 h-4 w-4 text-white" />
                    Processing...
                  </span>
                ) : (
                  <>
                    {initialData ? "Update" : "Save"} 
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Global animations */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-up {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        
        .animate-scale-up {
          animation: scale-up 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}