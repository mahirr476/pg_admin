

"use client";

import React from "react";
import { Plus, Edit, Trash2, AlertTriangle, ImageIcon, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useBuyer } from "@/hooks/parasole/buyer/useBuyer";
import { BuyerItem } from "@/types/parasole/buyer/buyer";

// API base URL
const API_BASE_URL = 'http://localhost:7000';

const BuyerPage: React.FC = () => {
  const {
    buyerData,
    isModalOpen,
    isLoading,
    selectedItem,
    formData,
    previewImages,
    error,
    handleAddNew,
    handleEdit,
    handleInputChange,
    handleImageChange,
    handleSubmit,
    handleDelete,
    handleStatusToggle,
    closeModal
  } = useBuyer();

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Buyer Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your buyers and global partnerships
          </p>
        </div>
        <button
          onClick={handleAddNew}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm flex items-center transition duration-150 ease-in-out"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Buyer
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {/* Card with Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900">Buyer Directory</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Index</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center">
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
                      <p className="text-gray-500">Loading buyer data...</p>
                    </div>
                  </td>
                </tr>
              ) : buyerData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center">
                    <div className="text-gray-500">
                      <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
                      <p className="mt-2 text-sm font-medium">No buyers found</p>
                      <p className="text-xs text-gray-400 mb-3">Add your first buyer to get started</p>
                      <button
                        onClick={handleAddNew}
                        className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Buyer
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                buyerData.map((item: BuyerItem) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="max-w-xs truncate">{item.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.index}
                    </td>
                    <td className="px-6 py-4">
                      {item.images && item.images.length > 0 ? (
                        <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                          <img
                            src={
                              item.images[0].startsWith("http")
                                ? item.images[0]
                                : `${API_BASE_URL}/${item.images[0].replace(/^public\//, "")}`
                            }
                            alt={`${item.title}`}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/images/placeholder.jpg";
                            }}
                          />
                        </div>
                      ) : (
                        <div className="h-16 w-16 rounded-lg flex items-center justify-center bg-gray-100 border border-gray-200">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative inline-block w-48">
                        <select
                          value={item.status}
                          onChange={(e) =>
                            handleStatusToggle(
                              item,
                              e.target.value as "ACTIVE" | "INACTIVE"
                            )
                          }
                          className={`appearance-none w-full pl-10 pr-10 py-2 rounded-lg border text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            item.status === "ACTIVE"
                              ? "bg-green-50 text-green-800 border-green-200"
                              : "bg-red-50 text-red-800 border-red-200"
                          }`}
                        >
                          <option value="ACTIVE" className="bg-white text-gray-900">Active</option>
                          <option value="INACTIVE" className="bg-white text-gray-900">Inactive</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm">
                          {item.status === "ACTIVE" ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2 justify-end">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-md transition-colors duration-200"
                          title="Edit buyer"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-md transition-colors duration-200"
                          title="Delete buyer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Create/Edit Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="my-8 bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="sticky top-0 px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center z-10">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedItem ? "Edit Buyer" : "Add New Buyer"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-5 space-y-6 max-h-96 overflow-y-auto">
                {/* Form error message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-start mb-4">
                    <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <div>{error}</div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-6">
                  <div className="col-span-1">
                    <label htmlFor="index" className="block text-sm font-medium text-gray-700 mb-1">
                      Index <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="index"
                      name="index"
                      value={formData.index}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="Enter display order (e.g., 1, 2, 3)"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">Sets the display order in the list</p>
                  </div>
                  
                  <div className="col-span-1">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="Enter buyer title"
                      required
                    />
                  </div>
                  
                  <div className="col-span-1">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="Enter detailed description"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image {!selectedItem && <span className="text-red-500">*</span>}
                    </label>
                    <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg px-6 py-8 flex justify-center">
                      <div className="space-y-1 text-center">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                            <span>Upload files</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                      </div>
                    </div>
                    
                    {previewImages.length > 0 && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Image Preview
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                          {previewImages.map((preview, idx) => (
                            <div key={idx} className="relative group">
                              <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100">
                                <img
                                  src={preview}
                                  alt={`Preview ${idx + 1}`}
                                  className="h-24 w-24 object-cover rounded-md border border-gray-200"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="col-span-1">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      required
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="sticky bottom-0 px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Saving...
                    </span>
                  ) : (
                    selectedItem ? 'Update Buyer' : 'Create Buyer'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerPage;