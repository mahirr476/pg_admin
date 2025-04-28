"use client";

import React from 'react';
import { PlusCircle } from 'lucide-react';
import { AboutTable } from './about-table';
import { AboutForm } from './about-form';
import { useAbout } from '@/hooks/parasole/about/use-about';
import { AboutFormData } from '@/types/parasole/about/about';

export default function AboutPage() {
  const {
    aboutData,
    isLoading,
    error,
    selectedItem,
    isModalOpen,
    createAboutItem,
    updateAboutItem,
    deleteAboutItem,
    toggleItemStatus,
    openCreateModal,
    openEditModal,
    closeModal
  } = useAbout();

  // Handle form submission (create or update)
  const handleSubmit = async (formData: AboutFormData) => {
    if (selectedItem) {
      return await updateAboutItem(selectedItem.id, formData);
    } else {
      return await createAboutItem(formData);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">About Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage the about section content of your website
          </p>
        </div>
        <button 
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm flex items-center transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
          disabled={isLoading}
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add New Item
        </button>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Table */}
      <AboutTable 
        items={aboutData}
        isLoading={isLoading}
        onEdit={openEditModal}
        onDelete={deleteAboutItem}
        onToggleStatus={toggleItemStatus}
      />
      
      {/* Modal Form */}
      {isModalOpen && (
        <AboutForm
          selectedItem={selectedItem}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      )}
    </div>
  );
}