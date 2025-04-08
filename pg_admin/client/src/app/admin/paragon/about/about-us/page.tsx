"use client";

import React, { useState } from 'react';
import AboutSection from '@/components/paragon/about/about-us/about';
import AboutBoard from '@/components/paragon/about/about-us/aboutBoard';
import BoardDirectors from '@/components/paragon/about/about-us/aboutLeaderShip';
import { Info, Users, UserPlus, ChevronRight } from 'lucide-react';

type TabId = 'about' | 'board' | 'leadership';

interface TabItem {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const About: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('about');

  // Tab configuration
  const tabs: TabItem[] = [
    { id: 'about', label: 'About Us', icon: <Info className="h-4 w-4 mr-2" /> },
    { id: 'board', label: 'Board Members', icon: <Users className="h-4 w-4 mr-2" /> },
    { id: 'leadership', label: 'Leadership Team', icon: <UserPlus className="h-4 w-4 mr-2" /> }
  ];

  // Handle tab change
  const handleTabChange = (tabId: TabId): void => {
    setActiveTab(tabId);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Header with unique half-pattern design */}
      <div className="relative py-14 bg-gradient-to-r mt-3 from-blue-700 to-indigo-800 overflow-hidden">
        {/* Pattern only on left half */}
        <div className="absolute inset-y-0 left-0 w-1/2 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="container mx-auto px-0 sm:px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">
              About Us
            </h1>
            <div className="w-24 h-1 bg-yellow-400 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Learn about our mission, vision, and the team behind our organization's success
            </p>
          </div>
        </div>
        
        {/* Curved bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="fill-current text-gray-50 w-full">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      {/* Nav Section */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">About Paragon</h2>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <span>Dashboard</span>
                <ChevronRight className="h-3 w-3 mx-1" />
                <span className="text-blue-600">About</span>
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
              onClick={() => handleTabChange(tab.id)}
              type="button"
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
              {tabs.find(tab => tab.id === activeTab)?.label || 'About Us'}
            </h2>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'about' && <AboutSection />}
            {activeTab === 'board' && <AboutBoard />}
            {activeTab === 'leadership' && <BoardDirectors />}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center text-sm text-gray-500">
            © 2025 Paragon Corporation. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;