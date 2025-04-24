

// components/parasole/home/home.tsx
"use client";

import { useState } from "react";
import { Toaster } from "sonner";
import { Plus, RefreshCw } from "lucide-react";
import { HomeTable } from "./home-table";
import { HomeItemForm } from "./home-item-form";
import { useHomeItem } from "@/hooks/parasole/home/use-home-item";
import { HeroItem, HeroItemFormData } from "@/types/parasole/home/home";

export function Home() {
  // Use our custom hook for CRUD operations
  const { 
    items, 
    isLoading, 
    error,
    fetchItems,
    addItem, 
    updateItem, 
    deleteItem, 
    toggleItemStatus 
  } = useHomeItem();
  
  // Local state for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<HeroItem | undefined>(undefined);
  
  // Handle opening the modal
  const handleOpenModal = (item?: HeroItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };
  
  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(undefined);
  };
  
  // Handle form submission
  const handleSubmit = async (data: HeroItemFormData) => {
    if (selectedItem) {
      return await updateItem(selectedItem.id, data);
    } else {
      return await addItem(data);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toaster component for notifications */}
      <Toaster position="top-right" />
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Home Page Content Management</h1>
        <div className="flex space-x-3">
          <button 
            onClick={() => fetchItems()} 
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors duration-200 flex items-center shadow-sm"
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button 
            onClick={() => handleOpenModal()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center shadow-sm"
            disabled={isLoading}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Content
          </button>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {/* Table component */}
      <HomeTable 
        items={items}
        onEdit={handleOpenModal}
        onDelete={deleteItem}
        onToggleStatus={toggleItemStatus}
        isLoading={isLoading}
      />
      
      {/* Modal Form */}
      <HomeItemForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={selectedItem}
        isLoading={isLoading}
      />
    </div>
  );
}