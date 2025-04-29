"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Plus } from 'lucide-react';

const OperationPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    index: '',
    title: '',
    description: '',
    images: [],
  });
  const [previewImages, setPreviewImages] = useState([]);

  // Fetch operation data
  const fetchOperationData = async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get('token');
      const response = await axios.get(
        'http://localhost:7000/api/v1/parasole/operation',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.data || []);
    } catch (error) {
      console.error('Error fetching operation data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOperationData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: files }));

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = Cookies.get('token');
    const formDataToSend = new FormData();

    formDataToSend.append('index', formData.index);
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);

    if (formData.images.length > 0) {
      formData.images.forEach((image) => {
        formDataToSend.append('images', image);
      });
    }

    try {
      if (selectedItem) {
        // Update existing item
        await axios.put(
          `http://localhost:7000/api/v1/parasole/operation/${selectedItem.id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } else {
        // Create new item
        await axios.post(
          'http://localhost:7000/api/v1/parasole/operation',
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      }
      closeModal();
      fetchOperationData();
    } catch (error) {
      console.error('Error saving operation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Open modal for add/edit
  const openModal = (item = null) => {
    if (item) {
      setSelectedItem(item);
      setFormData({
        index: item.index,
        title: item.title,
        description: item.description,
        images: [],
      });
      setPreviewImages(
        item.images.map((img) =>
          img.startsWith('http') ? img : `http://localhost:7000/${img.replace(/^public\//, '')}`
        )
      );
    } else {
      setSelectedItem(null);
      setFormData({
        index: '',
        title: '',
        description: '',
        images: [],
      });
      setPreviewImages([]);
    }
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      index: '',
      title: '',
      description: '',
      images: [],
    });
    setPreviewImages([]);
    setSelectedItem(null);
  };

  // Delete item
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this operation?')) return;
    setIsLoading(true);
    try {
      const token = Cookies.get('token');
      await axios.delete(`http://localhost:7000/api/v1/parasole/operation/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchOperationData();
    } catch (error) {
      console.error('Error deleting operation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update status via dropdown selection
  const handleStatusChange = async (item, newStatus) => {
    setIsLoading(true);
    try {
      const token = Cookies.get('token');
      await axios.put(
        `http://localhost:7000/api/v1/parasole/operation/${item.id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      fetchOperationData(); // Refresh data after update
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Operation Management</h1>
        <button
          onClick={() => openModal()}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Operation
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Index</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">Loading...</td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">No data found</td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{item.title}</td>
                    <td className="px-6 py-4 max-w-xs truncate text-sm">{item.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{item.index}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.images && item.images.length > 0 && (
                        <img
                          src={
                            item.images[0].startsWith('http')
                              ? item.images[0]
                              : `http://localhost:7000/${item.images[0].replace(/^public\//, '')}`
                          }
                          alt="Operation"
                          className="w-16 h-16 object-cover rounded-md"
                          onError={(e) => {
                            e.currentTarget.src = '/images/placeholder.jpg';
                          }}
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item, e.target.value)}
                        className={`block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${
                          item.status === 'ACTIVE' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                        }`}
                      >
                        <option value="ACTIVE" className="bg-white text-green-800">
                          Active
                        </option>
                        <option value="INACTIVE" className="bg-white text-red-800">
                          Inactive
                        </option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => openModal(item)}
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-md"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-md"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedItem ? 'Edit Operation' : 'Add New Operation'}
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Index</label>
                  <input
                    type="number"
                    name="index"
                    value={formData.index}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple={false}
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {previewImages.map((src, idx) => (
                      <img
                        key={idx}
                        src={src}
                        alt="Preview"
                        className="h-16 w-16 object-cover rounded-md"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 border border-transparent rounded-md shadow-sm px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : selectedItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperationPage;