'use client';
import React, { useEffect } from 'react';
import { Editor } from 'primereact/editor'; // Import PrimeReact Editor
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // PrimeReact Theme
import 'primereact/resources/primereact.min.css'; // PrimeReact Core CSS
import 'primeicons/primeicons.css'; // PrimeReact Icons

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
  handleImageChange,
}) => {
  // Safe comparison function to handle potential undefined values
  const isChanged = (current: any, original: any): boolean => {
    if (originalValues === undefined) return false;
    return current !== original;
  };

  // Editor header template for improved styling
  const editorHeader = (
    <span className="ql-formats">
      <button className="ql-bold" aria-label="Bold"></button>
      <button className="ql-italic" aria-label="Italic"></button>
      <button className="ql-underline" aria-label="Underline"></button>
      <button className="ql-strike" aria-label="Strike"></button>
      <button className="ql-blockquote" aria-label="Blockquote"></button>
      <button className="ql-list" value="ordered" aria-label="Ordered List"></button>
      <button className="ql-list" value="bullet" aria-label="Bullet List"></button>
      <button className="ql-link" aria-label="Insert Link"></button>
      <select className="ql-size" defaultValue="" aria-label="Size">
        <option value="small">Small</option>
        <option value="">Normal</option>
        <option value="large">Large</option>
        <option value="huge">Huge</option>
      </select>
      <select className="ql-header" defaultValue="0" aria-label="Header">
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
        <option value="0">Normal</option>
      </select>
      <select className="ql-align" defaultValue="" aria-label="Align">
        <option value="">Left</option>
        <option value="center">Center</option>
        <option value="right">Right</option>
        <option value="justify">Justify</option>
      </select>
    </span>
  );

  // Custom CSS styles for the editor
  useEffect(() => {
    // Add custom styles for the editor
    const style = document.createElement('style');
    style.innerHTML = `
      .p-editor-container .p-editor-content {
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        min-height: 200px;
      }
      .p-editor-container .p-editor-content.p-error {
        border-color: #ef4444;
      }
      .p-editor-container .p-editor-toolbar {
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
        background-color: #f9fafb;
        border: 1px solid #d1d5db;
        border-bottom: none;
      }
      .ql-container {
        font-family: inherit !important;
        font-size: 1rem !important;
      }
      .ql-editor {
        padding: 1rem !important;
        min-height: 200px !important;
      }
      .ql-editor.ql-blank::before {
        font-style: normal !important;
        color: #9ca3af !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

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
        {/* Order Index */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="orderIndex" className="block text-sm font-medium text-gray-700 mb-2">
              Display Order<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="orderIndex"
              value={orderIndex || ''}
              onChange={(e) => setOrderIndex(parseInt(e.target.value) || 0)}
              className={`w-full p-3 border ${isChanged(orderIndex, originalValues?.orderIndex) ? 'border-yellow-300 bg-yellow-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm`}
              placeholder="Enter display order"
              min="0"
              disabled={isLoading}
            />
            {isChanged(orderIndex, originalValues?.orderIndex) && (
              <p className="text-xs text-yellow-600 mt-1">This field has been modified</p>
            )}
          </div>

          {/* Name */}
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

          {/* Designation */}
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

        {/* Short Description */}
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

        {/* Long Description with PrimeReact Editor */}
        <div>
          <label htmlFor="longDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Long Description<span className="text-red-500">*</span>
          </label>
          <div className={`${isChanged(longDescription, originalValues?.longDescription) ? 'border-2 border-yellow-300 rounded-lg p-0.5 bg-yellow-50' : ''}`}>
            <Editor
              id="longDescription"
              value={longDescription}
              onTextChange={(e) => setLongDescription(e.htmlValue || '')}
              style={{ height: '320px' }}
              placeholder="Enter long description..."
              readOnly={isLoading}
              headerTemplate={editorHeader}
              pt={{
                toolbar: { className: 'rounded-t-lg border border-gray-300' },
                content: { className: 'rounded-b-lg border border-gray-300 border-t-0' }
              }}
            />
          </div>
          {isChanged(longDescription, originalValues?.longDescription) && (
            <p className="text-xs text-yellow-600 mt-1">This field has been modified</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
            Director Image
            {selectedDirectorId && <span className="text-gray-500 ml-2 font-normal">(Leave empty to keep current image)</span>}
          </label>
          <div className="flex items-center">
            <div className="relative w-full">
              <input
                type="file"
                id="image"
                onChange={handleImageChange}
                className="block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm text-gray-700 bg-white"
                accept="image/*"
                disabled={isLoading}
              />
            </div>
          </div>
          {imagePreview && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Image Preview:</p>
              <div className="h-48 w-48 rounded-lg border border-gray-300 overflow-hidden bg-white shadow-sm">
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

        {/* Action Buttons */}
        <div className="flex justify-center pt-6">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium shadow-sm mr-4 transition duration-150"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-8 py-3 ${isFormModified ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} text-white rounded-lg font-medium shadow-sm flex items-center transition duration-150 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isLoading || !isFormModified}
          >
            {isLoading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isLoading ? 'Saving...' : isFormModified ? (selectedDirectorId ? 'Update Director' : 'Add Director') : 'No Changes to Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DirectorForm;