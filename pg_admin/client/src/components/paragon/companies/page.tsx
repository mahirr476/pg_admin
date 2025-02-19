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

// Define the company data interface
interface CompanyData {
  id: string;
  heroImage: string;
  heroTitle: string;
  heroDescription: string;
  middleSection: {
    leftTitle: string;
    leftDescription: string;
    rightTitles: string[];
    rightNumbers: string[];
    rightDescriptions: string[];
  };
  bottomSection: {
    title: string;
    description: string;
  };
  finalSection: {
    titles: string[];
    numbers: string[];
  };
}

export default function CompanyModal() {
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [currentCompany, setCurrentCompany] = useState<CompanyData>({
    id: '',
    heroImage: '',
    heroTitle: '',
    heroDescription: '',
    middleSection: {
      leftTitle: '',
      leftDescription: '',
      rightTitles: Array(4).fill(''),
      rightNumbers: Array(2).fill(''),
      rightDescriptions: Array(2).fill('')
    },
    bottomSection: {
      title: '',
      description: ''
    },
    finalSection: {
      titles: Array(3).fill(''),
      numbers: Array(3).fill('')
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load companies from local storage on component mount
  useEffect(() => {
    const savedCompanies = localStorage.getItem('companyData');
    if (savedCompanies) {
      try {
        setCompanies(JSON.parse(savedCompanies));
      } catch (err) {
        localStorage.removeItem('companyData');
        setError('Failed to load saved companies. Please re-add your entries.');
      }
    }
  }, []);

  // Save companies to local storage whenever they change
  useEffect(() => {
    try {
      if (companies.length > 0) {
        // Limit number of stored companies
        const limitedCompanies = companies.slice(-10);
        localStorage.setItem('companyData', JSON.stringify(limitedCompanies));
      }
    } catch (err) {
      setError('Storage limit exceeded. Unable to save all companies.');
    }
  }, [companies]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Handle image upload
      let heroImage = currentCompany.heroImage;
      const imageFile = formData.get('heroImage') as File;
      if (imageFile && imageFile.size > 0) {
        heroImage = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(imageFile);
        });
      }

      // Construct company data object
      const companyData: CompanyData = {
        id: currentCompany.id || Date.now().toString(),
        heroImage,
        heroTitle: formData.get('heroTitle') as string,
        heroDescription: formData.get('heroDescription') as string,
        middleSection: {
          leftTitle: formData.get('leftTitle') as string,
          leftDescription: formData.get('leftDescription') as string,
          rightTitles: [1, 2, 3, 4].map(i => formData.get(`rightTitle${i}`) as string),
          rightNumbers: [1, 2].map(i => formData.get(`rightNumber${i}`) as string),
          rightDescriptions: [1, 2].map(i => formData.get(`rightDescription${i}`) as string)
        },
        bottomSection: {
          title: formData.get('bottomTitle') as string,
          description: formData.get('bottomDescription') as string
        },
        finalSection: {
          titles: [1, 2, 3].map(i => formData.get(`finalTitle${i}`) as string),
          numbers: [1, 2, 3].map(i => formData.get(`finalNumber${i}`) as string)
        }
      };

      // Update or add company
      if (isEditing && currentCompany.id) {
        setCompanies(prev => 
          prev.map(b => b.id === currentCompany.id ? companyData : b)
        );
      } else {
        // Limit total companies
        setCompanies(prev => {
          const updatedCompanies = [...prev, companyData];
          return updatedCompanies.slice(-10);
        });
      }

      // Reset state and close dialog
      setCurrentCompany({
        id: '',
        heroImage: '',
        heroTitle: '',
        heroDescription: '',
        middleSection: {
          leftTitle: '',
          leftDescription: '',
          rightTitles: Array(4).fill(''),
          rightNumbers: Array(2).fill(''),
          rightDescriptions: Array(2).fill('')
        },
        bottomSection: {
          title: '',
          description: ''
        },
        finalSection: {
          titles: Array(3).fill(''),
          numbers: Array(3).fill('')
        }
      });
      setIsEditing(false);
      setOpen(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to save company. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (company: CompanyData) => {
    setCurrentCompany(company);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    setCompanies(prev => prev.filter(b => b.id !== id));
  };

  const handleOpenModal = () => {
    setCurrentCompany({
      id: '',
      heroImage: '',
      heroTitle: '',
      heroDescription: '',
      middleSection: {
        leftTitle: '',
        leftDescription: '',
        rightTitles: Array(4).fill(''),
        rightNumbers: Array(2).fill(''),
        rightDescriptions: Array(2).fill('')
      },
      bottomSection: {
        title: '',
        description: ''
      },
      finalSection: {
        titles: Array(3).fill(''),
        numbers: Array(3).fill('')
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
            Add Company
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Company' : 'Add New Company'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hero Section */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-lg font-semibold">Hero Section</h3>
                <div>
                  <Label htmlFor="heroImage">Hero Image</Label>
                  <Input 
                    id="heroImage" 
                    name="heroImage"
                    type="file" 
                    accept="image/*"
                  />
                  {currentCompany.heroImage && (
                    <div className="mt-4 relative w-full h-64">
                      <Image 
                        src={currentCompany.heroImage} 
                        alt="Preview" 
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="heroTitle">Hero Title</Label>
                  <Input 
                    id="heroTitle" 
                    name="heroTitle"
                    placeholder="Enter hero title"
                    value={currentCompany.heroTitle}
                    onChange={(e) => setCurrentCompany(prev => ({
                      ...prev,
                      heroTitle: e.target.value
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="heroDescription">Hero Description</Label>
                  <Textarea 
                    id="heroDescription"
                    name="heroDescription"
                    placeholder="Enter hero description"
                    value={currentCompany.heroDescription}
                    onChange={(e) => setCurrentCompany(prev => ({
                      ...prev,
                      heroDescription: e.target.value
                    }))}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Middle Section */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-lg font-semibold">Middle Section</h3>
                {/* Left Side */}
                <div className="space-y-4 border-b pb-4">
                  <div>
                    <Label htmlFor="leftTitle">Left Side Title</Label>
                    <Input 
                      id="leftTitle"
                      name="leftTitle"
                      placeholder="Enter left side title"
                      value={currentCompany.middleSection.leftTitle}
                      onChange={(e) => setCurrentCompany(prev => ({
                        ...prev,
                        middleSection: {
                          ...prev.middleSection,
                          leftTitle: e.target.value
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="leftDescription">Left Side Description</Label>
                    <Textarea 
                      id="leftDescription"
                      name="leftDescription"
                      placeholder="Enter left side description"
                      value={currentCompany.middleSection.leftDescription}
                      onChange={(e) => setCurrentCompany(prev => ({
                        ...prev,
                        middleSection: {
                          ...prev.middleSection,
                          leftDescription: e.target.value
                        }
                      }))}
                      rows={4}
                    />
                  </div>
                </div>

                {/* Right Side */}
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((index) => (
                    <div key={index}>
                      <Label htmlFor={`rightTitle${index}`}>Right Title {index}</Label>
                      <Input 
                        id={`rightTitle${index}`}
                        name={`rightTitle${index}`}
                        placeholder={`Enter right title ${index}`}
                        value={currentCompany.middleSection.rightTitles[index-1]}
                        onChange={(e) => setCurrentCompany(prev => {
                          const updatedTitles = [...prev.middleSection.rightTitles];
                          updatedTitles[index-1] = e.target.value;
                          return {
                            ...prev,
                            middleSection: {
                              ...prev.middleSection,
                              rightTitles: updatedTitles
                            }
                          };
                        })}
                      />
                    </div>
                  ))}
                  {[1, 2].map((index) => (
                    <div key={index}>
                      <Label htmlFor={`rightNumber${index}`}>Right Number {index}</Label>
                      <Input 
                        id={`rightNumber${index}`}
                        name={`rightNumber${index}`}
                        placeholder={`Enter right number ${index}`}
                        value={currentCompany.middleSection.rightNumbers[index-1]}
                        onChange={(e) => setCurrentCompany(prev => {
                          const updatedNumbers = [...prev.middleSection.rightNumbers];
                          updatedNumbers[index-1] = e.target.value;
                          return {
                            ...prev,
                            middleSection: {
                              ...prev.middleSection,
                              rightNumbers: updatedNumbers
                            }
                          };
                        })}
                      />
                    </div>
                  ))}
                  {[1, 2].map((index) => (
                    <div key={index}>
                      <Label htmlFor={`rightDescription${index}`}>Right Description {index}</Label>
                      <Textarea 
                        id={`rightDescription${index}`}
                        name={`rightDescription${index}`}
                        placeholder={`Enter right description ${index}`}
                        value={currentCompany.middleSection.rightDescriptions[index-1]}
                        onChange={(e) => setCurrentCompany(prev => {
                          const updatedDescriptions = [...prev.middleSection.rightDescriptions];
                          updatedDescriptions[index-1] = e.target.value;
                          return {
                            ...prev,
                            middleSection: {
                              ...prev.middleSection,
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

            {/* Bottom Section */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-lg font-semibold">Bottom Section</h3>
                <div>
                  <Label htmlFor="bottomTitle">Title</Label>
                  <Input 
                    id="bottomTitle"
                    name="bottomTitle"
                    placeholder="Enter bottom title"
                    value={currentCompany.bottomSection.title}
                    onChange={(e) => setCurrentCompany(prev => ({
                      ...prev,
                      bottomSection: {
                        ...prev.bottomSection,
                        title: e.target.value
                      }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="bottomDescription">Description</Label>
                  <Textarea 
                    id="bottomDescription"
                    name="bottomDescription"
                    placeholder="Enter bottom description"
                    value={currentCompany.bottomSection.description}
                    onChange={(e) => setCurrentCompany(prev => ({
                      ...prev,
                      bottomSection: {
                        ...prev.bottomSection,
                        description: e.target.value
                      }
                    }))}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Final Section */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-lg font-semibold">Final Section</h3>
                {[1, 2, 3].map((index) => (
                  <div key={index} className="space-y-2">
                    <div>
                      <Label htmlFor={`finalTitle${index}`}>Title {index}</Label>
                      <Input 
                        id={`finalTitle${index}`}
                        name={`finalTitle${index}`}
                        placeholder={`Enter title ${index}`}
                        value={currentCompany.finalSection.titles[index-1]}
                        onChange={(e) => setCurrentCompany(prev => {
                          const updatedTitles = [...prev.finalSection.titles];
                          updatedTitles[index-1] = e.target.value;
                          return {
                            ...prev,
                            finalSection: {
                              ...prev.finalSection,
                              titles: updatedTitles
                            }
                          };
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`finalNumber${index}`}>Number {index}</Label>
                      <Input 
                        id={`finalNumber${index}`}
                        name={`finalNumber${index}`}
                        placeholder={`Enter number ${index}`}
                        value={currentCompany.finalSection.numbers[index-1]}
                        onChange={(e) => setCurrentCompany(prev => {
                          const updatedNumbers = [...prev.finalSection.numbers];
                          updatedNumbers[index-1] = e.target.value;
                          return {
                            ...prev,
                            finalSection: {
                              ...prev.finalSection,
                              numbers: updatedNumbers
                            }
                          };
                        })}
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
                  'Save Company'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Company Table */}
      {companies.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hero Section</TableHead>
                  <TableHead>Middle Section</TableHead>
                  <TableHead>Bottom Section</TableHead>
                  <TableHead>Final Section</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company.id}>
                    {/* Hero Section */}
                    <TableCell>
                      {company.heroImage && (
                        <div className="relative w-24 h-24">
                          <Image 
                            src={company.heroImage} 
                            alt="Hero Image" 
                            fill 
                            className="object-cover rounded"
                          />
                        </div>
                      )}
                      <p className="font-semibold mt-2">{company.heroTitle}</p>
                      <p className="text-sm text-gray-600">{company.heroDescription}</p>
                    </TableCell>

                    {/* Middle Section */}
                    <TableCell>
                      <div className="space-y-2">
                        <p className="font-semibold">Left Side:</p>
                        <p>Title: {company.middleSection.leftTitle}</p>
                        <p>Description: {company.middleSection.leftDescription}</p>
                        
                        <p className="font-semibold mt-2">Right Side:</p>
                        <ul className="list-disc pl-4">
                          {company.middleSection.rightTitles
                            .filter(title => title.trim() !== '')
                            .map((title, index) => (
                              <li key={index}>
                                {title}
                                {company.middleSection.rightNumbers[index] && (
                                  <span className="ml-2 text-sm text-gray-600">
                                    (Number: {company.middleSection.rightNumbers[index]})
                                  </span>
                                )}
                                {company.middleSection.rightDescriptions[index] && (
                                  <p className="text-sm text-gray-600">
                                    {company.middleSection.rightDescriptions[index]}
                                  </p>
                                )}
                              </li>
                          ))}
                        </ul>
                      </div>
                    </TableCell>

                    {/* Bottom Section */}
                    <TableCell>
                      <p className="font-semibold">{company.bottomSection.title}</p>
                      <p className="text-sm text-gray-600">{company.bottomSection.description}</p>
                    </TableCell>

                    {/* Final Section */}
                    <TableCell>
                      <ul className="space-y-2">
                        {company.finalSection.titles
                          .filter(title => title.trim() !== '')
                          .map((title, index) => (
                            <li key={index}>
                              <span className="font-semibold">{title}</span>
                              {company.finalSection.numbers[index] && (
                                <span className="ml-2 text-sm text-gray-600">
                                  (Number: {company.finalSection.numbers[index]})
                                </span>
                              )}
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
                          onClick={() => handleEdit(company)}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(company.id)}
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