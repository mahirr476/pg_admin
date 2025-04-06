"use client";
import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { Mail, Phone, Globe, Save, AlertCircle } from 'lucide-react';

// Define the type for the inquiry data (removed id)
interface InquiryData {
  title: string;
  description: string;
  email: string;
  contactNo: string;
  website: string;
}

// API response type
interface ApiResponse {
  success: boolean;
  message: string;
  data: InquiryData | InquiryData[] | null;
}

const MediaInquery: React.FC = () => {
  // State for storing form data (removed id)
  const [formData, setFormData] = useState<InquiryData>({
    title: '',
    description: '',
    email: '',
    contactNo: '',
    website: ''
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Get token from js-cookie
  const token = Cookies.get('token');

  // Fetch inquiry data
  const fetchInquiryData = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse>(
        'http://localhost:7000/api/v1/group/media/inquery',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        // Handle both array and single object responses
        const data = response.data.data;
        if (Array.isArray(data) && data.length > 0) {
          setFormData(data[0]);
        } else if (data && typeof data === 'object') {
          setFormData(data as InquiryData);
        }
        console.log("Fetched data:", data);
      } else {
        setError(response.data.message || 'Failed to fetch data');
      }
    } catch (err) {
      const error = err as Error | AxiosError;
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          console.log("No inquiry exists yet");
        } else {
          setError(`Error: ${error.response?.data?.message || error.message}`);
          console.error("API Error:", error.response?.data);
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
      let response: AxiosResponse<ApiResponse>;
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      console.log("Submitting data:", formData);

      // Destructure the formData to only send the fields expected by the API
      const { title, description, email, contactNo, website } = formData;
      const payloadData = { title, description, email, contactNo, website };

      console.log("Prepared payload:", payloadData);

      // Create new record (no id-based update logic)
      response = await axios.post(
        'http://localhost:7000/api/v1/group/media/inquery',
        payloadData,
        config
      );

      if (response.data.success) {
        // Update form with new data if provided
        if (response.data.data) {
          if (Array.isArray(response.data.data)) {
            setFormData(response.data.data[0]);
          } else {
            setFormData(response.data.data as InquiryData);
          }
        }

        // Show success message
        setSuccessMessage('Media inquiry information saved successfully!');
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        setError(response.data.message || 'Failed to save data');
      }
    } catch (err) {
      const error = err as Error | AxiosError;
      if (axios.isAxiosError(error)) {
        // Handle undefined error.response?.data
        const errorMessage = error.response?.data?.message || error.message;
        console.error("Submission error details:", errorMessage);
        setError(`Error: ${errorMessage}`);

        // If it's a 400/404 error, try an alternative approach
        if (error.response?.status === 400 || error.response?.status === 404) {
          try {
            // Extract only the needed fields for the request
            const { title, description, email, contactNo, website } = formData;
            const payloadData = { title, description, email, contactNo, website };

            // Try normal POST approach
            const alternativeResponse = await axios.post(
              'http://localhost:7000/api/v1/group/media/inquery',
              payloadData,
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              }
            );

            if (alternativeResponse.data.success) {
              if (alternativeResponse.data.data) {
                if (Array.isArray(alternativeResponse.data.data)) {
                  setFormData(alternativeResponse.data.data[0]);
                } else {
                  setFormData(alternativeResponse.data.data as InquiryData);
                }
              }
              setError(null);
              setSuccessMessage('Media inquiry information saved successfully!');
              setTimeout(() => {
                setSuccessMessage(null);
              }, 3000);
            }
          } catch (altErr) {
            console.error("Alternative approach also failed:", altErr);
          }
        }
      } else {
        setError(`Error: ${error.message}`);
      }
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
    fetchInquiryData();
  }, []);

  return (
    <div className="container mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Media Inquiry Information</h2>

        {/* Error message display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
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

        {/* Success message display */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <p>{successMessage}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Media Inquiries"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={4}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Information about how media can contact your organization"
                required
              ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email Address
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 py-2 rounded-l border border-r-0 border-gray-300 bg-gray-100">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    className="w-full border rounded-r px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="media@example.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Contact Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 py-2 rounded-l border border-r-0 border-gray-300 bg-gray-100">
                    <Phone className="h-5 w-5 text-gray-500" />
                  </span>
                  <input
                    type="text"
                    name="contactNo"
                    value={formData.contactNo || ''}
                    onChange={handleChange}
                    className="w-full border rounded-r px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 (123) 456-7890"
                    required
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">
                  Website
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 py-2 rounded-l border border-r-0 border-gray-300 bg-gray-100">
                    <Globe className="h-5 w-5 text-gray-500" />
                  </span>
                  <input
                    type="text"
                    name="website"
                    value={formData.website || ''}
                    onChange={handleChange}
                    className="w-full border rounded-r px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="www.example.com"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded flex items-center transition-colors"
                disabled={loading}
              >
                <Save className="h-5 w-5 mr-2" />
                Save Information
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MediaInquery;