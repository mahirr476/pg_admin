
"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Edit, 
  Trash2, 
  Plus, 
  X, 
  Check, 
  Search,
  Eye,
  Calendar,
  AlertCircle,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import Cookies from 'js-cookie';

// API URL
const API_URL = 'http://api.pg-admin.57.155.183.218.nip.io/api/v1/group/milestone';

// Define the Milestone type to match API response
interface Milestone {
  id: number;
  title: string;
  description: string;
  orderIndex: number;
  status: string;
  image?: string[]; // Add image field to match API response
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
}

interface ModalProps {
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode;
}

// Toast notification interface
interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

// Modal component
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
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
                aria-label="Close modal"
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

// Toast Component
const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-5 right-5 z-50 flex items-center space-x-3 bg-white rounded-lg shadow-lg p-4 border-l-4 animate-slideIn min-w-[300px]"
      style={{ borderLeftColor: type === 'success' ? '#10B981' : '#EF4444' }}
    >
      <div className={`flex-shrink-0 ${type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
        {type === 'success' ? <Check className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800">{message}</p>
      </div>
      <button 
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        onClick={onClose}
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

// Image Preview component
const ImagePreview: React.FC<{ src: string; onRemove: () => void }> = ({ src, onRemove }) => {
  return (
    <div className="relative group">
      <img 
        src={src.startsWith('public/') ? `http://localhost:7000/${src}` : src} 
        alt="Preview" 
        className="h-20 w-full object-cover rounded-lg border border-gray-300" 
      />
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Remove image"
      >
        <X size={14} />
      </button>
    </div>
  );
};

const MilestonesHero: React.FC = () => {
  // State for the hero section
  const [heroTitle] = useState('Company Milestones');
  const [heroDescription] = useState('Explore the key moments that have shaped our growth and success over the years.');
  
  // State for milestones form and list
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Form state
  const [showModal, setShowModal] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formOrderIndex, setFormOrderIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  
  // Image upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string[] | null>(null);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMilestones, setFilteredMilestones] = useState<Milestone[]>([]);
  // Status update loading states
  const [updatingStatusIds, setUpdatingStatusIds] = useState<number[]>([]);
  
  // Fetch milestones from API
  const fetchMilestones = useCallback(async () => {
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
        // Sort milestones by orderIndex
        const sortedMilestones = [...(responseData.data || [])].sort(
          (a, b) => a.orderIndex - b.orderIndex
        );
        setMilestones(sortedMilestones);
        setFilteredMilestones(sortedMilestones);
      } else {
        throw new Error(responseData.message || 'Failed to fetch milestones');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching milestones:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Fetch milestones on component mount
  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);
  
  // Effect to filter milestones when search term changes
  useEffect(() => {
    const filtered = milestones.filter(milestone => 
      milestone.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      milestone.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMilestones(filtered);
  }, [searchTerm, milestones]);
  
  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Remove selected image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // FIXED: Updated toggle status function using PUT instead of PATCH
  const toggleStatus = async (id: number, currentStatus: string) => {
    try {
      // Add to updating IDs
      setUpdatingStatusIds(prev => [...prev, id]);
      
      // Get token from cookies
      const token = Cookies.get('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      
      // Find the current milestone in our state to use its data
      const currentMilestone = milestones.find(m => m.id === id);
      
      if (!currentMilestone) {
        throw new Error('Milestone not found');
      }
      
      // Prepare the update payload with all required fields from our current state
      const updatePayload = {
        title: currentMilestone.title,
        description: currentMilestone.description,
        orderIndex: currentMilestone.orderIndex,
        status: newStatus, // Only change the status
        image: currentMilestone.image // Keep the existing image
      };
      
      console.log(`Updating milestone ${id} status from ${currentStatus} to ${newStatus}`);
      console.log('Update payload:', updatePayload);
      
      // Send PUT request (same as edit endpoint)
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT', // Use PUT instead of PATCH
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
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
        // Show success toast
        setToast({
          message: `Milestone ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'} successfully!`,
          type: 'success'
        });
        
        // Update the local state
        setMilestones(prevMilestones => 
          prevMilestones.map(milestone => 
            milestone.id === id 
              ? { ...milestone, status: newStatus } 
              : milestone
          )
        );
      } else {
        throw new Error(responseData.message || 'Failed to update milestone status');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error updating milestone status:', err);
    } finally {
      // Remove from updating IDs
      setUpdatingStatusIds(prev => prev.filter(itemId => itemId !== id));
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
      
      // Create a FormData object for file upload
      const formData = new FormData();
      formData.append('title', formTitle);
      formData.append('description', formDescription);
      formData.append('orderIndex', formOrderIndex.toString());
      formData.append('status', 'ACTIVE'); // Default to ACTIVE for new entries
      
      // Append the image file if one is selected
      if (selectedImage) {
        formData.append('image', selectedImage);
      }
      
      console.log('Sending milestone data with image');
      
      if (isEditing && editId !== null) {
        // For editing, get the existing milestone to preserve its status
        const existingMilestone = milestones.find(m => m.id === editId);
        
        if (!existingMilestone) {
          throw new Error('Milestone not found');
        }
        
        // Use the existing status
        formData.set('status', existingMilestone.status);
        
        // If no new image is selected but there's an existing image, keep it
        if (!selectedImage && existingMilestone.image && existingMilestone.image.length > 0) {
          // We don't need to append anything for the existing image as the backend will keep it
          console.log('Keeping existing image:', existingMilestone.image);
        }
        
        // Update existing milestone via PUT request with FormData
        const response = await fetch(`${API_URL}/${editId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            // Don't set Content-Type header when using FormData, the browser will set it with the boundary
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
          // Show success toast
          setToast({
            message: 'Milestone updated successfully!',
            type: 'success'
          });
          
          // Refresh the list
          await fetchMilestones();
          // Close the modal
          setShowModal(false);
        } else {
          throw new Error(responseData.message || 'Failed to update milestone');
        }
      } else {
        // Create new milestone via POST request with FormData
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            // Don't set Content-Type header when using FormData, the browser will set it with the boundary
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
          // Show success toast
          setToast({
            message: 'Milestone created successfully!',
            type: 'success'
          });
          
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
    
    // Set current image if it exists
    if (milestone.image && milestone.image.length > 0) {
      setCurrentImage(milestone.image);
      
      // Set the preview to the current image URL
      const imageUrl = `http://localhost:7000/${milestone.image[0]}`;
      setImagePreview(imageUrl);
    } else {
      setCurrentImage(null);
      setImagePreview(null);
    }
    
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
          // Show success toast
          setToast({
            message: 'Milestone deleted successfully!',
            type: 'success'
          });
          
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
  
  // Reset form
  const resetForm = () => {
    setFormTitle('');
    setFormDescription('');
    setFormOrderIndex(null);
    setIsEditing(false);
    setEditId(null);
    setSelectedImage(null);
    setImagePreview(null);
    setCurrentImage(null);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };
  
  // View image in full size
  const handleViewImage = (imagePath: string) => {
    window.open(`http://localhost:7000/${imagePath}`, '_blank');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Animation Style */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
      
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Error notification */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-700">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="mt-2 text-sm text-red-700 hover:underline"
              >
                Dismiss
              </button>
            </div>
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
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
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
              <p className="mt-1 text-xs text-gray-500">Lower number will appear first</p>
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
            
            {/* Image Upload */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              <div className="space-y-3">
                {/* Image preview */}
                {imagePreview && (
                  <ImagePreview src={imagePreview} onRemove={handleRemoveImage} />
                )}
                
                {/* File input */}
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="mb-1 text-sm text-gray-500">
                        <span className="font-medium">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                    </div>
                    <input
                      id="image-upload"
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                
                {/* Image note */}
                <p className="text-xs text-gray-500">
                  {isEditing 
                    ? 'Upload a new image to replace the current one, or leave empty to keep the existing image.' 
                    : 'Upload an image to display with this milestone.'}
                </p>
              </div>
            </div>
            
            {/* Status field - only show for new entries, not for edits */}
            {!isEditing && (
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status:
                </label>
                <div className="flex items-center space-x-6">
                  <label className="inline-flex items-center p-2 rounded-lg bg-green-50 hover:bg-green-100 cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio h-4 w-4 text-blue-600"
                      name="status"
                      value="ACTIVE"
                      checked={true} // Always ACTIVE for new milestones
                      readOnly
                    />
                    <span className="ml-2 text-gray-700">Active</span>
                  </label>
                  {isEditing && (
                    <div className="ml-4 text-sm text-gray-500">
                      <span>Status can only be changed from the milestones list</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center"
              >
                {isEditing ? (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Update Milestone
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Save Milestone
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>
        
      {/* Loading state */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading milestones...</p>
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-medium">
                          {milestone.orderIndex}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {milestone.image && milestone.image.length > 0 ? (
                            <div className="relative group h-14 w-20">
                              <img 
                                src={`http://localhost:7000/${milestone.image[0]}`} 
                                alt={milestone.title}
                                className="h-14 w-20 object-cover rounded-md border border-gray-200"
                              />
                              <button
                                onClick={() => handleViewImage(milestone.image![0])}
                                className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-opacity rounded-md"
                                title="View image"
                              >
                                <Eye className="h-5 w-5 text-white opacity-0 group-hover:opacity-100" />
                              </button>
                            </div>
                          ) : (
                            <div className="h-14 w-20 bg-gray-100 rounded-md flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-gray-400" />
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
                        <div className="flex items-center">
                          {milestone.status === 'ACTIVE' ? (
                            <div className="flex items-center">
                              <span className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></span>
                              <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Active
                              </span>
                              <button
                                onClick={() => toggleStatus(milestone.id, milestone.status)}
                                className="ml-2 text-xs bg-yellow-50 text-yellow-600 hover:bg-yellow-100 px-2 py-1 rounded border border-yellow-200 transition-colors"
                                disabled={updatingStatusIds.includes(milestone.id)}
                              >
                                {updatingStatusIds.includes(milestone.id) ? '...' : 'Deactivate'}
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500 mr-2"></span>
                              <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Inactive
                              </span>
                              <button
                                onClick={() => toggleStatus(milestone.id, milestone.status)}
                                className="ml-2 text-xs bg-green-50 text-green-600 hover:bg-green-100 px-2 py-1 rounded border border-green-200 transition-colors"
                                disabled={updatingStatusIds.includes(milestone.id)}
                              >
                                {updatingStatusIds.includes(milestone.id) ? '...' : 'Activate'}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(milestone)}
                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors border border-blue-200"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(milestone.id)}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-200"
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
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
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