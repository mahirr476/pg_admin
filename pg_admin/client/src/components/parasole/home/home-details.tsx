"use client";
import React, { useState, useEffect } from 'react';
import { useHomeDetailItem } from '@/hooks/parasole/home/use-homeDetail-item';
import { HomeDetailTable } from './homeDetail-table';
import HomeDetailItemForm from './homeDetail-item-form';  // Changed to default import
import { HeroDetail } from '@/types/parasole/home/homeDetail';

const HomeDetails: React.FC = () => {
  const {
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
  } = useHomeDetailItem();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<HeroDetail | undefined>(undefined);
  const [loadCount, setLoadCount] = useState<number>(0);

  // Fetch data on initial load and when loadCount changes
  useEffect(() => {
    fetchHeroDetails();
    fetchHeroes();
  }, [fetchHeroDetails, fetchHeroes, loadCount]);

  // Refresh data function
  const refreshData = (): void => {
    setLoadCount(prev => prev + 1);
  };

  // Modal handlers
  const openModal = (detail: HeroDetail | null = null): void => {
    setEditingItem(detail || undefined);
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setEditingItem(undefined);
  };

  // Form submission handler
  const handleSubmit = async (formData: FormData): Promise<boolean> => {
    if (editingItem) {
      return await updateHeroDetail(editingItem.id, formData);
    } else {
      return await addHeroDetail(formData);
    }
  };

  // Confirm delete
  const handleDelete = async (id: number): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteHeroDetail(id);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Home Details</h1>
        <div className="flex gap-2">
          <button
            onClick={refreshData}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Refresh Data
          </button>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Add New Detail
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}
      
      {debugInfo && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded mb-6">
          Debug Info: {debugInfo}
        </div>
      )}

      <HomeDetailTable
        items={heroDetails}
        onEdit={openModal}
        onDelete={handleDelete}
        onToggleStatus={toggleHeroDetailStatus}
        isLoading={isLoading}
        formatImageUrl={formatImageUrl}
      />

      <HomeDetailItemForm
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        initialData={editingItem}
        heroes={heroes}
        isLoading={isLoading}
        formatImageUrl={formatImageUrl}
      />
    </div>
  );
};

export default HomeDetails;