
"use client";
import React from "react";
import { CheckCircle, XCircle, Pencil, Trash2, Plus, Loader2, ImageIcon } from "lucide-react";
import useContact from "@/hooks/parasole/contact/useContact";

const ContactPage: React.FC = () => {
  const {
    data,
    isModalOpen,
    isLoading,
    selectedItem,
    error,
    formData,
    previewImage,
    fetchContactData,
    handleInputChange,
    handleImageChange,
    openModal,
    closeModal,
    handleSubmit,
    handleDelete,
    handleStatusToggle,
  } = useContact();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contact Management</h1>
            <p className="mt-1 text-sm text-gray-500">Manage contact section content</p>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm flex items-center transition duration-150 ease-in-out"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Contact
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-start">
            <Trash2 className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {/* Table Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Contact Items</h2>
          </div>

          {/* Table with horizontal scroll */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Index
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 text-blue-500 animate-spin mr-2" />
                        <span className="text-gray-500">Loading data...</span>
                      </div>
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center">
                      <div className="text-gray-500">
                        <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
                        <p className="mt-2 text-sm">No contact items available</p>
                        <button
                          onClick={() => openModal()}
                          className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add your first contact
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.index}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.title}
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate text-sm text-gray-500">
                        {item.description}
                      </td>
                      <td className="px-6 py-4">
                        {previewImage || item.image ? (
                          <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                            <img
                              src={
                                item.image.startsWith("http")
                                  ? item.image
                                  : `http://localhost:7000/${item.image.replace(/^public\//, "")}`
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
                              handleStatusToggle(item, e.target.value as "ACTIVE" | "INACTIVE")
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
                            onClick={() => openModal(item)}
                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-md transition-colors duration-200"
                            title="Edit item"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-md transition-colors duration-200"
                            title="Delete item"
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
      </div>

      {/* Modal - Create/Edit Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="my-8 bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="sticky top-0 px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center z-10">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedItem ? "Edit Contact Item" : "Create New Contact"}
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
              <div className="px-6 py-5 space-y-6">
                {/* Form error message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-start mb-4">
                    <Trash2 className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <div>{error}</div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6">
                  {/* Index */}
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Index <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="index"
                      value={formData.index}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="Enter display order (e.g., 1)"
                      required
                    />
                  </div>

                  {/* Title */}
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="Enter title"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="Enter description"
                    ></textarea>
                  </div>

                  {/* Image Upload */}
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {previewImage && (
                      <div className="mt-2">
                        <img src={previewImage} alt="Preview" className="h-32 w-32 object-cover rounded-md" />
                      </div>
                    )}
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg shadow-sm pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      required
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Saving...
                      </span>
                    ) : selectedItem ? "Update Contact" : "Create Contact"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactPage;