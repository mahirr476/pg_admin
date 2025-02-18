"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, PlusCircle, X, Save, ArrowRight, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  const [activeSlide, setActiveSlide] = useState<number | null>(null);

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
    setActiveSlide(newSlide.id);
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-8"
    >
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm sticky top-0 z-10"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Parasole Home Page</h1>
          <p className="text-sm text-gray-500">Manage your website content</p>
        </div>
        <Button 
          variant="default"
          onClick={() => {/* Add save functionality */}}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Save size={16} />
          Save Changes
        </Button>
      </motion.div>

      {/* Banner Section */}
      <Card className="border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-600" />
            Banner Slides
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <AnimatePresence>
            {bannerSlides.map((slide, index) => (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  scale: activeSlide === slide.id ? 1.02 : 1,
                }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setActiveSlide(slide.id)}
                className={`
                  p-6 rounded-lg space-y-4 relative cursor-pointer
                  transition-all duration-200
                  ${activeSlide === slide.id 
                    ? 'bg-blue-50 border-2 border-blue-200' 
                    : 'bg-gray-50 border border-gray-200'
                  }
                `}
              >
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSlide(slide.id);
                  }}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 
                           bg-white rounded-full p-1 shadow-sm"
                >
                  <X size={16} />
                </motion.button>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block text-gray-700">
                        Slide Title
                      </label>
                      <Input
                        value={slide.title}
                        onChange={(e) => updateSlide(slide.id, 'title', e.target.value)}
                        placeholder="Enter slide title"
                        className="border-gray-200 focus:border-blue-300"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block text-gray-700">
                        Subtitle
                      </label>
                      <Input
                        value={slide.subtitle}
                        onChange={(e) => updateSlide(slide.id, 'subtitle', e.target.value)}
                        placeholder="Enter subtitle"
                        className="border-gray-200 focus:border-blue-300"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-700">
                      Banner Image
                    </label>
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="border-2 border-dashed rounded-lg p-6 bg-white"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                          <Image className="w-6 h-6 text-blue-500" />
                        </div>
                        <span className="text-sm text-gray-600 text-center">
                          Drop your image here or{" "}
                          <span className="text-blue-500 hover:text-blue-600 cursor-pointer">
                            browse
                          </span>
                        </span>
                        <input type="file" className="hidden" />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="outline"
              onClick={addNewSlide}
              className="w-full flex items-center gap-2 mt-6 h-12 border-dashed"
            >
              <PlusCircle size={16} />
              Add New Slide
            </Button>
          </motion.div>
        </CardContent>
      </Card>

      {/* About Section */}
      <Card className="border-none shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-green-600" />
            About Section
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div>
              <label className="text-sm font-medium mb-2 block text-gray-700">
                Section Title
              </label>
              <Input
                value={aboutSection.title}
                onChange={(e) => setAboutSection({ ...aboutSection, title: e.target.value })}
                placeholder="Enter section title"
                className="border-gray-200 focus:border-green-300"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-gray-700">
                Content
              </label>
              <Textarea
                value={aboutSection.content}
                onChange={(e) => setAboutSection({ ...aboutSection, content: e.target.value })}
                placeholder="Enter main content"
                rows={4}
                className="border-gray-200 focus:border-green-300"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-gray-700">
                Mission Statement
              </label>
              <Textarea
                value={aboutSection.missionStatement}
                onChange={(e) => setAboutSection({ ...aboutSection, missionStatement: e.target.value })}
                placeholder="Enter mission statement"
                rows={3}
                className="border-gray-200 focus:border-green-300"
              />
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}