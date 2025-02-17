'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';

interface MainSectionType {
  mainTitle: string;
  mainDescription: string;
}

interface MilestoneSectionType {
  id: string;
  image: File | null;
  imagePreview: string;
  title: string;
  description: string;
}

const MilestonesMain: React.FC = () => {
  const [mainSection, setMainSection] = useState<MainSectionType>({
    mainTitle: '',
    mainDescription: ''
  });

  const [milestoneSections, setMilestoneSections] = useState<MilestoneSectionType[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tempMainSection, setTempMainSection] = useState<MainSectionType>({
    mainTitle: '',
    mainDescription: ''
  });
  const [tempMilestoneSections, setTempMilestoneSections] = useState<MilestoneSectionType[]>([]);
  const [showData, setShowData] = useState(false);

  // Load data on initial mount
  useEffect(() => {
    const savedMainSection = localStorage.getItem('milestonesMainSection');
    const savedMilestoneSections = localStorage.getItem('milestonesMainMilestones');
    
    if (savedMainSection) {
      setMainSection(JSON.parse(savedMainSection));
    }

    if (savedMilestoneSections) {
      const parsed = JSON.parse(savedMilestoneSections);
      setMilestoneSections(parsed.map((section: MilestoneSectionType) => ({
        ...section,
        image: null // Don't restore File object
      })));
    }

    setShowData(!!savedMainSection || !!savedMilestoneSections);
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    if (showData) {
      localStorage.setItem('milestonesMainSection', JSON.stringify(mainSection));
      
      // Save milestone sections without File objects
      const savedSections = milestoneSections.map(section => ({
        id: section.id,
        imagePreview: section.imagePreview,
        title: section.title,
        description: section.description
      }));
      localStorage.setItem('milestonesMainMilestones', JSON.stringify(savedSections));
    }
  }, [mainSection, milestoneSections, showData]);

  const handleMainSectionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTempMainSection({
      ...tempMainSection,
      [e.target.name]: e.target.value
    });
  };

  const handleAddMilestoneSection = () => {
    const newSection: MilestoneSectionType = {
      id: `milestone-${Date.now()}`,
      image: null,
      imagePreview: '',
      title: '',
      description: ''
    };
    setTempMilestoneSections([...tempMilestoneSections, newSection]);
  };

  const handleMilestoneSectionChange = (
    index: number, 
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newSections = [...tempMilestoneSections];
    newSections[index] = {
      ...newSections[index],
      [e.target.name]: e.target.value
    };
    setTempMilestoneSections(newSections);
  };

  const handleMilestoneImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const newSections = [...tempMilestoneSections];
        newSections[index] = {
          ...newSections[index],
          image: file,
          imagePreview: reader.result as string
        };
        setTempMilestoneSections(newSections);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveMilestoneSection = (indexToRemove: number) => {
    setTempMilestoneSections(tempMilestoneSections.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMainSection(tempMainSection);
    setMilestoneSections(tempMilestoneSections);
    setShowData(true);
    setIsDialogOpen(false);
  };

  const handleDialogOpen = () => {
    // Prepare temp sections with current data
    setTempMainSection({
      mainTitle: mainSection.mainTitle,
      mainDescription: mainSection.mainDescription
    });

    setTempMilestoneSections(milestoneSections.map(section => ({
      ...section,
      id: section.id || `milestone-${Date.now()}`
    })));

    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={handleDialogOpen}>Main Milestones</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Milestones Details</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Main Section */}
            <div className="space-y-4 p-4 border rounded bg-slate-50">
              <div className="space-y-2">
                <label htmlFor="mainTitle" className="block text-sm font-medium text-gray-700">Main Title</label>
                <Input
                  id="mainTitle"
                  name="mainTitle"
                  value={tempMainSection.mainTitle}
                  onChange={handleMainSectionChange}
                  placeholder="Enter main title"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="mainDescription" className="block text-sm font-medium text-gray-700">Main Description</label>
                <Textarea
                  id="mainDescription"
                  name="mainDescription"
                  value={tempMainSection.mainDescription}
                  onChange={handleMainSectionChange}
                  placeholder="Enter main description"
                  rows={4}
                  className="w-full"
                />
              </div>
            </div>

            {/* Milestone Sections */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Milestone Sections</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleAddMilestoneSection}
                >
                  Add Milestone
                </Button>
              </div>

              {tempMilestoneSections.map((section, index) => (
                <div key={section.id} className="space-y-4 p-4 border rounded relative">
                  {/* Remove Section Button */}
                  <Button 
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => handleRemoveMilestoneSection(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <label htmlFor={`image-${section.id}`} className="block text-sm font-medium text-gray-700">
                      Image for Milestone {index + 1}
                    </label>
                    <Input
                      id={`image-${section.id}`}
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleMilestoneImageChange(index, e)}
                      className="w-full"
                    />
                    {section.imagePreview && (
                      <div className="mt-4 relative w-full h-64">
                        <Image 
                          src={section.imagePreview} 
                          alt={`Milestone ${index + 1} Preview`}
                          fill
                          className="object-cover rounded"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <label htmlFor={`title-${section.id}`} className="block text-sm font-medium text-gray-700">
                      Title for Milestone {index + 1}
                    </label>
                    <Input
                      id={`title-${section.id}`}
                      name="title"
                      value={section.title}
                      onChange={(e) => handleMilestoneSectionChange(index, e)}
                      placeholder={`Enter title for milestone ${index + 1}`}
                      className="w-full"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label htmlFor={`description-${section.id}`} className="block text-sm font-medium text-gray-700">
                      Description for Milestone {index + 1}
                    </label>
                    <Textarea
                      id={`description-${section.id}`}
                      name="description"
                      value={section.description}
                      onChange={(e) => handleMilestoneSectionChange(index, e)}
                      placeholder={`Enter description for milestone ${index + 1}`}
                      rows={4}
                      className="w-full"
                    />
                  </div>
                </div>
              ))}
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
        <Card className="p-6 space-y-12">
          {/* Main Section */}
          <div className="text-center">
            {mainSection.mainTitle && (
              <h2 className="text-3xl font-bold mb-4">{mainSection.mainTitle}</h2>
            )}
            {mainSection.mainDescription && (
              <p className="text-gray-600 max-w-3xl mx-auto">{mainSection.mainDescription}</p>
            )}
          </div>

          {/* Milestone Sections */}
          <div className="grid md:grid-cols-3 gap-8">
            {milestoneSections.map((section) => (
              (section.imagePreview || section.title || section.description) && (
                <div key={section.id} className="bg-slate-50 p-6 rounded-lg">
                  {section.imagePreview && (
                    <div className="relative w-full h-48 mb-4">
                      <Image 
                        src={section.imagePreview} 
                        alt={section.title || 'Milestone image'}
                        fill
                        className="object-cover rounded"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  {section.title && (
                    <h3 className="text-xl font-semibold mb-3">{section.title}</h3>
                  )}
                  {section.description && (
                    <p className="text-gray-600">{section.description}</p>
                  )}
                </div>
              )
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default MilestonesMain;