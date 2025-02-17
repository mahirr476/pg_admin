'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface TitleDescSection {
  id: string;
  title: string;
  description: string;
}

const AboutUs2: React.FC = () => {
  const [sections, setSections] = React.useState<TitleDescSection[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [tempSections, setTempSections] = React.useState<TitleDescSection[]>(
    Array(2).fill(null).map((_, index) => ({
      id: `section-${Date.now()}-${index}`,
      title: '',
      description: ''
    }))
  );
  const [showData, setShowData] = React.useState(false);

  // Load data on initial mount
  React.useEffect(() => {
    const saved = localStorage.getItem('aboutUs2Sections');
    
    if (saved) {
      const parsed = JSON.parse(saved);
      const sectionsWithIds = parsed.map((section: TitleDescSection, index: number) => ({
        ...section,
        id: section.id || `section-${Date.now()}-${index}`
      }));
      setSections(sectionsWithIds);
      setShowData(true);
    } else {
      const initialSections = Array(2).fill(null).map((_, index) => ({
        id: `section-${Date.now()}-${index}`,
        title: '',
        description: ''
      }));
      setSections(initialSections);
    }
  }, []);

  // Save data whenever it changes
  React.useEffect(() => {
    if (showData) {
      localStorage.setItem('aboutUs2Sections', JSON.stringify(sections));
    }
  }, [sections, showData]);

  const handleTempSectionChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newSections = [...tempSections];
    newSections[index] = {
      ...newSections[index],
      [e.target.name]: e.target.value
    };
    setTempSections(newSections);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSections(tempSections);
    setShowData(true);
    setIsDialogOpen(false);
  };

  const handleDialogOpen = () => {
    setTempSections(sections.map(section => ({
      ...section,
      id: section.id || `section-${Date.now()}-${Math.random()}`
    })));
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={handleDialogOpen}>About Section 2</Button>
        </DialogTrigger>
        <DialogContent className="h-[90vh] max-h-[800px] max-w-[600px] flex flex-col overflow-hidden p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>About Section 2 Details</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <form id="sectionForm" onSubmit={handleSubmit} className="space-y-6">
              {/* Title/Description Sections */}
              {tempSections.map((section, index) => (
                <div key={section.id} className="space-y-4 p-4 border rounded">
                  <div>
                    <label htmlFor={`title-${section.id}`} className="block mb-2 font-medium">Title</label>
                    <Input
                      id={`title-${section.id}`}
                      name="title"
                      value={section.title}
                      onChange={(e) => handleTempSectionChange(index, e)}
                      placeholder="Enter title"
                    />
                  </div>
                  <div>
                    <label htmlFor={`description-${section.id}`} className="block mb-2 font-medium">Description</label>
                    <Textarea
                      id={`description-${section.id}`}
                      name="description"
                      value={section.description}
                      onChange={(e) => handleTempSectionChange(index, e)}
                      placeholder="Enter description"
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
        <Card className="p-6">
          <div className="grid gap-8 md:grid-cols-2">
            {sections.map((section) => (
              section.title || section.description ? (
                <div key={section.id} className="bg-slate-50 p-6 rounded-lg">
                  {section.title && (
                    <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
                  )}
                  {section.description && (
                    <p className="text-gray-600">{section.description}</p>
                  )}
                </div>
              ) : null
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AboutUs2;