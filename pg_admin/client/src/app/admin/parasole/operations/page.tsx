"use client";

import React, { useState } from 'react';
import OperationPage from '@/components/parasole/operations/operationPage';
import OperationDetail from '@/components/parasole/operations/operationDetail';
import { ChevronRight } from 'lucide-react';

const Operation = () => {
  const [activeSection, setActiveSection] = useState('operation'); // 'operation' or 'operationDetail'

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Operation</h1>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <span>Dashboard</span>
                <ChevronRight className="h-3 w-3 mx-1" />
                <span className="text-blue-600">Operation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Button Navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-md transition-colors ${
              activeSection === 'operation'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100 border'
            }`}
            onClick={() => setActiveSection('operation')}
          >
            Operation
          </button>
          <button
            className={`px-4 py-2 rounded-md transition-colors ${
              activeSection === 'operationDetail'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100 border'
            }`}
            onClick={() => setActiveSection('operationDetail')}
          >
            Operation Detail
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 pb-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Section Title */}
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-medium text-gray-800">
              {activeSection === 'operation' ? 'Operation' : 'Operation Detail'}
            </h2>
          </div>
          
          {/* Section Content */}
          <div className="p-6">
            {activeSection === 'operation' ? <OperationPage /> : <OperationDetail />}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center text-sm text-gray-500">
            © 2025 Company Name. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Operation;