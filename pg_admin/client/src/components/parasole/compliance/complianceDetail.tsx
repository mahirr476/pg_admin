


"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { CheckCircle, XCircle, Pencil, Trash2, Plus, Loader2, ClipboardList } from 'lucide-react';

// Define interfaces for our data types
interface ComplianceItem {
  id: string;
  title: string;
  status: 'ACTIVE' | 'INACTIVE';
}

interface ComplianceDetailItem {
  id: string;
  index: number;
  title: string;
  description: string;
  shortDescrip: string;
  complianceId: string;
  status: 'ACTIVE' | 'INACTIVE';
}

interface FormData {
  index: string;
  title: string;
  description: string;
  shortDescrip: string;
  complianceId: string;
}

const ComplianceDetail: React.FC = () => {
  const [data, setData] = useState<ComplianceDetailItem[]>([]);
  const [compliances, setCompliances] = useState<ComplianceItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<ComplianceDetailItem | null>(null);

  // API base URL
  const API_BASE_URL = 'http://localhost:7000';

  // Form state
  const [formData, setFormData] = useState<FormData>({
    index: '',
    title: '',
    description: '',
    shortDescrip: '',
    complianceId: '',
  });

  // Fetch all compliance details
  const fetchComplianceDetails = async (): Promise<void> => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`${API_BASE_URL}/api/v1/parasole/compliance-detail`, {
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
  const fetchCompliances = async (): Promise<void> => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`${API_BASE_URL}/api/v1/parasole/compliance`, {
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Open modal to add new or edit existing item
  const openModal = (item: ComplianceDetailItem | null = null): void => {
    if (item) {
      setSelectedItem(item);
      setFormData({
        index: item.index.toString(),
        title: item.title,
        description: item.description,
        shortDescrip: item.shortDescrip || '',
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
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = Cookies.get('token');
      if (selectedItem) {
        // Update
        await axios.put(
          `${API_BASE_URL}/api/v1/parasole/compliance-detail/${selectedItem.id}`,
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
          `${API_BASE_URL}/api/v1/parasole/compliance-detail`,
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
  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this compliance detail?')) return;
    setIsLoading(true);
    try {
      const token = Cookies.get('token');
      await axios.delete(`${API_BASE_URL}/api/v1/parasole/compliance-detail/${id}`, {
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
  const handleStatusToggle = async (item: ComplianceDetailItem, newStatus: 'ACTIVE' | 'INACTIVE'): Promise<void> => {
    setIsLoading(true);
    try {
      const token = Cookies.get('token');
      await axios.put(
        `${API_BASE_URL}/api/v1/parasole/compliance-detail/${item.id}`,
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
  const getComplianceTitle = (id: string): string => {
    const comp = compliances.find(c => c.id === id);
    return comp ? comp.title : 'N/A';
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Compliance Detail Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage detailed compliance information and requirements
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm flex items-center transition duration-150 ease-in-out"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Detail
          </button>
        </div>

        {/* Card with Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Compliance Details</h2>
          </div>

          {/* Table with horizontal scroll */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Index</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Short Desc</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compliance Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 text-blue-500 animate-spin mr-2" />
                        <span className="text-gray-500">Loading data...</span>
                      </div>
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center">
                      <div className="text-gray-500">
                        <ClipboardList className="h-12 w-12 mx-auto text-gray-400" />
                        <p className="mt-2 text-sm">No compliance details available</p>
                        <button
                          onClick={() => openModal()}
                          className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add your first detail
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
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="max-w-xs truncate">{item.description}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="max-w-xs truncate">{item.shortDescrip || '-'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {getComplianceTitle(item.complianceId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative inline-block w-48">
                          <select
                            value={item.status}
                            onChange={(e) => handleStatusToggle(item, e.target.value as 'ACTIVE' | 'INACTIVE')}
                            className={`appearance-none w-full pl-10 pr-10 py-2 rounded-lg border text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              item.status === 'ACTIVE'
                                ? 'bg-green-50 text-green-800 border-green-200'
                                : 'bg-red-50 text-red-800 border-red-200'
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
                            {item.status === 'ACTIVE' ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
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
                {selectedItem ? 'Edit Compliance Detail' : 'Create New Compliance Detail'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-5 space-y-6 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 gap-6">
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
                      placeholder="Enter display order (e.g., 1, 2, 3)"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">Sets the display order in the list</p>
                  </div>
                
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
                      placeholder="Enter detail title"
                      required
                    />
                  </div>
                
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
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
                      Short Description
                    </label>
                    <textarea
                      name="shortDescrip"
                      value={formData.shortDescrip}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="Enter short summary (optional)"
                    ></textarea>
                    <p className="mt-1 text-xs text-gray-500">A brief summary shown in listings</p>
                  </div>

                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parent Compliance <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="complianceId"
                        value={formData.complianceId}
                        onChange={handleInputChange}
                        className="appearance-none w-full bg-white border border-gray-300 rounded-lg shadow-sm pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        required
                      >
                        {compliances.length === 0 ? (
                          <option value="">No compliance items available</option>
                        ) : (
                          compliances.map((comp) => (
                            <option key={comp.id} value={comp.id}>
                              {comp.title}
                            </option>
                          ))
                        )}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Select the parent compliance item</p>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
                    selectedItem ? 'Update Detail' : 'Create Detail'
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

export default ComplianceDetail;