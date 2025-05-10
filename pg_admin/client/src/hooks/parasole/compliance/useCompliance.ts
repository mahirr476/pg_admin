// useCompliance.ts - Custom hook for Compliance state management

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { ComplianceItem, ComplianceFormData, UseComplianceResult } from './compliance';

// API base URL
const API_BASE_URL = 'http://localhost:7000';

export const useCompliance = (): UseComplianceResult => {
  // State
  const [complianceData, setComplianceData] = useState<ComplianceItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ComplianceItem | null>(null);
  const [formData, setFormData] = useState<ComplianceFormData>({
    index: '',
    title: '',
    description: '',
    images: []
  });
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  // Get auth token
  const getToken = (): string => {
    return Cookies.get('token') || '';
  };

  // Fetch compliance data
  const fetchComplianceData = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const token = getToken();
      const response = await axios.get(`${API_BASE_URL}/api/v1/parasole/compliance`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setComplianceData(response.data.data);
    } catch (error) {
      console.error('Error fetching compliance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchComplianceData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData({
        ...formData,
        images: files
      });

      // Create preview URLs
      const previews = files.map(file => URL.createObjectURL(file));
      setPreviewImages(previews);
    }
  };

  // Open modal for creating new item
  const handleAddNew = (): void => {
    setSelectedItem(null);
    setFormData({
      index: '',
      title: '',
      description: '',
      images: []
    });
    setPreviewImages([]);
    setIsModalOpen(true);
  };

  // Open modal for editing existing item
  const handleEdit = (item: ComplianceItem): void => {
    setSelectedItem(item);
    setFormData({
      index: item.index.toString(),
      title: item.title,
      description: item.description,
      images: []
    });
    setPreviewImages(item.images.map(img => `${API_BASE_URL}/${img.replace(/^public\//, '')}`));
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = (): void => {
    setIsModalOpen(false);
    setFormData({
      index: '',
      title: '',
      description: '',
      images: []
    });
    setPreviewImages([]);
    setSelectedItem(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = getToken();
      const formDataToSend = new FormData();
      formDataToSend.append('index', formData.index);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);

      if (formData.images.length > 0) {
        formData.images.forEach(image => {
          formDataToSend.append('images', image);
        });
      }

      if (selectedItem) {
        // Update existing compliance
        await axios.put(`${API_BASE_URL}/api/v1/parasole/compliance/${selectedItem.id}`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Create new compliance
        await axios.post(`${API_BASE_URL}/api/v1/parasole/compliance`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      closeModal();
      fetchComplianceData();
    } catch (error) {
      console.error('Error saving compliance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle item deletion
  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this compliance item?')) return;
    setIsLoading(true);
    try {
      const token = getToken();
      await axios.delete(`${API_BASE_URL}/api/v1/parasole/compliance/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchComplianceData();
    } catch (error) {
      console.error('Error deleting compliance item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (item: ComplianceItem, newStatus: 'ACTIVE' | 'INACTIVE'): Promise<void> => {
    setIsLoading(true);
    try {
      const token = getToken();
      await axios.put(
        `${API_BASE_URL}/api/v1/parasole/compliance/${item.id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      fetchComplianceData();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Return all state and actions
  return {
    // State
    complianceData,
    isModalOpen,
    isLoading,
    selectedItem,
    formData,
    previewImages,
    
    // Actions
    fetchComplianceData,
    handleInputChange,
    handleImageUpload,
    handleAddNew,
    handleEdit,
    handleSubmit,
    handleDelete,
    handleStatusToggle,
    closeModal
  };
};