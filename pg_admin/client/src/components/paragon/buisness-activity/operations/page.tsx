'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Edit, Trash, AlertCircle, Search } from "lucide-react";
import Cookies from "js-cookie";

// Types
interface Business {
  id: number;
  title: string;
}

interface BusinessOperation {
  id: number;
  business_id: number;
  businessTitle: string;
  type: string;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

interface FormData {
  businessId: number | null;
  type: string;
  title: string;
  description: string;
}

const BusinessOperationPage = () => {
  // State
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [operations, setOperations] = useState<BusinessOperation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState<FormData>({
    businessId: null,
    type: "",
    title: "",
    description: ""
  });

  // Operation types
  const operationTypes = [
    { value: "operations", label: "Operations" },
    { value: "product", label: "Product" },
    { value: "business_unit", label: "Business Unit" }
  ];

  // Fetch businesses for dropdown
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setIsLoading(true);
        const token = Cookies.get("token");
        
        if (!token) {
          setError("Authentication token not found");
          return;
        }
        
        const response = await fetch("http://localhost:7000/api/v1/group/business", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching businesses: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          setBusinesses(Array.isArray(data.data) ? data.data : []);
        } else {
          throw new Error(data.message || "Failed to fetch businesses");
        }
      } catch (err) {
        console.error("Error fetching businesses:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  // Fetch business operations
  const fetchOperations = async () => {
    try {
      setIsLoading(true);
      const token = Cookies.get("token");
      
      if (!token) {
        setError("Authentication token not found");
        return;
      }
      
      // Try different endpoint variations
      const endpoints = [
        "http://localhost:7000/api/v1/group/business/operation",
        "http://localhost:7000/api/v1/group/business-operation",
        "http://localhost:7000/api/v1/group/operation"
      ];
      
      let response;
      let successfulEndpoint = "";

      for (const endpoint of endpoints) {
        try {
          response = await fetch(endpoint, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          
          if (response.ok) {
            successfulEndpoint = endpoint;
            break;
          }
        } catch (error) {
          console.log(`Failed to fetch from ${endpoint}`);
        }
      }

      if (!response || !response.ok) {
        throw new Error(`Error fetching operations: ${response?.status || 'No valid endpoint found'}`);
      }

      console.log(`Successfully fetched operations from: ${successfulEndpoint}`);
      const data = await response.json();
      
      if (data.success) {
        setOperations(Array.isArray(data.data) ? data.data : []);
      } else {
        throw new Error(data.message || "Failed to fetch operations");
      }
    } catch (err) {
      console.error("Error fetching operations:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchOperations();
  }, []);

  // Handle form input changes
  const handleInputChange = (name: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      businessId: null,
      type: "",
      title: "",
      description: ""
    });
    setEditId(null);
  };

  // Open modal for creating new operation
  const handleAddNew = () => {
    resetForm();
    setModalOpen(true);
  };

  // Open modal for editing existing operation
  const handleEdit = (operation: BusinessOperation) => {
    setFormData({
      businessId: operation.business_id,
      type: operation.type,
      title: operation.title,
      description: operation.description
    });
    setEditId(operation.id);
    setModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.businessId) {
      setError("Please select a business");
      return;
    }
    
    if (!formData.type) {
      setError("Please select an operation type");
      return;
    }
    
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const token = Cookies.get("token");
      
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const requestBody = {
        business_id: formData.businessId,
        type: formData.type,
        title: formData.title,
        description: formData.description
      };

      // Try different endpoint variations for editing/creating operations
      const baseEndpoints = [
        "http://localhost:7000/api/v1/group/business/operation",
        "http://localhost:7000/api/v1/group/business-operation",
        "http://localhost:7000/api/v1/group/operation"
      ];
      
      const url = editId 
        ? `${baseEndpoints[0]}/${editId}` // Use the first endpoint for editing
        : baseEndpoints[0]; // Use the first endpoint for creating

      const method = editId ? "PUT" : "POST";

      console.log(`Submitting to endpoint: ${url} with method: ${method}`);
      console.log("Request body:", requestBody);

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Refresh operations list
        await fetchOperations();
        
        // Close modal and reset form
        setModalOpen(false);
        resetForm();
      } else {
        throw new Error(data.message || "Operation failed");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (id: number) => {
    setConfirmDeleteId(id);
    setConfirmDialogOpen(true);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    
    try {
      setIsSubmitting(true);
      const token = Cookies.get("token");
      
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      const response = await fetch(`http://localhost:7000/api/v1/group/business/operation/${confirmDeleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Update local state to remove the deleted item
        setOperations(prev => prev.filter(op => op.id !== confirmDeleteId));
      } else {
        throw new Error(data.message || "Delete operation failed");
      }
    } catch (err) {
      console.error("Error deleting operation:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsSubmitting(false);
      setConfirmDialogOpen(false);
      setConfirmDeleteId(null);
    }
  };

  // Filter operations by search term
  const filteredOperations = operations.filter(op => {
    return (
      op.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.businessTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Get readable operation type label
  const getTypeLabel = (type: string) => {
    const opType = operationTypes.find(t => t.value === type);
    return opType ? opType.label : type;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl font-bold">Business Operations</CardTitle>
          <Button onClick={handleAddNew} className="flex items-center gap-1">
            <Plus size={16} /> Add New
          </Button>
        </CardHeader>
        <CardContent>
          {/* Error message */}
          {error && (
            <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-md border-l-4 border-red-500 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {/* Search */}
          <div className="flex mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search operations..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Operations Table */}
          {isLoading && operations.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 size={36} className="animate-spin text-primary" />
              <span className="ml-2 text-gray-600">Loading operations...</span>
            </div>
          ) : filteredOperations.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOperations.map((operation) => (
                    <TableRow key={operation.id}>
                      <TableCell className="font-medium">{operation.businessTitle}</TableCell>
                      <TableCell>{getTypeLabel(operation.type)}</TableCell>
                      <TableCell>{operation.title}</TableCell>
                      <TableCell className="max-w-xs truncate" title={operation.description}>
                        {operation.description}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(operation)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteConfirm(operation.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                {searchTerm 
                  ? "No operations found matching your search criteria." 
                  : "No business operations found. Click 'Add New' to create one."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Modal */}
      <Dialog open={modalOpen} onOpenChange={(open) => {
        if (!open && !isSubmitting) {
          resetForm();
        }
        setModalOpen(open);
      }}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editId ? "Edit Business Operation" : "Add New Business Operation"}</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                {/* Business Dropdown */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Business <span className="text-red-500">*</span>
                  </label>
                  <Select 
                    value={formData.businessId?.toString() || ""}
                    onValueChange={(value) => handleInputChange('businessId', parseInt(value))}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a business" />
                    </SelectTrigger>
                    <SelectContent>
                      {businesses.map((business) => (
                        <SelectItem key={business.id} value={business.id.toString()}>
                          {business.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
    
                {/* Operation Type Dropdown */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Operation Type <span className="text-red-500">*</span>
                  </label>
                  <Select 
                    value={formData.type}
                    onValueChange={(value) => handleInputChange('type', value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an operation type" />
                    </SelectTrigger>
                    <SelectContent>
                      {operationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
    
                {/* Title Input */}
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter title"
                    disabled={isSubmitting}
                  />
                </div>
    
                {/* Description Input */}
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter description"
                    rows={4}
                    disabled={isSubmitting}
                  />
                </div>
    
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setModalOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editId ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      editId ? "Update" : "Create"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
    
          {/* Delete Confirmation Dialog */}
          <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Confirm Delete</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-gray-600">Are you sure you want to delete this business operation? This action cannot be undone.</p>
                {confirmDeleteId && (
                  <p className="font-medium mt-2">
                    {operations.find(op => op.id === confirmDeleteId)?.title}
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setConfirmDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      );
    };
    
    export default BusinessOperationPage;