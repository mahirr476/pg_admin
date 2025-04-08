'use client';

import React, { useState, useEffect } from 'react';
import Cookies from "js-cookie";

// Types
interface HeroData {
  id: number;
  title: string;
  description: string;
  index: number;
  createdBy: string;
  status: string;
}

interface ApiResponse {
  success: boolean;
  status?: string;
  message: string;
  data?: HeroData[] | HeroData | null;
  heroes?: HeroData[];
}

/**
 * HeroSection Component
 * Manages hero section content for the homepage
 */
const HeroSection: React.FC = () => {
  // ================ STATE MANAGEMENT ================
  // UI States
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showTable, setShowTable] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form States
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [index, setIndex] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editId, setEditId] = useState<number | null>(null);
  
  // Validation error states
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [indexError, setIndexError] = useState<string | null>(null);
  
  // Data State
  const [heroData, setHeroData] = useState<HeroData[]>([]);
  
  // Input validation functions
  const validateTitle = (value: string): boolean => {
    // Allow letters, spaces, and common punctuation, no numbers
    const regex = /^[A-Za-z\s.,!?;:'"()-]+$/;
    if (!value.trim()) {
      setTitleError('Title is required');
      return false;
    } else if (!regex.test(value)) {
      setTitleError('Title should only contain letters, not numbers');
      return false;
    }
    setTitleError(null);
    return true;
  };

  const validateDescription = (value: string): boolean => {
    // Allow letters, spaces, and common punctuation, no numbers
    const regex = /^[A-Za-z\s.,!?;:'"()-]+$/;
    if (!value.trim()) {
      setDescriptionError('Description is required');
      return false;
    } else if (!regex.test(value)) {
      setDescriptionError('Description should only contain letters, not numbers');
      return false;
    }
    setDescriptionError(null);
    return true;
  };

  const validateIndex = (value: string): boolean => {
    if (value.trim() === '') {
      setIndexError('Index is required');
      return false;
    }
    
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 0) {
      setIndexError('Index must be a positive number');
      return false;
    }
    
    setIndexError(null);
    return true;
  };

  // Handle title input change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    // Allow all input, but validate on change for user feedback
    setTitle(value);
    validateTitle(value);
  };

  // Handle description input change
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const value = e.target.value;
    // Allow all input, but validate on change for user feedback
    setDescription(value);
    validateDescription(value);
  };

  // Handle index input change
  const handleIndexChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    // Only allow non-negative numbers
    if (value === '' || /^\d+$/.test(value)) {
      setIndex(value);
      validateIndex(value);
    }
  };

  // ================ LIFECYCLE HOOKS ================
  // Fetch data on component mount
  useEffect(() => {
    fetchHeroes();
  }, []);

  // ================ API FUNCTIONS ================
  /**
   * Fetches all hero sections from the API
   */
  const fetchHeroes = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = Cookies.get("token");
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      const response = await fetch('http://localhost:7000/api/v1/group/hero', {
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
      
      // Check for both success formats (success: true or status: 'success')
      const isSuccess = responseData.success || responseData.status === 'success';
      
      if (isSuccess) {
        // Process response data based on where the heroes data is located
        processApiResponse(responseData);
      } else {
        console.error('API request was not successful:', responseData.message);
        setError(responseData.message || 'Failed to fetch data');
        setShowTable(true);
      }
    } catch (err) {
      console.error('Error fetching heroes:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setShowTable(true);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Processes API response and updates component state
   */
  const processApiResponse = (responseData: ApiResponse): void => {
    // First check if data comes in 'heroes' field
    if (Array.isArray(responseData.heroes)) {
      console.log('Found heroes array with', responseData.heroes.length, 'items');
      setHeroData(responseData.heroes);
      setShowTable(true);
    }
    // Fall back to the 'data' field if no heroes field exists
    else if (Array.isArray(responseData.data)) {
      console.log('Using data array instead of heroes');
      setHeroData(responseData.data);
      setShowTable(true);
    } 
    // Handle single hero object case
    else if (responseData.data && !Array.isArray(responseData.data)) {
      console.log('Single hero data object found');
      setHeroData([responseData.data as HeroData]);
      setShowTable(true);
    } 
    // Default when no data found
    else {
      console.log('No hero data found in response');
      setHeroData([]);
      setShowTable(true);
    }
  };

  /**
   * Submits hero form data (create or update)
   */
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    
    // Validate all fields before submission
    const isTitleValid = validateTitle(title);
    const isDescriptionValid = validateDescription(description);
    const isIndexValid = validateIndex(index);
    
    if (!isTitleValid || !isDescriptionValid || !isIndexValid) {
      return; // Stop submission if validation fails
    }
    
    setIsLoading(true);
    
    try {
      
      // Get token from cookies
      const token = Cookies.get("token");
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      const url = isEditing && editId !== null
        ? `http://localhost:7000/api/v1/group/hero/${editId}` 
        : 'http://localhost:7000/api/v1/group/hero';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      // Prepare payload
      const payload = {
        title,
        description,
        index: parseInt(index)
      };
      
      console.log('Sending payload:', payload);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please log in again.');
        }
        
        const errorMessage = await getErrorDetailsFromResponse(response);
        throw new Error(errorMessage);
      }
      
      const responseData: ApiResponse = await response.json();
      console.log('API Response after save:', responseData);
      
      if (responseData.success || responseData.status === 'success') {
        // Refresh all data
        await fetchHeroes();
        
        // Reset form and hide modal
        resetForm();
        setShowModal(false);
      } else {
        setError(responseData.message || 'Failed to save data');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Deletes a hero section
   */
  const handleDelete = async (id: number): Promise<void> => {
    if (!confirm('Are you sure you want to delete this hero section?')) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      const token = Cookies.get("token");
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      const response = await fetch(`http://localhost:7000/api/v1/group/hero/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please log in again.');
        }
        const errorMessage = await getErrorDetailsFromResponse(response);
        throw new Error(errorMessage);
      }
      
      const responseData: ApiResponse = await response.json();
      console.log('Delete Response:', responseData);
      
      if (responseData.success || responseData.status === 'success') {
        // Update local state without refetching
        setHeroData(prevData => prevData.filter(hero => hero.id !== id));
      } else {
        setError(responseData.message || 'Failed to delete item');
      }
    } catch (err) {
      console.error('Error deleting item:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Updates the status of a hero section
   */
  const updateStatus = async (id: number, newStatus: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      const token = Cookies.get("token");
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      console.log(`Setting status for ID ${id} to ${newStatus}`);
      
      // Need to include title, description, and index when updating
      const heroToUpdate = heroData.find(hero => hero.id === id);
      if (!heroToUpdate) {
        throw new Error('Hero not found');
      }
      
      const response = await fetch(`http://localhost:7000/api/v1/group/hero/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: heroToUpdate.title,
          description: heroToUpdate.description,
          index: heroToUpdate.index,
          status: newStatus
        }),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please log in again.');
        }
        const errorMessage = await getErrorDetailsFromResponse(response);
        throw new Error(errorMessage);
      }
      
      const responseData: ApiResponse = await response.json();
      console.log('Status Update Response:', responseData);
      
      if (responseData.success || responseData.status === 'success') {
        // Update the status in local state without refetching
        setHeroData(prevData => 
          prevData.map(hero => 
            hero.id === id 
              ? { ...hero, status: newStatus } 
              : hero
          )
        );
      } else {
        setError(responseData.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // ================ UI HELPERS ================
  /**
   * Prepares form for editing a hero section
   */
  const handleEdit = (hero: HeroData): void => {
    setTitle(hero.title);
    setDescription(hero.description);
    setIndex(hero.index.toString());
    setIsEditing(true);
    setEditId(hero.id);
    setShowModal(true);
    
    // Reset any validation errors
    setTitleError(null);
    setDescriptionError(null);
    setIndexError(null);
  };
  
  /**
   * Resets form state
   */
  const resetForm = (): void => {
    setTitle('');
    setDescription('');
    setIndex('');
    setIsEditing(false);
    setEditId(null);
    // Reset validation errors
    setTitleError(null);
    setDescriptionError(null);
    setIndexError(null);
  };
  
  /**
   * Cancels form editing/creation
   */
  const handleCancel = (): void => {
    resetForm();
    setShowModal(false);
    setError(null);
  };
  
  /**
   * Shows the form for adding a new hero section
   */
  const handleAddNew = (): void => {
    resetForm();
    setShowModal(true);
    setError(null);
  };

  /**
   * Extracts detailed error message from API response
   */
  const getErrorDetailsFromResponse = async (response: Response): Promise<string> => {
    try {
      const errorData: { message?: string } = await response.json();
      return errorData.message || `Server error: ${response.status}`;
    } catch (e) {
      return `Server error: ${response.status}`;
    }
  };

  // ================ RENDER UI ================
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Hero Section</h2>
          <p className="text-gray-500 mt-1">Manage the main banner content for your homepage</p>
          <p className="text-xs text-gray-400 mt-1">
            {heroData.length > 0 ? `Showing ${heroData.length} hero sections` : 'No hero sections found'}
          </p>
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
          Add Hero Section
        </button>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal Form Section */}
      {showModal && renderModal()}
      
      {/* Table Section */}
      {showTable && renderTable()}
      
      {/* Initial loading state */}
      {renderLoadingState()}
    </div>
  );

  /**
   * Renders the modal form
   */
  function renderModal(): JSX.Element {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                {isEditing ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit Hero Section
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Hero Section
                  </>
                )}
              </h3>
              <button 
                type="button" 
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="p-6">
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
                    onChange={handleTitleChange}
                    className={`w-full p-3 border ${titleError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm`}
                    placeholder="Enter hero title"
                    required
                    disabled={isLoading}
                  />
                  {titleError && (
                    <p className="mt-1 text-sm text-red-600">{titleError}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="index" className="block text-sm font-medium text-gray-700 mb-2">
                    Index<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="index"
                    value={index}
                    onChange={handleIndexChange}
                    className={`w-full p-3 border ${indexError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm`}
                    placeholder="Enter display order"
                    min="0"
                    required
                    disabled={isLoading}
                  />
                  {indexError && (
                    <p className="mt-1 text-sm text-red-600">{indexError}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description<span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={handleDescriptionChange}
                  rows={4}
                  className={`w-full p-3 border ${descriptionError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm`}
                  placeholder="Enter hero description"
                  required
                  disabled={isLoading}
                />
                {descriptionError && (
                  <p className="mt-1 text-sm text-red-600">{descriptionError}</p>
                )}
              </div>
            </form>
          </div>
          
          <div className="p-6 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium mr-3 shadow-sm"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className={`px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm flex items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoading ? 'Saving...' : (isEditing ? 'Update Section' : 'Save Section')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Renders the data table
   */
  function renderTable(): JSX.Element {
    return (
      <div className="overflow-x-auto">
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Index
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Created By
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {!isLoading && Array.isArray(heroData) && heroData.length > 0 ? (
                heroData.map((hero) => (
                  <tr key={hero.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                      {hero.index}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="max-w-[150px] overflow-hidden text-ellipsis">
                        {hero.title && hero.title.length > 30 
                          ? `${hero.title.substring(0, 30)}...` 
                          : hero.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="max-w-xs overflow-hidden text-ellipsis">
                        {hero.description && hero.description.length > 50 
                          ? `${hero.description.substring(0, 50)}...` 
                          : hero.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {hero.createdBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          hero.status === 'ACTIVE' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {hero.status === 'ACTIVE' ? (
                            <>
                              <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
                              Active
                            </>
                          ) : (
                            <>
                              <span className="h-2 w-2 rounded-full bg-red-500 mr-1.5"></span>
                              Inactive
                            </>
                          )}
                        </span>
                        
                        {hero.status === 'ACTIVE' ? (
                          <button
                            onClick={() => updateStatus(hero.id, 'INACTIVE')}
                            className="text-red-600 hover:text-red-900 text-xs bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors"
                            disabled={isLoading}
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => updateStatus(hero.id, 'ACTIVE')}
                            className="text-green-600 hover:text-green-900 text-xs bg-green-50 hover:bg-green-100 px-2 py-1 rounded transition-colors"
                            disabled={isLoading}
                          >
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(hero)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors mr-2"
                        disabled={isLoading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(hero.id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                        disabled={isLoading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                    {isLoading ? (
                      <div className="flex justify-center items-center">
                        <svg className="animate-spin h-5 w-5 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading hero sections...
                      </div>
                    ) : 'No hero sections found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  /**
   * Renders the loading spinner
   */
  function renderLoadingState(): JSX.Element | null {
    if (isLoading && !showModal && heroData.length === 0 && !error) {
      return (
        <div className="flex justify-center items-center py-12">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      );
    }
    return null;
  }
};

export default HeroSection;