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
  Eye
} from 'lucide-react';
import Image from 'next/image';
import Cookies from 'js-cookie';

// API URL
const API_URL = 'http://localhost:7000/api/v1/group/milestone';

// Define the Milestone type to match API response
interface Milestone {
  id: number;
  title: string;
  description: string;
  orderIndex: number;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

// Modal component
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
};

const MilestonesHero = () => {
  // State for the hero section
  const [heroTitle, setHeroTitle] = useState('Company Milestones');
  const [heroDescription, setHeroDescription] = useState('Explore the key moments that have shaped our growth and success over the years.');
  
  // State for milestones form and list
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [showModal, setShowModal] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formOrderIndex, setFormOrderIndex] = useState<number | null>(null);
  const [formStatus, setFormStatus] = useState('ACTIVE');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMilestones, setFilteredMilestones] = useState<Milestone[]>([]);
  
  // Fetch milestones on component mount
  useEffect(() => {
    fetchMilestones();
  }, []);
  
  // Effect to filter milestones when search term changes
  useEffect(() => {
    const filtered = milestones.filter(milestone => 
      milestone.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      milestone.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMilestones(filtered);
  }, [searchTerm, milestones]);
  
  // Fetch milestones from API
  const fetchMilestones = async () => {
    try {
      setLoading(true);
      // Get token from cookies
      const token = Cookies.get('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      console.log('Fetching milestones with token:', token.substring(0, 10) + '...');
      
      const response = await fetch(API_URL, {
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
        setMilestones(responseData.data || []);
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
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Get token from cookies
      const token = Cookies.get('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Ensure orderIndex is a number before submitting
      if (formOrderIndex === null) {
        setError('Order Index is required');
        return;
      }
      
      const milestoneData = {
        title: formTitle,
        description: formDescription,
        orderIndex: formOrderIndex,
        status: formStatus
      };
      
      console.log('Sending milestone data:', milestoneData);
      
      if (isEditing && editId !== null) {
        // Update existing milestone via PUT request
        const response = await fetch(`${API_URL}/${editId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(milestoneData),
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
          // Refresh the list
          await fetchMilestones();
          // Close the modal
          setShowModal(false);
        } else {
          throw new Error(responseData.message || 'Failed to update milestone');
        }
      } else {
        // Create new milestone via POST request
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(milestoneData),
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
          // Refresh the list
          await fetchMilestones();
          // Close the modal
          setShowModal(false);
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
  const handleEdit = (milestone: Milestone) => {
    setIsEditing(true);
    setEditId(milestone.id);
    setFormTitle(milestone.title);
    setFormDescription(milestone.description);
    setFormOrderIndex(milestone.orderIndex);
    setFormStatus(milestone.status);
    setShowModal(true);
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
        
        const response = await fetch(`${API_URL}/${id}`, {
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
      
      const response = await fetch(`${API_URL}/${id}`, {
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
    setFormOrderIndex(null);
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
      {/* Hero Section */}
      <div className="relative h-80 bg-gray-900 overflow-hidden">
        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h1 className="text-4xl font-bold text-white mb-4">{heroTitle}</h1>
            <p className="text-xl text-gray-200">{heroDescription}</p>
          </div>
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
            {/* Order Index */}
            <div>
              <label htmlFor="orderIndex" className="block text-sm font-medium text-gray-700 mb-1">
                Order Index <span className="text-red-500">*</span>
              </label>
              <input
                id="orderIndex"
                type="number"
                min="1"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formOrderIndex === null ? '' : formOrderIndex}
                onChange={(e) => {
                  const value = e.target.value === '' ? null : parseInt(e.target.value);
                  setFormOrderIndex(isNaN(value as number) ? null : value);
                }}
                placeholder="Enter display order (1, 2, 3, etc.)"
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
                    Order
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
                        {milestone.orderIndex}
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
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
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

export default MilestonesHero;