"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

// Define the interface for the media contact (removed createdAt)
interface MediaContact {
  id: number;
  name: string;
  organization: string;
  email: string;
  phone: string;
  type: string;
  message: string;
}

const MediaInquiryTable: React.FC = () => {
  const [mediaContacts, setMediaContacts] = useState<MediaContact[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Retrieve token from multiple possible cookie names
  const getAuthToken = () => {
    const tokenCookieNames = [
      'authToken',
      'token',
      'access_token',
      'Authorization',
      'user_token',
    ];

    for (const cookieName of tokenCookieNames) {
      const token = Cookies.get(cookieName);
      if (token) {
        console.log(`Token found in cookie: ${cookieName}`);
        return token;
      }
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

  useEffect(() => {
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

        console.log('Request Headers:', headers);

        // Make the API call
        const response = await axios.get('http://localhost:7000/api/v1/group/media/contact', {
          headers,
        });

        if (response.data.success) {
          setMediaContacts(response.data.data); // Assuming `data` is an array of media contacts
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

    fetchMediaContacts();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      {error}
    </div>
  );

  return (
    <div className="overflow-x-auto">
      {mediaContacts.length === 0 ? (
        <p className="text-gray-500 text-center">No media contacts found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 p-2">ID</th>
              <th className="border border-gray-200 p-2">Name</th>
              <th className="border border-gray-200 p-2">Organization</th>
              <th className="border border-gray-200 p-2">Email</th>
              <th className="border border-gray-200 p-2">Phone</th>
              <th className="border border-gray-200 p-2">Type</th>
              <th className="border border-gray-200 p-2">Message</th>
            </tr>
          </thead>
          <tbody>
            {mediaContacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-gray-50">
                <td className="border border-gray-200 p-2">{contact.id}</td>
                <td className="border border-gray-200 p-2">{contact.name}</td>
                <td className="border border-gray-200 p-2">{contact.organization}</td>
                <td className="border border-gray-200 p-2">{contact.email}</td>
                <td className="border border-gray-200 p-2">{contact.phone}</td>
                <td className="border border-gray-200 p-2">{contact.type}</td>
                <td className="border border-gray-200 p-2">{contact.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MediaInquiryTable;