'use client';

import React, { useState, useEffect } from 'react';
import Cookies from "js-cookie";

interface ImpactData {
  id: number;
  title: string;
  description: string;
  number: string;
  createdBy: string;
  status: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: ImpactData[] | ImpactData;
}

const ImpactSection: React.FC = () => {
  // UI States
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showTable, setShowTable] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form States
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [number, setNumber] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editId, setEditId] = useState<number | null>(null);
  
  // Validation error states
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [numberError, setNumberError] = useState<string | null>(null);
  
  // Data State
  const [impactData, setImpactData] = useState<ImpactData[]>([]);
  
  // Fetch all impacts on component mount
  useEffect(() => {
    fetchImpacts();
  }, []);

  // Fetch all impacts
  const fetchImpacts = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = Cookies.get("token");
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      const response = await fetch('http://localhost:7000/api/v1/group/impact', {
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
      
      if (responseData.success && Array.isArray(responseData.data)) {
        setImpactData(responseData.data);
        setShowTable(true);
      } else if (responseData.success && !Array.isArray(responseData.data)) {
        // Handle single impact data case
        setImpactData([responseData.data as ImpactData]);
        setShowTable(true);
      } else {
        setError(responseData.message || 'Failed to fetch data');
      }
    } catch (err) {
      console.error('Error fetching impacts:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
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

  // Allow numbers and special characters, but not letters
  const validateNumber = (value: string): boolean => {
    // Allow numbers and special chars, but no letters (a-z, A-Z)
    const hasLetters = /[a-zA-Z]/.test(value);
    
    if (!value.trim()) {
      setNumberError('Number is required');
      return false;
    } else if (hasLetters) {
      setNumberError('Number should not contain letters');
      return false;
    }
    
    setNumberError(null);
    return true;
  };

  // Handle title input change
  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
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

  // Handle number input change
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    
    // Only allow if it doesn't contain letters
    if (!/[a-zA-Z]/.test(value)) {
      setNumber(value);
      validateNumber(value);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    
    // Validate all fields before submission
    const isTitleValid = validateTitle(title);
    const isDescriptionValid = validateDescription(description);
    const isNumberValid = validateNumber(number);
    
    if (!isTitleValid || !isDescriptionValid || !isNumberValid) {
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
        ? `http://localhost:7000/api/v1/group/impact/${editId}` 
        : 'http://localhost:7000/api/v1/group/impact';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      // Prepare payload
      const payload = {
        title,
        description,
        number
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
      console.log('API Response:', responseData);
      
      if (responseData.success) {
        // Refresh all data
        await fetchImpacts();
        
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
  
  // Handle edit
  const handleEdit = (impact: ImpactData): void => {
    setTitle(impact.title);
    setDescription(impact.description);
    setNumber(impact.number);
    setIsEditing(true);
    setEditId(impact.id);
    setShowModal(true);
    
    // Reset any validation errors
    setTitleError(null);
    setDescriptionError(null);
    setNumberError(null);
  };
  
  // Handle delete
  const handleDelete = async (id: number): Promise<void> => {
    if (!confirm('Are you sure you want to delete this impact section?')) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Get token from cookies
      const token = Cookies.get("token");
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      const response = await fetch(`http://localhost:7000/api/v1/group/impact/${id}`, {
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
      
      const responseData: { success: boolean; message: string } = await response.json();
      console.log('Delete Response:', responseData);
      
      if (responseData.success) {
        // Update local state without refetching
        setImpactData(prevData => prevData.filter(impact => impact.id !== id));
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
  
  // Update status directly with value
  const updateStatus = async (id: number, newStatus: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Get token from cookies
      const token = Cookies.get("token");
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      console.log(`Setting status for ID ${id} to ${newStatus}`);
      
      // Need to include title, description, and number when updating
      const impactToUpdate = impactData.find(impact => impact.id === id);
      if (!impactToUpdate) {
        throw new Error('Impact not found');
      }
      
      const response = await fetch(`http://localhost:7000/api/v1/group/impact/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: impactToUpdate.title,
          description: impactToUpdate.description,
          number: impactToUpdate.number,
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
      
      const responseData: { success: boolean; message: string } = await response.json();
      console.log('Status Update Response:', responseData);
      
      if (responseData.success) {
        // Update the status in local state without refetching
        setImpactData(prevData => 
          prevData.map(impact => 
            impact.id === id 
              ? { ...impact, status: newStatus } 
              : impact
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
  
  // Reset form
  const resetForm = (): void => {
    setTitle('');
    setDescription('');
    setNumber('');
    setIsEditing(false);
    setEditId(null);
    // Reset validation errors
    setTitleError(null);
    setDescriptionError(null);
    setNumberError(null);
  };
  
  // Handle cancel
  const handleCancel = (): void => {
    resetForm();
    setShowModal(false);
    setError(null);
  };
  
  // Add new button click
  const handleAddNew = (): void => {
    resetForm();
    setShowModal(true);
    setError(null);
  };

  // Handle detailed error response
  const getErrorDetailsFromResponse = async (response: Response): Promise<string> => {
    try {
      const errorData: { message?: string } = await response.json();
      return errorData.message || `Server error: ${response.status}`;
    } catch (e) {
      return `Server error: ${response.status}`;
    }
  };

  /**
   * Renders the loading spinner
   */
  function renderLoadingState(): JSX.Element | null {
    if (isLoading && !showModal && impactData.length === 0 && !error) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="relative">
            <div className="h-20 w-20 rounded-full border-t-4 border-b-4 border-emerald-500 animate-spin"></div>
            <div className="absolute top-0 left-0 h-20 w-20 rounded-full border-t-4 border-b-4 border-green-500 animate-spin" style={{ animationDirection: 'reverse', opacity: 0.6 }}></div>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Impact Section</h2>
          <p className="text-gray-500 mt-1">Manage key metrics and achievements for your homepage</p>
          <p className="text-xs text-gray-400 mt-1">
            {impactData.length > 0 ? `Showing ${impactData.length} impact sections` : 'No impact sections found'}
          </p>
        </div>
        
        <button
          onClick={handleAddNew}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all duration-200 flex items-center font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
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
          Add Impact Section
        </button>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md animate-fadeIn">
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
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out scale-100">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  {isEditing ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Edit Impact Section
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add Impact Section
                    </>
                  )}
                </h3>
                <button 
                  type="button" 
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors duration-200 hover:bg-gray-100 rounded-full p-1"
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
                    <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-2">
                      Number<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v1a1 1 0 102 0v-1zm1-4a1 1 0 011 1v3a1 1 0 11-2 0V9a1 1 0 011-1zm3-1a1 1 0 100 2h.01a1 1 0 100-2H12zm0 4a1 1 0 100 2h.01a1 1 0 100-2H12z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="number"
                        value={number}
                        onChange={handleNumberChange}
                        className={`w-full p-3 pl-10 border ${numberError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'} rounded-lg shadow-sm transition-all duration-200`}
                        placeholder="e.g. 500+, 20%, $1.5M, etc."
                        required
                        disabled={isLoading}
                      />
                    </div>
                    {numberError && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {numberError}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Title<span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="title"
                      value={title}
                      onChange={handleTitleChange}
                      className={`w-full p-3 border ${titleError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'} rounded-lg shadow-sm transition-all duration-200`}
                      placeholder="e.g. Projects Completed"
                      rows={3}
                      required
                      disabled={isLoading}
                      style={{ resize: 'vertical', minHeight: '95px' }}
                    />
                    {titleError && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {titleError}
                      </p>
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
                    rows={6}
                    className={`w-full p-3 border ${descriptionError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'} rounded-lg shadow-sm transition-all duration-200`}
                    placeholder="Enter a brief impact description"
                    required
                    disabled={isLoading}
                    style={{ resize: 'vertical' }}
                  />
                  {descriptionError && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {descriptionError}
                    </p>
                  )}
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end bg-gray-50">
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium mr-3 shadow-sm transition-all duration-200 hover:shadow"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className={`px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:from-emerald-700 hover:to-green-700 font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center transform hover:-translate-y-0.5 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
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
      )}
      
      {/* Table Section */}
      <div className="overflow-x-auto">
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-lg ">
          <table className="min-w-full divide-y divide-gray-200 ">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Number
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Created By
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {!isLoading && Array.isArray(impactData) && impactData.length > 0 ? (
                impactData.map((impact, idx) => (
                  <tr key={impact.id} className={`hover:bg-gray-50 transition-colors duration-150 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-200">
                        {impact.number}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="max-w-[150px] overflow-hidden text-ellipsis" title={impact.title}>
                        {impact.title && impact.title.length > 30 
                          ? `${impact.title.substring(0, 30)}...` 
                          : impact.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="max-w-xs overflow-hidden text-ellipsis" title={impact.description}>
                        {impact.description && impact.description.length > 50 
                          ? `${impact.description.substring(0, 50)}...` 
                          : impact.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center mr-2">
                          <span className="text-xs font-medium text-emerald-800">
                            {impact.createdBy.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span>{impact.createdBy}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          impact.status === 'ACTIVE' 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {impact.status === 'ACTIVE' ? (
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
                        
                        {impact.status === 'ACTIVE' ? (
                          <button
                            onClick={() => updateStatus(impact.id, 'INACTIVE')}
                            className="text-red-600 hover:text-red-800 text-xs bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg transition-colors border border-red-200 hover:shadow-sm"
                            disabled={isLoading}
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => updateStatus(impact.id, 'ACTIVE')}
                            className="text-green-600 hover:text-green-800 text-xs bg-green-50 hover:bg-green-100 px-2.5 py-1 rounded-lg transition-colors border border-green-200 hover:shadow-sm"
                            disabled={isLoading}
                          >
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(impact)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors border border-blue-200 hover:shadow-sm flex items-center"
                          disabled={isLoading}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(impact.id)}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors border border-red-200 hover:shadow-sm flex items-center"
                          disabled={isLoading}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                    {isLoading ? (
                      <div className="flex justify-center items-center">
                        <svg className="animate-spin h-5 w-5 text-emerald-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading impact sections...
                      </div>
                    ) : (
                      <div className="py-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <p className="text-gray-500">No impact sections found</p>
                        <button 
                          onClick={handleAddNew}
                          className="mt-3 px-4 py-2 text-sm bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-200"
                        >
                          Add your first impact
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Initial loading state */}
      {renderLoadingState()}
    </div>
  );
};

export default ImpactSection;