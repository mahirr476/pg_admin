'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { 
  Search, 
  RefreshCw, 
  FileText, 
  Mail,
  Phone,
  Building2,
  Trash2,
  AlertTriangle,
  Eye,
  XCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
  Filter,
  Clock,
  Tag
} from 'lucide-react';

// Define the interface for the media contact
interface MediaContact {
  id: number;
  name: string;
  organization: string;
  email: string;
  phone: string;
  type: string;
  message: string;
  createdAt?: string;
}

// View Modal Component
const ViewModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  contact: MediaContact | null;
}> = ({ isOpen, onClose, contact }) => {
  if (!isOpen || !contact) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <XCircle className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3">
          Media Inquiry Details
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
            <p className="text-gray-900 font-medium">{contact.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Organization</label>
            <p className="text-gray-900">{contact.organization}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <a 
              href={`mailto:${contact.email}`} 
              className="text-indigo-600 hover:text-indigo-800"
            >
              {contact.email}
            </a>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
            <a 
              href={`tel:${contact.phone}`} 
              className="text-gray-900"
            >
              {contact.phone}
            </a>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Type</label>
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {contact.type}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Message</label>
            <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">{contact.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Confirmation Modal Component
const ConfirmationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
        <div className="flex items-center mb-4">
          <AlertTriangle className="text-yellow-500 mr-3 h-6 w-6" />
          <h2 className="text-lg font-semibold text-gray-800">Confirm Deletion</h2>
        </div>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this media inquiry? 
          This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const MediaInquiryTable: React.FC = () => {
  const [mediaContacts, setMediaContacts] = useState<MediaContact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<MediaContact[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof MediaContact,
    direction: 'ascending' | 'descending'
  }>({
    key: 'id',
    direction: 'descending'
  });
  
  // View modal state
  const [viewContact, setViewContact] = useState<{
    isOpen: boolean;
    contact: MediaContact | null;
  }>({
    isOpen: false,
    contact: null
  });
  
  // Confirmation modal state
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    contactId?: number;
  }>({
    isOpen: false
  });

  // Retrieve token from multiple possible cookie names
  const getAuthToken = () => {
    const tokenCookieNames = [
      'authToken', 'token', 'access_token', 'Authorization', 'user_token'
    ];

    for (const cookieName of tokenCookieNames) {
      const token = Cookies.get(cookieName);
      if (token) return token;
    }

    console.error('No authentication token found in cookies.');
    return null;
  };

  // Check if the token is valid (for JWT tokens)
  const isTokenValid = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTime) {
        console.error('Token has expired.');
        return false;
      }
      return true;
    } catch (err) {
      console.error('Invalid token format:', err);
      return false;
    }
  };

  const fetchMediaContacts = async () => {
    try {
      const token = getAuthToken();

      if (!token || !isTokenValid(token)) {
        setError('Authentication token is missing or invalid.');
        setLoading(false);
        return;
      }

      // Prepare headers
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      // Make the API call
      const response = await axios.get('http://localhost:7000/api/v1/group/media/contact', {
        headers,
      });

      if (response.data.success) {
        const contacts = response.data.data || [];
        setMediaContacts(contacts);
        setFilteredContacts(contacts);
        setLoading(false);
      } else {
        setError(response.data.message || 'Failed to fetch media contacts');
        setLoading(false);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(`Error fetching media contacts: ${errorMessage}`);
      setLoading(false);
      console.error('Error:', err);
    }
  };

  // Open view modal
  const handleView = (contact: MediaContact) => {
    setViewContact({
      isOpen: true,
      contact
    });
  };

  // Prompt delete confirmation
  const promptDeleteConfirmation = (contactId: number) => {
    setConfirmDelete({
      isOpen: true,
      contactId
    });
  };

  // Handle Delete
  const handleDelete = async () => {
    const contactId = confirmDelete.contactId;

    if (!contactId) {
      console.error('No contact ID provided');
      setConfirmDelete({ isOpen: false });
      return;
    }

    try {
      const token = getAuthToken();

      if (!token || !isTokenValid(token)) {
        setError('Authentication token is missing or invalid.');
        setConfirmDelete({ isOpen: false });
        return;
      }

      const response = await axios.delete(`http://localhost:7000/api/v1/group/media/contact/${contactId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        // Remove the deleted contact from the list
        const updatedContacts = mediaContacts.filter(contact => contact.id !== contactId);
        setMediaContacts(updatedContacts);
        setFilteredContacts(updatedContacts);
      } else {
        setError(response.data.message || 'Failed to delete media inquiry');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(`Error deleting media inquiry: ${errorMessage}`);
      console.error('Error:', err);
    } finally {
      // Close the confirmation modal
      setConfirmDelete({ isOpen: false });
    }
  };

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = mediaContacts.filter(contact => 
      contact.name.toLowerCase().includes(term) ||
      contact.email.toLowerCase().includes(term) ||
      contact.organization.toLowerCase().includes(term) ||
      contact.message.toLowerCase().includes(term) ||
      contact.type.toLowerCase().includes(term)
    );

    setFilteredContacts(filtered);
  };

  // Handle sorting
  const requestSort = (key: keyof MediaContact) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
    
    const sortedContacts = [...filteredContacts].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredContacts(sortedContacts);
  };

  // Get sort direction icon
  const getSortDirectionIcon = (key: keyof MediaContact) => {
    if (sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  // Reload contacts
  const handleReload = () => {
    setLoading(true);
    fetchMediaContacts();
  };

  useEffect(() => {
    fetchMediaContacts();
  }, []);

  // Render type badge with appropriate color
  const renderTypeBadge = (type: string) => {
    let bgColor = 'bg-gray-100';
    let textColor = 'text-gray-800';
    
    switch(type.toLowerCase()) {
      case 'press':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        break;
      case 'interview':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        break;
      case 'partnership':
        bgColor = 'bg-purple-100';
        textColor = 'text-purple-800';
        break;
      case 'news':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        break;
      case 'other':
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
        break;
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {type}
      </span>
    );
  };

  // Loading state
  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
        <p className="mt-4 text-gray-600">Loading media inquiries...</p>
      </div>
    </div>
  );

  // Error state
  if (error) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md" role="alert">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span className="font-medium">Error:</span>
          <span className="ml-2">{error}</span>
        </div>
        <div className="mt-3">
          <button 
            onClick={handleReload}
            className="bg-red-100 hover:bg-red-200 text-red-800 font-medium py-1 px-3 rounded-md text-sm flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* View Modal */}
      <ViewModal 
        isOpen={viewContact.isOpen}
        onClose={() => setViewContact({ isOpen: false, contact: null })}
        contact={viewContact.contact}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal 
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false })}
        onConfirm={handleDelete}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                <Mail className="mr-2 text-indigo-600" size={24} />
                Media Inquiry Dashboard
              </h1>
              <p className="text-gray-600">Review and manage incoming media inquiries and press requests</p>
            </div>
            
            {mediaContacts.length > 0 && (
              <div className="flex items-center space-x-2">
                <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                  {mediaContacts.length} Total Inquiries
                </div>
                <button 
                  onClick={handleReload}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md transition"
                  title="Reload Inquiries"
                >
                  <RefreshCw className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search inquiries by name, email, organization, type..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div className="flex space-x-2">
              <div className="relative">
                <button className="flex items-center space-x-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Media Contacts Table */}
        {filteredContacts.length === 0 ? (
          <div className="bg-white shadow-md rounded-lg text-center py-16">
            <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No media inquiries found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search criteria</p>
            {searchTerm && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setFilteredContacts(mediaContacts);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 inline-flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Search
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('id')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>ID</span>
                        {getSortDirectionIcon('id')}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('name')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Name</span>
                        {getSortDirectionIcon('name')}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('organization')}
                    >
                      <div className="flex items-center space-x-1">
                        <Building2 className="h-4 w-4 mr-1" />
                        <span>Organization</span>
                        {getSortDirectionIcon('organization')}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('email')}
                    >
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4 mr-1" />
                        <span>Email</span>
                        {getSortDirectionIcon('email')}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4 mr-1" />
                        <span>Phone</span>
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('type')}
                    >
                      <div className="flex items-center space-x-1">
                        <Tag className="h-4 w-4 mr-1" />
                        <span>Type</span>
                        {getSortDirectionIcon('type')}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredContacts.map((contact) => (
                    <tr 
                      key={contact.id} 
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">#{contact.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{contact.organization || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a 
                          href={`mailto:${contact.email}`} 
                          className="text-sm text-indigo-600 hover:text-indigo-900"
                        >
                          {contact.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a 
                          href={`tel:${contact.phone}`} 
                          className="text-sm text-gray-500 hover:text-gray-900"
                        >
                          {contact.phone || '-'}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderTypeBadge(contact.type)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {contact.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end space-x-3">
                          <button 
                            onClick={() => handleView(contact)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => promptDeleteConfirmation(contact.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Table footer with summary */}
            <div className="bg-gray-50 px-6 py-3 border-t">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">{filteredContacts.length}</span> of <span className="font-medium">{mediaContacts.length}</span> inquiries
                </div>
                
                {/* Pagination placeholder */}
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="px-3 py-1 bg-indigo-600 text-white rounded-md">
                    1
                  </button>
                  <button className="px-3 py-1 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaInquiryTable;