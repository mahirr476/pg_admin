"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  RefreshCw, 
  FileText, 
  MoreHorizontal 
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
}

const ContactPage: React.FC = () => {
  const [mediaContacts, setMediaContacts] = useState<MediaContact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<MediaContact[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Retrieve token from multiple possible cookie names
  const getAuthToken = () => {
    const tokenCookieNames = [
      'authToken', 'token', 'access_token', 'Authorization', 'user_token'
    ];

    for (const cookieName of tokenCookieNames) {
      const token = Cookies.get(cookieName);
      if (token) return token;
    }

    return null;
  };

  // Fetch media contacts
  const fetchMediaContacts = async () => {
    try {
      const token = getAuthToken();

      if (!token) {
        setError('Authentication token is missing.');
        setLoading(false);
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const response = await axios.get('http://localhost:7000/api/v1/group/media/contact', {
        headers,
      });

      if (response.data.success) {
        setMediaContacts(response.data.data);
        setFilteredContacts(response.data.data);
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

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = mediaContacts.filter(contact => 
      contact.name.toLowerCase().includes(term) ||
      contact.email.toLowerCase().includes(term) ||
      contact.organization.toLowerCase().includes(term) ||
      contact.type.toLowerCase().includes(term)
    );

    setFilteredContacts(filtered);
  };

  // Reload contacts
  const handleReload = () => {
    setLoading(true);
    fetchMediaContacts();
  };

  useEffect(() => {
    fetchMediaContacts();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded relative m-4" role="alert">
      <div className="flex items-center">
        <span className="font-bold mr-2">Error:</span>
        {error}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Media Contacts</h1>
        <p className="text-gray-600">Manage and view your media contact details</p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 flex justify-between items-center">
        <div className="relative flex-grow mr-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex space-x-2">
          <button 
            onClick={handleReload}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            title="Reload Contacts"
          >
            <RefreshCw className="h-5 w-5 text-gray-600" />
          </button>
          <button 
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            title="Filter"
          >
            <Filter className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Contacts Table */}
      {filteredContacts.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">No contacts found</p>
          <p className="text-gray-500 mt-2">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{contact.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{contact.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{contact.organization}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">{contact.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{contact.phone}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {contact.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{contact.message}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <button 
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        title="More Actions"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination (optional) */}
      {filteredContacts.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {filteredContacts.length} of {mediaContacts.length} contacts
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded">
              Previous
            </button>
            <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactPage;