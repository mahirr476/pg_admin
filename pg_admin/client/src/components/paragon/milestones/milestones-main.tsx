"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Edit,
  Trash2,
  Plus,
  X,
  Check,
  Upload,
  Search,
  Eye,
  Calendar,
  AlertCircle,
  ImageIcon,
} from "lucide-react";
import Cookies from "js-cookie";

// API URLs
const API_URL = "http://localhost:7000/api/v1/group/milestone";
const DETAIL_API_URL = "http://localhost:7000/api/v1/group/milestone/detail";

// Define the Milestone Detail type
interface MilestoneDetail {
  id: number;
  year: string;
  title: string;
  description: string;
  image: string;
  status: string;
  imageUrl?: string;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
}

// Interface for Modal props
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

// Toast notification interface
interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

// Modal Component
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div
            className="absolute inset-0 bg-gray-500 opacity-75"
            onClick={onClose}
          ></div>
        </div>
        {/* Modal Content */}
        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
              <h3
                className="text-lg leading-6 font-medium text-gray-900"
                id="modal-headline"
              >
                {title}
              </h3>
              <button
                type="button"
                className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={onClose}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Toast Component
const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div
      className="fixed top-5 right-5 z-50 flex items-center space-x-3 bg-white rounded-lg shadow-lg p-4 border-l-4 animate-slideIn min-w-[300px]"
      style={{ borderLeftColor: type === "success" ? "#10B981" : "#EF4444" }}
    >
      <div
        className={`flex-shrink-0 ${
          type === "success" ? "text-green-500" : "text-red-500"
        }`}
      >
        {type === "success" ? (
          <Check className="h-6 w-6" />
        ) : (
          <AlertCircle className="h-6 w-6" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800">{message}</p>
      </div>
      <button
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        onClick={onClose}
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

const MainMilestones: React.FC = () => {
  // State for milestones
  const [milestones, setMilestones] = useState<MilestoneDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Form state
  const [showModal, setShowModal] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formYear, setFormYear] = useState("");
  const [formImage, setFormImage] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMilestones, setFilteredMilestones] = useState<
    MilestoneDetail[]
  >([]);

  // Fetch milestones from API (wrapped in useCallback)
  const fetchMilestones = useCallback(async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }
      console.log(
        "Fetching milestones with token:",
        token.substring(0, 10) + "..."
      );
      const response = await fetch(DETAIL_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const responseText = await response.text();
      console.log("Fetch response:", responseText);
      if (!response.ok) {
        throw new Error(`Failed to fetch milestones: ${responseText}`);
      }
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Failed to parse response: ${responseText}`);
      }
      if (responseData.success) {
        // If the API returns an array directly
        if (Array.isArray(responseData.data)) {
          setMilestones(responseData.data);
          console.log("Milestone data array:", responseData.data);
        }
        // If the API returns a single object, wrap it in an array
        else if (responseData.data && typeof responseData.data === "object") {
          setMilestones([responseData.data]);
          console.log("Single milestone data:", responseData.data);
        }
        // Otherwise, set an empty array
        else {
          setMilestones([]);
        }
      } else {
        throw new Error(responseData.message || "Failed to fetch milestones");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Error fetching milestones:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch milestones on component mount
  useEffect(() => {
    console.log("Component mounted, fetching milestones...");
    fetchMilestones();
  }, [fetchMilestones]);

  // Effect to filter milestones when search term changes
  useEffect(() => {
    const filtered = milestones.filter(
      (milestone) =>
        milestone.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        milestone.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        milestone.year.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMilestones(filtered);
  }, [searchTerm, milestones]);

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(
        "Selected file:",
        file.name,
        "Size:",
        file.size,
        "Type:",
        file.type
      );
      setFormImage(file);
      // Create image preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Get token from cookies
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }
      // Create form data for file upload
      const formData = new FormData();
      formData.append("title", formTitle);
      formData.append("description", formDescription);
      formData.append("year", formYear);
      // Add image if a new one was selected
      if (formImage) {
        formData.append("image", formImage);
        console.log("Adding image to form data:", formImage.name);
      }
      console.log("Sending milestone data:", {
        title: formTitle,
        description: formDescription,
        year: formYear,
        image: formImage ? formImage.name : "No image selected",
      });
      if (isEditing && editId !== null) {
        // Update existing milestone via PUT request
        const response = await fetch(`${DETAIL_API_URL}/${editId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            // Note: Don't set Content-Type when using FormData
          },
          body: formData,
        });
        const responseText = await response.text();
        console.log("Update response:", responseText);
        if (!response.ok) {
          throw new Error(`Failed to update milestone: ${responseText}`);
        }
        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch (e) {
          throw new Error(`Failed to parse response: ${responseText}`);
        }
        if (responseData.success) {
          // Show success toast
          setToast({
            message: "Milestone updated successfully!",
            type: "success",
          });
          // Close the modal
          setShowModal(false);
          // Refresh the list with a slight delay
          setTimeout(() => {
            fetchMilestones();
          }, 1000);
        } else {
          throw new Error(responseData.message || "Failed to update milestone");
        }
      } else {
        // Create new milestone via POST request
        const response = await fetch(DETAIL_API_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Note: Don't set Content-Type when using FormData
          },
          body: formData,
        });
        const responseText = await response.text();
        console.log("Create response:", responseText);
        if (!response.ok) {
          throw new Error(`Failed to create milestone: ${responseText}`);
        }
        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch (e) {
          throw new Error(`Failed to parse response: ${responseText}`);
        }
        if (responseData.success) {
          // Show success toast
          setToast({
            message: "Milestone created successfully!",
            type: "success",
          });
          // Close the modal
          setShowModal(false);
          // Refresh the list with a slight delay
          setTimeout(() => {
            fetchMilestones();
          }, 1000);
        } else {
          throw new Error(responseData.message || "Failed to create milestone");
        }
      }
      // Reset form
      resetForm();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Error saving milestone:", err);
    }
  };

  // Edit a milestone
  const handleEdit = (milestone: MilestoneDetail) => {
    setIsEditing(true);
    setEditId(milestone.id);
    setFormTitle(milestone.title);
    setFormDescription(milestone.description);
    setFormYear(milestone.year);
    setFormImage(null); // Clear selected image
    setImagePreview(null); // Clear image preview
    setShowModal(true);
    console.log("Editing milestone:", milestone);
  };

  // Delete a milestone
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this milestone?")) {
      try {
        // Get token from cookies
        const token = Cookies.get("token");
        if (!token) {
          throw new Error("Authentication token not found");
        }
        console.log(`Deleting milestone ${id}`);
        console.log("Using token:", token.substring(0, 10) + "...");
        const response = await fetch(`${DETAIL_API_URL}/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const responseText = await response.text();
        console.log("Delete response:", responseText);
        if (!response.ok) {
          throw new Error(`Failed to delete milestone: ${responseText}`);
        }
        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch (e) {
          throw new Error(`Failed to parse response: ${responseText}`);
        }
        if (responseData.success) {
          // Show success toast
          setToast({
            message: "Milestone deleted successfully!",
            type: "success",
          });
          // Refresh the list
          await fetchMilestones();
        } else {
          throw new Error(responseData.message || "Failed to delete milestone");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Error deleting milestone:", err);
      }
    }
  };

  // Toggle milestone status
  const toggleStatus = async (id: number, currentStatus: string) => {
    try {
      // Get token from cookies
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }
      const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      const statusData = { status: newStatus };
      console.log(`Updating milestone ${id} status:`, statusData);
      console.log("Using token:", token.substring(0, 10) + "...");
      const response = await fetch(`${DETAIL_API_URL}/${id}`, {
        method: "PUT", // Use PUT instead of PATCH
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(statusData),
      });
      const responseText = await response.text();
      console.log("Status update response:", responseText);
      if (!response.ok) {
        throw new Error(`Failed to update milestone status: ${responseText}`);
      }
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Failed to parse response: ${responseText}`);
      }
      if (responseData.success) {
        // Show success toast
        setToast({
          message: `Milestone ${
            newStatus === "ACTIVE" ? "activated" : "deactivated"
          } successfully!`,
          type: "success",
        });
        // Refresh the list
        await fetchMilestones();
      } else {
        throw new Error(
          responseData.message || "Failed to update milestone status"
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Error updating milestone status:", err);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormTitle("");
    setFormDescription("");
    setFormYear("");
    setFormImage(null);
    setImagePreview(null);
    setIsEditing(false);
    setEditId(null);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Animation Style */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Error notification */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-sm text-red-700 hover:underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
        {/* Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search milestones..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
          >
            <Plus className="h-5 w-5" />
            <span>Add Milestone</span>
          </button>
        </div>
        {/* Modal Form */}
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title={isEditing ? "Edit Milestone" : "Add New Milestone"}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Year */}
            <div>
              <label
                htmlFor="year"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Year <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </span>
                  <input
                    id="year"
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    placeholder="Enter milestone year (e.g., 1990)"
                  />
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Enter the year when this milestone occurred
              </p>
            </div>
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
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
            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
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
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Image{" "}
                {isEditing ? (
                  "(Leave empty to keep current image)"
                ) : (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <div className="mt-1 flex flex-col space-y-4">
                <label
                  htmlFor="image-upload"
                  className="flex items-center justify-center px-6 py-4 rounded-lg border border-gray-300 border-dashed cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <Upload className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-500">
                    {formImage ? formImage.name : "Choose an image"}
                  </span>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    required={!isEditing}
                  />
                </label>
                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-2">Preview:</p>
                    <div className="h-40 w-full rounded-lg border border-gray-300 bg-gray-50 overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center"
              >
                {isEditing ? (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Update Milestone
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Save Milestone
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>
        {/* Loading state */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading milestones...</p>
          </div>
        ) : (
          /* Table */
          <div className="bg-white rounded-lg shadow-md overflow-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Year
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Image
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMilestones.length > 0 ? (
                  filteredMilestones.map((milestone) => (
                    <tr
                      key={milestone.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center h-8 w-16 rounded-full bg-blue-100 text-blue-800 font-medium">
                          {milestone.year}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center relative border border-gray-200 shadow-sm">
                          {milestone.image ? (
                            <img
                              src={`http://localhost:7000/${milestone.image.replace(
                                /^public\//,
                                ""
                              )}`}
                              alt={milestone.title}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                console.error(
                                  "Image failed to load:",
                                  e.currentTarget.src
                                );
                                // Hide the failed image
                                e.currentTarget.style.display = "none";
                                // Show fallback icon instead
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                  const fallback =
                                    document.createElement("div");
                                  fallback.className =
                                    "h-full w-full flex items-center justify-center bg-gray-200";
                                  fallback.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`;
                                  parent.appendChild(fallback);
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <ImageIcon className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {milestone.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 line-clamp-2">
                          {milestone.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {milestone.status === "ACTIVE" ? (
                            <div className="flex items-center">
                              <span className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></span>
                              <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Active
                              </span>
                              <button
                                onClick={() =>
                                  toggleStatus(milestone.id, milestone.status)
                                }
                                className="ml-2 text-xs bg-yellow-50 text-yellow-600 hover:bg-yellow-100 px-2 py-1 rounded border border-yellow-200 transition-colors"
                              >
                                Deactivate
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500 mr-2"></span>
                              <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Inactive
                              </span>
                              <button
                                onClick={() =>
                                  toggleStatus(milestone.id, milestone.status)
                                }
                                className="ml-2 text-xs bg-green-50 text-green-600 hover:bg-green-100 px-2 py-1 rounded border border-green-200 transition-colors"
                              >
                                Activate
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(milestone)}
                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors border border-blue-200"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(milestone.id)}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-200"
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
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      {searchTerm
                        ? "No milestones found. Try adjusting your search."
                        : 'No milestones found. Click "Add Milestone" to create one.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default MainMilestones;