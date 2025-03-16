// // page.tsx
// import FirstSection from '@/components/paragon/home/firstSection';
// import FifthSection from '@/components/paragon/home/fiveSection';
// import FourthSection from '@/components/paragon/home/fourSection';
// import SecondSection from '@/components/paragon/home/secondSection';
// import SixthSection from '@/components/paragon/home/sixSection';
// import ThirdSection from '@/components/paragon/home/thirdSection';
// import React from 'react';

// export default function HomePage() {
//   return (
//     <div className="p-6 max-w-4xl mx-auto py-12">
//       <div className="space-y-16"> {/* Added container with consistent vertical spacing */}
//         <div className="border-b pb-16">
//           <FirstSection/>
//         </div>
        
//         <div className="border-b pb-16">
//           <SecondSection/>
//         </div>
        
//         <div className="border-b pb-16">
//           <ThirdSection/>
//         </div>
        
//         <div className="border-b pb-16">
//           <FourthSection/>
//         </div>
        
//         <div className="border-b pb-16">
//           <FifthSection/>
//         </div>
        
//         <div>
//           <SixthSection/>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import React, { useState, useEffect } from 'react';

interface HeroData {
  id: number;
  title: string;
  description: string;
  companies: string;
  projects: string;
  location: string;
  employees: string;
  industries: string;
  products: string;
  established: string;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  status?: string;
}

interface FormData {
  title: string;
  description: string;
  companies: string;
  projects: string;
  location: string;
  employees: string;
  industries: string;
  products: string;
  established: string;
}

const Home: React.FC = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [heroData, setHeroData] = useState<HeroData[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    companies: '',
    projects: '',
    location: '',
    employees: '',
    industries: '',
    products: '',
    established: ''
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Fetch hero data on component mount
  useEffect(() => {
    fetchHeroData();
  }, []);

  // Function to fetch hero data
  const fetchHeroData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:7000/api/v1/group/hero', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({}) // Empty body or you can add any required params here
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch hero data');
      }
      
      const result = await response.json();
      
      if (result.success) {
        // If result.data is an array, use it directly, otherwise wrap it in an array
        const heroArray = Array.isArray(result.data) ? result.data : [result.data];
        setHeroData(heroArray.filter((item: any) => item !== null));
      } else {
        throw new Error(result.message || 'Failed to fetch hero data');
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching hero data:', err);
      // Initialize with empty array on error
      setHeroData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const endpoint = 'http://localhost:7000/api/v1/group/hero';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create hero');
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Refresh the data
        await fetchHeroData();
        
        // Reset form data
        setFormData({
          title: '',
          description: '',
          companies: '',
          projects: '',
          location: '',
          employees: '',
          industries: '',
          products: '',
          established: ''
        });
        
        // Hide the form
        setShowForm(false);
        setIsEditing(false);
        setEditId(null);
        
        // Show success message
        alert(isEditing ? 'Hero updated successfully!' : 'Hero created successfully!');
      } else {
        throw new Error(result.message || 'Unknown error occurred');
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error creating hero:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle edit button click
  const handleEdit = (hero: HeroData) => {
    setFormData({
      title: hero.title,
      description: hero.description,
      companies: hero.companies,
      projects: hero.projects,
      location: hero.location,
      employees: hero.employees,
      industries: hero.industries,
      products: hero.products,
      established: hero.established
    });
    setIsEditing(true);
    setEditId(hero.id);
    setShowForm(true);
    window.scrollTo(0, 0);
  };
  
  // Handle delete button click
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:7000/api/v1/group/hero/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete hero');
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Refresh the data
        await fetchHeroData();
        
        // Show success message
        alert('Hero deleted successfully!');
      } else {
        throw new Error(result.message || 'Unknown error occurred');
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error deleting hero:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Paragon Group Admin Panel</h1>
      
      <div className="mb-6">
        <button 
          className={`px-4 py-2 rounded font-medium text-white ${showForm ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} transition-colors duration-200`}
          onClick={() => {
            if (showForm && isEditing) {
              // If we're closing the form while editing, reset the editing state
              setIsEditing(false);
              setEditId(null);
              setFormData({
                title: '',
                description: '',
                companies: '',
                projects: '',
                location: '',
                employees: '',
                industries: '',
                products: '',
                established: ''
              });
            }
            setShowForm(!showForm);
          }}
        >
          {showForm ? 'Cancel' : 'Add New Hero'}
        </button>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 border-l-4 border-red-500 text-red-700">
          Error: {error}
        </div>
      )}

      {/* Form to add/edit hero */}
      {showForm && (
        <div className="mb-8 bg-gray-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Hero' : 'Add New Hero'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="title" className="block font-medium mb-1 text-gray-700">Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block font-medium mb-1 text-gray-700">Description:</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="companies" className="block font-medium mb-1 text-gray-700">Companies:</label>
              <input
                type="text"
                id="companies"
                name="companies"
                value={formData.companies}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="projects" className="block font-medium mb-1 text-gray-700">Projects:</label>
              <input
                type="text"
                id="projects"
                name="projects"
                value={formData.projects}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="location" className="block font-medium mb-1 text-gray-700">Location:</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="employees" className="block font-medium mb-1 text-gray-700">Employees:</label>
              <input
                type="text"
                id="employees"
                name="employees"
                value={formData.employees}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="industries" className="block font-medium mb-1 text-gray-700">Industries:</label>
              <input
                type="text"
                id="industries"
                name="industries"
                value={formData.industries}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="products" className="block font-medium mb-1 text-gray-700">Products:</label>
              <input
                type="text"
                id="products"
                name="products"
                value={formData.products}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="established" className="block font-medium mb-1 text-gray-700">Established:</label>
              <input
                type="text"
                id="established"
                name="established"
                value={formData.established}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button 
              type="submit" 
              className="md:col-span-2 py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : isEditing ? 'Update' : 'Submit'}
            </button>
          </form>
        </div>
      )}

      {/* Table to display hero data */}
      <div className="overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Hero Data</h2>
        {isLoading && !showForm ? (
          <p className="text-gray-600">Loading data...</p>
        ) : heroData.length > 0 ? (
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Companies</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projects</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industries</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Established</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {heroData.map((hero) => (
                  <tr key={hero.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hero.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{hero.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{hero.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hero.companies}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hero.projects}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hero.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hero.employees}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hero.industries}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hero.products}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hero.established}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(hero)} 
                          className="text-indigo-600 hover:text-indigo-900 font-medium"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(hero.id)} 
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No hero data available</p>
        )}
      </div>
    </div>
  );
};

export default Home;