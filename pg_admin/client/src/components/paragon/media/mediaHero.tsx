"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Edit, Trash2, ToggleLeft, ToggleRight, Plus, X } from 'lucide-react';

const MediaHero = () => {
  // State for storing media data
  const [mediaData, setMediaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for form management
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    orderIndex: '',
    description: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  
  // Get token from js-cookie
  const token = Cookies.get('token');

  // Configure axios with token
  const api = axios.create({
    baseURL: 'http://localhost:7000/api/v1',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  // Fetch media data
  const fetchMediaData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/group/media');
      if (response.data.success) {
        setMediaData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  // Submit form data (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        // Update existing record
        const response = await api.put(`/group/media/${formData.id}`, formData);
        if (response.data.success) {
          fetchMediaData(); // Refresh data
          resetForm();
          setShowModal(false);
        } else {
          setError(response.data.message || 'Failed to update record');
        }
      } else {
        // Create new record
        const response = await api.post('/group/media', formData);
        if (response.data.success) {
          fetchMediaData(); // Refresh data
          resetForm();
          setShowModal(false);
        } else {
          setError(response.data.message || 'Failed to create record');
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset form state
  const resetForm = () => {
    setFormData({
      id: null,
      title: '',
      orderIndex: '',
      description: ''
    });
    setIsEditing(false);
  };

  // Open modal for creating new item
  const handleOpenCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  // Edit a record
  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      title: item.title,
      orderIndex: item.orderIndex,
      description: item.description
    });
    setIsEditing(true);
    setShowModal(true);
  };

  // Delete a record
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await api.delete(`/group/media/${id}`);
        if (response.data.success) {
          fetchMediaData(); // Refresh data
        } else {
          setError(response.data.message || 'Failed to delete record');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while deleting');
      }
    }
  };

  // Toggle status (active/inactive)
  const toggleStatus = async (id, currentStatus) => {
    try {
      // Make sure to send the correct opposite status
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      
      // Using the main endpoint with a PUT request instead of a specialized status endpoint
      const response = await api.put(`/group/media/${id}`, { 
        status: newStatus 
      });
      
      if (response.data.success) {
        // Update the local state to reflect the change immediately
        setMediaData(prevData => 
          prevData.map(item => 
            item.id === id ? { ...item, status: newStatus } : item
          )
        );
      } else {
        setError(response.data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error("Status update error:", err);
      setError(err.response?.data?.message || err.message || 'An error occurred while updating status');
    }
  };

  // Close modal and reset form
  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  // Fetch data on component mount
  useEffect(() => {
    if (!token) {
      setError('Authentication token not found');
      return;
    }
    fetchMediaData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Media Management</h1>
        <button 
          onClick={handleOpenCreateModal}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" /> Add New Media
        </button>
      </div>

      {/* Error message display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <button 
            className="float-right font-bold"
            onClick={() => setError(null)}
          >
            &times;
          </button>
        </div>
      )}

      {/* Table section */}
      <div className="bg-white shadow-md rounded overflow-hidden">
        <h2 className="text-lg font-semibold p-4 border-b">Media Items</h2>
        {loading ? (
          <div className="text-center p-4">Loading...</div>
        ) : mediaData.length === 0 ? (
          <div className="text-center p-4">No media items found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">Order Index</th>
                  <th className="py-3 px-4 text-left">Title</th>
                  <th className="py-3 px-4 text-left">Description</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mediaData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{item.orderIndex}</td>
                    <td className="py-3 px-4">{item.title}</td>
                    <td className="py-3 px-4">
                      <div className="line-clamp-2">{item.description}</div>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleStatus(item.id, item.status)}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          item.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.status === 'ACTIVE' ? (
                          <><ToggleRight className="mr-1 h-4 w-4" /> Active</>
                        ) : (
                          <><ToggleLeft className="mr-1 h-4 w-4" /> Inactive</>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-500 hover:text-blue-700"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">
                {isEditing ? 'Edit Media Item' : 'Add New Media Item'}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Order Index</label>
                  <input
                    type="number"
                    name="orderIndex"
                    value={formData.orderIndex}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    rows="3"
                    required
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-end mt-6 space-x-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {isEditing ? 'Update' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaHero;