"use client";

import React, { useState } from 'react';
import MediaHero from '@/components/paragon/media/mediaHero';
import VideoGallery from '@/components/paragon/media/videoGallary';
import MediaNews from '@/components/paragon/media/mediaNews';
import MediaInquery from '@/components/paragon/media/mediaInquery';
import { LayoutGrid, Film, Newspaper, MessageSquare, ChevronRight } from 'lucide-react';

const Media = () => {
  const [activeTab, setActiveTab] = useState('media'); // 'media', 'video', 'news', or 'inquiry'

  // Tab configuration
  const tabs = [
    { id: 'media', label: 'Media Center', icon: <LayoutGrid className="h-4 w-4 mr-2" /> },
    { id: 'video', label: 'Video Gallery', icon: <Film className="h-4 w-4 mr-2" /> },
    { id: 'news', label: 'News', icon: <Newspaper className="h-4 w-4 mr-2" /> },
    { id: 'inquiry', label: 'Inquiries', icon: <MessageSquare className="h-4 w-4 mr-2" /> }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Media Management</h1>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <span>Dashboard</span>
                <ChevronRight className="h-3 w-3 mx-1" />
                <span className="text-blue-600">Media</span>
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
            {activeTab === 'media' && <MediaHero />}
            {activeTab === 'video' && <VideoGallery />}
            {activeTab === 'news' && <MediaNews />}
            {activeTab === 'inquiry' && <MediaInquery />}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center text-sm text-gray-500">
            © 2025 Media Management Page. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Media;