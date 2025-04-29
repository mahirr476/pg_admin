"use client";
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const ComplianceDetail = () => {
  const [data, setData] = useState([]);
  const [compliances, setCompliances] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    index: '',
    title: '',
    description: '',
    shortDescrip: '',
    complianceId: '',
  });

  // Fetch all compliance details
  const fetchComplianceDetails = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get('http://localhost:7000/api/v1/parasole/compliance-detail', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching compliance details:', error);
    }
  };

  // Fetch list of compliances for dropdown
  const fetchCompliances = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get('http://localhost:7000/api/v1/parasole/compliance', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCompliances(response.data.data);
    } catch (error) {
      console.error('Error fetching compliances:', error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchComplianceDetails(), fetchCompliances()])
      .finally(() => setIsLoading(false));
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Open modal to add new or edit existing item
  const openModal = (item = null) => {
    if (item) {
      setSelectedItem(item);
      setFormData({
        index: item.index,
        title: item.title,
        description: item.description,
        shortDescrip: item.shortDescrip,
        complianceId: item.complianceId,
      });
    } else {
      setSelectedItem(null);
      setFormData({
        index: '',
        title: '',
        description: '',
        shortDescrip: '',
        complianceId: compliances.length > 0 ? compliances[0].id : '',
      });
    }
    setIsModalOpen(true);
  };

  // Submit form (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = Cookies.get('token');
      if (selectedItem) {
        // Update
        await axios.put(
          `http://localhost:7000/api/v1/parasole/compliance-detail/${selectedItem.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        // Create
        await axios.post(
          'http://localhost:7000/api/v1/parasole/compliance-detail',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }
      setIsModalOpen(false);
      fetchComplianceDetails();
    } catch (error) {
      console.error('Error saving compliance detail:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete item
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this compliance detail?')) return;
    setIsLoading(true);
    try {
      const token = Cookies.get('token');
      await axios.delete(`http://localhost:7000/api/v1/parasole/compliance-detail/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchComplianceDetails();
    } catch (error) {
      console.error('Error deleting compliance detail:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle status
  const handleStatusToggle = async (item, newStatus) => {
    setIsLoading(true);
    try {
      const token = Cookies.get('token');
      await axios.put(
        `http://localhost:7000/api/v1/parasole/compliance-detail/${item.id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      fetchComplianceDetails();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get title from complianceId
  const getComplianceTitle = (id) => {
    const comp = compliances.find(c => c.id === id);
    return comp ? comp.title : 'N/A';
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Compliance Detail Management</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New
        </button>
      </div>

      {/* Table with horizontal scroll */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Index</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Short Desc</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compliance Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center">Loading...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center">No data available</td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.index}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.title}</td>
                  <td className="px-6 py-4 max-w-xs truncate">{item.description}</td>
                  <td className="px-6 py-4">{item.shortDescrip || '-'}</td>
                  <td className="px-6 py-4">{getComplianceTitle(item.complianceId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative inline-block w-40">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusToggle(item, e.target.value)}
                        className={`appearance-none w-full pl-3 pr-10 py-2 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium transition-all duration-200 ${
                          item.status === 'ACTIVE'
                            ? 'bg-green-50 text-green-800 border-green-200'
                            : 'bg-red-50 text-red-800 border-red-200'
                        }`}
                      >
                        <option value="ACTIVE" className="bg-white text-green-800">Active</option>
                        <option value="INACTIVE" className="bg-white text-red-800">Inactive</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                      <div
                        className={`absolute top-0 right-10 mt-2 h-4 w-4 rounded-full ${
                          item.status === 'ACTIVE' ? 'bg-green-400' : 'bg-red-400'
                        }`}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openModal(item)}
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-md"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2000 a2 2v11a2 2000 a2 2h11a2 2000 a2-2v-5m-1.414-9.414a2 2000 a2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-md"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2000 a2 21H7.862a2 2000 a2-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedItem ? 'Edit Compliance Detail' : 'Create New Compliance Detail'}
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
                    rows="4"
                    className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Description
                  </label>
                  <textarea
                    name="shortDescrip"
                    value={formData.shortDescrip}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Compliance Title
                  </label>
                  <select
                    name="complianceId"
                    value={formData.complianceId}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  >
                    {compliances.map((comp) => (
                      <option key={comp.id} value={comp.id}>
                        {comp.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 border border-transparent rounded-md shadow-sm px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceDetail;