"use client";

import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { MapPin, Phone, Mail, Clock, Save, AlertCircle } from 'lucide-react';

// Define interface for contact data
interface ContactData {
  id?: number | null;
  title: string;
  description1: string;
  location: string;
  phone: string;
  email: string;
  workingHour: string;
}

// Toast notification interface
interface ToastState {
  show: boolean;
  message: string;
  type: string; // 'success' or 'error'
}

// API response interface
interface ApiResponse {
  success: boolean;
  message: string;
  data: ContactData | ContactData[] | null;
}

const ContactInformation: React.FC = () => {
  // State for storing form data
  const [formData, setFormData] = useState<ContactData>({
    id: null,
    title: '',
    description1: '',
    location: '',
    phone: '',
    email: '',
    workingHour: ''
  });
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: '' // 'success' or 'error'
  });
  
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

  // Fetch contact data
  const fetchContactData = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.get<ApiResponse>('/group/contact');
      if (response.data.success) {
        // Handle both array and single object responses
        const data = response.data.data;
        if (Array.isArray(data) && data.length > 0) {
          setFormData(data[0]);
        } else if (data && typeof data === 'object') {
          setFormData(data as ContactData);
        } else {
          // Initialize with empty form if no data
          console.log("No contact data found, using empty form");
        }
      } else {
        setError(response.data.message || 'Failed to fetch data');
      }
    } catch (err) {
      const error = err as Error | AxiosError;
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          // No contact exists yet, this is normal for first-time setup
          console.log("No contact exists yet");
        } else {
          setError(`Error: ${error.response?.data?.message || error.message}`);
        }
      } else {
        setError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Submit form data (create or update)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Prepare the data - only sending the fields that the API expects
      const { 
        title, 
        description1, 
        location, 
        phone, 
        email, 
        workingHour 
      } = formData;
      
      const payloadData = { 
        title, 
        description1, 
        location, 
        phone, 
        email, 
        workingHour 
      };
      
      let response: AxiosResponse<ApiResponse>;
      
      if (formData.id) {
        // Update existing record - try multiple approaches
        try {
          // First try with main endpoint
          response = await api.put(`/group/contact`, payloadData);
        } catch (putErr) {
          console.log("PUT to main endpoint failed, trying POST");
          try {
            // Some APIs use POST for updates too
            response = await api.post(`/group/contact`, payloadData);
          } catch (postErr) {
            console.log("POST also failed, last attempt");
            // Last resort - try with ID as query parameter
            response = await api.put(`/group/contact?id=${formData.id}`, payloadData);
          }
        }
      } else {
        // Create new record
        response = await api.post('/group/contact', payloadData);
      }
      
      if (response.data.success) {
        // Update form with new data
        if (response.data.data) {
          if (Array.isArray(response.data.data)) {
            setFormData(response.data.data[0]);
          } else {
            setFormData(response.data.data as ContactData);
          }
        }
        
        // Show toast notification
        setToast({
          show: true,
          message: 'Contact information saved successfully!',
          type: 'success'
        });
        
        // Hide toast after 3 seconds
        setTimeout(() => {
          setToast({
            show: false,
            message: '',
            type: ''
          });
        }, 3000);
      } else {
        setError(response.data.message || 'Failed to save data');
      }
    } catch (err) {
      console.error("Submission error:", err);
      
      const error = err as Error | AxiosError;
      setError(axios.isAxiosError(error) 
        ? error.response?.data?.message || error.message 
        : error.message || 'An error occurred');
      
      // Show error toast
      setToast({
        show: true,
        message: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : error.message || 'An error occurred',
        type: 'error'
      });
      
      // Hide toast after 3 seconds
      setTimeout(() => {
        setToast({
          show: false,
          message: '',
          type: ''
        });
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Fetch data on component mount
  useEffect(() => {
    if (!token) {
      setError('Authentication token not found');
      return;
    }
    fetchContactData();
  }, []);

  return (
    <div className="container mx-auto">
      <div className="bg-white shadow-lg rounded-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Contact Information Management
          </h2>
        </div>
        
        {/* Toast notification */}
        {toast.show && (
          <div 
            className={`fixed top-4 right-4 px-4 py-3 rounded-md shadow-lg z-50 flex items-center animate-fade-in ${
              toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
            style={{ animation: 'fadeIn 0.3s ease-in-out' }}
          >
            {toast.type === 'success' ? (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        )}
        
        {/* Error message display */}
        {error && (
          <div className="mx-6 mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-red-500" />
            <div className="flex-grow">
              <p>{error}</p>
            </div>
            <button 
              className="text-red-700 hover:text-red-900"
              onClick={() => setError(null)}
            >
              &times;
            </button>
          </div>
        )}
        
        {/* Remove Success message display since we now have toast */}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-6 w-6 rounded-full bg-white"></div>
              </div>
            </div>
            <p className="ml-4 text-gray-600 font-medium">Loading...</p>
          </div>
        ) : (
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <input 
                type="hidden" 
                name="id" 
                value={formData.id || ''}
              />
              
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                <label className="block text-gray-700 font-medium mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g., Contact Us"
                  required
                />
              </div>
              
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                <label className="block text-gray-700 font-medium mb-2">
                  Description
                </label>
                <textarea
                  name="description1"
                  value={formData.description1 || ''}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Main description about your contact information"
                  required
                ></textarea>
              </div>
              
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                <h3 className="text-md font-medium mb-3 text-gray-700">Contact Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-2">
                      Location/Address
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-4 py-2.5 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        <MapPin className="h-5 w-5" />
                      </span>
                      <input
                        type="text"
                        name="location"
                        value={formData.location || ''}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-r-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Your office address"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Phone Number
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-4 py-2.5 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        <Phone className="h-5 w-5" />
                      </span>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-r-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="+1 (123) 456-7890"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Email Address
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-4 py-2.5 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        <Mail className="h-5 w-5" />
                      </span>
                      <input
                        type="email"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-r-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="contact@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-2">
                      Working Hours
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-4 py-2.5 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        <Clock className="h-5 w-5" />
                      </span>
                      <input
                        type="text"
                        name="workingHour"
                        value={formData.workingHour || ''}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-r-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="e.g., Monday - Friday: 9AM - 5PM"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md flex items-center transition-colors shadow-md"
                  disabled={loading}
                >
                  <Save className="h-5 w-5 mr-2" />
                  {formData.id ? 'Update Information' : 'Save Information'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactInformation;