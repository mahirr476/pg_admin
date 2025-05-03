import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { BuyerItem, BuyerDetailItem, BuyerDetailFormData, StatusType, ApiResponse } from './buyerDetail';

// Hook for buyer detail management
export const useBuyerDetail = () => {
  // State
  const [data, setData] = useState<BuyerDetailItem[]>([]);
  const [buyers, setBuyers] = useState<BuyerItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<BuyerDetailItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');

  // Form state - using the renamed interface
  const [formData, setFormData] = useState<BuyerDetailFormData>({
    index: '',
    title: '',
    description: '',
    buyerId: '',
    type: '',
    year: '',
    image: null
  });

  // API base URL
  const API_BASE_URL = 'http://localhost:7000';

  // Fetch all buyer details
  const fetchBuyerDetails = async (): Promise<void> => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get<ApiResponse<BuyerDetailItem[] | BuyerDetailItem>>(
        `${API_BASE_URL}/api/v1/parasole/buyer-detail`, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Handle both array and single object responses
      if (Array.isArray(response.data.data)) {
        setData(response.data.data);
      } else if (response.data.data && typeof response.data.data === 'object') {
        setData([response.data.data]);
      } else {
        setData([]);
      }
      
    } catch (error) {
      console.error('Error fetching buyer details:', error);
      setError('Failed to load buyer details. Please try again.');
    }
  };

  // Fetch list of buyers for dropdown
  const fetchBuyers = async (): Promise<void> => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get<ApiResponse<BuyerItem[] | BuyerItem>>(
        `${API_BASE_URL}/api/v1/parasole/buyer`, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Handle both array and single object responses
      if (Array.isArray(response.data.data)) {
        setBuyers(response.data.data);
      } else if (response.data.data && typeof response.data.data === 'object') {
        setBuyers([response.data.data]);
      } else {
        setBuyers([]);
      }
      
    } catch (error) {
      console.error('Error fetching buyers:', error);
      setError('Failed to load buyers. Please try again.');
    }
  };

  // Load data on initial render
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    Promise.all([fetchBuyerDetails(), fetchBuyers()])
      .finally(() => setIsLoading(false));
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Open modal to add new or edit existing item
  const openModal = (item: BuyerDetailItem | null = null): void => {
    setError(null);
    
    if (item) {
      setSelectedItem(item);
      setFormData({
        index: item.index.toString(),
        title: item.title,
        description: item.description,
        buyerId: item.buyerId.toString(),
        type: item.type || '',
        year: item.year || '',
        image: null
      });
      
      // Set preview image if available
      if (item.image) {
        setPreviewImage(
          item.image.startsWith('http')
            ? item.image
            : `${API_BASE_URL}/${item.image.replace(/^public\//, '')}`
        );
      } else {
        setPreviewImage('');
      }
      
    } else {
      setSelectedItem(null);
      setFormData({
        index: '',
        title: '',
        description: '',
        buyerId: buyers.length > 0 ? buyers[0].id.toString() : '',
        type: '',
        year: new Date().getFullYear().toString(),
        image: null
      });
      setPreviewImage('');
    }
    
    setIsModalOpen(true);
  };

  // Submit form (Create or Update)
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const token = Cookies.get('token');
      // Use the browser's built-in FormData, not our interface
      const formDataToSend = new window.FormData();
      
      formDataToSend.append('index', formData.index);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('buyerId', formData.buyerId);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('year', formData.year);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      if (selectedItem) {
        // Update
        await axios.put(
          `${API_BASE_URL}/api/v1/parasole/buyer-detail/${selectedItem.id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      } else {
        // Create
        await axios.post(
          `${API_BASE_URL}/api/v1/parasole/buyer-detail`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      }
      
      setIsModalOpen(false);
      fetchBuyerDetails();
    } catch (error) {
      console.error('Error saving buyer detail:', error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Failed to save data. Please check all fields.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Delete item
  const handleDelete = async (id: number): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this buyer detail?')) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const token = Cookies.get('token');
      await axios.delete(`${API_BASE_URL}/api/v1/parasole/buyer-detail/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchBuyerDetails();
    } catch (error) {
      console.error('Error deleting buyer detail:', error);
      setError('Failed to delete the item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle status
  const handleStatusToggle = async (item: BuyerDetailItem, newStatus: StatusType): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = Cookies.get('token');
      await axios.put(
        `${API_BASE_URL}/api/v1/parasole/buyer-detail/${item.id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      fetchBuyerDetails();
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get title from buyerId
  const getBuyerTitle = (id: number): string => {
    const buyer = buyers.find(b => b.id === id);
    return buyer ? buyer.title : 'N/A';
  };

  return {
    // State
    data,
    buyers,
    isModalOpen,
    isLoading,
    selectedItem,
    error,
    formData,
    previewImage,
    
    // Methods
    setIsModalOpen,
    handleInputChange,
    handleImageChange,
    openModal,
    handleSubmit,
    handleDelete,
    handleStatusToggle,
    getBuyerTitle,
    
    // Constants
    API_BASE_URL
  };
};

export default useBuyerDetail;