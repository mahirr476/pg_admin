"use client";

import React, { useState } from 'react';
import MilestonesHero from '@/components/paragon/milestones/milestones-hero';
import MilestonesMain from '@/components/paragon/milestones/milestones-main';
import { History, Award, ChevronRight } from 'lucide-react';

type TabId = 'overview' | 'achievements';

interface TabItem {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const Milestone: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  // Tab configuration
  const tabs: TabItem[] = [
    { id: 'overview', label: 'Milestones Overview', icon: <History className="h-4 w-4 mr-2" /> },
    { id: 'achievements', label: 'Key Achievements', icon: <Award className="h-4 w-4 mr-2" /> }
  ];

  // Handle tab change
  const handleTabChange = (tabId: TabId): void => {
    setActiveTab(tabId);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Header with unique dot pattern design */}
      <div className="relative py-14 bg-gradient-to-r mt-3 from-emerald-700 to-teal-800 overflow-hidden">
        {/* Custom background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='84' height='48' viewBox='0 0 84 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h12v6H0V0zm28 8h12v6H28V8zm14-8h12v6H42V0zm14 0h12v6H56V0zm0 8h12v6H56V8zM42 8h12v6H42V8zm0 16h12v6H42v-6zm14-8h12v6H56v-6zm14 0h12v6H70v-6zm0-16h12v6H70V0zM28 32h12v6H28v-6zM14 16h12v6H14v-6zM0 24h12v6H0v-6zm0 8h12v6H0v-6zm14 0h12v6H14v-6zm14 8h12v6H28v-6zm-14 0h12v6H14v-6zm28 0h12v6H42v-6zm14-8h12v6H56v-6zm0-8h12v6H56v-6zm14 8h12v6H70v-6zm0 8h12v6H70v-6zM14 24h12v6H14v-6zm14-8h12v6H28v-6zM14 8h12v6H14V8zM0 8h12v6H0V8z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="container mx-auto px-0 sm:px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">
              Our Milestones
            </h1>
            <div className="w-24 h-1 bg-yellow-400 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
              Celebrating our journey and key achievements throughout the years
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
              <h2 className="text-2xl font-bold text-gray-800">Milestones</h2>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <span>Dashboard</span>
                <ChevronRight className="h-3 w-3 mx-1" />
                <span className="text-emerald-600">Milestones</span>
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
                  ? 'bg-emerald-500 text-white shadow-sm'
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
              {tabs.find(tab => tab.id === activeTab)?.label || 'Milestones Overview'}
            </h2>
          </div>
          
          {/* Tab Content */}
          <div className="p-6 bg-white">
            {activeTab === 'overview' && (
              <section className="mb-6">
                <MilestonesHero />
              </section>
            )}
            {activeTab === 'achievements' && (
              <section className="bg-slate-50 rounded-lg p-6">
                <MilestonesMain />
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-white mt-8">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center text-sm text-gray-500">
            © 2025 Paragon Corporation. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Milestone;