// src/app/admin/parasole/home/page.tsx
"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, PlusCircle, X, Save } from 'lucide-react';
import { motion } from 'framer-motion';

interface BannerSlide {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
}

export default function ParasoleHomePage() {
  const [bannerSlides, setBannerSlides] = useState<BannerSlide[]>([
    {
      id: 1,
      title: "Welcome to Parasole",
      subtitle: "Excellence in Footwear Manufacturing",
      imageUrl: "/banner1.jpg"
    }
  ]);

  const [aboutSection, setAboutSection] = useState({
    title: "About Parasole",
    content: "Leading footwear manufacturer with a commitment to quality and innovation.",
    missionStatement: "To provide high-quality footwear solutions with customer satisfaction."
  });

  const addNewSlide = () => {
    const newSlide: BannerSlide = {
      id: bannerSlides.length + 1,
      title: "",
      subtitle: "",
      imageUrl: ""
    };
    setBannerSlides([...bannerSlides, newSlide]);
  };

  const removeSlide = (id: number) => {
    setBannerSlides(bannerSlides.filter(slide => slide.id !== id));
  };

  const updateSlide = (id: number, field: keyof BannerSlide, value: string) => {
    setBannerSlides(bannerSlides.map(slide => 
      slide.id === id ? { ...slide, [field]: value } : slide
    ));
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Parasole Home Page Management</h1>
        <Button 
          variant="outline"
          onClick={() => {/* Add save functionality */}}
          className="flex items-center gap-2"
        >
          <Save size={16} />
          Save Changes
        </Button>
      </div>

      {/* Banner Section */}
      <Card>
        <CardHeader>
          <CardTitle>Banner Slides</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {bannerSlides.map((slide, index) => (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 border rounded-lg space-y-4 relative"
            >
              <button
                onClick={() => removeSlide(slide.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                <X size={20} />
              </button>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Slide Title</label>
                    <Input
                      value={slide.title}
                      onChange={(e) => updateSlide(slide.id, 'title', e.target.value)}
                      placeholder="Enter slide title"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subtitle</label>
                    <Input
                      value={slide.subtitle}
                      onChange={(e) => updateSlide(slide.id, 'subtitle', e.target.value)}
                      placeholder="Enter subtitle"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Banner Image</label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Image className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        Drop an image here or click to upload
                      </span>
                      <input type="file" className="hidden" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          <Button
            variant="outline"
            onClick={addNewSlide}
            className="w-full flex items-center gap-2 mt-4"
          >
            <PlusCircle size={16} />
            Add New Slide
          </Button>
        </CardContent>
      </Card>

      {/* About Section */}
      <Card>
        <CardHeader>
          <CardTitle>About Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Section Title</label>
            <Input
              value={aboutSection.title}
              onChange={(e) => setAboutSection({ ...aboutSection, title: e.target.value })}
              placeholder="Enter section title"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Content</label>
            <Textarea
              value={aboutSection.content}
              onChange={(e) => setAboutSection({ ...aboutSection, content: e.target.value })}
              placeholder="Enter main content"
              rows={4}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Mission Statement</label>
            <Textarea
              value={aboutSection.missionStatement}
              onChange={(e) => setAboutSection({ ...aboutSection, missionStatement: e.target.value })}
              placeholder="Enter mission statement"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}