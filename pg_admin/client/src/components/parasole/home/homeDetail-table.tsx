


// components/parasole/home/homeDetail-table.tsx
"use client";
import React, { useState } from 'react';
import { CheckCircle, XCircle, Pencil, Trash2, ImageIcon, Eye, EyeOff } from "lucide-react";
import { HeroDetail } from '@/types/parasole/home/homeDetail';

interface HomeDetailTableProps {
  items: HeroDetail[];
  onEdit: (item: HeroDetail) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number, currentStatus: string) => void;
  isLoading: boolean;
}

export function HomeDetailTable({
  items,
  onEdit,
  onDelete,
  onToggleStatus,
  isLoading,
}: HomeDetailTableProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [expandedDescription, setExpandedDescription] = useState<number | null>(null);
  const [highlightedRow, setHighlightedRow] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  const handleConfirmDelete = (id: number) => {
    setShowDeleteConfirm(id);
  };

  const handleDelete = (id: number) => {
    onDelete(id);
    setShowDeleteConfirm(null);
  };

  const toggleDescription = (id: number) => {
    setExpandedDescription(expandedDescription === id ? null : id);
  };

  const handleImageError = (detailId: number) => {
    setFailedImages(prev => new Set(prev).add(detailId));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-2xl">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="bg-blue-100 p-2 rounded-md mr-2 inline-block">
            <ImageIcon className="h-5 w-5 text-blue-600" />
          </span>
          Home Details
        </h2>
        <div className="text-sm text-gray-500">
          {items.length} item{items.length !== 1 ? 's' : ''}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hero Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detail Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Index</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center space-y-3 animate-fade-in">
                    <ImageIcon className="h-16 w-16 text-gray-300" />
                    <p className="text-sm font-medium">No hero details found</p>
                    <p className="text-xs text-gray-400">Add your first item to get started</p>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((detail, index) => (
                <React.Fragment key={`detail-${detail.id}`}>
                  <tr
                    className={`
                      transition-all duration-300 ease-in-out 
                      ${highlightedRow === detail.id ? 'bg-blue-50' : 'hover:bg-gray-50'}
                      animate-fade-in
                    `}
                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
                    onMouseEnter={() => setHighlightedRow(detail.id)}
                    onMouseLeave={() => setHighlightedRow(null)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {detail.hero?.title || (detail.heroId ? `Hero ID: ${detail.heroId}` : 'N/A')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{detail.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-[300px]">
                      <div className="flex items-center space-x-1">
                        <p
                          className={`${expandedDescription === detail.id ? '' : 'truncate'} mr-1`}
                          title={expandedDescription === detail.id ? '' : detail.description}
                        >
                          {detail.description}
                        </p>
                        <button
                          onClick={() => toggleDescription(detail.id)}
                          className="text-gray-400 hover:text-gray-700 transition-colors duration-200 focus:outline-none p-1 rounded-full hover:bg-gray-100"
                        >
                          {expandedDescription === detail.id ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                        {detail.image && !failedImages.has(detail.id) ? (
                          <img
                            // src={`http://localhost:7000/${detail.image.replace(/^public\//, '')}`}
                            src={`http://localhost:7000/${img}`}
                            alt={detail.title || 'Image'}
                            className="h-full w-full object-cover"
                            onError={() => handleImageError(detail.id)}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{detail.index}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => onToggleStatus(detail.id, detail.status)}
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                          detail.status === "ACTIVE"
                            ? "bg-green-100 text-green-800 hover:bg-green-200 hover:shadow-sm transform hover:-translate-y-0.5"
                            : "bg-red-100 text-red-800 hover:bg-red-200 hover:shadow-sm transform hover:-translate-y-0.5"
                        }`}
                      >
                        {detail.status === "ACTIVE" ? (
                          <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                        ) : (
                          <XCircle className="mr-1.5 h-3.5 w-3.5" />
                        )}
                        {detail.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {showDeleteConfirm === detail.id ? (
                        <div className="flex items-center justify-end space-x-2 animate-fade-in">
                          <span className="text-xs text-gray-500">Confirm?</span>
                          <button
                            onClick={() => handleDelete(detail.id)}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-1.5 rounded-full transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 p-1.5 rounded-full transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => onEdit(detail)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 p-1.5 rounded-full transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleConfirmDelete(detail.id)}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-1.5 rounded-full transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                  {expandedDescription === detail.id && (
                    <tr key={`description-${detail.id}`} className="bg-gray-50 animate-slide-down">
                      <td colSpan={7} className="px-6 py-3 text-sm text-gray-700">
                        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                          <p className="text-xs text-gray-500 mb-1">Full Description:</p>
                          <p>{detail.description}</p>
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
        <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-200 flex justify-end items-center">
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