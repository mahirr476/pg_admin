// components/parasole/home/homeDetail-item-form.tsx

"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Hero, HeroDetail } from '@/types/parasole/home/homeDetail';

interface HomeDetailItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<boolean>;
  initialData?: HeroDetail;
  heroes: Hero[];
  isLoading: boolean;
  formatImageUrl: (imagePath: string) => string;
}

export function HomeDetailItemForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  heroes,
  isLoading,
  formatImageUrl
}: HomeDetailItemFormProps) {
  const [formState, setFormState] = useState({
    heroId: '',
    title: '',
    description: '',
    image: null as File | null,
    imagePreview: '',
    index: 1,
    status: 'ACTIVE'
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormState({
        heroId: initialData.heroId.toString(),
        title: initialData.title,
        description: initialData.description,
        image: null,
        imagePreview: initialData.image || '',
        index: initialData.index,
        status: initialData.status
      });
    } else {
      setFormState({
        heroId: '',
        title: '',
        description: '',
        image: null,
        imagePreview: '',
        index: 1,
        status: 'ACTIVE'
      });
    }
  }, [initialData, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const fileInput = e.target;
    const file = fileInput.files?.[0];
    
    if (file) {
      setFormState({
        ...formState,
        image: file
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      
      // Add all form fields except imagePreview
      for (const key in formState) {
        if (key !== 'imagePreview') {
          const value = formState[key as keyof typeof formState];
          if (value !== null && value !== undefined) {
            formDataToSend.append(key, value as any);
          }
        }
      }
      
      const success = await onSubmit(formDataToSend);
      
      if (success) {
        onClose();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error submitting form: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Get the image source for preview
  const imagePreviewSrc = formState.image 
    ? URL.createObjectURL(formState.image) 
    : formState.imagePreview 
      ? formatImageUrl(formState.imagePreview) 
      : '/api/placeholder/400/400';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex justify-between items-center mb-4 border-b pb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? 'Edit Hero Detail' : 'Add Hero Detail'}
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Image Preview Section */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Image Preview</label>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="h-48 w-48 relative mx-auto mb-4">
                <img
                  key={imagePreviewSrc} // Force re-render when src changes
                  src={imagePreviewSrc}
                  alt="Preview"
                  className="h-full w-full object-cover rounded-lg border border-gray-200"
                  style={{ backgroundColor: '#f3f4f6' }}
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = '/api/placeholder/400/400';
                    img.onerror = null;
                  }}
                />
              </div>
              
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  {...(initialData ? {} : { required: true })}
                />
                <p className="mt-2 text-xs text-gray-500">
                  {initialData 
                    ? "Upload a new image only if you want to change the current one" 
                    : "Please select an image to upload"}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Hero Title</label>
            <select
              name="heroId"
              value={formState.heroId}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Hero</option>
              {heroes.map((hero) => (
                <option key={hero.id} value={hero.id}>
                  {hero.title}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Detail Title</label>
            <input
              type="text"
              name="title"
              value={formState.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formState.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Index</label>
              <input
                type="number"
                name="index"
                value={formState.index}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Status</label>
              <select
                name="status"
                value={formState.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 mr-2 hover:bg-gray-100 transition-all duration-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                <span>{initialData ? 'Update' : 'Save'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}