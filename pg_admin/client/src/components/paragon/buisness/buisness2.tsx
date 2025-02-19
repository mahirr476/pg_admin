"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
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
import { PlusCircle, Loader2, Edit, Trash2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define the business data interface
interface BusinessData {
  id: string;
  firstSection: {
    mainTitle: string;
    mainDescription: string;
    descriptions: string[];
  };
  secondSection: {
    leftTitle: string;
    leftDescriptions: string[];
    rightTitle: string;
    rightDescriptions: string[];
  };
  thirdSection: {
    title: string;
    descriptions: string[];
  };
}

export default function BusinessModal1() {
  const [businesses, setBusinesses] = useState<BusinessData[]>([]);
  const [currentBusiness, setCurrentBusiness] = useState<BusinessData>({
    id: '',
    firstSection: {
      mainTitle: '',
      mainDescription: '',
      descriptions: Array(5).fill('')
    },
    secondSection: {
      leftTitle: '',
      leftDescriptions: Array(3).fill(''),
      rightTitle: '',
      rightDescriptions: Array(4).fill('')
    },
    thirdSection: {
      title: '',
      descriptions: Array(5).fill('')
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load businesses from local storage on component mount
  useEffect(() => {
    const savedBusinesses = localStorage.getItem('detailedBusinesses');
    if (savedBusinesses) {
      try {
        setBusinesses(JSON.parse(savedBusinesses));
      } catch (err) {
        localStorage.removeItem('detailedBusinesses');
        setError('Failed to load saved businesses. Please re-add your entries.');
      }
    }
  }, []);

  // Save businesses to local storage whenever they change
  useEffect(() => {
    try {
      if (businesses.length > 0) {
        // Limit number of stored businesses
        const limitedBusinesses = businesses.slice(-10);
        localStorage.setItem('detailedBusinesses', JSON.stringify(limitedBusinesses));
      }
    } catch (err) {
      setError('Storage limit exceeded. Unable to save all businesses.');
    }
  }, [businesses]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Construct business data object
      const businessData: BusinessData = {
        id: currentBusiness.id || Date.now().toString(),
        firstSection: {
          mainTitle: formData.get('firstMainTitle') as string,
          mainDescription: formData.get('firstMainDescription') as string,
          descriptions: [1, 2, 3, 4, 5].map(i => 
            formData.get(`firstDescription${i}`) as string
          )
        },
        secondSection: {
          leftTitle: formData.get('leftTitle') as string,
          leftDescriptions: [1, 2, 3].map(i => 
            formData.get(`leftDescription${i}`) as string
          ),
          rightTitle: formData.get('rightTitle') as string,
          rightDescriptions: [1, 2, 3, 4].map(i => 
            formData.get(`rightDescription${i}`) as string
          )
        },
        thirdSection: {
          title: formData.get('thirdTitle') as string,
          descriptions: [1, 2, 3, 4, 5].map(i => 
            formData.get(`thirdDescription${i}`) as string
          )
        }
      };

      // Update or add business
      if (isEditing && currentBusiness.id) {
        setBusinesses(prev => 
          prev.map(b => b.id === currentBusiness.id ? businessData : b)
        );
      } else {
        // Limit total businesses
        setBusinesses(prev => {
          const updatedBusinesses = [...prev, businessData];
          return updatedBusinesses.slice(-10);
        });
      }

      // Reset state and close dialog
      setCurrentBusiness({
        id: '',
        firstSection: {
          mainTitle: '',
          mainDescription: '',
          descriptions: Array(5).fill('')
        },
        secondSection: {
          leftTitle: '',
          leftDescriptions: Array(3).fill(''),
          rightTitle: '',
          rightDescriptions: Array(4).fill('')
        },
        thirdSection: {
          title: '',
          descriptions: Array(5).fill('')
        }
      });
      setIsEditing(false);
      setOpen(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to save business. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (business: BusinessData) => {
    setCurrentBusiness(business);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    setBusinesses(prev => prev.filter(b => b.id !== id));
  };

  const handleOpenModal = () => {
    setCurrentBusiness({
      id: '',
      firstSection: {
        mainTitle: '',
        mainDescription: '',
        descriptions: Array(5).fill('')
      },
      secondSection: {
        leftTitle: '',
        leftDescriptions: Array(3).fill(''),
        rightTitle: '',
        rightDescriptions: Array(4).fill('')
      },
      thirdSection: {
        title: '',
        descriptions: Array(5).fill('')
      }
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
            Add Detailed Business
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Detailed Business' : 'Add New Detailed Business'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Section */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-lg font-semibold">First Section</h3>
                <div>
                  <Label htmlFor="firstMainTitle">Main Title</Label>
                  <Input 
                    id="firstMainTitle"
                    name="firstMainTitle"
                    placeholder="Enter main title"
                    value={currentBusiness.firstSection.mainTitle}
                    onChange={(e) => setCurrentBusiness(prev => ({
                      ...prev,
                      firstSection: {
                        ...prev.firstSection,
                        mainTitle: e.target.value
                      }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="firstMainDescription">Main Description</Label>
                  <Textarea 
                    id="firstMainDescription"
                    name="firstMainDescription"
                    placeholder="Enter main description"
                    value={currentBusiness.firstSection.mainDescription}
                    onChange={(e) => setCurrentBusiness(prev => ({
                      ...prev,
                      firstSection: {
                        ...prev.firstSection,
                        mainDescription: e.target.value
                      }
                    }))}
                    rows={4}
                  />
                </div>
                {[1, 2, 3, 4, 5].map((index) => (
                  <div key={index}>
                    <Label htmlFor={`firstDescription${index}`}>Description {index}</Label>
                    <Textarea 
                      id={`firstDescription${index}`}
                      name={`firstDescription${index}`}
                      placeholder={`Enter description ${index}`}
                      value={currentBusiness.firstSection.descriptions[index-1]}
                      onChange={(e) => setCurrentBusiness(prev => {
                        const updatedDescriptions = [...prev.firstSection.descriptions];
                        updatedDescriptions[index-1] = e.target.value;
                        return {
                          ...prev,
                          firstSection: {
                            ...prev.firstSection,
                            descriptions: updatedDescriptions
                          }
                        };
                      })}
                      rows={3}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Second Section */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-lg font-semibold">Second Section</h3>
                {/* Left Side */}
                <div className="space-y-4 border-b pb-4">
                  <div>
                    <Label htmlFor="leftTitle">Left Side Title</Label>
                    <Input 
                      id="leftTitle"
                      name="leftTitle"
                      placeholder="Enter left side title"
                      value={currentBusiness.secondSection.leftTitle}
                      onChange={(e) => setCurrentBusiness(prev => ({
                        ...prev,
                        secondSection: {
                          ...prev.secondSection,
                          leftTitle: e.target.value
                        }
                      }))}
                    />
                  </div>
                  {[1, 2, 3].map((index) => (
                    <div key={index}>
                      <Label htmlFor={`leftDescription${index}`}>Left Description {index}</Label>
                      <Textarea 
                        id={`leftDescription${index}`}
                        name={`leftDescription${index}`}
                        placeholder={`Enter left description ${index}`}
                        value={currentBusiness.secondSection.leftDescriptions[index-1]}
                        onChange={(e) => setCurrentBusiness(prev => {
                          const updatedDescriptions = [...prev.secondSection.leftDescriptions];
                          updatedDescriptions[index-1] = e.target.value;
                          return {
                            ...prev,
                            secondSection: {
                              ...prev.secondSection,
                              leftDescriptions: updatedDescriptions
                            }
                          };
                        })}
                        rows={3}
                      />
                    </div>
                  ))}
                </div>

                {/* Right Side */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="rightTitle">Right Side Title</Label>
                    <Input 
                      id="rightTitle"
                      name="rightTitle"
                      placeholder="Enter right side title"
                      value={currentBusiness.secondSection.rightTitle}
                      onChange={(e) => setCurrentBusiness(prev => ({
                        ...prev,
                        secondSection: {
                          ...prev.secondSection,
                          rightTitle: e.target.value
                        }
                      }))}
                    />
                  </div>
                  {[1, 2, 3, 4].map((index) => (
                    <div key={index}>
                      <Label htmlFor={`rightDescription${index}`}>Right Description {index}</Label>
                      <Textarea 
                        id={`rightDescription${index}`}
                        name={`rightDescription${index}`}
                        placeholder={`Enter right description ${index}`}
                        value={currentBusiness.secondSection.rightDescriptions[index-1]}
                        onChange={(e) => setCurrentBusiness(prev => {
                          const updatedDescriptions = [...prev.secondSection.rightDescriptions];
                          updatedDescriptions[index-1] = e.target.value;
                          return {
                            ...prev,
                            secondSection: {
                              ...prev.secondSection,
                              rightDescriptions: updatedDescriptions
                            }
                          };
                        })}
                        rows={3}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Third Section */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-lg font-semibold">Third Section</h3>
                <div>
                  <Label htmlFor="thirdTitle">Title</Label>
                  <Input 
                    id="thirdTitle"
                    name="thirdTitle"
                    placeholder="Enter title"
                    value={currentBusiness.thirdSection.title}
                    onChange={(e) => setCurrentBusiness(prev => ({
                      ...prev,
                      thirdSection: {
                        ...prev.thirdSection,
                        title: e.target.value
                      }
                    }))}
                  />
                </div>
                {[1, 2, 3, 4, 5].map((index) => (
                  <div key={index}>
                    <Label htmlFor={`thirdDescription${index}`}>Description {index}</Label>
                    <Textarea 
                      id={`thirdDescription${index}`}
                      name={`thirdDescription${index}`}
                      placeholder={`Enter description ${index}`}
                      value={currentBusiness.thirdSection.descriptions[index-1]}
                      onChange={(e) => setCurrentBusiness(prev => {
                        const updatedDescriptions = [...prev.thirdSection.descriptions];
                        updatedDescriptions[index-1] = e.target.value;
                        return {
                          ...prev,
                          thirdSection: {
                            ...prev.thirdSection,
                            descriptions: updatedDescriptions
                          }
                        };
                      })}
                      rows={3}
                    />
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
                  'Save Business'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
  {/* Business Table */}
  {businesses.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>First Section</TableHead>
                  <TableHead>Second Section</TableHead>
                  <TableHead>Third Section</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businesses.map((business) => (
                  <TableRow key={business.id}>
                    {/* First Section */}
                    <TableCell>
                      <div className="space-y-2">
                        <p className="font-semibold">Main Title: {business.firstSection.mainTitle}</p>
                        <p className="text-sm mb-2">Main Description: {business.firstSection.mainDescription}</p>
                        <ul className="list-disc pl-4 text-sm">
                          {business.firstSection.descriptions
                            .filter(desc => desc.trim() !== '')
                            .map((desc, index) => (
                              <li key={index}>{desc}</li>
                          ))}
                        </ul>
                      </div>
                    </TableCell>

                    {/* Second Section */}
                    <TableCell>
                      <div className="space-y-2">
                        <div>
                          <p className="font-semibold">Left Side:</p>
                          <p>Title: {business.secondSection.leftTitle}</p>
                          <ul className="list-disc pl-4 text-sm">
                            {business.secondSection.leftDescriptions
                              .filter(desc => desc.trim() !== '')
                              .map((desc, index) => (
                                <li key={index}>{desc}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-2">
                          <p className="font-semibold">Right Side:</p>
                          <p>Title: {business.secondSection.rightTitle}</p>
                          <ul className="list-disc pl-4 text-sm">
                            {business.secondSection.rightDescriptions
                              .filter(desc => desc.trim() !== '')
                              .map((desc, index) => (
                                <li key={index}>{desc}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </TableCell>

                    {/* Third Section */}
                    <TableCell>
                      <div className="space-y-2">
                        <p className="font-semibold">Title: {business.thirdSection.title}</p>
                        <ul className="list-disc pl-4 text-sm">
                          {business.thirdSection.descriptions
                            .filter(desc => desc.trim() !== '')
                            .map((desc, index) => (
                              <li key={index}>{desc}</li>
                          ))}
                        </ul>
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <div className="flex flex-col space-y-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(business)}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(business.id)}
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