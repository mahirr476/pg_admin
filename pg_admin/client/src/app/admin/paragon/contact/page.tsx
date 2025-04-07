"use client";

import React, { useState } from 'react';
import ContactPage from '@/components/paragon/contact/contactForm';
import ContactInformation from '@/components/paragon/contact/contactInformation';
import { MessageSquare, MapPin, ChevronRight } from 'lucide-react';

const Contact = () => {
  const [activeTab, setActiveTab] = useState('form'); // 'form' or 'info'

  // Tab configuration
  const tabs = [
    { id: 'form', label: 'Contact Form', icon: <MessageSquare className="h-4 w-4 mr-2" /> },
    { id: 'info', label: 'Contact Information', icon: <MapPin className="h-4 w-4 mr-2" /> }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Contact Us</h1>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <span>Home</span>
                <ChevronRight className="h-3 w-3 mx-1" />
                <span className="text-blue-600">Contact</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 pb-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Tab Title */}
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-medium text-gray-800">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h2>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'form' && <ContactPage />}
            {activeTab === 'info' && <ContactInformation />}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center text-sm text-gray-500">
            © 2025 Your Company. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;