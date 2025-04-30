"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { ContactState, ContactActions } from "@/types/parasole/contact/contact.types";

const API_URL = "http://localhost:7000/api/v1/parasole/contact";

export default function useContact(): ContactState & ContactActions {
  const [state, setState] = useState<ContactState>({
    data: [],
    isModalOpen: false,
    isLoading: false,
    selectedItem: null,
    formData: {
      index: "",
      title: "",
      description: "",
      image: null,
      status: "ACTIVE",
    },
    previewImage: "",
    error: null,
  });

  const fetchContactData = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const token = Cookies.get("token");
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setState((prev) => ({
        ...prev,
        data: res.data.data || [],
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to load contact data.",
      }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      formData: { ...prev.formData, [name]: value },
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setState((prev) => ({
        ...prev,
        formData: { ...prev.formData, image: file },
        previewImage: URL.createObjectURL(file),
      }));
    }
  };

  const openModal = (item?: any) => {
    if (item) {
      setState((prev) => ({
        ...prev,
        selectedItem: item,
        isModalOpen: true,
        formData: {
          index: String(item.index),
          title: item.title,
          description: item.description,
          image: null,
          status: item.status,
        },
        previewImage: item.image ? `${API_URL}/${item.image.replace(/^public\//, "")}` : "",
      }));
    } else {
      setState((prev) => ({
        ...prev,
        isModalOpen: true,
        selectedItem: null,
        formData: {
          index: "",
          title: "",
          description: "",
          image: null,
          status: "ACTIVE",
        },
        previewImage: "",
      }));
    }
  };

  const closeModal = () => {
    setState((prev) => ({
      ...prev,
      isModalOpen: false,
      selectedItem: null,
      formData: {
        index: "",
        title: "",
        description: "",
        image: null,
        status: "ACTIVE",
      },
      previewImage: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, isLoading: true }));
    const token = Cookies.get("token");
    const formDataToSend = new FormData();

    Object.entries(state.formData).forEach(([key, value]) => {
      if (value !== null) {
        formDataToSend.append(key, value);
      }
    });

    try {
      if (state.selectedItem) {
        await axios.put(`${API_URL}/${state.selectedItem.id}`, formDataToSend, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(API_URL, formDataToSend, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
      }
      fetchContactData();
      closeModal();
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Failed to save contact data.",
      }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    setState((prev) => ({ ...prev, isLoading: true }));
    const token = Cookies.get("token");
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchContactData();
    } catch (error) {
      setState((prev) => ({ ...prev, error: "Failed to delete item." }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleStatusToggle = async (item: any, newStatus: "ACTIVE" | "INACTIVE") => {
    setState((prev) => ({ ...prev, isLoading: true }));
    const token = Cookies.get("token");
    try {
      await axios.put(
        `${API_URL}/${item.id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      fetchContactData();
    } catch (error) {
      setState((prev) => ({ ...prev, error: "Failed to update status." }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    fetchContactData();
  }, []);

  return {
    ...state,
    fetchContactData,
    handleInputChange,
    handleImageChange,
    openModal,
    closeModal,
    handleSubmit,
    handleDelete,
    handleStatusToggle,
  };
}