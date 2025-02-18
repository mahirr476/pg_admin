"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Loader2, Edit, Trash2, AlertCircle, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define the career data interface
interface CareerEntry {
  id: string;
  firstSection: {
    title: string;
    description: string;
  };
  secondSection: {
    title: string;
    description: string;
  };
  dynamicSections: {
    title: string;
    description: string;
  }[];
}

export default function CareerModal() {
  const [careerEntries, setCareerEntries] = useState<CareerEntry[]>([]);
  const [currentCareer, setCurrentCareer] = useState<CareerEntry>({
    id: '',
    firstSection: {
      title: '',
      description: ''
    },
    secondSection: {
      title: '',
      description: ''
    },
    dynamicSections: Array(6).fill(null).map(() => ({
      title: '',
      description: ''
    }))
  });
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load career entries from local storage on component mount
  useEffect(() => {
    const savedCareerEntries = localStorage.getItem('careerEntries');
    if (savedCareerEntries) {
      try {
        setCareerEntries(JSON.parse(savedCareerEntries));
      } catch (err) {
        localStorage.removeItem('careerEntries');
        setError('Failed to load saved career entries. Please re-add your entries.');
      }
    }
  }, []);

  // Save career entries to local storage whenever they change
  useEffect(() => {
    try {
      if (careerEntries.length > 0) {
        // Limit number of stored entries
        const limitedEntries = careerEntries.slice(-10);
        localStorage.setItem('careerEntries', JSON.stringify(limitedEntries));
      }
    } catch (err) {
      setError('Storage limit exceeded. Unable to save all career entries.');
    }
  }, [careerEntries]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Construct career data object
      const careerData: CareerEntry = {
        id: currentCareer.id || Date.now().toString(),
        firstSection: {
          title: formData.get('firstTitle') as string,
          description: formData.get('firstDescription') as string
        },
        secondSection: {
          title: formData.get('secondTitle') as string,
          description: formData.get('secondDescription') as string
        },
        dynamicSections: currentCareer.dynamicSections.map((_, index) => ({
          title: formData.get(`dynamicTitle${index}`) as string,
          description: formData.get(`dynamicDescription${index}`) as string
        }))
      };

      // Update or add career entry
      if (isEditing && currentCareer.id) {
        setCareerEntries(prev => 
          prev.map(b => b.id === currentCareer.id ? careerData : b)
        );
      } else {
        // Limit total career entries
        setCareerEntries(prev => {
          const updatedEntries = [...prev, careerData];
          return updatedEntries.slice(-10);
        });
      }

      // Reset state and close dialog
      setCurrentCareer({
        id: '',
        firstSection: {
          title: '',
          description: ''
        },
        secondSection: {
          title: '',
          description: ''
        },
        dynamicSections: Array(6).fill(null).map(() => ({
          title: '',
          description: ''
        }))
      });
      setIsEditing(false);
      setOpen(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to save career entry. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (career: CareerEntry) => {
    setCurrentCareer(career);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    setCareerEntries(prev => prev.filter(b => b.id !== id));
  };

  const handleOpenModal = () => {
    setCurrentCareer({
      id: '',
      firstSection: {
        title: '',
        description: ''
      },
      secondSection: {
        title: '',
        description: ''
      },
      dynamicSections: Array(6).fill(null).map(() => ({
        title: '',
        description: ''
      }))
    });
    setIsEditing(false);
    setOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={handleOpenModal} className="gap-2">
            <PlusCircle size={16} />
            Add Career Entry
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Career Entry' : 'Add New Career Entry'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Section */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-lg font-semibold">First Section</h3>
                <div>
                  <Label htmlFor="firstTitle">Title</Label>
                  <Input 
                    id="firstTitle"
                    name="firstTitle"
                    placeholder="Enter first title"
                    value={currentCareer.firstSection.title}
                    onChange={(e) => setCurrentCareer(prev => ({
                      ...prev,
                      firstSection: {
                        ...prev.firstSection,
                        title: e.target.value
                      }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="firstDescription">Description</Label>
                  <Textarea 
                    id="firstDescription"
                    name="firstDescription"
                    placeholder="Enter first description"
                    value={currentCareer.firstSection.description}
                    onChange={(e) => setCurrentCareer(prev => ({
                      ...prev,
                      firstSection: {
                        ...prev.firstSection,
                        description: e.target.value
                      }
                    }))}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Second Section */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-lg font-semibold">Second Section</h3>
                <div>
                  <Label htmlFor="secondTitle">Title</Label>
                  <Input 
                    id="secondTitle"
                    name="secondTitle"
                    placeholder="Enter second title"
                    value={currentCareer.secondSection.title}
                    onChange={(e) => setCurrentCareer(prev => ({
                      ...prev,
                      secondSection: {
                        ...prev.secondSection,
                        title: e.target.value
                      }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="secondDescription">Description</Label>
                  <Textarea 
                    id="secondDescription"
                    name="secondDescription"
                    placeholder="Enter second description"
                    value={currentCareer.secondSection.description}
                    onChange={(e) => setCurrentCareer(prev => ({
                      ...prev,
                      secondSection: {
                        ...prev.secondSection,
                        description: e.target.value
                      }
                    }))}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Dynamic Sections */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-lg font-semibold">Dynamic Sections</h3>
                {currentCareer.dynamicSections.map((section, index) => (
                  <div key={index} className="space-y-4">
                    <div>
                      <Label htmlFor={`dynamicTitle${index}`}>Title {index + 1}</Label>
                      <Input 
                        id={`dynamicTitle${index}`}
                        name={`dynamicTitle${index}`}
                        placeholder={`Enter title for section ${index + 1}`}
                        value={section.title}
                        onChange={(e) => setCurrentCareer(prev => {
                          const updatedSections = [...prev.dynamicSections];
                          updatedSections[index] = {
                            ...updatedSections[index],
                            title: e.target.value
                          };
                          return {
                            ...prev,
                            dynamicSections: updatedSections
                          };
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`dynamicDescription${index}`}>Description {index + 1}</Label>
                      <Textarea 
                        id={`dynamicDescription${index}`}
                        name={`dynamicDescription${index}`}
                        placeholder={`Enter description for section ${index + 1}`}
                        value={section.description}
                        onChange={(e) => setCurrentCareer(prev => {
                          const updatedSections = [...prev.dynamicSections];
                          updatedSections[index] = {
                            ...updatedSections[index],
                            description: e.target.value
                          };
                          return {
                            ...prev,
                            dynamicSections: updatedSections
                          };
                        })}
                        rows={4}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Career Entry'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Career Entries Table */}
      {careerEntries.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>First Section</TableHead>
                  <TableHead>Second Section</TableHead>
                  <TableHead>Dynamic Sections</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {careerEntries.map((career) => (
                  <TableRow key={career.id}>
                    {/* First Section */}
                    <TableCell>
                      <div className="space-y-2">
                        <p className="font-semibold">Title: {career.firstSection.title}</p>
                        <p className="text-sm text-gray-600">
                          Description: {career.firstSection.description}
                        </p>
                      </div>
                    </TableCell>

                    {/* Second Section */}
                    <TableCell>
                      <div className="space-y-2">
                        <p className="font-semibold">Title: {career.secondSection.title}</p>
                        <p className="text-sm text-gray-600">
                          Description: {career.secondSection.description}
                        </p>
                      </div>
                    </TableCell>

                    {/* Dynamic Sections */}
                    <TableCell>
                      <ul className="space-y-2">
                        {career.dynamicSections
                          .filter(section => section.title || section.description)
                          .map((section, index) => (
                            <li key={index} className="border-b pb-2 last:border-b-0">
                              <p className="font-semibold">Title: {section.title}</p>
                              <p className="text-sm text-gray-600">
                                Description: {section.description}
                              </p>
                            </li>
                          ))}
                      </ul>
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <div className="flex flex-col space-y-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(career)}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(career.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}