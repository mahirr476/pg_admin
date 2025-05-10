// hooks/parasole/home/use-homeDetail-item.ts

"use client";

import { useState, useCallback } from 'react';
import Cookies from 'js-cookie';
import { HeroDetail, Hero, ApiResponse } from '../../../types/parasole/home/homeDetail';

export const useHomeDetailItem = () => {
  const [heroDetails, setHeroDetails] = useState<HeroDetail[]>([]);
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const API_BASE_URL = 'http://localhost:7000/api/v1/parasole';
  
  const formatImageUrl = (imagePath: string): string => {
    if (!imagePath) return '/api/placeholder/400/400';
    
    // Handle various image path formats
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Remove leading slash if present to avoid double slashes
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return `http://localhost:7000/${cleanPath}`;
  };

  const fetchHeroDetails = useCallback(async (): Promise<void> => {
    const token = Cookies.get('token');
    
    if (!token) {
      setError('Authentication token not found. Please log in again.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/hero-detail`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const result: ApiResponse<HeroDetail[]> = await response.json();
      
      if (result.success) {
        setHeroDetails(result.data);
        setDebugInfo('Hero details data loaded successfully');
      } else {
        setError('Failed to fetch hero details');
        setDebugInfo(`Failed to fetch hero details: ${result.message}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError('Error connecting to the server');
      setDebugInfo(`Connection error: ${errorMessage}`);
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchHeroes = useCallback(async (): Promise<void> => {
    const token = Cookies.get('token');
    
    if (!token) {
      setError('Authentication token not found. Please log in again.');
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/hero`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const result: ApiResponse<Hero[]> = await response.json();
      
      if (result.success) {
        setHeroes(result.data || []);
      } else {
        console.error('Failed to fetch heroes:', result.message);
        setDebugInfo(prev => prev + ' | Failed to fetch heroes for dropdown');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error fetching heroes:', err);
      setDebugInfo(prev => prev + ` | Error fetching heroes: ${errorMessage}`);
    }
  }, []);

  const addHeroDetail = useCallback(async (formData: FormData): Promise<boolean> => {
    const token = Cookies.get('token');
    
    if (!token) {
      setError('Authentication token not found. Please log in again.');
      return false;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/hero-detail`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        setError(`Error: ${response.status} - ${errorText.substring(0, 100)}...`);
        return false;
      }
      
      const result = await response.json();
      
      if (result.success) {
        await fetchHeroDetails();  // Refresh the list
        return true;
      } else {
        setError(result.message || 'Failed to save data');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error submitting form: ${errorMessage}`);
      console.error('Submit error:', err);
      return false;
    }
  }, [fetchHeroDetails]);

  const updateHeroDetail = useCallback(async (id: number, formData: FormData): Promise<boolean> => {
    const token = Cookies.get('token');
    
    if (!token) {
      setError('Authentication token not found. Please log in again.');
      return false;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/hero-detail/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        setError(`Error: ${response.status} - ${errorText.substring(0, 100)}...`);
        return false;
      }
      
      const result = await response.json();
      
      if (result.success) {
        await fetchHeroDetails();  // Refresh the list
        return true;
      } else {
        setError(result.message || 'Failed to update data');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error updating item: ${errorMessage}`);
      console.error('Update error:', err);
      return false;
    }
  }, [fetchHeroDetails]);

  const deleteHeroDetail = useCallback(async (id: number): Promise<boolean> => {
    const token = Cookies.get('token');
    
    if (!token) {
      setError('Authentication token not found. Please log in again.');
      return false;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/hero-detail/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Remove from state to update UI immediately
        setHeroDetails(heroDetails.filter(detail => detail.id !== id));
        return true;
      } else {
        setError(result.message || 'Failed to delete');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error deleting item: ${errorMessage}`);
      console.error('Delete error:', err);
      return false;
    }
  }, [heroDetails]);

  const toggleHeroDetailStatus = useCallback(async (id: number, currentStatus: string): Promise<boolean> => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const token = Cookies.get('token');
    
    if (!token) {
      setError('Authentication token not found. Please log in again.');
      return false;
    }
    
    // Update UI optimistically
    setHeroDetails(heroDetails.map(detail => 
      detail.id === id ? { ...detail, status: newStatus } : detail
    ));
    
    try {
      // Try the status endpoint first
      const response = await fetch(`${API_BASE_URL}/hero-detail/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          return true;
        }
      }
      
      // Fallback: Try the main update endpoint
      const updateData = { status: newStatus };
      
      const putResponse = await fetch(`${API_BASE_URL}/hero-detail/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });
      
      if (!putResponse.ok) {
        // We won't revert the UI change to avoid flickering
        console.error(`Update endpoint failed: ${putResponse.status}`);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Status update error:', err);
      // We'll keep the UI updated even if there's an error
      return false;
    }
  }, [heroDetails]);

  return {
    heroDetails,
    heroes,
    isLoading,
    error,
    debugInfo,
    formatImageUrl,
    fetchHeroDetails,
    fetchHeroes,
    addHeroDetail,
    updateHeroDetail,
    deleteHeroDetail,
    toggleHeroDetailStatus
  };
};