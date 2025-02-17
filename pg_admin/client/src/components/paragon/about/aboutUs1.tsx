'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface MainSection {
  title: string;
  description: string;
}

interface NumberedSection {
  id: string;
  number: string;
  title: string;
}

const AboutUs1: React.FC = () => {
  const [mainSection, setMainSection] = React.useState<MainSection>({ title: '', description: '' });
  const [numberedSections, setNumberedSections] = React.useState<NumberedSection[]>([]);
  const [image, setImage] = React.useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [tempMainSection, setTempMainSection] = React.useState<MainSection>({ title: '', description: '' });
  const [tempNumberedSections, setTempNumberedSections] = React.useState<NumberedSection[]>(
    Array(2).fill(null).map((_, index) => ({
      id: `section-${Date.now()}-${index}`,
      number: '',
      title: ''
    }))
  );
  const [showData, setShowData] = React.useState(false);

  // Load data on initial mount
  React.useEffect(() => {
    const savedMain = localStorage.getItem('aboutUs1MainSection');
    const savedNumbered = localStorage.getItem('aboutUs1NumberedSections');
    const savedImage = localStorage.getItem('aboutUs1Image');
    
    if (savedMain) {
      setMainSection(JSON.parse(savedMain));
      setShowData(true);
    }
    
    if (savedNumbered) {
      const parsed = JSON.parse(savedNumbered);
      const sectionsWithIds = parsed.map((section: NumberedSection, index: number) => ({
        ...section,
        id: section.id || `section-${Date.now()}-${index}`
      }));
      setNumberedSections(sectionsWithIds);
    } else {
      const initialSections = Array(2).fill(null).map((_, index) => ({
        id: `section-${Date.now()}-${index}`,
        number: '',
        title: ''
      }));
      setNumberedSections(initialSections);
    }

    if (savedImage) {
      setImage(savedImage);
    }
  }, []);

  // Save data whenever it changes
  React.useEffect(() => {
    if (showData) {
      localStorage.setItem('aboutUs1MainSection', JSON.stringify(mainSection));
      localStorage.setItem('aboutUs1NumberedSections', JSON.stringify(numberedSections));
      localStorage.setItem('aboutUs1Image', image);
    }
  }, [mainSection, numberedSections, image, showData]);

  const handleTempSectionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTempMainSection(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleTempNumberedSectionChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newSections = [...tempNumberedSections];
    newSections[index] = {
      ...newSections[index],
      [e.target.name]: e.target.value
    };
    setTempNumberedSections(newSections);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          setImage(event.target.result as string);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMainSection(tempMainSection);
    setNumberedSections(tempNumberedSections);
    setShowData(true);
    setIsDialogOpen(false);
  };

  const handleDialogOpen = () => {
    setTempMainSection({ ...mainSection });
    setTempNumberedSections(numberedSections.map(section => ({
      ...section,
      id: section.id || `section-${Date.now()}-${Math.random()}`
    })));
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={handleDialogOpen}>About Section 1</Button>
        </DialogTrigger>
        <DialogContent className="h-[90vh] max-h-[800px] max-w-[600px] flex flex-col overflow-hidden p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>About Section 1 Details</DialogTitle>
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

              {/* Numbered Sections */}
              <div className="space-y-4">
                <h3 className="font-semibold">Numbered Sections</h3>
                {tempNumberedSections.map((section, index) => (
                  <div key={section.id} className="grid grid-cols-2 gap-4 p-4 border rounded">
                    <div>
                      <label htmlFor={`number-${section.id}`} className="block mb-2 font-medium">Number</label>
                      <Input
                        id={`number-${section.id}`}
                        name="number"
                        value={section.number}
                        onChange={(e) => handleTempNumberedSectionChange(index, e)}
                        placeholder="Enter number"
                      />
                    </div>
                    <div>
                      <label htmlFor={`title-${section.id}`} className="block mb-2 font-medium">Title</label>
                      <Input
                        id={`title-${section.id}`}
                        name="title"
                        value={section.title}
                        onChange={(e) => handleTempNumberedSectionChange(index, e)}
                        placeholder="Enter title"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <h3 className="font-semibold">Image Section</h3>
                <div>
                  <label htmlFor="imageUpload" className="block mb-2 font-medium">Image</label>
                  <Input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="cursor-pointer"
                  />
                  {image && (
                    <div className="mt-2 relative h-40 w-full">
                      <Image
                        src={image}
                        alt="Section image"
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                </div>
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
            <div className="mb-8">
              <div className="max-w-2xl mx-auto text-center">
                {mainSection.title && (
                  <h2 className="text-3xl font-bold mb-4">{mainSection.title}</h2>
                )}
                {mainSection.description && (
                  <p className="text-gray-600">{mainSection.description}</p>
                )}
              </div>
            </div>
          )}

          {/* Numbered Sections Display */}
          {numberedSections.some(section => section.number || section.title) && (
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-8">
                {numberedSections.map((section) => (
                  section.number || section.title ? (
                    <div key={section.id} className="bg-slate-50 p-6 rounded-lg">
                      {section.number && (
                        <div className="text-3xl font-bold text-primary mb-2">{section.number}</div>
                      )}
                      {section.title && (
                        <h3 className="text-xl font-semibold">{section.title}</h3>
                      )}
                    </div>
                  ) : null
                ))}
              </div>
            </div>
          )}

          {/* Image Display */}
          {image && (
            <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
              <Image
                src={image}
                alt="About section image"
                fill
                className="object-cover"
              />
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default AboutUs1;