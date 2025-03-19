'use client';

import React, { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import DirectorsTable from '././directorTable';
import DirectorForm from '././directorForm';

// Toast Component
interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-close after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-5 right-5 z-50 flex items-center space-x-2 bg-white rounded-lg shadow-lg p-4 border-l-4 animate-slideIn min-w-[300px]"
      style={{ 
        borderLeftColor: type === 'success' ? '#10B981' : '#EF4444',
        animation: 'slideIn 0.3s ease-out forwards'
      }}
    >
      <div className={`flex-shrink-0 w-6 h-6 ${type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
        {type === 'success' ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800">{message}</p>
      </div>
      <button 
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        onClick={onClose}
      >
        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

// Types
interface DirectorData {
  id?: number;
  orderIndex: number;
  name: string;
  designation: string;
  image?: string;
  shortDescription: string;
  longDescription: string;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  status?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: DirectorData[] | null;
}

// Toast animation style
const toastAnimationStyle = `
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
`;

const BoardDirectors: React.FC = () => {
  // UI State
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showTable, setShowTable] = useState<boolean>(true);
  
  // Form input states
  const [orderIndex, setOrderIndex] = useState<number>(1);
  const [name, setName] = useState<string>('');
  const [designation, setDesignation] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [shortDescription, setShortDescription] = useState<string>('');
  const [longDescription, setLongDescription] = useState<string>('');
  const [directorsData, setDirectorsData] = useState<DirectorData[]>([]);
  const [selectedDirectorId, setSelectedDirectorId] = useState<number | null>(null);
  
  // Keep track of original values to detect changes
  const [originalValues, setOriginalValues] = useState({
    orderIndex: 1,
    name: '',
    designation: '',
    shortDescription: '',
    longDescription: ''
  });
  
  // Track if fields have been modified
  const [isFormModified, setIsFormModified] = useState<boolean>(false);
  
  // State for loading and error
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Helper function to get error details from response
  const getErrorDetailsFromResponse = async (response: Response): Promise<string> => {
    try {
      const text = await response.text();
      console.log('Error response text:', text);
      
      try {
        const errorData = JSON.parse(text);
        return errorData.message || `Server error: ${response.status}`;
      } catch (e) {
        return text || `Server error: ${response.status}`;
      }
    } catch (e) {
      return `Server error: ${response.status}`;
    }
  };
  
  // Fetch directors data
  const fetchDirectors = async () => {
    setIsLoading(true);
    
    try {
      const token = Cookies.get("token");
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      console.log('Fetching directors data...');
      
      const response = await fetch('http://localhost:7000/api/v1/group/board', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
      });
      
      console.log('GET response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please log in again.');
        }
        const errorMessage = await getErrorDetailsFromResponse(response);
        throw new Error(errorMessage);
      }
      
      // Log the raw response text first
      const responseText = await response.text();
      console.log('Directors data response (raw):', responseText);
      
      // Then parse it as JSON
      let responseData: ApiResponse;
      try {
        responseData = JSON.parse(responseText);
        console.log('Directors data (parsed):', responseData);
      } catch (e) {
        console.error('Error parsing response JSON:', e);
        throw new Error('Invalid response format from server');
      }
      
      if (responseData.success && responseData.data && responseData.data.length > 0) {
        // Store all directors data
        setDirectorsData(responseData.data);
        setShowTable(true);
      } else {
        console.warn('No directors found or unexpected format:', responseData);
        setDirectorsData([]);
        setShowTable(false);
        setShowForm(true);
      }
    } catch (err) {
      console.error('Error fetching directors data:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fill form with director data
  const fillFormWithDirectorData = (director: DirectorData) => {
    setOrderIndex(director.orderIndex || 1);
    setName(director.name || '');
    setDesignation(director.designation || '');
    setShortDescription(director.shortDescription || '');
    setLongDescription(director.longDescription || '');
    
    // Set image preview if available
    if (director.image) {
      const timestamp = new Date().getTime();
      setImagePreview(`http://localhost:7000/${director.image}?t=${timestamp}`);
    } else {
      setImagePreview('');
    }
    
    // Store original values
    setOriginalValues({
      orderIndex: director.orderIndex || 1,
      name: director.name || '',
      designation: director.designation || '',
      shortDescription: director.shortDescription || '',
      longDescription: director.longDescription || ''
    });
    
    // Reset form modified state
    setIsFormModified(false);
  };
  
  // Fetch directors when component mounts
  useEffect(() => {
    fetchDirectors();
  }, []);
  
  // Check if form has been modified
  useEffect(() => {
    const isModified = 
      orderIndex !== originalValues.orderIndex || 
      name !== originalValues.name || 
      designation !== originalValues.designation || 
      shortDescription !== originalValues.shortDescription || 
      longDescription !== originalValues.longDescription ||
      image !== null; // If there's a new image, form is modified
    
    setIsFormModified(isModified);
  }, [orderIndex, name, designation, shortDescription, longDescription, image, originalValues]);
  
  // Reset form to empty state
  const resetForm = () => {
    setOrderIndex(1);
    setName('');
    setDesignation('');
    setImage(null);
    setImagePreview('');
    setShortDescription('');
    setLongDescription('');
    setSelectedDirectorId(null);
    
    // Reset original values
    setOriginalValues({
      orderIndex: 1,
      name: '',
      designation: '',
      shortDescription: '',
      longDescription: ''
    });
    
    // Reset form modified state
    setIsFormModified(false);
  };
  
  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!name.trim()) {
      setToast({ message: 'Name is required', type: 'error' });
      return;
    }
    
    if (!designation.trim()) {
      setToast({ message: 'Designation is required', type: 'error' });
      return;
    }
    
    if (!shortDescription.trim()) {
      setToast({ message: 'Short description is required', type: 'error' });
      return;
    }
    
    if (!longDescription.trim()) {
      setToast({ message: 'Long description is required', type: 'error' });
      return;
    }
    
    // If this is a new director and no image is selected
    if (!selectedDirectorId && !image) {
      setToast({ message: 'Please select an image', type: 'error' });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get token from cookies
      const token = Cookies.get("token");
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      // Create FormData for image upload
      const formData = new FormData();
      formData.append('orderIndex', orderIndex.toString());
      formData.append('name', name);
      formData.append('designation', designation);
      formData.append('shortDescription', shortDescription);
      formData.append('longDescription', longDescription);
      
      // Add image only if there's a new one
      if (image) {
        formData.append('image', image);
      }
      
      const url = selectedDirectorId 
        ? `http://localhost:7000/api/v1/group/board/${selectedDirectorId}` 
        : 'http://localhost:7000/api/v1/group/board';
      
      const method = selectedDirectorId ? 'PUT' : 'POST';
      
      console.log(`${method} request to ${url}`);
      console.log('Sending payload:', {
        orderIndex,
        name,
        designation,
        shortDescription,
        longDescription,
        image: image ? image.name : 'No new image'
      });
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
          // Note: Don't set Content-Type here as FormData sets it automatically with boundary
        },
        body: formData,
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please log in again.');
        }
        
        const errorMessage = await getErrorDetailsFromResponse(response);
        throw new Error(errorMessage);
      }
      
      // Get response data as text first
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      // Then try to parse it as JSON
      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('Response parsed:', responseData);
      } catch (e) {
        console.error('Error parsing response JSON:', e);
        throw new Error('Invalid response format from server');
      }
      
      if (responseData.success) {
        // Show success message
        setToast({ 
          message: selectedDirectorId 
            ? 'Director updated successfully!' 
            : 'Director created successfully!', 
          type: 'success' 
        });
        
        // Reset the file input
        const fileInput = document.getElementById('image') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
        
        // Reset image state
        setImage(null);
        
        // Fetch updated data
        await fetchDirectors();
        
        // Close the form and show the table
        setShowForm(false);
        setShowTable(true);
      } else {
        throw new Error(responseData.message || 'Failed to save director information');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle add new director
  const handleAddNew = () => {
    resetForm();
    setSelectedDirectorId(null);
    setShowForm(true);
    setShowTable(true); // Keep the table visible
  };
  
  // Handle edit director
  const handleEdit = (director: DirectorData) => {
    setSelectedDirectorId(director.id || null);
    fillFormWithDirectorData(director);
    setShowForm(true);
    setShowTable(true); // Keep the table visible
  };
  
  // Handle delete director
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this director?')) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const token = Cookies.get("token");
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      const response = await fetch(`http://localhost:7000/api/v1/group/board/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please log in again.');
        }
        const errorMessage = await getErrorDetailsFromResponse(response);
        throw new Error(errorMessage);
      }
      
      const responseData = await response.json();
      
      if (responseData.success) {
        setToast({ message: 'Director deleted successfully!', type: 'success' });
        
        // If we deleted the currently selected director
        if (selectedDirectorId === id) {
          resetForm();
          setSelectedDirectorId(null);
        }
        
        // Fetch updated data
        await fetchDirectors();
      } else {
        throw new Error(responseData.message || 'Failed to delete director');
      }
    } catch (err) {
      console.error('Error deleting director:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle status change (Activate/Deactivate)
  const handleStatusChange = async (id: number, newStatus: string) => {
    setIsLoading(true);
    
    try {
      const token = Cookies.get("token");
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      // Find the director to update
      const directorToUpdate = directorsData.find(d => d.id === id);
      if (!directorToUpdate) {
        throw new Error('Director not found');
      }
      
      // Prepare payload
      const formData = new FormData();
      formData.append('orderIndex', directorToUpdate.orderIndex.toString());
      formData.append('name', directorToUpdate.name);
      formData.append('designation', directorToUpdate.designation);
      formData.append('shortDescription', directorToUpdate.shortDescription);
      formData.append('longDescription', directorToUpdate.longDescription);
      formData.append('status', newStatus);
      
      const response = await fetch(`http://localhost:7000/api/v1/group/board/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please log in again.');
        }
        const errorMessage = await getErrorDetailsFromResponse(response);
        throw new Error(errorMessage);
      }
      
      const responseData = await response.json();
      
      if (responseData.success) {
        setToast({ 
          message: `Director ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'} successfully!`, 
          type: 'success' 
        });
        
        // Fetch updated data
        await fetchDirectors();
      } else {
        throw new Error(responseData.message || 'Failed to update director status');
      }
    } catch (err) {
      console.error('Error updating director status:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toast Animation Style */}
      <style>{toastAnimationStyle}</style>
      
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Board Directors</h2>
            <p className="text-gray-500 mt-1">Manage the board directors for your organization</p>
          </div>
          
          <button
            onClick={handleAddNew}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center font-medium shadow-sm hover:shadow"
            disabled={isLoading}
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
            Add New Director
          </button>
        </div>
        
        {/* Directors Table */}
        {showTable && (
          <DirectorsTable 
            directorsData={directorsData}
            isLoading={isLoading}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleStatusChange={handleStatusChange}
          />
        )}
        
        {/* Initial loading state */}
        {isLoading && !showForm && directorsData.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
        
        {/* Form Section */}
        {showForm && (
          <DirectorForm
            isLoading={isLoading}
            selectedDirectorId={selectedDirectorId}
            orderIndex={orderIndex}
            setOrderIndex={setOrderIndex}
            name={name}
            setName={setName}
            designation={designation}
            setDesignation={setDesignation}
            shortDescription={shortDescription}
            setShortDescription={setShortDescription}
            longDescription={longDescription}
            setLongDescription={setLongDescription}
            imagePreview={imagePreview}
            originalValues={originalValues}
            isFormModified={isFormModified}
            handleSubmit={handleSubmit}
            setShowForm={setShowForm}
            handleImageChange={handleImageChange}
          />
        )}
      </div>
    </>
  );
};

export default BoardDirectors;