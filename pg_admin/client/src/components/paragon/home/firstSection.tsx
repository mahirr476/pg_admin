
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, Trash2 } from 'lucide-react';
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

interface NumberedSection {
  id: string;
  number: string;
  title: string;
}

const FirstSection: React.FC = () => {
  const [mainSection, setMainSection] = React.useState<MainSection>({ title: '', description: '' });
  const [numberedSections, setNumberedSections] = React.useState<NumberedSection[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingSection, setEditingSection] = React.useState<NumberedSection | null>(null);
  const [tempMainSection, setTempMainSection] = React.useState<MainSection>({ title: '', description: '' });
  const [tempNumberedSections, setTempNumberedSections] = React.useState<NumberedSection[]>(
    Array(4).fill(null).map((_, index) => ({
      id: `temp-section-${Date.now()}-${index}`,
      number: '',
      title: ''
    }))
  );
  const [showData, setShowData] = React.useState(false);

  // Load data on initial mount
  React.useEffect(() => {
    const savedMain = localStorage.getItem('firstMainSection');
    const savedNumbered = localStorage.getItem('firstNumberedSections');
    
    if (savedMain) {
      setMainSection(JSON.parse(savedMain));
      setShowData(true);
    }
    
    if (savedNumbered) {
      const parsed = JSON.parse(savedNumbered);
      // Ensure each section has a unique ID
      const sectionsWithIds = parsed.map((section: NumberedSection, index: number) => ({
        ...section,
        id: section.id || `section-${Date.now()}-${index}`
      }));
      setNumberedSections(sectionsWithIds);
      setShowData(true);
    } else {
      // Initialize with empty sections if no data exists
      const initialSections = Array(4).fill(null).map((_, index) => ({
        id: `section-${Date.now()}-${index}`,
        number: '',
        title: ''
      }));
      setNumberedSections(initialSections);
      localStorage.setItem('firstNumberedSections', JSON.stringify(initialSections));
    }
  }, []);

  // Save data whenever it changes
  React.useEffect(() => {
    if (showData) {
      localStorage.setItem('firstMainSection', JSON.stringify(mainSection));
      localStorage.setItem('firstNumberedSections', JSON.stringify(numberedSections));
    }
  }, [mainSection, numberedSections, showData]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMainSection(tempMainSection);
    setNumberedSections(tempNumberedSections);
    setShowData(true);
    setIsDialogOpen(false);
  };

  const handleDialogOpen = () => {
    setTempMainSection({ ...mainSection });
    // Ensure IDs are preserved when copying from numberedSections
    const sectionsWithIds = numberedSections.map(section => ({
      ...section,
      id: section.id || `section-${Date.now()}-${Math.random()}`
    }));
    setTempNumberedSections(sectionsWithIds);
    setEditingSection(null);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const updatedSections = numberedSections.map(section => 
      section.id === id ? { ...section, number: '', title: '' } : section
    );
    setNumberedSections(updatedSections);
  };

  const handleEdit = (section: NumberedSection) => {
    setEditingSection(section);
    setIsDialogOpen(true);
    setTempMainSection({ ...mainSection });
    setTempNumberedSections(numberedSections.map(s => ({
      ...s,
      id: s.id || `section-${Date.now()}-${Math.random()}`
    })));
  };

  return (
    <div className="space-y-8">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={handleDialogOpen}>Hero Section</Button>
        </DialogTrigger>
        <DialogContent className="h-[90vh] max-h-[800px] max-w-[600px] flex flex-col overflow-hidden p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>
              {editingSection ? 'Edit Section' : 'Section Details'}
            </DialogTitle>
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
                  <div key={section.id} className="p-4 border rounded">
                    <div className="grid grid-cols-2 gap-4">
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
                  </div>
                ))}
              </div>
            </form>
          </div>

          <div className="border-t p-4 mt-auto">
            <Button type="submit" form="sectionForm" className="w-full">
              {editingSection ? 'Update' : 'Save'}
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

          {/* Numbered Sections Table Display */}
          {numberedSections.some(section => section.number || section.title) && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-800">Numbered Sections</h3>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="font-semibold">Number</TableHead>
                      <TableHead className="font-semibold">Title</TableHead>
                      <TableHead className="font-semibold w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {numberedSections.map((section) => (
                      <TableRow 
                        key={section.id}
                        className={section.number || section.title ? 'bg-white hover:bg-slate-50' : 'hidden'}
                      >
                        <TableCell className="font-medium">{section.number}</TableCell>
                        <TableCell>{section.title}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(section)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(section.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default FirstSection;