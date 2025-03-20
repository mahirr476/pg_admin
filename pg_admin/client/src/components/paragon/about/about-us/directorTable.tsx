'use client';

import React from 'react';

interface DirectorData {
  id?: number;
  orderIndex: number;
  name: string;
  designation: string;
  image?: string;
  shortDescription: string;
  longDescription: string;
  status?: string;
}

interface DirectorsTableProps {
  directorsData: DirectorData[];
  isLoading: boolean;
  handleEdit: (director: DirectorData) => void;
  handleDelete: (id: number) => void;
  handleStatusChange: (id: number, newStatus: string) => void;
}

const DirectorsTable: React.FC<DirectorsTableProps> = ({ 
  directorsData, 
  isLoading, 
  handleEdit, 
  handleDelete, 
  handleStatusChange 
}) => {
  return (
    <div className="mb-8 overflow-hidden border border-gray-200 rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Designation
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Image
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {directorsData.length > 0 ? (
            directorsData.map((director) => (
              <tr key={director.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {director.orderIndex}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{director.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{director.designation}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {director.image && (
                    <div className="h-16 w-16 rounded-full overflow-hidden">
                      <img 
                        src={`http://localhost:7000/${director.image}`} 
                        alt={director.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      director.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {director.status === 'ACTIVE' ? (
                        <>
                          <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
                          Active
                        </>
                      ) : (
                        <>
                          <span className="h-2 w-2 rounded-full bg-red-500 mr-1.5"></span>
                          Inactive
                        </>
                      )}
                    </span>
                    
                    {director.status === 'ACTIVE' ? (
                      <button
                        onClick={() => handleStatusChange(director.id || 0, 'INACTIVE')}
                        className="text-red-600 hover:text-red-900 text-xs bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors"
                        disabled={isLoading}
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(director.id || 0, 'ACTIVE')}
                        className="text-green-600 hover:text-green-900 text-xs bg-green-50 hover:bg-green-100 px-2 py-1 rounded transition-colors"
                        disabled={isLoading}
                      >
                        Activate
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(director)}
                    className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors mr-2"
                    disabled={isLoading}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(director.id || 0)}
                    className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                    disabled={isLoading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                {isLoading ? 'Loading directors...' : 'No directors found. Add a new director to get started.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DirectorsTable;