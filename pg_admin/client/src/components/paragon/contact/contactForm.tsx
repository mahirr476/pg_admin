'use client';

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { 
  Search, 
  RefreshCw, 
  FileText, 
  Mail,
  Phone,
  Building2,
  Edit2,
  Trash2
} from 'lucide-react';

// Define the interface for the contact form
interface ContactForm {
  id?: number;
  name: string;
  organization: string;
  email: string;
  phone: string;
  message: string;
  createdAt?: string;
}

const ContactPage: React.FC = () => {
  const [contacts, setContacts] = useState<ContactForm[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<ContactForm[]>([]);
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

  // Fetch contact forms
  const fetchContactForms = async () => {
    try {
      const token = getAuthToken();

      if (!token) {
        setError('Authentication token is missing.');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:7000/api/v1/group/contact-form', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        // Ensure data is an array and sort by most recent first
        const sortedData = (data.data || [])
          .sort((a: ContactForm, b: ContactForm) => 
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
          );
        
        setContacts(sortedData);
        setFilteredContacts(sortedData);
        setLoading(false);
      } else {
        setError(data.message || 'Failed to fetch contact forms');
        setLoading(false);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(`Error fetching contact forms: ${errorMessage}`);
      setLoading(false);
      console.error('Error:', err);
    }
  };

  // Handle Edit
  const handleEdit = (contact: ContactForm) => {
    // Implement edit logic - could open a modal or navigate to edit page
    console.log('Edit contact:', contact);
  };

  // Handle Delete
  const handleDelete = async (contactId?: number) => {
    if (!contactId) {
      console.error('No contact ID provided');
      return;
    }

    try {
      const token = getAuthToken();

      if (!token) {
        setError('Authentication token is missing.');
        return;
      }

      const response = await fetch(`http://localhost:7000/api/v1/group/contact-form/${contactId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        // Remove the deleted contact from the list
        const updatedContacts = contacts.filter(contact => contact.id !== contactId);
        setContacts(updatedContacts);
        setFilteredContacts(updatedContacts);
      } else {
        setError(data.message || 'Failed to delete contact form');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(`Error deleting contact form: ${errorMessage}`);
      console.error('Error:', err);
    }
  };

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = contacts.filter(contact => 
      contact.name.toLowerCase().includes(term) ||
      contact.email.toLowerCase().includes(term) ||
      contact.organization.toLowerCase().includes(term) ||
      contact.message.toLowerCase().includes(term)
    );

    setFilteredContacts(filtered);
  };

  // Reload contacts
  const handleReload = () => {
    setLoading(true);
    fetchContactForms();
  };

  useEffect(() => {
    fetchContactForms();
  }, []);

  // Loading state
  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500"></div>
    </div>
  );

  // Error state
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
          <Mail className="mr-3 text-indigo-600" size={32} />
          Contact Form Submissions
        </h1>
        <p className="text-gray-600">Review and manage incoming contact form submissions</p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 flex justify-between items-center">
        <div className="relative flex-grow mr-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search submissions..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex space-x-2">
          <button 
            onClick={handleReload}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            title="Reload Submissions"
          >
            <RefreshCw className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Contacts Table */}
      {filteredContacts.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">No contact submissions found</p>
          <p className="text-gray-500 mt-2">Try adjusting your search</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Building2 className="mr-2 h-4 w-4" />
                      Organization
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      Phone
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredContacts.map((contact, index) => (
                  <tr 
                    key={contact.id || index} 
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{contact.organization}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <a 
                        href={`mailto:${contact.email}`} 
                        className="text-sm text-indigo-600 hover:text-indigo-900"
                      >
                        {contact.email}
                      </a>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <a 
                        href={`tel:${contact.phone}`} 
                        className="text-sm text-gray-500 hover:text-gray-900"
                      >
                        {contact.phone}
                      </a>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {contact.message}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => handleEdit(contact)}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(contact.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
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
        </div>
      )}

      {/* Summary */}
      {filteredContacts.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-right">
          Showing {filteredContacts.length} of {contacts.length} submissions
        </div>
      )}
    </div>
  );
};

export default ContactPage;