// components/parasole/about/about-table.tsx
import React, { useState } from 'react';
import { AboutItem } from '@/types/parasole/about/about';
import { CheckCircle, XCircle, Pencil, Trash2, ImageIcon, AlertTriangle, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react';

interface AboutTableProps {
  items: AboutItem[];
  isLoading: boolean;
  onEdit: (item: AboutItem) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (item: AboutItem, newStatus: 'ACTIVE' | 'INACTIVE') => void;
}

export function AboutTable({
  items,
  isLoading,
  onEdit,
  onDelete,
  onToggleStatus
}: AboutTableProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<keyof AboutItem>("index");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [expandedDescription, setExpandedDescription] = useState<number | null>(null);
  const [highlightedRow, setHighlightedRow] = useState<number | null>(null);

  // Handle sorting
  const handleSort = (column: keyof AboutItem) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  // Handle delete confirmation
  const handleConfirmDelete = (id: number) => {
    setShowDeleteConfirm(id);
  };

  const handleDelete = (id: number) => {
    onDelete(id);
    setShowDeleteConfirm(null);
  };

  // Toggle description expansion
  const toggleDescription = (id: number) => {
    setExpandedDescription(expandedDescription === id ? null : id);
  };

  // Calculate animation delay
  const getAnimationDelay = (index: number) => {
    return `${index * 50}ms`;
  };

  // Sort items
  const getSortedItems = () => {
    if (items.length === 0) return [];
    
    return [...items].sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];
      
      // Handle string comparisons
      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  };

  const sortedItems = getSortedItems();

  return (
    <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-2xl">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="bg-blue-100 p-2 rounded-md mr-2 inline-block">
            <ImageIcon className="h-5 w-5 text-blue-600" />
          </span>
          About Page Items
        </h2>
        <div className="text-sm text-gray-500">
          {items.length} item{items.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                onClick={() => handleSort("id")}
              >
                <div className="flex items-center">
                  ID
                  {sortBy === "id" && (
                    <span className="ml-1 inline-block transition-transform duration-200">
                      {sortDirection === "asc" ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                      }
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                onClick={() => handleSort("title")}
              >
                <div className="flex items-center">
                  Title
                  {sortBy === "title" && (
                    <span className="ml-1 inline-block transition-transform duration-200">
                      {sortDirection === "asc" ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                      }
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Images
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center">
                  Status
                  {sortBy === "status" && (
                    <span className="ml-1 inline-block transition-transform duration-200">
                      {sortDirection === "asc" ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                      }
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                onClick={() => handleSort("index")}
              >
                <div className="flex items-center">
                  Index
                  {sortBy === "index" && (
                    <span className="ml-1 inline-block transition-transform duration-200">
                      {sortDirection === "asc" ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                      }
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center space-y-3 opacity-0 animate-fade-in">
                    {isLoading ? (
                      <>
                        <div className="animate-spin h-10 w-10 rounded-full border-t-2 border-b-2 border-blue-500"></div>
                        <p className="text-sm font-medium">Loading content items...</p>
                      </>
                    ) : (
                      <>
                        <div className="relative">
                          <ImageIcon className="h-16 w-16 text-gray-300" />
                          <AlertTriangle className="h-6 w-6 text-amber-500 absolute -top-1 -right-1" />
                        </div>
                        <p className="text-sm font-medium">No about items found</p>
                        <p className="text-xs text-gray-400">Add your first item to get started</p>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              sortedItems.map((item, index) => (
                <React.Fragment key={`item-${item.id}`}>
                  <tr 
                    className={`
                      transition-all duration-300 ease-in-out 
                      ${highlightedRow === item.id ? 'bg-blue-50' : 'hover:bg-gray-50'}
                      animate-fade-in opacity-0
                    `}
                    style={{ animationDelay: getAnimationDelay(index), animationFillMode: 'forwards' }}
                    onMouseEnter={() => setHighlightedRow(item.id)}
                    onMouseLeave={() => setHighlightedRow(null)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{item.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-[300px]">
                      <div className="flex items-center space-x-1">
                        <p 
                          className={`${expandedDescription === item.id ? '' : 'truncate'} mr-1`} 
                          title={expandedDescription === item.id ? '' : item.description}
                        >
                          {item.description}
                        </p>
                        <button
                          onClick={() => toggleDescription(item.id)}
                          className="text-gray-400 hover:text-gray-700 transition-colors duration-200 focus:outline-none p-1 rounded-full hover:bg-gray-100"
                        >
                          {expandedDescription === item.id ? 
                            <EyeOff className="h-4 w-4" /> : 
                            <Eye className="h-4 w-4" />
                          }
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {item.images && item.images.length > 0 ? (
                          item.images.map((img, idx) => (
                            <div key={idx} className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm relative group transform transition-transform duration-300 hover:scale-110 hover:shadow-md">
                              <img
                                // src={`http://localhost:7000/${img.replace(/^public\//, '')}`}
                                src={`http://localhost:7000/${img}`}
                                alt={`${item.title} image ${idx + 1}`}
                                className="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-90"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.style.display = 'none';
                                  const fallback = e.currentTarget.parentElement?.querySelector('.fallback');
                                  if (fallback) fallback.classList.remove('hidden');
                                }}
                              />
                              <div className="fallback hidden flex items-center justify-center h-full w-full text-gray-400">
                                <ImageIcon className="h-6 w-6" />
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative inline-block w-40">
                        <select
                          value={item.status}
                          onChange={(e) => onToggleStatus(item, e.target.value as 'ACTIVE' | 'INACTIVE')}
                          className={`appearance-none w-full pl-3 pr-10 py-2 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium transition-all duration-200 ${
                            item.status === 'ACTIVE' 
                              ? 'bg-green-50 text-green-800 border-green-200' 
                              : 'bg-red-50 text-red-800 border-red-200'
                          }`}
                          disabled={isLoading}
                        >
                          <option value="ACTIVE" className="bg-white text-green-800">Active</option>
                          <option value="INACTIVE" className="bg-white text-red-800">Inactive</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                        <div className={`absolute top-0 right-10 mt-2 h-4 w-4 rounded-full ${
                          item.status === 'ACTIVE' ? 'bg-green-400' : 'bg-red-400'
                        }`}></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.index}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {showDeleteConfirm === item.id ? (
                        <div className="flex items-center justify-end space-x-2 animate-fade-in">
                          <span className="text-xs text-gray-500">Confirm?</span>
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={isLoading}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-1.5 rounded-full transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            disabled={isLoading}
                            className="text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 p-1.5 rounded-full transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => onEdit(item)}
                            disabled={isLoading}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 p-1.5 rounded-full transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleConfirmDelete(item.id)}
                            disabled={isLoading}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-1.5 rounded-full transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                  {expandedDescription === item.id && (
                    <tr key={`description-${item.id}`} className="bg-gray-50 animate-slide-down">
                      <td colSpan={7} className="px-6 py-3 text-sm text-gray-700">
                        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                          <p className="text-xs text-gray-500 mb-1">Full Description:</p>
                          <p>{item.description}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {items.length > 0 && (
        <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-200 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Sorted by <span className="font-medium">{sortBy}</span> ({sortDirection === "asc" ? "ascending" : "descending"})
          </span>
          <span className="text-xs text-gray-500">
            {items.length} item{items.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-down {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 200px; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}