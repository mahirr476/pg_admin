'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MainSection {
  title: string;
  description: string;
}

interface ImageSection {
  id: string;
  image: string;
  title: string;
  description: string;
}

const ThirdSection: React.FC = () => {
  const [mainSection, setMainSection] = React.useState<MainSection>({ title: '', description: '' });
  const [imageSections, setImageSections] = React.useState<ImageSection[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [tempMainSection, setTempMainSection] = React.useState<MainSection>({ title: '', description: '' });
  const [tempImageSections, setTempImageSections] = React.useState<ImageSection[]>(
    Array(3).fill(null).map((_, index) => ({
      id: `temp-section-${Date.now()}-${index}`,
      image: '',
      title: '',
      description: ''
    }))
  );
  const [showData, setShowData] = React.useState(false);

  // Load data on initial mount
  React.useEffect(() => {
    const savedMain = localStorage.getItem('thirdMainSection');
    const savedImages = localStorage.getItem('thirdImageSections');
    
    if (savedMain) {
      setMainSection(JSON.parse(savedMain));
      setShowData(true);
    }
    
    if (savedImages) {
      const parsed = JSON.parse(savedImages);
      const sectionsWithIds = parsed.map((section: ImageSection, index: number) => ({
        ...section,
        id: section.id || `section-${Date.now()}-${index}`
      }));
      setImageSections(sectionsWithIds);
      setShowData(true);
    } else {
      const initialSections = Array(3).fill(null).map((_, index) => ({
        id: `section-${Date.now()}-${index}`,
        image: '',
        title: '',
        description: ''
      }));
      setImageSections(initialSections);
      localStorage.setItem('thirdImageSections', JSON.stringify(initialSections));
    }
  }, []);

  // Save data whenever it changes
  React.useEffect(() => {
    if (showData) {
      localStorage.setItem('thirdMainSection', JSON.stringify(mainSection));
      localStorage.setItem('thirdImageSections', JSON.stringify(imageSections));
    }
  }, [mainSection, imageSections, showData]);

  const handleTempSectionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTempMainSection(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleTempImageSectionChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newSections = [...tempImageSections];
    newSections[index] = {
      ...newSections[index],
      [e.target.name]: e.target.value
    };
    setTempImageSections(newSections);
  };

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          const newSections = [...tempImageSections];
          newSections[index] = {
            ...newSections[index],
            image: event.target.result as string
          };
          setTempImageSections(newSections);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMainSection(tempMainSection);
    setImageSections(tempImageSections);
    setShowData(true);
    setIsDialogOpen(false);
  };

  const handleDialogOpen = () => {
    setTempMainSection({ ...mainSection });
    const sectionsWithIds = imageSections.map(section => ({
      ...section,
      id: section.id || `section-${Date.now()}-${Math.random()}`
    }));
    setTempImageSections(sectionsWithIds);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={handleDialogOpen}>Buisness Section</Button>
        </DialogTrigger>
        <DialogContent className="h-[90vh] max-h-[800px] max-w-[600px] flex flex-col overflow-hidden p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>Section Details</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <form id="sectionForm" onSubmit={handleSubmit} className="space-y-6">
              {/* Main Section */}
              <div className="space-y-4">
                <h3 className="font-semibold">Main Section</h3>
                <div>
                  <label htmlFor="title" className="block mb-2 font-medium">Title</label>
                  <Input
                    id="title"
                    name="title"
                    value={tempMainSection.title}
                    onChange={handleTempSectionChange}
                    placeholder="Enter title"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block mb-2 font-medium">Description</label>
                  <Textarea
                    id="description"
                    name="description"
                    value={tempMainSection.description}
                    onChange={handleTempSectionChange}
                    placeholder="Enter description"
                    rows={4}
                  />
                </div>
              </div>

              {/* Image Sections */}
              <div className="space-y-4">
                <h3 className="font-semibold">Image Sections</h3>
                {tempImageSections.map((section, index) => (
                  <div key={section.id} className="p-4 border rounded space-y-4">
                    <div>
                      <label htmlFor={`image-${section.id}`} className="block mb-2 font-medium">Image</label>
                      <Input
                        id={`image-${section.id}`}
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(index, e)}
                        className="cursor-pointer"
                      />
                      {section.image && (
                        <div className="mt-2 relative h-40 w-full">
                          <Image
                            src={section.image}
                            alt={`Preview ${index + 1}`}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <label htmlFor={`title-${section.id}`} className="block mb-2 font-medium">Title</label>
                      <Input
                        id={`title-${section.id}`}
                        name="title"
                        value={section.title}
                        onChange={(e) => handleTempImageSectionChange(index, e)}
                        placeholder="Enter title"
                      />
                    </div>
                    <div>
                      <label htmlFor={`description-${section.id}`} className="block mb-2 font-medium">Description</label>
                      <Textarea
                        id={`description-${section.id}`}
                        name="description"
                        value={section.description}
                        onChange={(e) => handleTempImageSectionChange(index, e)}
                        placeholder="Enter description"
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </div>
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
        <Card className="p-6">
          {/* Main Section Display */}
          {(mainSection.title || mainSection.description) && (
            <div className="mb-8 bg-slate-50 p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-slate-800">Main Section</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-md border">
                  <span className="text-sm text-slate-500">Title</span>
                  <div className="mt-1 font-medium">{mainSection.title}</div>
                </div>
                <div className="bg-white p-4 rounded-md border">
                  <span className="text-sm text-slate-500">Description</span>
                  <div className="mt-1">{mainSection.description}</div>
                </div>
              </div>
            </div>
          )}

          {/* Image Sections Display */}
          {imageSections.some(section => section.image || section.title || section.description) && (
            <div className="grid grid-cols-3 gap-6">
              {imageSections.map((section) => (
                section.image || section.title || section.description ? (
                  <div key={section.id} className="bg-white rounded-lg border overflow-hidden">
                    {section.image && (
                      <div className="relative h-48 w-full">
                        <Image
                          src={section.image}
                          alt={section.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4 space-y-2">
                      {section.title && (
                        <h4 className="font-semibold">{section.title}</h4>
                      )}
                      {section.description && (
                        <p className="text-sm text-gray-600">{section.description}</p>
                      )}
                    </div>
                  </div>
                ) : null
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default ThirdSection;