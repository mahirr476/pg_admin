"use client"

import React, { useState, useEffect } from 'react'
import { 
  ChevronDown, 
  Upload, 
  X, 
  Edit, 
  Trash, 
  Image as ImageIcon, 
  Save, 
  AlertCircle,
  Loader2
} from 'lucide-react'
import Cookies from 'js-cookie'

interface CSRTitle {
  id: number;
  title: string;
}

interface CSRDetail {
  id: number;
  titleId: number;
  parentTitle: string;
  title: string;
  description: string;
  image: string;
}

interface FormData {
  titleId: number | null;
  title: string;
  description: string;
  image: File | null;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: any[];
}

const CSRDetails = () => {
  // State management
  const [csrTitles, setCsrTitles] = useState<CSRTitle[]>([]);
  const [isLoadingTitles, setIsLoadingTitles] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedTitle, setSelectedTitle] = useState<CSRTitle | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    titleId: null,
    title: '',
    description: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [details, setDetails] = useState<CSRDetail[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Get auth token from cookies
  const getAuthToken = (): string | undefined => {
    return Cookies.get('token');
  };

  // Fetch CSR titles from API
  useEffect(() => {
    const fetchCSRTitles = async () => {
      setIsLoadingTitles(true);
      setError(null);
      
      try {
        const token = getAuthToken();
        
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        // Use the same endpoint as CSRMain to fetch titles
        const response = await fetch('http://localhost:7000/api/v1/group/csr', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch CSR titles: ${response.status}`);
        }
        
        const result: ApiResponse = await response.json();
        
        if (result.success && result.data) {
          // Extract just the id and title fields from the API response
          const titles = result.data.map(item => ({
            id: item.id,
            title: item.title
          }));
          
          setCsrTitles(titles);
        } else {
          throw new Error(result.message || 'Failed to fetch CSR titles');
        }
      } catch (err) {
        console.error('Error fetching CSR titles:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoadingTitles(false);
      }
    };
    
    fetchCSRTitles();
  }, []);

  // Initialize or reset form when selected title changes
  useEffect(() => {
    if (selectedTitle) {
      setFormData(prev => ({
        ...prev,
        titleId: selectedTitle.id,
      }));
      setShowForm(true);
    } else {
      setShowForm(false);
    }
  }, [selectedTitle]);

  // Handle selecting a title from dropdown
  const handleTitleSelect = (title: CSRTitle) => {
    setSelectedTitle(title);
    setShowDropdown(false);
    setErrors({});
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear error
      if (errors.image) {
        setErrors(prev => {
          const newErrors = {...prev};
          delete newErrors.image;
          return newErrors;
        });
      }
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.image && editIndex === null && !imagePreview) {
      newErrors.image = 'Image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (editIndex !== null) {
        // Update existing entry
        const updatedDetails = [...details];
        
        // Find current parent title
        const parentTitle = csrTitles.find(t => t.id === formData.titleId)?.title || '';
        
        updatedDetails[editIndex] = {
          ...updatedDetails[editIndex],
          titleId: formData.titleId || 0,
          parentTitle: parentTitle,
          title: formData.title,
          description: formData.description,
          // Only update image if a new one was provided
          image: formData.image ? URL.createObjectURL(formData.image) : updatedDetails[editIndex].image
        };
        setDetails(updatedDetails);
        setEditIndex(null);
      } else {
        // Add new entry
        setDetails([
          ...details,
          {
            id: Date.now(),
            titleId: selectedTitle?.id || 0,
            parentTitle: selectedTitle?.title || '',
            title: formData.title,
            description: formData.description,
            image: formData.image ? URL.createObjectURL(formData.image) : ''
          }
        ]);
      }
      
      // Reset form
      setFormData({
        titleId: selectedTitle?.id || null,
        title: '',
        description: '',
        image: null
      });
      setImagePreview(null);
      
      // If we were editing, reset selectedTitle
      if (editIndex !== null) {
        setSelectedTitle(null);
        setShowForm(false);
      }
    }
  };

  // Handle edit
  const handleEdit = (index: number) => {
    const detail = details[index];
    
    // Find and set the parent title in the dropdown
    const parentTitleObj = csrTitles.find(t => t.id === detail.titleId);
    setSelectedTitle(parentTitleObj || null);
    
    setFormData({
      titleId: detail.titleId,
      title: detail.title,
      description: detail.description,
      image: null // Cannot set File object from URL
    });
    setImagePreview(detail.image);
    setEditIndex(index);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = (index: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this entry?');
    if (confirmed) {
      const updatedDetails = details.filter((_, i) => i !== index);
      setDetails(updatedDetails);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    if (editIndex !== null) {
      setEditIndex(null);
    }
    setFormData({
      titleId: null,
      title: '',
      description: '',
      image: null
    });
    setImagePreview(null);
    setSelectedTitle(null);
    setShowForm(false);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">CSR Details</h1>
      
      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p className="flex items-center">
            <AlertCircle size={20} className="mr-2" />
            {error}
          </p>
        </div>
      )}
      
      {/* Title Dropdown */}
      <div className="mb-6 max-w-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select CSR Initiative
        </label>
        <div className="relative">
          <button
            type="button"
            className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 flex items-center justify-between shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            onClick={() => setShowDropdown(!showDropdown)}
            disabled={isLoadingTitles}
          >
            {isLoadingTitles ? (
              <span className="flex items-center text-gray-400">
                <Loader2 size={16} className="animate-spin mr-2" />
                Loading initiatives...
              </span>
            ) : (
              <span>{selectedTitle?.title || 'Select a CSR initiative'}</span>
            )}
            <ChevronDown size={16} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {showDropdown && csrTitles.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
              {csrTitles.map((title) => (
                <div
                  key={title.id}
                  className={`cursor-pointer hover:bg-indigo-50 py-2 px-4 ${
                    selectedTitle?.id === title.id ? 'bg-indigo-50 text-indigo-700 font-medium' : ''
                  }`}
                  onClick={() => handleTitleSelect(title)}
                >
                  {title.title}
                </div>
              ))}
            </div>
          )}
          
          {showDropdown && csrTitles.length === 0 && !isLoadingTitles && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-4 text-center">
              <p className="text-gray-500">No CSR initiatives found.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Detail Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {editIndex !== null ? 'Edit Detail' : `Add Detail for "${selectedTitle?.title}"`}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 mb-6">
              {/* Title Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-md border ${errors.title ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="Enter title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.title}
                  </p>
                )}
              </div>
              
              {/* Description Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-2 rounded-md border ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="Enter description"
                ></textarea>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.description}
                  </p>
                )}
              </div>
              
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${errors.image ? 'border-red-300' : 'border-gray-300'}`}>
                  <div className="space-y-1 text-center">
                    {imagePreview ? (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="mx-auto h-32 object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({...prev, image: null}));
                            setImagePreview(null);
                          }}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="image-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                          >
                            <div className="flex flex-col items-center">
                              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                              <span>Upload a file</span>
                              <input
                                id="image-upload"
                                name="image-upload"
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={handleImageChange}
                              />
                            </div>
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
                {errors.image && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.image}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
              >
                <Save size={16} className="mr-2" />
                {editIndex !== null ? 'Update' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Details Table */}
      {details.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Index
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CSR Initiative
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {details.map((detail, index) => (
                <tr key={detail.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-indigo-600">
                      {detail.parentTitle}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{detail.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 line-clamp-2">
                      {detail.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex-shrink-0 h-14 w-14">
                      <img 
                        className="h-14 w-14 rounded-md object-cover"
                        src={detail.image}
                        alt={detail.title}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="p-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="p-1.5 bg-red-50 text-red-600 rounded-full hover:bg-red-100"
                        title="Delete"
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
        selectedTitle && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No details added yet. Use the form above to add details for "{selectedTitle.title}".</p>
          </div>
        )
      )}
    </div>
  )
}

export default CSRDetails