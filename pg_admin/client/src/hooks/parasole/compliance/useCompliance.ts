"use client";
import { useState, useEffect, useCallback } from 'react';

export interface ComplianceFormData {
  id?: number;
  title: string;
  description: string;
  index: number;
  status?: string;
  image: File | null;
}

interface ComplianceItem {
  id: number;
  title: string;
  description: string;
  index: number;
  status: string;
  createdAt: string;
  images?: string[];
}

export const useCompliance = () => {
  const [items, setItems] = useState<ComplianceItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedDescription, setExpandedDescription] = useState<number | null>(null);
  const [highlightedRow, setHighlightedRow] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch items from API
  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check the correct API endpoint for your application
      // The 405 error suggests the endpoint might be different or require a different method
      // Options to try:
      // 1. Different endpoint path
      const response = await fetch('/api/parasole/compliance');
      
      // 2. If your API requires POST for fetching (uncommon but possible)
      // const response = await fetch('/api/compliance', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({}),  // Empty body or with pagination/filtering parameters
      // });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch compliance items: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setItems(data);
    } catch (err) {
      console.error('Error fetching compliance items:', err);
      setError('Failed to load compliance items. Please refresh the page.');
      
      // For development: Set some sample data if the API call fails
      // Remove this in production
      setItems([
        {
          id: 1,
          title: 'Sample Compliance Item',
          description: 'This is a sample compliance item for testing purposes when the API is unavailable.',
          index: 1,
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          images: []
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize on component mount
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Toggle description expansion
  const toggleDescription = (id: number) => {
    setExpandedDescription(expandedDescription === id ? null : id);
  };

  // Sort items
  const handleSort = (column: string) => {
    if (sortBy === column) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column and default to ascending
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  // Get sorted items based on current sort settings
  const getSortedItems = () => {
    return [...items].sort((a: any, b: any) => {
      // Handle different data types
      if (typeof a[sortBy] === 'string' && typeof b[sortBy] === 'string') {
        const comparison = a[sortBy].localeCompare(b[sortBy]);
        return sortDirection === 'asc' ? comparison : -comparison;
      } else {
        const comparison = a[sortBy] > b[sortBy] ? 1 : -1;
        return sortDirection === 'asc' ? comparison : -comparison;
      }
    });
  };

  // Handle form submission (add or edit)
  const handleSubmit = async (formData: ComplianceFormData, isEdit: boolean): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Update the API endpoints to match your application's structure
      const url = isEdit 
        ? `/api/parasole/compliance/${formData.id}` 
        : '/api/parasole/compliance';
      const method = isEdit ? 'PUT' : 'POST';
      
      // Create a FormData object for file uploads
      const data = new FormData();
      
      // Append non-file fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'image' && value !== null && value !== undefined) {
          data.append(key, String(value));
        }
      });
      
      // Append file if it exists
      if (formData.image) {
        data.append('image', formData.image);
      }
      
      console.log('Submitting to:', url);
      console.log('Method:', method);
      console.log('Form data keys:', [...data.keys()]);

      const response = await fetch(url, {
        method,
        body: data,
        // Don't set Content-Type header, let browser set it with boundary for FormData
      });

      if (!response.ok) {
        // Try to get detailed error message from response
        let errorDetail = '';
        try {
          const errorData = await response.json();
          errorDetail = errorData.message || JSON.stringify(errorData);
        } catch (e) {
          // If can't parse JSON, use status text
          errorDetail = response.statusText;
        }
        
        throw new Error(`Failed to ${isEdit ? 'update' : 'create'} compliance item: ${response.status} ${errorDetail}`);
      }

      // Refresh the list
      await fetchItems();
      return true;
    } catch (err) {
      console.error('Error submitting compliance form:', err);
      setError(`Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deletion
  const handleDelete = async (id: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Update API endpoint to match your application structure
      const response = await fetch(`/api/parasole/compliance/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete compliance item: ${response.status} ${response.statusText}`);
      }

      // Refresh the list
      await fetchItems();
      // Clear the delete confirmation
      setShowDeleteConfirm(null);
      return true;
    } catch (err) {
      console.error('Error deleting compliance item:', err);
      setError(`Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle status toggle
  const handleToggleStatus = async (item: ComplianceItem, newStatus: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Update API endpoint to match your application structure
      // Check if your API uses a different endpoint or method for status updates
      const response = await fetch(`/api/parasole/compliance/${item.id}/status`, {
        method: 'PATCH',  // Your API might use PUT instead of PATCH
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        // Try to get detailed error message from response
        let errorDetail = '';
        try {
          const errorData = await response.json();
          errorDetail = errorData.message || JSON.stringify(errorData);
        } catch (e) {
          // If can't parse JSON, use status text
          errorDetail = response.statusText;
        }
        
        throw new Error(`Failed to update status: ${response.status} ${errorDetail}`);
      }

      // Refresh the list
      await fetchItems();
      return true;
    } catch (err) {
      console.error('Error updating compliance status:', err);
      setError(`Failed to update status: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    items,
    isLoading,
    expandedDescription,
    highlightedRow,
    sortBy,
    sortDirection,
    showDeleteConfirm,
    error,
    handleSubmit,
    handleDelete,
    handleToggleStatus,
    handleSort,
    getSortedItems,
    toggleDescription,
    setHighlightedRow,
    setShowDeleteConfirm,
  };
};

export default useCompliance;