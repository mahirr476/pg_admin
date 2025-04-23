// components/parasole/home/home-table.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle, XCircle, Pencil, Trash2, ImageIcon } from "lucide-react";
import { HomePageItem } from "@/types/parasole/home/home";

interface HomeTableProps {
  items: HomePageItem[];
  onEdit: (item: HomePageItem) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
  isLoading?: boolean;
}

export function HomeTable({ 
  items, 
  onEdit, 
  onDelete, 
  onToggleStatus, 
  isLoading = false 
}: HomeTableProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const handleConfirmDelete = (id: number) => {
    setShowDeleteConfirm(id);
  };

  const handleDelete = (id: number) => {
    onDelete(id);
    setShowDeleteConfirm(null);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800">Home Page Items</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <ImageIcon className="h-10 w-10 text-gray-400" />
                    <p>No content items found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              items.sort((a, b) => a.id - b.id).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-[300px]">
                    <p className="truncate" title={item.description}>
                      {item.description}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          sizes="64px"
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <ImageIcon className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onToggleStatus(item.id)}
                      disabled={isLoading}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                        item.status === "active"
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {item.status === "active" ? (
                        <CheckCircle className="mr-1 h-3 w-3" />
                      ) : (
                        <XCircle className="mr-1 h-3 w-3" />
                      )}
                      {item.status === "active" ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {showDeleteConfirm === item.id ? (
                      <div className="flex items-center justify-end space-x-2">
                        <span className="text-xs text-gray-500">Confirm?</span>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={isLoading}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-1 rounded transition-colors duration-200"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          disabled={isLoading}
                          className="text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 p-1 rounded transition-colors duration-200"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onEdit(item)}
                          disabled={isLoading}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 p-1 rounded transition-colors duration-200"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleConfirmDelete(item.id)}
                          disabled={isLoading}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-1 rounded transition-colors duration-200"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {items.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-right text-xs text-gray-500">
          Showing {items.length} item{items.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}