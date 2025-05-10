// useComplianceDetail.ts - Custom hook for Compliance Detail state management

import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { 
  ComplianceDetailItem, 
  ComplianceItem, 
  ComplianceDetailFormData,
  UseComplianceDetailResult
} from './complianceDetail';

// API base URL
const API_BASE_URL = 'http://localhost:7000';

export const useComplianceDetail = (): UseComplianceDetailResult => {
  // State
  const [data, setData] = useState<ComplianceDetailItem[]>([]);
  const [compliances, setCompliances] = useState<ComplianceItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<ComplianceDetailItem | null>(null);

  // Form state
  const [formData, setFormData] = useState<ComplianceDetailFormData>({
    index: '',
    title: '',
    description: '',
    shortDescrip: '',
    complianceId: '',
  });

  // Get auth token
  const getToken = (): string => {
    return Cookies.get('token') || '';
  };

  // Fetch all compliance details
  const fetchComplianceDetails = async (): Promise<void> => {
    try {
      const token = getToken();
      const response = await axios.get(`${API_BASE_URL}/api/v1/parasole/compliance-detail`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching compliance details:', error);
    }
  };

  // Fetch list of compliances for dropdown
  const fetchCompliances = async (): Promise<void> => {
    try {
      const token = getToken();
      const response = await axios.get(`${API_BASE_URL}/api/v1/parasole/compliance`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCompliances(response.data.data);
    } catch (error) {
      console.error('Error fetching compliances:', error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchComplianceDetails(), fetchCompliances()])
      .finally(() => setIsLoading(false));
  }, []);

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Close modal
  const closeModal = (): void => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setFormData({
      index: '',
      title: '',
      description: '',
      shortDescrip: '',
      complianceId: compliances.length > 0 ? compliances[0].id : '',
    });
  };

  // Open modal to add new or edit existing item
  const openModal = (item: ComplianceDetailItem | null = null): void => {
    if (item) {
      setSelectedItem(item);
      setFormData({
        index: item.index.toString(),
        title: item.title,
        description: item.description,
        shortDescrip: item.shortDescrip || '',
        complianceId: item.complianceId,
      });
    } else {
      setSelectedItem(null);
      setFormData({
        index: '',
        title: '',
        description: '',
        shortDescrip: '',
        complianceId: compliances.length > 0 ? compliances[0].id : '',
      });
    }
    setIsModalOpen(true);
  };

  // Submit form (Create or Update)
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = getToken();
      if (selectedItem) {
        // Update
        await axios.put(
          `${API_BASE_URL}/api/v1/parasole/compliance-detail/${selectedItem.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        // Create
        await axios.post(
          `${API_BASE_URL}/api/v1/parasole/compliance-detail`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }
      closeModal();
      fetchComplianceDetails();
    } catch (error) {
      console.error('Error saving compliance detail:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete item
  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this compliance detail?')) return;
    setIsLoading(true);
    try {
      const token = getToken();
      await axios.delete(`${API_BASE_URL}/api/v1/parasole/compliance-detail/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchComplianceDetails();
    } catch (error) {
      console.error('Error deleting compliance detail:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle status
  const handleStatusToggle = async (
    item: ComplianceDetailItem, 
    newStatus: 'ACTIVE' | 'INACTIVE'
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const token = getToken();
      await axios.put(
        `${API_BASE_URL}/api/v1/parasole/compliance-detail/${item.id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      fetchComplianceDetails();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get title from complianceId
  const getComplianceTitle = (id: string): string => {
    const comp = compliances.find(c => c.id === id);
    return comp ? comp.title : 'N/A';
  };

  // Return all state and actions
  return {
    // State
    data,
    compliances,
    isModalOpen,
    isLoading,
    selectedItem,
    formData,
    
    // Actions
    fetchComplianceDetails,
    fetchCompliances,
    handleInputChange,
    openModal,
    closeModal,
    handleSubmit,
    handleDelete,
    handleStatusToggle,
    getComplianceTitle
  };
};