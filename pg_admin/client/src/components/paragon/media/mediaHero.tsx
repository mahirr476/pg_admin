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

// Define the media data interface
interface MediaEntry {
  id: string;
  firstSection: {
    firstTitle: string;
    firstDescription: string;
    secondTitle: string;
    secondDescription: string;
    dynamicEntries: {
      date: string;
      title: string;
      description: string;
    }[];
  };
}

export default function MediaModal() {
  const [mediaEntries, setMediaEntries] = useState<MediaEntry[]>([]);
  const [currentMedia, setCurrentMedia] = useState<MediaEntry>({
    id: '',
    firstSection: {
      firstTitle: '',
      firstDescription: '',
      secondTitle: '',
      secondDescription: '',
      dynamicEntries: []
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load media entries from local storage on component mount
  useEffect(() => {
    const savedMediaEntries = localStorage.getItem('mediaEntries');
    if (savedMediaEntries) {
      try {
        setMediaEntries(JSON.parse(savedMediaEntries));
      } catch (err) {
        localStorage.removeItem('mediaEntries');
        setError('Failed to load saved media entries. Please re-add your entries.');
      }
    }
  }, []);

  // Save media entries to local storage whenever they change
  useEffect(() => {
    try {
      if (mediaEntries.length > 0) {
        // Limit number of stored entries
        const limitedEntries = mediaEntries.slice(-10);
        localStorage.setItem('mediaEntries', JSON.stringify(limitedEntries));
      }
    } catch (err) {
      setError('Storage limit exceeded. Unable to save all media entries.');
    }
  }, [mediaEntries]);

  // Add a new dynamic entry
  const handleAddDynamicEntry = () => {
    setCurrentMedia(prev => ({
      ...prev,
      firstSection: {
        ...prev.firstSection,
        dynamicEntries: [
          ...prev.firstSection.dynamicEntries,
          { date: '', title: '', description: '' }
        ]
      }
    }));
  };

  // Remove a dynamic entry
  const handleRemoveDynamicEntry = (indexToRemove: number) => {
    setCurrentMedia(prev => ({
      ...prev,
      firstSection: {
        ...prev.firstSection,
        dynamicEntries: prev.firstSection.dynamicEntries.filter((_, index) => index !== indexToRemove)
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Construct media data object
      const mediaData: MediaEntry = {
        id: currentMedia.id || Date.now().toString(),
        firstSection: {
          firstTitle: formData.get('firstTitle') as string,
          firstDescription: formData.get('firstDescription') as string,
          secondTitle: formData.get('secondTitle') as string,
          secondDescription: formData.get('secondDescription') as string,
          dynamicEntries: currentMedia.firstSection.dynamicEntries.map((_, index) => ({
            date: formData.get(`dynamicDate${index}`) as string,
            title: formData.get(`dynamicTitle${index}`) as string,
            description: formData.get(`dynamicDescription${index}`) as string
          }))
        }
      };

      // Update or add media entry
      if (isEditing && currentMedia.id) {
        setMediaEntries(prev => 
          prev.map(b => b.id === currentMedia.id ? mediaData : b)
        );
      } else {
        // Limit total media entries
        setMediaEntries(prev => {
          const updatedEntries = [...prev, mediaData];
          return updatedEntries.slice(-10);
        });
      }

      // Reset state and close dialog
      setCurrentMedia({
        id: '',
        firstSection: {
          firstTitle: '',
          firstDescription: '',
          secondTitle: '',
          secondDescription: '',
          dynamicEntries: []
        }
      });
      setIsEditing(false);
      setOpen(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to save media entry. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (media: MediaEntry) => {
    setCurrentMedia(media);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    setMediaEntries(prev => prev.filter(b => b.id !== id));
  };

  const handleOpenModal = () => {
    setCurrentMedia({
      id: '',
      firstSection: {
        firstTitle: '',
        firstDescription: '',
        secondTitle: '',
        secondDescription: '',
        dynamicEntries: []
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
            Add Media Entry
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Media Entry' : 'Add New Media Entry'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Section */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-lg font-semibold">First Section</h3>
                
                {/* First Title and Description */}
                <div>
                  <Label htmlFor="firstTitle">First Title</Label>
                  <Input 
                    id="firstTitle"
                    name="firstTitle"
                    placeholder="Enter first title"
                    value={currentMedia.firstSection.firstTitle}
                    onChange={(e) => setCurrentMedia(prev => ({
                      ...prev,
                      firstSection: {
                        ...prev.firstSection,
                        firstTitle: e.target.value
                      }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="firstDescription">First Description</Label>
                  <Textarea 
                    id="firstDescription"
                    name="firstDescription"
                    placeholder="Enter first description"
                    value={currentMedia.firstSection.firstDescription}
                    onChange={(e) => setCurrentMedia(prev => ({
                      ...prev,
                      firstSection: {
                        ...prev.firstSection,
                        firstDescription: e.target.value
                      }
                    }))}
                    rows={4}
                  />
                </div>

                {/* Second Title and Description */}
                <div>
                  <Label htmlFor="secondTitle">Second Title</Label>
                  <Input 
                    id="secondTitle"
                    name="secondTitle"
                    placeholder="Enter second title"
                    value={currentMedia.firstSection.secondTitle}
                    onChange={(e) => setCurrentMedia(prev => ({
                      ...prev,
                      firstSection: {
                        ...prev.firstSection,
                        secondTitle: e.target.value
                      }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="secondDescription">Second Description</Label>
                  <Textarea 
                    id="secondDescription"
                    name="secondDescription"
                    placeholder="Enter second description"
                    value={currentMedia.firstSection.secondDescription}
                    onChange={(e) => setCurrentMedia(prev => ({
                      ...prev,
                      firstSection: {
                        ...prev.firstSection,
                        secondDescription: e.target.value
                      }
                    }))}
                    rows={4}
                  />
                </div>

                {/* Dynamic Entries Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-md font-semibold">Dynamic Entries</h4>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={handleAddDynamicEntry}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Entry
                    </Button>
                  </div>

                  {currentMedia.firstSection.dynamicEntries.map((entry, index) => (
                    <div key={index} className="border rounded p-4 relative">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => handleRemoveDynamicEntry(index)}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>

                      <div className="space-y-2">
                        <div>
                          <Label htmlFor={`dynamicDate${index}`}>Date</Label>
                          <Input 
                            id={`dynamicDate${index}`}
                            name={`dynamicDate${index}`}
                            type="date"
                            value={entry.date}
                            onChange={(e) => {
                              const newEntries = [...currentMedia.firstSection.dynamicEntries];
                              newEntries[index] = {
                                ...newEntries[index],
                                date: e.target.value
                              };
                              setCurrentMedia(prev => ({
                                ...prev,
                                firstSection: {
                                  ...prev.firstSection,
                                  dynamicEntries: newEntries
                                }
                              }));
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`dynamicTitle${index}`}>Title</Label>
                          <Input 
                            id={`dynamicTitle${index}`}
                            name={`dynamicTitle${index}`}
                            placeholder="Enter title"
                            value={entry.title}
                            onChange={(e) => {
                              const newEntries = [...currentMedia.firstSection.dynamicEntries];
                              newEntries[index] = {
                                ...newEntries[index],
                                title: e.target.value
                              };
                              setCurrentMedia(prev => ({
                                ...prev,
                                firstSection: {
                                  ...prev.firstSection,
                                  dynamicEntries: newEntries
                                }
                              }));
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`dynamicDescription${index}`}>Description</Label>
                          <Textarea 
                            id={`dynamicDescription${index}`}
                            name={`dynamicDescription${index}`}
                            placeholder="Enter description"
                            value={entry.description}
                            onChange={(e) => {
                              const newEntries = [...currentMedia.firstSection.dynamicEntries];
                              newEntries[index] = {
                                ...newEntries[index],
                                description: e.target.value
                              };
                              setCurrentMedia(prev => ({
                                ...prev,
                                firstSection: {
                                  ...prev.firstSection,
                                  dynamicEntries: newEntries
                                }
                              }));
                            }}
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
                  'Save Media Entry'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Media Entries Table */}
      {mediaEntries.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>First Section</TableHead>
                  <TableHead>Dynamic Entries</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mediaEntries.map((media) => (
                  <TableRow key={media.id}>
                    {/* First Section */}
                    <TableCell>
                      <div className="space-y-2">
                        <p className="font-semibold">First Title: {media.firstSection.firstTitle}</p>
                        <p className="text-sm text-gray-600">
                          First Description: {media.firstSection.firstDescription}
                        </p>
                        <p className="font-semibold mt-2">Second Title: {media.firstSection.secondTitle}</p>
                        <p className="text-sm text-gray-600">
                          Second Description: {media.firstSection.secondDescription}
                        </p>
                      </div>
                    </TableCell>

                    {/* Dynamic Entries */}
                    <TableCell>
                      <ul className="space-y-2">
                        {media.firstSection.dynamicEntries
                          .filter(entry => entry.title || entry.description)
                          .map((entry, index) => (
                            <li key={index} className="border-b pb-2 last:border-b-0">
                              <p className="font-semibold">{entry.date}</p>
                              <p className="text-md">{entry.title}</p>
                              <p className="text-sm text-gray-600">{entry.description}</p>
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
                          onClick={() => handleEdit(media)}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(media.id)}
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