
'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Edit, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface Section {
  id: number;
  title: string;
  description: string;
  image: string | null;
}

export default function Page() {
  const [sections, setSections] = React.useState<Section[]>(() => {
    if (typeof window !== 'undefined') {
      const savedSections = localStorage.getItem('homeSections');
      return savedSections ? JSON.parse(savedSections) : [];
    }
    return [];
  });
  
  const [editingSection, setEditingSection] = React.useState<Section | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isClient, setIsClient] = React.useState(false);
  
  const itemsPerPage = 5;

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Save to localStorage whenever sections change
  React.useEffect(() => {
    if (isClient) {
      localStorage.setItem('homeSections', JSON.stringify(sections));
    }
  }, [sections, isClient]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const imageFile = formData.get('image') as File;

    const handleImageConversion = (file: File): Promise<string | null> => {
      return new Promise((resolve) => {
        if (file && file.size > 0) {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        } else {
          resolve(null);
        }
      });
    };

    const processSection = async () => {
      const imageBase64 = await handleImageConversion(imageFile);

      if (editingSection) {
        const updatedSections = sections.map((section) =>
          section.id === editingSection.id
            ? {
                ...section,
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                image: imageBase64 || section.image,
              }
            : section
        );
        setSections(updatedSections);
        setEditingSection(null);
      } else {
        const newSection: Section = {
          id: Date.now(),
          title: formData.get('title') as string,
          description: formData.get('description') as string,
          image: imageBase64,
        };
        setSections([...sections, newSection]);
      }

      setIsDialogOpen(false);
    };

    processSection();
  };

  const handleEdit = (section: Section) => {
    setEditingSection(section);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setSections(sections.filter((section) => section.id !== id));
  };

  // Filtered and paginated sections
  const filteredSections = sections.filter(section => 
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSections.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredSections.length / itemsPerPage);

  // Reset current page if filtered results have fewer pages
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [filteredSections, currentPage, totalPages]);

  // Prevent rendering on server
  if (!isClient) {
    return null;
  }

  // Generate page numbers
  const generatePageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are 5 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Determine start and end for middle pages
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Add ellipsis if needed
      if (start > 2) {
        pages.push(-1); // -1 represents ellipsis
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis and last page if needed
      if (end < totalPages - 1) {
        pages.push(-1);
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="p-6 max-w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="relative flex-grow max-w-md mr-4">
          <Input
            type="text"
            placeholder="Search sections..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingSection(null);
              setIsDialogOpen(true);
            }}>
              Add New Section
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSection ? 'Edit Section' : 'Add New Section'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block mb-2">Title</label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  defaultValue={editingSection?.title}
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block mb-2">Description</label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingSection?.description}
                  required
                />
              </div>
              <div>
                <label htmlFor="image" className="block mb-2">Image</label>
                <Input 
                  type="file" 
                  id="image" 
                  name="image" 
                  accept="image/*" 
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingSection ? 'Update' : 'Add'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left border">Title</th>
              <th className="p-3 text-left border">Description</th>
              <th className="p-3 text-left border">Image</th>
              <th className="p-3 text-left border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((section) => (
              <tr key={section.id} className="border-b hover:bg-gray-50">
                <td className="p-3 border">{section.title}</td>
                <td className="p-3 border">{section.description}</td>
                <td className="p-3 border">
                  {section.image && (
                    <div className="relative w-40 h-16">
                      <Image
                        src={section.image}
                        alt={section.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </td>
                <td className="p-3 border">
                  <div className="flex space-x-2">
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(section)}
                    >
                      <Edit size={16} className="mr-1" /> Edit
                    </Button>
                    <Button 
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(section.id)}
                    >
                      <Trash2 size={16} className="mr-1" /> Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {filteredSections.length > 0 && (
          <div className="flex justify-center mt-4 p-4 space-x-2 items-center">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </Button>
            
            {generatePageNumbers().map((page, index) => (
              page === -1 ? (
                <span key={`ellipsis-${index}`} className="px-2">...</span>
              ) : (
                <Button
                  key={page}
                  size="sm"
                  variant={currentPage === page ? 'default' : 'outline'}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              )
            ))}
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}