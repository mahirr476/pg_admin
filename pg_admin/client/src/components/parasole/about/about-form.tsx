// components/parasole/about/about-form.tsx
import React, { useState, useEffect } from 'react';
import { AboutItem, AboutFormData } from '@/types/parasole/about/about';

interface AboutFormProps {
  selectedItem: AboutItem | null;
  isLoading: boolean;
  onSubmit: (formData: AboutFormData) => Promise<boolean>;
  onCancel: () => void;
}

export function AboutForm({
  selectedItem,
  isLoading,
  onSubmit,
  onCancel
}: AboutFormProps) {
  const [formData, setFormData] = useState<AboutFormData>({
    index: '',
    title: '',
    description: '',
    images: []
  });
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Initialize form with selected item data if editing
  useEffect(() => {
    if (selectedItem) {
      setFormData({
        index: selectedItem.index,
        title: selectedItem.title,
        description: selectedItem.description,
        images: []
      });
      
      // Set preview URLs for existing images
      const previews = selectedItem.images.map(
        img => `http://localhost:7000/${img.replace(/^public\//, '')}`
      );
      setPreviewUrls(previews);
    } else {
      // Reset form for new item
      setFormData({
        index: '',
        title: '',
        description: '',
        images: []
      });
      setPreviewUrls([]);
    }
  }, [selectedItem]);

  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const fileArray = Array.from(files);
    setFormData(prev => ({
      ...prev,
      images: fileArray
    }));
    
    // Create preview URLs for the uploaded images
    const newPreviews = fileArray.map(file => URL.createObjectURL(file));
    setPreviewUrls(newPreviews);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit(formData);
    if (success) {
      // Clean up any created object URLs to avoid memory leaks
      previewUrls.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
      
      // Close the modal on successful submission
      onCancel();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="text-lg font-semibold text-gray-800">
            {selectedItem ? 'Edit About Item' : 'Create New About Item'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Index
              </label>
              <input
                type="number"
                name="index"
                value={formData.index}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter display order index"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter title"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter description"
                required
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Images
              </label>
              <input
                type="file"
                onChange={handleImageUpload}
                className="w-full"
                multiple
                accept="image/png, image/jpeg, image/jpg"
              />
              
              {previewUrls.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {previewUrls.map((preview, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${idx + 1}`}
                        className="h-20 w-20 object-cover rounded-md border border-gray-200"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3 bg-gray-50">
            <button
              type="button"
              onClick={onCancel}
              className="bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 border border-transparent rounded-md shadow-sm px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}