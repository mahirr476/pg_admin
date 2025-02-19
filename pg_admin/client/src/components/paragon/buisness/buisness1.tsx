"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Loader2, Edit, Trash2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define the business data interface
interface BusinessData {
  id: string;
  heroImage: string;
  heroTitle: string;
  heroDescription: string;
  secondTitle: string;
  secondDescription: string;
}

export default function BusinessModal() {
  const [businesses, setBusinesses] = useState<BusinessData[]>([]);
  const [currentBusiness, setCurrentBusiness] = useState<BusinessData>({
    id: '',
    heroImage: '',
    heroTitle: '',
    heroDescription: '',
    secondTitle: '',
    secondDescription: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Maximum file size (5MB)
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  // Load businesses from local storage on component mount
  useEffect(() => {
    const savedBusinesses = localStorage.getItem('businesses');
    if (savedBusinesses) {
      try {
        setBusinesses(JSON.parse(savedBusinesses));
      } catch (err) {
        // Clear corrupted local storage
        localStorage.removeItem('businesses');
        setError('Failed to load saved businesses. Please re-add your entries.');
      }
    }
  }, []);

  // Save businesses to local storage whenever they change
  useEffect(() => {
    try {
      if (businesses.length > 0) {
        // Limit number of stored businesses
        const limitedBusinesses = businesses.slice(-10);
        localStorage.setItem('businesses', JSON.stringify(limitedBusinesses));
      }
    } catch (err) {
      setError('Storage limit exceeded. Unable to save all businesses.');
    }
  }, [businesses]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Handle image upload
      let heroImage = currentBusiness.heroImage;
      const imageFile = formData.get('heroImage') as File;
      if (imageFile && imageFile.size > 0) {
        // Check file size
        if (imageFile.size > MAX_FILE_SIZE) {
          setError(`Image size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
          setIsLoading(false);
          return;
        }

        heroImage = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
      }

      // Construct business data object
      const businessData: BusinessData = {
        id: currentBusiness.id || Date.now().toString(),
        heroImage,
        heroTitle: formData.get('heroTitle') as string,
        heroDescription: formData.get('heroDescription') as string,
        secondTitle: formData.get('secondTitle') as string,
        secondDescription: formData.get('secondDescription') as string,
      };

      // Update or add business
      if (isEditing && currentBusiness.id) {
        setBusinesses(prev => 
          prev.map(b => b.id === currentBusiness.id ? businessData : b)
        );
      } else {
        // Limit total businesses
        setBusinesses(prev => {
          const updatedBusinesses = [...prev, businessData];
          return updatedBusinesses.slice(-10);
        });
      }

      // Reset state and close dialog
      setCurrentBusiness({
        id: '',
        heroImage: '',
        heroTitle: '',
        heroDescription: '',
        secondTitle: '',
        secondDescription: '',
      });
      setIsEditing(false);
      setOpen(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to save business. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (business: BusinessData) => {
    setCurrentBusiness(business);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    setBusinesses(prev => prev.filter(b => b.id !== id));
  };

  const handleOpenModal = () => {
    setCurrentBusiness({
      id: '',
      heroImage: '',
      heroTitle: '',
      heroDescription: '',
      secondTitle: '',
      secondDescription: '',
    });
    setIsEditing(false);
    setOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={handleOpenModal} className="gap-2">
            <PlusCircle size={16} />
            Add Business
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Business' : 'Add New Business'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hero Section */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="heroImage">Hero Image (Max 5MB)</Label>
                <Input 
                  id="heroImage" 
                  name="heroImage"
                  type="file" 
                  accept="image/*"
                />
                {currentBusiness.heroImage && (
                  <div className="mt-4 relative w-full h-64">
                    <Image 
                      src={currentBusiness.heroImage} 
                      alt="Preview" 
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="heroTitle">Hero Title</Label>
                <Input 
                  id="heroTitle" 
                  name="heroTitle"
                  placeholder="Enter hero title"
                  value={currentBusiness.heroTitle}
                  onChange={(e) => setCurrentBusiness(prev => ({
                    ...prev,
                    heroTitle: e.target.value
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="heroDescription">Hero Description</Label>
                <Textarea 
                  id="heroDescription"
                  name="heroDescription"
                  placeholder="Enter hero description"
                  value={currentBusiness.heroDescription}
                  onChange={(e) => setCurrentBusiness(prev => ({
                    ...prev,
                    heroDescription: e.target.value
                  }))}
                  rows={4}
                />
              </div>
            </div>

            {/* Second Section */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="secondTitle">Title</Label>
                <Input 
                  id="secondTitle"
                  name="secondTitle"
                  placeholder="Enter second title"
                  value={currentBusiness.secondTitle}
                  onChange={(e) => setCurrentBusiness(prev => ({
                    ...prev,
                    secondTitle: e.target.value
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="secondDescription">Description</Label>
                <Textarea 
                  id="secondDescription"
                  name="secondDescription"
                  placeholder="Enter second description"
                  value={currentBusiness.secondDescription}
                  onChange={(e) => setCurrentBusiness(prev => ({
                    ...prev,
                    secondDescription: e.target.value
                  }))}
                  rows={4}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Business'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Business Table */}
      {businesses.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Hero Title</TableHead>
                  <TableHead>Hero Description</TableHead>
                  <TableHead>Second Title</TableHead>
                  <TableHead>Second Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businesses.map((business) => (
                  <TableRow key={business.id}>
                    <TableCell>
                      {business.heroImage && (
                        <div className="relative w-24 h-24">
                          <Image 
                            src={business.heroImage} 
                            alt="Hero Image" 
                            fill 
                            className="object-cover rounded"
                          />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{business.heroTitle}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {business.heroDescription}
                    </TableCell>
                    <TableCell>{business.secondTitle}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {business.secondDescription}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => handleEdit(business)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon"
                          onClick={() => handleDelete(business.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}