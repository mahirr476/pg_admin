"use client";

import React, { useState, useEffect } from 'react';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Loader2,
  ImageIcon,
  X,
  Save
} from 'lucide-react';

// Define types
interface Company {
  id: number;
  title: string;
  slug: string;
  image: string | null;
  shortDes: string;
  longDes: string;
  founded: string;
  teamSize: string;
  location: string;
  category: string;
  globalPresence: string;
  revenue: string;
  clientSatisfaction: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string | null;
  updatedAt?: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface FormData {
  title: string;
  slug: string;
  image: string;
  newImage: File | null;
  shortDes: string;
  longDes: string;
  founded: string;
  teamSize: string;
  location: string;
  category: string;
  globalPresence: string;
  revenue: string;
  clientSatisfaction: string;
}

const CompanyPage: React.FC = () => {
  // State management
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    title: "",
    slug: "",
    image: "",
    newImage: null,
    shortDes: "",
    longDes: "",
    founded: "",
    teamSize: "",
    location: "",
    category: "",
    globalPresence: "",
    revenue: "",
    clientSatisfaction: ""
  });

  // Helper function to construct full image URL
  const getImageUrl = (relativePath: string | null): string => {
    if (!relativePath) return "https://via.placeholder.com/96x64?text=No+Image";
    return `http://localhost:7000/${relativePath.replace(/^public\//, "")}`;
  };
  
  // Get token from cookies
  const token = Cookies.get('token');

  // Set up axios headers with authentication token
  const authAxios: AxiosInstance = axios.create({
    baseURL: 'http://localhost:7000',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  // Fetch companies on component mount
  useEffect(() => {
    fetchCompanies();
  }, []);

  // Function to fetch companies
  const fetchCompanies = async (): Promise<void> => {
    try {
      setLoading(true);
      const response: AxiosResponse<ApiResponse<Company[]>> = await authAxios.get('/api/v1/group/companies');
      if (response.data.success) {
        setCompanies(response.data.data);
      } else {
        setError('Failed to fetch companies');
      }
    } catch (err) {
      setError('Error connecting to the server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Toggle company status (ACTIVE/INACTIVE)
  const handleStatusToggle = async (company: Company): Promise<void> => {
    try {
      const newStatus = company.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      
      const response: AxiosResponse<ApiResponse<any>> = await authAxios.put(`/api/v1/group/companies/${company.id}`, {
        status: newStatus
      });
      
      if (response.data.success) {
        // Update the local state to reflect the change
        setCompanies(companies.map(c => 
          c.id === company.id ? { ...c, status: newStatus as 'ACTIVE' | 'INACTIVE' } : c
        ));
      } else {
        setError(response.data.message || 'Failed to update status');
      }
    } catch (err: any) {
      setError(`Error updating status: ${err.message}`);
      console.error(err);
    }
  };
  
  // Delete a company
  const handleDelete = async (id: number): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        const response: AxiosResponse<ApiResponse<any>> = await authAxios.delete(`/api/v1/group/companies/${id}`);
        
        if (response.data.success) {
          // Remove the deleted company from the state
          setCompanies(companies.filter(company => company.id !== id));
        } else {
          setError(response.data.message || 'Failed to delete company');
        }
      } catch (err: any) {
        setError(`Error deleting company: ${err.message}`);
        console.error(err);
      }
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle file input change for image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        newImage: e.target.files[0]
      });
    }
  };

  // Generate slug from title
  const generateSlug = (title: string): string => {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  // Handle title change and auto-generate slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title)
    });
  };

  // Reset form
  const resetForm = (): void => {
    setFormData({
      title: "",
      slug: "",
      image: "",
      newImage: null,
      shortDes: "",
      longDes: "",
      founded: "",
      teamSize: "",
      location: "",
      category: "",
      globalPresence: "",
      revenue: "",
      clientSatisfaction: ""
    });
    setEditMode(false);
    setSelectedCompany(null);
  };

  // Open form for adding new company
  const handleAddNew = (): void => {
    resetForm();
    setShowForm(true);
  };

  // Open form for editing existing company
  const handleEdit = (company: Company): void => {
    setSelectedCompany(company);
    setFormData({
      title: company.title || "",
      slug: company.slug || "",
      image: company.image || "",
      newImage: null,
      shortDes: company.shortDes || "",
      longDes: company.longDes || "",
      founded: company.founded || "",
      teamSize: company.teamSize || "",
      location: company.location || "",
      category: company.category || "",
      globalPresence: company.globalPresence || "",
      revenue: company.revenue || "",
      clientSatisfaction: company.clientSatisfaction || ""
    });
    setEditMode(true);
    setShowForm(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      // Create form data object for file upload
      const formDataObj = new FormData();
      
      // Append all text fields to the form data
      Object.keys(formData).forEach(key => {
        const k = key as keyof FormData;
        
        // Skip image if it's a string (already uploaded) and no new file is selected
        if (k === 'image' && typeof formData.image === 'string' && !formData.newImage) {
          return;
        }
        
        // For image, use the newImage if available
        if (k === 'image' && formData.newImage) {
          formDataObj.append('image', formData.newImage);
        } else if (k !== 'newImage' && formData[k] !== null) {
          formDataObj.append(k, formData[k] as string);
        }
      });
      
      // Add auth header for form data requests
      const formHeaders = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      };
      
      let response: AxiosResponse<ApiResponse<any>>;
      
      if (editMode && selectedCompany) {
        // Update existing company
        response = await axios.put(
          `http://localhost:7000/api/v1/group/companies/${selectedCompany.id}`,
          formDataObj,
          { headers: formHeaders }
        );
      } else {
        // Create new company
        response = await axios.post(
          'http://localhost:7000/api/v1/group/companies',
          formDataObj,
          { headers: formHeaders }
        );
      }
      
      if (response.data.success) {
        // Refresh companies list
        fetchCompanies();
        // Close form and reset
        setShowForm(false);
        resetForm();
      } else {
        setError(response.data.message || 'Operation failed');
      }
    } catch (err: any) {
      setError(`Error: ${err.message}`);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Close form
  const handleCloseForm = (): void => {
    setShowForm(false);
    resetForm();
  };

  // Filter companies by search term
  const filteredCompanies = searchTerm
    ? companies.filter(company => 
        company.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.shortDes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : companies;

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          Companies Management
        </h1>
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0 md:w-64">
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <button 
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition duration-200 ease-in-out shadow-md"
          >
            <PlusCircle size={18} className="mr-2" />
            Add Company
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <XCircle size={20} className="mr-2" />
            <span className="font-medium">{error}</span>
          </div>
          <button 
            className="absolute top-0 right-0 p-4"
            onClick={() => setError(null)}
          >
            <X size={20} className="text-red-500 hover:text-red-700" />
          </button>
        </div>
      )}

      {/* Companies Table */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 size={36} className="animate-spin text-blue-600 mr-2" />
          <span className="text-lg text-gray-600">Loading companies...</span>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Short Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCompanies.length > 0 ? (
                  filteredCompanies.map((company) => (
                    <tr key={company.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{company.title}</div>
                        <div className="text-sm text-gray-500">{company.slug}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {company.image ? (
                          <div className="h-16 w-24 relative overflow-hidden rounded-md shadow-sm">
                            <img 
                              src={getImageUrl(company.image)} 
                              alt={company.title}
                              className="absolute inset-0 w-full h-full object-cover"
                              onError={(e) => {
                                console.error("Image failed to load:", company.image);
                                (e.target as HTMLImageElement).src = "https://via.placeholder.com/96x64?text=No+Image";
                              }}
                            />
                          </div>
                        ) : (
                          <div className="h-16 w-24 flex items-center justify-center bg-gray-100 rounded-md">
                            <ImageIcon size={24} className="text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-md line-clamp-2">{company.shortDes}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleStatusToggle(company)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            company.status === 'ACTIVE' 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          } transition-colors duration-200`}
                        >
                          {company.status === 'ACTIVE' ? (
                            <CheckCircle size={14} className="mr-1.5" />
                          ) : (
                            <XCircle size={14} className="mr-1.5" />
                          )}
                          {company.status}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(company)}
                            className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-md transition duration-200"
                            title="Edit Company"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(company.id)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition duration-200"
                            title="Delete Company"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                      {searchTerm ? (
                        <div>
                          <p className="text-lg">No companies matching "{searchTerm}"</p>
                          <p className="text-sm mt-1">Try a different search term or clear the search</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-lg">No companies found</p>
                          <p className="text-sm mt-1">Click the "Add Company" button to create your first company</p>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Company Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                {editMode ? 'Edit Company' : 'Add New Company'}
              </h2>
              <button 
                onClick={handleCloseForm}
                className="text-gray-400 hover:text-gray-600 transition duration-200"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                  <div className="border border-gray-300 rounded-md p-4">
                    <input
                      type="file"
                      name="image"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {editMode && formData.image && typeof formData.image === 'string' && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-500 mb-1">
                          Current image: {formData.newImage ? '(Will be replaced)' : ''}
                        </p>
                        <div className="h-24 w-40 relative overflow-hidden rounded-md shadow-sm">
                          <img 
                            src={getImageUrl(formData.image)} 
                            alt={formData.title}
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(e) => {
                              console.error("Image failed to load:", formData.image);
                              (e.target as HTMLImageElement).src = "https://via.placeholder.com/160x96?text=No+Image";
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Short Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Short Description <span className="text-red-500">*</span></label>
                  <textarea
                    name="shortDes"
                    value={formData.shortDes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Long Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Long Description <span className="text-red-500">*</span></label>
                  <textarea
                    name="longDes"
                    value={formData.longDes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Founded */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Founded <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="founded"
                    value={formData.founded}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Team Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Team Size <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Global Presence */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Global Presence <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="globalPresence"
                    value={formData.globalPresence}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Revenue */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Revenue <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="revenue"
                    value={formData.revenue}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Client Satisfaction */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Satisfaction <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="clientSatisfaction"
                    value={formData.clientSatisfaction}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition duration-200"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      {editMode ? 'Update Company' : 'Save Company'}
                    </>
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

export default CompanyPage;