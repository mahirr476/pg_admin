"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Pencil,
  Trash,
  Plus,
  X,
  Check,
  Eye,
  Upload,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Cookies from "js-cookie";

// Define TypeScript interfaces
interface Business {
  id: number;
  title: string;
  bannerImage: string;
  shortDes: string;
  longDes: string;
  videoLink?: string;
  image?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

interface FormData {
  title: string;
  shortDes: string;
  longDes: string;
  bannerImage: File | null;
  image: File | null;
  videoLink: string;
}

const BusinessPage: React.FC = () => {
  // Using alert instead of toast for notifications
  const showNotification = (
    title: string,
    message: string,
    isError: boolean = false
  ): void => {
    alert(`${title}: ${message}`);
  };

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [businessToDelete, setBusinessToDelete] = useState<Business | null>(
    null
  );

  // Form state
  const [formData, setFormData] = useState<FormData>({
    title: "",
    shortDes: "",
    longDes: "",
    bannerImage: null,
    image: null,
    videoLink: "",
  });

  // Preview images
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch businesses on component mount
  useEffect(() => {
    fetchBusinesses();
  }, []);

  // Fetch businesses from API
  const fetchBusinesses = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const token = Cookies.get("token");

      if (!token) {
        showNotification("Authentication Error", "You are not logged in", true);
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        "http://localhost:7000/api/v1/group/business",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching businesses: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setBusinesses(
          Array.isArray(data.data) ? data.data : [data.data].filter(Boolean)
        );
      } else {
        showNotification(
          "Error",
          data.message || "Failed to fetch businesses",
          true
        );
      }
    } catch (error) {
      console.error("Error fetching businesses:", error);
      showNotification("Error", "Failed to fetch businesses", true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          if (name === "bannerImage") {
            setBannerPreview(reader.result as string);
          } else if (name === "image") {
            setImagePreview(reader.result as string);
          }
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  // Reset form
  const resetForm = (): void => {
    setFormData({
      title: "",
      shortDes: "",
      longDes: "",
      bannerImage: null,
      image: null,
      videoLink: "",
    });
    setBannerPreview(null);
    setImagePreview(null);
    setCurrentBusiness(null);
  };

  // Open form for editing
  const handleEdit = (business: Business): void => {
    setCurrentBusiness(business);
    setFormData({
      title: business.title || "",
      shortDes: business.shortDes || "",
      longDes: business.longDes || "",
      videoLink: business.videoLink || "",
      bannerImage: null,
      image: null,
    });

    // Set image previews if available
    if (business.bannerImage) {
      const bannerPath = business.bannerImage.startsWith("http")
        ? business.bannerImage
        : `http://localhost:7000/${business.bannerImage}`;
      setBannerPreview(bannerPath);
    }
    if (business.image) {
      const imagePath = business.image.startsWith("http")
        ? business.image
        : `http://localhost:7000/${business.image}`;
      setImagePreview(imagePath);
    }

    setFormOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = Cookies.get("token");

      if (!token) {
        showNotification("Authentication Error", "You are not logged in", true);
        setIsSubmitting(false);
        return;
      }

      // Create FormData object for file upload
      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        const value = formData[key as keyof FormData];
        if (value !== null) {
          form.append(key, value);
        }
      });

      // Determine if this is an edit or create operation
      const url = currentBusiness
        ? `http://localhost:7000/api/v1/group/business/${currentBusiness.id}`
        : "http://localhost:7000/api/v1/group/business";

      const method = currentBusiness ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set content-type here, it will be set automatically with boundary for FormData
        },
        body: form,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        showNotification(
          "Success",
          currentBusiness
            ? "Business updated successfully"
            : "Business created successfully"
        );

        // Refresh businesses list
        fetchBusinesses();

        // Close form and reset
        setFormOpen(false);
        resetForm();
      } else {
        showNotification("Error", data.message || "Operation failed", true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showNotification("Error", "Failed to save business", true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete confirmation
  const confirmDelete = (business: Business): void => {
    setBusinessToDelete(business);
    setConfirmDialogOpen(true);
  };

  // Delete business
  const handleDelete = async (): Promise<void> => {
    try {
      const token = Cookies.get("token");

      if (!token || !businessToDelete) {
        setConfirmDialogOpen(false);
        return;
      }

      const response = await fetch(
        `http://localhost:7000/api/v1/group/business/${businessToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        showNotification("Success", "Business deleted successfully");

        // Remove from local state to avoid refetch
        setBusinesses((prev) =>
          prev.filter((b) => b.id !== businessToDelete.id)
        );
      } else {
        showNotification(
          "Error",
          data.message || "Delete operation failed",
          true
        );
      }
    } catch (error) {
      console.error("Error deleting business:", error);
      showNotification("Error", "Failed to delete business", true);
    } finally {
      setConfirmDialogOpen(false);
      setBusinessToDelete(null);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Business Activities</CardTitle>
          <Button
            onClick={() => {
              resetForm();
              setFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Business
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Banner Image</TableHead>
                    <TableHead>Short Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {businesses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No businesses found
                      </TableCell>
                    </TableRow>
                  ) : (
                    businesses.map((business) => (
                      <TableRow key={business.id}>
                        <TableCell className="font-medium">
                          {business.title}
                        </TableCell>
                        <TableCell>
                          {business.bannerImage ? (
                            <div className="h-20 w-32 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center relative">
                              <Image
                                src={`http://localhost:7000/${business.bannerImage.replace(
                                  /^public\//,
                                  ""
                                )}`}
                                alt={business.title}
                                width={320}
                                height={200}
                                className="h-full w-full object-cover"
                                unoptimized={true}
                                onError={() => {
                                  // Error handled by next/image's built-in error handling
                                }}
                              />
                            </div>
                          ) : (
                            <div className="h-20 w-32 rounded-md flex items-center justify-center bg-gray-200">
                              <span className="text-xs text-gray-500">
                                No image
                              </span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {business.shortDes}
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                business.status === "ACTIVE"
                                  ? "bg-green-100 text-green-800 border border-green-300"
                                  : "bg-red-100 text-red-800 border border-red-300"
                              }`}
                            >
                              <div className="flex items-center">
                                <div
                                  className={`w-2 h-2 mr-1.5 rounded-full ${
                                    business.status === "ACTIVE"
                                      ? "bg-green-600"
                                      : "bg-red-600"
                                  }`}
                                ></div>
                                {business.status}
                              </div>
                            </div>

                            <Button
                              variant={
                                business.status === "ACTIVE"
                                  ? "outline"
                                  : "default"
                              }
                              size="sm"
                              onClick={async () => {
                                const newStatus =
                                  business.status === "ACTIVE"
                                    ? "INACTIVE"
                                    : "ACTIVE";
                                try {
                                  const token = Cookies.get("token");

                                  // Try multiple different API patterns
                                  let endpointOptions = [
                                    // Option 1: Use a dedicated status endpoint
                                    {
                                      url: `http://localhost:7000/api/v1/group/business/status/${business.id}`,
                                      method: "PATCH",
                                      body: { status: newStatus },
                                    },
                                    // Option 2: Use the main endpoint with PUT (full resource update)
                                    {
                                      url: `http://localhost:7000/api/v1/group/business/${business.id}`,
                                      method: "PUT",
                                      body: {
                                        title: business.title,
                                        shortDes: business.shortDes,
                                        longDes: business.longDes,
                                        status: newStatus,
                                      },
                                    },
                                    // Option 3: Try with an action parameter
                                    {
                                      url: `http://localhost:7000/api/v1/group/business/${business.id}?action=updateStatus`,
                                      method: "POST",
                                      body: { status: newStatus },
                                    },
                                    // Option 4: Try a different status update endpoint format
                                    {
                                      url: `http://localhost:7000/api/v1/group/business/${business.id}/update-status`,
                                      method: "POST",
                                      body: { status: newStatus },
                                    },
                                  ];

                                  // Try each endpoint option until one works
                                  let succeeded = false;
                                  for (const option of endpointOptions) {
                                    console.log(
                                      `Trying endpoint: ${option.url} with method: ${option.method}`
                                    );

                                    try {
                                      const response = await fetch(option.url, {
                                        method: option.method,
                                        headers: {
                                          Authorization: `Bearer ${token}`,
                                          "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify(option.body),
                                      });

                                      // Get response text for debugging
                                      const responseText =
                                        await response.text();
                                      console.log(
                                        `${option.url} response:`,
                                        responseText
                                      );

                                      if (!response.ok) {
                                        console.log(
                                          `Endpoint ${option.url} failed with status ${response.status}`
                                        );
                                        continue; // Try the next endpoint
                                      }

                                      try {
                                        const data = JSON.parse(responseText);
                                        if (data.success) {
                                          // Update local state
                                          setBusinesses((prev) =>
                                            prev.map((b) =>
                                              b.id === business.id
                                                ? { ...b, status: newStatus }
                                                : b
                                            )
                                          );
                                          showNotification(
                                            "Success",
                                            `Status changed to ${newStatus}`
                                          );
                                          succeeded = true;
                                          break; // Exit the loop as this endpoint worked
                                        } else {
                                          console.log(
                                            `Endpoint ${option.url} returned success: false`
                                          );
                                        }
                                      } catch (e) {
                                        console.log(
                                          `Failed to parse JSON from ${option.url}`
                                        );
                                      }
                                    } catch (err) {
                                      console.log(
                                        `Error with endpoint ${option.url}:`,
                                        err
                                      );
                                    }
                                  }

                                  if (!succeeded) {
                                    // If all options failed, show an error
                                    throw new Error(
                                      "All status update attempts failed. Please check API documentation."
                                    );
                                  }
                                } catch (error: any) {
                                  console.error(
                                    "Error updating status:",
                                    error
                                  );
                                  showNotification(
                                    "Error",
                                    error.message || "Failed to update status",
                                    true
                                  );
                                }
                              }}
                            >
                              {business.status === "ACTIVE"
                                ? "INACTIVE"
                                : "ACTIVE"}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(business)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => confirmDelete(business)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog - Improved Styling */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader className="px-2">
            <DialogTitle>
              {currentBusiness ? "Edit Business" : "Add New Business"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter business title"
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="shortDes" className="text-sm font-medium">
                    Short Description <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="shortDes"
                    name="shortDes"
                    value={formData.shortDes}
                    onChange={handleInputChange}
                    placeholder="Enter short description"
                    rows={2}
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="longDes" className="text-sm font-medium">
                    Long Description <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="longDes"
                    name="longDes"
                    value={formData.longDes}
                    onChange={handleInputChange}
                    placeholder="Enter long description"
                    rows={4}
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="videoLink" className="text-sm font-medium">
                    Video Link
                  </label>
                  <Input
                    id="videoLink"
                    name="videoLink"
                    value={formData.videoLink}
                    onChange={handleInputChange}
                    placeholder="Enter YouTube video link"
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="bannerImage"
                      className="text-sm font-medium"
                    >
                      Banner Image{" "}
                      {!currentBusiness && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <div className="flex flex-col gap-2">
                      <div className="relative border border-gray-200 rounded-md p-2 bg-gray-50">
                        <Input
                          id="bannerImage"
                          name="bannerImage"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          required={!currentBusiness}
                        />
                        <label
                          htmlFor="bannerImage"
                          className="flex flex-col items-center justify-center cursor-pointer p-4 text-center h-40"
                        >
                          {bannerPreview ? (
                            <div className="relative w-full h-full">
                              <Image
                                // src={bannerPreview}
                                src={`http://localhost:7000/${bannerPreview}`}
                                alt="Banner Preview"
                                width={320}
                                height={240}
                                className="w-full h-full object-cover rounded-md"
                                unoptimized={true}
                                onError={() => {
                                  // Handle error with placeholder
                                }}
                              />

                              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-md">
                                <Upload className="h-6 w-6 text-white" />
                              </div>
                            </div>
                          ) : (
                            <>
                              <Upload className="h-10 w-10 text-gray-400 mb-2" />
                              <p className="text-sm text-gray-500">
                                Click to upload banner image
                              </p>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="image" className="text-sm font-medium">
                      Main Image{" "}
                      {!currentBusiness && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <div className="flex flex-col gap-2">
                      <div className="relative border border-gray-200 rounded-md p-2 bg-gray-50">
                        <Input
                          id="image"
                          name="image"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          required={!currentBusiness}
                        />
                        <label
                          htmlFor="image"
                          className="flex flex-col items-center justify-center cursor-pointer p-4 text-center h-40"
                        >
                          {imagePreview ? (
                            <div className="relative w-full h-full">
                              <Image
                                // src={imagePreview}
                                src={`http://localhost:7000/${imagePreview}`}
                                alt="Image Preview"
                                width={320}
                                height={240}
                                className="w-full h-full object-cover rounded-md"
                                unoptimized={true}
                                onError={() => {
                                  // Handle error with placeholder
                                }}
                              />

                              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-md">
                                <Upload className="h-6 w-6 text-white" />
                              </div>
                            </div>
                          ) : (
                            <>
                              <Upload className="h-10 w-10 text-gray-400 mb-2" />
                              <p className="text-sm text-gray-500">
                                Click to upload main image
                              </p>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormOpen(false);
                  resetForm();
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {currentBusiness ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  <>{currentBusiness ? "Update" : "Save"}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <p>Are you sure you want to delete this business activity?</p>
            <p className="font-medium mt-2">{businessToDelete?.title}</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessPage;
