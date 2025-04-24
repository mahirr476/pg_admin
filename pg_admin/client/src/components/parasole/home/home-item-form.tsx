// components/parasole/home/home-item-form.tsx
"use client";

import { useRef, useState, useEffect } from "react";
import { CheckCircle, XCircle, ImageIcon } from "lucide-react";
import { HeroItem, HeroItemFormData } from "@/types/parasole/home/home";
import { formatImageUrl } from "@/hooks/parasole/home/use-home-item";

interface HomeItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: HeroItemFormData) => Promise<boolean>;
  initialData?: HeroItem;
  isLoading: boolean;
}

export function HomeItemForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading
}: HomeItemFormProps) {
  const [formData, setFormData] = useState<HeroItemFormData>({
    title: "",
    description: "",
    image: null,
    index: 1,
    status: "ACTIVE"
  });
  
  const [imagePreview, setImagePreview] = useState<string>("");
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        image: null, // We don't need to send the image back if not changing it
        index: initialData.index,
        status: initialData.status
      });
      
      // Set image preview if available
      if (initialData.image) {
        setImagePreview(formatImageUrl(initialData.image));
      } else {
        setImagePreview("");
      }
    } else {
      // Reset form when no initialData is provided
      setFormData({
        title: "",
        description: "",
        image: null,
        index: 1,
        status: "ACTIVE"
      });
      setImagePreview("");
    }
  }, [initialData, isOpen]);
  
  // Close modal when clicking outside
  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node) && !isLoading) {
      onClose();
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle index field as a number
    if (name === "index") {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 1
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create a preview URL for the image
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };
  
  // Submit form handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit(formData);
    if (success) {
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleClickOutside}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">
            {initialData ? "Edit Content Item" : "Add New Content Item"}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-5">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter title"
                required
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter description"
                rows={4}
                required
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
              />
            </div>
            
            <div>
              <label htmlFor="index" className="block text-sm font-medium text-gray-700 mb-1">
                Index <span className="text-red-500">*</span>
              </label>
              <input
                id="index"
                name="index"
                type="number"
                value={formData.index}
                onChange={handleInputChange}
                min="1"
                required
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
              />
            </div>
            
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Image {!initialData && <span className="text-red-500">*</span>}
              </label>
              <div className="flex items-start space-x-4">
                <div className="h-24 w-24 rounded-md overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = 'flex items-center justify-center h-full w-full text-gray-400';
                        fallback.innerHTML = '<span class="text-xs">Failed to load</span>';
                        e.currentTarget.parentNode?.appendChild(fallback);
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full text-gray-400">
                      <ImageIcon className="h-10 w-10" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                    required={!initialData}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {initialData ? 
                      "Upload a new image only if you want to change the current one." : 
                      "Recommended size: 1200 x 800 pixels. Max size: 2MB."}
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, status: "ACTIVE" }))}
                  className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    formData.status === "ACTIVE"
                      ? "bg-green-100 text-green-800 ring-2 ring-green-600"
                      : "bg-gray-100 text-gray-800 hover:bg-green-50"
                  }`}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, status: "INACTIVE" }))}
                  className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    formData.status === "INACTIVE"
                      ? "bg-gray-200 text-gray-800 ring-2 ring-gray-400"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Inactive
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                initialData ? "Update" : "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}