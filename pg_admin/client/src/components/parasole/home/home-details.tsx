// "use client";

// import React, { useState, useEffect } from 'react';
// import Image from 'next/image';
// import Cookies from 'js-cookie';

// interface Hero {
//   id: number;
//   title: string;
//   slug: string;
//   description: string;
//   image: string;
//   index: number;
//   createdBy: string;
//   createdAt: string;
//   updatedBy: string | null;
//   updatedAt: string;
//   status: string;
// }

// interface HeroDetail {
//   id: number;
//   heroId: number;
//   title: string;
//   slug: string;
//   description: string;
//   image: string;
//   index: number;
//   createdBy: string;
//   createdAt: string;
//   updatedBy: string | null;
//   updatedAt: string;
//   status: string;
//   hero?: {
//     title: string;
//   };
// }

// interface FormDataState {
//   heroId: string;
//   title: string;
//   description: string;
//   image: File | null;
//   imagePreview: string;
//   index: number;
//   status: string;
// }

// interface ApiResponse<T> {
//   success: boolean;
//   message: string;
//   data: T;
// }

// const HomeDetails: React.FC = () => {
//   // Debug function to log API responses
//   const logResponse = (label: string, data: any): void => {
//     console.log(`=== ${label} ===`);
//     console.log(data);
//     console.log('===================');
//   };
  
//   const formatImageUrl = (imagePath: string): string => {
//     if (!imagePath) return '/api/placeholder/400/400';
    
//     // Handle various image path formats
//     if (imagePath.startsWith('http')) {
//       return imagePath;
//     }
    
//     // Remove leading slash if present to avoid double slashes
//     const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
//     return `http://localhost:7000/${cleanPath}`;
//   };

//   const [heroDetails, setHeroDetails] = useState<HeroDetail[]>([]);
//   const [heroes, setHeroes] = useState<Hero[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [formData, setFormData] = useState<FormDataState>({
//     heroId: '',
//     title: '',
//     description: '',
//     image: null,
//     imagePreview: '',
//     index: 1,
//     status: 'ACTIVE'
//   });
//   const [error, setError] = useState<string>('');
//   const [debugInfo, setDebugInfo] = useState<string>('');
//   const [loadCount, setLoadCount] = useState<number>(0);

//   // Button to manually refresh data
//   const refreshData = (): void => {
//     setLoadCount(prev => prev + 1);
//     setDebugInfo('Manually refreshing data...');
//   };

//   // Fetch hero details data
//   useEffect(() => {
//     const token = Cookies.get('token');
    
//     if (!token) {
//       setError('Authentication token not found. Please log in again.');
//       setIsLoading(false);
//       return;
//     }

//     const fetchHeroDetails = async (): Promise<void> => {
//       try {
//         setIsLoading(true);
//         const response = await fetch('http://localhost:7000/api/v1/parasole/hero-detail', {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });
        
//         // Log the raw response
//         console.log('Hero Details API response status:', response.status);
//         console.log('Hero Details API response ok:', response.ok);
        
//         if (!response.ok) {
//           throw new Error(`API responded with status: ${response.status}`);
//         }
        
//         const result: ApiResponse<HeroDetail[]> = await response.json();
//         logResponse('Hero Details API Response', result);
        
//         if (result.success) {
//           console.log('Hero details fetched:', result.data);
//           setHeroDetails(result.data);
//           setDebugInfo('Hero details data loaded successfully');
//         } else {
//           setError('Failed to fetch hero details');
//           setDebugInfo(`Failed to fetch hero details: ${result.message}`);
//         }
//       } catch (err) {
//         const errorMessage = err instanceof Error ? err.message : 'Unknown error';
//         setError('Error connecting to the server');
//         setDebugInfo(`Connection error: ${errorMessage}`);
//         console.error('Fetch error:', err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     // Fetch heroes for dropdown
//     const fetchHeroes = async (): Promise<void> => {
//       try {
//         const response = await fetch('http://localhost:7000/api/v1/parasole/hero', {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });
        
//         // Log the raw response
//         console.log('Hero API response status:', response.status);
//         console.log('Hero API response ok:', response.ok);
        
//         if (!response.ok) {
//           throw new Error(`API responded with status: ${response.status}`);
//         }
        
//         const result: ApiResponse<Hero[]> = await response.json();
//         logResponse('Heroes API Response', result);
        
//         if (result.success) {
//           console.log('Heroes fetched:', result.data);
//           setHeroes(result.data || []);
//           if (!result.data || result.data.length === 0) {
//             setDebugInfo(prevInfo => prevInfo + ' | No heroes found for dropdown');
//           }
//         } else {
//           console.error('Failed to fetch heroes:', result.message);
//           setDebugInfo(prevInfo => prevInfo + ' | Failed to fetch heroes for dropdown');
//         }
//       } catch (err) {
//         const errorMessage = err instanceof Error ? err.message : 'Unknown error';
//         console.error('Error fetching heroes:', err);
//         setDebugInfo(prevInfo => prevInfo + ` | Error fetching heroes: ${errorMessage}`);
//       }
//     };

//     fetchHeroDetails();
//     fetchHeroes();
//   }, [loadCount]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
//     const fileInput = e.target;
//     const file = fileInput.files?.[0];
    
//     if (file) {
//       setFormData({
//         ...formData,
//         image: file,
//         imagePreview: URL.createObjectURL(file)
//       });
//     }
//   };

//   const openModal = (detail: HeroDetail | null = null): void => {
//     if (detail) {
//       // Edit mode
//       setEditingId(detail.id);
//       setFormData({
//         heroId: detail.heroId.toString(),
//         title: detail.title,
//         description: detail.description,
//         image: null,
//         imagePreview: detail.image,
//         index: detail.index,
//         status: detail.status
//       });
//     } else {
//       // Add mode
//       setEditingId(null);
//       setFormData({
//         heroId: '',
//         title: '',
//         description: '',
//         image: null,
//         imagePreview: '',
//         index: 1,
//         status: 'ACTIVE'
//       });
//     }
//     setIsModalOpen(true);
//   };

//   const closeModal = (): void => {
//     setIsModalOpen(false);
//     setError('');
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError('');

//     try {
//       const token = Cookies.get('token');
      
//       if (!token) {
//         setError('Authentication token not found. Please log in again.');
//         setIsSubmitting(false);
//         return;
//       }

//       // Check if there's already an item with the same index
//       const existingItemWithIndex = heroDetails.find(
//         detail => detail.index.toString() === formData.index.toString() && detail.id !== editingId
//       );

//       if (existingItemWithIndex) {
//         setError(`An item with index ${formData.index} already exists. Please use a different index.`);
//         setIsSubmitting(false);
//         return;
//       }

//       const formDataToSend = new FormData();
//       Object.keys(formData).forEach(key => {
//         if (key !== 'imagePreview') {
//           const value = formData[key as keyof FormDataState];
//           if (value !== null) {
//             formDataToSend.append(key, value as any);
//           }
//         }
//       });
      
//       // Log what we're sending for debugging
//       console.log('Submitting form with heroId:', formData.heroId);
//       console.log('Using index:', formData.index);
      
//       const url = editingId 
//         ? `http://localhost:7000/api/v1/parasole/hero-detail/${editingId}`
//         : 'http://localhost:7000/api/v1/parasole/hero-detail';
      
//       const method = editingId ? 'PUT' : 'POST';
//       console.log(`Using ${method} request to ${url}`);
      
//       const response = await fetch(url, {
//         method,
//         headers: {
//           'Authorization': `Bearer ${token}`
//         },
//         body: formDataToSend
//       });
      
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error(`API error (${response.status}):`, errorText);
        
//         // Check for unique constraint error on index
//         if (errorText.includes('Unique constraint failed on the fields: (`index`)')) {
//           setError('This index is already in use. Please choose a different index value.');
//         } else {
//           setError(`Error: ${response.status} - ${errorText.substring(0, 100)}...`);
//         }
//         return;
//       }
      
//       const result = await response.json();
//       console.log('API response:', result);
      
//       if (result.success) {
//         // Refresh the data
//         refreshData();
//         closeModal();
//       } else {
//         setError(result.message || 'Failed to save data');
//       }
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Unknown error';
//       setError(`Error submitting form: ${errorMessage}`);
//       console.error('Submit error:', err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDelete = async (id: number): Promise<void> => {
//     if (!window.confirm('Are you sure you want to delete this item?')) {
//       return;
//     }

//     try {
//       const token = Cookies.get('token');
      
//       if (!token) {
//         setError('Authentication token not found. Please log in again.');
//         return;
//       }

//       const response = await fetch(`http://localhost:7000/api/v1/parasole/hero-detail/${id}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       if (!response.ok) {
//         throw new Error(`API responded with status: ${response.status}`);
//       }
      
//       const result = await response.json();
      
//       if (result.success) {
//         // Remove from state to update UI immediately
//         setHeroDetails(heroDetails.filter(detail => detail.id !== id));
//       } else {
//         setError(result.message || 'Failed to delete');
//       }
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Unknown error';
//       setError(`Error deleting item: ${errorMessage}`);
//       console.error('Delete error:', err);
//     }
//   };

//   const handleStatusChange = async (id: number, currentStatus: string): Promise<void> => {
//     const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    
//     try {
//       const token = Cookies.get('token');
      
//       if (!token) {
//         setError('Authentication token not found. Please log in again.');
//         return;
//       }

//       // Simply update the UI optimistically
//       setHeroDetails(heroDetails.map(detail => 
//         detail.id === id ? { ...detail, status: newStatus } : detail
//       ));
      
//       // Try the status endpoint first
//       try {
//         const response = await fetch(`http://localhost:7000/api/v1/parasole/hero-detail/${id}/status`, {
//           method: 'PATCH',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           },
//           body: JSON.stringify({ status: newStatus })
//         });
        
//         if (response.ok) {
//           const result = await response.json();
//           if (result.success) {
//             return; // Successfully updated
//           }
//         }
        
//         // Log the error response for debugging
//         try {
//           const errorText = await response.text();
//           console.warn(`Status endpoint failed (${response.status}):`, errorText);
//         } catch (e) {
//           console.warn(`Status endpoint failed (${response.status}), couldn't read response`);
//         }
//       } catch (err) {
//         console.warn('Status endpoint error:', err);
//       }
      
//       // Fallback: Try the main update endpoint
//       try {
//         // Get the current detail
//         const detailToUpdate = heroDetails.find(detail => detail.id === id);
//         if (!detailToUpdate) {
//           throw new Error('Item not found');
//         }
        
//         // Create a simple object with just the status change
//         const updateData = {
//           status: newStatus
//         };
        
//         console.log('Sending update with:', JSON.stringify(updateData));
        
//         // Try a simple PUT request with just the status change
//         const putResponse = await fetch(`http://localhost:7000/api/v1/parasole/hero-detail/${id}`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           },
//           body: JSON.stringify(updateData)
//         });
        
//         if (!putResponse.ok) {
//           // Log the error response for debugging
//           try {
//             const errorText = await putResponse.text();
//             console.error(`Update endpoint failed (${putResponse.status}):`, errorText);
//             setDebugInfo(`Update error: ${putResponse.status} - ${errorText}`);
//           } catch (e) {
//             console.error(`Update endpoint failed (${putResponse.status}), couldn't read response`);
//           }
          
//           // Don't throw - we've already updated the UI optimistically
//         }
//       } catch (err) {
//         console.error('Update error:', err);
//         // We won't revert the UI change to avoid flickering - backend will sync on next load
//       }
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Unknown error';
//       console.error('Status update error:', err);
//       // Even if there's an error, we'll keep the UI updated
//     }
//   };

//   return (
//     <div className="bg-white shadow-lg rounded-xl p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Home Details</h1>
//         <div className="flex gap-2">
//           <button
//             onClick={refreshData}
//             className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
//           >
//             Refresh Data
//           </button>
//           <button
//             onClick={() => openModal()}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
//           >
//             Add New Detail
//           </button>
//         </div>
//       </div>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}
      
//       {debugInfo && (
//         <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
//           Debug Info: {debugInfo}
//         </div>
//       )}

//       {isLoading ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white border border-gray-200">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="py-3 px-4 text-left">Hero Title</th>
//                 <th className="py-3 px-4 text-left">Detail Title</th>
//                 <th className="py-3 px-4 text-left">Description</th>
//                 <th className="py-3 px-4 text-left">Image</th>
//                 <th className="py-3 px-4 text-left">Index</th>
//                 <th className="py-3 px-4 text-left">Status</th>
//                 <th className="py-3 px-4 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {heroDetails.length > 0 ? (
//                 heroDetails.map((detail) => (
//                   <tr key={detail.id} className="border-t border-gray-200 hover:bg-gray-50">
//                     <td className="py-3 px-4">
//                       {detail.hero?.title || 
//                        (detail.heroId ? `Hero ID: ${detail.heroId}` : 'N/A')}
//                     </td>
//                     <td className="py-3 px-4">{detail.title}</td>
//                     <td className="py-3 px-4">
//                       {detail.description?.length > 50
//                         ? `${detail.description.substring(0, 50)}...`
//                         : detail.description}
//                     </td>
//                     <td className="py-3 px-4 whitespace-nowrap">
//                       <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm relative group transform transition-transform duration-300 hover:scale-110 hover:shadow-md">
//                         {detail.image ? (
//                           <div className="relative h-full w-full">
//                             <img
//                               src={formatImageUrl(detail.image)}
//                               alt={detail.title}
//                               className="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-90"
//                               onError={(e) => {
//                                 const target = e.target as HTMLImageElement;
//                                 target.style.display = 'none';
//                                 const parent = target.parentElement;
//                                 if (parent) {
//                                   const fallback = document.createElement('div');
//                                   fallback.className = 'flex items-center justify-center h-full w-full text-gray-400 absolute inset-0';
//                                   fallback.innerHTML = '<span class="text-xs">No Image</span>';
//                                   parent.appendChild(fallback);
//                                 }
//                               }}
//                             />
//                           </div>
//                         ) : (
//                           <div className="flex items-center justify-center h-full w-full text-gray-400">
//                             <span className="text-xs">No Image</span>
//                           </div>
//                         )}
//                       </div>
//                     </td>
//                     <td className="py-3 px-4">{detail.index}</td>
//                     <td className="py-3 px-4">
//                       <button
//                         onClick={() => handleStatusChange(detail.id, detail.status)}
//                         className={`px-3 py-1 rounded-full text-xs font-medium ${
//                           detail.status === 'ACTIVE'
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-red-100 text-red-800'
//                         }`}
//                       >
//                         {detail.status}
//                       </button>
//                     </td>
//                     <td className="py-3 px-4">
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => openModal(detail)}
//                           className="text-blue-600 hover:text-blue-800"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDelete(detail.id)}
//                           className="text-red-600 hover:text-red-800"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={7} className="py-4 px-4 text-center text-gray-500">
//                     No hero details found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Modal Form */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
//             <div className="flex justify-between items-center mb-4 border-b pb-4">
//               <h2 className="text-xl font-bold text-gray-800">
//                 {editingId ? 'Edit Hero Detail' : 'Add Hero Detail'}
//               </h2>
//               <button
//                 className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
//                 onClick={closeModal}
//               >
//                 ✕
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-5">
//               {/* Image Preview - Moved to top for better visibility */}
//               <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 mb-6">
//                 <div className="flex flex-col sm:flex-row items-center gap-4">
//                   <div className="h-40 w-40 rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm relative group transform transition-transform duration-300 flex items-center justify-center">
//                     {formData.imagePreview ? (
//                       <div className="relative h-full w-full">
//                         <img
//                           src={formData.image ? formData.imagePreview : formatImageUrl(formData.imagePreview)}
//                           alt="Preview"
//                           className="h-full w-full object-cover transition-all duration-300"
//                           onError={(e) => {
//                             const target = e.target as HTMLImageElement;
//                             target.style.display = 'none';
//                             const parent = target.parentElement;
//                             if (parent) {
//                               const fallback = document.createElement('div');
//                               fallback.className = 'flex items-center justify-center h-full w-full text-gray-400 absolute inset-0';
//                               fallback.innerHTML = '<span class="text-sm">Image not available</span>';
//                               parent.appendChild(fallback);
//                             }
//                           }}
//                         />
//                       </div>
//                     ) : (
//                       <div className="flex flex-col items-center justify-center h-full w-full text-gray-400 bg-gray-50">
//                         <span className="text-sm">No image selected</span>
//                       </div>
//                     )}
//                   </div>
                  
//                   <div className="flex-1">
//                     <label className="block text-gray-700 font-medium mb-2">Image Upload</label>
//                     <input
//                       type="file"
//                       name="image"
//                       accept="image/*"
//                       onChange={handleFileChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                       {...(editingId ? {} : { required: true })}
//                     />
//                     <p className="mt-2 text-xs text-gray-500">
//                       {editingId ? "Upload a new image only if you want to change the current one" : "Please select an image to upload"}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <label className="block text-gray-700 font-medium mb-2">Hero Title</label>
//                 <select
//                   name="heroId"
//                   value={formData.heroId}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 >
//                   <option value="">Select Hero</option>
//                   {heroes.map((hero) => (
//                     <option key={hero.id} value={hero.id}>
//                       {hero.title}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="mb-4">
//                 <label className="block text-gray-700 font-medium mb-2">Detail Title</label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block text-gray-700 font-medium mb-2">Description</label>
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   rows={4}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 ></textarea>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="mb-4">
//                   <label className="block text-gray-700 font-medium mb-2">Index</label>
//                   <input
//                     type="number"
//                     name="index"
//                     value={formData.index}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     min="1"
//                     required
//                   />
//                 </div>

//                 <div className="mb-4">
//                   <label className="block text-gray-700 font-medium mb-2">Status</label>
//                   <select
//                     name="status"
//                     value={formData.status}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   >
//                     <option value="ACTIVE">ACTIVE</option>
//                     <option value="INACTIVE">INACTIVE</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
//                 <button
//                   type="button"
//                   onClick={closeModal}
//                   className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 mr-2 hover:bg-gray-100 transition-all duration-200"
//                   disabled={isSubmitting}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 flex items-center"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? (
//                     <span className="flex items-center">
//                       <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Saving...
//                     </span>
//                   ) : (
//                     <span>{editingId ? 'Update' : 'Save'}</span>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HomeDetails;




// components/parasole/home/homeDetail.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { useHomeDetailItem } from '@/hooks/parasole/home/use-homeDetail-item';
import { HomeDetailTable } from './homeDetail-table';
import { HomeDetailItemForm } from './homeDetail-item-form';
import { HeroDetail } from '@/types/parasole/home/homeDetail';

const HomeDetails: React.FC = () => {
  const {
    heroDetails,
    heroes,
    isLoading,
    error,
    debugInfo,
    formatImageUrl,
    fetchHeroDetails,
    fetchHeroes,
    addHeroDetail,
    updateHeroDetail,
    deleteHeroDetail,
    toggleHeroDetailStatus
  } = useHomeDetailItem();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<HeroDetail | undefined>(undefined);
  const [loadCount, setLoadCount] = useState<number>(0);

  // Fetch data on initial load and when loadCount changes
  useEffect(() => {
    fetchHeroDetails();
    fetchHeroes();
  }, [fetchHeroDetails, fetchHeroes, loadCount]);

  // Refresh data function
  const refreshData = (): void => {
    setLoadCount(prev => prev + 1);
  };

  // Modal handlers
  const openModal = (detail: HeroDetail | null = null): void => {
    setEditingItem(detail || undefined);
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setEditingItem(undefined);
  };

  // Form submission handler
  const handleSubmit = async (formData: FormData): Promise<boolean> => {
    if (editingItem) {
      return await updateHeroDetail(editingItem.id, formData);
    } else {
      return await addHeroDetail(formData);
    }
  };

  // Confirm delete
  const handleDelete = async (id: number): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteHeroDetail(id);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Home Details</h1>
        <div className="flex gap-2">
          <button
            onClick={refreshData}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Refresh Data
          </button>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Add New Detail
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}
      
      {debugInfo && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded mb-6">
          Debug Info: {debugInfo}
        </div>
      )}

      <HomeDetailTable
        items={heroDetails}
        onEdit={openModal}
        onDelete={handleDelete}
        onToggleStatus={toggleHeroDetailStatus}
        isLoading={isLoading}
        formatImageUrl={formatImageUrl}
      />

      <HomeDetailItemForm
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        initialData={editingItem}
        heroes={heroes}
        isLoading={isLoading}
        formatImageUrl={formatImageUrl}
      />
    </div>
  );
};

export default HomeDetails;