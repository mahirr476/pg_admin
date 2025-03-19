'use client';

import React, { useState, useEffect } from 'react';
import Cookies from "js-cookie";

interface BoardData {
  id: number;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

interface BoardResponse {
  status: string;
  message: string;
  board: BoardData;
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

const AboutBoard: React.FC = () => {
  // Form input states
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  
  // State for loading and error
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Fetch existing data when component mounts
  useEffect(() => {
    fetchBoardData();
  }, []);

  // Function to fetch initial board data
  const fetchBoardData = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      const token = Cookies.get('token');
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const response = await fetch('http://localhost:7000/api/v1/group/board/content', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please log in again.');
        }
        
        const errorMessage = await getErrorDetailsFromResponse(response);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Fetched board data:', data);
      
      // Populate form fields with existing data
      if (data && data.board) {
        setTitle(data.board.title || '');
        setDescription(data.board.description || '');
      }
      
    } catch (err) {
      console.error('Error fetching board data:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

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
      const token = Cookies.get('token');
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      console.log('Sending payload:', {
        title,
        description
      });
      
      const response = await fetch('http://localhost:7000/api/v1/group/board/content', {
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
        
        const errorMessage = await getErrorDetailsFromResponse(response);
        throw new Error(errorMessage);
      }
      
      const responseData = await response.json();
      console.log('API Response:', responseData);
      
      if (responseData.status === 'success') {
        setToast({ message: 'Board information updated successfully!', type: 'success' });
      } else {
        throw new Error(responseData.message || 'Failed to update board');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setIsLoading(false);
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
          <h2 className="text-2xl font-bold text-gray-800">Board Information</h2>
          <p className="text-gray-500 mt-1">Manage the board content for your website</p>
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
                placeholder="Enter board title"
                required
                disabled={isLoading}
              />
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
                placeholder="Enter board description"
                required
                disabled={isLoading}
              />
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
                {isLoading ? 'Updating...' : 'Update Board Information'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AboutBoard;