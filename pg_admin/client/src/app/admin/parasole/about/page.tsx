"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Image, 
  PlusCircle, 
  X, 
  Save, 
  Upload, 
  Users, 
  Building, 
  History,
  Target,
  Eye,
  PersonStanding,
  BookText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TeamMember {
  id: number;
  name: string;
  position: string;
  bio: string;
  imageUrl: string;
}

export default function ParasoleAboutPage() {
  const [activeTab, setActiveTab] = useState('main-content');
  const [activeMember, setActiveMember] = useState<number | null>(null);
  const [aboutContent, setAboutContent] = useState({
    mainTitle: "About Parasole",
    introduction: "Welcome to Parasole, where excellence meets innovation.",
    mission: "Our mission is to deliver exceptional footwear solutions.",
    vision: "To be the leading footwear manufacturer globally.",
    history: "Founded in [year], Parasole has grown to become...",
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: 1,
      name: "John Doe",
      position: "CEO",
      bio: "20+ years of experience in footwear manufacturing",
      imageUrl: "/team/ceo.jpg"
    }
  ]);

  const addTeamMember = () => {
    const newMember: TeamMember = {
      id: teamMembers.length + 1,
      name: "",
      position: "",
      bio: "",
      imageUrl: ""
    };
    setTeamMembers([...teamMembers, newMember]);
    setActiveMember(newMember.id);
  };

  const removeTeamMember = (id: number) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
    if (activeMember === id) setActiveMember(null);
  };

  const updateTeamMember = (id: number, field: keyof TeamMember, value: string) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-8"
    >
      {/* Header */}
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm sticky top-0 z-10"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">About Page</h1>
          <p className="text-sm text-gray-500">Manage your about page content</p>
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

      <Tabs defaultValue="main-content" className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto bg-blue-50">
          <TabsTrigger 
            value="main-content"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <Building className="w-4 h-4 mr-2" />
            Company Info
          </TabsTrigger>
          <TabsTrigger 
            value="team"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <Users className="w-4 h-4 mr-2" />
            Team Members
          </TabsTrigger>
        </TabsList>

        <TabsContent value="main-content" className="space-y-6">
          {/* Main Content Section */}
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <BookText className="w-5 h-5 text-blue-600" />
                Main Content
              </CardTitle>
              <CardDescription>
                Edit your company's core information
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">
                    Page Title
                  </label>
                  <Input
                    value={aboutContent.mainTitle}
                    onChange={(e) => setAboutContent({ ...aboutContent, mainTitle: e.target.value })}
                    placeholder="Enter page title"
                    className="border-gray-200 focus:border-blue-300"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">
                    Introduction
                  </label>
                  <Textarea
                    value={aboutContent.introduction}
                    onChange={(e) => setAboutContent({ ...aboutContent, introduction: e.target.value })}
                    placeholder="Enter introduction text"
                    rows={3}
                    className="border-gray-200 focus:border-blue-300"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div whileHover={{ scale: 1.01 }}>
                    <label className="text-sm font-medium mb-2 block text-gray-700 flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-600" />
                      Mission
                    </label>
                    <Textarea
                      value={aboutContent.mission}
                      onChange={(e) => setAboutContent({ ...aboutContent, mission: e.target.value })}
                      placeholder="Enter mission statement"
                      rows={3}
                      className="border-gray-200 focus:border-blue-300"
                    />
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.01 }}>
                    <label className="text-sm font-medium mb-2 block text-gray-700 flex items-center gap-2">
                      <Eye className="w-4 h-4 text-blue-600" />
                      Vision
                    </label>
                    <Textarea
                      value={aboutContent.vision}
                      onChange={(e) => setAboutContent({ ...aboutContent, vision: e.target.value })}
                      placeholder="Enter vision statement"
                      rows={3}
                      className="border-gray-200 focus:border-blue-300"
                    />
                  </motion.div>
                </div>

                <motion.div whileHover={{ scale: 1.01 }}>
                  <label className="text-sm font-medium mb-2 block text-gray-700 flex items-center gap-2">
                    <History className="w-4 h-4 text-blue-600" />
                    Company History
                  </label>
                  <Textarea
                    value={aboutContent.history}
                    onChange={(e) => setAboutContent({ ...aboutContent, history: e.target.value })}
                    placeholder="Enter company history"
                    rows={6}
                    className="border-gray-200 focus:border-blue-300"
                  />
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          {/* Team Members Section */}
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Team Members
              </CardTitle>
              <CardDescription>
                Manage your team profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-6">
                  <AnimatePresence>
                    {teamMembers.map((member, index) => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          scale: activeMember === member.id ? 1.02 : 1,
                        }}
                        exit={{ opacity: 0, y: -20 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setActiveMember(member.id)}
                        className={`
                          p-6 rounded-lg space-y-4 relative cursor-pointer
                          transition-all duration-200
                          ${activeMember === member.id 
                            ? 'bg-purple-50 border-2 border-purple-200' 
                            : 'bg-gray-50 border border-gray-200'
                          }
                        `}
                      >
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeTeamMember(member.id);
                          }}
                          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 
                                   bg-white rounded-full p-1 shadow-sm"
                        >
                          <X size={16} />
                        </motion.button>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-2 space-y-4">
                            <div>
                              <label className="text-sm font-medium mb-2 block text-gray-700">
                                Name
                              </label>
                              <Input
                                value={member.name}
                                onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                                placeholder="Enter member name"
                                className="border-gray-200 focus:border-purple-300"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block text-gray-700">
                                Position
                              </label>
                              <Input
                                value={member.position}
                                onChange={(e) => updateTeamMember(member.id, 'position', e.target.value)}
                                placeholder="Enter position"
                                className="border-gray-200 focus:border-purple-300"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block text-gray-700">
                                Bio
                              </label>
                              <Textarea
                                value={member.bio}
                                onChange={(e) => updateTeamMember(member.id, 'bio', e.target.value)}
                                placeholder="Enter member bio"
                                rows={3}
                                className="border-gray-200 focus:border-purple-300"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium mb-2 block text-gray-700">
                              Profile Image
                            </label>
                            <motion.div 
                              whileHover={{ scale: 1.02 }}
                              className="border-2 border-dashed rounded-lg p-6 bg-white"
                            >
                              <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                                  <PersonStanding className="w-6 h-6 text-purple-500" />
                                </div>
                                <span className="text-sm text-gray-600 text-center">
                                  Drop your image here or{" "}
                                  <span className="text-purple-500 hover:text-purple-600 cursor-pointer">
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
                      onClick={addTeamMember}
                      className="w-full flex items-center gap-2 mt-6 h-12 border-dashed"
                    >
                      <PlusCircle size={16} />
                      Add Team Member
                    </Button>
                  </motion.div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}