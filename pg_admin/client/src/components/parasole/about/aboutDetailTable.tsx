// components/parasole/about/AboutDetailTable.tsx
import React from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Pencil, 
  Trash2, 
  ImageIcon, 
  AlertTriangle, 
  ChevronUp, 
  ChevronDown,
  Eye, 
  EyeOff, 
  ExternalLink,
  LayoutList,
  Info,
  ArrowUpDown
} from 'lucide-react';
import { 
  AboutDetail,
  SortableColumn
} from '../../../types/parasole/about/aboutDetail';

interface AboutDetailTableProps {
  aboutDetails: AboutDetail[];
  isLoading: boolean;
  expandedDescription: number | null;
  highlightedRow: number | null;
  sortBy: SortableColumn;
  sortDirection: "asc" | "desc";
  showDeleteConfirm: number | null;
  onEdit: (item: AboutDetail) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (item: AboutDetail, newStatus: 'ACTIVE' | 'INACTIVE') => void;
  onSort: (column: SortableColumn) => void;
  onToggleDescription: (id: number) => void;
  onSetHighlightedRow: (id: number | null) => void;
  onConfirmDelete: (id: number) => void;
  onCancelDelete: () => void;
}

const AboutDetailTable: React.FC<AboutDetailTableProps> = ({
  aboutDetails,
  isLoading,
  expandedDescription,
  highlightedRow,
  sortBy,
  sortDirection,
  showDeleteConfirm,
  onEdit,
  onDelete,
  onToggleStatus,
  onSort,
  onToggleDescription,
  onSetHighlightedRow,
  onConfirmDelete,
  onCancelDelete
}) => {
  // Calculate animation delay for rows
  const getAnimationDelay = (index: number) => {
    return `${index * 50}ms`;
  };

  // Render table header with sort functionality
  const renderSortableHeader = (label: string, column: SortableColumn) => {
    const isCurrentSort = sortBy === column;
    
    return (
      <th 
        className="px-6 py-4 text-left text-xs font-medium tracking-wider cursor-pointer group"
        onClick={() => onSort(column)}
      >
        <div className="flex items-center space-x-1">
          <div className={`
            flex items-center space-x-1 py-1 px-2 rounded-md
            ${isCurrentSort ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-500 group-hover:bg-gray-50'}
            transition-all duration-150 uppercase
          `}>
            <span>{label}</span>
            {isCurrentSort ? (
              <span className="transition-transform duration-200">
                {sortDirection === "asc" ? 
                  <ChevronUp className="h-4 w-4" /> : 
                  <ChevronDown className="h-4 w-4" />
                }
              </span>
            ) : (
              <ArrowUpDown className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
            )}
          </div>
        </div>
      </th>
    );
  };

  // Render regular non-sortable header
  const renderHeader = (label: string) => (
    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      <div className="py-1 px-2">{label}</div>
    </th>
  );

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden border-b border-gray-200 sm:rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {renderSortableHeader("About ID", "aboutId")}
                {renderHeader("About Title")}
                {renderSortableHeader("Detail Title", "title")}
                {renderHeader("Description")}
                {renderHeader("Image")}
                {renderHeader("Link")}
                {renderSortableHeader("Status", "status")}
                {renderSortableHeader("Index", "index")}
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="py-1 px-2">Actions</div>
                </th>
              </tr>
            </thead>
            
            <tbody className="bg-white divide-y divide-gray-200">
              {aboutDetails.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center space-y-4 opacity-0 animate-fade-in">
                      {isLoading ? (
                        <>
                          <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-blue-500 opacity-75"></div>
                          <p className="text-base font-medium">Loading content items...</p>
                        </>
                      ) : (
                        <>
                          <div className="relative bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
                            <LayoutList className="h-16 w-16 text-gray-300 mx-auto mb-2" />
                            <AlertTriangle className="h-6 w-6 text-amber-500 absolute top-4 right-4" />
                            <p className="text-base font-medium text-gray-700 mt-2">No about details found</p>
                            <p className="text-sm text-gray-400 mt-1">Add your first item to get started</p>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                aboutDetails.map((item, index) => (
                  <React.Fragment key={`item-${item.id}`}>
                    <tr 
                      className={`
                        transition-all duration-300 ease-in-out 
                        ${highlightedRow === item.id ? 'bg-blue-50' : 'hover:bg-gray-50'}
                        animate-fade-in opacity-0
                        ${expandedDescription === item.id ? 'border-b-0' : ''}
                      `}
                      style={{ animationDelay: getAnimationDelay(index), animationFillMode: 'forwards' }}
                      onMouseEnter={() => onSetHighlightedRow(item.id)}
                      onMouseLeave={() => onSetHighlightedRow(null)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                        <div className="flex items-center">
                          <span className="bg-blue-50 text-blue-800 px-2 py-1 rounded-md font-mono text-xs">
                            {item.aboutId}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1 rounded-md inline-block border border-gray-100">
                          {item.about?.title || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-sm text-gray-900">{item.title}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-[300px]">
                        <div className="flex items-center space-x-1 group">
                          <p 
                            className={`${expandedDescription === item.id ? '' : 'line-clamp-2'} mr-1 group-hover:text-gray-900 transition-colors duration-150`} 
                            title={expandedDescription === item.id ? '' : item.description}
                          >
                            {item.description}
                          </p>
                          <button
                            onClick={() => onToggleDescription(item.id)}
                            className="text-gray-400 hover:text-blue-600 transition-colors duration-200 focus:outline-none p-1.5 rounded-full hover:bg-blue-50"
                            title={expandedDescription === item.id ? "Hide full description" : "Show full description"}
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
                          {item.image ? (
                            <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-50 border border-gray-200 shadow-sm relative group transform transition-transform duration-300 hover:scale-110 hover:shadow-md">
                              <img
                                src={`http://localhost:7000/${item.image.replace(/^public\//, '')}`}
                                alt={item.title}
                                className="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-90"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.onerror = null;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    const fallback = parent.querySelector('.fallback');
                                    if (fallback) fallback.classList.remove('hidden');
                                  }
                                }}
                              />
                              <div className="fallback hidden flex items-center justify-center h-full w-full text-gray-400">
                                <ImageIcon className="h-6 w-6" />
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center">
                                <span className="text-white text-xs p-1 truncate max-w-full">
                                  {item.image.split('/').pop()?.substring(0, 15)}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-50 border border-gray-200 shadow-sm flex items-center justify-center group hover:bg-gray-100 transition-colors duration-200">
                              <ImageIcon className="h-6 w-6 text-gray-400 group-hover:text-gray-500 transition-colors duration-200" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-[150px]">
                        {item.link ? (
                          <div className="flex items-center space-x-1 bg-gray-50 hover:bg-blue-50 px-3 py-1.5 rounded-md group border border-gray-100 hover:border-blue-100 transition-all duration-200 truncate">
                            <p className="truncate text-gray-600 group-hover:text-blue-700 transition-colors duration-200">
                              {item.link}
                            </p>
                            <a 
                              href={item.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700 flex-shrink-0"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-sm">No link provided</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative inline-block w-40">
                          <select
                            value={item.status}
                            onChange={(e) => onToggleStatus(item, e.target.value as 'ACTIVE' | 'INACTIVE')}
                            className={`
                              appearance-none w-full pl-3 pr-10 py-2 rounded-lg border shadow-sm 
                              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                              text-sm font-medium transition-all duration-200
                              ${
                                item.status === 'ACTIVE' 
                                  ? 'bg-green-50 text-green-800 border-green-200 hover:bg-green-100' 
                                  : 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100'
                              }
                            `}
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center justify-center bg-blue-50 text-blue-700 w-10 h-8 rounded-md font-medium text-sm border border-blue-100">
                          {item.index}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {showDeleteConfirm === item.id ? (
                          <div className="flex items-center justify-end space-x-2 animate-fade-in">
                            <div className="bg-red-50 border border-red-100 rounded-lg p-1 flex items-center space-x-2">
                              <span className="text-xs text-red-700 ml-1">Confirm?</span>
                              <button
                                onClick={() => onDelete(item.id)}
                                disabled={isLoading}
                                className="text-white bg-red-500 hover:bg-red-600 p-1.5 rounded-md transition-all duration-200 hover:shadow-md"
                                title="Confirm delete"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={onCancelDelete}
                                disabled={isLoading}
                                className="text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-100 p-1.5 rounded-md transition-all duration-200 hover:shadow-md border border-gray-200"
                                title="Cancel"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => onEdit(item)}
                              disabled={isLoading}
                              className="text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 p-2 rounded-md transition-all duration-200 hover:shadow-md"
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => onConfirmDelete(item.id)}
                              disabled={isLoading}
                              className="text-red-600 hover:text-white bg-red-50 hover:bg-red-600 p-2 rounded-md transition-all duration-200 hover:shadow-md"
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
                        <td colSpan={9} className="px-6 py-3 text-sm text-gray-700">
                          <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                            <div className="flex items-start">
                              <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-xs text-blue-600 font-medium mb-2">Full Description:</p>
                                <p className="text-gray-700 whitespace-pre-line">{item.description}</p>
                              </div>
                            </div>
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
      </div>
      
      {/* Animation styles */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-down {
          from { opacity: 0; max-height: 0; transform: translateY(-10px); }
          to { opacity: 1; max-height: 1000px; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default AboutDetailTable;