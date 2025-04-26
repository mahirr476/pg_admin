// hooks/parasole/home/use-home-item.ts
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { HeroItem, HeroItemFormData, ApiResponse } from "@/types/parasole/home/home";

const API_URL = "http://localhost:7000/api/v1/parasole/hero";

// Helper function to format image URL
export function formatImageUrl(imagePath: string) {
  if (!imagePath) return "";
  
  // Handle both http/https URLs and relative paths
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Remove any leading slashes from the path
  let cleanPath = imagePath.replace(/^\/+/, '');
  
  // If the path starts with 'public/', we need to remove it for proper serving
  if (cleanPath.startsWith('public/')) {
    cleanPath = cleanPath.replace('public/', '');
  }
  
  return `http://localhost:7000/${cleanPath}`;
}

export function useHomeItem() {
  const [items, setItems] = useState<HeroItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = Cookies.get('token');
    
    if (!token) {
      console.warn("No token found in cookies");
      return {};
    }
    
    return {
      'Authorization': `Bearer ${token}`
    };
  };

  // Fetch items from API
  const fetchItems = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(API_URL, {
        headers: {
          ...getAuthHeaders()
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`API error: ${response.status} - ${errorText || "No details provided"}`);
      }
      
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        // Handle both array and single object responses
        const heroItems = Array.isArray(data.data) ? data.data : (data.data ? [data.data] : []);
        setItems(heroItems);
        
        // Success toast
        toast.success("Content loaded successfully", {
          position: "top-right",
        });
      } else {
        throw new Error(data.message || "Failed to fetch data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      toast.error("Failed to load content", {
        description: err instanceof Error ? err.message : "An unknown error occurred",
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchItems();
  }, []);

  // Add new item
  const addItem = async (formData: HeroItemFormData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("status", formData.status);
      form.append("index", formData.index.toString());
      
      if (formData.image) {
        form.append("image", formData.image);
      }
      
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          ...getAuthHeaders()
        },
        body: form,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText || "No details provided"}`);
      }
      
      const result: ApiResponse = await response.json();
      
      if (result.success) {
        // Refresh the list after adding
        await fetchItems();
        
        toast.success("New Item Added", {
          description: `"${formData.title}" has been created successfully.`,
          position: "top-right",
        });
        
        return true;
      } else {
        throw new Error(result.message || "Failed to add item");
      }
    } catch (err) {
      toast.error("Failed to add item", {
        description: err instanceof Error ? err.message : "An unknown error occurred",
        position: "top-right",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update existing item
  const updateItem = async (id: number, formData: HeroItemFormData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("status", formData.status);
      form.append("index", formData.index.toString());
      
      if (formData.image) {
        form.append("image", formData.image);
      }
      
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          ...getAuthHeaders()
        },
        body: form,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText || "No details provided"}`);
      }
      
      const result: ApiResponse = await response.json();
      
      if (result.success) {
        // Refresh the list after updating
        await fetchItems();
        
        toast.success("Item Updated Successfully", {
          description: `Changes to "${formData.title}" have been saved.`,
          position: "top-right",
        });
        
        return true;
      } else {
        throw new Error(result.message || "Failed to update item");
      }
    } catch (err) {
      toast.error("Failed to update item", {
        description: err instanceof Error ? err.message : "An unknown error occurred",
        position: "top-right",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an item
  const deleteItem = async (id: number): Promise<boolean> => {
    const itemToDelete = items.find(item => item.id === id);
    
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          ...getAuthHeaders()
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText || "No details provided"}`);
      }
      
      const result: ApiResponse = await response.json();
      
      if (result.success) {
        // Update local state after successful deletion
        setItems(prevItems => prevItems.filter(item => item.id !== id));
        
        toast.success("Item Deleted", {
          description: `"${itemToDelete?.title}" has been permanently removed.`,
          position: "top-right",
        });
        
        return true;
      } else {
        throw new Error(result.message || "Failed to delete item");
      }
    } catch (err) {
      toast.error("Failed to delete item", {
        description: err instanceof Error ? err.message : "An unknown error occurred",
        position: "top-right",
      });
      return false;
    }
  };

  // Toggle item status
  const toggleItemStatus = async (id: number): Promise<boolean> => {
    try {
      const item = items.find(item => item.id === id);
      if (!item) return false;
      
      const newStatus = item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      
      // Create a FormData object for consistent handling
      const form = new FormData();
      form.append("status", newStatus);
      form.append("title", item.title);
      form.append("description", item.description);
      form.append("index", item.index.toString());
      
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          ...getAuthHeaders()
        },
        body: form,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText || "No details provided"}`);
      }
      
      const result: ApiResponse = await response.json();
      
      if (result.success) {
        // Update local state after successful status toggle
        setItems(prevItems => 
          prevItems.map(item => 
            item.id === id ? { ...item, status: newStatus } : item
          )
        );
        
        toast.success(`Status Changed`, {
          description: `Item "${item.title}" is now ${newStatus}.`,
          position: "top-right",
        });
        
        return true;
      } else {
        throw new Error(result.message || "Failed to update status");
      }
    } catch (err) {
      toast.error("Failed to update status", {
        description: err instanceof Error ? err.message : "An unknown error occurred",
        position: "top-right",
      });
      return false;
    }
  };

  return {
    items,
    isLoading,
    error,
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
    toggleItemStatus
  };
}