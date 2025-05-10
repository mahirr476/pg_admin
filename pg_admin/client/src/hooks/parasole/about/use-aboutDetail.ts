// hooks/parasole/about/use-aboutDetail.ts
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { 
  AboutDetail, 
  AboutOption, 
  AboutDetailFormData,
  SortableColumn,
  SortDirection
} from '../../../types/parasole/about/aboutDetail';

const API_BASE_URL = 'http://localhost:7000/api/v1/parasole';

export const useAboutDetail = () => {
  const [aboutDetails, setAboutDetails] = useState<AboutDetail[]>([]);
  const [aboutOptions, setAboutOptions] = useState<AboutOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [expandedDescription, setExpandedDescription] = useState<number | null>(null);
  const [highlightedRow, setHighlightedRow] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortableColumn>("index");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  // Get token from cookies
  const getAuthToken = useCallback((): string => {
    return Cookies.get('token') || '';
  }, []);

  // Configure axios with auth token
  const getAuthConfig = useCallback(() => {
    return {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    };
  }, [getAuthToken]);

  // Fetch about details data
  const fetchAboutDetails = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/about-detail`, 
        getAuthConfig()
      );
      setAboutDetails(response.data.data);
    } catch (error) {
      console.error('Error fetching about details:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getAuthConfig]);

  // Fetch about options for dropdown
  const fetchAboutOptions = useCallback(async (): Promise<void> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/about`,
        getAuthConfig()
      );
      setAboutOptions(response.data.data);
    } catch (error) {
      console.error('Error fetching about options:', error);
    }
  }, [getAuthConfig]);

  // Handle form submission (create or update)
  const handleSubmit = useCallback(async (formData: AboutDetailFormData, isEdit: boolean): Promise<boolean> => {
    setIsLoading(true);
    
    const formDataToSend = new FormData();
    
    // Append all form data to FormData
    Object.keys(formData).forEach(key => {
      const k = key as keyof AboutDetailFormData;
      if (k === 'image' && formData[k]) {
        formDataToSend.append(k, formData[k] as Blob);
      } else if (formData[k] !== null && formData[k] !== undefined) {
        formDataToSend.append(k, String(formData[k]));
      }
    });

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${getAuthToken()}`
        }
      };

      if (isEdit) {
        // Update existing record
        await axios.put(
          `${API_BASE_URL}/about-detail/${formData.id}`, 
          formDataToSend,
          config
        );
      } else {
        // Create new record
        await axios.post(
          `${API_BASE_URL}/about-detail`, 
          formDataToSend,
          config
        );
      }
      
      // Refresh data
      await fetchAboutDetails();
      return true;
    } catch (error) {
      console.error('Error submitting form:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchAboutDetails, getAuthToken]);

  // Handle delete
  const handleDelete = useCallback(async (id: number): Promise<boolean> => {
    setIsLoading(true);
    try {
      await axios.delete(
        `${API_BASE_URL}/about-detail/${id}`,
        getAuthConfig()
      );
      await fetchAboutDetails();
      setShowDeleteConfirm(null);
      return true;
    } catch (error) {
      console.error('Error deleting item:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchAboutDetails, getAuthConfig]);

  // Handle status toggle
  const handleToggleStatus = useCallback(async (item: AboutDetail, newStatus: 'ACTIVE' | 'INACTIVE'): Promise<void> => {
    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('status', newStatus);
      
      await axios.put(
        `${API_BASE_URL}/about-detail/${item.id}`, 
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${getAuthToken()}`
          }
        }
      );
      
      // Update the local state
      setAboutDetails(prev => prev.map(detail => 
        detail.id === item.id ? { ...detail, status: newStatus } : detail
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getAuthToken]);

  // Handle sorting
  const handleSort = useCallback((column: SortableColumn) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  }, [sortBy, sortDirection]);

  // Get sorted items
  const getSortedItems = useCallback(() => {
    if (aboutDetails.length === 0) return [];
    
    return [...aboutDetails].sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];
      
      // Handle string comparisons for title
      if (sortBy === 'title' && typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      // Handle comparison for about title
      if (sortBy === 'about' && a.about && b.about) {
        aValue = a.about.title.toLowerCase();
        bValue = b.about.title.toLowerCase();
      }
      
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [aboutDetails, sortBy, sortDirection]);

  // Toggle description expansion
  const toggleDescription = useCallback((id: number) => {
    setExpandedDescription(expandedDescription === id ? null : id);
  }, [expandedDescription]);

  // Initial data fetch
  useEffect(() => {
    fetchAboutDetails();
    fetchAboutOptions();
  }, [fetchAboutDetails, fetchAboutOptions]);

  return {
    aboutDetails,
    aboutOptions,
    isLoading,
    expandedDescription,
    highlightedRow,
    sortBy,
    sortDirection,
    showDeleteConfirm,
    fetchAboutDetails,
    fetchAboutOptions,
    handleSubmit,
    handleDelete,
    handleToggleStatus,
    handleSort,
    getSortedItems,
    toggleDescription,
    setHighlightedRow,
    setShowDeleteConfirm
  };
};