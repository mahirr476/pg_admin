// useContactForm.ts - Custom hook for contact form state management
"use client";

import { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { Submission, ApiResponse, ModalStates, API_BASE_URL } from '@/types/parasole/contact/contactForm';

export const useContactForm = () => {
  // State for storing contact form submissions
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for modals
  const [modalState, setModalState] = useState<ModalStates>({
    showViewModal: false,
    showDeleteModal: false,
    deleteLoading: false,
    selectedSubmission: null
  });

  // Function to fetch submissions from API
  const fetchSubmissions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get token from js-cookie
      const token = Cookies.get('token');
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      const response = await fetch(`${API_BASE_URL}/contact-form`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('The contact form submissions endpoint was not found. Please check your API configuration.');
        } else if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else {
          throw new Error(`Error fetching submissions: ${response.status}`);
        }
      }
      
      const data = await response.json() as ApiResponse<Submission[]>;
      
      // Check if the API response indicates success
      if (data.success === true && Array.isArray(data.data)) {
        setSubmissions(data.data);
      } else {
        // If the response structure is unexpected
        console.error('Unexpected API response structure:', data);
        throw new Error('Unexpected API response format. Please check console for details.');
      }
    } catch (error: any) {
      console.error('Error fetching contact form submissions:', error);
      setError(error.message || 'Failed to load submissions. Please try again later.');
      
      // If token is invalid, you might want to redirect to login
      if (error.message?.includes('Authentication failed') || error.message?.includes('token not found')) {
        // Optional: Redirect to login page
        // window.location.href = '/login';
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to handle delete submission
  const handleDeleteSubmission = async (id: string | number) => {
    if (!id) return;
    
    setModalState(prev => ({ ...prev, deleteLoading: true }));

    try {
      const token = Cookies.get('token');
      
      if (!token) {
        throw new Error('Authentication token not found.');
      }
      
      const response = await fetch(`${API_BASE_URL}/contact-form/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete submission: ${response.status}`);
      }
      
      const data = await response.json() as ApiResponse<any>;
      
      if (data.success) {
        // Remove the deleted submission from state
        setSubmissions(prevSubmissions => 
          prevSubmissions.filter(submission => submission.id !== id)
        );
        closeModals();
      } else {
        throw new Error(data.message || 'Failed to delete submission');
      }
    } catch (error: any) {
      console.error('Error deleting submission:', error);
      alert(error.message || 'Failed to delete submission');
    } finally {
      setModalState(prev => ({ ...prev, deleteLoading: false }));
    }
  };

  // Function to format date 
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    // If already in a readable format, return as is
    if (dateString.includes('at')) return dateString;
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return original if invalid
    
    return date.toLocaleString();
  };

  // Modal control functions
  const viewSubmission = (submission: Submission) => {
    setModalState({
      ...modalState,
      selectedSubmission: submission,
      showViewModal: true
    });
  };

  const confirmDelete = (submission: Submission) => {
    setModalState({
      ...modalState,
      selectedSubmission: submission,
      showDeleteModal: true
    });
  };

  const closeModals = () => {
    setModalState({
      ...modalState,
      showViewModal: false,
      showDeleteModal: false,
      selectedSubmission: null
    });
  };

  // Fetch submissions when component mounts
  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  return {
    submissions,
    isLoading,
    error,
    modalState,
    fetchSubmissions,
    handleDeleteSubmission,
    formatDate,
    viewSubmission,
    confirmDelete,
    closeModals
  };
};