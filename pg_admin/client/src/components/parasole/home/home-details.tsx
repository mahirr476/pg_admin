"use client";

import React from 'react';

const HomeDetails = () => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Home Details</h1>
      <p className="text-gray-600">
        This section contains additional details and settings for your home page.
      </p>
      
      {/* You can add your HomeDetails content here */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-700">Your home page details will appear here.</p>
      </div>
    </div>
  );
};

export default HomeDetails;