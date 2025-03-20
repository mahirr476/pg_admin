'use client';

import React, { useState, useEffect } from 'react';

interface FormValues {
  orderIndex: number;
  name: string;
  designation: string;
  shortDescription: string;
  longDescription: string;
}

interface DirectorFormProps {
  isLoading: boolean;
  selectedDirectorId: number | null;
  orderIndex: number;
  setOrderIndex: (value: number) => void;
  name: string;
  setName: (value: string) => void;
  designation: string;
  setDesignation: (value: string) => void;
  shortDescription: string;
  setShortDescription: (value: string) => void;
  longDescription: string;
  setLongDescription: (value: string) => void;
  imagePreview: string;
  originalValues?: FormValues;
  isFormModified: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setShowForm: (show: boolean) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Simple Custom Editor Component
const CustomEditor = ({ 
  value, 
  onChange, 
  isDisabled, 
  isModified 
}: { 
  value: string; 
  onChange: (value: string) => void; 
  isDisabled: boolean;
  isModified: boolean;
}) => {
  const editorRef = React.useRef<HTMLDivElement>(null);
  
  // Update the content of the editable div when the value prop changes
  useEffect(() => {
    if (editorRef.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;
      }
    }
  }, [value]);
  
  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };
  
  const handleFormatting = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
      editorRef.current.focus();
    }
  };

  return (
    <div className={`border ${isModified ? 'border-yellow-300' : 'border-gray-300'} rounded-lg bg-white overflow-hidden`}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-300">
        <button 
          type="button"
          className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-200 text-sm"
          onClick={() => handleFormatting('bold')}
          disabled={isDisabled}
        >
          <strong>B</strong>
        </button>
        <button 
          type="button"
          className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-200 text-sm"
          onClick={() => handleFormatting('italic')}
          disabled={isDisabled}
        >
          <em>I</em>
        </button>
        <button 
          type="button"
          className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-200 text-sm"
          onClick={() => handleFormatting('underline')}
          disabled={isDisabled}
        >
          <u>U</u>
        </button>
        <div className="border-r border-gray-300 mx-1 h-6"></div>
        <button 
          type="button"
          className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-200 text-sm"
          onClick={() => handleFormatting('formatBlock', '<h2>')}
          disabled={isDisabled}
        >
          H2
        </button>
        <button 
          type="button"
          className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-200 text-sm"
          onClick={() => handleFormatting('formatBlock', '<h3>')}
          disabled={isDisabled}
        >
          H3
        </button>
        <button 
          type="button"
          className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-200 text-sm"
          onClick={() => handleFormatting('formatBlock', '<p>')}
          disabled={isDisabled}
        >
          P
        </button>
        <div className="border-r border-gray-300 mx-1 h-6"></div>
        <button 
          type="button"
          className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-200 text-sm"
          onClick={() => handleFormatting('insertUnorderedList')}
          disabled={isDisabled}
        >
          • List
        </button>
        <button 
          type="button"
          className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-200 text-sm"
          onClick={() => handleFormatting('insertOrderedList')}
          disabled={isDisabled}
        >
          1. List
        </button>
      </div>
      
      {/* Editable content area */}
      <div
        ref={editorRef}
        className={`p-3 min-h-[200px] outline-none ${isModified ? 'bg-yellow-50' : 'bg-white'} ${isDisabled ? 'bg-gray-100 opacity-70 cursor-not-allowed' : ''}`}
        contentEditable={!isDisabled}
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  );
};

const DirectorForm: React.FC<DirectorFormProps> = ({
  isLoading,
  selectedDirectorId,
  orderIndex,
  setOrderIndex,
  name,
  setName,
  designation,
  setDesignation,
  shortDescription,
  setShortDescription,
  longDescription,
  setLongDescription,
  imagePreview,
  originalValues,
  isFormModified,
  handleSubmit,
  setShowForm,
  handleImageChange
}) => {
  // Safe comparison function to handle potential undefined values
  const isChanged = (current: any, original: any) => {
    if (originalValues === undefined) return false;
    return current !== original;
  };

  return (
    <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 shadow-sm">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        {selectedDirectorId ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit Director
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Director
          </>
        )}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="orderIndex" className="block text-sm font-medium text-gray-700 mb-2">
              Display Order<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="orderIndex"
              value={orderIndex}
              onChange={(e) => setOrderIndex(parseInt(e.target.value) || 0)}
              className={`w-full p-3 border ${isChanged(orderIndex, originalValues?.orderIndex) ? 'border-yellow-300 bg-yellow-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm`}
              placeholder="Enter display order"
              disabled={isLoading}
            />
            {isChanged(orderIndex, originalValues?.orderIndex) && (
              <p className="text-xs text-yellow-600 mt-1">This field has been modified</p>
            )}
          </div>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-3 border ${isChanged(name, originalValues?.name) ? 'border-yellow-300 bg-yellow-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm`}
              placeholder="Enter director name"
              required
              disabled={isLoading}
            />
            {isChanged(name, originalValues?.name) && (
              <p className="text-xs text-yellow-600 mt-1">This field has been modified</p>
            )}
          </div>
          
          <div>
            <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-2">
              Designation<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="designation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className={`w-full p-3 border ${isChanged(designation, originalValues?.designation) ? 'border-yellow-300 bg-yellow-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm`}
              placeholder="Enter director designation"
              required
              disabled={isLoading}
            />
            {isChanged(designation, originalValues?.designation) && (
              <p className="text-xs text-yellow-600 mt-1">This field has been modified</p>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Short Description<span className="text-red-500">*</span>
          </label>
          <textarea
            id="shortDescription"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            rows={2}
            className={`w-full p-3 border ${isChanged(shortDescription, originalValues?.shortDescription) ? 'border-yellow-300 bg-yellow-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm`}
            placeholder="Enter short description"
            required
            disabled={isLoading}
          />
          {isChanged(shortDescription, originalValues?.shortDescription) && (
            <p className="text-xs text-yellow-600 mt-1">This field has been modified</p>
          )}
        </div>
        
        <div>
          <label htmlFor="longDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Long Description<span className="text-red-500">*</span>
          </label>
          <CustomEditor 
            value={longDescription} 
            onChange={setLongDescription} 
            isDisabled={isLoading} 
            isModified={isChanged(longDescription, originalValues?.longDescription)}
          />
          {isChanged(longDescription, originalValues?.longDescription) && (
            <p className="text-xs text-yellow-600 mt-1">This field has been modified</p>
          )}
        </div>
        
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
            Director Image
            {selectedDirectorId && <span className="text-gray-500 ml-2 font-normal">(Leave empty to keep current image)</span>}
          </label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            accept="image/*"
            disabled={isLoading}
          />
          {imagePreview && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Image Preview:</p>
              <div className="h-40 w-40 rounded-lg border border-gray-300 overflow-hidden">
                <img 
                  src={imagePreview} 
                  alt="Director Preview" 
                  className="h-full w-full object-cover"
                />
              </div>
              {!imagePreview.startsWith('data:') && (
                <a href={imagePreview} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 mt-1 inline-block">
                  View direct image link
                </a>
              )}
            </div>
          )}
        </div>
        
        <div className="flex justify-center pt-6">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium shadow-sm mr-4"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-8 py-3 ${isFormModified ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} text-white rounded-lg font-medium shadow-sm flex items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isLoading || !isFormModified}
          >
            {isLoading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isLoading ? 'Saving...' : (
              isFormModified ? (
                selectedDirectorId ? 'Update Director' : 'Add Director'
              ) : 'No Changes to Save'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DirectorForm;