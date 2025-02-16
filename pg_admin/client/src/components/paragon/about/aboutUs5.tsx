'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface MainSectionType {
  mainTitle: string;
  mainDescription: string;
}

interface SecondSectionType {
  secondTitle: string;
  secondDescription: string;
}

interface NumberedSectionType {
  id: string;
  number: string;
  title: string;
  description: string;
}

const AboutUs5: React.FC = () => {
  const [mainSection, setMainSection] = React.useState<MainSectionType>({
    mainTitle: '',
    mainDescription: ''
  });

  const [secondSection, setSecondSection] = React.useState<SecondSectionType>({
    secondTitle: '',
    secondDescription: ''
  });

  const [numberedSections, setNumberedSections] = React.useState<NumberedSectionType[]>(
    Array(3).fill(null).map((_, index) => ({
      id: `numbered-section-${Date.now()}-${index}`,
      number: '',
      title: '',
      description: ''
    }))
  );

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [tempMainSection, setTempMainSection] = React.useState<MainSectionType>({
    mainTitle: '',
    mainDescription: ''
  });
  const [tempSecondSection, setTempSecondSection] = React.useState<SecondSectionType>({
    secondTitle: '',
    secondDescription: ''
  });
  const [tempNumberedSections, setTempNumberedSections] = React.useState<NumberedSectionType[]>(
    Array(3).fill(null).map((_, index) => ({
      id: `numbered-section-${Date.now()}-${index}`,
      number: '',
      title: '',
      description: ''
    }))
  );
  const [showData, setShowData] = React.useState(false);

  // Load data on initial mount
  React.useEffect(() => {
    const savedMainSection = localStorage.getItem('aboutUs5MainSection');
    const savedSecondSection = localStorage.getItem('aboutUs5SecondSection');
    const savedNumberedSections = localStorage.getItem('aboutUs5NumberedSections');
    
    if (savedMainSection) {
      setMainSection(JSON.parse(savedMainSection));
    }

    if (savedSecondSection) {
      setSecondSection(JSON.parse(savedSecondSection));
    }

    if (savedNumberedSections) {
      const parsed = JSON.parse(savedNumberedSections);
      const sectionsWithIds = parsed.map((section: NumberedSectionType, index: number) => ({
        ...section,
        id: section.id || `numbered-section-${Date.now()}-${index}`
      }));
      setNumberedSections(sectionsWithIds);
    }

    setShowData(!!savedMainSection || !!savedSecondSection || !!savedNumberedSections);
  }, []);

  // Save data whenever it changes
  React.useEffect(() => {
    if (showData) {
      localStorage.setItem('aboutUs5MainSection', JSON.stringify(mainSection));
      localStorage.setItem('aboutUs5SecondSection', JSON.stringify(secondSection));
      localStorage.setItem('aboutUs5NumberedSections', JSON.stringify(numberedSections));
    }
  }, [mainSection, secondSection, numberedSections, showData]);

  const handleMainSectionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTempMainSection({
      ...tempMainSection,
      [e.target.name]: e.target.value
    });
  };

  const handleSecondSectionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTempSecondSection({
      ...tempSecondSection,
      [e.target.name]: e.target.value
    });
  };

  const handleNumberedSectionChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newSections = [...tempNumberedSections];
    newSections[index] = {
      ...newSections[index],
      [e.target.name]: e.target.value
    };
    setTempNumberedSections(newSections);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMainSection(tempMainSection);
    setSecondSection(tempSecondSection);
    setNumberedSections(tempNumberedSections);
    setShowData(true);
    setIsDialogOpen(false);
  };

  const handleDialogOpen = () => {
    // Prepare temp sections with current data
    setTempMainSection({
      mainTitle: mainSection.mainTitle,
      mainDescription: mainSection.mainDescription
    });

    setTempSecondSection({
      secondTitle: secondSection.secondTitle,
      secondDescription: secondSection.secondDescription
    });

    setTempNumberedSections(numberedSections.map(section => ({
      ...section,
      id: section.id || `numbered-section-${Date.now()}-${Math.random()}`
    })));

    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={handleDialogOpen}>About Section 5</Button>
        </DialogTrigger>
        <DialogContent className="h-[90vh] max-h-[800px] max-w-[600px] flex flex-col overflow-hidden p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>About Section 5 Details</DialogTitle>
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

              {/* Second Section */}
              <div className="space-y-4 p-4 border rounded">
                <div>
                  <label htmlFor="secondTitle" className="block mb-2 font-medium">Second Title</label>
                  <Input
                    id="secondTitle"
                    name="secondTitle"
                    value={tempSecondSection.secondTitle}
                    onChange={handleSecondSectionChange}
                    placeholder="Enter second title"
                  />
                </div>
                <div>
                  <label htmlFor="secondDescription" className="block mb-2 font-medium">Second Description</label>
                  <Textarea
                    id="secondDescription"
                    name="secondDescription"
                    value={tempSecondSection.secondDescription}
                    onChange={handleSecondSectionChange}
                    placeholder="Enter second description"
                    rows={4}
                  />
                </div>
              </div>

              {/* Numbered Sections */}
              {tempNumberedSections.map((section, index) => (
                <div key={section.id} className="space-y-4 p-4 border rounded">
                  <div>
                    <label htmlFor={`number-${section.id}`} className="block mb-2 font-medium">Number</label>
                    <Input
                      id={`number-${section.id}`}
                      name="number"
                      value={section.number}
                      onChange={(e) => handleNumberedSectionChange(index, e)}
                      placeholder={`Enter number for section ${index + 1}`}
                    />
                  </div>
                  <div>
                    <label htmlFor={`title-${section.id}`} className="block mb-2 font-medium">Title</label>
                    <Input
                      id={`title-${section.id}`}
                      name="title"
                      value={section.title}
                      onChange={(e) => handleNumberedSectionChange(index, e)}
                      placeholder={`Enter title for section ${index + 1}`}
                    />
                  </div>
                  <div>
                    <label htmlFor={`description-${section.id}`} className="block mb-2 font-medium">Description</label>
                    <Textarea
                      id={`description-${section.id}`}
                      name="description"
                      value={section.description}
                      onChange={(e) => handleNumberedSectionChange(index, e)}
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

          {/* Second Section */}
          {(secondSection.secondTitle || secondSection.secondDescription) && (
            <div className="mb-12 text-center">
              {secondSection.secondTitle && (
                <h3 className="text-2xl font-semibold mb-4">{secondSection.secondTitle}</h3>
              )}
              {secondSection.secondDescription && (
                <p className="text-gray-600 max-w-3xl mx-auto">{secondSection.secondDescription}</p>
              )}
            </div>
          )}

          {/* Numbered Sections */}
          <div className="grid gap-8 md:grid-cols-3">
            {numberedSections.map((section) => (
              (section.number || section.title || section.description) ? (
                <div key={section.id} className="bg-slate-50 p-6 rounded-lg">
                  {section.number && (
                    <div className="text-4xl font-bold text-primary mb-3 opacity-50">
                      {section.number}
                    </div>
                  )}
                  {section.title && (
                    <h4 className="text-xl font-semibold mb-3">{section.title}</h4>
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

export default AboutUs5;