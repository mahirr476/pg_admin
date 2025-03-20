"use client"

import React, { useState } from 'react';
import { 
  PlusCircle, 
  Edit, 
  Trash, 
  X,
  Check,
  AlertCircle
} from 'lucide-react';

interface CSREntry {
  id: number;
  title: string;
  description: string;
  status: 'Active' | 'Inactive';
}

interface FormData {
  title: string;
  description: string;
}

interface FormErrors {
  title?: string;
  description?: string;
}

const CSRMain: React.FC = () => {
  // State management
  const [showForm, setShowForm] = useState<boolean>(false);
  const [csrEntries, setCsrEntries] = useState<CSREntry[]>([]);
  const [formData, setFormData] = useState<FormData>({ title: '', description: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (editIndex !== null) {
        // Update existing entry
        const updatedEntries = [...csrEntries];
        updatedEntries[editIndex] = {
          ...updatedEntries[editIndex],
          title: formData.title,
          description: formData.description
        };
        setCsrEntries(updatedEntries);
        setEditIndex(null);
      } else {
        // Add new entry
        setCsrEntries([
          ...csrEntries,
          {
            id: Date.now(),
            title: formData.title,
            description: formData.description,
            status: 'Active'
          }
        ]);
      }
      
      // Reset form and close modal
      setFormData({ title: '', description: '' });
      setShowForm(false);
    }
  };

  // Handle edit
  const handleEdit = (index: number) => {
    const entry = csrEntries[index];
    setFormData({
      title: entry.title,
      description: entry.description
    });
    setEditIndex(index);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = (index: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this CSR entry?');
    if (confirmed) {
      const updatedEntries = csrEntries.filter((_, i) => i !== index);
      setCsrEntries(updatedEntries);
    }
  };

  // Toggle status
  const toggleStatus = (index: number) => {
    const updatedEntries = [...csrEntries];
    updatedEntries[index].status = updatedEntries[index].status === 'Active' ? 'Inactive' : 'Active';
    setCsrEntries(updatedEntries);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">CSR Management</h1>
        <button
          onClick={() => {
            setFormData({ title: '', description: '' });
            setEditIndex(null);
            setShowForm(true);
          }}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <PlusCircle size={18} className="mr-2" />
          Add CSR
        </button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {editIndex !== null ? 'Edit CSR Entry' : 'Add New CSR Entry'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="title">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter CSR title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.title}
                  </p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter CSR description"
                ></textarea>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.description}
                  </p>
                )}
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {editIndex !== null ? 'Update' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSR Table */}
      {csrEntries.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Index
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {csrEntries.map((entry, index) => (
                <tr key={entry.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{entry.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 line-clamp-2">
                      {entry.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        entry.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleStatus(index)}
                        className={`p-1.5 rounded-full ${
                          entry.status === 'Active'
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                        title={entry.status === 'Active' ? 'Deactivate' : 'Activate'}
                      >
                        {entry.status === 'Active' ? <X size={16} /> : <Check size={16} />}
                      </button>
                      <button
                        onClick={() => handleEdit(index)}
                        className="p-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="p-1.5 bg-red-50 text-red-600 rounded-full hover:bg-red-100"
                        title="Delete"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No CSR entries found. Click "Add CSR" to create your first entry.</p>
        </div>
      )}
    </div>
  );
};

export default CSRMain;