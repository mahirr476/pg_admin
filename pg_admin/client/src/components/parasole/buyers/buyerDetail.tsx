// "use client";

// import React, { useState, useEffect } from 'react';
// import Cookies from 'js-cookie';
// import axios from 'axios';
// import { CheckCircle, XCircle, Pencil, Trash2, Plus, Loader2, Building, ImageIcon } from 'lucide-react';

// // Define interfaces for our data types
// interface BuyerItem {
//   id: number;
//   title: string;
//   description: string;
//   image: string;
//   status: 'ACTIVE' | 'INACTIVE';
// }

// interface BuyerDetailItem {
//   id: number;
//   buyerId: number;
//   title: string;
//   slug: string;
//   index: number;
//   description: string;
//   image: string;
//   type: string;
//   year: string;
//   createdBy: string;
//   createdAt: string;
//   updatedBy: string | null;
//   updatedAt: string;
//   status: 'ACTIVE' | 'INACTIVE';
// }

// interface FormData {
//   index: string;
//   title: string;
//   description: string;
//   buyerId: string;
//   type: string;
//   year: string;
//   image: File | null;
// }

// const BuyerDetail: React.FC = () => {
//   const [data, setData] = useState<BuyerDetailItem[]>([]);
//   const [buyers, setBuyers] = useState<BuyerItem[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [selectedItem, setSelectedItem] = useState<BuyerDetailItem | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   // API base URL
//   const API_BASE_URL = 'http://localhost:7000';

//   // Form state
//   const [formData, setFormData] = useState<FormData>({
//     index: '',
//     title: '',
//     description: '',
//     buyerId: '',
//     type: '',
//     year: '',
//     image: null
//   });

//   const [previewImage, setPreviewImage] = useState<string>('');

//   // Fetch all buyer details
//   const fetchBuyerDetails = async (): Promise<void> => {
//     try {
//       const token = Cookies.get('token');
//       const response = await axios.get(`${API_BASE_URL}/api/v1/parasole/buyer-detail`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
      
//       // Handle both array and single object responses
//       if (Array.isArray(response.data.data)) {
//         setData(response.data.data);
//       } else if (response.data.data && typeof response.data.data === 'object') {
//         setData([response.data.data]);
//       } else {
//         setData([]);
//       }
      
//     } catch (error) {
//       console.error('Error fetching buyer details:', error);
//       setError('Failed to load buyer details. Please try again.');
//     }
//   };

//   // Fetch list of buyers for dropdown
//   const fetchBuyers = async (): Promise<void> => {
//     try {
//       const token = Cookies.get('token');
//       const response = await axios.get(`${API_BASE_URL}/api/v1/parasole/buyer`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
      
//       // Handle both array and single object responses
//       if (Array.isArray(response.data.data)) {
//         setBuyers(response.data.data);
//       } else if (response.data.data && typeof response.data.data === 'object') {
//         setBuyers([response.data.data]);
//       } else {
//         setBuyers([]);
//       }
      
//     } catch (error) {
//       console.error('Error fetching buyers:', error);
//       setError('Failed to load buyers. Please try again.');
//     }
//   };

//   useEffect(() => {
//     setIsLoading(true);
//     setError(null);
//     Promise.all([fetchBuyerDetails(), fetchBuyers()])
//       .finally(() => setIsLoading(false));
//   }, []);

//   // Handle input change
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };
  
//   // Handle image upload
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
//     if (e.target.files && e.target.files.length > 0) {
//       const file = e.target.files[0];
//       setFormData(prev => ({ ...prev, image: file }));
//       setPreviewImage(URL.createObjectURL(file));
//     }
//   };

//   // Open modal to add new or edit existing item
//   const openModal = (item: BuyerDetailItem | null = null): void => {
//     setError(null);
    
//     if (item) {
//       setSelectedItem(item);
//       setFormData({
//         index: item.index.toString(),
//         title: item.title,
//         description: item.description,
//         buyerId: item.buyerId.toString(),
//         type: item.type || '',
//         year: item.year || '',
//         image: null
//       });
      
//       // Set preview image if available
//       if (item.image) {
//         setPreviewImage(
//           item.image.startsWith('http')
//             ? item.image
//             : `${API_BASE_URL}/${item.image.replace(/^public\//, '')}`
//         );
//       } else {
//         setPreviewImage('');
//       }
      
//     } else {
//       setSelectedItem(null);
//       setFormData({
//         index: '',
//         title: '',
//         description: '',
//         buyerId: buyers.length > 0 ? buyers[0].id.toString() : '',
//         type: '',
//         year: new Date().getFullYear().toString(),
//         image: null
//       });
//       setPreviewImage('');
//     }
    
//     setIsModalOpen(true);
//   };

//   // Submit form (Create or Update)
//   const handleSubmit = async (e: React.FormEvent): Promise<void> => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const token = Cookies.get('token');
//       const formDataToSend = new FormData();
      
//       formDataToSend.append('index', formData.index);
//       formDataToSend.append('title', formData.title);
//       formDataToSend.append('description', formData.description);
//       formDataToSend.append('buyerId', formData.buyerId);
//       formDataToSend.append('type', formData.type);
//       formDataToSend.append('year', formData.year);
      
//       if (formData.image) {
//         formDataToSend.append('image', formData.image);
//       }
      
//       // Log what we're sending for debugging
//       console.log('Sending form data:', {
//         index: formData.index,
//         title: formData.title,
//         description: formData.description,
//         buyerId: formData.buyerId,
//         type: formData.type,
//         year: formData.year,
//         hasImage: !!formData.image
//       });

//       if (selectedItem) {
//         // Update
//         await axios.put(
//           `${API_BASE_URL}/api/v1/parasole/buyer-detail/${selectedItem.id}`,
//           formDataToSend,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               // Let axios set the Content-Type for FormData
//             }
//           }
//         );
//       } else {
//         // Create
//         await axios.post(
//           `${API_BASE_URL}/api/v1/parasole/buyer-detail`,
//           formDataToSend,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               // Let axios set the Content-Type for FormData
//             }
//           }
//         );
//       }
      
//       setIsModalOpen(false);
//       fetchBuyerDetails();
//     } catch (error) {
//       console.error('Error saving buyer detail:', error);
//       if (axios.isAxiosError(error)) {
//         setError(error.response?.data?.message || 'Failed to save data. Please check all fields.');
//       } else {
//         setError('An unexpected error occurred. Please try again.');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Delete item
//   const handleDelete = async (id: number): Promise<void> => {
//     if (!window.confirm('Are you sure you want to delete this buyer detail?')) return;
    
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const token = Cookies.get('token');
//       await axios.delete(`${API_BASE_URL}/api/v1/parasole/buyer-detail/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       fetchBuyerDetails();
//     } catch (error) {
//       console.error('Error deleting buyer detail:', error);
//       setError('Failed to delete the item. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Toggle status
//   const handleStatusToggle = async (item: BuyerDetailItem, newStatus: 'ACTIVE' | 'INACTIVE'): Promise<void> => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const token = Cookies.get('token');
//       await axios.put(
//         `${API_BASE_URL}/api/v1/parasole/buyer-detail/${item.id}`,
//         { status: newStatus },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
//       fetchBuyerDetails();
//     } catch (error) {
//       console.error('Error updating status:', error);
//       setError('Failed to update status. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Helper function to get title from buyerId
//   const getBuyerTitle = (id: number): string => {
//     const buyer = buyers.find(b => b.id === id);
//     return buyer ? buyer.title : 'N/A';
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//         <div className="mb-8 flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Buyer Detail Management</h1>
//             <p className="mt-1 text-sm text-gray-500">
//               Manage detailed buyer information and partnerships
//             </p>
//           </div>
//           <button
//             onClick={() => openModal()}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm flex items-center transition duration-150 ease-in-out"
//           >
//             <Plus className="h-5 w-5 mr-2" />
//             Add New Detail
//           </button>
//         </div>

//         {/* Error message */}
//         {error && (
//           <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-start">
//             <Trash2 className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
//             <div>{error}</div>
//           </div>
//         )}

//         {/* Card with Table */}
//         <div className="bg-white rounded-xl shadow-md overflow-hidden">
//           <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
//             <h2 className="text-lg font-medium text-gray-900">Buyer Details</h2>
//           </div>

//           {/* Table with horizontal scroll */}
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Index</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {isLoading ? (
//                   <tr>
//                     <td colSpan={9} className="px-6 py-10 text-center">
//                       <div className="flex justify-center items-center">
//                         <Loader2 className="h-6 w-6 text-blue-500 animate-spin mr-2" />
//                         <span className="text-gray-500">Loading data...</span>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : data.length === 0 ? (
//                   <tr>
//                     <td colSpan={9} className="px-6 py-10 text-center">
//                       <div className="text-gray-500">
//                         <Building className="h-12 w-12 mx-auto text-gray-400" />
//                         <p className="mt-2 text-sm">No buyer details available</p>
//                         <button
//                           onClick={() => openModal()}
//                           className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
//                         >
//                           <Plus className="h-4 w-4 mr-2" />
//                           Add your first buyer detail
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   data.map((item) => (
//                     <tr key={item.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {item.index}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {getBuyerTitle(item.buyerId)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {item.title}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-500">
//                         <div className="max-w-xs truncate">{item.description}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {item.type || '-'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {item.year || '-'}
//                       </td>
//                       <td className="px-6 py-4">
//                         {item.image ? (
//                           <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
//                             <img
//                               src={
//                                 item.image.startsWith('http')
//                                   ? item.image
//                                   : `${API_BASE_URL}/${item.image.replace(/^public\//, '')}`
//                               }
//                               alt={`${item.title}`}
//                               className="h-full w-full object-cover"
//                               onError={(e) => {
//                                 e.currentTarget.src = "/images/placeholder.jpg";
//                               }}
//                             />
//                           </div>
//                         ) : (
//                           <div className="h-16 w-16 rounded-lg flex items-center justify-center bg-gray-100 border border-gray-200">
//                             <ImageIcon className="h-6 w-6 text-gray-400" />
//                           </div>
//                         )}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="relative inline-block w-48">
//                           <select
//                             value={item.status}
//                             onChange={(e) => handleStatusToggle(item, e.target.value as 'ACTIVE' | 'INACTIVE')}
//                             className={`appearance-none w-full pl-10 pr-10 py-2 rounded-lg border text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                               item.status === 'ACTIVE'
//                                 ? 'bg-green-50 text-green-800 border-green-200'
//                                 : 'bg-red-50 text-red-800 border-red-200'
//                             }`}
//                           >
//                             <option value="ACTIVE" className="bg-white text-gray-900">Active</option>
//                             <option value="INACTIVE" className="bg-white text-gray-900">Inactive</option>
//                           </select>
//                           <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                             <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
//                               <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
//                             </svg>
//                           </div>
//                           <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm">
//                             {item.status === 'ACTIVE' ? (
//                               <CheckCircle className="h-5 w-5 text-green-500" />
//                             ) : (
//                               <XCircle className="h-5 w-5 text-red-500" />
//                             )}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <div className="flex space-x-2 justify-end">
//                           <button
//                             onClick={() => openModal(item)}
//                             className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-md transition-colors duration-200"
//                             title="Edit item"
//                           >
//                             <Pencil className="h-4 w-4" />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(item.id)}
//                             className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-md transition-colors duration-200"
//                             title="Delete item"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Modal - Create/Edit Form */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
//           <div className="my-8 bg-white rounded-xl shadow-xl w-full max-w-2xl">
//             <div className="sticky top-0 px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center z-10">
//               <h3 className="text-lg font-semibold text-gray-900">
//                 {selectedItem ? 'Edit Buyer Detail' : 'Create New Buyer Detail'}
//               </h3>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-gray-400 hover:text-gray-500 focus:outline-none"
//               >
//                 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//             <form onSubmit={handleSubmit}>
//               <div className="px-6 py-5 space-y-6 max-h-96 overflow-y-auto">
//                 {/* Form error message */}
//                 {error && (
//                   <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-start mb-4">
//                     <Trash2 className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
//                     <div>{error}</div>
//                   </div>
//                 )}
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="col-span-1">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Parent Buyer <span className="text-red-500">*</span>
//                     </label>
//                     <div className="relative">
//                       <select
//                         name="buyerId"
//                         value={formData.buyerId}
//                         onChange={handleInputChange}
//                         className="appearance-none w-full bg-white border border-gray-300 rounded-lg shadow-sm pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
//                         required
//                       >
//                         {buyers.length === 0 ? (
//                           <option value="">No buyers available</option>
//                         ) : (
//                           buyers.map((buyer) => (
//                             <option key={buyer.id} value={buyer.id}>
//                               {buyer.title}
//                             </option>
//                           ))
//                         )}
//                       </select>
//                       <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                         <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
//                           <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
//                         </svg>
//                       </div>
//                     </div>
//                     <p className="mt-1 text-xs text-gray-500">Select the parent buyer</p>
//                   </div>
                  
//                   <div className="col-span-1">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Index <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       name="index"
//                       value={formData.index}
//                       onChange={handleInputChange}
//                       className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
//                       placeholder="Enter display order (e.g., 1, 2, 3)"
//                       required
//                     />
//                     <p className="mt-1 text-xs text-gray-500">Sets the display order in the list</p>
//                   </div>

//                   <div className="col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Title <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="title"
//                       value={formData.title}
//                       onChange={handleInputChange}
//                       className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
//                       placeholder="Enter detail title (e.g., Walmart)"
//                       required
//                     />
//                   </div>
                  
//                   <div className="col-span-1">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Type <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="type"
//                       value={formData.type}
//                       onChange={handleInputChange}
//                       className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
//                       placeholder="Enter buyer type (e.g., Mass Market Retail)"
//                       required
//                     />
//                   </div>
                  
//                   <div className="col-span-1">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Year <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="year"
//                       value={formData.year}
//                       onChange={handleInputChange}
//                       className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
//                       placeholder="Enter year (e.g., 2020)"
//                       required
//                     />
//                   </div>
                
//                   <div className="col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Description <span className="text-red-500">*</span>
//                     </label>
//                     <textarea
//                       name="description"
//                       value={formData.description}
//                       onChange={handleInputChange}
//                       rows={4}
//                       className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
//                       placeholder="Enter detailed description"
//                       required
//                     ></textarea>
//                   </div>
                  
//                   <div className="col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Image {!selectedItem && <span className="text-red-500">*</span>}
//                     </label>
//                     <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg px-6 py-8 flex justify-center">
//                       <div className="space-y-1 text-center">
//                         <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
//                         <div className="flex text-sm text-gray-600">
//                           <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
//                             <span>Upload file</span>
//                             <input
//                               id="file-upload"
//                               name="file-upload"
//                               type="file"
//                               accept="image/*"
//                               onChange={handleImageChange}
//                               className="sr-only"
//                               required={!selectedItem && !previewImage}
//                             />
//                           </label>
//                           <p className="pl-1">or drag and drop</p>
//                         </div>
//                         <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
//                       </div>
//                     </div>
                    
//                     {previewImage && (
//                       <div className="mt-4">
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Image Preview
//                         </label>
//                         <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100 w-32 h-32">
//                           <img
//                             src={previewImage}
//                             alt="Preview"
//                             className="object-cover rounded-md"
//                           />
//                         </div>
//                         {selectedItem && !formData.image && (
//                           <p className="mt-2 text-xs text-gray-500">
//                             Using existing image. Upload a new one to replace it.
//                           </p>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div className="sticky bottom-0 px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? (
//                     <span className="flex items-center">
//                       <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
//                       Saving...
//                     </span>
//                   ) : (
//                     selectedItem ? 'Update Detail' : 'Create Detail'
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

// export default BuyerDetail;






// "use client";

// import React from 'react';
// import { CheckCircle, XCircle, Pencil, Trash2, Plus, Loader2, Building, ImageIcon } from 'lucide-react';
// import useBuyerDetail from '@/hooks/parasole/buyer/useBuyerDetail';
// import { BuyerDetailItem } from '@/types/parasole/buyer/buyerDetail';

// const BuyerDetail: React.FC = () => {
//   const {
//     data,
//     buyers,
//     isModalOpen,
//     isLoading,
//     selectedItem,
//     error,
//     formData,
//     previewImage,
//     setIsModalOpen,
//     handleInputChange,
//     handleImageChange,
//     openModal,
//     handleSubmit,
//     handleDelete,
//     handleStatusToggle,
//     getBuyerTitle,
//     API_BASE_URL
//   } = useBuyerDetail();

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//         <div className="mb-8 flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Buyer Detail Management</h1>
//             <p className="mt-1 text-sm text-gray-500">
//               Manage detailed buyer information and partnerships
//             </p>
//           </div>
//           <button
//             onClick={() => openModal()}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm flex items-center transition duration-150 ease-in-out"
//           >
//             <Plus className="h-5 w-5 mr-2" />
//             Add New Detail
//           </button>
//         </div>

//         {/* Error message */}
//         {error && (
//           <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-start">
//             <Trash2 className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
//             <div>{error}</div>
//           </div>
//         )}

//         {/* Card with Table */}
//         <div className="bg-white rounded-xl shadow-md overflow-hidden">
//           <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
//             <h2 className="text-lg font-medium text-gray-900">Buyer Details</h2>
//           </div>

//           {/* Table with horizontal scroll */}
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Index</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {isLoading ? (
//                   <tr>
//                     <td colSpan={9} className="px-6 py-10 text-center">
//                       <div className="flex justify-center items-center">
//                         <Loader2 className="h-6 w-6 text-blue-500 animate-spin mr-2" />
//                         <span className="text-gray-500">Loading data...</span>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : data.length === 0 ? (
//                   <tr>
//                     <td colSpan={9} className="px-6 py-10 text-center">
//                       <div className="text-gray-500">
//                         <Building className="h-12 w-12 mx-auto text-gray-400" />
//                         <p className="mt-2 text-sm">No buyer details available</p>
//                         <button
//                           onClick={() => openModal()}
//                           className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
//                         >
//                           <Plus className="h-4 w-4 mr-2" />
//                           Add your first buyer detail
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   data.map((item: BuyerDetailItem) => (
//                     <tr key={item.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {item.index}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {getBuyerTitle(item.buyerId)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {item.title}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-500">
//                         <div className="max-w-xs truncate">{item.description}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {item.type || '-'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {item.year || '-'}
//                       </td>
//                       <td className="px-6 py-4">
//                         {item.image ? (
//                           <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
//                             <img
//                               src={
//                                 item.image.startsWith('http')
//                                   ? item.image
//                                   : `${API_BASE_URL}/${item.image.replace(/^public\//, '')}`
//                               }
//                               alt={`${item.title}`}
//                               className="h-full w-full object-cover"
//                               onError={(e) => {
//                                 e.currentTarget.src = "/images/placeholder.jpg";
//                               }}
//                             />
//                           </div>
//                         ) : (
//                           <div className="h-16 w-16 rounded-lg flex items-center justify-center bg-gray-100 border border-gray-200">
//                             <ImageIcon className="h-6 w-6 text-gray-400" />
//                           </div>
//                         )}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="relative inline-block w-48">
//                           <select
//                             value={item.status}
//                             onChange={(e) => handleStatusToggle(item, e.target.value as 'ACTIVE' | 'INACTIVE')}
//                             className={`appearance-none w-full pl-10 pr-10 py-2 rounded-lg border text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                               item.status === 'ACTIVE'
//                                 ? 'bg-green-50 text-green-800 border-green-200'
//                                 : 'bg-red-50 text-red-800 border-red-200'
//                             }`}
//                           >
//                             <option value="ACTIVE" className="bg-white text-gray-900">Active</option>
//                             <option value="INACTIVE" className="bg-white text-gray-900">Inactive</option>
//                           </select>
//                           <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                             <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
//                               <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
//                             </svg>
//                           </div>
//                           <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm">
//                             {item.status === 'ACTIVE' ? (
//                               <CheckCircle className="h-5 w-5 text-green-500" />
//                             ) : (
//                               <XCircle className="h-5 w-5 text-red-500" />
//                             )}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <div className="flex space-x-2 justify-end">
//                           <button
//                             onClick={() => openModal(item)}
//                             className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-md transition-colors duration-200"
//                             title="Edit item"
//                           >
//                             <Pencil className="h-4 w-4" />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(item.id)}
//                             className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-md transition-colors duration-200"
//                             title="Delete item"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Modal - Create/Edit Form */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
//           <div className="my-8 bg-white rounded-xl shadow-xl w-full max-w-2xl">
//             <div className="sticky top-0 px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center z-10">
//               <h3 className="text-lg font-semibold text-gray-900">
//                 {selectedItem ? 'Edit Buyer Detail' : 'Create New Buyer Detail'}
//               </h3>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-gray-400 hover:text-gray-500 focus:outline-none"
//               >
//                 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//             <form onSubmit={handleSubmit}>
//               <div className="px-6 py-5 space-y-6 max-h-96 overflow-y-auto">
//                 {/* Form error message */}
//                 {error && (
//                   <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-start mb-4">
//                     <Trash2 className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
//                     <div>{error}</div>
//                   </div>
//                 )}
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="col-span-1">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Parent Buyer <span className="text-red-500">*</span>
//                     </label>
//                     <div className="relative">
//                       <select
//                         name="buyerId"
//                         value={formData.buyerId}
//                         onChange={handleInputChange}
//                         className="appearance-none w-full bg-white border border-gray-300 rounded-lg shadow-sm pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
//                         required
//                       >
//                         {buyers.length === 0 ? (
//                           <option value="">No buyers available</option>
//                         ) : (
//                           buyers.map((buyer) => (
//                             <option key={buyer.id} value={buyer.id}>
//                               {buyer.title}
//                             </option>
//                           ))
//                         )}
//                       </select>
//                       <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                         <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
//                           <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
//                         </svg>
//                       </div>
//                     </div>
//                     <p className="mt-1 text-xs text-gray-500">Select the parent buyer</p>
//                   </div>
                  
//                   <div className="col-span-1">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Index <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       name="index"
//                       value={formData.index}
//                       onChange={handleInputChange}
//                       className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
//                       placeholder="Enter display order (e.g., 1, 2, 3)"
//                       required
//                     />
//                     <p className="mt-1 text-xs text-gray-500">Sets the display order in the list</p>
//                   </div>

//                   <div className="col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Title <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="title"
//                       value={formData.title}
//                       onChange={handleInputChange}
//                       className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
//                       placeholder="Enter detail title (e.g., Walmart)"
//                       required
//                     />
//                   </div>
                  
//                   <div className="col-span-1">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Type <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="type"
//                       value={formData.type}
//                       onChange={handleInputChange}
//                       className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
//                       placeholder="Enter buyer type (e.g., Mass Market Retail)"
//                       required
//                     />
//                   </div>
                  
//                   <div className="col-span-1">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Year <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="year"
//                       value={formData.year}
//                       onChange={handleInputChange}
//                       className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
//                       placeholder="Enter year (e.g., 2020)"
//                       required
//                     />
//                   </div>
                
//                   <div className="col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Description <span className="text-red-500">*</span>
//                     </label>
//                     <textarea
//                       name="description"
//                       value={formData.description}
//                       onChange={handleInputChange}
//                       rows={4}
//                       className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
//                       placeholder="Enter detailed description"
//                       required
//                     ></textarea>
//                   </div>
                  
//                   <div className="col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Image {!selectedItem && <span className="text-red-500">*</span>}
//                     </label>
//                     <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg px-6 py-8 flex justify-center">
//                       <div className="space-y-1 text-center">
//                         <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
//                         <div className="flex text-sm text-gray-600">
//                           <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
//                             <span>Upload file</span>
//                             <input
//                               id="file-upload"
//                               name="file-upload"
//                               type="file"
//                               accept="image/*"
//                               onChange={handleImageChange}
//                               className="sr-only"
//                               required={!selectedItem && !previewImage}
//                             />
//                           </label>
//                           <p className="pl-1">or drag and drop</p>
//                         </div>
//                         <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
//                       </div>
//                     </div>
                    
//                     {previewImage && (
//                       <div className="mt-4">
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Image Preview
//                         </label>
//                         <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100 w-32 h-32">
//                           <img
//                             src={previewImage}
//                             alt="Preview"
//                             className="object-cover rounded-md"
//                           />
//                         </div>
//                         {selectedItem && !formData.image && (
//                           <p className="mt-2 text-xs text-gray-500">
//                             Using existing image. Upload a new one to replace it.
//                           </p>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div className="sticky bottom-0 px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? (
//                     <span className="flex items-center">
//                       <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
//                       Saving...
//                     </span>
//                   ) : (
//                     selectedItem ? 'Update Detail' : 'Create Detail'
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

// export default BuyerDetail;



"use client";

import React from 'react';
import { CheckCircle, XCircle, Pencil, Trash2, Plus, Loader2, Building, ImageIcon } from 'lucide-react';
import useBuyerDetail from '@/hooks/parasole/buyer/useBuyerDetail';
import { BuyerDetailItem } from '@/types/parasole/buyer/buyerDetail';

const BuyerDetail: React.FC = () => {
  const {
    data,
    buyers,
    isModalOpen,
    isLoading,
    selectedItem,
    error,
    formData,
    previewImage,
    setIsModalOpen,
    handleInputChange,
    handleImageChange,
    openModal,
    handleSubmit,
    handleDelete,
    handleStatusToggle,
    getBuyerTitle,
    API_BASE_URL
  } = useBuyerDetail();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Buyer Detail Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage detailed buyer information and partnerships
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm flex items-center transition duration-150 ease-in-out"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Detail
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-start">
            <Trash2 className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {/* Card with Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Buyer Details</h2>
          </div>

          {/* Table with horizontal scroll */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Index</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-10 text-center">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 text-blue-500 animate-spin mr-2" />
                        <span className="text-gray-500">Loading data...</span>
                      </div>
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-10 text-center">
                      <div className="text-gray-500">
                        <Building className="h-12 w-12 mx-auto text-gray-400" />
                        <p className="mt-2 text-sm">No buyer details available</p>
                        <button
                          onClick={() => openModal()}
                          className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add your first buyer detail
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.map((item: BuyerDetailItem) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.index}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getBuyerTitle(item.buyerId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="max-w-xs truncate">{item.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.type || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.year || '-'}
                      </td>
                      <td className="px-6 py-4">
                        {item.image ? (
                          <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                            <img
                              src={
                                item.image.startsWith('http')
                                  ? item.image
                                  : `${API_BASE_URL}/${item.image.replace(/^public\//, '')}`
                              }
                              alt={`${item.title}`}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/images/placeholder.jpg";
                              }}
                            />
                          </div>
                        ) : (
                          <div className="h-16 w-16 rounded-lg flex items-center justify-center bg-gray-100 border border-gray-200">
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative inline-block w-48">
                          <select
                            value={item.status}
                            onChange={(e) => handleStatusToggle(item, e.target.value as 'ACTIVE' | 'INACTIVE')}
                            className={`appearance-none w-full pl-10 pr-10 py-2 rounded-lg border text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              item.status === 'ACTIVE'
                                ? 'bg-green-50 text-green-800 border-green-200'
                                : 'bg-red-50 text-red-800 border-red-200'
                            }`}
                          >
                            <option value="ACTIVE" className="bg-white text-gray-900">Active</option>
                            <option value="INACTIVE" className="bg-white text-gray-900">Inactive</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          </div>
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm">
                            {item.status === 'ACTIVE' ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2 justify-end">
                          <button
                            onClick={() => openModal(item)}
                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-md transition-colors duration-200"
                            title="Edit item"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-md transition-colors duration-200"
                            title="Delete item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal - Create/Edit Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="my-8 bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="sticky top-0 px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center z-10">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedItem ? 'Edit Buyer Detail' : 'Create New Buyer Detail'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-5 space-y-6 max-h-96 overflow-y-auto">
                {/* Form error message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-start mb-4">
                    <Trash2 className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <div>{error}</div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parent Buyer <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="buyerId"
                        value={formData.buyerId}
                        onChange={handleInputChange}
                        className="appearance-none w-full bg-white border border-gray-300 rounded-lg shadow-sm pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        required
                      >
                        {buyers.length === 0 ? (
                          <option value="">No buyers available</option>
                        ) : (
                          buyers.map((buyer) => (
                            <option key={buyer.id} value={buyer.id}>
                              {buyer.title}
                            </option>
                          ))
                        )}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Select the parent buyer</p>
                  </div>
                  
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Index <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="index"
                      value={formData.index}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="Enter display order (e.g., 1, 2, 3)"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">Sets the display order in the list</p>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="Enter detail title (e.g., Walmart)"
                      required
                    />
                  </div>
                  
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="Enter buyer type (e.g., Mass Market Retail)"
                      required
                    />
                  </div>
                  
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="Enter year (e.g., 2020)"
                      required
                    />
                  </div>
                
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="Enter detailed description"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image {!selectedItem && <span className="text-red-500">*</span>}
                    </label>
                    <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg px-6 py-8 flex justify-center">
                      <div className="space-y-1 text-center">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                            <span>Upload file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="sr-only"
                              required={!selectedItem && !previewImage}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                      </div>
                    </div>
                    
                    {previewImage && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Image Preview
                        </label>
                        <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100 w-32 h-32">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="object-cover rounded-md"
                          />
                        </div>
                        {selectedItem && !formData.image && (
                          <p className="mt-2 text-xs text-gray-500">
                            Using existing image. Upload a new one to replace it.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Saving...
                    </span>
                  ) : (
                    selectedItem ? 'Update Detail' : 'Create Detail'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerDetail;