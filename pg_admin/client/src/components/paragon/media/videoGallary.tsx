"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Edit, Trash2, ToggleLeft, ToggleRight, Plus, X, Image, Link } from 'lucide-react';

const VideoGallery = () => {
  // State for storing gallery data
  const [galleryData, setGalleryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for form management
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    description: '',
    image: null,
    link: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
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

  // Fetch gallery data
  const fetchGalleryData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/group/media/gallery');
      if (response.data.success) {
        setGalleryData(Array.isArray(response.data.data) ? response.data.data : [response.data.data].filter(Boolean));
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
      // Create FormData object for file upload
      const formDataObj = new FormData();
      formDataObj.append('title', formData.title);
      formDataObj.append('description', formData.description);
      formDataObj.append('link', formData.link);
      
      // Only append image if it's a new file
      if (formData.image instanceof File) {
        formDataObj.append('image', formData.image);
      }
      
      // Configure headers for multipart/form-data
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      };
      
      if (isEditing) {
        // Update existing record
        const response = await axios.put(
          `http://localhost:7000/api/v1/group/media/gallery/${formData.id}`, 
          formDataObj, 
          { headers }
        );
        
        if (response.data.success) {
          fetchGalleryData(); // Refresh data
          resetForm();
          setShowModal(false);
        } else {
          setError(response.data.message || 'Failed to update record');
        }
      } else {
        // Create new record
        const response = await axios.post(
          'http://localhost:7000/api/v1/group/media/gallery', 
          formDataObj, 
          { headers }
        );
        
        if (response.data.success) {
          fetchGalleryData(); // Refresh data
          resetForm();
          setShowModal(false);
        } else {
          setError(response.data.message || 'Failed to create record');
        }
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setError(err.response?.data?.message || err.message || 'An error occurred');
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

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset form state
  const resetForm = () => {
    setFormData({
      id: null,
      title: '',
      description: '',
      image: null,
      link: ''
    });
    setImagePreview(null);
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
      description: item.description,
      // Don't set image here, only the link field
      link: item.link
    });
    
    // Set image preview if available
    if (item.image) {
      // Check if the image path is absolute or relative
      const imagePath = item.image.startsWith('http') 
        ? item.image 
        : `http://localhost:7000/${item.image.replace(/^public\//, '')}`;
      
      setImagePreview(imagePath);
    } else {
      setImagePreview(null);
    }
    
    setIsEditing(true);
    setShowModal(true);
  };

  // Delete a record
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await api.delete(`/group/media/gallery/${id}`);
        if (response.data.success) {
          fetchGalleryData(); // Refresh data
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
      
      // Using the main endpoint with a PUT request
      const response = await api.put(`/group/media/gallery/${id}`, { 
        status: newStatus 
      });
      
      if (response.data.success) {
        // Update the local state to reflect the change immediately
        setGalleryData(prevData => 
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

  // Format image URL
  // const formatImageUrl = (imagePath) => {
  //   if (!imagePath) return null;
    
  //   return imagePath.startsWith('http') 
  //     ? imagePath 
  //     : `http://localhost:7000/${imagePath.replace(/^public\//, '')}`;
  // };

  // Fetch data on component mount
  useEffect(() => {
    if (!token) {
      setError('Authentication token not found');
      return;
    }
    fetchGalleryData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Video Gallery</h1>
        <button 
          onClick={handleOpenCreateModal}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" /> Add New Video
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
        <h2 className="text-lg font-semibold p-4 border-b">Video Gallery Items</h2>
        {loading ? (
          <div className="text-center p-4">Loading...</div>
        ) : galleryData.length === 0 ? (
          <div className="text-center p-4">No video gallery items found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">ID</th>
                  <th className="py-3 px-4 text-left">Title</th>
                  <th className="py-3 px-4 text-left">Description</th>
                  <th className="py-3 px-4 text-left">Image</th>
                  <th className="py-3 px-4 text-left">Link</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {galleryData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{item.id}</td>
                    <td className="py-3 px-4">{item.title}</td>
                    <td className="py-3 px-4">
                      <div className="line-clamp-2">{item.description}</div>
                    </td>
                    <td className="py-3 px-4">
                      {item.image && (
                        <div className="w-16 h-16 relative">
                          <img 
                            // src={formatImageUrl(item.image)} 
                            src={`http://localhost:7000/${item.image}`}
                            alt={item.title} 
                            className="object-cover w-full h-full rounded"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/150?text=No+Image";
                            }}
                          />
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="line-clamp-1">{item.link}</div>
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
                {isEditing ? 'Edit Video Gallery Item' : 'Add New Video Gallery Item'}
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
                <div>
                  <label className="block text-gray-700 mb-2">Image</label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      name="image"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                      accept="image/*"
                    />
                    <label 
                      htmlFor="image-upload"
                      className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded cursor-pointer flex items-center"
                    >
                      <Image className="h-4 w-4 mr-2" />
                      {isEditing ? 'Change Image' : 'Select Image'}
                    </label>
                    {imagePreview && (
                      <div className="w-12 h-12 relative">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="object-cover w-full h-full rounded"
                        />
                      </div>
                    )}
                  </div>
                  {isEditing && !formData.image && (
                    <p className="text-sm text-gray-500 mt-1">
                      {imagePreview ? "Current image will be kept unless a new one is selected." : "No image currently."}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Link</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-2 rounded-l border border-r-0 border-gray-300 bg-gray-100">
                      <Link className="h-4 w-4 text-gray-500" />
                    </span>
                    <input
                      type="text"
                      name="link"
                      value={formData.link}
                      onChange={handleChange}
                      className="w-full border rounded-r px-3 py-2"
                      required
                    />
                  </div>
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

export default VideoGallery;