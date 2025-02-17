'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface MainSectionType {
  mainTitle: string;
  mainDescription: string;
}

interface ImageSectionType {
  id: string;
  imageFile: File | null;
  imagePreview: string;
  title: string;
}

interface SecondDescriptionType {
  description: string;
}

interface BottomSectionType {
  id: string;
  title: string;
  description: string;
}

const AboutUs6: React.FC = () => {
  const [mainSection, setMainSection] = React.useState<MainSectionType>({
    mainTitle: '',
    mainDescription: ''
  });

  const [imageSections, setImageSections] = React.useState<ImageSectionType[]>(
    Array(3).fill(null).map((_, index) => ({
      id: `image-section-${Date.now()}-${index}`,
      imageFile: null,
      imagePreview: '',
      title: ''
    }))
  );

  const [secondDescription, setSecondDescription] = React.useState<SecondDescriptionType>({
    description: ''
  });

  const [bottomSections, setBottomSections] = React.useState<BottomSectionType[]>(
    Array(3).fill(null).map((_, index) => ({
      id: `bottom-section-${Date.now()}-${index}`,
      title: '',
      description: ''
    }))
  );

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [tempMainSection, setTempMainSection] = React.useState<MainSectionType>({
    mainTitle: '',
    mainDescription: ''
  });
  const [tempImageSections, setTempImageSections] = React.useState<ImageSectionType[]>(
    Array(3).fill(null).map((_, index) => ({
      id: `image-section-${Date.now()}-${index}`,
      imageFile: null,
      imagePreview: '',
      title: ''
    }))
  );
  const [tempSecondDescription, setTempSecondDescription] = React.useState<SecondDescriptionType>({
    description: ''
  });
  const [tempBottomSections, setTempBottomSections] = React.useState<BottomSectionType[]>(
    Array(3).fill(null).map((_, index) => ({
      id: `bottom-section-${Date.now()}-${index}`,
      title: '',
      description: ''
    }))
  );
  const [showData, setShowData] = React.useState(false);

  // Load data on initial mount
  React.useEffect(() => {
    const savedMainSection = localStorage.getItem('aboutUs6MainSection');
    const savedImageSections = localStorage.getItem('aboutUs6ImageSections');
    const savedSecondDescription = localStorage.getItem('aboutUs6SecondDescription');
    const savedBottomSections = localStorage.getItem('aboutUs6BottomSections');
    
    if (savedMainSection) {
      setMainSection(JSON.parse(savedMainSection));
    }

    if (savedImageSections) {
      const parsed = JSON.parse(savedImageSections);
      const sectionsWithIds = parsed.map((section: any, index: number) => ({
        ...section,
        id: section.id || `image-section-${Date.now()}-${index}`,
        imageFile: null
      }));
      setImageSections(sectionsWithIds);
    }

    if (savedSecondDescription) {
      setSecondDescription(JSON.parse(savedSecondDescription));
    }

    if (savedBottomSections) {
      const parsed = JSON.parse(savedBottomSections);
      const sectionsWithIds = parsed.map((section: BottomSectionType, index: number) => ({
        ...section,
        id: section.id || `bottom-section-${Date.now()}-${index}`
      }));
      setBottomSections(sectionsWithIds);
    }

    setShowData(
      !!savedMainSection || 
      !!savedImageSections || 
      !!savedSecondDescription || 
      !!savedBottomSections
    );
  }, []);

  // Save data whenever it changes
  React.useEffect(() => {
    if (showData) {
      localStorage.setItem('aboutUs6MainSection', JSON.stringify(mainSection));
      
      // Save image sections without File objects
      const savedImageSections = imageSections.map(section => ({
        id: section.id,
        imagePreview: section.imagePreview,
        title: section.title
      }));
      localStorage.setItem('aboutUs6ImageSections', JSON.stringify(savedImageSections));
      
      localStorage.setItem('aboutUs6SecondDescription', JSON.stringify(secondDescription));
      localStorage.setItem('aboutUs6BottomSections', JSON.stringify(bottomSections));
    }
  }, [mainSection, imageSections, secondDescription, bottomSections, showData]);

  const handleMainSectionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTempMainSection({
      ...tempMainSection,
      [e.target.name]: e.target.value
    });
  };

  const handleImageSectionChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newSections = [...tempImageSections];
    
    if (e.target.name === 'imageFile' && e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        newSections[index] = {
          ...newSections[index],
          imageFile: file,
          imagePreview: reader.result as string
        };
        setTempImageSections(newSections);
      };
      
      reader.readAsDataURL(file);
    } else {
      newSections[index] = {
        ...newSections[index],
        [e.target.name]: e.target.value
      };
      setTempImageSections(newSections);
    }
  };

  const handleSecondDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTempSecondDescription({
      description: e.target.value
    });
  };

  const handleBottomSectionChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newSections = [...tempBottomSections];
    newSections[index] = {
      ...newSections[index],
      [e.target.name]: e.target.value
    };
    setTempBottomSections(newSections);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMainSection(tempMainSection);
    setImageSections(tempImageSections);
    setSecondDescription(tempSecondDescription);
    setBottomSections(tempBottomSections);
    setShowData(true);
    setIsDialogOpen(false);
  };

  const handleDialogOpen = () => {
    // Prepare temp sections with current data
    setTempMainSection({
      mainTitle: mainSection.mainTitle,
      mainDescription: mainSection.mainDescription
    });

    setTempImageSections(imageSections.map(section => ({
      ...section,
      id: section.id || `image-section-${Date.now()}-${Math.random()}`
    })));

    setTempSecondDescription({
      description: secondDescription.description
    });

    setTempBottomSections(bottomSections.map(section => ({
      ...section,
      id: section.id || `bottom-section-${Date.now()}-${Math.random()}`
    })));

    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={handleDialogOpen}>About Section 6</Button>
        </DialogTrigger>
        <DialogContent className="h-[90vh] max-h-[800px] max-w-[800px] flex flex-col overflow-hidden p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>About Section 6 Details</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <form id="sectionForm" onSubmit={handleSubmit} className="space-y-6">
              {/* Main Section */}
              <div className="space-y-4 p-4 border rounded bg-slate-50">
                <div>
                  <label htmlFor="mainTitle" className="block mb-2 font-medium">Main Title</label>
                  <Input
                    id="mainTitle"
                    name="mainTitle"
                    value={tempMainSection.mainTitle}
                    onChange={handleMainSectionChange}
                    placeholder="Enter main title"
                  />
                </div>
                <div>
                  <label htmlFor="mainDescription" className="block mb-2 font-medium">Main Description</label>
                  <Textarea
                    id="mainDescription"
                    name="mainDescription"
                    value={tempMainSection.mainDescription}
                    onChange={handleMainSectionChange}
                    placeholder="Enter main description"
                    rows={4}
                  />
                </div>
              </div>

              {/* Image Sections */}
              {tempImageSections.map((section, index) => (
                <div key={section.id} className="space-y-4 p-4 border rounded">
                  <div>
                    <label htmlFor={`imageFile-${section.id}`} className="block mb-2 font-medium">Image for Section {index + 1}</label>
                    <Input
                      id={`imageFile-${section.id}`}
                      name="imageFile"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageSectionChange(index, e)}
                    />
                    {section.imagePreview && (
                      <div className="mt-4">
                        <img 
                          src={section.imagePreview} 
                          alt={`Preview for section ${index + 1}`} 
                          className="max-h-48 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label htmlFor={`title-${section.id}`} className="block mb-2 font-medium">Title for Section {index + 1}</label>
                    <Input
                      id={`title-${section.id}`}
                      name="title"
                      value={section.title}
                      onChange={(e) => handleImageSectionChange(index, e)}
                      placeholder={`Enter title for section ${index + 1}`}
                    />
                  </div>
                </div>
              ))}

              {/* Second Description */}
              <div className="space-y-4 p-4 border rounded">
                <div>
                  <label htmlFor="secondDescription" className="block mb-2 font-medium">Second Description</label>
                  <Textarea
                    id="secondDescription"
                    name="description"
                    value={tempSecondDescription.description}
                    onChange={handleSecondDescriptionChange}
                    placeholder="Enter second description"
                    rows={6}
                  />
                </div>
              </div>

              {/* Bottom Sections */}
              {tempBottomSections.map((section, index) => (
                <div key={section.id} className="space-y-4 p-4 border rounded">
                  <div>
                    <label htmlFor={`bottomTitle-${section.id}`} className="block mb-2 font-medium">Title for Section {index + 1}</label>
                    <Input
                      id={`bottomTitle-${section.id}`}
                      name="title"
                      value={section.title}
                      onChange={(e) => handleBottomSectionChange(index, e)}
                      placeholder={`Enter title for section ${index + 1}`}
                    />
                  </div>
                  <div>
                    <label htmlFor={`bottomDescription-${section.id}`} className="block mb-2 font-medium">Description for Section {index + 1}</label>
                    <Textarea
                      id={`bottomDescription-${section.id}`}
                      name="description"
                      value={section.description}
                      onChange={(e) => handleBottomSectionChange(index, e)}
                      placeholder={`Enter description for section ${index + 1}`}
                      rows={4}
                    />
                  </div>
                </div>
              ))}
            </form>
          </div>

          <div className="border-t p-4 mt-auto">
            <Button type="submit" form="sectionForm" className="w-full">
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Display Data after save */}
      {showData && (
        <Card className="p-6 space-y-12">
          {/* Main Section */}
          {(mainSection.mainTitle || mainSection.mainDescription) && (
            <div className="text-center">
              {mainSection.mainTitle && (
                <h2 className="text-3xl font-bold mb-4">{mainSection.mainTitle}</h2>
              )}
              {mainSection.mainDescription && (
                <p className="text-gray-600 max-w-3xl mx-auto">{mainSection.mainDescription}</p>
              )}
            </div>
          )}

          {/* Image Sections */}
          {imageSections.some(section => section.imagePreview || section.title) && (
            <div className="grid md:grid-cols-3 gap-8">
              {imageSections.map((section) => (
                (section.imagePreview || section.title) && (
                  <div key={section.id} className="text-center">
                    {section.imagePreview && (
                      <div className="mb-4 flex justify-center">
                        <img 
                          src={section.imagePreview} 
                          alt={section.title || 'Section image'} 
                          className="max-h-64 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    {section.title && (
                      <h3 className="text-xl font-semibold">{section.title}</h3>
                    )}
                  </div>
                )
              ))}
            </div>
          )}

          {/* Second Description */}
          {secondDescription.description && (
            <div className="text-center">
              <p className="text-gray-600 max-w-3xl mx-auto">{secondDescription.description}</p>
            </div>
          )}

          {/* Bottom Sections */}
          {bottomSections.some(section => section.title || section.description) && (
            <div className="grid md:grid-cols-3 gap-8">
              {bottomSections.map((section) => (
                (section.title || section.description) && (
                  <div key={section.id} className="bg-slate-50 p-6 rounded-lg">
                    {section.title && (
                      <h4 className="text-xl font-semibold mb-3">{section.title}</h4>
                    )}
                    {section.description && (
                      <p className="text-gray-600">{section.description}</p>
                    )}
                  </div>
                )
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default AboutUs6;