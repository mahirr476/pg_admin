"use client"

import React, { useState, useEffect } from 'react';
import { 
  Edit, 
  Trash2, 
  Plus, 
  X, 
  Check, 
  Upload, 
  Search,
  Eye,
  Calendar
} from 'lucide-react';
import Image from 'next/image';

// Define the Milestone type
interface Milestone {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  status: 'published' | 'draft';
  date?: string;
}

const MainMilestones = () => {
  // State for milestones
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: 1,
      title: 'Company Founded',
      description: 'Our company was established with a vision to revolutionize the industry with innovative solutions and customer-centric approach.',
      imageUrl: '/images/milestone-1.jpg',
      status: 'published',
      date: '2010-05-15'
    },
    {
      id: 2,
      title: 'First Major Client',
      description: 'Secured our first enterprise client, marking a significant growth moment for our business and validating our market approach.',
      imageUrl: '/images/milestone-2.jpg',
      status: 'published',
      date: '2012-09-21'
    },
    {
      id: 3,
      title: 'International Expansion',
      description: 'Expanded operations to international markets across Europe and Asia, establishing regional offices and partnerships.',
      imageUrl: '/images/milestone-3.jpg',
      status: 'draft',
      date: '2018-03-10'
    }
  ]);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState<File | null>(null);
  const [formImagePreview, setFormImagePreview] = useState('');
  const [formStatus, setFormStatus] = useState<'published' | 'draft'>('published');
  const [formDate, setFormDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMilestones, setFilteredMilestones] = useState<Milestone[]>(milestones);
  
  // Effect to filter milestones when search term changes
  useEffect(() => {
    const filtered = milestones.filter(milestone => 
      milestone.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      milestone.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMilestones(filtered);
  }, [searchTerm, milestones]);
  
  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setFormImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && editId !== null) {
      // Update existing milestone
      const updatedMilestones = milestones.map(milestone => {
        if (milestone.id === editId) {
          return {
            ...milestone,
            title: formTitle,
            description: formDescription,
            status: formStatus,
            imageUrl: formImagePreview || milestone.imageUrl,
            date: formDate
          };
        }
        return milestone;
      });
      setMilestones(updatedMilestones);
    } else {
      // Add new milestone
      const newMilestone: Milestone = {
        id: milestones.length > 0 ? Math.max(...milestones.map(m => m.id)) + 1 : 1,
        title: formTitle,
        description: formDescription,
        imageUrl: formImagePreview || '/images/placeholder.jpg',
        status: formStatus,
        date: formDate
      };
      setMilestones([...milestones, newMilestone]);
    }
    
    // Reset form
    resetForm();
  };
  
  // Edit a milestone
  const handleEdit = (milestone: Milestone) => {
    setIsEditing(true);
    setEditId(milestone.id);
    setFormTitle(milestone.title);
    setFormDescription(milestone.description);
    setFormStatus(milestone.status);
    setFormImagePreview(milestone.imageUrl);
    setFormDate(milestone.date || '');
    setShowForm(true);
    
    // Scroll to form
    document.getElementById('milestoneForm')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Delete a milestone
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this milestone?')) {
      setMilestones(milestones.filter(milestone => milestone.id !== id));
    }
  };
  
  // Toggle milestone status
  const toggleStatus = (id: number) => {
    const updatedMilestones = milestones.map(milestone => {
      if (milestone.id === id) {
        return {
          ...milestone,
          status: milestone.status === 'published' ? 'draft' : 'published'
        };
      }
      return milestone;
    });
    setMilestones(updatedMilestones);
  };
  
  // Reset form
  const resetForm = () => {
    setFormTitle('');
    setFormDescription('');
    setFormImage(null);
    setFormImagePreview('');
    setFormStatus('published');
    setFormDate('');
    setIsEditing(false);
    setEditId(null);
    setShowForm(false);
  };
  
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Company Milestones</h1>
          <p className="mt-1 text-gray-500">
            Manage and showcase the key moments in our company's history
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search milestones..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            {showForm ? (
              <>
                <X className="h-5 w-5" />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                <span>Add Milestone</span>
              </>
            )}
          </button>
        </div>
        
        {/* Form */}
        {showForm && (
          <div id="milestoneForm" className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? 'Edit Milestone' : 'Add New Milestone'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Enter milestone title"
                />
              </div>
              
              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                />
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  required
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Enter milestone description"
                ></textarea>
              </div>
              
              {/* Image */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Image <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label
                      htmlFor="image-upload"
                      className="flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 border-dashed cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <Upload className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-500">
                        {formImage ? formImage.name : 'Choose an image'}
                      </span>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  
                  {formImagePreview && (
                    <div className="relative w-24 h-24 border border-gray-300 rounded-lg overflow-hidden">
                      <Image
                        src={formImagePreview}
                        alt="Preview"
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormImage(null);
                          setFormImagePreview('');
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <div className="flex items-center gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio h-4 w-4 text-blue-600"
                      name="status"
                      value="published"
                      checked={formStatus === 'published'}
                      onChange={() => setFormStatus('published')}
                    />
                    <span className="ml-2 text-gray-700">Published</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio h-4 w-4 text-blue-600"
                      name="status"
                      value="draft"
                      checked={formStatus === 'draft'}
                      onChange={() => setFormStatus('draft')}
                    />
                    <span className="ml-2 text-gray-700">Draft</span>
                  </label>
                </div>
              </div>
              
              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {isEditing ? 'Update Milestone' : 'Save Milestone'}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
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
              {filteredMilestones.length > 0 ? (
                filteredMilestones.map((milestone, index) => (
                  <tr key={milestone.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                        <Image
                          src={milestone.imageUrl}
                          alt={milestone.title}
                          width={64}
                          height={64}
                          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{milestone.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 line-clamp-2">{milestone.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {milestone.date ? (
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                          {formatDate(milestone.date)}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Not set</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${milestone.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {milestone.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleStatus(milestone.id)}
                          className={`p-1.5 rounded-full ${
                            milestone.status === 'published'
                              ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                              : 'bg-green-100 text-green-600 hover:bg-green-200'
                          }`}
                          title={milestone.status === 'published' ? 'Set to Draft' : 'Publish'}
                        >
                          {milestone.status === 'published' ? <Eye className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleEdit(milestone)}
                          className="p-1.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(milestone.id)}
                          className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No milestones found. {searchTerm && 'Try adjusting your search.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MainMilestones;