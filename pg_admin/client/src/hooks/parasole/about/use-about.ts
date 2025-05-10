// hooks/parasole/about/use-about.ts
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { AboutItem, AboutFormData, AboutResponse } from '@/types/parasole/about/about';

const API_URL = 'http://localhost:7000/api/v1/parasole/about';

export const useAbout = () => {
  const [aboutData, setAboutData] = useState<AboutItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<AboutItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Get token from cookies
  const getAuthHeader = () => {
    const token = Cookies.get('token');
    return {
      Authorization: `Bearer ${token}`
    };
  };

  // Fetch all about items
  const fetchAboutData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get<AboutResponse>(API_URL, {
        headers: getAuthHeader()
      });
      
      setAboutData(response.data.data);
    } catch (err) {
      console.error('Error fetching about data:', err);
      setError('Failed to load about data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize data on component mount
  useEffect(() => {
    fetchAboutData();
  }, [fetchAboutData]);

  // Create new about item
  const createAboutItem = async (formData: AboutFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('index', formData.index.toString());
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      
      // Append each image to form data
      if (formData.images.length > 0) {
        formData.images.forEach(image => {
          formDataToSend.append('images', image);
        });
      }

      await axios.post(API_URL, formDataToSend, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'multipart/form-data'
        }
      });
      
      await fetchAboutData();
      return true;
    } catch (err) {
      console.error('Error creating about item:', err);
      setError('Failed to create about item. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update existing about item
  const updateAboutItem = async (id: number, formData: AboutFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('index', formData.index.toString());
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      
      // Append each image to form data
      if (formData.images.length > 0) {
        formData.images.forEach(image => {
          formDataToSend.append('images', image);
        });
      }

      await axios.put(`${API_URL}/${id}`, formDataToSend, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'multipart/form-data'
        }
      });
      
      await fetchAboutData();
      return true;
    } catch (err) {
      console.error('Error updating about item:', err);
      setError('Failed to update about item. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete about item
  const deleteAboutItem = async (id: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: getAuthHeader()
      });
      
      await fetchAboutData();
      return true;
    } catch (err) {
      console.error('Error deleting about item:', err);
      setError('Failed to delete about item. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle item status
  const toggleItemStatus = async (item: AboutItem, newStatus: 'ACTIVE' | 'INACTIVE') => {
    setIsLoading(true);
    setError(null);
    
    try {
      await axios.put(`${API_URL}/${item.id}`, 
        { status: newStatus },
        {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json'
          }
        }
      );
      
      await fetchAboutData();
      return true;
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Modal controls
  const openCreateModal = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };
  
  const openEditModal = (item: AboutItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return {
    aboutData,
    isLoading,
    error,
    selectedItem,
    isModalOpen,
    fetchAboutData,
    createAboutItem,
    updateAboutItem,
    deleteAboutItem,
    toggleItemStatus,
    openCreateModal,
    openEditModal,
    closeModal
  };
};