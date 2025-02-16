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

const AboutCSR5: React.FC = () => {
  const [mainSection, setMainSection] = useState<MainSectionType>({
    mainTitle: '',
    mainDescription: ''
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tempMainSection, setTempMainSection] = useState<MainSectionType>({
    mainTitle: '',
    mainDescription: ''
  });
  const [showData, setShowData] = useState(false);

  // Load data on initial mount
  useEffect(() => {
    const savedMainSection = localStorage.getItem('aboutCSR5MainSection');
    
    if (savedMainSection) {
      setMainSection(JSON.parse(savedMainSection));
      setShowData(true);
    }
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    if (showData) {
      localStorage.setItem('aboutCSR5MainSection', JSON.stringify(mainSection));
    }
  }, [mainSection, showData]);

  const handleMainSectionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTempMainSection({
      ...tempMainSection,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMainSection(tempMainSection);
    setShowData(true);
    setIsDialogOpen(false);
  };

  const handleDialogOpen = () => {
    // Prepare temp section with current data
    setTempMainSection({
      mainTitle: mainSection.mainTitle,
      mainDescription: mainSection.mainDescription
    });

    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={handleDialogOpen}>CSR5 Section</Button>
        </DialogTrigger>
        <DialogContent className="max-h-[800px] max-w-[600px] flex flex-col overflow-hidden p-0">
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
                  <Textarea
                    id="mainDescription"
                    name="mainDescription"
                    value={tempMainSection.mainDescription}
                    onChange={handleMainSectionChange}
                    placeholder="Enter main description"
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
        <Card className="p-6">
          {/* Main Section */}
          <div className="text-center">
            {mainSection.mainTitle && (
              <h2 className="text-3xl font-bold mb-4">{mainSection.mainTitle}</h2>
            )}
            {mainSection.mainDescription && (
              <p className="text-gray-600 max-w-3xl mx-auto">{mainSection.mainDescription}</p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AboutCSR5;