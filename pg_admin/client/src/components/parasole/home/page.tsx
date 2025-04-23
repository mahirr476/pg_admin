// app/admin/parasole/home/page.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Plus, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";

// Types
interface HomePageItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  status: "active" | "inactive";
}

export default function ParasoleHomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<HomePageItem[]>([
    // Sample data - replace with API call
    {
      id: 1,
      title: "Welcome to Parasole Footwear",
      description: "Premium footwear designed for comfort and style. Explore our sustainable collection.",
      imageUrl: "/sample-images/hero-image.jpg",
      status: "active"
    },
    {
      id: 2,
      title: "Summer Collection 2025",
      description: "Lightweight and breathable footwear for the warmer months. Perfect for outdoor adventures.",
      imageUrl: "/sample-images/summer-collection.jpg",
      status: "active"
    },
    {
      id: 3,
      title: "About Our Materials",
      description: "We use eco-friendly materials sourced from sustainable suppliers around the world.",
      imageUrl: "/sample-images/materials.jpg",
      status: "inactive"
    }
  ]);
  
  const [currentItem, setCurrentItem] = useState<Partial<HomePageItem>>({
    title: "",
    description: "",
    imageUrl: "",
    status: "active"
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const resetForm = () => {
    setCurrentItem({
      title: "",
      description: "",
      imageUrl: "",
      status: "active"
    });
    setSelectedFile(null);
    setIsEditing(false);
  };
  
  const handleOpenModal = (item?: HomePageItem) => {
    if (item) {
      setCurrentItem(item);
      setIsEditing(true);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      // Create a preview URL for the image
      setCurrentItem({
        ...currentItem,
        imageUrl: URL.createObjectURL(e.target.files[0])
      });
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentItem({
      ...currentItem,
      [name]: value
    });
  };
  
  const handleStatusChange = (id: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newStatus = item.status === "active" ? "inactive" : "active";
        return {
          ...item,
          status: newStatus
        };
      }
      return item;
    }));
    
    toast.success("Status Updated", {
      description: "Item status has been updated successfully."
    });
  };
  
  const handleDelete = (id: number) => {
    // In a real application, you would make an API call here
    setItems(items.filter(item => item.id !== id));
    
    toast.success("Item Deleted", {
      description: "The item has been deleted successfully."
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (isEditing && currentItem.id) {
        // Update existing item
        setItems(items.map(item => 
          item.id === currentItem.id 
            ? { ...item, ...currentItem as HomePageItem } 
            : item
        ));
        
        toast.success("Item Updated", {
          description: "The item has been updated successfully."
        });
      } else {
        // Add new item
        const newItem = {
          ...currentItem,
          id: Math.max(0, ...items.map(item => item.id)) + 1,
          status: currentItem.status as "active" | "inactive" || "active"
        } as HomePageItem;
        
        setItems([...items, newItem]);
        
        toast.success("Item Added", {
          description: "A new item has been added successfully."
        });
      }
      
      setIsLoading(false);
      handleCloseModal();
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Home Page Content Management</h1>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Content
        </button>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Home Page Items</h2>
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
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No content items found. Click "Add New Content" to create one.
                  </td>
                </tr>
              ) : (
                items.sort((a, b) => a.id - b.id).map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{item.title}</td>
                    <td className="px-6 py-4 text-sm max-w-[300px]">
                      <p className="truncate" title={item.description}>
                        {item.description}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-16 w-16 rounded overflow-hidden bg-gray-100">
                        {item.imageUrl ? (
                          // Using img tag instead of Image to avoid Next.js specific issues
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400">
                            No image
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleStatusChange(item.id)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
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
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">
                {isEditing ? "Edit Content Item" : "Add New Content Item"}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={currentItem.title || ""}
                    onChange={handleInputChange}
                    placeholder="Enter title"
                    required
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={currentItem.description || ""}
                    onChange={handleInputChange}
                    placeholder="Enter description"
                    rows={4}
                    required
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                    Image
                  </label>
                  <div className="flex items-start space-x-4">
                    <div className="h-24 w-24 rounded overflow-hidden bg-gray-100 border border-gray-200">
                      {currentItem.imageUrl ? (
                        <img
                          src={currentItem.imageUrl}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Recommended size: 1200 x 800 pixels. Max size: 2MB.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => 
                        setCurrentItem({
                          ...currentItem,
                          status: currentItem.status === "active" ? "inactive" : "active"
                        })
                      }
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        currentItem.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {currentItem.status === "active" ? (
                        <CheckCircle className="mr-1 h-3 w-3" />
                      ) : (
                        <XCircle className="mr-1 h-3 w-3" />
                      )}
                      {currentItem.status === "active" ? "Active" : "Inactive"}
                    </button>
                    <span className="text-sm text-gray-500">
                      Click to toggle status
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isLoading}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    isEditing ? "Update" : "Save"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}