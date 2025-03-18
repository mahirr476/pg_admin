'use client';

import React, { useState, useEffect } from 'react';
import Cookies from "js-cookie";

interface AboutData {
  id?: number;
  title: string;
  description: string;
  image?: string;
  mission: string;
  vision: string;
  commitedTitle: string;
  commitedDescrip: string;
  about: string;
  greenMission: string;
  extraField: string;
  createdBy?: string;
  status?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: AboutData | AboutData[] | null;
}

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

// Toast component
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

// Add CSS for animation to your global CSS or add it inline
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

const AboutSection: React.FC = () => {
  // State for form inputs
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [mission, setMission] = useState<string>('');
  const [vision, setVision] = useState<string>('');
  const [commitedTitle, setCommitedTitle] = useState<string>('');
  const [commitedDescrip, setCommitedDescrip] = useState<string>('');
  const [about, setAbout] = useState<string>('');
  const [greenMission, setGreenMission] = useState<string>('');
  const [extraField, setExtraField] = useState<string>('');
  
  // State for loading and error
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Fetch existing data when component mounts
  useEffect(() => {
    const fetchAboutData = async () => {
      setIsLoading(true);
      
      try {
        const token = Cookies.get("token");
        
        if (!token) {
          throw new Error('Authentication token not found. Please log in again.');
        }
        
        const response = await fetch('http://localhost:7000/api/v1/group/about', {
          method: 'GET',
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
        
        const responseData: ApiResponse = await response.json();
        console.log('API Response:', responseData);
        
        if (responseData.success && responseData.data) {
          // Fill the form with data from API
          const data = Array.isArray(responseData.data) 
            ? responseData.data[0] 
            : responseData.data;
            
          setTitle(data.title || '');
          setDescription(data.description || '');
          if (data.image) {
            setImagePreview(`http://localhost:7000/${data.image}`);
          }
          setMission(data.mission || '');
          setVision(data.vision || '');
          setCommitedTitle(data.commitedTitle || '');
          setCommitedDescrip(data.commitedDescrip || '');
          setAbout(data.about || '');
          setGreenMission(data.greenMission || '');
          setExtraField(data.extraField || '');
        }
      } catch (err) {
        console.error('Error fetching about data:', err);
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setToast({ message: errorMessage, type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutData();
  }, []);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate required fields
      if (!title.trim()) {
        throw new Error('Title is required');
      }
      
      if (!description.trim()) {
        throw new Error('Description is required');
      }
      
      // Get token from cookies
      const token = Cookies.get("token");
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      // Create FormData for image upload
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('mission', mission);
      formData.append('vision', vision);
      formData.append('commitedTitle', commitedTitle);
      formData.append('commitedDescrip', commitedDescrip);
      formData.append('about', about);
      formData.append('greenMission', greenMission);
      formData.append('extraField', extraField);
      
      // Add image only if there's a new one
      if (image) {
        formData.append('image', image);
      }
      
      console.log('Sending payload:', {
        title,
        description,
        mission,
        vision,
        commitedTitle,
        commitedDescrip,
        about,
        greenMission,
        extraField,
        image: image ? image.name : 'No new image'
      });
      
      const response = await fetch('http://localhost:7000/api/v1/group/about', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Note: Don't set Content-Type here as FormData sets it automatically with boundary
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
      
      const responseData: ApiResponse = await response.json();
      console.log('API Response:', responseData);
      
      if (responseData.success) {
        const successMessage = 'About section updated successfully!';
        setToast({ message: successMessage, type: 'success' });
        
        // If there's data returned, update the form
        if (responseData.data) {
          const data = Array.isArray(responseData.data) 
            ? responseData.data[0] 
            : responseData.data;
            
          if (data.image) {
            setImagePreview(`http://localhost:7000/${data.image}`);
          }
        }
        
        // Reset the image input since we've already uploaded it
        setImage(null);
      } else {
        throw new Error(responseData.message || 'Failed to save data');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setIsLoading(false);
    }
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

  // Handle detailed error response
  const getErrorDetailsFromResponse = async (response: Response): Promise<string> => {
    try {
      const errorData = await response.json();
      return errorData.message || `Server error: ${response.status}`;
    } catch (e) {
      return `Server error: ${response.status}`;
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
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">About Section</h2>
          <p className="text-gray-500 mt-1">Manage the about page content for your website</p>
        </div>
        
        {/* Initial loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
        
        {/* Form Section */}
        <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  placeholder="Enter about title"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label htmlFor="commitedTitle" className="block text-sm font-medium text-gray-700 mb-2">
                  Committed Title
                </label>
                <input
                  type="text"
                  id="commitedTitle"
                  value={commitedTitle}
                  onChange={(e) => setCommitedTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  placeholder="Enter committed title"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description<span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                placeholder="Enter about description"
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-2">
                About
              </label>
              <textarea
                id="about"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                placeholder="Enter about content"
                disabled={isLoading}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="mission" className="block text-sm font-medium text-gray-700 mb-2">
                  Mission
                </label>
                <textarea
                  id="mission"
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  placeholder="Enter mission statement"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label htmlFor="vision" className="block text-sm font-medium text-gray-700 mb-2">
                  Vision
                </label>
                <textarea
                  id="vision"
                  value={vision}
                  onChange={(e) => setVision(e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  placeholder="Enter vision statement"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="commitedDescrip" className="block text-sm font-medium text-gray-700 mb-2">
                Committed Description
              </label>
              <textarea
                id="commitedDescrip"
                value={commitedDescrip}
                onChange={(e) => setCommitedDescrip(e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                placeholder="Enter committed description"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="greenMission" className="block text-sm font-medium text-gray-700 mb-2">
                Green Mission
              </label>
              <textarea
                id="greenMission"
                value={greenMission}
                onChange={(e) => setGreenMission(e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                placeholder="Enter green mission"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="extraField" className="block text-sm font-medium text-gray-700 mb-2">
                Extra Field
              </label>
              <textarea
                id="extraField"
                value={extraField}
                onChange={(e) => setExtraField(e.target.value)}
                rows={2}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                placeholder="Enter additional information"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Image
              </label>
              <input
                type="file"
                id="image"
                onChange={handleImageChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                accept="image/*"
                disabled={isLoading}
              />
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Image Preview:</p>
                  
                  {/* Fallback image approach that works reliably */}
                  <div className="h-40 w-full max-w-md rounded-lg border border-gray-300 overflow-hidden">
                    {/* Regular img tag that will always work */}
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  
                  {/* Add a direct link to help diagnose image URL issues */}
                  {!imagePreview.startsWith('data:') && (
                    <a href={imagePreview} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 mt-1 inline-block">
                      View direct image link
                    </a>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                className={`px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm flex items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isLoading ? 'Updating...' : 'Update About Section'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AboutSection;