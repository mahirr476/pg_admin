'use client';

import React, { useState } from 'react';

interface ImpactData {
  id: string;
  number: string;
  title: string;
  description: string;
  status: 'active' | 'inactive';
}

const ImpactSection: React.FC = () => {
  // State for showing form or table
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showTable, setShowTable] = useState<boolean>(false);
  
  // State for form inputs
  const [number, setNumber] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  
  // State for saving impact data
  const [impactData, setImpactData] = useState<ImpactData[]>([]);
  
  // State for editing
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editId, setEditId] = useState<string>('');
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      // Update existing impact data
      setImpactData(prevData => 
        prevData.map(item => 
          item.id === editId 
            ? { ...item, number, title, description } 
            : item
        )
      );
      setIsEditing(false);
      setEditId('');
    } else {
      // Add new impact data
      const newImpact: ImpactData = {
        id: Date.now().toString(),
        number,
        title,
        description,
        status: 'active'
      };
      
      setImpactData(prevData => [...prevData, newImpact]);
    }
    
    // Reset form and show table
    setNumber('');
    setTitle('');
    setDescription('');
    setShowForm(false);
    setShowTable(true);
  };
  
  // Handle edit
  const handleEdit = (impact: ImpactData) => {
    setNumber(impact.number);
    setTitle(impact.title);
    setDescription(impact.description);
    setIsEditing(true);
    setEditId(impact.id);
    setShowTable(false);
    setShowForm(true);
  };
  
  // Handle delete
  const handleDelete = (id: string) => {
    setImpactData(prevData => prevData.filter(item => item.id !== id));
  };
  
  // Handle status toggle
  const handleStatusToggle = (id: string) => {
    setImpactData(prevData => 
      prevData.map(item => 
        item.id === id 
          ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' } 
          : item
      )
    );
  };
  
  // Reset form
  const handleCancel = () => {
    setNumber('');
    setTitle('');
    setDescription('');
    setIsEditing(false);
    setEditId('');
    setShowForm(false);
    
    // Only show table if we have data
    if (impactData.length > 0) {
      setShowTable(true);
    }
  };
  
  // Add new button click
  const handleAddNew = () => {
    setShowTable(false);
    setShowForm(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Impact Section</h2>
          <p className="text-gray-500 mt-1">Manage key metrics and achievements for your homepage</p>
        </div>
        
        {!showForm && (
          <button
            onClick={showTable ? handleAddNew : () => setShowForm(true)}
            className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center font-medium shadow-sm hover:shadow"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 4v16m8-8H4" 
              />
            </svg>
            Add Impact Section
          </button>
        )}
      </div>
      
      {/* Form Section */}
      {showForm && (
        <div className="bg-gray-50 rounded-xl p-8 mb-8 border border-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            {isEditing ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Impact Section
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Impact Section
              </>
            )}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-2">
                  Number
                </label>
                <input
                  type="text"
                  id="number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                  placeholder="e.g. 500+"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                  placeholder="e.g. Projects Completed"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                placeholder="Enter a brief impact description"
                required
              />
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium mr-3 shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium shadow-sm"
              >
                {isEditing ? 'Update Section' : 'Save Section'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Table Section */}
      {showTable && (
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Number
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {impactData.length > 0 ? (
                impactData.map((impact, index) => (
                  <tr key={impact.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                        {impact.number}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {impact.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {impact.description.length > 100 
                        ? `${impact.description.substring(0, 100)}...` 
                        : impact.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleStatusToggle(impact.id)}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          impact.status === 'active'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {impact.status === 'active' ? (
                          <span className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
                            Active
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-red-500 mr-1.5"></span>
                            Inactive
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(impact)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(impact.id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                    No impact sections found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Initial empty state */}
      {!showForm && !showTable && (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
          <div className="mx-auto h-16 w-16 text-emerald-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No impact sections</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">Add impact metrics to showcase key achievements on your homepage.</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center font-medium mx-auto shadow-sm"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 4v16m8-8H4" 
              />
            </svg>
            Add Your First Impact Section
          </button>
        </div>
      )}
    </div>
  );
};

export default ImpactSection;