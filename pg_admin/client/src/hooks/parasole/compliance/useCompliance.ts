// hooks/parasole/compliance/useCompliance.ts
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

// Define types
export interface Compliance {
  id: number;
  title: string;
  slug: string;
  description: string;
  images: string[];
  index: number;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface ComplianceFormData {
  id?: number;
  title: string;
  description: string;
  index: number;
  image?: File | null;
  status?: 'ACTIVE' | 'INACTIVE';
}

export type SortableColumn = 'id' | 'title' | 'index' | 'createdAt' | 'status';
export type SortDirection = 'asc' | 'desc';

const API_BASE_URL = 'http://localhost:7000/api/v1/parasole';

export const useCompliance = () => {
  const [compliances, setCompliances] = useState<Compliance[]>([]);
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

  // Fetch compliance data
  const fetchCompliances = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/compliance`, 
        getAuthConfig()
      );
      setCompliances(response.data.data);
    } catch (error) {
      console.error('Error fetching compliances:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getAuthConfig]);

  // Handle form submission (create or update)
  const handleSubmit = useCallback(async (formData: ComplianceFormData, isEdit: boolean): Promise<boolean> => {
    setIsLoading(true);
    
    const formDataToSend = new FormData();
    
    // Append all form data to FormData
    Object.keys(formData).forEach(key => {
      const k = key as keyof ComplianceFormData;
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

      if (isEdit && formData.id) {
        // Update existing record
        await axios.put(
          `${API_BASE_URL}/compliance/${formData.id}`, 
          formDataToSend,
          config
        );
      } else {
        // Create new record
        await axios.post(
          `${API_BASE_URL}/compliance`, 
          formDataToSend,
          config
        );
      }
      
      // Refresh data
      await fetchCompliances();
      return true;
    } catch (error) {
      console.error('Error submitting form:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchCompliances, getAuthToken]);

  // Handle delete
  const handleDelete = useCallback(async (id: number): Promise<boolean> => {
    setIsLoading(true);
    try {
      await axios.delete(
        `${API_BASE_URL}/compliance/${id}`,
        getAuthConfig()
      );
      await fetchCompliances();
      setShowDeleteConfirm(null);
      return true;
    } catch (error) {
      console.error('Error deleting item:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchCompliances, getAuthConfig]);

  // Handle status toggle
  const handleToggleStatus = useCallback(async (item: Compliance, newStatus: 'ACTIVE' | 'INACTIVE'): Promise<void> => {
    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('status', newStatus);
      
      await axios.put(
        `${API_BASE_URL}/compliance/${item.id}`, 
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${getAuthToken()}`
          }
        }
      );
      
      // Update the local state
      setCompliances(prev => prev.map(compliance => 
        compliance.id === item.id ? { ...compliance, status: newStatus } : compliance
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
    if (compliances.length === 0) return [];
    
    return [...compliances].sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];
      
      // Handle string comparisons for title
      if (sortBy === 'title' && typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [compliances, sortBy, sortDirection]);

  // Toggle description expansion
  const toggleDescription = useCallback((id: number) => {
    setExpandedDescription(expandedDescription === id ? null : id);
  }, [expandedDescription]);

  // Initial data fetch
  useEffect(() => {
    fetchCompliances();
  }, [fetchCompliances]);

  return {
    compliances,
    isLoading,
    expandedDescription,
    highlightedRow,
    sortBy,
    sortDirection,
    showDeleteConfirm,
    fetchCompliances,
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