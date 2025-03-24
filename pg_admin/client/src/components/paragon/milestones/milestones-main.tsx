"use client"

import React, { useState, useEffect } from 'react';
import { 
  Edit, 
  Trash2, 
  Plus, 
  X, 
  Check, 
  Upload, 
  Search,
  Eye,
  Calendar
} from 'lucide-react';
import Cookies from 'js-cookie';

// API URLs
const API_URL = 'http://localhost:7000/api/v1/group/milestone';
const DETAIL_API_URL = 'http://localhost:7000/api/v1/group/milestone/detail';

// Define the Milestone Detail type
interface MilestoneDetail {
  id: number;
  year: string;
  title: string;
  description: string;
  image: string;
  status: string;
  imageUrl?: string;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
}

// Modal Component
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        {/* Modal Content */}
        <div 
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="modal-headline"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                {title}
              </h3>
              <button 
                type="button" 
                className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={onClose}
              >
                <X size={20} />
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const MainMilestones = () => {
  // State for milestones
  const [milestones, setMilestones] = useState<MilestoneDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [showModal, setShowModal] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formYear, setFormYear] = useState('');
  const [formImage, setFormImage] = useState<File | null>(null);
  const [formStatus, setFormStatus] = useState('ACTIVE');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMilestones, setFilteredMilestones] = useState<MilestoneDetail[]>([]);
  
  // Fetch milestones on component mount
  useEffect(() => {
    console.log('Component mounted, fetching milestones...');
    fetchMilestones();
  }, []);
  
  // Effect to filter milestones when search term changes
  useEffect(() => {
    const filtered = milestones.filter(milestone => 
      milestone.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      milestone.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      milestone.year.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMilestones(filtered);
  }, [searchTerm, milestones]);
  
  // Fetch milestones from API
  const fetchMilestones = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      console.log('Fetching milestones with token:', token.substring(0, 10) + '...');
      
      const response = await fetch(DETAIL_API_URL, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const responseText = await response.text();
      console.log('Fetch response:', responseText);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch milestones: ${responseText}`);
      }
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Failed to parse response: ${responseText}`);
      }
      
      if (responseData.success) {
        // If the API returns an array directly
        if (Array.isArray(responseData.data)) {
          setMilestones(responseData.data);
          console.log('Milestone data array:', responseData.data);
        } 
        // If the API returns a single object, wrap it in an array
        else if (responseData.data && typeof responseData.data === 'object') {
          setMilestones([responseData.data]);
          console.log('Single milestone data:', responseData.data);
        } 
        // Otherwise, set an empty array
        else {
          setMilestones([]);
        }
      } else {
        throw new Error(responseData.message || 'Failed to fetch milestones');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching milestones:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Selected file:', file.name, 'Size:', file.size, 'Type:', file.type);
      setFormImage(file);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Get token from cookies
      const token = Cookies.get('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Create form data for file upload
      const formData = new FormData();
      formData.append('title', formTitle);
      formData.append('description', formDescription);
      formData.append('year', formYear);
      formData.append('status', formStatus);
      
      // Add image if a new one was selected
      if (formImage) {
        formData.append('image', formImage);
        console.log('Adding image to form data:', formImage.name);
      }
      
      console.log('Sending milestone data:', {
        title: formTitle,
        description: formDescription,
        year: formYear,
        status: formStatus,
        image: formImage ? formImage.name : 'No image selected'
      });
      
      if (isEditing && editId !== null) {
        // Update existing milestone via PUT request
        const response = await fetch(`${DETAIL_API_URL}/${editId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
            // Note: Don't set Content-Type when using FormData
          },
          body: formData,
        });
        
        const responseText = await response.text();
        console.log('Update response:', responseText);
        
        if (!response.ok) {
          throw new Error(`Failed to update milestone: ${responseText}`);
        }
        
        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch (e) {
          throw new Error(`Failed to parse response: ${responseText}`);
        }
        
        if (responseData.success) {
          // Close the modal
          setShowModal(false);
          // Refresh the list with a slight delay
          setTimeout(() => {
            fetchMilestones();
          }, 1000);
        } else {
          throw new Error(responseData.message || 'Failed to update milestone');
        }
      } else {
        // Create new milestone via POST request
        const response = await fetch(DETAIL_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
            // Note: Don't set Content-Type when using FormData
          },
          body: formData,
        });
        
        const responseText = await response.text();
        console.log('Create response:', responseText);
        
        if (!response.ok) {
          throw new Error(`Failed to create milestone: ${responseText}`);
        }
        
        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch (e) {
          throw new Error(`Failed to parse response: ${responseText}`);
        }
        
        if (responseData.success) {
          // Close the modal
          setShowModal(false);
          // Refresh the list with a slight delay
          setTimeout(() => {
            fetchMilestones();
          }, 1000);
        } else {
          throw new Error(responseData.message || 'Failed to create milestone');
        }
      }
      
      // Reset form
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error saving milestone:', err);
    }
  };
  
  // Edit a milestone
  const handleEdit = (milestone: MilestoneDetail) => {
    setIsEditing(true);
    setEditId(milestone.id);
    setFormTitle(milestone.title);
    setFormDescription(milestone.description);
    setFormYear(milestone.year);
    setFormStatus(milestone.status);
    setFormImage(null); // Clear selected image
    setShowModal(true);
    
    console.log('Editing milestone:', milestone);
  };
  
  // Delete a milestone
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this milestone?')) {
      try {
        // Get token from cookies
        const token = Cookies.get('token');
        
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        console.log(`Deleting milestone ${id}`);
        console.log('Using token:', token.substring(0, 10) + '...');
        
        const response = await fetch(`${DETAIL_API_URL}/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        
        const responseText = await response.text();
        console.log('Delete response:', responseText);
        
        if (!response.ok) {
          throw new Error(`Failed to delete milestone: ${responseText}`);
        }
        
        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch (e) {
          throw new Error(`Failed to parse response: ${responseText}`);
        }
        
        if (responseData.success) {
          // Refresh the list
          await fetchMilestones();
        } else {
          throw new Error(responseData.message || 'Failed to delete milestone');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error deleting milestone:', err);
      }
    }
  };
  
  // Toggle milestone status
  const toggleStatus = async (id: number, currentStatus: string) => {
    try {
      // Get token from cookies
      const token = Cookies.get('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      const statusData = { status: newStatus };
      
      console.log(`Updating milestone ${id} status:`, statusData);
      console.log('Using token:', token.substring(0, 10) + '...');
      
      const response = await fetch(`${DETAIL_API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(statusData),
      });
      
      const responseText = await response.text();
      console.log('Status update response:', responseText);
      
      if (!response.ok) {
        throw new Error(`Failed to update milestone status: ${responseText}`);
      }
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Failed to parse response: ${responseText}`);
      }
      
      if (responseData.success) {
        // Refresh the list
        await fetchMilestones();
      } else {
        throw new Error(responseData.message || 'Failed to update milestone status');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error updating milestone status:', err);
    }
  };
  
  // Reset form
  const resetForm = () => {
    setFormTitle('');
    setFormDescription('');
    setFormYear('');
    setFormImage(null);
    setFormStatus('ACTIVE');
    setIsEditing(false);
    setEditId(null);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Company Milestones</h1>
          <p className="mt-1 text-gray-500">
            Manage and showcase the key moments in our company's history
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Error notification */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-lg">
            <p className="text-red-700">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-700 underline"
            >
              Dismiss
            </button>
          </div>
        )}
        
        {/* Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search milestones..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="h-5 w-5" />
            <span>Add Milestone</span>
          </button>
        </div>
        
        {/* Modal Form */}
        <Modal 
          isOpen={showModal} 
          onClose={handleCloseModal} 
          title={isEditing ? 'Edit Milestone' : 'Add New Milestone'}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Year */}
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                Year <span className="text-red-500">*</span>
              </label>
              <input
                id="year"
                type="text"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formYear}
                onChange={(e) => setFormYear(e.target.value)}
                placeholder="Enter milestone year (e.g., 1990)"
              />
            </div>
            
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Enter milestone title"
              />
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                required
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Enter milestone description"
              ></textarea>
            </div>
            
            {/* Image */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Image {isEditing ? '' : <span className="text-red-500">*</span>}
              </label>
              <div className="flex-1">
                <label
                  htmlFor="image-upload"
                  className="flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 border-dashed cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <Upload className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-500">
                    {formImage ? formImage.name : 'Choose an image'}
                  </span>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    required={!isEditing}
                  />
                </label>
              </div>
            </div>
            
            {/* Status */}
            <div className="flex items-center gap-4">
              <label className="block text-sm font-medium text-gray-700 mb-1 mr-4">
                Status:
              </label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-4 w-4 text-blue-600"
                    name="status"
                    value="ACTIVE"
                    checked={formStatus === 'ACTIVE'}
                    onChange={() => setFormStatus('ACTIVE')}
                  />
                  <span className="ml-2 text-gray-700">Active</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-4 w-4 text-blue-600"
                    name="status"
                    value="INACTIVE"
                    checked={formStatus === 'INACTIVE'}
                    onChange={() => setFormStatus('INACTIVE')}
                  />
                  <span className="ml-2 text-gray-700">Inactive</span>
                </label>
              </div>
            </div>
            
            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isEditing ? 'Update Milestone' : 'Save Milestone'}
              </button>
            </div>
          </form>
        </Modal>
        
        {/* Loading state */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Loading milestones...</p>
          </div>
        ) : (
          /* Table */
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
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
                {filteredMilestones.length > 0 ? (
                  filteredMilestones.map((milestone) => (
                    <tr key={milestone.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {milestone.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center relative">
                          {milestone.image ? (
                            <img
                              src={`http://localhost:7000/${milestone.image.replace(/^public\//, '')}`}
                              alt={milestone.title}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                console.error('Image failed to load:', e.currentTarget.src);
                                // Try a second approach
                                e.currentTarget.style.display = 'none';
                                
                                // Create and append a second image as backup
                                const backupImg = document.createElement('img');
                                backupImg.src = `http://localhost:7000/uploads/group/milestone/${milestone.image.split('/').pop()}`;
                                backupImg.alt = milestone.title;
                                backupImg.className = 'h-full w-full object-cover';
                                backupImg.onerror = () => {
                                  console.error('Second image path failed:', backupImg.src);
                                  backupImg.style.display = 'none';
                                  
                                  // Show fallback text if both images fail
                                  const textNode = document.createElement('span');
                                  textNode.className = 'text-xs text-gray-500';
                                  textNode.textContent = 'Image unavailable';
                                  e.currentTarget.parentElement?.appendChild(textNode);
                                };
                                e.currentTarget.parentElement?.appendChild(backupImg);
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <span className="text-xs text-gray-500">No image</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{milestone.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 line-clamp-2">{milestone.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${milestone.status === 'ACTIVE' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {milestone.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleStatus(milestone.id, milestone.status)}
                            className={`p-1.5 rounded-full ${
                              milestone.status === 'ACTIVE'
                                ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                                : 'bg-green-100 text-green-600 hover:bg-green-200'
                            }`}
                            title={milestone.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                          >
                            {milestone.status === 'ACTIVE' ? <Eye className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => handleEdit(milestone)}
                            className="p-1.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(milestone.id)}
                            className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      {searchTerm 
                        ? 'No milestones found. Try adjusting your search.'
                        : 'No milestones found. Click "Add Milestone" to create one.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainMilestones;