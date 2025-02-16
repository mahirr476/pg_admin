'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface AboutUsSectionType {
  title: string;
  description: string;
}

const AboutUs4: React.FC = () => {
  const [section, setSection] = React.useState<AboutUsSectionType>({
    title: '',
    description: ''
  });
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [tempSection, setTempSection] = React.useState<AboutUsSectionType>({
    title: '',
    description: ''
  });
  const [showData, setShowData] = React.useState(false);

  // Load data on initial mount
  React.useEffect(() => {
    const savedSection = localStorage.getItem('aboutUs4Section');
    
    if (savedSection) {
      const parsedSection = JSON.parse(savedSection);
      setSection(parsedSection);
      setShowData(true);
    }
  }, []);

  // Save data whenever it changes
  React.useEffect(() => {
    if (showData) {
      localStorage.setItem('aboutUs4Section', JSON.stringify(section));
    }
  }, [section, showData]);

  const handleSectionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTempSection({
      ...tempSection,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSection(tempSection);
    setShowData(true);
    setIsDialogOpen(false);
  };

  const handleDialogOpen = () => {
    // Prepare temp section with current data
    setTempSection({
      title: section.title,
      description: section.description
    });

    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={handleDialogOpen}>About Section 4</Button>
        </DialogTrigger>
        <DialogContent className="max-h-[800px] max-w-[600px] flex flex-col overflow-hidden p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>About Section 4 Details</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <form id="sectionForm" onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4 p-4 border rounded">
                <div>
                  <label htmlFor="title" className="block mb-2 font-medium">Title</label>
                  <Input
                    id="title"
                    name="title"
                    value={tempSection.title}
                    onChange={handleSectionChange}
                    placeholder="Enter title"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block mb-2 font-medium">Description</label>
                  <Textarea
                    id="description"
                    name="description"
                    value={tempSection.description}
                    onChange={handleSectionChange}
                    placeholder="Enter description"
                    rows={6}
                  />
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
        <Card className="p-8">
          {section.title && (
            <h2 className="text-3xl font-bold mb-6 text-center">{section.title}</h2>
          )}
          {section.description && (
            <p className="text-gray-600 max-w-4xl mx-auto text-center leading-relaxed">
              {section.description}
            </p>
          )}
        </Card>
      )}
    </div>
  );
};

export default AboutUs4;