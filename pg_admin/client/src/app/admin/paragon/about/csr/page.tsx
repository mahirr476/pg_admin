'use client';

import React, { useState } from 'react';
import CSRDetails from '@/components/paragon/about/csr/csrDetails';
import CSRMain from '@/components/paragon/about/csr/csrMain';

const CSR = () => {
  const [activeSection, setActiveSection] = useState('main'); // 'main' or 'details'

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-10">
      {/* Hero Header with environmental theme */}
      <div className="relative py-16 bg-gradient-to-r from-green-600 to-teal-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">
              Corporate Social Responsibility
            </h1>
            <div className="w-24 h-1 bg-yellow-400 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-green-100 max-w-2xl mx-auto leading-relaxed">
              Our commitment to sustainable practices and community impact
            </p>
          </div>
        </div>
        
        {/* Curved bottom edge */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="fill-current text-green-50">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Selector - Unique Design */}
        <div className="mb-8 flex justify-center">
          <div className="bg-white p-2 rounded-full shadow-lg inline-flex">
            <button 
              onClick={() => setActiveSection('main')}
              className={`px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 ${
                activeSection === 'main' 
                  ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md transform scale-105' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              CSR Overview
            </button>
            <button 
              onClick={() => setActiveSection('details')}
              className={`px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 ${
                activeSection === 'details' 
                  ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md transform scale-105' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              CSR Initiatives
            </button>
          </div>
        </div>

        {/* Visual Indicator for active section */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-3">
            <div className={`h-3 w-3 rounded-full ${activeSection === 'main' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <div className="h-0.5 w-12 bg-gray-300"></div>
            <div className={`h-3 w-3 rounded-full ${activeSection === 'details' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          </div>
        </div>

        {/* Section Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {activeSection === 'main' ? 'Our CSR Commitment' : 'Our CSR Initiatives'}
          </h2>
          <div className="h-1 w-24 bg-green-500 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            {activeSection === 'main' 
              ? 'Learn about our approach to corporate social responsibility and sustainability.' 
              : 'Discover the projects and initiatives that are making a difference in our communities.'}
          </p>
        </div>

        {/* Dynamic Content Container */}
        <div className="bg-white rounded-xl shadow-lg p-2 transition-all duration-500 mb-16">
          {activeSection === 'main' && <CSRMain />}
          {activeSection === 'details' && <CSRDetails />}
        </div>
      </div>
    </div>
  );
};

export default CSR;