// useOperation.ts - Custom hook for Operation state management

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { OperationItem, OperationFormData, UseOperationResult } from "./operation";

const API_BASE_URL = "http://localhost:7000";

export const useOperation = (): UseOperationResult => {
  // State
  const [operationData, setOperationData] = useState<OperationItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<OperationItem | null>(null);
  const [formData, setFormData] = useState<OperationFormData>({
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

  // Fetch operation data from API
  const fetchOperationData = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const token = getToken();
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/parasole/operation`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOperationData(response.data.data || []);
    } catch (error) {
      console.error("Error fetching operation data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchOperationData();
  }, []);

  // Handle action to add new item
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
    setIsModalOpen(true);
  };

  // Handle action to edit existing item
  const handleEdit = (item: OperationItem): void => {
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
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "index" ? parseInt(value) || 0 : value,
    }));
  };

  // Handle image upload changes
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({ ...prev, images: files }));

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
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

    try {
      if (selectedItem) {
        // Update existing item
        await axios.put(
          `${API_BASE_URL}/api/v1/parasole/operation/${selectedItem.id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // Create new item
        await axios.post(
          `${API_BASE_URL}/api/v1/parasole/operation`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }
      closeModal();
      fetchOperationData();
    } catch (error) {
      console.error("Error saving operation data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle item deletion
  const handleDelete = async (id: number): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this operation item?")) return;

    setIsLoading(true);
    try {
      const token = getToken();
      await axios.delete(
        `${API_BASE_URL}/api/v1/parasole/operation/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchOperationData();
    } catch (error) {
      console.error("Error deleting operation item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (
    item: OperationItem, 
    newStatus: "ACTIVE" | "INACTIVE"
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const token = getToken();
      await axios.put(
        `${API_BASE_URL}/api/v1/parasole/operation/${item.id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchOperationData(); // Refresh data after update
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Close modal and reset form
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
  };

  // Return all state and methods
  return {
    // State
    operationData,
    isModalOpen,
    isLoading,
    selectedItem,
    formData,
    previewImages,
    
    // Actions
    fetchOperationData,
    handleAddNew,
    handleEdit,
    handleInputChange,
    handleImageChange,
    handleSubmit,
    handleDelete,
    handleStatusToggle,
    closeModal,
  };
};