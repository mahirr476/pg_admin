'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface MainSectionType {
  mainTitle: string;
  mainDescription: string;
}

interface SectionType {
  id: string;
  number: string;
  title: string;
}

const AboutCSR4: React.FC = () => {
  const [mainSection, setMainSection] = useState<MainSectionType>({
    mainTitle: '',
    mainDescription: ''
  });

  const [sections, setSections] = useState<SectionType[]>(
    Array(8).fill(null).map((_, index) => ({
      id: `section-${Date.now()}-${index}`,
      number: '',
      title: ''
    }))
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tempMainSection, setTempMainSection] = useState<MainSectionType>({
    mainTitle: '',
    mainDescription: ''
  });
  const [tempSections, setTempSections] = useState<SectionType[]>(
    Array(8).fill(null).map((_, index) => ({
      id: `section-${Date.now()}-${index}`,
      number: '',
      title: ''
    }))
  );
  const [showData, setShowData] = useState(false);

  // Load data on initial mount
  useEffect(() => {
    const savedMainSection = localStorage.getItem('aboutCSR4MainSection');
    const savedSections = localStorage.getItem('aboutCSR4Sections');
    
    if (savedMainSection) {
      setMainSection(JSON.parse(savedMainSection));
    }

    if (savedSections) {
      const parsed = JSON.parse(savedSections);
      const sectionsWithIds = parsed.map((section: SectionType, index: number) => ({
        ...section,
        id: section.id || `section-${Date.now()}-${index}`
      }));
      setSections(sectionsWithIds);
    }

    setShowData(!!savedMainSection || !!savedSections);
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    if (showData) {
      localStorage.setItem('aboutCSR4MainSection', JSON.stringify(mainSection));
      localStorage.setItem('aboutCSR4Sections', JSON.stringify(sections));
    }
  }, [mainSection, sections, showData]);

  const handleMainSectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempMainSection({
      ...tempMainSection,
      [e.target.name]: e.target.value
    });
  };

  const handleSectionChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newSections = [...tempSections];
    newSections[index] = {
      ...newSections[index],
      [e.target.name]: e.target.value
    };
    setTempSections(newSections);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMainSection(tempMainSection);
    setSections(tempSections);
    setShowData(true);
    setIsDialogOpen(false);
  };

  const handleDialogOpen = () => {
    // Prepare temp sections with current data
    setTempMainSection({
      mainTitle: mainSection.mainTitle,
      mainDescription: mainSection.mainDescription
    });

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
          <Button onClick={handleDialogOpen}>CSR4 Section</Button>
        </DialogTrigger>
        <DialogContent className="h-[90vh] max-h-[800px] max-w-[800px] flex flex-col overflow-hidden p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>About Section Details</DialogTitle>
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
                  <Input
                    id="mainDescription"
                    name="mainDescription"
                    value={tempMainSection.mainDescription}
                    onChange={handleMainSectionChange}
                    placeholder="Enter main description"
                  />
                </div>
              </div>

              {/* Additional Sections */}
              {tempSections.map((section, index) => (
                <div key={section.id} className="space-y-4 p-4 border rounded">
                  <div>
                    <label htmlFor={`number-${section.id}`} className="block mb-2 font-medium">Section {index + 1} Number</label>
                    <Input
                      id={`number-${section.id}`}
                      name="number"
                      value={section.number}
                      onChange={(e) => handleSectionChange(index, e)}
                      placeholder={`Enter section ${index + 1} number`}
                    />
                  </div>
                  <div>
                    <label htmlFor={`title-${section.id}`} className="block mb-2 font-medium">Section {index + 1} Title</label>
                    <Input
                      id={`title-${section.id}`}
                      name="title"
                      value={section.title}
                      onChange={(e) => handleSectionChange(index, e)}
                      placeholder={`Enter section ${index + 1} title`}
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
          {/* Main Section */}
          {(mainSection.mainTitle || mainSection.mainDescription) && (
            <div className="mb-12 text-center">
              {mainSection.mainTitle && (
                <h2 className="text-3xl font-bold mb-4">{mainSection.mainTitle}</h2>
              )}
              {mainSection.mainDescription && (
                <p className="text-gray-600 max-w-3xl mx-auto">{mainSection.mainDescription}</p>
              )}
            </div>
          )}

          {/* Additional Sections */}
          <div className="grid gap-8 md:grid-cols-4">
            {sections.map((section) => (
              (section.number || section.title) ? (
                <div key={section.id} className="bg-slate-50 p-6 rounded-lg text-center">
                  {section.number && (
                    <div className="text-4xl font-bold text-primary mb-3 opacity-50">
                      {section.number}
                    </div>
                  )}
                  {section.title && (
                    <h3 className="text-xl font-semibold">{section.title}</h3>
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

export default AboutCSR4;