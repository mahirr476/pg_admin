'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface MainSection {
  title: string;
  description: string;
}

interface TitleDescSection {
  id: string;
  title: string;
  description: string;
}

interface MultiDescSection {
  title: string;
  descriptions: string[];
}

const SixthSection: React.FC = () => {
  const [mainSection, setMainSection] = React.useState<MainSection>({ title: '', description: '' });
  const [titleDescSections, setTitleDescSections] = React.useState<TitleDescSection[]>([]);
  const [multiDescSection, setMultiDescSection] = React.useState<MultiDescSection>({
    title: '',
    descriptions: Array(4).fill('')
  });
  
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [tempMainSection, setTempMainSection] = React.useState<MainSection>({ title: '', description: '' });
  const [tempTitleDescSections, setTempTitleDescSections] = React.useState<TitleDescSection[]>(
    Array(3).fill(null).map((_, index) => ({
      id: `section-${Date.now()}-${index}`,
      title: '',
      description: ''
    }))
  );
  const [tempMultiDescSection, setTempMultiDescSection] = React.useState<MultiDescSection>({
    title: '',
    descriptions: Array(4).fill('')
  });
  const [showData, setShowData] = React.useState(false);

  // Load data on initial mount
  React.useEffect(() => {
    const savedMain = localStorage.getItem('sixthMainSection');
    const savedTitleDesc = localStorage.getItem('sixthTitleDescSections');
    const savedMultiDesc = localStorage.getItem('sixthMultiDescSection');
    
    if (savedMain) {
      setMainSection(JSON.parse(savedMain));
      setShowData(true);
    }
    
    if (savedTitleDesc) {
      const parsed = JSON.parse(savedTitleDesc);
      const sectionsWithIds = parsed.map((section: TitleDescSection, index: number) => ({
        ...section,
        id: section.id || `section-${Date.now()}-${index}`
      }));
      setTitleDescSections(sectionsWithIds);
    } else {
      const initialSections = Array(3).fill(null).map((_, index) => ({
        id: `section-${Date.now()}-${index}`,
        title: '',
        description: ''
      }));
      setTitleDescSections(initialSections);
    }

    if (savedMultiDesc) {
      setMultiDescSection(JSON.parse(savedMultiDesc));
    }
  }, []);

  // Save data whenever it changes
  React.useEffect(() => {
    if (showData) {
      localStorage.setItem('sixthMainSection', JSON.stringify(mainSection));
      localStorage.setItem('sixthTitleDescSections', JSON.stringify(titleDescSections));
      localStorage.setItem('sixthMultiDescSection', JSON.stringify(multiDescSection));
    }
  }, [mainSection, titleDescSections, multiDescSection, showData]);

  const handleTempSectionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTempMainSection(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleTempTitleDescChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newSections = [...tempTitleDescSections];
    newSections[index] = {
      ...newSections[index],
      [e.target.name]: e.target.value
    };
    setTempTitleDescSections(newSections);
  };

  const handleTempMultiDescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempMultiDescSection(prev => ({
      ...prev,
      title: e.target.value
    }));
  };

  const handleDescriptionChange = (index: number, value: string) => {
    setTempMultiDescSection(prev => ({
      ...prev,
      descriptions: prev.descriptions.map((desc, i) => i === index ? value : desc)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMainSection(tempMainSection);
    setTitleDescSections(tempTitleDescSections);
    setMultiDescSection(tempMultiDescSection);
    setShowData(true);
    setIsDialogOpen(false);
  };

  const handleDialogOpen = () => {
    setTempMainSection({ ...mainSection });
    setTempTitleDescSections(titleDescSections.map(section => ({
      ...section,
      id: section.id || `section-${Date.now()}-${Math.random()}`
    })));
    setTempMultiDescSection({ ...multiDescSection });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={handleDialogOpen}>Ready Section</Button>
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

              {/* Title/Description Sections */}
              <div className="space-y-4">
                <h3 className="font-semibold">Title & Description Sections</h3>
                {tempTitleDescSections.map((section, index) => (
                  <div key={section.id} className="p-4 border rounded space-y-4">
                    <div>
                      <label htmlFor={`title-${section.id}`} className="block mb-2 font-medium">Title</label>
                      <Input
                        id={`title-${section.id}`}
                        name="title"
                        value={section.title}
                        onChange={(e) => handleTempTitleDescChange(index, e)}
                        placeholder="Enter title"
                      />
                    </div>
                    <div>
                      <label htmlFor={`description-${section.id}`} className="block mb-2 font-medium">Description</label>
                      <Textarea
                        id={`description-${section.id}`}
                        name="description"
                        value={section.description}
                        onChange={(e) => handleTempTitleDescChange(index, e)}
                        placeholder="Enter description"
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Multi Description Section */}
              <div className="space-y-4">
                <h3 className="font-semibold">Multiple Descriptions Section</h3>
                <div>
                  <label htmlFor="multiTitle" className="block mb-2 font-medium">Title</label>
                  <Input
                    id="multiTitle"
                    value={tempMultiDescSection.title}
                    onChange={handleTempMultiDescChange}
                    placeholder="Enter title"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block font-medium">Descriptions</label>
                  {tempMultiDescSection.descriptions.map((desc, index) => (
                    <div key={`desc-${index}`}>
                      <label htmlFor={`desc-${index}`} className="block mb-2 text-sm text-gray-600">
                        Description {index + 1}
                      </label>
                      <Textarea
                        id={`desc-${index}`}
                        value={desc}
                        onChange={(e) => handleDescriptionChange(index, e.target.value)}
                        placeholder={`Enter description ${index + 1}`}
                        rows={3}
                      />
                    </div>
                  ))}
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

          {/* Title/Description Sections Display */}
          {titleDescSections.some(section => section.title || section.description) && (
            <div className="mb-8 grid grid-cols-3 gap-6">
              {titleDescSections.map((section) => (
                section.title || section.description ? (
                  <div key={section.id} className="bg-white p-4 rounded-lg border">
                    {section.title && (
                      <h4 className="font-semibold mb-2">{section.title}</h4>
                    )}
                    {section.description && (
                      <p className="text-sm text-gray-600">{section.description}</p>
                    )}
                  </div>
                ) : null
              ))}
            </div>
          )}

          {/* Multi Description Section Display */}
          {(multiDescSection.title || multiDescSection.descriptions.some(desc => desc)) && (
            <div className="bg-white rounded-lg border p-6">
              {multiDescSection.title && (
                <h3 className="text-xl font-semibold mb-6">{multiDescSection.title}</h3>
              )}
              <div className="grid grid-cols-2 gap-4">
                {multiDescSection.descriptions.map((desc, index) => (
                  desc && (
                    <div key={`desc-${index}`} className="bg-slate-50 p-4 rounded">
                      <h5 className="font-medium mb-2">Description {index + 1}</h5>
                      <p className="text-sm text-gray-600">{desc}</p>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default SixthSection;