'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';

interface MilestonesHeroType {
  image: File | null;
  imagePreview: string;
  title: string;
  description: string;
}

const MilestonesHero: React.FC = () => {
  const [heroSection, setHeroSection] = useState<MilestonesHeroType>({
    image: null,
    imagePreview: '',
    title: '',
    description: ''
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tempHeroSection, setTempHeroSection] = useState<MilestonesHeroType>({
    image: null,
    imagePreview: '',
    title: '',
    description: ''
  });
  const [showData, setShowData] = useState(false);

  // Load data on initial mount
  useEffect(() => {
    const savedHeroSection = localStorage.getItem('milestonesHeroSection');
    
    if (savedHeroSection) {
      const parsed = JSON.parse(savedHeroSection);
      setHeroSection({
        ...parsed,
        image: null // Don't restore File object
      });
      setShowData(true);
    }
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    if (showData) {
      // Save without the File object
      const saveData = {
        imagePreview: heroSection.imagePreview,
        title: heroSection.title,
        description: heroSection.description
      };
      localStorage.setItem('milestonesHeroSection', JSON.stringify(saveData));
    }
  }, [heroSection, showData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setTempHeroSection(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result as string
        }));
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTempHeroSection({
      ...tempHeroSection,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHeroSection(tempHeroSection);
    setShowData(true);
    setIsDialogOpen(false);
  };

  const handleDialogOpen = () => {
    // Prepare temp section with current data
    setTempHeroSection({
      image: null,
      imagePreview: heroSection.imagePreview,
      title: heroSection.title,
      description: heroSection.description
    });

    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={handleDialogOpen}> Milestones Hero</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Milestones Hero Details</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-4">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">Hero Image</label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />
              {tempHeroSection.imagePreview && (
                <div className="mt-4 relative w-full h-64">
                  <Image 
                    src={tempHeroSection.imagePreview} 
                    alt="Hero Preview" 
                    fill
                    className="object-cover rounded"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <Input
                id="title"
                name="title"
                value={tempHeroSection.title}
                onChange={handleInputChange}
                placeholder="Enter hero title"
                className="w-full"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <Textarea
                id="description"
                name="description"
                value={tempHeroSection.description}
                onChange={handleInputChange}
                placeholder="Enter hero description"
                rows={6}
                className="w-full"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-6">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Display Data after save */}
      {showData && (
        <Card className="p-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {heroSection.imagePreview && (
              <div className="relative w-full h-[400px]">
                <Image 
                  src={heroSection.imagePreview} 
                  alt="Milestones Hero" 
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}
            
            <div className={`${heroSection.imagePreview ? '' : 'text-center'}`}>
              {heroSection.title && (
                <h2 className="text-3xl font-bold mb-4">{heroSection.title}</h2>
              )}
              {heroSection.description && (
                <p className="text-gray-600">{heroSection.description}</p>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MilestonesHero;