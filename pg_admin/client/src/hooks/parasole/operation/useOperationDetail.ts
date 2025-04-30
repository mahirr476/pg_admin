// useOperationDetail.ts - Custom hook for Operation Detail state management

import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { 
  OperationDetailItem, 
  OperationItem, 
  OperationDetailFormData,
  UseOperationDetailResult
} from './operationDetail';

// API base URL
const API_BASE_URL = 'http://localhost:7000';

export const useOperationDetail = (): UseOperationDetailResult => {
  // State
  const [data, setData] = useState<OperationDetailItem[]>([]);
  const [operations, setOperations] = useState<OperationItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<OperationDetailItem | null>(null);

  // Form state
  const [formData, setFormData] = useState<OperationDetailFormData>({
    index: '',
    title: '',
    description: '',
    operationId: '',
  });

  // Get auth token
  const getToken = (): string => {
    return Cookies.get('token') || '';
  };

  // Fetch all operation details
  const fetchOperationDetails = async (): Promise<void> => {
    try {
      const token = getToken();
      const response = await axios.get(`${API_BASE_URL}/api/v1/parasole/operation-detail`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setData(response.data.data || []);
    } catch (error) {
      console.error('Error fetching operation details:', error);
    }
  };

  // Fetch list of operations for dropdown
  const fetchOperations = async (): Promise<void> => {
    try {
      const token = getToken();
      const response = await axios.get(`${API_BASE_URL}/api/v1/parasole/operation`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOperations(response.data.data || []);
    } catch (error) {
      console.error('Error fetching operations:', error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchOperationDetails(), fetchOperations()])
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
      operationId: operations.length > 0 ? operations[0].id.toString() : '',
    });
  };

  // Open modal to add new or edit existing item
  const openModal = (item: OperationDetailItem | null = null): void => {
    if (item) {
      setSelectedItem(item);
      setFormData({
        index: item.index.toString(),
        title: item.title,
        description: item.description,
        operationId: item.operationId.toString(),
      });
    } else {
      setSelectedItem(null);
      setFormData({
        index: '',
        title: '',
        description: '',
        operationId: operations.length > 0 ? operations[0].id.toString() : '',
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
      const dataToSend = {
        index: parseInt(formData.index),
        title: formData.title,
        description: formData.description,
        operationId: parseInt(formData.operationId)
      };

      if (selectedItem) {
        // Update
        await axios.put(
          `${API_BASE_URL}/api/v1/parasole/operation-detail/${selectedItem.id}`,
          dataToSend,
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
          `${API_BASE_URL}/api/v1/parasole/operation-detail`,
          dataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }
      closeModal();
      fetchOperationDetails();
    } catch (error) {
      console.error('Error saving operation detail:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete item
  const handleDelete = async (id: number): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this operation detail?')) return;
    setIsLoading(true);
    try {
      const token = getToken();
      await axios.delete(`${API_BASE_URL}/api/v1/parasole/operation-detail/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchOperationDetails();
    } catch (error) {
      console.error('Error deleting operation detail:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle status
  const handleStatusToggle = async (
    item: OperationDetailItem, 
    newStatus: 'ACTIVE' | 'INACTIVE'
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const token = getToken();
      await axios.put(
        `${API_BASE_URL}/api/v1/parasole/operation-detail/${item.id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      fetchOperationDetails();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get title from operationId
  const getOperationTitle = (id: number): string => {
    const op = operations.find(o => o.id === id);
    return op ? op.title : 'N/A';
  };

  // Return all state and actions
  return {
    // State
    data,
    operations,
    isModalOpen,
    isLoading,
    selectedItem,
    formData,
    
    // Actions
    fetchOperationDetails,
    fetchOperations,
    handleInputChange,
    openModal,
    closeModal,
    handleSubmit,
    handleDelete,
    handleStatusToggle,
    getOperationTitle
  };
};