

// // hooks/parasole/home/use-home-item.ts
// import { useState, useEffect } from "react";
// import { toast } from "sonner";
// import Cookies from "js-cookie";
// import { HeroItem, HeroItemFormData, ApiResponse } from "@/types/parasole/home/home";

// const API_URL = "http://api.pg-admin.57.155.183.218.nip.io/api/v1/parasole/hero";

// // Helper function to format image URL
// export function formatImageUrl(imagePath: string) {
//   if (!imagePath) return "";
  
//   // Handle both http/https URLs and relative paths
//   if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
//     return imagePath;
//   }
  
//   // Remove any leading slashes from the path
//   let cleanPath = imagePath.replace(/^\/+/, '');
  
//   // If the path starts with 'public/', we need to remove it for proper serving
//   if (cleanPath.startsWith('public/')) {
//     cleanPath = cleanPath.replace('public/', '');
//   }
  
//   return `http://localhost:7000/${cleanPath}`;
// }

// // Helper function to get the first image from an array or handle a single image string
// export function getFirstImage(images: string | string[]): string {
//   if (!images) return "";
  
//   // If images is an array, return the first image
//   if (Array.isArray(images)) {
//     return images.length > 0 ? images[0] : "";
//   }
  
//   // If images is a string, return it directly
//   return images;
// }

// export function useHomeItem() {
//   const [items, setItems] = useState<HeroItem[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Helper function to get auth headers
//   const getAuthHeaders = () => {
//     const token = Cookies.get('token');
    
//     if (!token) {
//       console.warn("No token found in cookies");
//       return {};
//     }
    
//     return {
//       'Authorization': `Bearer ${token}`
//     };
//   };

//   // Fetch items from API
//   const fetchItems = async () => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const response = await fetch(API_URL, {
//         headers: {
//           ...getAuthHeaders()
//         }
//       });
      
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("API Error Response:", errorText);
//         throw new Error(`API error: ${response.status} - ${errorText || "No details provided"}`);
//       }
      
//       const data: ApiResponse = await response.json();
      
//       if (data.success) {
//         // Handle both array and single object responses
//         const heroItems = Array.isArray(data.data) ? data.data : (data.data ? [data.data] : []);
        
//         // Process the items to ensure compatibility with both image and images fields
//         const processedItems = heroItems.map(item => {
//           // If the item has an images array but no image field
//           if (item.images && !item.image) {
//             return {
//               ...item,
//               image: getFirstImage(item.images)
//             };
//           }
//           return item;
//         });
        
//         setItems(processedItems);
        
//         // Success toast
//         toast.success("Content loaded successfully", {
//           position: "top-right",
//         });
//       } else {
//         throw new Error(data.message || "Failed to fetch data");
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "An unknown error occurred");
//       toast.error("Failed to load content", {
//         description: err instanceof Error ? err.message : "An unknown error occurred",
//         position: "top-right",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Initial fetch on mount
//   useEffect(() => {
//     fetchItems();
//   }, []);

//   // Add new item
//   const addItem = async (formData: HeroItemFormData): Promise<boolean> => {
//     setIsLoading(true);
    
//     try {
//       const form = new FormData();
//       form.append("title", formData.title);
//       form.append("description", formData.description);
//       form.append("status", formData.status);
//       form.append("index", formData.index.toString());
      
//       // Handle single image (for backward compatibility)
//       if (formData.image) {
//         form.append("images", formData.image);
//       }
      
//       // Handle multiple images if available
//       if (formData.images && formData.images.length > 0) {
//         // Remove any previously added image (to avoid duplicates)
//         form.delete("images");
        
//         // Append each image to the form
//         formData.images.forEach((file, index) => {
//           form.append("images", file);
//         });
//       }
      
//       console.log('Form data being sent:', {
//         title: formData.title,
//         description: formData.description,
//         status: formData.status,
//         index: formData.index,
//         hasImage: !!formData.image,
//         imagesCount: formData.images ? formData.images.length : 0
//       });
      
//       const response = await fetch(API_URL, {
//         method: "POST",
//         headers: {
//           ...getAuthHeaders()
//         },
//         body: form,
//       });
      
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("API Error Response:", errorText);
//         throw new Error(`API error: ${response.status} - ${errorText || "No details provided"}`);
//       }
      
//       const result: ApiResponse = await response.json();
//       console.log('API response:', result);
      
//       if (result.success) {
//         // Refresh the list after adding
//         await fetchItems();
        
//         toast.success("New Item Added", {
//           description: `"${formData.title}" has been created successfully.`,
//           position: "top-right",
//         });
        
//         return true;
//       } else {
//         throw new Error(result.message || "Failed to add item");
//       }
//     } catch (err) {
//       console.error("Error in addItem:", err);
//       toast.error("Failed to add item", {
//         description: err instanceof Error ? err.message : "An unknown error occurred",
//         position: "top-right",
//       });
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Update existing item
//   const updateItem = async (id: number, formData: HeroItemFormData): Promise<boolean> => {
//     setIsLoading(true);
    
//     try {
//       const form = new FormData();
//       form.append("title", formData.title);
//       form.append("description", formData.description);
//       form.append("status", formData.status);
//       form.append("index", formData.index.toString());
      
//       // Handle single image (for backward compatibility)
//       if (formData.image) {
//         form.append("images", formData.image);
//       }
      
//       // Handle multiple images if available
//       if (formData.images && formData.images.length > 0) {
//         // Remove any previously added image (to avoid duplicates)
//         form.delete("images");
        
//         // Append each image to the form
//         formData.images.forEach((file, index) => {
//           form.append("images", file);
//         });
//       }
      
//       console.log('Update form data being sent:', {
//         id,
//         title: formData.title,
//         description: formData.description,
//         status: formData.status,
//         index: formData.index,
//         hasImage: !!formData.image,
//         imagesCount: formData.images ? formData.images.length : 0
//       });
      
//       const response = await fetch(`${API_URL}/${id}`, {
//         method: "PUT",
//         headers: {
//           ...getAuthHeaders()
//         },
//         body: form,
//       });
      
//       // Log the raw response for debugging
//       const rawResponse = await response.text();
//       console.log('Raw API Response:', rawResponse);
      
//       if (!response.ok) {
//         throw new Error(`API error: ${response.status} - ${rawResponse || "No details provided"}`);
//       }
      
//       // Parse the response again for handling
//       let result;
//       try {
//         result = JSON.parse(rawResponse) as ApiResponse;
//       } catch (e) {
//         throw new Error(`Failed to parse API response: ${rawResponse}`);
//       }
      
//       if (result.success) {
//         // Refresh the list after updating
//         await fetchItems();
        
//         toast.success("Item Updated Successfully", {
//           description: `Changes to "${formData.title}" have been saved.`,
//           position: "top-right",
//         });
        
//         return true;
//       } else {
//         throw new Error(result.message || "Failed to update item");
//       }
//     } catch (err) {
//       console.error("Error in updateItem:", err);
//       toast.error("Failed to update item", {
//         description: err instanceof Error ? err.message : "An unknown error occurred",
//         position: "top-right",
//       });
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Delete an item
//   const deleteItem = async (id: number): Promise<boolean> => {
//     const itemToDelete = items.find(item => item.id === id);
    
//     try {
//       const response = await fetch(`${API_URL}/${id}`, {
//         method: "DELETE",
//         headers: {
//           ...getAuthHeaders()
//         }
//       });
      
//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`API error: ${response.status} - ${errorText || "No details provided"}`);
//       }
      
//       const result: ApiResponse = await response.json();
      
//       if (result.success) {
//         // Update local state after successful deletion
//         setItems(prevItems => prevItems.filter(item => item.id !== id));
        
//         toast.success("Item Deleted", {
//           description: `"${itemToDelete?.title}" has been permanently removed.`,
//           position: "top-right",
//         });
        
//         return true;
//       } else {
//         throw new Error(result.message || "Failed to delete item");
//       }
//     } catch (err) {
//       toast.error("Failed to delete item", {
//         description: err instanceof Error ? err.message : "An unknown error occurred",
//         position: "top-right",
//       });
//       return false;
//     }
//   };

//   // Toggle item status
//   const toggleItemStatus = async (id: number): Promise<boolean> => {
//     try {
//       const item = items.find(item => item.id === id);
//       if (!item) return false;
      
//       const newStatus = item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      
//       // Create a FormData object for consistent handling
//       const form = new FormData();
//       form.append("status", newStatus);
//       form.append("title", item.title);
//       form.append("description", item.description);
//       form.append("index", item.index.toString());
      
//       const response = await fetch(`${API_URL}/${id}`, {
//         method: "PUT",
//         headers: {
//           ...getAuthHeaders()
//         },
//         body: form,
//       });
      
//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`API error: ${response.status} - ${errorText || "No details provided"}`);
//       }
      
//       const result: ApiResponse = await response.json();
      
//       if (result.success) {
//         // Update local state after successful status toggle
//         setItems(prevItems => 
//           prevItems.map(item => 
//             item.id === id ? { ...item, status: newStatus } : item
//           )
//         );
        
//         toast.success(`Status Changed`, {
//           description: `Item "${item.title}" is now ${newStatus}.`,
//           position: "top-right",
//         });
        
//         return true;
//       } else {
//         throw new Error(result.message || "Failed to update status");
//       }
//     } catch (err) {
//       toast.error("Failed to update status", {
//         description: err instanceof Error ? err.message : "An unknown error occurred",
//         position: "top-right",
//       });
//       return false;
//     }
//   };

//   return {
//     items,
//     isLoading,
//     error,
//     fetchItems,
//     addItem,
//     updateItem,
//     deleteItem,
//     toggleItemStatus
//   };
// }





// hooks/parasole/home/use-home-item.ts
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { HeroItem, HeroItemFormData, ApiResponse } from "@/types/parasole/home/home";

const API_URL = "http://api.pg-admin.57.155.183.218.nip.io/api/v1/parasole/hero";

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

// Helper function to get the first image from an array or handle a single image string
export function getFirstImage(images: string | string[]): string {
  if (!images) return "";
  
  // If images is an array, return the first image
  if (Array.isArray(images)) {
    return images.length > 0 ? images[0] : "";
  }
  
  // If images is a string, return it directly
  return images;
}

export function useHomeItem() {
  const [items, setItems] = useState<HeroItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Enhanced helper function to get auth headers
  const getAuthHeaders = () => {
    // Try multiple possible token storage locations
    const token = Cookies.get('token') || 
                  Cookies.get('authToken') || 
                  Cookies.get('accessToken') ||
                  localStorage.getItem('token') ||
                  localStorage.getItem('authToken') ||
                  localStorage.getItem('accessToken') ||
                  sessionStorage.getItem('token') ||
                  sessionStorage.getItem('authToken') ||
                  sessionStorage.getItem('accessToken');
    
    if (!token) {
      console.warn("No authentication token found in cookies, localStorage, or sessionStorage");
      throw new Error("Authentication token not found. Please log in again.");
    }
    
    console.log("Found token:", token.substring(0, 10) + "..."); // Log first 10 chars for debugging
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Enhanced error handling for authentication issues
  const handleAuthError = (error: any, response?: Response) => {
    if (response && response.status === 401) {
      // Clear all possible token storage locations
      Cookies.remove('token');
      Cookies.remove('authToken');
      Cookies.remove('accessToken');
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('accessToken');
      
      toast.error("Session expired", {
        description: "Please log in again to continue.",
        position: "top-right",
      });
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        window.location.href = '/login'; // Adjust this path as needed
      }, 1500);
      
      return;
    }
    
    // Handle other errors normally
    console.error("API Error:", error);
  };

  // Fetch items from API
  const fetchItems = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const headers = getAuthHeaders();
      
      const response = await fetch(API_URL, {
        headers: headers
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        
        // Handle authentication errors specifically
        if (response.status === 401) {
          handleAuthError(new Error("Authentication failed"), response);
          return;
        }
        
        throw new Error(`API error: ${response.status} - ${errorText || "No details provided"}`);
      }
      
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        // Handle both array and single object responses
        const heroItems = Array.isArray(data.data) ? data.data : (data.data ? [data.data] : []);
        
        // Process the items to ensure compatibility with both image and images fields
        const processedItems = heroItems.map(item => {
          // If the item has an images array but no image field
          if (item.images && !item.image) {
            return {
              ...item,
              image: getFirstImage(item.images)
            };
          }
          return item;
        });
        
        setItems(processedItems);
        
        // Success toast
        toast.success("Content loaded successfully", {
          position: "top-right",
        });
      } else {
        throw new Error(data.message || "Failed to fetch data");
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes("Authentication token not found")) {
        handleAuthError(err);
        return;
      }
      
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
      
      // Handle single image (for backward compatibility)
      if (formData.image) {
        form.append("images", formData.image);
      }
      
      // Handle multiple images if available
      if (formData.images && formData.images.length > 0) {
        // Remove any previously added image (to avoid duplicates)
        form.delete("images");
        
        // Append each image to the form
        formData.images.forEach((file, index) => {
          form.append("images", file);
        });
      }
      
      console.log('Form data being sent:', {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        index: formData.index,
        hasImage: !!formData.image,
        imagesCount: formData.images ? formData.images.length : 0
      });
      
      // Get auth headers (without Content-Type for FormData)
      const authHeaders = getAuthHeaders();
      delete authHeaders['Content-Type']; // Let browser set it for FormData
      
      const response = await fetch(API_URL, {
        method: "POST",
        headers: authHeaders,
        body: form,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        
        if (response.status === 401) {
          handleAuthError(new Error("Authentication failed"), response);
          return false;
        }
        
        throw new Error(`API error: ${response.status} - ${errorText || "No details provided"}`);
      }
      
      const result: ApiResponse = await response.json();
      console.log('API response:', result);
      
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
      if (err instanceof Error && err.message.includes("Authentication token not found")) {
        handleAuthError(err);
        return false;
      }
      
      console.error("Error in addItem:", err);
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
      
      // Handle single image (for backward compatibility)
      if (formData.image) {
        form.append("images", formData.image);
      }
      
      // Handle multiple images if available
      if (formData.images && formData.images.length > 0) {
        // Remove any previously added image (to avoid duplicates)
        form.delete("images");
        
        // Append each image to the form
        formData.images.forEach((file, index) => {
          form.append("images", file);
        });
      }
      
      console.log('Update form data being sent:', {
        id,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        index: formData.index,
        hasImage: !!formData.image,
        imagesCount: formData.images ? formData.images.length : 0
      });
      
      // Get auth headers (without Content-Type for FormData)
      const authHeaders = getAuthHeaders();
      delete authHeaders['Content-Type']; // Let browser set it for FormData
      
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: authHeaders,
        body: form,
      });
      
      // Log the raw response for debugging
      const rawResponse = await response.text();
      console.log('Raw API Response:', rawResponse);
      
      if (!response.ok) {
        if (response.status === 401) {
          handleAuthError(new Error("Authentication failed"), response);
          return false;
        }
        
        throw new Error(`API error: ${response.status} - ${rawResponse || "No details provided"}`);
      }
      
      // Parse the response again for handling
      let result;
      try {
        result = JSON.parse(rawResponse) as ApiResponse;
      } catch (e) {
        throw new Error(`Failed to parse API response: ${rawResponse}`);
      }
      
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
      if (err instanceof Error && err.message.includes("Authentication token not found")) {
        handleAuthError(err);
        return false;
      }
      
      console.error("Error in updateItem:", err);
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
      const headers = getAuthHeaders();
      
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: headers
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        
        if (response.status === 401) {
          handleAuthError(new Error("Authentication failed"), response);
          return false;
        }
        
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
      if (err instanceof Error && err.message.includes("Authentication token not found")) {
        handleAuthError(err);
        return false;
      }
      
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
      
      // Get auth headers (without Content-Type for FormData)
      const authHeaders = getAuthHeaders();
      delete authHeaders['Content-Type']; // Let browser set it for FormData
      
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: authHeaders,
        body: form,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        
        if (response.status === 401) {
          handleAuthError(new Error("Authentication failed"), response);
          return false;
        }
        
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
      if (err instanceof Error && err.message.includes("Authentication token not found")) {
        handleAuthError(err);
        return false;
      }
      
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