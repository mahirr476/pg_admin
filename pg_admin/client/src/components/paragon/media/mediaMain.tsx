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
import { PlusCircle, Loader2, Edit, Trash2, AlertCircle, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define the media data interface
interface MediaEntry {
  id: string;
  secondSection: {
    firstTitle: string;
    firstDescription: string;
    videoEntries: {
      videoUrl: string;
      title: string;
      description: string;
    }[];
    secondTitle: string;
    secondDescription: string;
    imageEntries: {
      imageUrl: string;
      date: string;
      title: string;
      description: string;
    }[];
  };
}

export default function MediaModal1() {
  const [mediaEntries, setMediaEntries] = useState<MediaEntry[]>([]);
  const [currentMedia, setCurrentMedia] = useState<MediaEntry>({
    id: '',
    secondSection: {
      firstTitle: '',
      firstDescription: '',
      videoEntries: [],
      secondTitle: '',
      secondDescription: '',
      imageEntries: []
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load media entries from local storage on component mount
  useEffect(() => {
    const savedMediaEntries = localStorage.getItem('mediaEntriesSecondSection');
    if (savedMediaEntries) {
      try {
        setMediaEntries(JSON.parse(savedMediaEntries));
      } catch (err) {
        localStorage.removeItem('mediaEntriesSecondSection');
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
        localStorage.setItem('mediaEntriesSecondSection', JSON.stringify(limitedEntries));
      }
    } catch (err) {
      setError('Storage limit exceeded. Unable to save all media entries.');
    }
  }, [mediaEntries]);

  // Add a new video entry
  const handleAddVideoEntry = () => {
    setCurrentMedia(prev => ({
      ...prev,
      secondSection: {
        ...prev.secondSection,
        videoEntries: [
          ...prev.secondSection.videoEntries,
          { videoUrl: '', title: '', description: '' }
        ]
      }
    }));
  };

  // Remove a video entry
  const handleRemoveVideoEntry = (indexToRemove: number) => {
    setCurrentMedia(prev => ({
      ...prev,
      secondSection: {
        ...prev.secondSection,
        videoEntries: prev.secondSection.videoEntries.filter((_, index) => index !== indexToRemove)
      }
    }));
  };

  // Add a new image entry
  const handleAddImageEntry = () => {
    setCurrentMedia(prev => ({
      ...prev,
      secondSection: {
        ...prev.secondSection,
        imageEntries: [
          ...prev.secondSection.imageEntries,
          { imageUrl: '', date: '', title: '', description: '' }
        ]
      }
    }));
  };

  // Remove an image entry
  const handleRemoveImageEntry = (indexToRemove: number) => {
    setCurrentMedia(prev => ({
      ...prev,
      secondSection: {
        ...prev.secondSection,
        imageEntries: prev.secondSection.imageEntries.filter((_, index) => index !== indexToRemove)
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
        secondSection: {
          firstTitle: formData.get('firstTitle') as string,
          firstDescription: formData.get('firstDescription') as string,
          videoEntries: currentMedia.secondSection.videoEntries.map((_, index) => ({
            videoUrl: formData.get(`videoUrl${index}`) as string,
            title: formData.get(`videoTitle${index}`) as string,
            description: formData.get(`videoDescription${index}`) as string
          })),
          secondTitle: formData.get('secondTitle') as string,
          secondDescription: formData.get('secondDescription') as string,
          imageEntries: currentMedia.secondSection.imageEntries.map((_, index) => ({
            imageUrl: formData.get(`imageUrl${index}`) as string,
            date: formData.get(`imageDate${index}`) as string,
            title: formData.get(`imageTitle${index}`) as string,
            description: formData.get(`imageDescription${index}`) as string
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
        secondSection: {
          firstTitle: '',
          firstDescription: '',
          videoEntries: [],
          secondTitle: '',
          secondDescription: '',
          imageEntries: []
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
      secondSection: {
        firstTitle: '',
        firstDescription: '',
        videoEntries: [],
        secondTitle: '',
        secondDescription: '',
        imageEntries: []
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
            {/* Second Section */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-lg font-semibold">Second Section</h3>
                
                {/* First Title and Description */}
                <div>
                  <Label htmlFor="firstTitle">First Title</Label>
                  <Input 
                    id="firstTitle"
                    name="firstTitle"
                    placeholder="Enter first title"
                    value={currentMedia.secondSection.firstTitle}
                    onChange={(e) => setCurrentMedia(prev => ({
                      ...prev,
                      secondSection: {
                        ...prev.secondSection,
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
                    value={currentMedia.secondSection.firstDescription}
                    onChange={(e) => setCurrentMedia(prev => ({
                      ...prev,
                      secondSection: {
                        ...prev.secondSection,
                        firstDescription: e.target.value
                      }
                    }))}
                    rows={4}
                  />
                </div>

                {/* Video Entries Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-md font-semibold">Video Entries</h4>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={handleAddVideoEntry}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Video
                    </Button>
                  </div>

                  {currentMedia.secondSection.videoEntries.map((entry, index) => (
                    <div key={index} className="border rounded p-4 relative">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => handleRemoveVideoEntry(index)}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>

                      <div className="space-y-2">
                        <div>
                          <Label htmlFor={`videoUrl${index}`}>Video URL</Label>
                          <Input 
                            id={`videoUrl${index}`}
                            name={`videoUrl${index}`}
                            placeholder="Enter video URL"
                            value={entry.videoUrl}
                            onChange={(e) => {
                              const newEntries = [...currentMedia.secondSection.videoEntries];
                              newEntries[index] = {
                                ...newEntries[index],
                                videoUrl: e.target.value
                              };
                              setCurrentMedia(prev => ({
                                ...prev,
                                secondSection: {
                                  ...prev.secondSection,
                                  videoEntries: newEntries
                                }
                              }));
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`videoTitle${index}`}>Title</Label>
                          <Input 
                            id={`videoTitle${index}`}
                            name={`videoTitle${index}`}
                            placeholder="Enter title"
                            value={entry.title}
                            onChange={(e) => {
                              const newEntries = [...currentMedia.secondSection.videoEntries];
                              newEntries[index] = {
                                ...newEntries[index],
                                title: e.target.value
                              };
                              setCurrentMedia(prev => ({
                                ...prev,
                                secondSection: {
                                  ...prev.secondSection,
                                  videoEntries: newEntries
                                }
                              }));
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`videoDescription${index}`}>Description</Label>
                          <Textarea 
                            id={`videoDescription${index}`}
                            name={`videoDescription${index}`}
                            placeholder="Enter description"
                            value={entry.description}
                            onChange={(e) => {
                              const newEntries = [...currentMedia.secondSection.videoEntries];
                              newEntries[index] = {
                                ...newEntries[index],
                                description: e.target.value
                              };
                              setCurrentMedia(prev => ({
                                ...prev,
                                secondSection: {
                                  ...prev.secondSection,
                                  videoEntries: newEntries
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

                {/* Second Title and Description */}
                <div>
                  <Label htmlFor="secondTitle">Second Title</Label>
                  <Input 
                    id="secondTitle"
                    name="secondTitle"
                    placeholder="Enter second title"
                    value={currentMedia.secondSection.secondTitle}
                    onChange={(e) => setCurrentMedia(prev => ({
                      ...prev,
                      secondSection: {
                        ...prev.secondSection,
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
                    value={currentMedia.secondSection.secondDescription}
                    onChange={(e) => setCurrentMedia(prev => ({
                      ...prev,
                      secondSection: {
                        ...prev.secondSection,
                        secondDescription: e.target.value
                      }
                    }))}
                    rows={4}
                  />
                </div>

                {/* Image Entries Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-md font-semibold">Image Entries</h4>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={handleAddImageEntry}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Image
                    </Button>
                  </div>

                  {currentMedia.secondSection.imageEntries.map((entry, index) => (
                    <div key={index} className="border rounded p-4 relative">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => handleRemoveImageEntry(index)}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>

                      <div className="space-y-2">
                        <div>
                          <Label for={`imageUrl${index}`}>Image URL</Label>
                          <Input 
                            id={`imageUrl${index}`}
                            name={`imageUrl${index}`}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                const file = e.target.files[0];
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  const newEntries = [...currentMedia.secondSection.imageEntries];
                                  newEntries[index] = {
                                    ...newEntries[index],
                                    imageUrl: reader.result as string
                                  };
                                  setCurrentMedia(prev => ({
                                    ...prev,
                                    secondSection: {
                                      ...prev.secondSection,
                                      imageEntries: newEntries
                                    }
                                  }));
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          {entry.imageUrl && (
                            <div className="mt-2 relative w-full h-40">
                              <Image 
                                src={entry.imageUrl} 
                                alt="Image Preview" 
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                          )}
                        </div>
                        <div>
                          <Label htmlFor={`imageDate${index}`}>Date</Label>
                          <Input 
                            id={`imageDate${index}`}
                            name={`imageDate${index}`}
                            type="date"
                            value={entry.date}
                            onChange={(e) => {
                              const newEntries = [...currentMedia.secondSection.imageEntries];
                              newEntries[index] = {
                                ...newEntries[index],
                                date: e.target.value
                              };
                              setCurrentMedia(prev => ({
                                ...prev,
                                secondSection: {
                                  ...prev.secondSection,
                                  imageEntries: newEntries
                                }
                              }));
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`imageTitle${index}`}>Title</Label>
                          <Input 
                            id={`imageTitle${index}`}
                            name={`imageTitle${index}`}
                            placeholder="Enter title"
                            value={entry.title}
                            onChange={(e) => {
                              const newEntries = [...currentMedia.secondSection.imageEntries];
                              newEntries[index] = {
                                ...newEntries[index],
                                title: e.target.value
                              };
                              setCurrentMedia(prev => ({
                                ...prev,
                                secondSection: {
                                  ...prev.secondSection,
                                  imageEntries: newEntries
                                }
                              }));
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`imageDescription${index}`}>Description</Label>
                          <Textarea 
                            id={`imageDescription${index}`}
                            name={`imageDescription${index}`}
                            placeholder="Enter description"
                            value={entry.description}
                            onChange={(e) => {
                              const newEntries = [...currentMedia.secondSection.imageEntries];
                              newEntries[index] = {
                                ...newEntries[index],
                                description: e.target.value
                              };
                              setCurrentMedia(prev => ({
                                ...prev,
                                secondSection: {
                                  ...prev.secondSection,
                                  imageEntries: newEntries
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
                  <TableHead>Video Entries</TableHead>
                  <TableHead>Second Section</TableHead>
                  <TableHead>Image Entries</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mediaEntries.map((media) => (
                  <TableRow key={media.id}>
                    {/* First Section */}
                    <TableCell>
                      <div className="space-y-2">
                        <p className="font-semibold">Title: {media.secondSection.firstTitle}</p>
                        <p className="text-sm text-gray-600">
                          Description: {media.secondSection.firstDescription}
                        </p>
                      </div>
                    </TableCell>

                    {/* Video Entries */}
                    <TableCell>
                      <ul className="space-y-2">
                        {media.secondSection.videoEntries
                          .filter(entry => entry.videoUrl || entry.title)
                          .map((entry, index) => (
                            <li key={index} className="border-b pb-2 last:border-b-0">
                              <p className="font-semibold">Video URL: {entry.videoUrl}</p>
                              <p className="text-md">{entry.title}</p>
                              <p className="text-sm text-gray-600">{entry.description}</p>
                            </li>
                          ))}
                      </ul>
                    </TableCell>

                    {/* Second Section */}
                    <TableCell>
                      <div className="space-y-2">
                        <p className="font-semibold">Title: {media.secondSection.secondTitle}</p>
                        <p className="text-sm text-gray-600">
                          Description: {media.secondSection.secondDescription}
                        </p>
                      </div>
                    </TableCell>

                    {/* Image Entries */}
                    <TableCell>
                      <ul className="space-y-2">
                        {media.secondSection.imageEntries
                          .filter(entry => entry.imageUrl || entry.title)
                          .map((entry, index) => (
                            <li key={index} className="border-b pb-2 last:border-b-0">
                              {entry.imageUrl && (
                                <div className="relative w-24 h-24 mb-2">
                                  <Image 
                                    src={entry.imageUrl} 
                                    alt="Media Image" 
                                    fill
                                    className="object-cover rounded"
                                  />
                                </div>
                              )}
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
       
                          