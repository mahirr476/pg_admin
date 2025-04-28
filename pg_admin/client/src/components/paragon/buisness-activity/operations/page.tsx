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
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Edit, Trash, AlertCircle, Search } from "lucide-react";
import Cookies from "js-cookie";
// Import PrimeReact Editor and required CSS
import { Editor } from 'primereact/editor';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

// Types
interface Business {
  id: number;
  title: string;
}

interface BusinessOperation {
  id: number;
  businessId?: number; // Correct field name from API
  businessTitle?: string;
  title: string;
  description: string;
  status?: string;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
}

// Form data structure with correct field names
interface FormData {
  businessDropdown: string;  // For the dropdown selection
  businessId: string;        // Correct field name matching API
  title: string;
  description: string;
  status: string;            // Status field (ACTIVE/INACTIVE)
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
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  
  // Form data with correct field names
  const [formData, setFormData] = useState<FormData>({
    businessDropdown: "",
    businessId: "",  // Correct field name
    title: "",
    description: "",
    status: "ACTIVE"  // Default status
  });

  // Editor header template for improved styling (same as in DirectorForm)
  const editorHeader = (
    <span className="ql-formats">
      <button className="ql-bold" aria-label="Bold"></button>
      <button className="ql-italic" aria-label="Italic"></button>
      <button className="ql-underline" aria-label="Underline"></button>
      <button className="ql-strike" aria-label="Strike"></button>
      <button className="ql-blockquote" aria-label="Blockquote"></button>
      <button className="ql-list" value="ordered" aria-label="Ordered List"></button>
      <button className="ql-list" value="bullet" aria-label="Bullet List"></button>
      <button className="ql-link" aria-label="Insert Link"></button>
      <select className="ql-size" defaultValue="" aria-label="Size">
        <option value="small">Small</option>
        <option value="">Normal</option>
        <option value="large">Large</option>
        <option value="huge">Huge</option>
      </select>
      <select className="ql-header" defaultValue="0" aria-label="Header">
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
        <option value="0">Normal</option>
      </select>
      <select className="ql-align" defaultValue="" aria-label="Align">
        <option value="">Left</option>
        <option value="center">Center</option>
        <option value="right">Right</option>
        <option value="justify">Justify</option>
      </select>
    </span>
  );

  // Add custom editor styles (similar to DirectorForm)
  useEffect(() => {
    // Add custom styles for the editor
    const style = document.createElement('style');
    style.innerHTML = `
      .p-editor-container .p-editor-content {
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        min-height: 200px;
      }
      .p-editor-container .p-editor-content.p-error {
        border-color: #ef4444;
      }
      .p-editor-container .p-editor-toolbar {
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
        background-color: #f9fafb;
        border: 1px solid #d1d5db;
        border-bottom: none;
      }
      .ql-container {
        font-family: inherit !important;
        font-size: 1rem !important;
      }
      .ql-editor {
        padding: 1rem !important;
        min-height: 200px !important;
      }
      .ql-editor.ql-blank::before {
        font-style: normal !important;
        color: #9ca3af !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

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
      
      // Use the exact API endpoint specified
      const response = await fetch("http://localhost:7000/api/v1/group/business/operation", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching operations: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setOperations(Array.isArray(data.data) ? data.data : [data.data].filter(Boolean));
        console.log("Fetched operations:", data.data);
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

 // Modified handleInputChange to not override the businessId 
const handleInputChange = (name: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [name]: String(value)
    }));
    
    // Only auto-fill businessId if that field hasn't been manually entered yet
    if (name === 'businessDropdown' && !formData.businessId) {
      setFormData(prev => ({
        ...prev,
        businessId: String(value)
      }));
    }
    
    // Clear validation error
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      businessDropdown: "",
      businessId: "",  // Correct field name
      title: "",
      description: "",
      status: "ACTIVE"  // Reset to ACTIVE
    });
    setEditId(null);
    setValidationErrors({});
  };

  // Open modal for creating new operation
  const handleAddNew = () => {
    resetForm();
    setModalOpen(true);
  };

  // Open modal for editing existing operation
  const handleEdit = (operation: BusinessOperation) => {
    const businessId = operation.businessId?.toString() || "";  // Correct field name
    setFormData({
      businessDropdown: businessId,
      businessId: businessId,  // Correct field name
      title: operation.title,
      description: operation.description,
      status: operation.status || "ACTIVE"  // Use operation status or default
    });
    setEditId(operation.id);
    setModalOpen(true);
  };

  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.businessId) {
      newErrors.businessId = "Business ID is required";  // Correct field name
    }
    
    if (!formData.title || !formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.description || !formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.status) {
      newErrors.status = "Status is required";
    }
    
    setValidationErrors(newErrors);
    
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission with correct field names
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Validate form fields
      if (!validateForm()) {
        setError("Please fix all validation errors before submitting.");
        setIsSubmitting(false);
        return;
      }
      
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      // Prepare request data - using correct field names matching API
      const requestData = {
        businessId: Number(formData.businessId),  // Correct field name
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status
      };
      
      // Log request data for debugging
      console.log('Request data:', requestData);
      
      // Construct URL
      const url = editId 
        ? `http://localhost:7000/api/v1/group/business/operation/${editId}`
        : "http://localhost:7000/api/v1/group/business/operation";
      
      // Make API request
      const response = await fetch(url, {
        method: editId ? "PUT" : "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData)
      });
      
      // Get full response text for debugging
      const responseText = await response.text();
      console.log('API response:', responseText);
      
      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse API response as JSON:", e);
        throw new Error(`Server response is not valid JSON: ${responseText}`);
      }
      
      // Check if request was successful
      if (!response.ok) {
        throw new Error(data.message || `HTTP error: ${response.status}`);
      }
      
      if (data.success) {
        // Success! Refresh data, reset form, close modal
        await fetchOperations();
        resetForm();
        setModalOpen(false);
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

  // Handle status change
  const handleStatusChange = async (operation: BusinessOperation, newStatus: string) => {
    try {
      setIsLoading(true);
      const token = Cookies.get("token");
      
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      const requestData = {
        businessId: operation.businessId,  // Correct field name
        title: operation.title,
        description: operation.description,
        status: newStatus
      };
      
      const response = await fetch(`http://localhost:7000/api/v1/group/business/operation/${operation.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Update local state to reflect the status change
        setOperations(prev => 
          prev.map(op => 
            op.id === operation.id ? { ...op, status: newStatus } : op
          )
        );
      } else {
        throw new Error(data.message || "Status update failed");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
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
      op.businessTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Get business title
  const getBusinessTitle = (businessId: number | undefined) => {
    if (!businessId) return "N/A";
    const business = businesses.find(b => b.id === businessId);
    return business ? business.title : "N/A";
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
                    <TableHead>ID</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOperations.map((operation) => (
                    <TableRow key={operation.id}>
                      <TableCell>{operation.id}</TableCell>
                      <TableCell className="font-medium">
                        {operation.businessTitle || getBusinessTitle(operation.businessId)}
                      </TableCell>
                      <TableCell>{operation.title}</TableCell>
                      <TableCell className="max-w-xs truncate" title={operation.description}>
                        {operation.description}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={operation.status === "ACTIVE" ? "success" : "secondary"}
                            className={operation.status === "ACTIVE" 
                              ? "bg-green-100 text-green-800 hover:bg-green-200" 
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"}
                          >
                            {operation.status || "ACTIVE"}
                          </Badge>
                          <Button
                            variant="ghost" 
                            size="sm"
                            className="h-6 w-6 p-0 rounded-full"
                            onClick={() => handleStatusChange(
                              operation, 
                              operation.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
                            )}
                            title={`Change to ${operation.status === "ACTIVE" ? "Inactive" : "Active"}`}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
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

      {/* Form Modal with corrected field names */}
      <Dialog open={modalOpen} onOpenChange={(open) => {
        if (!open && !isSubmitting) {
          resetForm();
        }
        setModalOpen(open);
      }}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Business Operation" : "Add New Business Operation"}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            {/* Business Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Select Business <span className="text-red-500">*</span>
              </label>
              <Select 
                value={formData.businessDropdown}
                onValueChange={(value) => handleInputChange('businessDropdown', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className={validationErrors.businessDropdown ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select a business" />
                </SelectTrigger>
                <SelectContent>
                  {businesses.map((business) => (
                    <SelectItem key={business.id} value={String(business.id)}>
                      {business.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Business ID Field - Corrected field name */}
            <div className="space-y-2">
              <label htmlFor="businessId" className="text-sm font-medium">
                Business ID <span className="text-red-500">*</span>
              </label>
              <Input
                id="businessId"
                name="businessId"
                value={formData.businessId}
                onChange={(e) => handleInputChange('businessId', e.target.value)}
                placeholder="Enter business ID"
                disabled={isSubmitting}
                className={validationErrors.businessId ? "border-red-500" : ""}
              />
              {validationErrors.businessId && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.businessId}</p>
              )}
            </div>

            {/* Title Input */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter title"
                disabled={isSubmitting}
                className={validationErrors.title ? "border-red-500" : ""}
              />
              {validationErrors.title && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.title}</p>
              )}
            </div>

            {/* Description Input - REPLACED WITH PRIMEREACT EDITOR */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description <span className="text-red-500">*</span>
              </label>
              <Editor
                id="description"
                value={formData.description}
                onTextChange={(e) => handleInputChange('description', e.htmlValue || '')}
                style={{ height: '240px' }}
                placeholder="Enter description..."
                readOnly={isSubmitting}
                headerTemplate={editorHeader}
                pt={{
                  toolbar: { className: 'rounded-t-lg border border-gray-300' },
                  content: { 
                    className: `rounded-b-lg border ${validationErrors.description ? 'border-red-500' : 'border-gray-300'} border-t-0` 
                  }
                }}
              />
              {validationErrors.description && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.description}</p>
              )}
            </div>

            {/* Status Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Status <span className="text-red-500">*</span>
              </label>
              <Select 
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className={validationErrors.status ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors.status && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.status}</p>
              )}
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