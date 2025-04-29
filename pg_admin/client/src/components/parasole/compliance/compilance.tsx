"use client";
import React, { useState } from 'react';
import { useCompliance, ComplianceFormData } from '../../../hooks/parasole/compliance/useCompliance';
import { Edit, Trash2, Plus, ChevronUp, ChevronDown, ArrowUpDown, Image, ToggleLeft, ToggleRight } from 'lucide-react';

const CompliancePage: React.FC = () => {
  const {
    isLoading,
    expandedDescription,
    highlightedRow,
    sortBy,
    sortDirection,
    showDeleteConfirm,
    handleSubmit,
    handleDelete,
    handleToggleStatus,
    handleSort,
    getSortedItems,
    toggleDescription,
    setHighlightedRow,
    setShowDeleteConfirm
  } = useCompliance();

  const [showForm, setShowForm] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [formData, setFormData] = useState<ComplianceFormData>({
    title: '',
    description: '',
    index: 0,
    image: null
  });

  // Reset form to defaults
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      index: 0,
      image: null
    });
    setIsEdit(false);
  };

  // Handle showing the form for a new item
  const handleShowAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  // Handle showing the form for editing an existing item
  const handleShowEditForm = (item: any) => {
    setFormData({
      id: item.id,
      title: item.title,
      description: item.description,
      index: item.index,
      status: item.status
    });
    setIsEdit(true);
    setShowForm(true);
    setHighlightedRow(item.id);
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({ ...prev, image: e.target.files?.[0] || null }));
    }
  };

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit(formData, isEdit);
    
    if (success) {
      setShowForm(false);
      resetForm();
    } 
  };

  // Handle cancel form
  const handleCancelForm = () => {
    setShowForm(false);
    resetForm();
    setHighlightedRow(null);
  };

  // Get the sort icon for a column
  const getSortIcon = (column: string) => {
    if (sortBy !== column) return <ArrowUpDown size={16} />;
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  // Handle confirming deletion
  const confirmDelete = async (id: number) => {
    await handleDelete(id);
  };

  // Handle toggling status
  const toggleStatus = async (item: any) => {
    const newStatus = item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await handleToggleStatus(item, newStatus);
  };

  // Get sortable items
  const sortedItems = getSortedItems();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Compliance Management</h1>
        
        {!showForm && (
          <button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
            onClick={handleShowAddForm}
          >
            <Plus size={18} className="mr-2" /> Add New
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white p-4 mb-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">{isEdit ? 'Edit' : 'Add'} Compliance</h2>
          
          <form onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                  Title*
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="index">
                  Index*
                </label>
                <input
                  id="index"
                  name="index"
                  type="number"
                  value={formData.index}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <div className="mb-4 md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                  Image
                </label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  onChange={handleFileChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  accept="image/*"
                />
              </div>

              {isEdit && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end mt-4">
              <button
                type="button"
                onClick={handleCancelForm}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading && !showForm ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border cursor-pointer" onClick={() => handleSort('id')}>
                  <div className="flex items-center">
                    ID {getSortIcon('id')}
                  </div>
                </th>
                <th className="py-2 px-4 border cursor-pointer" onClick={() => handleSort('title')}>
                  <div className="flex items-center">
                    Title {getSortIcon('title')}
                  </div>
                </th>
                <th className="py-2 px-4 border">Image</th>
                <th className="py-2 px-4 border">Description</th>
                <th className="py-2 px-4 border cursor-pointer" onClick={() => handleSort('index')}>
                  <div className="flex items-center">
                    Index {getSortIcon('index')}
                  </div>
                </th>
                <th className="py-2 px-4 border cursor-pointer" onClick={() => handleSort('createdAt')}>
                  <div className="flex items-center">
                    Created At {getSortIcon('createdAt')}
                  </div>
                </th>
                <th className="py-2 px-4 border cursor-pointer" onClick={() => handleSort('status')}>
                  <div className="flex items-center">
                    Status {getSortIcon('status')}
                  </div>
                </th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-4 text-center">No compliance records found.</td>
                </tr>
              ) : (
                sortedItems.map((item) => (
                  <tr 
                    key={item.id} 
                    className={`hover:bg-gray-50 ${highlightedRow === item.id ? 'bg-blue-50' : ''}`}
                  >
                    <td className="py-2 px-4 border">{item.id}</td>
                    <td className="py-2 px-4 border">{item.title}</td>
                    <td className="py-2 px-4 border text-center">
                      {item.images && item.images.length > 0 ? (
                        <Image className="mx-auto text-green-500" size={20} />
                      ) : (
                        <span className="text-gray-400">No image</span>
                      )}
                    </td>
                    <td className="py-2 px-4 border">
                      {expandedDescription === item.id ? (
                        <div>
                          <p>{item.description}</p>
                          <button 
                            className="text-blue-500 hover:text-blue-700 text-sm mt-1"
                            onClick={() => toggleDescription(item.id)}
                          >
                            Show less
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p className="truncate max-w-xs">
                            {item.description.length > 50 
                              ? `${item.description.substring(0, 50)}...` 
                              : item.description}
                          </p>
                          {item.description.length > 50 && (
                            <button 
                              className="text-blue-500 hover:text-blue-700 text-sm"
                              onClick={() => toggleDescription(item.id)}
                            >
                              Show more
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-4 border">{item.index}</td>
                    <td className="py-2 px-4 border">{item.createdAt}</td>
                    <td className="py-2 px-4 border">
                      <span 
                        className={`px-2 py-1 rounded text-xs ${
                          item.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 border">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleShowEditForm(item)}
                          className="text-blue-500 hover:text-blue-700"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        
                        <button
                          onClick={() => toggleStatus(item)}
                          className={`${item.status === 'ACTIVE' ? 'text-green-500 hover:text-green-700' : 'text-gray-500 hover:text-gray-700'}`}
                          title={`Toggle status (currently ${item.status})`}
                        >
                          {item.status === 'ACTIVE' ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                        </button>
                        
                        {showDeleteConfirm === item.id ? (
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => confirmDelete(item.id)}
                              className="text-red-500 hover:text-red-700 font-bold"
                              title="Confirm delete"
                            >
                              Yes
                            </button>
                            <span>/</span>
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              className="text-gray-500 hover:text-gray-700"
                              title="Cancel delete"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowDeleteConfirm(item.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CompliancePage;