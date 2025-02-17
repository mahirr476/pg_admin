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

interface ImageSection {
  image: string;
  title: string;
  description: string;
}

const FifthSection: React.FC = () => {
  const [mainSection, setMainSection] = React.useState<MainSection>({ title: '', description: '' });
  const [imageSection, setImageSection] = React.useState<ImageSection>({
    image: '',
    title: '',
    description: ''
  });
  
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [tempMainSection, setTempMainSection] = React.useState<MainSection>({ title: '', description: '' });
  const [tempImageSection, setTempImageSection] = React.useState<ImageSection>({
    image: '',
    title: '',
    description: ''
  });
  const [showData, setShowData] = React.useState(false);

  // Load data on initial mount
  React.useEffect(() => {
    const savedMain = localStorage.getItem('fifthMainSection');
    const savedImage = localStorage.getItem('fifthImageSection');
    
    if (savedMain) {
      setMainSection(JSON.parse(savedMain));
      setShowData(true);
    }
    
    if (savedImage) {
      setImageSection(JSON.parse(savedImage));
      setShowData(true);
    }
  }, []);

  // Save data whenever it changes
  React.useEffect(() => {
    if (showData) {
      localStorage.setItem('fifthMainSection', JSON.stringify(mainSection));
      localStorage.setItem('fifthImageSection', JSON.stringify(imageSection));
    }
  }, [mainSection, imageSection, showData]);

  const handleTempSectionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTempMainSection(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleTempImageSectionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTempImageSection(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          setTempImageSection(prev => ({
            ...prev,
            image: event.target.result as string
          }));
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMainSection(tempMainSection);
    setImageSection(tempImageSection);
    setShowData(true);
    setIsDialogOpen(false);
  };

  const handleDialogOpen = () => {
    setTempMainSection({ ...mainSection });
    setTempImageSection({ ...imageSection });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={handleDialogOpen}>Update Section</Button>
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

              {/* Image Section */}
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
                  {tempImageSection.image && (
                    <div className="mt-2 relative h-40 w-full">
                      <Image
                        src={tempImageSection.image}
                        alt="Section image"
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label htmlFor="imageTitle" className="block mb-2 font-medium">Title</label>
                  <Input
                    id="imageTitle"
                    name="title"
                    value={tempImageSection.title}
                    onChange={handleTempImageSectionChange}
                    placeholder="Enter title"
                  />
                </div>
                <div>
                  <label htmlFor="imageDescription" className="block mb-2 font-medium">Description</label>
                  <Textarea
                    id="imageDescription"
                    name="description"
                    value={tempImageSection.description}
                    onChange={handleTempImageSectionChange}
                    placeholder="Enter description"
                    rows={4}
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

          {/* Image Section Display */}
          {(imageSection.image || imageSection.title || imageSection.description) && (
            <div className="bg-white rounded-lg border overflow-hidden">
              {imageSection.image && (
                <div className="relative h-64 w-full">
                  <Image
                    src={imageSection.image}
                    alt={imageSection.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                {imageSection.title && (
                  <h3 className="text-xl font-semibold mb-4">{imageSection.title}</h3>
                )}
                {imageSection.description && (
                  <p className="text-gray-600">{imageSection.description}</p>
                )}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default FifthSection;