// "use client";

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { Plus, Edit, Trash2, AlertTriangle, ImageIcon, Loader2, CheckCircle, XCircle } from "lucide-react";

// // === Types ===
// interface BuyerItem {
//   id: number;
//   title: string;
//   description: string;
//   slug: string;
//   image: string;
//   index: number;
//   createdBy: string;
//   createdAt: string;
//   updatedBy: string | null;
//   updatedAt: string;
//   status: "ACTIVE" | "INACTIVE";
// }

// // === Component ===
// const BuyerPage: React.FC = () => {
//   const [buyerData, setBuyerData] = useState<BuyerItem[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [selectedItem, setSelectedItem] = useState<BuyerItem | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const [formData, setFormData] = useState<{
//     index: number;
//     title: string;
//     description: string;
//     status: "ACTIVE" | "INACTIVE";
//     image: File | null;
//   }>({
//     index: 0,
//     title: "",
//     description: "",
//     status: "ACTIVE",
//     image: null,
//   });

//   const [previewImage, setPreviewImage] = useState<string>("");

//   // API base URL
//   const API_BASE_URL = 'http://localhost:7000';

//   // === Fetch Buyer Data ===
//   const fetchBuyerData = async () => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const token = Cookies.get("token");
//       const response = await axios.get(
//         `${API_BASE_URL}/api/v1/parasole/buyer`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
      
//       console.log("API Response:", response.data);
      
//       // Handle both array and single object responses
//       if (Array.isArray(response.data.data)) {
//         setBuyerData(response.data.data);
//       } else if (response.data.data && typeof response.data.data === 'object') {
//         // If it's a single object, wrap it in an array
//         setBuyerData([response.data.data]);
//       } else {
//         setBuyerData([]);
//       }
      
//     } catch (error) {
//       console.error("Error fetching buyer data:", error);
//       setError("Failed to load buyer data. Please try again later.");
//       setBuyerData([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBuyerData();
//   }, []);

//   // === Handle Add / Edit Item ===
//   const handleAddNew = () => {
//     setFormData({
//       index: 0,
//       title: "",
//       description: "",
//       status: "ACTIVE",
//       image: null,
//     });
//     setPreviewImage("");
//     setSelectedItem(null);
//     setError(null);
//     setIsModalOpen(true);
//   };

//   const handleEdit = (item: BuyerItem) => {
//     setSelectedItem(item);
//     setFormData({
//       index: item.index,
//       title: item.title,
//       description: item.description,
//       status: item.status,
//       image: null,
//     });
    
//     // Set preview image if available
//     if (item.image) {
//       setPreviewImage(
//         item.image.startsWith("http")
//           ? item.image
//           : `${API_BASE_URL}/${item.image.replace(/^public\//, "")}`
//       );
//     } else {
//       setPreviewImage("");
//     }
    
//     setError(null);
//     setIsModalOpen(true);
//   };

//   // === Form Input Change ===
//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === "index" ? parseInt(value) || 0 : value,
//     }));
//   };

//   // === Image Upload Change ===
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const file = e.target.files[0];
//       setFormData((prev) => ({ ...prev, image: file }));
//       setPreviewImage(URL.createObjectURL(file));
//     }
//   };

//   // === Submit Form (Create or Update) ===
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const token = Cookies.get("token");
//       const formDataToSend = new FormData();

//       // Add required fields
//       formDataToSend.append("index", String(formData.index));
//       formDataToSend.append("title", formData.title);
//       formDataToSend.append("description", formData.description);
//       formDataToSend.append("status", formData.status);
      
//       // Add the image if it exists
//       if (formData.image) {
//         formDataToSend.append("image", formData.image);
//       }

//       // Log what we're sending for debugging
//       console.log("Sending data:", {
//         index: formData.index,
//         title: formData.title,
//         description: formData.description,
//         status: formData.status,
//         hasImage: !!formData.image
//       });

//       let url = `${API_BASE_URL}/api/v1/parasole/buyer`;
//       let method = 'post';
      
//       if (selectedItem) {
//         // Update existing item
//         url = `${API_BASE_URL}/api/v1/parasole/buyer/${selectedItem.id}`;
//         method = 'put';
//       }
      
//       // Explicitly log the entire request
//       console.log(`Making ${method.toUpperCase()} request to ${url}`);
      
//       // Try without setting Content-Type and let the browser set it with boundary
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           // Let axios set the correct Content-Type with boundary for FormData
//         },
//       };
      
//       let response;
//       if (method === 'put') {
//         response = await axios.put(url, formDataToSend, config);
//       } else {
//         response = await axios.post(url, formDataToSend, config);
//       }

//       console.log("API Response:", response.data);
//       closeModal();
//       fetchBuyerData();
      
//     } catch (error) {
//       console.error("Error object:", error);
      
//       if (axios.isAxiosError(error)) {
//         // Log more details about the error
//         console.error("API Error Response:", error.response?.data || "No response data");
//         console.error("Status Code:", error.response?.status || "No status code");
        
//         // Provide a more informative error message
//         let errorMessage = "Failed to save buyer data";
        
//         if (error.response?.status === 400) {
//           errorMessage = "Invalid data. Please check all required fields.";
//         } else if (error.response?.status === 401) {
//           errorMessage = "Authentication error. Please log in again.";
//         } else if (error.response?.status === 403) {
//           errorMessage = "You don't have permission to perform this action.";
//         } else if (error.response?.status === 404) {
//           errorMessage = "The requested resource was not found.";
//         } else if (error.response?.status === 500) {
//           errorMessage = "Server error. Please try again later.";
//         }
        
//         if (error.response?.data?.message) {
//           errorMessage = error.response.data.message;
//         }
        
//         setError(errorMessage);
        
//         // Log request details for debugging
//         if (error.config) {
//           console.log("Request URL:", error.config.url);
//           console.log("Request Method:", error.config.method);
//           console.log("Request Headers:", error.config.headers);
//           if (error.config.data) {
//             try {
//               // For FormData, we can't easily log the contents
//               console.log("Request has data but can't be directly logged for FormData");
//             } catch (e) {
//               console.log("Error parsing request data:", e);
//             }
//           }
//         }
//       } else {
//         console.error("Unknown error:", error);
//         setError("An unexpected error occurred. Please try again.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // === Delete Item ===
//   const handleDelete = async (id: number) => {
//     if (!window.confirm("Are you sure you want to delete this buyer item?")) return;

//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const token = Cookies.get("token");
//       await axios.delete(
//         `${API_BASE_URL}/api/v1/parasole/buyer/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       fetchBuyerData();
//     } catch (error) {
//       console.error("Error deleting buyer item:", error);
//       setError("Failed to delete the item. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // === Toggle Status via Dropdown ===
//   const handleStatusToggle = async (item: BuyerItem, newStatus: "ACTIVE" | "INACTIVE") => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const token = Cookies.get("token");
//       await axios.put(
//         `${API_BASE_URL}/api/v1/parasole/buyer/${item.id}`,
//         { status: newStatus },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       fetchBuyerData();
//     } catch (error) {
//       console.error("Error updating status:", error);
//       setError("Failed to update status. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // === Close Modal ===
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setFormData({
//       index: 0,
//       title: "",
//       description: "",
//       status: "ACTIVE",
//       image: null,
//     });
//     setPreviewImage("");
//     setSelectedItem(null);
//     setError(null);
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//         {/* Header */}
//         <div className="mb-8 flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Buyer Management</h1>
//             <p className="mt-1 text-sm text-gray-500">
//               Manage your buyers and partnerships
//             </p>
//           </div>
//           <button
//             onClick={handleAddNew}
//             disabled={isLoading}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm flex items-center transition duration-150 ease-in-out"
//           >
//             <Plus className="mr-2 h-5 w-5" />
//             Add Buyer
//           </button>
//         </div>

//         {/* Error message */}
//         {error && (
//           <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-start">
//             <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
//             <div>{error}</div>
//           </div>
//         )}

//         {/* Card with Table */}
//         <div className="bg-white rounded-xl shadow-md overflow-hidden">
//           <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
//             <h2 className="text-lg font-medium text-gray-900">Buyer Items</h2>
//           </div>
          
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Index</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {isLoading ? (
//                   <tr>
//                     <td colSpan={7} className="px-6 py-10 text-center">
//                       <div className="flex justify-center items-center">
//                         <Loader2 className="h-8 w-8 text-blue-500 animate-spin mr-2" />
//                         <span className="text-gray-500">Loading buyer items...</span>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : buyerData.length === 0 ? (
//                   <tr>
//                     <td colSpan={7} className="px-6 py-10 text-center">
//                       <div className="text-gray-500">
//                         <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
//                         <p className="mt-2 text-sm">No buyer items found</p>
//                         <button
//                           onClick={handleAddNew}
//                           className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
//                         >
//                           <Plus className="h-4 w-4 mr-2" />
//                           Add your first buyer
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   buyerData.map((item) => (
//                     <tr key={item.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {item.id}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {item.title}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-500">
//                         <div className="max-w-xs truncate">{item.description}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {item.index}
//                       </td>
//                       <td className="px-6 py-4">
//                         {item.image ? (
//                           <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
//                             <img
//                               src={
//                                 item.image.startsWith("http")
//                                   ? item.image
//                                   : `${API_BASE_URL}/${item.image.replace(/^public\//, "")}`
//                               }
//                               alt="Buyer"
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
//                             onChange={(e) =>
//                               handleStatusToggle(
//                                 item,
//                                 e.target.value as "ACTIVE" | "INACTIVE"
//                               )
//                             }
//                             className={`appearance-none w-full pl-10 pr-10 py-2 rounded-lg border text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                               item.status === "ACTIVE"
//                                 ? "bg-green-50 text-green-800 border-green-200"
//                                 : "bg-red-50 text-red-800 border-red-200"
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
//                             {item.status === "ACTIVE" ? (
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
//                             onClick={() => handleEdit(item)}
//                             className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-md transition-colors duration-200"
//                             title="Edit item"
//                           >
//                             <Edit className="h-4 w-4" />
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
//                 {selectedItem ? "Edit Buyer" : "Add New Buyer"}
//               </h3>
//               <button
//                 onClick={closeModal}
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
//                     <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
//                     <div>{error}</div>
//                   </div>
//                 )}
                
//                 <div className="grid grid-cols-1 gap-6">
//                   <div className="col-span-1">
//                     <label htmlFor="index" className="block text-sm font-medium text-gray-700 mb-1">
//                       Index <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       id="index"
//                       name="index"
//                       value={formData.index}
//                       onChange={handleInputChange}
//                       className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
//                       placeholder="Enter display order (e.g., 1, 2, 3)"
//                       required
//                     />
//                     <p className="mt-1 text-xs text-gray-500">Sets the display order in the list</p>
//                   </div>
                  
//                   <div className="col-span-1">
//                     <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
//                       Title <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       id="title"
//                       name="title"
//                       value={formData.title}
//                       onChange={handleInputChange}
//                       className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
//                       placeholder="Enter title"
//                       required
//                     />
//                   </div>
                  
//                   <div className="col-span-1">
//                     <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
//                       Description <span className="text-red-500">*</span>
//                     </label>
//                     <textarea
//                       id="description"
//                       name="description"
//                       value={formData.description}
//                       onChange={handleInputChange}
//                       rows={4}
//                       className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
//                       placeholder="Enter detailed description"
//                       required
//                     ></textarea>
//                   </div>
                  
//                   <div className="col-span-1">
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
//                               required={!selectedItem}
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
                  
//                   <div className="col-span-1">
//                     <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
//                       Status <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       id="status"
//                       name="status"
//                       value={formData.status}
//                       onChange={handleInputChange}
//                       className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
//                       required
//                     >
//                       <option value="ACTIVE">Active</option>
//                       <option value="INACTIVE">Inactive</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="sticky bottom-0 px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
//                 <button
//                   type="button"
//                   onClick={closeModal}
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
//                     selectedItem ? 'Update Buyer' : 'Create Buyer'
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

// export default BuyerPage;



// "use client";

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { Plus, Edit, Trash2, AlertTriangle, ImageIcon } from "lucide-react";

// // === Types ===
// interface OperationItem {
//   id: number;
//   title: string;
//   description: string;
//   index: number;
//   images: string[];
//   status: "ACTIVE" | "INACTIVE";
// }

// // === Component ===
// const BuyerPage: React.FC = () => {
//   const [operationData, setOperationData] = useState<OperationItem[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [selectedItem, setSelectedItem] = useState<OperationItem | null>(null);

//   const [formData, setFormData] = useState<Omit<OperationItem, "id" | "images"> & {
//     images: File[];
//   }>({
//     index: 0,
//     title: "",
//     description: "",
//     status: "ACTIVE",
//     images: [],
//   });

//   const [previewImages, setPreviewImages] = useState<string[]>([]);

//   // === Fetch Operation Data ===
//   const fetchOperationData = async () => {
//     setIsLoading(true);
//     try {
//       const token = Cookies.get("token");
//       const response = await axios.get(
//         "http://localhost:7000/api/v1/parasole/buyer",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setOperationData(response.data.data || []);
//     } catch (error) {
//       console.error("Error fetching operation data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOperationData();
//   }, []);

//   // === Handle Add / Edit Item ===
//   const handleAddNew = () => {
//     setFormData({
//       index: 0,
//       title: "",
//       description: "",
//       status: "ACTIVE",
//       images: [],
//     });
//     setPreviewImages([]);
//     setSelectedItem(null);
//     setIsModalOpen(true);
//   };

//   const handleEdit = (item: OperationItem) => {
//     setSelectedItem(item);
//     setFormData({
//       index: item.index,
//       title: item.title,
//       description: item.description,
//       status: item.status,
//       images: [],
//     });
//     setPreviewImages(
//       item.images.map((img) =>
//         img.startsWith("http")
//           ? img
//           : `http://localhost:7000/${img.replace(/^public\//, "")}`
//       )
//     );
//     setIsModalOpen(true);
//   };

//   // === Form Input Change ===
//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === "index" ? parseInt(value) || 0 : value,
//     }));
//   };

//   // === Image Upload Change ===
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
//     setFormData((prev) => ({ ...prev, images: files }));

//     const previews = files.map((file) => URL.createObjectURL(file));
//     setPreviewImages(previews);
//   };

//   // === Submit Form (Create or Update) ===
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     const token = Cookies.get("token");
//     const formDataToSend = new FormData();

//     formDataToSend.append("index", String(formData.index));
//     formDataToSend.append("title", formData.title);
//     formDataToSend.append("description", formData.description);
//     formDataToSend.append("status", formData.status);

//     if (formData.images.length > 0) {
//       formData.images.forEach((image) => {
//         formDataToSend.append("images", image);
//       });
//     }

//     try {
//       if (selectedItem) {
//         // Update existing item
//         await axios.put(
//           `http://localhost:7000/api/v1/parasole/buyer/${selectedItem.id}`,
//           formDataToSend,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );
//       } else {
//         // Create new item
//         await axios.post(
//           "http://localhost:7000/api/v1/parasole/buyer",
//           formDataToSend,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );
//       }
//       closeModal();
//       fetchOperationData();
//     } catch (error) {
//       console.error("Error saving operation data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // === Delete Item ===
//   const handleDelete = async (id: number) => {
//     if (!window.confirm("Are you sure you want to delete this operation item?")) return;

//     setIsLoading(true);
//     try {
//       const token = Cookies.get("token");
//       await axios.delete(
//         `http://localhost:7000/api/v1/parasole/buyer/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       fetchOperationData();
//     } catch (error) {
//       console.error("Error deleting operation item:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // === Toggle Status via Dropdown ===
//   const handleStatusToggle = async (item: OperationItem, newStatus: "ACTIVE" | "INACTIVE") => {
//     setIsLoading(true);
//     try {
//       const token = Cookies.get("token");
//       await axios.put(
//         `http://localhost:7000/api/v1/parasole/buyer/${item.id}`,
//         { status: newStatus },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       fetchOperationData(); // Refresh data after update
//     } catch (error) {
//       console.error("Error updating status:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // === Close Modal ===
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setFormData({
//       index: 0,
//       title: "",
//       description: "",
//       status: "ACTIVE",
//       images: [],
//     });
//     setPreviewImages([]);
//     setSelectedItem(null);
//   };

//   return (
//     <div className="container mx-auto p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Operation Management</h1>
//         <button
//           onClick={handleAddNew}
//           disabled={isLoading}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm flex items-center"
//         >
//           <Plus className="mr-2 h-4 w-4" />
//           Add Operation
//         </button>
//       </div>

//       {/* Table */}
//       <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   ID
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Title
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Description
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Index
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Image
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {isLoading ? (
//                 <tr>
//                   <td colSpan={7} className="text-center py-16">
//                     <div className="animate-spin h-8 w-8 mx-auto mb-2 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
//                     <p>Loading operation items...</p>
//                   </td>
//                 </tr>
//               ) : operationData.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="text-center text-gray-500 py-16">
//                     <div className="flex flex-col items-center">
//                       <ImageIcon className="h-16 w-16 text-gray-300" />
//                       <p className="text-sm font-medium mt-2">No operation items found</p>
//                       <p className="text-xs text-gray-400">Add one to get started</p>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 operationData.map((item) => (
//                   <tr key={item.id}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {item.id}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {item.title}
//                     </td>
//                     <td className="px-6 py-4 max-w-xs truncate text-sm text-gray-500">
//                       {item.description}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {item.index}
//                     </td>
//                     <td className="px-6 py-4">
//                       {item.images && item.images.length > 0 && (
//                         <img
//                           src={
//                             item.images[0].startsWith("http")
//                               ? item.images[0]
//                               : `http://localhost:7000/${item.images[0].replace(/^public\//, "")}`
//                           }
//                           alt="Operation"
//                           className="w-16 h-16 object-cover rounded-md"
//                           onError={(e) => {
//                             e.currentTarget.src = "/images/placeholder.jpg";
//                           }}
//                         />
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <select
//                         value={formData.status}
//                         onChange={(e) =>
//                           handleStatusToggle(
//                             item,
//                             e.target.value as "ACTIVE" | "INACTIVE"
//                           )
//                         }
//                         className={`block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${
//                           item.status === "ACTIVE"
//                             ? "bg-green-50 text-green-800"
//                             : "bg-red-50 text-red-800"
//                         }`}
//                       >
//                         <option value="ACTIVE" className="bg-white text-green-800">
//                           Active
//                         </option>
//                         <option value="INACTIVE" className="bg-white text-red-800">
//                           Inactive
//                         </option>
//                       </select>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
//                       <button
//                         onClick={() => handleEdit(item)}
//                         className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-md"
//                       >
//                         <Edit className="h-4 w-4" />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(item.id)}
//                         className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-md"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
//             <div className="px-6 py-4 border-b border-gray-200">
//               <h3 className="text-lg font-medium text-gray-900">
//                 {selectedItem ? "Edit Operation" : "Add New Operation"}
//               </h3>
//             </div>
//             <form onSubmit={handleSubmit}>
//               <div className="px-6 py-4 space-y-4">
//                 <div>
//                   <label htmlFor="index" className="block text-sm font-medium text-gray-700">
//                     Index
//                   </label>
//                   <input
//                     type="number"
//                     id="index"
//                     name="index"
//                     value={formData.index}
//                     onChange={handleInputChange}
//                     placeholder="Enter display order index"
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="title" className="block text-sm font-medium text-gray-700">
//                     Title
//                   </label>
//                   <input
//                     type="text"
//                     id="title"
//                     name="title"
//                     value={formData.title}
//                     onChange={handleInputChange}
//                     placeholder="Enter title"
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="description" className="block text-sm font-medium text-gray-700">
//                     Description
//                   </label>
//                   <textarea
//                     id="description"
//                     name="description"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     rows={3}
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   ></textarea>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Image
//                   </label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     multiple={false}
//                     onChange={handleImageChange}
//                     className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                   />
//                   <div className="mt-2 flex gap-2 flex-wrap">
//                     {previewImages.map((src, idx) => (
//                       <img
//                         key={idx}
//                         src={src}
//                         alt="Preview"
//                         className="h-16 w-16 object-cover rounded-md"
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>
//               <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
//                 <button
//                   type="button"
//                   onClick={closeModal}
//                   className="bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-blue-600 border border-transparent rounded-md shadow-sm px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? "Saving..." : selectedItem ? "Update" : "Create"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BuyerPage;





"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Plus, Edit, Trash2, AlertTriangle, ImageIcon, Loader2, CheckCircle, XCircle } from "lucide-react";

// === Types ===
interface BuyerItem {
  id: number;
  title: string;
  description: string;
  index: number;
  images: string[];
  status: "ACTIVE" | "INACTIVE";
}

// === Component ===
const BuyerPage: React.FC = () => {
  const [buyerData, setBuyerData] = useState<BuyerItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<BuyerItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<BuyerItem, "id" | "images"> & {
    images: File[];
  }>({
    index: 0,
    title: "",
    description: "",
    status: "ACTIVE",
    images: [],
  });

  const [previewImages, setPreviewImages] = useState<string[]>([]);

  // API base URL
  const API_BASE_URL = 'http://localhost:7000';

  // === Fetch Buyer Data ===
  const fetchBuyerData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/parasole/buyer`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log("API Response:", response.data);
      setBuyerData(response.data.data || []);
    } catch (error) {
      console.error("Error fetching buyer data:", error);
      setError("Failed to load buyer data. Please try again.");
      setBuyerData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBuyerData();
  }, []);

  // === Handle Add / Edit Item ===
  const handleAddNew = () => {
    setFormData({
      index: 0,
      title: "",
      description: "",
      status: "ACTIVE",
      images: [],
    });
    setPreviewImages([]);
    setSelectedItem(null);
    setError(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: BuyerItem) => {
    setSelectedItem(item);
    setFormData({
      index: item.index,
      title: item.title,
      description: item.description,
      status: item.status,
      images: [],
    });
    setPreviewImages(
      item.images.map((img) =>
        img.startsWith("http")
          ? img
          : `${API_BASE_URL}/${img.replace(/^public\//, "")}`
      )
    );
    setError(null);
    setIsModalOpen(true);
  };

  // === Form Input Change ===
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "index" ? parseInt(value) || 0 : value,
    }));
  };

  // === Image Upload Change ===
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({ ...prev, images: files }));

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  // === Submit Form (Create or Update) ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const token = Cookies.get("token");
      const formDataToSend = new FormData();

      formDataToSend.append("index", String(formData.index));
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("status", formData.status);

      if (formData.images.length > 0) {
        formData.images.forEach((image) => {
          formDataToSend.append("images", image);
        });
      }
      
      // Log request data for debugging
      console.log("Sending form data:", {
        index: formData.index,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        imageCount: formData.images.length
      });

      if (selectedItem) {
        // Update existing item
        await axios.put(
          `${API_BASE_URL}/api/v1/parasole/buyer/${selectedItem.id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              // Let axios set Content-Type for FormData
            },
          }
        );
      } else {
        // Create new item
        await axios.post(
          `${API_BASE_URL}/api/v1/parasole/buyer`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              // Let axios set Content-Type for FormData
            },
          }
        );
      }
      closeModal();
      fetchBuyerData();
    } catch (error) {
      console.error("Error saving buyer data:", error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Failed to save data. Please check all fields.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // === Delete Item ===
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this buyer?")) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const token = Cookies.get("token");
      await axios.delete(
        `${API_BASE_URL}/api/v1/parasole/buyer/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchBuyerData();
    } catch (error) {
      console.error("Error deleting buyer:", error);
      setError("Failed to delete the item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // === Toggle Status via Dropdown ===
  const handleStatusToggle = async (item: BuyerItem, newStatus: "ACTIVE" | "INACTIVE") => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = Cookies.get("token");
      await axios.put(
        `${API_BASE_URL}/api/v1/parasole/buyer/${item.id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchBuyerData(); // Refresh data after update
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update status. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // === Close Modal ===
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      index: 0,
      title: "",
      description: "",
      status: "ACTIVE",
      images: [],
    });
    setPreviewImages([]);
    setSelectedItem(null);
    setError(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Buyer Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your buyers and global partnerships
            </p>
          </div>
          <button
            onClick={handleAddNew}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm flex items-center transition duration-150 ease-in-out"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Buyer
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {/* Card with Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Buyer Directory</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Index</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center">
                      <div className="flex flex-col items-center">
                        <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
                        <p className="text-gray-500">Loading buyer data...</p>
                      </div>
                    </td>
                  </tr>
                ) : buyerData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center">
                      <div className="text-gray-500">
                        <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
                        <p className="mt-2 text-sm font-medium">No buyers found</p>
                        <p className="text-xs text-gray-400 mb-3">Add your first buyer to get started</p>
                        <button
                          onClick={handleAddNew}
                          className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add New Buyer
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  buyerData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="max-w-xs truncate">{item.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.index}
                      </td>
                      <td className="px-6 py-4">
                        {item.images && item.images.length > 0 ? (
                          <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                            <img
                              src={
                                item.images[0].startsWith("http")
                                  ? item.images[0]
                                  : `${API_BASE_URL}/${item.images[0].replace(/^public\//, "")}`
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
                            onChange={(e) =>
                              handleStatusToggle(
                                item,
                                e.target.value as "ACTIVE" | "INACTIVE"
                              )
                            }
                            className={`appearance-none w-full pl-10 pr-10 py-2 rounded-lg border text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              item.status === "ACTIVE"
                                ? "bg-green-50 text-green-800 border-green-200"
                                : "bg-red-50 text-red-800 border-red-200"
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
                            {item.status === "ACTIVE" ? (
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
                            onClick={() => handleEdit(item)}
                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-md transition-colors duration-200"
                            title="Edit buyer"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-md transition-colors duration-200"
                            title="Delete buyer"
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
                {selectedItem ? "Edit Buyer" : "Add New Buyer"}
              </h3>
              <button
                onClick={closeModal}
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
                    <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <div>{error}</div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-6">
                  <div className="col-span-1">
                    <label htmlFor="index" className="block text-sm font-medium text-gray-700 mb-1">
                      Index <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="index"
                      name="index"
                      value={formData.index}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="Enter display order (e.g., 1, 2, 3)"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">Sets the display order in the list</p>
                  </div>
                  
                  <div className="col-span-1">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="Enter buyer title"
                      required
                    />
                  </div>
                  
                  <div className="col-span-1">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="Enter detailed description"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image {!selectedItem && <span className="text-red-500">*</span>}
                    </label>
                    <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg px-6 py-8 flex justify-center">
                      <div className="space-y-1 text-center">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                            <span>Upload files</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="sr-only"
                              required={!selectedItem && previewImages.length === 0}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                      </div>
                    </div>
                    
                    {previewImages.length > 0 && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Image Preview
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                          {previewImages.map((preview, idx) => (
                            <div key={idx} className="relative group">
                              <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100">
                                <img
                                  src={preview}
                                  alt={`Preview ${idx + 1}`}
                                  className="h-24 w-24 object-cover rounded-md border border-gray-200"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="col-span-1">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      required
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="sticky bottom-0 px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
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
                    selectedItem ? 'Update Buyer' : 'Create Buyer'
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

export default BuyerPage;