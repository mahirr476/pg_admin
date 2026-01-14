// 'use client';

// import React, { useState, useEffect } from 'react';
// import {
//   ChevronDown,
//   X,
//   Edit,
//   Trash,
//   Image as ImageIcon,
//   Save,
//   AlertCircle,
//   Loader2,
//   Plus,
//   Search,
//   ToggleLeft,
//   ToggleRight
// } from "lucide-react";
// import Cookies from "js-cookie";
// // Import PrimeReact Editor and required CSS
// import { Editor } from 'primereact/editor';
// import 'primereact/resources/themes/lara-light-indigo/theme.css';
// import 'primereact/resources/primereact.min.css';
// import 'primeicons/primeicons.css';

// // Types
// interface Business {
//   id: number;
//   title: string;
// }

// interface BusinessCertification {
//   id: number;
//   businessId?: number;
//   businessTitle?: string;
//   title: string;
//   description: string;
//   image: string | null;
//   status?: string;
//   createdBy?: string;
//   createdAt?: string;
//   updatedBy?: string;
//   updatedAt?: string | null;
// }

// // Form data structure
// interface FormData {
//   businessDropdown: string;
//   businessId: string;
//   title: string;
//   description: string;
//   image: File | null;
//   status: string;
// }

// const BusinessCertificationPage = () => {
//   // State
//   const [businesses, setBusinesses] = useState<Business[]>([]);
//   const [certifications, setCertifications] = useState<BusinessCertification[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isLoadingBusinesses, setIsLoadingBusinesses] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [showModal, setShowModal] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
//   const [editIndex, setEditIndex] = useState<number | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [formData, setFormData] = useState<FormData>({
//     businessDropdown: "",
//     businessId: "",
//     title: "",
//     description: "",
//     image: null,
//     status: "ACTIVE"
//   });
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [statusUpdating, setStatusUpdating] = useState<number | null>(null);

//   // Editor header template for improved styling (same as in previous components)
//   const editorHeader = (
//     <span className="ql-formats">
//       <button className="ql-bold" aria-label="Bold"></button>
//       <button className="ql-italic" aria-label="Italic"></button>
//       <button className="ql-underline" aria-label="Underline"></button>
//       <button className="ql-strike" aria-label="Strike"></button>
//       <button className="ql-blockquote" aria-label="Blockquote"></button>
//       <button className="ql-list" value="ordered" aria-label="Ordered List"></button>
//       <button className="ql-list" value="bullet" aria-label="Bullet List"></button>
//       <button className="ql-link" aria-label="Insert Link"></button>
//       <select className="ql-size" defaultValue="" aria-label="Size">
//         <option value="small">Small</option>
//         <option value="">Normal</option>
//         <option value="large">Large</option>
//         <option value="huge">Huge</option>
//       </select>
//       <select className="ql-header" defaultValue="0" aria-label="Header">
//         <option value="1">Heading 1</option>
//         <option value="2">Heading 2</option>
//         <option value="3">Heading 3</option>
//         <option value="0">Normal</option>
//       </select>
//       <select className="ql-align" defaultValue="" aria-label="Align">
//         <option value="">Left</option>
//         <option value="center">Center</option>
//         <option value="right">Right</option>
//         <option value="justify">Justify</option>
//       </select>
//     </span>
//   );

//   // Add custom editor styles (similar to previous components)
//   useEffect(() => {
//     // Add custom styles for the editor
//     const style = document.createElement('style');
//     style.innerHTML = `
//       .p-editor-container .p-editor-content {
//         border: 1px solid #d1d5db;
//         border-radius: 0.5rem;
//         min-height: 200px;
//       }
//       .p-editor-container .p-editor-content.p-error {
//         border-color: #ef4444;
//       }
//       .p-editor-container .p-editor-toolbar {
//         border-top-left-radius: 0.5rem;
//         border-top-right-radius: 0.5rem;
//         background-color: #f9fafb;
//         border: 1px solid #d1d5db;
//         border-bottom: none;
//       }
//       .ql-container {
//         font-family: inherit !important;
//         font-size: 1rem !important;
//       }
//       .ql-editor {
//         padding: 1rem !important;
//         min-height: 200px !important;
//       }
//       .ql-editor.ql-blank::before {
//         font-style: normal !important;
//         color: #9ca3af !important;
//       }
//       /* Dark mode support */
//       .dark .p-editor-container .p-editor-content {
//         border-color: #475569;
//         background-color: #1e293b;
//         color: #f8fafc;
//       }
//       .dark .p-editor-container .p-editor-toolbar {
//         background-color: #0f172a;
//         border-color: #475569;
//       }
//       .dark .ql-editor.ql-blank::before {
//         color: #64748b !important;
//       }
//       .dark .ql-snow .ql-stroke {
//         stroke: #94a3b8;
//       }
//       .dark .ql-snow .ql-fill, .dark .ql-snow .ql-stroke.ql-fill {
//         fill: #94a3b8;
//       }
//       .dark .ql-snow .ql-picker {
//         color: #94a3b8;
//       }
//       .dark .ql-snow .ql-picker-options {
//         background-color: #1e293b;
//         border-color: #475569;
//       }
//     `;
//     document.head.appendChild(style);

//     return () => {
//       document.head.removeChild(style);
//     };
//   }, []);

//   // Get auth token from cookies
//   const getAuthToken = (): string | undefined => {
//     return Cookies.get("token");
//   };

//   // Construct full image URL
//   const getImageUrl = (relativePath: string | null): string | null => {
//     if (!relativePath) return null;
//     return `http://localhost:7000/${relativePath.replace(/^public\//, "")}`;
//   };

//   // Fetch businesses for dropdown
//   useEffect(() => {
//     const fetchBusinesses = async () => {
//       setIsLoadingBusinesses(true);
//       setError(null);
//       try {
//         const token = getAuthToken();
//         if (!token) throw new Error("Authentication token not found");
        
//         const response = await fetch("http://localhost:7000/api/v1/group/business", {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });

//         if (!response.ok) throw new Error(`Failed to fetch businesses: ${response.status}`);
        
//         const result = await response.json();
//         if (result.success && result.data) {
//           const businessList = result.data.map((item: any) => ({
//             id: item.id,
//             title: item.title,
//           }));
//           setBusinesses(businessList);
//         } else {
//           throw new Error(result.message || "Failed to fetch businesses");
//         }
//       } catch (err) {
//         console.error("Error fetching businesses:", err);
//         setError(err instanceof Error ? err.message : "An unknown error occurred");
//       } finally {
//         setIsLoadingBusinesses(false);
//       }
//     };

//     fetchBusinesses();
//   }, []);

//   // Fetch business certifications
//   const fetchCertifications = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const token = getAuthToken();
//       if (!token) throw new Error("Authentication token not found");
      
//       const response = await fetch("http://localhost:7000/api/v1/group/business/certification", {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) throw new Error(`Failed to fetch certifications: ${response.status}`);
      
//       const result = await response.json();
//       if (result.success && result.data) {
//         setCertifications(result.data);
//       } else {
//         throw new Error(result.message || "Failed to fetch certifications");
//       }
//     } catch (err) {
//       console.error("Error fetching certifications:", err);
//       setError(err instanceof Error ? err.message : "An unknown error occurred");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Initial fetch
//   useEffect(() => {
//     fetchCertifications();
//   }, []);

//   // Handle selecting a business from dropdown
//   const handleBusinessSelect = (business: Business) => {
//     setSelectedBusiness(business);
//     setFormData((prev) => ({
//       ...prev,
//       businessDropdown: business.id.toString(),
//       businessId: business.id.toString(),
//     }));
//     setShowDropdown(false);
//     if (errors.businessId) {
//       setErrors((prev) => {
//         const newErrors = { ...prev };
//         delete newErrors.businessId;
//         return newErrors;
//       });
//     }
//   };

//   // Handle input changes
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     if (errors[name]) {
//       setErrors((prev) => {
//         const newErrors = { ...prev };
//         delete newErrors[name];
//         return newErrors;
//       });
//     }
//   };

//   // Handle description change from PrimeReact Editor
//   const handleEditorChange = (htmlValue: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       description: htmlValue || "",
//     }));
//     if (errors.description) {
//       setErrors((prev) => {
//         const newErrors = { ...prev };
//         delete newErrors.description;
//         return newErrors;
//       });
//     }
//   };

//   // Handle image upload
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setFormData((prev) => ({
//         ...prev,
//         image: file,
//       }));
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//       if (errors.image) {
//         setErrors((prev) => {
//           const newErrors = { ...prev };
//           delete newErrors.image;
//           return newErrors;
//         });
//       }
//     }
//   };

//   // Reset form and close modal
//   const resetForm = () => {
//     setFormData({
//       businessDropdown: "",
//       businessId: "",
//       title: "",
//       description: "",
//       image: null,
//       status: "ACTIVE",
//     });
//     setSelectedBusiness(null);
//     setEditIndex(null);
//     setShowModal(false);
//     setImagePreview(null);
//     setErrors({});
//   };

//   // Validate form
//   const validateForm = (): boolean => {
//     const newErrors: { [key: string]: string } = {};
//     if (!formData.businessId) newErrors.businessId = "Business ID is required";
//     if (!formData.title.trim()) newErrors.title = "Title is required";
//     if (!formData.description.trim()) newErrors.description = "Description is required";
//     if (!formData.image && editIndex === null) newErrors.image = "Image is required";
//     if (!formData.status) newErrors.status = "Status is required";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (validateForm()) {
//       setIsSubmitting(true);
//       setError(null);
//       try {
//         const token = getAuthToken();
//         if (!token) throw new Error("Authentication token not found");

//         const apiFormData = new FormData();
//         apiFormData.append("businessId", formData.businessId);
//         apiFormData.append("title", formData.title);
//         apiFormData.append("description", formData.description);
//         apiFormData.append("status", formData.status);
//         if (formData.image) apiFormData.append("image", formData.image);

//         let response;
//         if (editIndex !== null) {
//           const certId = certifications[editIndex].id;
//           response = await fetch(`http://localhost:7000/api/v1/group/business/certification/${certId}`, {
//             method: "PUT",
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//             body: apiFormData,
//           });
//         } else {
//           response = await fetch("http://localhost:7000/api/v1/group/business/certification", {
//             method: "POST",
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//             body: apiFormData,
//           });
//         }

//         if (!response.ok) {
//           const errorResult = await response.json();
//           throw new Error(errorResult.message || `HTTP error: ${response.status}`);
//         }
        
//         const result = await response.json();
//         if (!result.success) throw new Error(result.message || "Operation failed");
        
//         await fetchCertifications();
//         resetForm();
//       } catch (err) {
//         console.error("Error submitting form:", err);
//         setError(err instanceof Error ? err.message : "An unknown error occurred");
//       } finally {
//         setIsSubmitting(false);
//       }
//     }
//   };

//   // Handle edit
//   const handleEdit = (certification: BusinessCertification) => {
//     const index = certifications.findIndex((cert) => cert.id === certification.id);
//     if (index === -1) return;
    
//     const parentBusinessObj = businesses.find((b) => b.id === certification.businessId);
//     setSelectedBusiness(parentBusinessObj || null);
    
//     setFormData({
//       businessDropdown: certification.businessId?.toString() || "",
//       businessId: certification.businessId?.toString() || "",
//       title: certification.title,
//       description: certification.description,
//       image: null,
//       status: certification.status || "ACTIVE",
//     });
    
//     setImagePreview(certification.image ? getImageUrl(certification.image) : null);
//     setEditIndex(index);
//     setShowModal(true);
//   };

//   // Handle delete
//   const handleDelete = async (certificationId: number) => {
//     const confirmed = window.confirm("Are you sure you want to delete this certification?");
//     if (confirmed) {
//       setIsSubmitting(true);
//       setError(null);
//       try {
//         const token = getAuthToken();
//         if (!token) throw new Error("Authentication token not found");
        
//         const response = await fetch(`http://localhost:7000/api/v1/group/business/certification/${certificationId}`, {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
        
//         if (!response.ok) {
//           const errorResult = await response.json();
//           throw new Error(errorResult.message || `HTTP error: ${response.status}`);
//         }
        
//         const result = await response.json();
//         if (!result.success) throw new Error(result.message || "Failed to delete certification");
        
//         await fetchCertifications();
//       } catch (err) {
//         console.error("Error deleting certification:", err);
//         setError(err instanceof Error ? err.message : "An unknown error occurred");
//       } finally {
//         setIsSubmitting(false);
//       }
//     }
//   };

//   // Handle toggling status directly from the table
//   const handleStatusToggle = async (certification: BusinessCertification) => {
//     setStatusUpdating(certification.id);
//     setError(null);
    
//     const newStatus = certification.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    
//     try {
//       const token = getAuthToken();
//       if (!token) throw new Error("Authentication token not found");

//       const apiFormData = new FormData();
//       apiFormData.append("businessId", certification.businessId?.toString() || "");
//       apiFormData.append("title", certification.title);
//       apiFormData.append("description", certification.description);
//       apiFormData.append("status", newStatus);

//       const response = await fetch(`http://localhost:7000/api/v1/group/business/certification/${certification.id}`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: apiFormData,
//       });

//       if (!response.ok) {
//         const errorResult = await response.json();
//         throw new Error(errorResult.message || `HTTP error: ${response.status}`);
//       }
      
//       const result = await response.json();
//       if (!result.success) throw new Error(result.message || "Status update failed");
      
//       // Update the certifications list locally for immediate UI update
//       setCertifications(prevCertifications => 
//         prevCertifications.map(cert => 
//           cert.id === certification.id ? { ...cert, status: newStatus } : cert
//         )
//       );
//     } catch (err) {
//       console.error("Error updating status:", err);
//       setError(err instanceof Error ? err.message : "An unknown error occurred");
//     } finally {
//       setStatusUpdating(null);
//     }
//   };

//   // Handle add new certification
//   const handleAddCertification = () => {
//     resetForm();
//     setShowModal(true);
//   };

//   // Strip HTML for table display
//   const stripHtml = (html: string) => {
//     const doc = new DOMParser().parseFromString(html, 'text/html');
//     return doc.body.textContent || "";
//   };

//   // Filter certifications by search term
//   const filteredCertifications = certifications.filter(cert => {
//     const lowercaseSearch = searchTerm.toLowerCase();
//     return (
//       cert.title?.toLowerCase().includes(lowercaseSearch) ||
//       stripHtml(cert.description).toLowerCase().includes(lowercaseSearch) ||
//       cert.businessTitle?.toLowerCase().includes(lowercaseSearch) ||
//       cert.status?.toLowerCase().includes(lowercaseSearch)
//     );
//   });

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Business Certifications</h1>
      
//       {error && (
//         <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400">
//           <p className="flex items-center">
//             <AlertCircle size={20} className="mr-2" />
//             {error}
//           </p>
//         </div>
//       )}
      
//       <div className="mb-6 flex justify-between items-center">
//         <button
//           onClick={handleAddCertification}
//           className="px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 flex items-center"
//         >
//           <Plus size={16} className="mr-1" />
//           Add New Certification
//         </button>
        
//         <div className="relative w-64">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             placeholder="Search certifications..."
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white"
//           />
//         </div>
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
//           <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
//               <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
//                 {editIndex !== null ? "Edit Business Certification" : "Add New Business Certification"}
//               </h2>
//               <button
//                 onClick={resetForm}
//                 className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
//               >
//                 <X size={20} />
//               </button>
//             </div>
//             <form onSubmit={handleSubmit} className="p-6">
//               <div className="grid grid-cols-1 gap-6">
//                 {/* Business Dropdown */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Business <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <button
//                       type="button"
//                       className={`w-full bg-white dark:bg-slate-800 border ${
//                         errors.businessId ? "border-red-500" : "border-gray-300 dark:border-slate-700"
//                       } rounded-md py-2 px-4 flex items-center justify-between shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white`}
//                       onClick={() => setShowDropdown(!showDropdown)}
//                       disabled={isLoadingBusinesses}
//                     >
//                       {isLoadingBusinesses ? (
//                         <span className="flex items-center text-gray-400 dark:text-gray-500">
//                           <Loader2 size={16} className="animate-spin mr-2" />
//                           Loading businesses...
//                         </span>
//                       ) : (
//                         <span>
//                           {selectedBusiness
//                             ? `${selectedBusiness.id} - ${selectedBusiness.title}`
//                             : "Select a business"}
//                         </span>
//                       )}
//                       <ChevronDown size={16} className={`transition-transform ${showDropdown ? "rotate-180" : ""}`} />
//                     </button>
//                     {errors.businessId && (
//                       <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
//                         <AlertCircle size={14} className="mr-1" />
//                         {errors.businessId}
//                       </p>
//                     )}
//                     {showDropdown && businesses.length > 0 && (
//                       <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-800 shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
//                         {businesses.map((business) => (
//                           <div
//                             key={business.id}
//                             className={`cursor-pointer hover:bg-indigo-50 dark:hover:bg-slate-700 py-2 px-4 ${
//                               selectedBusiness?.id === business.id
//                                 ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-medium"
//                                 : "dark:text-white"
//                             }`}
//                             onClick={() => handleBusinessSelect(business)}
//                           >
//                             <span className="font-medium">{business.id}</span> - {business.title}
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                     {showDropdown && businesses.length === 0 && !isLoadingBusinesses && (
//                       <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-800 shadow-lg rounded-md py-4 text-center">
//                         <p className="text-gray-500 dark:text-gray-400">No businesses found.</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
                
//                 {/* Business ID Field */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="businessId">
//                     Business ID <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="number"
//                     id="businessId"
//                     name="businessId"
//                     value={formData.businessId}
//                     onChange={handleChange}
//                     className={`w-full px-4 py-2 rounded-md border ${
//                       errors.businessId ? "border-red-500" : "border-gray-300 dark:border-slate-600"
//                     } focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white`}
//                     placeholder="Enter Business ID"
//                   />
//                   {errors.businessId && (
//                     <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
//                       <AlertCircle size={14} className="mr-1" />
//                       {errors.businessId}
//                     </p>
//                   )}
//                 </div>
                
//                 {/* Title Field */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="title">
//                     Title <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     id="title"
//                     name="title"
//                     value={formData.title}
//                     onChange={handleChange}
//                     className={`w-full px-4 py-2 rounded-md border ${
//                       errors.title ? "border-red-500" : "border-gray-300 dark:border-slate-600"
//                     } focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white`}
//                     placeholder="Enter title"
//                   />
//                   {errors.title && (
//                     <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
//                       <AlertCircle size={14} className="mr-1" />
//                       {errors.title}
//                     </p>
//                   )}
//                 </div>
                
//                 {/* Description Field - Using PrimeReact Editor */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="description">
//                     Description <span className="text-red-500">*</span>
//                   </label>
//                   <Editor
//                     id="description"
//                     value={formData.description}
//                     onTextChange={(e) => handleEditorChange(e.htmlValue || '')}
//                     style={{ height: '240px' }}
//                     placeholder="Enter description..."
//                     readOnly={isSubmitting}
//                     headerTemplate={editorHeader}
//                     pt={{
//                       toolbar: { className: 'rounded-t-lg border border-gray-300 dark:border-slate-600' },
//                       content: { 
//                         className: `rounded-b-lg border ${errors.description ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} border-t-0` 
//                       }
//                     }}
//                   />
//                   {errors.description && (
//                     <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
//                       <AlertCircle size={14} className="mr-1" />
//                       {errors.description}
//                     </p>
//                   )}
//                 </div>
                
//                 {/* Image Upload */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Image {editIndex === null && <span className="text-red-500">*</span>}
//                   </label>
//                   <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
//                     errors.image ? "border-red-300 dark:border-red-800" : "border-gray-300 dark:border-slate-700"
//                   } dark:bg-slate-800/50`}>
//                     <div className="space-y-1 text-center">
//                       {imagePreview ? (
//                         <div className="relative">
//                           <img className="mx-auto h-32 object-contain" src={imagePreview} alt="Preview" />
//                           <button
//                             type="button"
//                             onClick={() => {
//                               setFormData((prev) => ({ ...prev, image: null }));
//                               setImagePreview(null);
//                             }}
//                             className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
//                           >
//                             <X size={14} />
//                           </button>
//                         </div>
//                       ) : (
//                         <>
//                           <div className="flex text-sm text-gray-600 dark:text-gray-400">
//                             <label
//                               htmlFor="image-upload"
//                               className="relative cursor-pointer bg-white dark:bg-transparent rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 focus-within:outline-none"
//                             >
//                               <div className="flex flex-col items-center">
//                                 <ImageIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
//                                 <span>Upload a file</span>
//                                 <input
//                                   id="image-upload"
//                                   name="image-upload"
//                                   type="file"
//                                   className="sr-only"
//                                   accept="image/*"
//                                   onChange={handleImageChange}
//                                 />
//                               </div>
//                             </label>
//                           </div>
//                           <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                   {errors.image && (
//                     <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
//                       <AlertCircle size={14} className="mr-1" />
//                       {errors.image}
//                     </p>
//                   )}
//                 </div>
                
//                 {/* Status Field - Hidden in the form as requested, we'll keep it with a default value */}
//                 <input type="hidden" name="status" value={formData.status} />
//               </div>
//               <div className="mt-6 flex justify-end space-x-3">
//                 <button
//                   type="button"
//                   onClick={resetForm}
//                   className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
//                   disabled={isSubmitting}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 flex items-center disabled:opacity-60 disabled:cursor-not-allowed"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <Loader2 size={16} className="animate-spin mr-2" />
//                       Processing...
//                     </>
//                   ) : (
//                     <>
//                       <Save size={16} className="mr-2" />
//                       {editIndex !== null ? "Update" : "Submit"}
//                     </>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Certifications Table */}
//       {isLoading ? (
//         <div className="flex justify-center items-center py-12">
//           <Loader2 size={36} className="animate-spin text-indigo-600 dark:text-indigo-400" />
//           <span className="ml-2 text-gray-600 dark:text-gray-400">Loading certifications...</span>
//         </div>
//       ) : filteredCertifications.length > 0 ? (
//         <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
//           <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
//             <thead className="bg-gray-50 dark:bg-slate-700">
//               <tr>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                 ID
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   Business
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   Title
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   Description
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   Image
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
//               {filteredCertifications.map((certification, index) => (
//                 <tr key={certification.id} className={index % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-gray-50 dark:bg-slate-700/30"}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{certification.id}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
//                       {certification.businessTitle || businesses.find(b => b.id === certification.businessId)?.title || 'N/A'}
//                     </div>
//                     <div className="text-sm text-gray-500 dark:text-gray-400">ID: {certification.businessId}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="font-medium text-gray-900 dark:text-white">{certification.title}</div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
//                       {stripHtml(certification.description)}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex-shrink-0 h-14 w-14">
//                       {certification.image ? (
//                         <img
//                           className="h-14 w-14 rounded-md object-cover"
//                           src={getImageUrl(certification.image)}
//                           alt={certification.title}
//                         />
//                       ) : (
//                         <div className="h-14 w-14 rounded-md bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
//                           <ImageIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
//                         </div>
//                       )}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <button
//                       onClick={() => handleStatusToggle(certification)}
//                       disabled={statusUpdating === certification.id}
//                       className="flex items-center focus:outline-none disabled:opacity-60"
//                       title={`Click to ${certification.status === 'ACTIVE' ? 'deactivate' : 'activate'}`}
//                     >
//                       {statusUpdating === certification.id ? (
//                         <Loader2 size={24} className="animate-spin text-indigo-600 dark:text-indigo-400" />
//                       ) : certification.status === 'ACTIVE' ? (
//                         <div className="flex items-center text-green-600 dark:text-green-400">
//                           <ToggleRight size={24} className="mr-1" />
//                           <span>ACTIVE</span>
//                         </div>
//                       ) : (
//                         <div className="flex items-center text-gray-500 dark:text-gray-400">
//                           <ToggleLeft size={24} className="mr-1" />
//                           <span>INACTIVE</span>
//                         </div>
//                       )}
//                     </button>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={() => handleEdit(certification)}
//                         className="p-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 disabled:opacity-50"
//                         title="Edit"
//                         disabled={isSubmitting || statusUpdating !== null}
//                       >
//                         <Edit size={16} />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(certification.id)}
//                         className="p-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 disabled:opacity-50"
//                         title="Delete"
//                         disabled={isSubmitting || statusUpdating !== null}
//                       >
//                         <Trash size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-8 text-center">
//           <p className="text-gray-500 dark:text-gray-400">
//             {searchTerm 
//               ? "No certifications found matching your search." 
//               : "No business certifications found. Click the \"Add New Certification\" button to add a certification."}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BusinessCertificationPage;






'use client';

import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  X,
  Edit,
  Trash,
  Image as ImageIcon,
  Save,
  AlertCircle,
  Loader2,
  Plus,
  Search,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import Cookies from "js-cookie";
// Import PrimeReact Editor and required CSS
import { Editor } from 'primereact/editor';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

// Types
interface Business {
  id: number;
  title: string;
}

interface BusinessCertification {
  id: number;
  businessId?: number;
  businessTitle?: string;
  title: string;
  description: string;
  image: string[] | null; // Changed to string array
  status?: string;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string | null;
}

// Form data structure
interface FormData {
  businessDropdown: string;
  businessId: string;
  title: string;
  description: string;
  images: File[]; // Changed to File array
  status: string;
}

const BusinessCertificationPage = () => {
  // State
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [certifications, setCertifications] = useState<BusinessCertification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBusinesses, setIsLoadingBusinesses] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // Changed to string array
  const [formData, setFormData] = useState<FormData>({
    businessDropdown: "",
    businessId: "",
    title: "",
    description: "",
    images: [], // Changed to empty array
    status: "ACTIVE"
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [statusUpdating, setStatusUpdating] = useState<number | null>(null);

  // Editor header template for improved styling (same as in previous components)
  const editorHeader = (
    <span className="ql-formats">
      <button className="ql-bold" aria-label="Bold"></button>
      <button className="ql-italic" aria-label="Italic"></button>
      <button className="ql-underline" aria-label="Underline"></button>
      <button className="ql-strike" aria-label="Strike"></button>
      <button className="ql-blockquote" aria-label="Blockquote"></button>
      <button className="ql-list" value="ordered" aria-label="Ordered List"></button>
      <button className="ql-list" value="bullet" aria-label="Bullet List"></button>
      <button className="ql-link" aria-label="Insert Link"></button>
      <select className="ql-size" defaultValue="" aria-label="Size">
        <option value="small">Small</option>
        <option value="">Normal</option>
        <option value="large">Large</option>
        <option value="huge">Huge</option>
      </select>
      <select className="ql-header" defaultValue="0" aria-label="Header">
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
        <option value="0">Normal</option>
      </select>
      <select className="ql-align" defaultValue="" aria-label="Align">
        <option value="">Left</option>
        <option value="center">Center</option>
        <option value="right">Right</option>
        <option value="justify">Justify</option>
      </select>
    </span>
  );

  // Add custom editor styles (similar to previous components)
  useEffect(() => {
    // Add custom styles for the editor
    const style = document.createElement('style');
    style.innerHTML = `
      .p-editor-container .p-editor-content {
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        min-height: 200px;
      }
      .p-editor-container .p-editor-content.p-error {
        border-color: #ef4444;
      }
      .p-editor-container .p-editor-toolbar {
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
        background-color: #f9fafb;
        border: 1px solid #d1d5db;
        border-bottom: none;
      }
      .ql-container {
        font-family: inherit !important;
        font-size: 1rem !important;
      }
      .ql-editor {
        padding: 1rem !important;
        min-height: 200px !important;
      }
      .ql-editor.ql-blank::before {
        font-style: normal !important;
        color: #9ca3af !important;
      }
      /* Dark mode support */
      .dark .p-editor-container .p-editor-content {
        border-color: #475569;
        background-color: #1e293b;
        color: #f8fafc;
      }
      .dark .p-editor-container .p-editor-toolbar {
        background-color: #0f172a;
        border-color: #475569;
      }
      .dark .ql-editor.ql-blank::before {
        color: #64748b !important;
      }
      .dark .ql-snow .ql-stroke {
        stroke: #94a3b8;
      }
      .dark .ql-snow .ql-fill, .dark .ql-snow .ql-stroke.ql-fill {
        fill: #94a3b8;
      }
      .dark .ql-snow .ql-picker {
        color: #94a3b8;
      }
      .dark .ql-snow .ql-picker-options {
        background-color: #1e293b;
        border-color: #475569;
      }
      
      /* Image preview grid */
      .image-preview-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 8px;
      }
      
      .image-preview-item {
        position: relative;
        height: 100px;
        border-radius: 4px;
        overflow: hidden;
      }
      
      .image-preview-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .image-remove-button {
        position: absolute;
        top: 4px;
        right: 4px;
        background-color: rgba(239, 68, 68, 0.9);
        color: white;
        border-radius: 9999px;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Get auth token from cookies
  const getAuthToken = (): string | undefined => {
    return Cookies.get("token");
  };

  // Construct full image URL
  const getImageUrl = (relativePath: string | null): string | null => {
    if (!relativePath) return null;
    return `http://localhost:7000/${relativePath.replace(/^public\//, "")}`;
  };

  // Fetch businesses for dropdown
  useEffect(() => {
    const fetchBusinesses = async () => {
      setIsLoadingBusinesses(true);
      setError(null);
      try {
        const token = getAuthToken();
        if (!token) throw new Error("Authentication token not found");
        
        const response = await fetch("http://localhost:7000/api/v1/group/business", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error(`Failed to fetch businesses: ${response.status}`);
        
        const result = await response.json();
        if (result.success && result.data) {
          const businessList = result.data.map((item: any) => ({
            id: item.id,
            title: item.title,
          }));
          setBusinesses(businessList);
        } else {
          throw new Error(result.message || "Failed to fetch businesses");
        }
      } catch (err) {
        console.error("Error fetching businesses:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoadingBusinesses(false);
      }
    };

    fetchBusinesses();
  }, []);

  // Fetch business certifications
  const fetchCertifications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Authentication token not found");
      
      const response = await fetch("http://localhost:7000/api/v1/group/business/certification", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`Failed to fetch certifications: ${response.status}`);
      
      const result = await response.json();
      if (result.success && result.data) {
        setCertifications(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch certifications");
      }
    } catch (err) {
      console.error("Error fetching certifications:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCertifications();
  }, []);

  // Handle selecting a business from dropdown
  const handleBusinessSelect = (business: Business) => {
    setSelectedBusiness(business);
    setFormData((prev) => ({
      ...prev,
      businessDropdown: business.id.toString(),
      businessId: business.id.toString(),
    }));
    setShowDropdown(false);
    if (errors.businessId) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.businessId;
        return newErrors;
      });
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle description change from PrimeReact Editor
  const handleEditorChange = (htmlValue: string) => {
    setFormData((prev) => ({
      ...prev,
      description: htmlValue || "",
    }));
    if (errors.description) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.description;
        return newErrors;
      });
    }
  };

  // Handle multiple image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // Add new files to the existing images
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newFiles],
      }));
      
      // Generate previews for the new files
      const newPreviews: string[] = [];
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            newPreviews.push(reader.result);
            if (newPreviews.length === newFiles.length) {
              setImagePreviews(prev => [...prev, ...newPreviews]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
      
      if (errors.images) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.images;
          return newErrors;
        });
      }
    }
  };

  // Remove image from preview and form data
  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
    setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // Reset form and close modal
  const resetForm = () => {
    setFormData({
      businessDropdown: "",
      businessId: "",
      title: "",
      description: "",
      images: [],
      status: "ACTIVE",
    });
    setSelectedBusiness(null);
    setEditIndex(null);
    setShowModal(false);
    setImagePreviews([]);
    setErrors({});
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.businessId) newErrors.businessId = "Business ID is required";
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (formData.images.length === 0 && editIndex === null) newErrors.images = "At least one image is required";
    if (!formData.status) newErrors.status = "Status is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      setError(null);
      try {
        const token = getAuthToken();
        if (!token) throw new Error("Authentication token not found");

        const apiFormData = new FormData();
        apiFormData.append("businessId", formData.businessId);
        apiFormData.append("title", formData.title);
        apiFormData.append("description", formData.description);
        apiFormData.append("status", formData.status);
        
        // Append multiple images with the same field name
        formData.images.forEach((image) => {
          apiFormData.append("image", image);
        });

        let response;
        if (editIndex !== null) {
          const certId = certifications[editIndex].id;
          response = await fetch(`http://localhost:7000/api/v1/group/business/certification/${certId}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: apiFormData,
          });
        } else {
          response = await fetch("http://localhost:7000/api/v1/group/business/certification", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: apiFormData,
          });
        }

        if (!response.ok) {
          const errorResult = await response.json();
          throw new Error(errorResult.message || `HTTP error: ${response.status}`);
        }
        
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Operation failed");
        
        await fetchCertifications();
        resetForm();
      } catch (err) {
        console.error("Error submitting form:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Handle edit
  const handleEdit = (certification: BusinessCertification) => {
    const index = certifications.findIndex((cert) => cert.id === certification.id);
    if (index === -1) return;
    
    const parentBusinessObj = businesses.find((b) => b.id === certification.businessId);
    setSelectedBusiness(parentBusinessObj || null);
    
    setFormData({
      businessDropdown: certification.businessId?.toString() || "",
      businessId: certification.businessId?.toString() || "",
      title: certification.title,
      description: certification.description,
      images: [], // We can't edit the actual File objects
      status: certification.status || "ACTIVE",
    });
    
    // Set image previews from the certification's images
    if (certification.image && Array.isArray(certification.image)) {
      const imageUrls = certification.image.map(img => getImageUrl(img) || '');
      setImagePreviews(imageUrls.filter(url => url !== ''));
    } else if (certification.image && typeof certification.image === 'string') {
      // Handle case where image might be a string instead of array
      const imageUrl = getImageUrl(certification.image as unknown as string);
      if (imageUrl) {
        setImagePreviews([imageUrl]);
      } else {
        setImagePreviews([]);
      }
    } else {
      setImagePreviews([]);
    }
    
    setEditIndex(index);
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = async (certificationId: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this certification?");
    if (confirmed) {
      setIsSubmitting(true);
      setError(null);
      try {
        const token = getAuthToken();
        if (!token) throw new Error("Authentication token not found");
        
        const response = await fetch(`http://localhost:7000/api/v1/group/business/certification/${certificationId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        
        if (!response.ok) {
          const errorResult = await response.json();
          throw new Error(errorResult.message || `HTTP error: ${response.status}`);
        }
        
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to delete certification");
        
        await fetchCertifications();
      } catch (err) {
        console.error("Error deleting certification:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Handle toggling status directly from the table
  const handleStatusToggle = async (certification: BusinessCertification) => {
    setStatusUpdating(certification.id);
    setError(null);
    
    const newStatus = certification.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Authentication token not found");

      const apiFormData = new FormData();
      apiFormData.append("businessId", certification.businessId?.toString() || "");
      apiFormData.append("title", certification.title);
      apiFormData.append("description", certification.description);
      apiFormData.append("status", newStatus);

      const response = await fetch(`http://localhost:7000/api/v1/group/business/certification/${certification.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: apiFormData,
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || `HTTP error: ${response.status}`);
      }
      
      const result = await response.json();
      if (!result.success) throw new Error(result.message || "Status update failed");
      
      // Update the certifications list locally for immediate UI update
      setCertifications(prevCertifications => 
        prevCertifications.map(cert => 
          cert.id === certification.id ? { ...cert, status: newStatus } : cert
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setStatusUpdating(null);
    }
  };

  // Handle add new certification
  const handleAddCertification = () => {
    resetForm();
    setShowModal(true);
  };

  // Strip HTML for table display
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  // Filter certifications by search term
  const filteredCertifications = certifications.filter(cert => {
    const lowercaseSearch = searchTerm.toLowerCase();
    return (
      cert.title?.toLowerCase().includes(lowercaseSearch) ||
      stripHtml(cert.description).toLowerCase().includes(lowercaseSearch) ||
      cert.businessTitle?.toLowerCase().includes(lowercaseSearch) ||
      cert.status?.toLowerCase().includes(lowercaseSearch)
    );
  });

  // Get the first image from an array for display in the table
  const getFirstImage = (images: string[] | null | string): string | null => {
    if (!images) return null;
    if (Array.isArray(images) && images.length > 0) {
      return getImageUrl(images[0]);
    }
    if (typeof images === 'string') {
      return getImageUrl(images);
    }
    return null;
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Business Certifications</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400">
          <p className="flex items-center">
            <AlertCircle size={20} className="mr-2" />
            {error}
          </p>
        </div>
      )}
      
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={handleAddCertification}
          className="px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 flex items-center"
        >
          <Plus size={16} className="mr-1" />
          Add New Certification
        </button>
        
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search certifications..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                {editIndex !== null ? "Edit Business Certification" : "Add New Business Certification"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Business Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Business <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      className={`w-full bg-white dark:bg-slate-800 border ${
                        errors.businessId ? "border-red-500" : "border-gray-300 dark:border-slate-700"
                      } rounded-md py-2 px-4 flex items-center justify-between shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white`}
                      onClick={() => setShowDropdown(!showDropdown)}
                      disabled={isLoadingBusinesses}
                    >
                      {isLoadingBusinesses ? (
                        <span className="flex items-center text-gray-400 dark:text-gray-500">
                          <Loader2 size={16} className="animate-spin mr-2" />
                          Loading businesses...
                        </span>
                      ) : (
                        <span>
                          {selectedBusiness
                            ? `${selectedBusiness.id} - ${selectedBusiness.title}`
                            : "Select a business"}
                        </span>
                      )}
                      <ChevronDown size={16} className={`transition-transform ${showDropdown ? "rotate-180" : ""}`} />
                    </button>
                    {errors.businessId && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.businessId}
                      </p>
                    )}
                    {showDropdown && businesses.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-800 shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                        {businesses.map((business) => (
                          <div
                            key={business.id}
                            className={`cursor-pointer hover:bg-indigo-50 dark:hover:bg-slate-700 py-2 px-4 ${
                              selectedBusiness?.id === business.id
                                ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-medium"
                                : "dark:text-white"
                            }`}
                            onClick={() => handleBusinessSelect(business)}
                          >
                            <span className="font-medium">{business.id}</span> - {business.title}
                          </div>
                        ))}
                      </div>
                    )}
                    {showDropdown && businesses.length === 0 && !isLoadingBusinesses && (
                      <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-800 shadow-lg rounded-md py-4 text-center">
                        <p className="text-gray-500 dark:text-gray-400">No businesses found.</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Business ID Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="businessId">
                    Business ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="businessId"
                    name="businessId"
                    value={formData.businessId}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-md border ${
                      errors.businessId ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white`}
                    placeholder="Enter Business ID"
                  />
                  {errors.businessId && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.businessId}
                    </p>
                  )}
                </div>
                
                {/* Title Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="title">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-md border ${
                      errors.title ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white`}
                    placeholder="Enter title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.title}
                    </p>
                  )}
                </div>
                
                {/* Description Field - Using PrimeReact Editor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <Editor
                    id="description"
                    value={formData.description}
                    onTextChange={(e) => handleEditorChange(e.htmlValue || '')}
                    style={{ height: '240px' }}
                    placeholder="Enter description..."
                    readOnly={isSubmitting}
                    headerTemplate={editorHeader}
                    pt={{
                      toolbar: { className: 'rounded-t-lg border border-gray-300 dark:border-slate-600' },
                      content: { 
                        className: `rounded-b-lg border ${errors.description ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} border-t-0` 
                      }
                    }}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.description}
                    </p>
                  )}
                </div>
                
                {/* Multiple Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Images {editIndex === null && <span className="text-red-500">*</span>}
                  </label>
                  <div className={`mt-1 flex flex-col px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                    errors.images ? "border-red-300 dark:border-red-800" : "border-gray-300 dark:border-slate-700"
                  } dark:bg-slate-800/50`}>
                    
                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="image-preview-grid mb-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="image-preview-item">
                            <img src={preview} alt={`Preview ${index + 1}`} />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="image-remove-button"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Upload Button */}
                    <div className="space-y-1 text-center">
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label
                          htmlFor="image-upload"
                          className="relative cursor-pointer bg-white dark:bg-transparent rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 focus-within:outline-none"
                        >
                          <div className="flex flex-col items-center">
                            <ImageIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                            <span>Upload images</span>
                            <input
                              id="image-upload"
                              name="image-upload"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleImageChange}
                              multiple
                            />
                          </div>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                  {errors.images && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.images}
                    </p>
                  )}
                </div>
                
                {/* Status Field - Hidden in the form as requested, we'll keep it with a default value */}
                <input type="hidden" name="status" value={formData.status} />
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 flex items-center disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      {editIndex !== null ? "Update" : "Submit"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certifications Table */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 size={36} className="animate-spin text-indigo-600 dark:text-indigo-400" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading certifications...</span>
        </div>
      ) : filteredCertifications.length > 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Business
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Image
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {filteredCertifications.map((certification, index) => (
                <tr key={certification.id} className={index % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-gray-50 dark:bg-slate-700/30"}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{certification.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                      {certification.businessTitle || businesses.find(b => b.id === certification.businessId)?.title || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">ID: {certification.businessId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-white">{certification.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {stripHtml(certification.description)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex-shrink-0 h-14 w-14">
                      {/* Display only the first image in the table */}
                      {certification.image && (Array.isArray(certification.image) ? certification.image.length > 0 : true) ? (
                        <img
                          className="h-14 w-14 rounded-md object-cover"
                          // src={getFirstImage(certification.image)}
                          src={`http://localhost:7000/${certification.image}`}
                          alt={certification.title}
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-md bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleStatusToggle(certification)}
                      disabled={statusUpdating === certification.id}
                      className="flex items-center focus:outline-none disabled:opacity-60"
                      title={`Click to ${certification.status === 'ACTIVE' ? 'deactivate' : 'activate'}`}
                    >
                      {statusUpdating === certification.id ? (
                        <Loader2 size={24} className="animate-spin text-indigo-600 dark:text-indigo-400" />
                      ) : certification.status === 'ACTIVE' ? (
                        <div className="flex items-center text-green-600 dark:text-green-400">
                          <ToggleRight size={24} className="mr-1" />
                          <span>ACTIVE</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <ToggleLeft size={24} className="mr-1" />
                          <span>INACTIVE</span>
                        </div>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(certification)}
                        className="p-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 disabled:opacity-50"
                        title="Edit"
                        disabled={isSubmitting || statusUpdating !== null}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(certification.id)}
                        className="p-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 disabled:opacity-50"
                        title="Delete"
                        disabled={isSubmitting || statusUpdating !== null}
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm 
              ? "No certifications found matching your search." 
              : "No business certifications found. Click the \"Add New Certification\" button to add a certification."}
          </p>
        </div>
      )}
    </div>
  );
};

export default BusinessCertificationPage;