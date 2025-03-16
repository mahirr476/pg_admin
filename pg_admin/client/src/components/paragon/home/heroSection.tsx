// 'use client';

// import React, { useState } from 'react';

// interface HeroData {
//   id: string;
//   title: string;
//   description: string;
//   status: 'active' | 'inactive';
// }

// const HeroSection: React.FC = () => {
//   // State for showing form or table
//   const [showForm, setShowForm] = useState<boolean>(false);
//   const [showTable, setShowTable] = useState<boolean>(false);
  
//   // State for form inputs
//   const [title, setTitle] = useState<string>('');
//   const [description, setDescription] = useState<string>('');
  
//   // State for saving hero data
//   const [heroData, setHeroData] = useState<HeroData[]>([]);
  
//   // State for editing
//   const [isEditing, setIsEditing] = useState<boolean>(false);
//   const [editId, setEditId] = useState<string>('');
  
//   // Handle form submission
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (isEditing) {
//       // Update existing hero data
//       setHeroData(prevData => 
//         prevData.map(item => 
//           item.id === editId 
//             ? { ...item, title, description } 
//             : item
//         )
//       );
//       setIsEditing(false);
//       setEditId('');
//     } else {
//       // Add new hero data
//       const newHero: HeroData = {
//         id: Date.now().toString(),
//         title,
//         description,
//         status: 'active'
//       };
      
//       setHeroData(prevData => [...prevData, newHero]);
//     }
    
//     // Reset form and show table
//     setTitle('');
//     setDescription('');
//     setShowForm(false);
//     setShowTable(true);
//   };
  
//   // Handle edit
//   const handleEdit = (hero: HeroData) => {
//     setTitle(hero.title);
//     setDescription(hero.description);
//     setIsEditing(true);
//     setEditId(hero.id);
//     setShowTable(false);
//     setShowForm(true);
//   };
  
//   // Handle delete
//   const handleDelete = (id: string) => {
//     setHeroData(prevData => prevData.filter(item => item.id !== id));
//   };
  
//   // Handle status toggle
//   const handleStatusToggle = (id: string) => {
//     setHeroData(prevData => 
//       prevData.map(item => 
//         item.id === id 
//           ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' } 
//           : item
//       )
//     );
//   };
  
//   // Reset form
//   const handleCancel = () => {
//     setTitle('');
//     setDescription('');
//     setIsEditing(false);
//     setEditId('');
//     setShowForm(false);
    
//     // Only show table if we have data
//     if (heroData.length > 0) {
//       setShowTable(true);
//     }
//   };
  
//   // Add new button click
//   const handleAddNew = () => {
//     setShowTable(false);
//     setShowForm(true);
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-800">Hero Section</h2>
//           <p className="text-gray-500 mt-1">Manage the main banner content for your homepage</p>
//         </div>
        
//         {!showForm && (
//           <button
//             onClick={showTable ? handleAddNew : () => setShowForm(true)}
//             className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center font-medium shadow-sm hover:shadow"
//           >
//             <svg 
//               xmlns="http://www.w3.org/2000/svg" 
//               className="h-5 w-5 mr-2" 
//               fill="none" 
//               viewBox="0 0 24 24" 
//               stroke="currentColor"
//             >
//               <path 
//                 strokeLinecap="round" 
//                 strokeLinejoin="round" 
//                 strokeWidth={2} 
//                 d="M12 4v16m8-8H4" 
//               />
//             </svg>
//             Add Hero Section
//           </button>
//         )}
//       </div>
      
//       {/* Form Section */}
//       {showForm && (
//         <div className="bg-gray-50 rounded-xl p-8 mb-8 border border-gray-200 shadow-sm">
//           <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
//             {isEditing ? (
//               <>
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
//                   <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
//                 </svg>
//                 Edit Hero Section
//               </>
//             ) : (
//               <>
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
//                 </svg>
//                 Add Hero Section
//               </>
//             )}
//           </h3>
          
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
//                 Title
//               </label>
//               <input
//                 type="text"
//                 id="title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
//                 placeholder="Enter hero title"
//                 required
//               />
//             </div>
            
//             <div>
//               <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
//                 Description
//               </label>
//               <textarea
//                 id="description"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 rows={4}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
//                 placeholder="Enter hero description"
//                 required
//               />
//             </div>
            
//             <div className="flex justify-end pt-4">
//               <button
//                 type="button"
//                 onClick={handleCancel}
//                 className="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium mr-3 shadow-sm"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm"
//               >
//                 {isEditing ? 'Update Section' : 'Save Section'}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
      
//       {/* Table Section */}
//       {showTable && (
//         <div className="overflow-hidden rounded-xl border border-gray-200 shadow">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                   #
//                 </th>
//                 <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                   Title
//                 </th>
//                 <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                   Description
//                 </th>
//                 <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {heroData.length > 0 ? (
//                 heroData.map((hero, index) => (
//                   <tr key={hero.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
//                       {index + 1}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {hero.title}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-500">
//                       {hero.description.length > 100 
//                         ? `${hero.description.substring(0, 100)}...` 
//                         : hero.description}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <button
//                         onClick={() => handleStatusToggle(hero.id)}
//                         className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
//                           hero.status === 'active'
//                             ? 'bg-green-100 text-green-800 hover:bg-green-200'
//                             : 'bg-red-100 text-red-800 hover:bg-red-200'
//                         }`}
//                       >
//                         {hero.status === 'active' ? (
//                           <span className="flex items-center">
//                             <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
//                             Active
//                           </span>
//                         ) : (
//                           <span className="flex items-center">
//                             <span className="h-2 w-2 rounded-full bg-red-500 mr-1.5"></span>
//                             Inactive
//                           </span>
//                         )}
//                       </button>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                       <button
//                         onClick={() => handleEdit(hero)}
//                         className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors mr-2"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(hero.id)}
//                         className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
//                     No hero sections found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
      
//       {/* Initial empty state */}
//       {!showForm && !showTable && (
//         <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
//           <div className="mx-auto h-16 w-16 text-blue-400 mb-4">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
//             </svg>
//           </div>
//           <h3 className="text-lg font-medium text-gray-900 mb-1">No hero sections</h3>
//           <p className="text-gray-500 max-w-md mx-auto mb-6">Get started by creating a new hero section to display on your homepage.</p>
//           <button
//             onClick={() => setShowForm(true)}
//             className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center font-medium mx-auto shadow-sm"
//           >
//             <svg 
//               xmlns="http://www.w3.org/2000/svg" 
//               className="h-5 w-5 mr-2" 
//               fill="none" 
//               viewBox="0 0 24 24" 
//               stroke="currentColor"
//             >
//               <path 
//                 strokeLinecap="round" 
//                 strokeLinejoin="round" 
//                 strokeWidth={2} 
//                 d="M12 4v16m8-8H4" 
//               />
//             </svg>
//             Add Your First Hero Section
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HeroSection;







'use client';

import React, { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import { cookies } from 'next/headers';

interface HeroData {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'inactive';
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    title: string;
    description: string;
    status: string;
    [key: string]: any; // For other fields that we're not using
  };
}

const HeroSection: React.FC = () => {
  // State for showing form or table
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showTable, setShowTable] = useState<boolean>(false);
  
  // State for form inputs
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  
  // State for saving hero data
  const [heroData, setHeroData] = useState<HeroData[]>([]);
  
  // State for editing
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editId, setEditId] = useState<string>('');
  
  // State for loading and error
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Get token from cookies
      const token = Cookies.get("token");
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      const response = await fetch('http://localhost:7000/api/v1/group/hero', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description
        }),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please log in again.');
        }
        throw new Error(`API error: ${response.status}`);
      }
      
      const responseData: ApiResponse = await response.json();
      console.log('API Response:', responseData);
      
      if (responseData.success) {
        if (isEditing) {
          // Update existing hero data
          setHeroData(prevData => 
            prevData.map(item => 
              item.id === editId 
                ? { 
                    ...item, 
                    title: responseData.data.title, 
                    description: responseData.data.description,
                    status: responseData.data.status.toLowerCase() as 'active' | 'inactive'
                  } 
                : item
            )
          );
          setIsEditing(false);
          setEditId('');
        } else {
          // Add new hero data from API response
          const newHero: HeroData = {
            id: responseData.data.id.toString(),
            title: responseData.data.title,
            description: responseData.data.description,
            status: responseData.data.status.toLowerCase() as 'active' | 'inactive'
          };
          
          setHeroData(prevData => [...prevData, newHero]);
        }
        
        // Reset form and show table
        setTitle('');
        setDescription('');
        setShowForm(false);
        setShowTable(true);
      } else {
        setError(responseData.message || 'Failed to save data');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle edit
  const handleEdit = (hero: HeroData) => {
    setTitle(hero.title);
    setDescription(hero.description);
    setIsEditing(true);
    setEditId(hero.id);
    setShowTable(false);
    setShowForm(true);
  };
  
  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Get token from cookies
      const token = Cookies.get("token");
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      // In a real implementation, you would call the delete API here
      // For now, just update local state
      setHeroData(prevData => prevData.filter(item => item.id !== id));
      
    } catch (err) {
      console.error('Error deleting item:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle status toggle
  const handleStatusToggle = async (id: string) => {
    try {
      // Get token from cookies
      const token = Cookies.get("token");
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      // In a real implementation, you would call the API to update status
      // For now, just update local state
      setHeroData(prevData => 
        prevData.map(item => 
          item.id === id 
            ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' } 
            : item
        )
      );
      
    } catch (err) {
      console.error('Error toggling status:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };
  
  // Reset form
  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setIsEditing(false);
    setEditId('');
    setShowForm(false);
    setError(null);
    
    // Only show table if we have data
    if (heroData.length > 0) {
      setShowTable(true);
    }
  };
  
  // Add new button click
  const handleAddNew = () => {
    setShowTable(false);
    setShowForm(true);
    setError(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Hero Section</h2>
          <p className="text-gray-500 mt-1">Manage the main banner content for your homepage</p>
        </div>
        
        {!showForm && (
          <button
            onClick={showTable ? handleAddNew : () => setShowForm(true)}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center font-medium shadow-sm hover:shadow"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 4v16m8-8H4" 
              />
            </svg>
            Add Hero Section
          </button>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Form Section */}
      {showForm && (
        <div className="bg-gray-50 rounded-xl p-8 mb-8 border border-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            {isEditing ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Hero Section
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Hero Section
              </>
            )}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                placeholder="Enter hero title"
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                placeholder="Enter hero description"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium mr-3 shadow-sm"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm flex items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isLoading ? 'Saving...' : (isEditing ? 'Update Section' : 'Save Section')}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Table Section */}
      {showTable && (
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Index
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {heroData.length > 0 ? (
                heroData.map((hero, index) => (
                  <tr key={hero.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {hero.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {hero.description.length > 100 
                        ? `${hero.description.substring(0, 100)}...` 
                        : hero.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleStatusToggle(hero.id)}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          hero.status === 'active'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {hero.status === 'active' ? (
                          <span className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
                            Active
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-red-500 mr-1.5"></span>
                            Inactive
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(hero)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(hero.id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                    No hero sections found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Initial empty state */}
      {!showForm && !showTable && (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
          <div className="mx-auto h-16 w-16 text-blue-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No hero sections</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">Get started by creating a new hero section to display on your homepage.</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center font-medium mx-auto shadow-sm"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 4v16m8-8H4" 
              />
            </svg>
            Add Your First Hero Section
          </button>
        </div>
      )}
    </div>
  );
};

export default HeroSection;