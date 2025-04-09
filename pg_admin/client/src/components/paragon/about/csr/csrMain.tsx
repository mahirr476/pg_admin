"use client"

import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Edit, 
  Trash, 
  X,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react';
import Cookies from 'js-cookie';

interface CSREntry {
  id: number;
  orderIndex: number;
  title: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

interface FormData {
  orderIndex: number;
  title: string;
  description: string;
}

interface FormErrors {
  orderIndex?: string;
  title?: string;
  description?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: CSREntry[];
}

const CSRMain: React.FC = () => {
  // State management
  const [showForm, setShowForm] = useState<boolean>(false);
  const [csrEntries, setCsrEntries] = useState<CSREntry[]>([]);
  const [formData, setFormData] = useState<FormData>({ orderIndex: 1, title: '', description: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get auth token from cookies
  const getAuthToken = (): string | undefined => {
    return Cookies.get('token');
  };

  // Fetch CSR data
  const fetchCSRData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Using GET method to fetch data
      const response = await fetch('http://localhost:7000/api/v1/group/csr', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      
      const result: ApiResponse = await response.json();
      
      if (result.success) {
        setCsrEntries(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch CSR data');
      }
    } catch (err) {
      console.error('Error fetching CSR data:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCSRData();
  }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // For orderIndex, convert string to number
    if (name === 'orderIndex') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name as keyof FormErrors];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.orderIndex) {
      newErrors.orderIndex = 'Index is required';
    } else if (formData.orderIndex < 1) {
      newErrors.orderIndex = 'Index must be at least 1';
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setIsLoading(true);
        const token = getAuthToken();
        
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        if (editIndex !== null) {
          // Update existing entry
          const entryToUpdate = csrEntries[editIndex];
          
          // Using PUT method to update
          const response = await fetch(`http://localhost:7000/api/v1/group/csr/${entryToUpdate.id}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              orderIndex: formData.orderIndex,
              title: formData.title,
              description: formData.description
            })
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to update CSR entry: ${response.status}`);
          }
          
          // Success - refresh the data
          await fetchCSRData();
        } else {
          // Add new entry - Using POST method
          const response = await fetch('http://localhost:7000/api/v1/group/csr', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              orderIndex: formData.orderIndex,
              title: formData.title,
              description: formData.description
            })
          });
          
          // Log the request body for debugging
          console.log('Request body:', JSON.stringify({
            orderIndex: formData.orderIndex,
            title: formData.title,
            description: formData.description
          }));
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to create CSR entry: ${response.status}`);
          }
          
          // Success - refresh the data
          await fetchCSRData();
        }
        
        // Reset form and close modal
        setFormData({ orderIndex: getNextAvailableIndex(), title: '', description: '' });
        setShowForm(false);
        setEditIndex(null);
      } catch (err) {
        console.error('Error saving CSR entry:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Get next available index
  const getNextAvailableIndex = (): number => {
    if (csrEntries.length === 0) return 1;
    
    // Find the highest index and add 1
    const highestIndex = Math.max(...csrEntries.map(entry => entry.orderIndex));
    return highestIndex + 1;
  };

  // Handle edit
  const handleEdit = (index: number) => {
    const entry = csrEntries[index];
    setFormData({
      orderIndex: entry.orderIndex,
      title: entry.title,
      description: entry.description
    });
    setEditIndex(index);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (index: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this CSR entry?');
    if (confirmed) {
      try {
        setIsLoading(true);
        const token = getAuthToken();
        
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        const entryToDelete = csrEntries[index];
        
        // Using DELETE method
        const response = await fetch(`http://localhost:7000/api/v1/group/csr/${entryToDelete.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to delete CSR entry: ${response.status}`);
        }
        
        // Success - refresh the data
        await fetchCSRData();
      } catch (err) {
        console.error('Error deleting CSR entry:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Toggle status
  const toggleStatus = async (index: number) => {
    try {
      setIsLoading(true);
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const entryToUpdate = csrEntries[index];
      const newStatus = entryToUpdate.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      
      // Using PUT method to update the entry with new status
      // The error suggests the /status endpoint doesn't exist, so we use the main endpoint
      const response = await fetch(`http://localhost:7000/api/v1/group/csr/${entryToUpdate.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderIndex: entryToUpdate.orderIndex,
          title: entryToUpdate.title,
          description: entryToUpdate.description,
          status: newStatus
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update status: ${response.status}`);
      }
      
      // Success - refresh the data
      await fetchCSRData();
    } catch (err) {
      console.error('Error toggling status:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">CSR Management</h1>
        <button
          onClick={() => {
            setFormData({ orderIndex: getNextAvailableIndex(), title: '', description: '' });
            setEditIndex(null);
            setShowForm(true);
          }}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          disabled={isLoading}
        >
          <PlusCircle size={18} className="mr-2" />
          Add CSR
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p className="flex items-center">
            <AlertCircle size={20} className="mr-2" />
            {error}
          </p>
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {editIndex !== null ? 'Edit CSR Entry' : 'Add New CSR Entry'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* Order Index Field */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="orderIndex">
                  Index
                </label>
                <input
                  type="number"
                  id="orderIndex"
                  name="orderIndex"
                  value={formData.orderIndex}
                  onChange={handleChange}
                  min="1"
                  className={`w-full px-3 py-2 border rounded-md ${errors.orderIndex ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter order index"
                />
                {errors.orderIndex && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.orderIndex}
                  </p>
                )}
              </div>
              
              {/* Title Field */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="title">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter CSR title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.title}
                  </p>
                )}
              </div>
              
              {/* Description Field */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter CSR description"
                ></textarea>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.description}
                  </p>
                )}
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    editIndex !== null ? 'Update' : 'Submit'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && !showForm && (
        <div className="flex justify-center my-10">
          <div className="flex flex-col items-center">
            <Loader2 size={40} className="animate-spin text-indigo-600 mb-4" />
            <p className="text-gray-600">Loading CSR data...</p>
          </div>
        </div>
      )}

      {/* CSR Table */}
      {!isLoading && csrEntries.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Index
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {csrEntries.map((entry, index) => (
                <tr key={entry.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.orderIndex}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{entry.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 line-clamp-2">
                      {entry.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          entry.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {entry.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => toggleStatus(index)}
                        className={`p-1 rounded-full transition-colors ${
                          entry.status === 'ACTIVE'
                            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}
                        title={entry.status === 'ACTIVE' ? 'Set Inactive' : 'Set Active'}
                      >
                        {entry.status === 'ACTIVE' ? <X size={14} /> : <Check size={14} />}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="p-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100"
                        title="Edit"
                        disabled={isLoading}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="p-1.5 bg-red-50 text-red-600 rounded-full hover:bg-red-100"
                        title="Delete"
                        disabled={isLoading}
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
      ) : !isLoading && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No CSR entries found. Click "Add CSR" to create your first entry.</p>
        </div>
      )}
    </div>
  );
};

export default CSRMain;