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

// Define the career area data interface
interface CareerAreaEntry {
  id: string;
  firstSection: {
    title: string;
    description: string;
  };
  titleSections: {
    title: string;
  }[];
  secondSection: {
    title: string;
    description: string;
  };
  dynamicSections: {
    title: string;
    description: string;
  }[];
  finalSection: {
    title: string;
    description: string;
  };
  finalDetailSections: {
    title: string;
    description: string;
  }[];
}

export default function CareerAreaModal() {
  const [careerAreaEntries, setCareerAreaEntries] = useState<CareerAreaEntry[]>([]);
  const [currentCareerArea, setCurrentCareerArea] = useState<CareerAreaEntry>({
    id: '',
    firstSection: {
      title: '',
      description: ''
    },
    titleSections: Array(5).fill(null).map(() => ({
      title: ''
    })),
    secondSection: {
      title: '',
      description: ''
    },
    dynamicSections: [],
    finalSection: {
      title: '',
      description: ''
    },
    finalDetailSections: Array(5).fill(null).map(() => ({
      title: '',
      description: ''
    }))
  });
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load career area entries from local storage on component mount
  useEffect(() => {
    const savedCareerAreaEntries = localStorage.getItem('careerAreaEntries');
    if (savedCareerAreaEntries) {
      try {
        setCareerAreaEntries(JSON.parse(savedCareerAreaEntries));
      } catch (err) {
        localStorage.removeItem('careerAreaEntries');
        setError('Failed to load saved career area entries. Please re-add your entries.');
      }
    }
  }, []);

  // Save career area entries to local storage whenever they change
  useEffect(() => {
    try {
      if (careerAreaEntries.length > 0) {
        // Limit number of stored entries
        const limitedEntries = careerAreaEntries.slice(-10);
        localStorage.setItem('careerAreaEntries', JSON.stringify(limitedEntries));
      }
    } catch (err) {
      setError('Storage limit exceeded. Unable to save all career area entries.');
    }
  }, [careerAreaEntries]);

  // Add a new dynamic section
  const handleAddDynamicSection = () => {
    setCurrentCareerArea(prev => ({
      ...prev,
      dynamicSections: [
        ...prev.dynamicSections,
        { title: '', description: '' }
      ]
    }));
  };

  // Remove a dynamic section
  const handleRemoveDynamicSection = (indexToRemove: number) => {
    setCurrentCareerArea(prev => ({
      ...prev,
      dynamicSections: prev.dynamicSections.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Construct career area data object
      const careerAreaData: CareerAreaEntry = {
        id: currentCareerArea.id || Date.now().toString(),
        firstSection: {
          title: formData.get('firstTitle') as string,
          description: formData.get('firstDescription') as string
        },
        titleSections: [1, 2, 3, 4, 5].map(i => ({
          title: formData.get(`titleSection${i}`) as string
        })),
        secondSection: {
          title: formData.get('secondTitle') as string,
          description: formData.get('secondDescription') as string
        },
        dynamicSections: currentCareerArea.dynamicSections.map((_, index) => ({
          title: formData.get(`dynamicTitle${index}`) as string,
          description: formData.get(`dynamicDescription${index}`) as string
        })),
        finalSection: {
          title: formData.get('finalTitle') as string,
          description: formData.get('finalDescription') as string
        },
        finalDetailSections: [1, 2, 3, 4, 5].map(i => ({
          title: formData.get(`finalDetailTitle${i}`) as string,
          description: formData.get(`finalDetailDescription${i}`) as string
        }))
      };

      // Update or add career area entry
      if (isEditing && currentCareerArea.id) {
        setCareerAreaEntries(prev => 
          prev.map(b => b.id === currentCareerArea.id ? careerAreaData : b)
        );
      } else {
        // Limit total career area entries
        setCareerAreaEntries(prev => {
          const updatedEntries = [...prev, careerAreaData];
          return updatedEntries.slice(-10);
        });
      }

      // Reset state and close dialog
      setCurrentCareerArea({
        id: '',
        firstSection: {
          title: '',
          description: ''
        },
        titleSections: Array(5).fill(null).map(() => ({
          title: ''
        })),
        secondSection: {
          title: '',
          description: ''
        },
        dynamicSections: [],
        finalSection: {
          title: '',
          description: ''
        },
        finalDetailSections: Array(5).fill(null).map(() => ({
          title: '',
          description: ''
        }))
      });
      setIsEditing(false);
      setOpen(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to save career area entry. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (careerArea: CareerAreaEntry) => {
    setCurrentCareerArea(careerArea);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    setCareerAreaEntries(prev => prev.filter(b => b.id !== id));
  };

  const handleOpenModal = () => {
    setCurrentCareerArea({
      id: '',
      firstSection: {
        title: '',
        description: ''
      },
      titleSections: Array(5).fill(null).map(() => ({
        title: ''
      })),
      secondSection: {
        title: '',
        description: ''
      },
      dynamicSections: [],
      finalSection: {
        title: '',
        description: ''
      },
      finalDetailSections: Array(5).fill(null).map(() => ({
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
            Add Career Area Entry
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Career Area Entry' : 'Add New Career Area Entry'}
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
                    value={currentCareerArea.firstSection.title}
                    onChange={(e) => setCurrentCareerArea(prev => ({
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
                    value={currentCareerArea.firstSection.description}
                    onChange={(e) => setCurrentCareerArea(prev => ({
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

            {/* Title Sections */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-lg font-semibold">Title Sections</h3>
                {currentCareerArea.titleSections.map((section, index) => (
                  <div key={index}>
                    <Label htmlFor={`titleSection${index + 1}`}>Title {index + 1}</Label>
                    <Input 
                      id={`titleSection${index + 1}`}
                      name={`titleSection${index + 1}`}
                      placeholder={`Enter title ${index + 1}`}
                      value={section.title}
                      onChange={(e) => setCurrentCareerArea(prev => {
                        const updatedSections = [...prev.titleSections];
                        updatedSections[index] = {
                          title: e.target.value
                        };
                        return {
                          ...prev,
                          titleSections: updatedSections
                        };
                      })}
                    />
                  </div>
                ))}
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
                    value={currentCareerArea.secondSection.title}
                    onChange={(e) => setCurrentCareerArea(prev => ({
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
                    value={currentCareerArea.secondSection.description}
                    onChange={(e) => setCurrentCareerArea(prev => ({
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
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Dynamic Sections</h3>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handleAddDynamicSection}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Section
                  </Button>
                </div>

                {currentCareerArea.dynamicSections.map((section, index) => (
                  <div key={index} className="border rounded p-4 relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => handleRemoveDynamicSection(index)}
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>

                    <div className="space-y-2">
                      <div>
                        <Label htmlFor={`dynamicTitle${index}`}>Title</Label>
                        <Input 
                          id={`dynamicTitle${index}`}
                          name={`dynamicTitle${index}`}
                          placeholder="Enter title"
                          value={section.title}
                          onChange={(e) => setCurrentCareerArea(prev => {
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
                        <Label htmlFor={`dynamicDescription${index}`}>Description</Label>
                        <Textarea 
                          id={`dynamicDescription${index}`}
                          name={`dynamicDescription${index}`}
                          placeholder="Enter description"
                          value={section.description}
                          onChange={(e) => setCurrentCareerArea(prev => {
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
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Final Section */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-lg font-semibold">Final Section</h3>
                <div>
                  <Label htmlFor="finalTitle">Title</Label>
                  <Input 
                    id="finalTitle"
                    name="finalTitle"
                    placeholder="Enter final title"
                    value={currentCareerArea.finalSection.title}
                    onChange={(e) => setCurrentCareerArea(prev => ({
                      ...prev,
                      finalSection: {
                        ...prev.finalSection,
                        title: e.target.value
                      }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="finalDescription">Description</Label>
                  <Textarea 
                    id="finalDescription"
                    name="finalDescription"
                    placeholder="Enter final description"
                    value={currentCareerArea.finalSection.description}
                    onChange={(e) => setCurrentCareerArea(prev => ({
                      ...prev,
                      finalSection: {
                        ...prev.finalSection,
                        description: e.target.value
                      }
                    }))}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Final Detail Sections */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-lg font-semibold">Final Detail Sections</h3>
                {currentCareerArea.finalDetailSections.map((section, index) => (
                  <div key={index} className="space-y-2">
                    <div>
                      <Label htmlFor={`finalDetailTitle${index + 1}`}>Title {index + 1}</Label>
                      <Input 
                        id={`finalDetailTitle${index + 1}`}
                        name={`finalDetailTitle${index + 1}`}
                        placeholder={`Enter title ${index + 1}`}
                        value={section.title}
                        onChange={(e) => setCurrentCareerArea(prev => {
                          const updatedSections = [...prev.finalDetailSections];
                          updatedSections[index] = {
                            ...updatedSections[index],
                            title: e.target.value
                          };
                          return {
                            ...prev,
                            finalDetailSections: updatedSections
                          };
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`finalDetailDescription${index + 1}`}>Description {index + 1}</Label>
                      <Textarea 
                        id={`finalDetailDescription${index + 1}`}
                        name={`finalDetailDescription${index + 1}`}
                        placeholder={`Enter description ${index + 1}`}
                        value={section.description}
                        onChange={(e) => setCurrentCareerArea(prev => {
                          const updatedSections = [...prev.finalDetailSections];
                          updatedSections[index] = {
                            ...updatedSections[index],
                            description: e.target.value
                          };
                          return {
                            ...prev,
                            finalDetailSections: updatedSections
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
                  'Save Career Area Entry'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Career Area Entries Table */}
      {careerAreaEntries.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>First Section</TableHead>
                  <TableHead>Title Sections</TableHead>
                  <TableHead>Second Section</TableHead>
                  <TableHead>Dynamic Sections</TableHead>
                  <TableHead>Final Section</TableHead>
                  <TableHead>Final Detail Sections</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {careerAreaEntries.map((careerArea) => (
                  <TableRow key={careerArea.id}>
                    {/* First Section */}
                    <TableCell>
                      <div className="space-y-2">
                        <p className="font-semibold">Title: {careerArea.firstSection.title}</p>
                        <p className="text-sm text-gray-600">
                          Description: {careerArea.firstSection.description}
                        </p>
                      </div>
                    </TableCell>

                    {/* Title Sections */}
                    <TableCell>
                      <ul className="list-disc pl-4">
                        {careerArea.titleSections
                          .filter(section => section.title)
                          .map((section, index) => (
                            <li key={index}>{section.title}</li>
                          ))}
                      </ul>
                    </TableCell>

                    {/* Second Section */}
                    <TableCell>
                      <div className="space-y-2">
                        <p className="font-semibold">Title: {careerArea.secondSection.title}</p>
                        <p className="text-sm text-gray-600">
                          Description: {careerArea.secondSection.description}
                        </p>
                      </div>
                    </TableCell>

                    {/* Dynamic Sections */}
                    <TableCell>
                      <ul className="space-y-2">
                        {careerArea.dynamicSections
                          .filter(section => section.title || section.description)
                          .map((section, index) => (
                            <li key={index} className="border-b pb-2 last:border-b-0">
                              <p className="font-semibold">{section.title}</p>
                              <p className="text-sm text-gray-600">{section.description}</p>
                            </li>
                          ))}
                      </ul>
                    </TableCell>

                    {/* Final Section */}
                    <TableCell>
                      <div className="space-y-2">
                        <p className="font-semibold">Title: {careerArea.finalSection.title}</p>
                        <p className="text-sm text-gray-600">
                          Description: {careerArea.finalSection.description}
                        </p>
                      </div>
                    </TableCell>

                    {/* Final Detail Sections */}
                    <TableCell>
                      <ul className="space-y-2">
                        {careerArea.finalDetailSections
                          .filter(section => section.title || section.description)
                          .map((section, index) => (
                            <li key={index} className="border-b pb-2 last:border-b-0">
                              <p className="font-semibold">{section.title}</p>
                              <p className="text-sm text-gray-600">{section.description}</p>
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
                          onClick={() => handleEdit(careerArea)}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(careerArea.id)}
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