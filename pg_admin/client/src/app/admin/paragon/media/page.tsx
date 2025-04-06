"use client";

import React, { useState } from 'react';
import MediaHero from '@/components/paragon/media/mediaHero';
import VideoGallery from '@/components/paragon/media/videoGallary';
import { Tabs, ChevronRight, LayoutGrid, Film } from 'lucide-react';

const Media = () => {
  const [activeTab, setActiveTab] = useState('media'); // 'media' or 'video'

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white shadow">
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
            
            {/* Tab Navigation */}
            <div className="flex border rounded-lg overflow-hidden">
              <button
                className={`flex items-center px-4 py-2 ${
                  activeTab === 'media'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('media')}
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Media
              </button>
              <button
                className={`flex items-center px-4 py-2 ${
                  activeTab === 'video'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('video')}
              >
                <Film className="h-4 w-4 mr-2" />
                Video Gallery
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-1">
          {activeTab === 'media' ? (
            <div className="p-4">
              <MediaHero />
            </div>
          ) : (
            <div className="p-4">
              <VideoGallery />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-sm text-gray-500">
          © 2025 Your Company. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Media;