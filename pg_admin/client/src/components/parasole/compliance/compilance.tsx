// // "use client";

// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import Cookies from 'js-cookie';
// // import { 
// //   Plus,
// //   Edit,
// //   Trash2,
// //   Upload as UploadIcon,
// //   MoreVertical,
// //   CheckCircle,
// //   XCircle,
// //   ImageIcon,
// //   AlertTriangle,
// //   ChevronUp,
// //   ChevronDown,
// //   Eye,
// //   EyeOff
// // } from 'lucide-react';

// // interface ComplianceData {
// //   id: number;
// //   title: string;
// //   slug: string;
// //   description: string;
// //   images: string[];
// //   index: number;
// //   createdBy: string;
// //   createdAt: string;
// //   updatedBy: string;
// //   updatedAt: string;
// //   status: 'ACTIVE' | 'INACTIVE';
// // }

// // const formatImageUrl = (imagePath: string): string => {
// //   if (!imagePath) return '';
// //   // If the image already has a full URL, return it as is
// //   if (imagePath.startsWith('http')) return imagePath;
// //   // Otherwise, prepend the base URL
// //   return `http://localhost:7000/${imagePath}`;
// // };

// // const getFirstImage = (images: string[] | undefined): string => {
// //   if (!images || !Array.isArray(images) || images.length === 0) return '';
// //   return images[0];
// // };

// // const CompliancePage: React.FC = () => {
// //   const [complianceData, setComplianceData] = useState<ComplianceData[]>([]);
// //   const [loading, setLoading] = useState<boolean>(false);
// //   const [modalVisible, setModalVisible] = useState<boolean>(false);
// //   const [isEditing, setIsEditing] = useState<boolean>(false);
// //   const [imageFile, setImageFile] = useState<File | null>(null);
// //   const [imagePreview, setImagePreview] = useState<string>('');
// //   const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
// //   const [sortBy, setSortBy] = useState<string>("index");
// //   const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
// //   const [expandedDescription, setExpandedDescription] = useState<number | null>(null);
// //   const [highlightedRow, setHighlightedRow] = useState<number | null>(null);
// //   const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
// //   const [formData, setFormData] = useState({
// //     id: 0,
// //     title: '',
// //     description: '',
// //     index: 0,
// //     status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
// //   });
// //   const [successMessage, setSuccessMessage] = useState<string | null>(null);
// //   const [errorMessage, setErrorMessage] = useState<string | null>(null);

// //   // Get token from js-cookie
// //   const token = Cookies.get('token');

// //   const fetchComplianceData = async () => {
// //     setLoading(true);
// //     try {
// //       const response = await axios.get('http://localhost:7000/api/v1/parasole/compliance', {
// //         headers: {
// //           Authorization: `Bearer ${token}`
// //         }
// //       });
// //       if (response.data.success) {
// //         setComplianceData(response.data.data || []);
// //       } else {
// //         showError('Failed to fetch compliance data');
// //       }
// //     } catch (error) {
// //       console.error('Error fetching compliance data:', error);
// //       showError('Error fetching compliance data');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchComplianceData();
// //   }, []);

// //   const showSuccess = (message: string) => {
// //     setSuccessMessage(message);
// //     setTimeout(() => setSuccessMessage(null), 3000);
// //   };

// //   const showError = (message: string) => {
// //     setErrorMessage(message);
// //     setTimeout(() => setErrorMessage(null), 3000);
// //   };

// //   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({
// //       ...prev,
// //       [name]: name === 'index' ? parseInt(value) || 0 : value
// //     }));
    
// //     // Clear validation error when user types
// //     if (formErrors[name]) {
// //       setFormErrors(prev => ({ ...prev, [name]: '' }));
// //     }
// //   };

// //   const handleAddComplianceClick = () => {
// //     setFormData({
// //       id: 0,
// //       title: '',
// //       description: '',
// //       index: 0,
// //       status: 'ACTIVE'
// //     });
// //     setImageFile(null);
// //     setImagePreview('');
// //     setIsEditing(false);
// //     setFormErrors({});
// //     setModalVisible(true);
// //   };

// //   const handleEditComplianceClick = (record: ComplianceData) => {
// //     setIsEditing(true);
// //     setFormData({
// //       id: record.id,
// //       title: record.title,
// //       description: record.description,
// //       index: record.index,
// //       status: record.status
// //     });
    
// //     if (record.images && record.images.length > 0) {
// //       setImagePreview(formatImageUrl(record.images[0]));
// //     } else {
// //       setImagePreview('');
// //     }
    
// //     setFormErrors({});
// //     setModalVisible(true);
// //   };

// //   const handleConfirmDelete = (id: number) => {
// //     setShowDeleteConfirm(id);
// //   };

// //   const handleDelete = async (id: number) => {
// //     try {
// //       await axios.delete(`http://localhost:7000/api/v1/parasole/compliance/${id}`, {
// //         headers: {
// //           Authorization: `Bearer ${token}`
// //         }
// //       });
// //       showSuccess('Compliance deleted successfully');
// //       fetchComplianceData();
// //       setShowDeleteConfirm(null);
// //     } catch (error) {
// //       console.error('Error deleting compliance:', error);
// //       showError('Failed to delete compliance');
// //     }
// //   };

// //   const handleToggleStatus = async (id: number) => {
// //     const item = complianceData.find(item => item.id === id);
// //     if (!item) return;
    
// //     const newStatus = item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    
// //     try {
// //       await axios.put(`http://localhost:7000/api/v1/parasole/compliance/${id}`, {
// //         status: newStatus
// //       }, {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //           'Content-Type': 'application/json'
// //         }
// //       });
// //       showSuccess(`Status updated to ${newStatus}`);
// //       fetchComplianceData();
// //     } catch (error) {
// //       console.error('Error updating status:', error);
// //       showError('Failed to update status');
// //     }
// //   };

// //   const handleCloseModal = () => {
// //     setModalVisible(false);
// //   };

// //   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const file = e.target.files?.[0];
// //     if (file) {
// //       // Check file type
// //       if (!file.type.startsWith('image/')) {
// //         showError('You can only upload image files!');
// //         return;
// //       }
      
// //       // Check file size (limit to 5MB)
// //       if (file.size / 1024 / 1024 > 5) {
// //         showError('Image must be smaller than 5MB!');
// //         return;
// //       }
      
// //       setImageFile(file);
      
// //       // Create preview
// //       const reader = new FileReader();
// //       reader.onloadend = () => {
// //         setImagePreview(reader.result as string);
// //       };
// //       reader.readAsDataURL(file);
// //     }
// //   };

// //   const validateForm = () => {
// //     const errors: {[key: string]: string} = {};
    
// //     if (!formData.title.trim()) {
// //       errors.title = 'Title is required';
// //     }
    
// //     if (!formData.description.trim()) {
// //       errors.description = 'Description is required';
// //     }
    
// //     if (formData.index < 0) {
// //       errors.index = 'Index must be a positive number';
// //     }
    
// //     setFormErrors(errors);
    
// //     return Object.keys(errors).length === 0;
// //   };

// //   const handleFormSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
    
// //     if (!validateForm()) {
// //       return;
// //     }
    
// //     try {
// //       setLoading(true);
      
// //       // Basic validation
// //       if (!formData.title.trim() || !formData.description.trim()) {
// //         showError('Title and description are required');
// //         setLoading(false);
// //         return;
// //       }
      
// //       if (isEditing) {
// //         // UPDATE OPERATION
// //         try {
// //           if (!imageFile) {
// //             // Update without changing the image - use JSON
// //             console.log('Updating without new image');
            
// //             const updateData = {
// //               title: formData.title,
// //               description: formData.description,
// //               index: Number(formData.index),
// //               status: formData.status
// //             };
            
// //             const response = await axios.put(
// //               `http://localhost:7000/api/v1/parasole/compliance/${formData.id}`, 
// //               updateData, 
// //               { 
// //                 headers: {
// //                   'Authorization': `Bearer ${token}`,
// //                   'Content-Type': 'application/json'
// //                 } 
// //               }
// //             );
            
// //             console.log('Update response:', response);
// //             showSuccess('Compliance updated successfully');
// //             setModalVisible(false);
// //             fetchComplianceData();
// //           } else {
// //             // Update with new image - use FormData
// //             console.log('Updating with new image');
            
// //             const formDataObj = new FormData();
// //             formDataObj.append('title', formData.title);
// //             formDataObj.append('description', formData.description);
// //             formDataObj.append('index', String(formData.index));
// //             formDataObj.append('status', formData.status);
// //             formDataObj.append('image', imageFile);
            
// //             const response = await axios.put(
// //               `http://localhost:7000/api/v1/parasole/compliance/${formData.id}`, 
// //               formDataObj, 
// //               { 
// //                 headers: {
// //                   'Authorization': `Bearer ${token}`
// //                 } 
// //               }
// //             );
            
// //             console.log('Update with image response:', response);
// //             showSuccess('Compliance updated successfully');
// //             setModalVisible(false);
// //             fetchComplianceData();
// //           }
// //         } catch (error: any) {
// //           console.error('Error updating compliance:', error);
// //           showError(error.response?.data?.message || 'Failed to update compliance data');
// //         }
// //       } else {
// //         // CREATE OPERATION
// //         try {
// //           // For creating new items, we'll only use the FormData approach
// //           // And we'll require an image to be uploaded
// //           if (!imageFile) {
// //             showError('Please upload an image');
// //             setLoading(false);
// //             return;
// //           }
          
// //           console.log('Creating new compliance with FormData and image');
          
// //           const formDataObj = new FormData();
// //           formDataObj.append('title', formData.title);
// //           formDataObj.append('description', formData.description);
// //           formDataObj.append('index', String(formData.index));
// //           formDataObj.append('status', formData.status);
// //           formDataObj.append('image', imageFile);
          
// //           // Log what we're sending
// //           console.log('FormData fields:');
// //           for (let [key, value] of formDataObj.entries()) {
// //             if (typeof value === 'object' && value instanceof File) {
// //               console.log(`${key}: File (${value.name}, ${value.type}, ${value.size} bytes)`);
// //             } else {
// //               console.log(`${key}: ${value}`);
// //             }
// //           }
          
// //           const response = await axios({
// //             method: 'post',
// //             url: 'http://localhost:7000/api/v1/parasole/compliance',
// //             data: formDataObj,
// //             headers: {
// //               'Authorization': `Bearer ${token}`,
// //               'Content-Type': 'multipart/form-data'
// //             }
// //           });
          
// //           console.log('Create response:', response);
          
// //           if (response.data.success) {
// //             showSuccess('Compliance created successfully');
// //             setModalVisible(false);
// //             fetchComplianceData();
// //           } else {
// //             showError(response.data.message || 'Creation failed');
// //           }
// //         } catch (error: any) {
// //           console.error('Error creating compliance:', error);
// //           console.error('Error response:', error.response?.data);
          
// //           const errorMessage = error.response?.data?.message || 
// //                               'Failed to create compliance item. Please try again.';
          
// //           showError(errorMessage);
// //         }
// //       }
// //     } catch (error: any) {
// //       console.error('Unexpected error:', error);
// //       showError('An unexpected error occurred');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleSort = (column: string) => {
// //     if (sortBy === column) {
// //       setSortDirection(sortDirection === "asc" ? "desc" : "asc");
// //     } else {
// //       setSortBy(column);
// //       setSortDirection("asc");
// //     }
// //   };

// //   const toggleDescription = (id: number) => {
// //     setExpandedDescription(expandedDescription === id ? null : id);
// //   };

// //   const getSortedItems = () => {
// //     if (complianceData.length === 0) return [];
    
// //     return [...complianceData].sort((a, b) => {
// //       let aValue: any = a[sortBy as keyof ComplianceData];
// //       let bValue: any = b[sortBy as keyof ComplianceData];
      
// //       // Handle string comparisons
// //       if (typeof aValue === "string" && typeof bValue === "string") {
// //         aValue = aValue.toLowerCase();
// //         bValue = bValue.toLowerCase();
// //       }
      
// //       if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
// //       if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
// //       return 0;
// //     });
// //   };

// //   const getAnimationDelay = (index: number) => {
// //     return `${index * 50}ms`;
// //   };

// //   const getImageForDisplay = (item: ComplianceData): string => {
// //     if (item.images && Array.isArray(item.images) && item.images.length > 0) {
// //       return formatImageUrl(item.images[0]);
// //     }
// //     return "";
// //   };

// //   const sortedItems = getSortedItems();

// //   return (
// //     <div className="compliance-page">
// //       {/* Success message */}
// //       {successMessage && (
// //         <div className="fixed top-4 right-4 z-50 bg-green-100 text-green-800 px-4 py-3 rounded-lg shadow-md border border-green-200 animate-fade-in flex items-center" role="alert">
// //           <CheckCircle className="h-5 w-5 mr-2" />
// //           <span>{successMessage}</span>
// //         </div>
// //       )}
      
// //       {/* Error message */}
// //       {errorMessage && (
// //         <div className="fixed top-4 right-4 z-50 bg-red-100 text-red-800 px-4 py-3 rounded-lg shadow-md border border-red-200 animate-fade-in flex items-center" role="alert">
// //           <AlertTriangle className="h-5 w-5 mr-2" />
// //           <span>{errorMessage}</span>
// //         </div>
// //       )}
      
// //       <div className="mb-6 flex justify-between items-center">
// //         <h1 className="text-2xl font-bold text-gray-800">Compliance Management</h1>
// //         <button 
// //           onClick={handleAddComplianceClick}
// //           disabled={loading}
// //           className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
// //         >
// //           <Plus className="mr-2 h-4 w-4" />
// //           Add Compliance
// //         </button>
// //       </div>
      
// //       <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-2xl">
// //         <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex justify-between items-center">
// //           <h2 className="text-lg font-semibold text-gray-800 flex items-center">
// //             <span className="bg-blue-100 p-2 rounded-md mr-2 inline-block">
// //               <ImageIcon className="h-5 w-5 text-blue-600" />
// //             </span>
// //             Compliance Items
// //           </h2>
// //           <div className="text-sm text-gray-500">
// //             {complianceData.length} item{complianceData.length !== 1 ? 's' : ''}
// //           </div>
// //         </div>
        
// //         <div className="overflow-x-auto">
// //           <table className="min-w-full divide-y divide-gray-200">
// //             <thead className="bg-gray-50">
// //               <tr>
// //                 <th 
// //                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
// //                   onClick={() => handleSort("id")}
// //                 >
// //                   <div className="flex items-center">
// //                     ID
// //                     {sortBy === "id" && (
// //                       <span className="ml-1 inline-block transition-transform duration-200">
// //                         {sortDirection === "asc" ? 
// //                           <ChevronUp className="h-4 w-4" /> : 
// //                           <ChevronDown className="h-4 w-4" />
// //                         }
// //                       </span>
// //                     )}
// //                   </div>
// //                 </th>
// //                 <th 
// //                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
// //                   onClick={() => handleSort("title")}
// //                 >
// //                   <div className="flex items-center">
// //                     Title
// //                     {sortBy === "title" && (
// //                       <span className="ml-1 inline-block transition-transform duration-200">
// //                         {sortDirection === "asc" ? 
// //                           <ChevronUp className="h-4 w-4" /> : 
// //                           <ChevronDown className="h-4 w-4" />
// //                         }
// //                       </span>
// //                     )}
// //                   </div>
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Description
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Image
// //                 </th>
// //                 <th 
// //                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
// //                   onClick={() => handleSort("status")}
// //                 >
// //                   <div className="flex items-center">
// //                     Status
// //                     {sortBy === "status" && (
// //                       <span className="ml-1 inline-block transition-transform duration-200">
// //                         {sortDirection === "asc" ? 
// //                           <ChevronUp className="h-4 w-4" /> : 
// //                           <ChevronDown className="h-4 w-4" />
// //                         }
// //                       </span>
// //                     )}
// //                   </div>
// //                 </th>
// //                 <th 
// //                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
// //                   onClick={() => handleSort("index")}
// //                 >
// //                   <div className="flex items-center">
// //                     Index
// //                     {sortBy === "index" && (
// //                       <span className="ml-1 inline-block transition-transform duration-200">
// //                         {sortDirection === "asc" ? 
// //                           <ChevronUp className="h-4 w-4" /> : 
// //                           <ChevronDown className="h-4 w-4" />
// //                         }
// //                       </span>
// //                     )}
// //                   </div>
// //                 </th>
// //                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Actions
// //                 </th>
// //               </tr>
// //             </thead>
// //             <tbody className="bg-white divide-y divide-gray-200">
// //               {complianceData.length === 0 ? (
// //                 <tr>
// //                   <td colSpan={7} className="px-6 py-16 text-center text-gray-500">
// //                     <div className="flex flex-col items-center justify-center space-y-3 opacity-0 animate-fade-in">
// //                       {loading ? (
// //                         <>
// //                           <div className="animate-spin h-10 w-10 rounded-full border-t-2 border-b-2 border-blue-500"></div>
// //                           <p className="text-sm font-medium">Loading compliance items...</p>
// //                         </>
// //                       ) : (
// //                         <>
// //                           <div className="relative">
// //                             <ImageIcon className="h-16 w-16 text-gray-300" />
// //                             <AlertTriangle className="h-6 w-6 text-amber-500 absolute -top-1 -right-1" />
// //                           </div>
// //                           <p className="text-sm font-medium">No compliance items found</p>
// //                           <p className="text-xs text-gray-400">Add your first item to get started</p>
// //                         </>
// //                       )}
// //                     </div>
// //                   </td>
// //                 </tr>
// //               ) : (
// //                 sortedItems.map((item, index) => (
// //                   <React.Fragment key={`item-${item.id}`}>
// //                     <tr 
// //                       className={`
// //                         transition-all duration-300 ease-in-out 
// //                         ${highlightedRow === item.id ? 'bg-blue-50' : 'hover:bg-gray-50'}
// //                         animate-fade-in opacity-0
// //                       `} 
// //                       style={{ animationDelay: getAnimationDelay(index), animationFillMode: 'forwards' }}
// //                       onMouseEnter={() => setHighlightedRow(item.id)}
// //                       onMouseLeave={() => setHighlightedRow(null)}
// //                     >
// //                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
// //                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{item.title}</td>
// //                       <td className="px-6 py-4 text-sm text-gray-700 max-w-[300px]">
// //                         <div className="flex items-center space-x-1">
// //                           <p 
// //                             className={`${expandedDescription === item.id ? '' : 'truncate'} mr-1`} 
// //                             title={expandedDescription === item.id ? '' : item.description}
// //                           >
// //                             {item.description}
// //                           </p>
// //                           <button
// //                             onClick={() => toggleDescription(item.id)}
// //                             className="text-gray-400 hover:text-gray-700 transition-colors duration-200 focus:outline-none p-1 rounded-full hover:bg-gray-100"
// //                           >
// //                             {expandedDescription === item.id ? 
// //                               <EyeOff className="h-4 w-4" /> : 
// //                               <Eye className="h-4 w-4" />
// //                             }
// //                           </button>
// //                         </div>
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm relative group transform transition-transform duration-300 hover:scale-110 hover:shadow-md">
// //                           {getImageForDisplay(item) ? (
// //                             <>
// //                               <img
// //                                 src={getImageForDisplay(item)}
// //                                 alt={item.title}
// //                                 className="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-90"
// //                                 onError={(e) => {
// //                                   e.currentTarget.onerror = null;
// //                                   e.currentTarget.style.display = 'none';
// //                                   const fallback = e.currentTarget.parentElement?.querySelector('.fallback');
// //                                   if (fallback) fallback.classList.remove('hidden');
// //                                 }}
// //                               />
// //                               <div className="fallback hidden flex items-center justify-center h-full w-full text-gray-400">
// //                                 <ImageIcon className="h-6 w-6" />
// //                               </div>
// //                             </>
// //                           ) : (
// //                             <div className="flex items-center justify-center h-full w-full text-gray-400">
// //                               <ImageIcon className="h-6 w-6" />
// //                             </div>
// //                           )}
// //                         </div>
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         <button
// //                           onClick={() => handleToggleStatus(item.id)}
// //                           disabled={loading}
// //                           className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
// //                             item.status === "ACTIVE"
// //                               ? "bg-green-100 text-green-800 hover:bg-green-200 hover:shadow-sm transform hover:-translate-y-0.5"
// //                               : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-sm transform hover:-translate-y-0.5"
// //                           }`}
// //                         >
// //                           {item.status === "ACTIVE" ? (
// //                             <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
// //                           ) : (
// //                             <XCircle className="mr-1.5 h-3.5 w-3.5" />
// //                           )}
// //                           {item.status === "ACTIVE" ? "Active" : "Inactive"}
// //                         </button>
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
// //                         {item.index}
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
// //                         {showDeleteConfirm === item.id ? (
// //                           <div className="flex items-center justify-end space-x-2 animate-fade-in">
// //                             <span className="text-xs text-gray-500">Confirm?</span>
// //                             <button
// //                               onClick={() => handleDelete(item.id)}
// //                               disabled={loading}
// //                               className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-1.5 rounded-full transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
// //                             >
// //                               <CheckCircle className="h-4 w-4" />
// //                             </button>
// //                             <button
// //                               onClick={() => setShowDeleteConfirm(null)}
// //                               disabled={loading}
// //                               className="text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 p-1.5 rounded-full transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
// //                             >
// //                               <XCircle className="h-4 w-4" />
// //                             </button>
// //                           </div>
// //                         ) : (
// //                           <div className="flex items-center justify-end space-x-2">
// //                             <button
// //                               onClick={() => handleEditComplianceClick(item)}
// //                               disabled={loading}
// //                               className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 p-1.5 rounded-full transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
// //                               title="Edit"
// //                             >
// //                               <Edit className="h-4 w-4" />
// //                             </button>
// //                             <button
// //                               onClick={() => handleConfirmDelete(item.id)}
// //                               disabled={loading}
// //                               className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-1.5 rounded-full transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
// //                               title="Delete"
// //                             >
// //                               <Trash2 className="h-4 w-4" />
// //                             </button>
// //                           </div>
// //                         )}
// //                       </td>
// //                     </tr>
// //                     {expandedDescription === item.id && (
// //                       <tr key={`description-${item.id}`} className="bg-gray-50 animate-slide-down">
// //                         <td colSpan={7} className="px-6 py-3 text-sm text-gray-700">
// //                           <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
// //                             <p className="text-xs text-gray-500 mb-1">Full Description:</p>
// //                             <p>{item.description}</p>
// //                           </div>
// //                         </td>
// //                       </tr>
// //                     )}
// //                   </React.Fragment>
// //                 ))
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
        
// //         {complianceData.length > 0 && (
// //           <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-200 flex justify-between items-center">
// //             <span className="text-xs text-gray-500">
// //               Sorted by <span className="font-medium">{sortBy}</span> ({sortDirection === "asc" ? "ascending" : "descending"})
// //             </span>
// //             <span className="text-xs text-gray-500">
// //               {complianceData.length} item{complianceData.length !== 1 ? 's' : ''}
// //             </span>
// //           </div>
// //         )}
// //       </div>
      
// //       {/* Modal for Add/Edit */}
// //       {modalVisible && (
// //         <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
// //           <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleCloseModal}></div>
          
// //           <div className="relative bg-white rounded-lg max-w-lg w-full mx-4 shadow-xl transform transition-all sm:max-w-xl animate-fade-in">
// //             <div className="absolute top-0 right-0 pt-4 pr-4">
// //               <button
// //                 type="button"
// //                 onClick={handleCloseModal}
// //                 className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
// //               >
// //                 <span className="sr-only">Close</span>
// //                 <XCircle className="h-6 w-6" />
// //               </button>
// //             </div>
            
// //             <div className="px-6 pt-6 pb-4">
// //               <h3 className="text-lg font-medium text-gray-900 flex items-center">
// //                 <span className="bg-blue-100 p-2 rounded-full mr-2">
// //                   {isEditing ? <Edit className="h-5 w-5 text-blue-600" /> : <Plus className="h-5 w-5 text-blue-600" />}
// //                 </span>
// //                 {isEditing ? 'Edit Compliance Item' : 'Add New Compliance Item'}
// //               </h3>
// //               <p className="mt-1 text-sm text-gray-500">
// //                 {isEditing ? 'Update the compliance information below.' : 'Fill in the details to create a new compliance item.'}
// //               </p>
// //             </div>
            
// //             <form onSubmit={handleFormSubmit} className="px-6 pb-6">
// //               <div className="space-y-4">
// //                 <div>
// //                   <label htmlFor="index" className="block text-sm font-medium text-gray-700">
// //                     Index <span className="text-red-500">*</span>
// //                   </label>
// //                   <input
// //                     type="number"
// //                     name="index"
// //                     id="index"
// //                     value={formData.index}
// //                     onChange={handleInputChange}
// //                     className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm 
// //                       ${formErrors.index 
// //                         ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
// //                         : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
// //                       }`}
// //                   />
// //                   {formErrors.index && (
// //                     <p className="mt-2 text-sm text-red-600">{formErrors.index}</p>
// //                   )}
// //                 </div>
                
// //                 <div>
// //                   <label htmlFor="title" className="block text-sm font-medium text-gray-700">
// //                     Title <span className="text-red-500">*</span>
// //                   </label>
// //                   <input
// //                     type="text"
// //                     name="title"
// //                     id="title"
// //                     value={formData.title}
// //                     onChange={handleInputChange}
// //                     className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm 
// //                       ${formErrors.title 
// //                         ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
// //                         : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
// //                       }`}
// //                   />
// //                   {formErrors.title && (
// //                     <p className="mt-2 text-sm text-red-600">{formErrors.title}</p>
// //                   )}
// //                 </div>
                
// //                 <div>
// //                   <label htmlFor="description" className="block text-sm font-medium text-gray-700">
// //                     Description <span className="text-red-500">*</span>
// //                   </label>
// //                   <textarea
// //                     name="description"
// //                     id="description"
// //                     rows={4}
// //                     value={formData.description}
// //                     onChange={handleInputChange}
// //                     className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm 
// //                       ${formErrors.description
// //                         ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
// //                         : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
// //                       }`}
// //                   />
// //                   {formErrors.description && (
// //                     <p className="mt-2 text-sm text-red-600">{formErrors.description}</p>
// //                   )}
// //                 </div>
                
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700">
// //                     Image
// //                   </label>
// //                   <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
// //                     <div className="space-y-1 text-center">
// //                       {!imagePreview ? (
// //                         <>
// //                           <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
// //                           <div className="flex text-sm text-gray-600">
// //                             <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
// //                               <span>Upload a file</span>
// //                               <input 
// //                                 id="file-upload" 
// //                                 name="file-upload" 
// //                                 type="file" 
// //                                 className="sr-only"
// //                                 accept="image/*"
// //                                 onChange={handleFileChange} 
// //                               />
// //                             </label>
// //                             <p className="pl-1">or drag and drop</p>
// //                           </div>
// //                           <p className="text-xs text-gray-500">
// //                             PNG, JPG, GIF up to 5MB
// //                           </p>
// //                         </>
// //                       ) : (
// //                         <div className="relative">
// //                           <img 
// //                             src={imagePreview} 
// //                             alt="Preview" 
// //                             className="max-h-64 mx-auto object-contain"
// //                           />
// //                           <button
// //                             type="button"
// //                             onClick={() => {
// //                               setImageFile(null);
// //                               setImagePreview('');
// //                             }}
// //                             className="absolute top-0 right-0 bg-red-100 rounded-full p-1 text-red-600 hover:bg-red-200"
// //                           >
// //                             <XCircle className="h-4 w-4" />
// //                           </button>
// //                           <label htmlFor="file-upload" className="block mt-4 cursor-pointer text-center text-sm text-blue-600 hover:text-blue-500">
// //                             Change image
// //                             <input 
// //                               id="file-upload" 
// //                               name="file-upload" 
// //                               type="file" 
// //                               className="sr-only"
// //                               accept="image/*"
// //                               onChange={handleFileChange} 
// //                             />
// //                           </label>
// //                         </div>
// //                       )}
// //                     </div>
// //                   </div>
// //                 </div>
                
// //                 <div>
// //                   <label htmlFor="status" className="block text-sm font-medium text-gray-700">
// //                     Status
// //                   </label>
// //                   <select
// //                     id="status"
// //                     name="status"
// //                     value={formData.status}
// //                     onChange={handleInputChange}
// //                     className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
// //                   >
// //                     <option value="ACTIVE">ACTIVE</option>
// //                     <option value="INACTIVE">INACTIVE</option>
// //                   </select>
// //                 </div>
// //               </div>
              
// //               <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
// //                 <button
// //                   type="submit"
// //                   disabled={loading}
// //                   className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm disabled:opacity-50"
// //                 >
// //                   {loading ? (
// //                     <span className="inline-flex items-center">
// //                       <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
// //                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
// //                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
// //                       </svg>
// //                       Processing...
// //                     </span>
// //                   ) : (
// //                     <span>{isEditing ? 'Update' : 'Create'}</span>
// //                   )}
// //                 </button>
// //                 <button
// //                   type="button"
// //                   onClick={handleCloseModal}
// //                   className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
// //                 >
// //                   Cancel
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}
      
// //       <style jsx global>{`
// //         @keyframes fade-in {
// //           from { opacity: 0; }
// //           to { opacity: 1; }
// //         }
        
// //         @keyframes slide-down {
// //           from { opacity: 0; max-height: 0; }
// //           to { opacity: 1; max-height: 200px; }
// //         }
        
// //         .animate-fade-in {
// //           animation: fade-in 0.5s ease-out forwards;
// //         }
        
// //         .animate-slide-down {
// //           animation: slide-down 0.3s ease-out forwards;
// //           overflow: hidden;
// //         }
// //       `}</style>
// //     </div>
// //   );
// // };

// // export default CompliancePage;




// "use client";
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import {
//   Plus,
//   Edit,
//   Trash2,
//   Upload as UploadIcon,
//   CheckCircle,
//   XCircle,
//   ImageIcon,
//   AlertTriangle,
//   ChevronUp,
//   ChevronDown,
//   Eye,
//   EyeOff
// } from 'lucide-react';

// interface ComplianceData {
//   id: number;
//   title: string;
//   slug: string;
//   description: string;
//   images: string[];
//   index: number;
//   createdBy: string;
//   createdAt: string;
//   updatedBy: string;
//   updatedAt: string;
//   status: 'ACTIVE' | 'INACTIVE';
// }

// // Format image URL
// const formatImageUrl = (imagePath: string): string => {
//   if (!imagePath) return '';
//   return imagePath.startsWith('http') ? imagePath : `http://localhost:7000/${imagePath}`;
// };

// const getFirstImage = (images: string[] | undefined): string => {
//   if (!images || !Array.isArray(images) || images.length === 0) return '';
//   return formatImageUrl(images[0]);
// };

// const CompliancePage: React.FC = () => {
//   const [complianceData, setComplianceData] = useState<ComplianceData[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [modalVisible, setModalVisible] = useState<boolean>(false);
//   const [isEditing, setIsEditing] = useState<boolean>(false);
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string>('');
//   const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
//   const [sortBy, setSortBy] = useState<string>("index");
//   const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
//   const [expandedDescription, setExpandedDescription] = useState<number | null>(null);
//   const [highlightedRow, setHighlightedRow] = useState<number | null>(null);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
//   const [formData, setFormData] = useState({
//     id: 0,
//     title: '',
//     description: '',
//     index: 0,
//     status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
//   });
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);

//   const token = Cookies.get('token');

//   // Fetch compliance data
//   const fetchComplianceData = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get('http://localhost:7000/api/v1/parasole/compliance', {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       if (response.data.success) {
//         setComplianceData(response.data.data || []);
//       } else {
//         showError('Failed to fetch compliance data');
//       }
//     } catch (error) {
//       console.error('Error fetching compliance data:', error);
//       showError('Error fetching compliance data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchComplianceData();
//   }, []);

//   const showSuccess = (message: string) => {
//     setSuccessMessage(message);
//     setTimeout(() => setSuccessMessage(null), 3000);
//   };

//   const showError = (message: string) => {
//     setErrorMessage(message);
//     setTimeout(() => setErrorMessage(null), 3000);
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: name === 'index' ? parseInt(value) || 0 : value
//     }));
//     if (formErrors[name]) {
//       setFormErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handleAddComplianceClick = () => {
//     setFormData({
//       id: 0,
//       title: '',
//       description: '',
//       index: 0,
//       status: 'ACTIVE'
//     });
//     setImageFile(null);
//     setImagePreview('');
//     setIsEditing(false);
//     setFormErrors({});
//     setModalVisible(true);
//   };

//   const handleEditComplianceClick = (record: ComplianceData) => {
//     setIsEditing(true);
//     setFormData({
//       id: record.id,
//       title: record.title,
//       description: record.description,
//       index: record.index,
//       status: record.status
//     });
//     if (record.images && record.images.length > 0) {
//       setImagePreview(formatImageUrl(record.images[0]));
//     } else {
//       setImagePreview('');
//     }
//     setFormErrors({});
//     setModalVisible(true);
//   };

//   const handleConfirmDelete = (id: number) => {
//     setShowDeleteConfirm(id);
//   };

//   const handleDelete = async (id: number) => {
//     try {
//       await axios.delete(`http://localhost:7000/api/v1/parasole/compliance/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       showSuccess('Compliance deleted successfully');
//       fetchComplianceData();
//       setShowDeleteConfirm(null);
//     } catch (error) {
//       console.error('Error deleting compliance:', error);
//       showError('Failed to delete compliance');
//     }
//   };

//   const handleToggleStatus = async (id: number) => {
//     const item = complianceData.find(item => item.id === id);
//     if (!item) return;
//     const newStatus = item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
//     try {
//       await axios.put(
//         `http://localhost:7000/api/v1/parasole/compliance/${id}`,
//         { status: newStatus },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
//       showSuccess(`Status updated to ${newStatus}`);
//       fetchComplianceData();
//     } catch (error) {
//       console.error('Error updating status:', error);
//       showError('Failed to update status');
//     }
//   };

//   const handleCloseModal = () => {
//     setModalVisible(false);
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (!file.type.startsWith('image/')) {
//         showError('You can only upload image files!');
//         return;
//       }
//       if (file.size / 1024 / 1024 > 5) {
//         showError('Image must be smaller than 5MB!');
//         return;
//       }
//       setImageFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const validateForm = () => {
//     const errors: { [key: string]: string } = {};
//     if (!formData.title.trim()) errors.title = 'Title is required';
//     if (!formData.description.trim()) errors.description = 'Description is required';
//     if (formData.index < 0) errors.index = 'Index must be a positive number';
//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

// //   const handleFormSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (!validateForm()) return;

// //     try {
// //       setLoading(true);

// //       const formDataObj = new FormData();
// //       formDataObj.append('title', formData.title);
// //       formDataObj.append('description', formData.description);
// //       formDataObj.append('index', String(formData.index));
// //       formDataObj.append('status', formData.status);

// //       if (!imageFile && !isEditing) {
// //         showError('Please upload an image');
// //         setLoading(false);
// //         return;
// //       }

// //       if (imageFile) {
// //         formDataObj.append('image', imageFile);
// //       }

// //       let response;
// //       if (isEditing) {
// //         if (!imageFile) {
// //           response = await axios.put(
// //             `http://localhost:7000/api/v1/parasole/compliance/${formData.id}`,
// //             {
// //               title: formData.title,
// //               description: formData.description,
// //               index: Number(formData.index),
// //               status: formData.status
// //             },
// //             {
// //               headers: {
// //                 Authorization: `Bearer ${token}`,
// //                 'Content-Type': 'application/json'
// //               }
// //             }
// //           );
// //         } else {
// //           response = await axios.put(
// //             `http://localhost:7000/api/v1/parasole/compliance/${formData.id}`,
// //             formDataObj,
// //             {
// //               headers: {
// //                 Authorization: `Bearer ${token}`
// //               }
// //             }
// //           );
// //         }
// //         showSuccess('Compliance updated successfully');
// //       } else {
// //         response = await axios.post(
// //           'http://localhost:7000/api/v1/parasole/compliance',
// //           formDataObj,
// //           {
// //             headers: {
// //               Authorization: `Bearer ${token}`
// //             }
// //           }
// //         );
// //         showSuccess('Compliance created successfully');
// //       }

// //       setModalVisible(false);
// //       fetchComplianceData();

// //     } catch (error: any) {
// //       console.error('Error submitting form:', error.response?.data || error.message || error);
// //       showError(error.response?.data?.message || 'An unexpected error occurred');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
// const handleFormSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validateForm()) return;
  
//     try {
//       setLoading(true);
  
//       const formDataObj = new FormData();
//       formDataObj.append('title', formData.title);
//       formDataObj.append('description', formData.description);
//       formDataObj.append('index', String(formData.index));
//       formDataObj.append('status', formData.status);
  
//       if (!imageFile && !isEditing) {
//         showError('Please upload an image');
//         setLoading(false);
//         return;
//       }
  
//       if (imageFile) {
//         formDataObj.append('image', imageFile);
//       }
  
//       let response;
//       if (isEditing) {
//         // Update without image
//         if (!imageFile) {
//           response = await axios.put(
//             `http://localhost:7000/api/v1/parasole/compliance/${formData.id}`,
//             {
//               title: formData.title,
//               description: formData.description,
//               index: Number(formData.index),
//               status: formData.status
//             },
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//                 'Content-Type': 'application/json'
//               }
//             }
//           );
//         } else {
//           // Update with image
//           response = await axios.put(
//             `http://localhost:7000/api/v1/parasole/compliance/${formData.id}`,
//             formDataObj,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`
//                 // Do NOT set Content-Type manually
//               }
//             }
//           );
//         }
//         showSuccess('Compliance updated successfully');
//       } else {
//         // Create
//         response = await axios.post(
//           'http://localhost:7000/api/v1/parasole/compliance',
//           formDataObj,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`
//               // Do NOT set Content-Type manually
//             }
//           }
//         );
//         showSuccess('Compliance created successfully');
//       }
  
//       setModalVisible(false);
//       fetchComplianceData();
  
//     } catch (error: any) {
//       console.error('🚨 Full error object:', error); // Full error dump
//       console.error('👉 Is Axios error?', axios.isAxiosError(error));
      
//       if (axios.isAxiosError(error)) {
//         if (error.response) {
//           // Server responded with a status code outside 2xx
//           console.error('Backend returned:', error.response.data);
//           console.error('Status code:', error.response.status);
//           showError(error.response.data.message || 'Server responded with an error');
//         } else if (error.request) {
//           // No response received
//           console.error('No response received from server:', error.request);
//           showError('No response from server. Check your connection or backend.');
//         } else {
//           // Something happened in setting up the request
//           console.error('Request setup failed:', error.message);
//           showError('Failed to send request');
//         }
//       } else {
//         // Non-Axios error (like JS error)
//         console.error('Non-Axios error:', error);
//         showError('An unexpected error occurred');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleSort = (column: string) => {
//     if (sortBy === column) {
//       setSortDirection(sortDirection === "asc" ? "desc" : "asc");
//     } else {
//       setSortBy(column);
//       setSortDirection("asc");
//     }
//   };

//   const toggleDescription = (id: number) => {
//     setExpandedDescription(expandedDescription === id ? null : id);
//   };

//   const getSortedItems = () => {
//     return [...complianceData].sort((a, b) => {
//       let aValue: any = a[sortBy as keyof ComplianceData];
//       let bValue: any = b[sortBy as keyof ComplianceData];

//       if (typeof aValue === "string" && typeof bValue === "string") {
//         aValue = aValue.toLowerCase();
//         bValue = bValue.toLowerCase();
//       }

//       if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
//       if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
//       return 0;
//     });
//   };

//   const sortedItems = getSortedItems();

//   const getImageForDisplay = (item: ComplianceData): string => {
//     return item.images && item.images.length > 0 ? formatImageUrl(item.images[0]) : "";
//   };

//   return (
//     <div className="compliance-page">
//       {/* Success Message */}
//       {successMessage && (
//         <div className="fixed top-4 right-4 z-50 bg-green-100 text-green-800 px-4 py-3 rounded-lg shadow-md flex items-center animate-fade-in">
//           <CheckCircle className="h-5 w-5 mr-2" />
//           <span>{successMessage}</span>
//         </div>
//       )}

//       {/* Error Message */}
//       {errorMessage && (
//         <div className="fixed top-4 right-4 z-50 bg-red-100 text-red-800 px-4 py-3 rounded-lg shadow-md flex items-center animate-fade-in">
//           <AlertTriangle className="h-5 w-5 mr-2" />
//           <span>{errorMessage}</span>
//         </div>
//       )}

//       {/* Header */}
//       <div className="mb-6 flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-gray-800">Compliance Management</h1>
//         <button 
//           onClick={handleAddComplianceClick}
//           disabled={loading}
//           className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors duration-200"
//         >
//           <Plus className="mr-2 h-4 w-4" />
//           Add Compliance
//         </button>
//       </div>

//       {/* Table */}
//       <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
//         <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
//           <h2 className="text-lg font-semibold text-gray-800 flex items-center">
//             <span className="bg-blue-100 p-2 rounded mr-2"><ImageIcon className="h-5 w-5 text-blue-600" /></span>
//             Compliance Items
//           </h2>
//           <div className="text-sm text-gray-500">{complianceData.length} item{complianceData.length !== 1 ? 's' : ''}</div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th onClick={() => handleSort('id')} className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hover:bg-gray-100">ID</th>
//                 <th onClick={() => handleSort('title')} className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hover:bg-gray-100">Title</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Description</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Image</th>
//                 <th onClick={() => handleSort('status')} className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hover:bg-gray-100">Status</th>
//                 <th onClick={() => handleSort('index')} className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hover:bg-gray-100">Index</th>
//                 <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>

//             <tbody className="bg-white divide-y divide-gray-200">
//               {sortedItems.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="text-center text-gray-500 py-16">
//                     {loading ? (
//                       <>
//                         <div className="animate-spin h-8 w-8 mx-auto mb-2 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
//                         <p>Loading compliance items...</p>
//                       </>
//                     ) : (
//                       <p>No compliance items found. Add one to get started.</p>
//                     )}
//                   </td>
//                 </tr>
//               ) : (
//                 sortedItems.map(item => (
//                   <React.Fragment key={`item-${item.id}`}>
//                     <tr className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{item.title}</td>
//                       <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{item.description}</td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {getImageForDisplay(item) ? (
//                           <img src={getImageForDisplay(item)} alt={item.title} className="h-12 w-12 object-cover rounded-md" />
//                         ) : (
//                           <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
//                             <ImageIcon className="h-6 w-6" />
//                           </div>
//                         )}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <button
//                           onClick={() => handleToggleStatus(item.id)}
//                           className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
//                             item.status === 'ACTIVE'
//                               ? 'bg-green-100 text-green-800'
//                               : 'bg-gray-100 text-gray-600'
//                           }`}
//                         >
//                           {item.status === 'ACTIVE' ? <CheckCircle className="mr-1 h-3.5 w-3.5" /> : <XCircle className="mr-1 h-3.5 w-3.5" />}
//                           {item.status}
//                         </button>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.index}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <div className="flex justify-end space-x-2">
//                           <button
//                             onClick={() => handleEditComplianceClick(item)}
//                             className="text-blue-600 hover:text-blue-900 p-1.5 rounded-full hover:bg-blue-50 transition"
//                           >
//                             <Edit className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={() => handleConfirmDelete(item.id)}
//                             className="text-red-600 hover:text-red-900 p-1.5 rounded-full hover:bg-red-50 transition"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                     {expandedDescription === item.id && (
//                       <tr className="bg-gray-50">
//                         <td colSpan={7} className="px-6 py-3 text-sm text-gray-700">
//                           <strong>Description:</strong> {item.description}
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Modal for Add/Edit */}
//       {modalVisible && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//           <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleCloseModal}></div>
//           <div className="relative bg-white rounded-lg max-w-lg w-full mx-4 shadow-xl p-6 animate-fade-in">
//             <button onClick={handleCloseModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
//               <XCircle className="h-6 w-6" />
//             </button>
//             <h3 className="text-lg font-medium text-gray-900 mb-4">
//               {isEditing ? 'Edit Compliance Item' : 'Add New Compliance Item'}
//             </h3>

//             <form onSubmit={handleFormSubmit}>
//               {/* Form Fields */}
//               <div className="space-y-4">
//                 <div>
//                   <label htmlFor="index" className="block text-sm font-medium text-gray-700">Index</label>
//                   <input
//                     type="number"
//                     name="index"
//                     id="index"
//                     value={formData.index}
//                     onChange={handleInputChange}
//                     className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500`}
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
//                   <input
//                     type="text"
//                     name="title"
//                     id="title"
//                     value={formData.title}
//                     onChange={handleInputChange}
//                     className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500`}
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
//                   <textarea
//                     name="description"
//                     id="description"
//                     rows={4}
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     className="mt-1 block w-full rounded-md shadow-sm sm:text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Image</label>
//                   <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
//                     <div className="space-y-1 text-center">
//                       {!imagePreview ? (
//                         <>
//                           <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
//                           <div className="flex text-sm text-gray-600">
//                             <label
//                               htmlFor="file-upload"
//                               className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
//                             >
//                               <span>Upload a file</span>
//                               <input
//                                 id="file-upload"
//                                 name="file-upload"
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={handleFileChange}
//                                 className="sr-only"
//                               />
//                             </label>
//                             <p className="pl-1">or drag and drop</p>
//                           </div>
//                           <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
//                         </>
//                       ) : (
//                         <div className="relative">
//                           <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto object-contain" />
//                           <button
//                             type="button"
//                             onClick={() => {
//                               setImageFile(null);
//                               setImagePreview('');
//                             }}
//                             className="absolute top-0 right-0 bg-red-100 text-red-600 p-1 rounded-full hover:bg-red-200"
//                           >
//                             <XCircle className="h-4 w-4" />
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//                 <div>
//                   <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
//                   <select
//                     id="status"
//                     name="status"
//                     value={formData.status}
//                     onChange={handleInputChange}
//                     className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//                   >
//                     <option value="ACTIVE">ACTIVE</option>
//                     <option value="INACTIVE">INACTIVE</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="mt-5 sm:flex sm:flex-row-reverse">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm"
//                 >
//                   {loading ? 'Processing...' : isEditing ? 'Update' : 'Create'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleCloseModal}
//                   className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CompliancePage;


// "use client"

// import React, { useState, useEffect } from 'react';
// import Cookies from 'js-cookie';
// import axios from 'axios';

// const AboutPage = () => {
//   const [aboutData, setAboutData] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [formData, setFormData] = useState({
//     index: '',
//     title: '',
//     description: '',
//     images: []
//   });
//   const [previewImages, setPreviewImages] = useState([]);

//   // Fetch about data
//   const fetchAboutData = async () => {
//     setIsLoading(true);
//     try {
//       const token = Cookies.get('token');
//       const response = await axios.get('http://localhost:7000/api/v1/parasole/about', {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       setAboutData(response.data.data);
//     } catch (error) {
//       console.error('Error fetching about data:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAboutData();
//   }, []);

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   // Handle image upload
//   const handleImageUpload = (e) => {
//     const files = Array.from(e.target.files);
//     setFormData({
//       ...formData,
//       images: files
//     });

//     // Create preview URLs
//     const previews = files.map(file => URL.createObjectURL(file));
//     setPreviewImages(previews);
//   };

//   // Open modal for creating new item
//   const handleAddNew = () => {
//     setSelectedItem(null);
//     setFormData({
//       index: '',
//       title: '',
//       description: '',
//       images: []
//     });
//     setPreviewImages([]);
//     setIsModalOpen(true);
//   };

//   // Open modal for editing existing item
//   const handleEdit = (item) => {
//     setSelectedItem(item);
//     setFormData({
//       index: item.index,
//       title: item.title,
//       description: item.description,
//       images: []
//     });
//     setPreviewImages(item.images.map(img => `http://localhost:7000/${img}`));
//     setIsModalOpen(true);
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
    
//     try {
//       const token = Cookies.get('token');
//       const formDataToSend = new FormData();
//       formDataToSend.append('index', formData.index);
//       formDataToSend.append('title', formData.title);
//       formDataToSend.append('description', formData.description);
      
//       // Append each image to form data
//       if (formData.images.length > 0) {
//         formData.images.forEach(image => {
//           formDataToSend.append('images', image);
//         });
//       }

//       if (selectedItem) {
//         // Update existing item
//         await axios.put(`http://localhost:7000/api/v1/parasole/about/${selectedItem.id}`, formDataToSend, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data'
//           }
//         });
//       } else {
//         // Create new item
//         await axios.post('http://localhost:7000/api/v1/parasole/about', formDataToSend, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data'
//           }
//         });
//       }
      
//       setIsModalOpen(false);
//       fetchAboutData();
//     } catch (error) {
//       console.error('Error saving data:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle item deletion
//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this item?')) return;
    
//     setIsLoading(true);
//     try {
//       const token = Cookies.get('token');
//       await axios.delete(`http://localhost:7000/api/v1/parasole/about/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       fetchAboutData();
//     } catch (error) {
//       console.error('Error deleting item:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle status toggle
//   const handleStatusToggle = async (item, newStatus) => {
//     setIsLoading(true);
//     try {
//       const token = Cookies.get('token');
      
//       // Use the main update endpoint instead of a specific status endpoint
//       await axios.put(`http://localhost:7000/api/v1/parasole/about/${item.id}`, 
//         { status: newStatus },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
//       fetchAboutData();
//     } catch (error) {
//       console.error('Error updating status:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">About Management</h1>
//         <button 
//           onClick={handleAddNew}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm flex items-center"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//             <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
//           </svg>
//           Add New
//         </button>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Index</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Images</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {isLoading ? (
//               <tr>
//                 <td colSpan="6" className="px-6 py-4 text-center">Loading...</td>
//               </tr>
//             ) : aboutData.length === 0 ? (
//               <tr>
//                 <td colSpan="6" className="px-6 py-4 text-center">No data available</td>
//               </tr>
//             ) : (
//               aboutData.map((item) => (
//                 <tr key={item.id}>
//                   <td className="px-6 py-4 whitespace-nowrap">{item.index}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">{item.title}</td>
//                   <td className="px-6 py-4">
//                     <div className="max-w-xs truncate">{item.description}</div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex space-x-2">
//                       {item.images && item.images.length > 0 ? (
//                         item.images.map((img, idx) => (
//                           <div key={idx} className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
//                             <img 
//                               src={`http://localhost:7000/${img.replace(/^public\//, '')}`} 
//                               alt={`${item.title} image ${idx + 1}`}
//                               className="h-full w-full object-cover"
//                             />
//                           </div>
//                         ))
//                       ) : (
//                         <div className="h-16 w-16 rounded-lg flex items-center justify-center bg-gray-100 border border-gray-200">
//                           <span className="text-gray-400">No image</span>
//                         </div>
//                       )}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="relative inline-block w-40">
//                       <select
//                         value={item.status}
//                         onChange={(e) => handleStatusToggle(item, e.target.value)}
//                         className={`appearance-none w-full pl-3 pr-10 py-2 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium transition-all duration-200 ${
//                           item.status === 'ACTIVE' 
//                             ? 'bg-green-50 text-green-800 border-green-200' 
//                             : 'bg-red-50 text-red-800 border-red-200'
//                         }`}
//                       >
//                         <option value="ACTIVE" className="bg-white text-green-800">Active</option>
//                         <option value="INACTIVE" className="bg-white text-red-800">Inactive</option>
//                       </select>
//                       <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                         <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
//                           <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
//                         </svg>
//                       </div>
//                       <div className={`absolute top-0 right-10 mt-2 h-4 w-4 rounded-full ${
//                         item.status === 'ACTIVE' ? 'bg-green-400' : 'bg-red-400'
//                       }`}></div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={() => handleEdit(item)}
//                         className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-md"
//                       >
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                         </svg>
//                       </button>
//                       <button
//                         onClick={() => handleDelete(item.id)}
//                         className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-md"
//                       >
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                         </svg>
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
//             <div className="px-6 py-4 border-b border-gray-200">
//               <h3 className="text-lg font-medium text-gray-900">
//                 {selectedItem ? 'Edit About Item' : 'Create New About Item'}
//               </h3>
//             </div>
            
//             <form onSubmit={handleSubmit}>
//               <div className="px-6 py-4 space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Index
//                   </label>
//                   <input
//                     type="number"
//                     name="index"
//                     value={formData.index}
//                     onChange={handleInputChange}
//                     className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
//                     placeholder="Enter display order index"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Title
//                   </label>
//                   <input
//                     type="text"
//                     name="title"
//                     value={formData.title}
//                     onChange={handleInputChange}
//                     className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
//                     placeholder="Enter title"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Description
//                   </label>
//                   <textarea
//                     name="description"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     rows="4"
//                     className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
//                     placeholder="Enter description"
//                     required
//                   ></textarea>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Images
//                   </label>
//                   <input
//                     type="file"
//                     onChange={handleImageUpload}
//                     className="w-full"
//                     multiple
//                     accept="image/png, image/jpeg, image/jpg"
//                   />
                  
//                   {previewImages.length > 0 && (
//                     <div className="mt-3 grid grid-cols-3 gap-2">
//                       {previewImages.map((preview, idx) => (
//                         <div key={idx} className="relative">
//                           <img
//                             src={preview}
//                             alt={`Preview ${idx + 1}`}
//                             className="h-20 w-20 object-cover rounded-md"
//                           />
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
              
//               <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-blue-600 border border-transparent rounded-md shadow-sm px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? 'Saving...' : 'Save'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AboutPage;






"use client"
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const CompliancePage = () => {
  const [complianceData, setComplianceData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    index: '',
    title: '',
    description: '',
    images: []
  });
  const [previewImages, setPreviewImages] = useState([]);

  // Fetch compliance data
  const fetchComplianceData = async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get('token');
      const response = await axios.get('http://localhost:7000/api/v1/parasole/compliance', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setComplianceData(response.data.data);
    } catch (error) {
      console.error('Error fetching compliance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplianceData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      images: files
    });

    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  // Open modal for creating new item
  const handleAddNew = () => {
    setSelectedItem(null);
    setFormData({
      index: '',
      title: '',
      description: '',
      images: []
    });
    setPreviewImages([]);
    setIsModalOpen(true);
  };

  // Open modal for editing existing item
  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      index: item.index,
      title: item.title,
      description: item.description,
      images: []
    });
    setPreviewImages(item.images.map(img => `http://localhost:7000/${img}`));
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = Cookies.get('token');
      const formDataToSend = new FormData();
      formDataToSend.append('index', formData.index);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);

      if (formData.images.length > 0) {
        formData.images.forEach(image => {
          formDataToSend.append('images', image);
        });
      }

      if (selectedItem) {
        // Update existing compliance
        await axios.put(`http://localhost:7000/api/v1/parasole/compliance/${selectedItem.id}`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Create new compliance
        await axios.post('http://localhost:7000/api/v1/parasole/compliance', formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      setIsModalOpen(false);
      fetchComplianceData();
    } catch (error) {
      console.error('Error saving compliance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle item deletion
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this compliance item?')) return;
    setIsLoading(true);
    try {
      const token = Cookies.get('token');
      await axios.delete(`http://localhost:7000/api/v1/parasole/compliance/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchComplianceData();
    } catch (error) {
      console.error('Error deleting compliance item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (item, newStatus) => {
    setIsLoading(true);
    try {
      const token = Cookies.get('token');
      await axios.put(
        `http://localhost:7000/api/v1/parasole/compliance/${item.id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      fetchComplianceData();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Compliance Management</h1>
        <button 
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Index</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Images</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center">Loading...</td>
              </tr>
            ) : complianceData.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center">No data available</td>
              </tr>
            ) : (
              complianceData.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.index}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.title}</td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs truncate">{item.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      {item.images && item.images.length > 0 ? (
                        item.images.map((img, idx) => (
                          <div key={idx} className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                            <img 
                              src={`http://localhost:7000/${img.replace(/^public\//, '')}`} 
                              alt={`${item.title} image ${idx + 1}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ))
                      ) : (
                        <div className="h-16 w-16 rounded-lg flex items-center justify-center bg-gray-100 border border-gray-200">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative inline-block w-40">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusToggle(item, e.target.value)}
                        className={`appearance-none w-full pl-3 pr-10 py-2 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium transition-all duration-200 ${
                          item.status === 'ACTIVE' 
                            ? 'bg-green-50 text-green-800 border-green-200' 
                            : 'bg-red-50 text-red-800 border-red-200'
                        }`}
                      >
                        <option value="ACTIVE" className="bg-white text-green-800">Active</option>
                        <option value="INACTIVE" className="bg-white text-red-800">Inactive</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                      <div className={`absolute top-0 right-10 mt-2 h-4 w-4 rounded-full ${
                        item.status === 'ACTIVE' ? 'bg-green-400' : 'bg-red-400'
                      }`}></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-md"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-md"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedItem ? 'Edit Compliance Item' : 'Create New Compliance Item'}
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Index
                  </label>
                  <input
                    type="number"
                    name="index"
                    value={formData.index}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter display order index"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter description"
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Images
                  </label>
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    className="w-full"
                    multiple
                    accept="image/png, image/jpeg, image/jpg"
                  />
                  {previewImages.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {previewImages.map((preview, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={preview}
                            alt={`Preview ${idx + 1}`}
                            className="h-20 w-20 object-cover rounded-md"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 border border-transparent rounded-md shadow-sm px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompliancePage;