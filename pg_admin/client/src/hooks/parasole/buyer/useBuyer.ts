// useBuyer.ts - Custom hook for Buyer state management

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { BuyerItem, BuyerFormData, UseBuyerResult } from "./buyer";

// API base URL
const API_BASE_URL = 'http://localhost:7000';

export const useBuyer = (): UseBuyerResult => {
  // State
  const [buyerData, setBuyerData] = useState<BuyerItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<BuyerItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<BuyerFormData>({
    index: 0,
    title: "",
    description: "",
    status: "ACTIVE",
    images: [],
  });

  const [previewImages, setPreviewImages] = useState<string[]>([]);

  // Get auth token
  const getToken = (): string => {
    return Cookies.get("token") || "";
  };

  // === Fetch Buyer Data ===
  const fetchBuyerData = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/parasole/buyer`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log("API Response:", response.data);
      
      // Handle both array and single object responses
      if (Array.isArray(response.data.data)) {
        setBuyerData(response.data.data);
      } else if (response.data.data && typeof response.data.data === 'object') {
        setBuyerData([response.data.data]);
      } else {
        setBuyerData([]);
      }
      
    } catch (error) {
      console.error("Error fetching buyer data:", error);
      setError("Failed to load buyer data. Please try again.");
      setBuyerData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchBuyerData();
  }, []);

  // === Handle Add / Edit Item ===
  const handleAddNew = (): void => {
    setFormData({
      index: 0,
      title: "",
      description: "",
      status: "ACTIVE",
      images: [],
    });
    setPreviewImages([]);
    setSelectedItem(null);
    setError(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: BuyerItem): void => {
    setSelectedItem(item);
    setFormData({
      index: item.index,
      title: item.title,
      description: item.description,
      status: item.status,
      images: [],
    });
    setPreviewImages(
      item.images.map((img) =>
        img.startsWith("http")
          ? img
          : `${API_BASE_URL}/${img.replace(/^public\//, "")}`
      )
    );
    setError(null);
    setIsModalOpen(true);
  };

  // === Form Input Change ===
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "index" ? parseInt(value) || 0 : value,
    }));
  };

  // === Image Upload Change ===
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({ ...prev, images: files }));

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  // === Submit Form (Create or Update) ===
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      const formDataToSend = new FormData();

      formDataToSend.append("index", String(formData.index));
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("status", formData.status);

      if (formData.images.length > 0) {
        formData.images.forEach((image) => {
          formDataToSend.append("images", image);
        });
      }
      
      // Log request data for debugging
      console.log("Sending form data:", {
        index: formData.index,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        imageCount: formData.images.length
      });

      if (selectedItem) {
        // Update existing item
        await axios.put(
          `${API_BASE_URL}/api/v1/parasole/buyer/${selectedItem.id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              // Let axios set Content-Type for FormData
            },
          }
        );
      } else {
        // Create new item
        await axios.post(
          `${API_BASE_URL}/api/v1/parasole/buyer`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              // Let axios set Content-Type for FormData
            },
          }
        );
      }
      closeModal();
      fetchBuyerData();
    } catch (error) {
      console.error("Error saving buyer data:", error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Failed to save data. Please check all fields.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // === Delete Item ===
  const handleDelete = async (id: number): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this buyer?")) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      await axios.delete(
        `${API_BASE_URL}/api/v1/parasole/buyer/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchBuyerData();
    } catch (error) {
      console.error("Error deleting buyer:", error);
      setError("Failed to delete the item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // === Toggle Status via Dropdown ===
  const handleStatusToggle = async (item: BuyerItem, newStatus: "ACTIVE" | "INACTIVE"): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      await axios.put(
        `${API_BASE_URL}/api/v1/parasole/buyer/${item.id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchBuyerData(); // Refresh data after update
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update status. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // === Close Modal ===
  const closeModal = (): void => {
    setIsModalOpen(false);
    setFormData({
      index: 0,
      title: "",
      description: "",
      status: "ACTIVE",
      images: [],
    });
    setPreviewImages([]);
    setSelectedItem(null);
    setError(null);
  };

  // Return all state and actions
  return {
    // State
    buyerData,
    isModalOpen,
    isLoading,
    selectedItem,
    formData,
    previewImages,
    error,
    
    // Actions
    fetchBuyerData,
    handleAddNew,
    handleEdit,
    handleInputChange,
    handleImageChange,
    handleSubmit,
    handleDelete,
    handleStatusToggle,
    closeModal
  };
};