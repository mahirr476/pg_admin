"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Hero, HeroDetail } from '@/types/parasole/home/homeDetail';
import { CheckCircle, XCircle, Upload, Image as ImageIcon, Loader2, ArrowRight } from 'lucide-react';

interface HomeDetailItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<boolean>;
  initialData?: HeroDetail;
  heroes: Hero[];
  isLoading: boolean;
  formatImageUrl: (imagePath: string) => string;
}

export default function HomeDetailItemForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  heroes,
  isLoading,
  formatImageUrl,
}: HomeDetailItemFormProps) {
  const [formState, setFormState] = useState({
    heroId: '',
    title: '',
    description: '',
    image: null as File | null,
    imagePreview: '',
    index: 1,
    status: 'ACTIVE',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormState({
        heroId: initialData.heroId.toString(),
        title: initialData.title,
        description: initialData.description,
        image: null,
        imagePreview: initialData.image || '',
        index: initialData.index,
        status: initialData.status,
      });
    } else {
      setFormState({
        heroId: heroes.length > 0 ? heroes[0].id.toString() : '', // Default to first hero if available
        title: '',
        description: '',
        image: null,
        imagePreview: '',
        index: 1,
        status: 'ACTIVE',
      });
    }
    setImageError(false);
  }, [initialData, isOpen, heroes]);

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
        image: file,
      });
      setImageError(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setFormState({
        ...formState,
        image: files[0],
      });
      setImageError(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-start justify-center z-50 p-4 animate-fade-in overflow-y-auto pt-20 pb-10">
      {/* Modal Container */}
      <div
        ref={modalRef}
        className="bg-white rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden animate-scale-up relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 flex justify-between items-center text-white sticky top-0 z-10">
          <h2 className="text-xl font-bold flex items-center">
            <span className="bg-white/20 p-2 rounded-md mr-3 inline-block">
              {initialData ? <CheckCircle className="h-5 w-5" /> : <ImageIcon className="h-5 w-5" />}
            </span>
            {initialData ? 'Edit Hero Detail' : 'Add Hero Detail'}
          </h2>
          <button
            className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors duration-200 focus:outline-none"
            onClick={onClose}
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="max-h-[calc(80vh-80px)] overflow-y-auto p-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-sm animate-shake">
              <div className="flex items-center">
                <div className="mr-3">
                  <XCircle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="font-medium">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Section with Drag & Drop */}
            <div className="mb-8 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                <h3 className="text-gray-700 font-medium flex items-center">
                  <ImageIcon className="h-4 w-4 mr-2 text-blue-500" />
                  Image Upload
                </h3>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* Image Preview */}
                  <div className="h-40 w-40 rounded-xl overflow-hidden bg-white border border-gray-200 shadow-md relative group">
                    {imageError ? (
                      <div className="h-full w-full flex items-center justify-center bg-gray-100">
                        <ImageIcon className="h-10 w-10 text-gray-400" />
                      </div>
                    ) : (
                      <div className="relative h-40 w-40">
                        <Image
                          src={imagePreviewSrc}
                          alt="Preview"
                          fill
                          sizes="160px"
                          className="object-cover transition-all duration-300 group-hover:scale-105 group-hover:opacity-90"
                          onError={() => setImageError(true)}
                          priority
                        />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Upload className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  
                  {/* Drag & Drop Area */}
                  <div className="flex-1">
                    <div
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
                        isDragging 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
                      }`}
                      onClick={triggerFileInput}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        {...(initialData ? {} : { required: true })}
                      />
                      <Upload className={`h-8 w-8 mx-auto mb-2 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
                      <p className={`font-medium mb-1 ${isDragging ? 'text-blue-600' : 'text-gray-700'}`}>
                        {formState.image ? 'Replace image' : 'Upload an image'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Drag & drop or click to browse
                      </p>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 px-1">
                      {initialData
                        ? "Upload a new image only if you want to change the current one"
                        : "Recommended size: 1200 x 800 pixels. Max size: 2MB"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Form Fields in Card */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                <h3 className="text-gray-700 font-medium">Content Details</h3>
              </div>
              
              <div className="p-6 space-y-5">
                {/* Hero Title */}
                <div className="form-group">
                  <label className="block text-gray-700 font-medium mb-2">
                    Hero Title <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="heroId"
                      value={formState.heroId}
                      onChange={handleInputChange}
                      className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
                      required
                    >
                      {heroes.map((hero) => (
                        <option key={hero.id} value={hero.id}>
                          {hero.title}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Detail Title */}
                <div className="form-group">
                  <label className="block text-gray-700 font-medium mb-2">
                    Detail Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formState.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter title"
                    required
                  />
                </div>

                {/* Description */}
                <div className="form-group">
                  <label className="block text-gray-700 font-medium mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formState.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter description"
                    required
                  ></textarea>
                  <p className="mt-1 text-xs text-gray-500 text-right">
                    {formState.description.length} characters
                  </p>
                </div>

                {/* Index and Status in Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="form-group">
                    <label className="block text-gray-700 font-medium mb-2">
                      Index <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="index"
                      value={formState.index}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      min="1"
                      placeholder="Enter display order"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Lower index items appear first
                    </p>
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-gray-700 font-medium mb-2">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={() => setFormState({...formState, status: 'ACTIVE'})}
                        className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                          formState.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800 ring-1 ring-green-500'
                            : 'bg-gray-100 text-gray-700 hover:bg-green-50'
                        }`}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Active
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormState({...formState, status: 'INACTIVE'})}
                        className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                          formState.status === 'INACTIVE'
                            ? 'bg-red-100 text-red-800 ring-1 ring-red-500'
                            : 'bg-gray-100 text-gray-700 hover:bg-red-50'
                        }`}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Inactive
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 mr-3 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow-md flex items-center justify-center min-w-[100px]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center">
                    {initialData ? 'Update' : 'Save'}
                    <ArrowRight className="ml-2 h-4 w-4 opacity-70" />
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-5px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-scale-up {
          animation: scaleUp 0.4s ease-out forwards;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}