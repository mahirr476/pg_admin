"use client";

import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { Plus, AlertTriangle, Info, Loader2, Layout, ArrowUpRight } from "lucide-react";
import { HomeTable } from "./home-table";
import { HomeItemForm } from "./home-item-form";
import { useHomeItem } from "@/hooks/parasole/home/use-home-item";
import { HeroItem, HeroItemFormData } from "@/types/parasole/home/home";

export function Home() {
  // Use our custom hook for CRUD operations
  const { 
    items, 
    isLoading, 
    error,
    fetchItems,
    addItem, 
    updateItem, 
    deleteItem, 
    toggleItemStatus 
  } = useHomeItem();
  
  // Local state for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<HeroItem | undefined>(undefined);
  const [pageLoaded, setPageLoaded] = useState(false);
  
  // Initialize the component
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle opening the modal
  const handleOpenModal = (item?: HeroItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };
  
  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(undefined);
  };
  
  // Handle form submission
  const handleSubmit = async (data: HeroItemFormData) => {
    let success = false;
    
    try {
      if (selectedItem) {
        success = await updateItem(selectedItem.id, data);
        if (success) {
          toast.success("Content item updated successfully", {
            position: "top-right",
            duration: 4000,
            className: "custom-toast-success"
          });
        }
      } else {
        success = await addItem(data);
        if (success) {
          toast.success("Content item added successfully", {
            position: "top-right",
            duration: 4000,
            className: "custom-toast-success"
          });
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        duration: 5000,
        className: "custom-toast-error"
      });
    }
    
    return success;
  };

  // Handle status toggle with toast notification
  const handleToggleStatus = async (id: number) => {
    const item = items.find(item => item.id === id);
    const newStatus = item?.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    
    const success = await toggleItemStatus(id);
    
    if (success) {
      toast.success(`Item ${newStatus === "ACTIVE" ? "activated" : "deactivated"} successfully`, {
        position: "top-right",
        duration: 3000,
        className: "custom-toast-success"
      });
    }
  };
  
  // Handle delete with toast notification
  const handleDelete = async (id: number) => {
    const success = await deleteItem(id);
    
    if (success) {
      toast.success("Content item deleted successfully", {
        position: "top-right",
        duration: 3000,
        className: "custom-toast-success"
      });
    } else {
      toast.error("Failed to delete item", {
        position: "top-right",
        duration: 5000,
        className: "custom-toast-error"
      });
    }
  };

  return (
    <div className={`space-y-8 transition-opacity duration-500 ease-in-out ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Toaster component for notifications */}
      <Toaster 
        position="top-right" 
        closeButton
        expand
        richColors
        toastOptions={{
          style: {
            padding: '16px',
            fontSize: '15px',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            minWidth: '300px',
          },
          className: "toaster-notification",
          success: {
            style: {
              backgroundColor: '#ecfdf5',
              color: '#065f46',
              border: '1px solid #d1fae5',
            },
          },
          error: {
            style: {
              backgroundColor: '#fef2f2',
              color: '#991b1b',
              border: '1px solid #fee2e2',
            },
          },
        }}
      />
      
      {/* Enhanced Header with Action Button */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-xl p-8 transition-all duration-300 animate-fade-in-down relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')] opacity-40 mix-blend-overlay"></div>
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg mr-5 shadow-inner flex items-center justify-center animate-pulse-subtle">
              <Layout className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-white/80 text-sm font-medium mb-1">Home Content</h2>
              <h1 className="text-white text-2xl font-bold tracking-tight">Manage Website Content</h1>
            </div>
          </div>
          
          <div className="flex">
            <button 
              onClick={() => handleOpenModal()} 
              className="group bg-white text-blue-700 px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center shadow-md hover:shadow-xl hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-blue-600"
              disabled={isLoading}
            >
              <Plus className="mr-2 h-5 w-5" /> 
              Add New Content
              <ArrowUpRight className="ml-2 h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Loading State with Enhanced Visuals */}
      {isLoading && (
        <div className="w-full flex items-center justify-center py-16 animate-fade-in">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 flex flex-col items-center">
            <div className="relative">
              <div className="h-14 w-14 rounded-full border-4 border-blue-100 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
              <div className="absolute inset-0 h-14 w-14 rounded-full border-t-4 border-blue-600 animate-spin opacity-75"></div>
            </div>
            <p className="mt-4 text-blue-800 font-medium">Loading content items...</p>
          </div>
        </div>
      )}
      
      {/* Error message with Enhanced Design */}
      {error && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 animate-slide-in-right">
          <div className="bg-red-500 h-2"></div>
          <div className="p-6">
            <div className="flex items-start">
              <div className="bg-red-100 p-2 rounded-full mr-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-lg mb-1">Error Occurred</p>
                <p className="text-gray-600 mb-4">{error}</p>
                <button 
                  onClick={fetchItems}
                  className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Table component with enhanced wrapper */}
      <div className={`transition-all duration-300 ${isLoading ? 'opacity-60' : 'opacity-100'} animate-fade-in`} 
           style={{ animationDelay: "400ms" }}>
        <div className="bg-white rounded-xl p-1 shadow-xl">
          <HomeTable 
            items={items}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            isLoading={isLoading}
          />
        </div>
      </div>
      
 
      
      {/* Modal Form */}
      <HomeItemForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={selectedItem}
        isLoading={isLoading}
      />
      
      {/* Global animations and styles */}
      <style jsx global>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes pulse-subtle {
          0% { opacity: 0.8; }
          50% { opacity: 1; }
          100% { opacity: 0.8; }
        }
        
        .animate-fade-in-down {
          animation: fade-in-down 0.5s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.4s ease-out forwards;
        }
        
        .animate-pulse-subtle {
          animation: pulse-subtle 3s infinite ease-in-out;
        }
        
        /* Toast notification styles */
        .toaster-notification {
          font-size: 14px !important;
          line-height: 1.5 !important;
          font-weight: 500 !important;
        }
        
        .custom-toast-success {
          background-color: #ecfdf5 !important;
          color: #065f46 !important;
          border-left: 4px solid #10b981 !important;
        }
        
        .custom-toast-error {
          background-color: #fef2f2 !important;
          color: #991b1b !important;
          border-left: 4px solid #ef4444 !important;
        }
      `}</style>
    </div>
  );
}