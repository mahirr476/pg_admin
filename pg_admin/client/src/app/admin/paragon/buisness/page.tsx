"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  PlusCircle, 
  X, 
  Save, 
  Building2,
  Image as ImageIcon,
  Link2,
  FileText,
  Calendar,
  ListChecks
} from 'lucide-react';
import { motion } from 'framer-motion';

interface BusinessActivity {
  id: number;
  title: string;
  description: string;
  features: string[];
  images: string[];
  relatedLinks: string[];
  highlights: string;
  yearEstablished: string;
  status: 'active' | 'planned' | 'under-development';
}

export default function ParagonBusinessPage() {
  const [activities, setActivities] = useState<BusinessActivity[]>([
    {
      id: 1,
      title: "Poultry Farming",
      description: "State-of-the-art poultry farming facilities...",
      features: ["Modern Equipment", "Quality Control", "Sustainable Practices"],
      images: ["/poultry1.jpg", "/poultry2.jpg"],
      relatedLinks: ["https://example.com/poultry"],
      highlights: "Leading poultry farming operation in the region",
      yearEstablished: "2010",
      status: 'active'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50';
      case 'planned':
        return 'text-yellow-600 bg-yellow-50';
      case 'under-development':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const addFeature = (activityId: number) => {
    setActivities(activities.map(activity => {
      if (activity.id === activityId) {
        return {
          ...activity,
          features: [...activity.features, '']
        };
      }
      return activity;
    }));
  };

  const updateFeature = (activityId: number, index: number, value: string) => {
    setActivities(activities.map(activity => {
      if (activity.id === activityId) {
        const newFeatures = [...activity.features];
        newFeatures[index] = value;
        return {
          ...activity,
          features: newFeatures
        };
      }
      return activity;
    }));
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Business Activities</h1>
        <Button 
          onClick={() => setActivities([...activities, {
            id: activities.length + 1,
            title: "",
            description: "",
            features: [],
            images: [],
            relatedLinks: [],
            highlights: "",
            yearEstablished: "",
            status: 'planned'
          }])}
          className="flex items-center gap-2"
        >
          <PlusCircle size={16} />
          Add Business Activity
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {activities.map((activity) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-500" />
                  {activity.title || "New Business Activity"}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <select
                    value={activity.status}
                    onChange={(e) => setActivities(activities.map(a => 
                      a.id === activity.id ? { ...a, status: e.target.value as any } : a
                    ))}
                    className={`px-3 py-1 rounded-lg border ${getStatusColor(activity.status)}`}
                  >
                    <option value="active">Active</option>
                    <option value="planned">Planned</option>
                    <option value="under-development">Under Development</option>
                  </select>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setActivities(activities.filter(a => a.id !== activity.id))}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          Business Title
                        </label>
                        <Input
                          value={activity.title}
                          onChange={(e) => setActivities(activities.map(a => 
                            a.id === activity.id ? { ...a, title: e.target.value } : a
                          ))}
                          placeholder="Enter business title"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          Year Established
                        </label>
                        <Input
                          value={activity.yearEstablished}
                          onChange={(e) => setActivities(activities.map(a => 
                            a.id === activity.id ? { ...a, yearEstablished: e.target.value } : a
                          ))}
                          placeholder="Enter year"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        Description
                      </label>
                      <Textarea
                        value={activity.description}
                        onChange={(e) => setActivities(activities.map(a => 
                          a.id === activity.id ? { ...a, description: e.target.value } : a
                        ))}
                        placeholder="Enter business description"
                        rows={4}
                      />
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2 mb-2">
                      <ListChecks className="h-4 w-4 text-gray-400" />
                      Features
                    </label>
                    <div className="space-y-2">
                      {activity.features.map((feature, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={feature}
                            onChange={(e) => updateFeature(activity.id, index, e.target.value)}
                            placeholder="Enter feature"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newFeatures = activity.features.filter((_, i) => i !== index);
                              setActivities(activities.map(a => 
                                a.id === activity.id ? { ...a, features: newFeatures } : a
                              ));
                            }}
                            className="text-red-500"
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addFeature(activity.id)}
                        className="mt-2"
                      >
                        <PlusCircle size={16} className="mr-2" />
                        Add Feature
                      </Button>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      Highlights
                    </label>
                    <Textarea
                      value={activity.highlights}
                      onChange={(e) => setActivities(activities.map(a => 
                        a.id === activity.id ? { ...a, highlights: e.target.value } : a
                      ))}
                      placeholder="Enter business highlights"
                      rows={3}
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2 mb-2">
                      <ImageIcon className="h-4 w-4 text-gray-400" />
                      Images
                    </label>
                    <div className="border-2 border-dashed rounded-lg p-4">
                      <div className="flex flex-col items-center gap-2">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                        <p className="text-sm text-gray-500">
                          Drop images here or click to upload
                        </p>
                        <input type="file" className="hidden" multiple accept="image/*" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}