'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Cookies from "js-cookie";

interface BoardData {
  id?: number;
  title: string;
  description: string;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
}

interface ApiResponse {
  status: string;
  message: string;
  data?: BoardData;
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
        borderLeftColor: type === 'success' ? '#10B981' : '#EF4444'
      }}
    >
      <div className={`flex-shrink-0 w-6 h-6 ${type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
        {type === 'success' ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
        aria-label="Close notification"
      >
        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

const AboutBoard: React.FC = () => {
  // Form input states
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  
  // Keep track of original values to detect changes
  const [originalTitle, setOriginalTitle] = useState<string>('');
  const [originalDescription, setOriginalDescription] = useState<string>('');
  
  // Track if fields have been modified
  const [isFormModified, setIsFormModified] = useState<boolean>(false);
  
  // State for loading and error
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  
  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Handle detailed error response
  const getErrorDetailsFromResponse = async (response: Response): Promise<string> => {
    try {
      // Try to parse the response as text first to see what we're getting
      const text = await response.text();
      console.log('Error response text:', text);
      
      // Then try to parse it as JSON
      try {
        const errorData = JSON.parse(text);
        return errorData.message || `Server error: ${response.status}`;
      } catch (e) {
        // If it's not valid JSON, return the text
        return text || `Server error: ${response.status}`;
      }
    } catch (e) {
      return `Server error: ${response.status}`;
    }
  };

  // Explicitly defining the fetchBoardData function using useCallback
  // so we can call it again after update
  const fetchBoardData = useCallback(async () => {
    setIsFetching(true);
    
    try {
      const token = Cookies.get("token");
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      console.log('Fetching board data...');
      
      const response = await fetch('http://localhost:7000/api/v1/group/board/content', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        // Add cache control to prevent browser caching
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
      console.log('Board data response (raw):', responseText);
      
      // Then parse it as JSON
      let responseData: ApiResponse;
      try {
        responseData = JSON.parse(responseText);
        console.log('Board data (parsed):', responseData);
      } catch (e) {
        console.error('Error parsing response JSON:', e);
        throw new Error('Invalid response format from server');
      }
      
      if (responseData.status === 'success' && responseData.data) {
        // Fill the form with data from API
        console.log('Setting form data:', responseData.data);
        const newTitle = responseData.data.title || '';
        const newDescription = responseData.data.description || '';
        
        setTitle(newTitle);
        setDescription(newDescription);
        
        // Store original values to detect changes
        setOriginalTitle(newTitle);
        setOriginalDescription(newDescription);
        
        // Reset the form modified state
        setIsFormModified(false);
      } else {
        console.warn('No board data found or unexpected format:', responseData);
      }
    } catch (err) {
      console.error('Error fetching board data:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setIsFetching(false);
    }
  }, []);
  
  // Fetch existing data when component mounts
  useEffect(() => {
    fetchBoardData();
  }, [fetchBoardData]);
  
  // Check if form has been modified
  useEffect(() => {
    const isModified = 
      title !== originalTitle || 
      description !== originalDescription;
    
    setIsFormModified(isModified);
  }, [title, description, originalTitle, originalDescription]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent submission if the form hasn't been modified
    if (!isFormModified) {
      setToast({ 
        message: 'No changes detected. Please modify the form before submitting.', 
        type: 'error' 
      });
      return;
    }
    
    // Validate required fields
    if (!title.trim()) {
      setToast({ message: 'Title is required', type: 'error' });
      return;
    }
    
    if (!description.trim()) {
      setToast({ message: 'Description is required', type: 'error' });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get token from cookies
      const token = Cookies.get("token");
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      // Prepare payload
      const payload = {
        title: title.trim(),
        description: description.trim()
      };
      
      console.log('Sending update payload:', JSON.stringify(payload));
      
      const response = await fetch('http://localhost:7000/api/v1/group/board/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
      
      console.log('Update response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please log in again.');
        }
        
        const errorMessage = await getErrorDetailsFromResponse(response);
        throw new Error(errorMessage);
      }
      
      // Get response data as text first
      const responseText = await response.text();
      console.log('Update response text:', responseText);
      
      // Then try to parse it as JSON
      let responseData: ApiResponse;
      try {
        responseData = JSON.parse(responseText);
        console.log('Update response parsed:', responseData);
      } catch (e) {
        console.error('Error parsing update response JSON:', e);
        throw new Error('Invalid response format from server');
      }
      
      // Check for success status OR if the message contains specific success indicators
      if (
        responseData.status === 'success' || 
        (responseData.message && (
          responseData.message.toLowerCase().includes('success') ||
          responseData.message.toLowerCase().includes('created') ||
          responseData.message.toLowerCase().includes('updated')
        ))
      ) {
        // This is a success! Show the message from the server
        setToast({ 
          message: responseData.message || 'Board information updated successfully!', 
          type: 'success' 
        });
        
        // Important: Fetch the latest data from the server after update
        // This ensures we have the exact data that's in the database
        console.log('Update successful, refreshing data...');
        await fetchBoardData();
      } else {
        // This is truly an error
        throw new Error(responseData.message || 'Failed to update board information');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toast Animation Style */}
      <style>
        {`
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
        `}
      </style>
      
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
          <h2 className="text-2xl font-bold text-gray-800">Board Information</h2>
          <p className="text-gray-500 mt-1">Manage the board content for your website</p>
        </div>
        
        {/* Initial loading state */}
        {isFetching ? (
          <div className="flex justify-center items-center py-16">
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600">Loading board information...</p>
            </div>
          </div>
        ) : (
          /* Form Section */
          <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full p-4 border ${title !== originalTitle ? 'border-yellow-300 bg-yellow-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-colors`}
                  placeholder="Enter board title"
                  required
                  disabled={isLoading}
                />
                {title !== originalTitle && (
                  <p className="text-xs text-yellow-600 mt-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    This field has been modified
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description<span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className={`w-full p-4 border ${description !== originalDescription ? 'border-yellow-300 bg-yellow-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-colors`}
                  placeholder="Enter board description"
                  required
                  disabled={isLoading}
                />
                {description !== originalDescription && (
                  <p className="text-xs text-yellow-600 mt-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    This field has been modified
                  </p>
                )}
              </div>
              
              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  className={`px-8 py-4 ${isFormModified ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} text-white rounded-lg font-medium shadow-sm flex items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''} transition-colors`}
                  disabled={isLoading || !isFormModified}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : isFormModified ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Update Board Information
                    </>
                  ) : (
                    'No Changes to Save'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default AboutBoard;