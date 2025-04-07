'use client';

import React, { useState } from 'react';
import HeroSection from '@/components/paragon/home/heroSection';
import ImpactSection from '@/components/paragon/home/impactSection';

const Home = () => {
  const [activeSection, setActiveSection] = useState('hero'); // 'hero' or 'impact'

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-10">
      {/* Main content area */}
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Selector - Unique Design */}
        <div className="mb-8 flex justify-center">
          <div className="bg-white p-2 rounded-full shadow-lg inline-flex">
            <button 
              onClick={() => setActiveSection('hero')}
              className={`px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 ${
                activeSection === 'hero' 
                  ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md transform scale-105' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Hero Section
            </button>
            <button 
              onClick={() => setActiveSection('impact')}
              className={`px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 ${
                activeSection === 'impact' 
                  ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md transform scale-105' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Impact Section
            </button>
          </div>
        </div>

        {/* Visual Indicator for active section */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-3">
            <div className={`h-3 w-3 rounded-full ${activeSection === 'hero' ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
            <div className="h-0.5 w-12 bg-gray-300"></div>
            <div className={`h-3 w-3 rounded-full ${activeSection === 'impact' ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
          </div>
        </div>

        {/* Section Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {activeSection === 'hero' ? 'Welcome to Paragon' : 'Our Impact'}
          </h2>
          <div className="h-1 w-24 bg-indigo-500 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            {activeSection === 'hero' 
              ? 'Discover how we can help transform your business with innovative solutions.' 
              : 'See the real-world difference our services have made for our clients.'}
          </p>
        </div>

        {/* Dynamic Content Container */}
        <div className="bg-white rounded-xl shadow-lg p-2 transition-all duration-500">
          {activeSection === 'hero' && <HeroSection />}
          {activeSection === 'impact' && <ImpactSection />}
        </div>
      </div>
    </div>
  );
};

export default Home;