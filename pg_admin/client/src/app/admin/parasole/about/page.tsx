"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, PlusCircle, X, Save, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

interface TeamMember {
  id: number;
  name: string;
  position: string;
  bio: string;
  imageUrl: string;
}

export default function ParasoleAboutPage() {
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
  };

  const removeTeamMember = (id: number) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
  };

  const updateTeamMember = (id: number, field: keyof TeamMember, value: string) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">About Page Management</h1>
        <Button 
          variant="outline"
          onClick={() => {/* Add save functionality */}}
          className="flex items-center gap-2"
        >
          <Save size={16} />
          Save Changes
        </Button>
      </div>

      {/* Main Content Section */}
      <Card>
        <CardHeader>
          <CardTitle>Main Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Page Title</label>
            <Input
              value={aboutContent.mainTitle}
              onChange={(e) => setAboutContent({ ...aboutContent, mainTitle: e.target.value })}
              placeholder="Enter page title"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Introduction</label>
            <Textarea
              value={aboutContent.introduction}
              onChange={(e) => setAboutContent({ ...aboutContent, introduction: e.target.value })}
              placeholder="Enter introduction text"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Mission</label>
              <Textarea
                value={aboutContent.mission}
                onChange={(e) => setAboutContent({ ...aboutContent, mission: e.target.value })}
                placeholder="Enter mission statement"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Vision</label>
              <Textarea
                value={aboutContent.vision}
                onChange={(e) => setAboutContent({ ...aboutContent, vision: e.target.value })}
                placeholder="Enter vision statement"
                rows={3}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Company History</label>
            <Textarea
              value={aboutContent.history}
              onChange={(e) => setAboutContent({ ...aboutContent, history: e.target.value })}
              placeholder="Enter company history"
              rows={6}
            />
          </div>
        </CardContent>
      </Card>

      {/* Team Members Section */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 border rounded-lg space-y-4 relative"
            >
              <button
                onClick={() => removeTeamMember(member.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                <X size={20} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Name</label>
                    <Input
                      value={member.name}
                      onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                      placeholder="Enter member name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Position</label>
                    <Input
                      value={member.position}
                      onChange={(e) => updateTeamMember(member.id, 'position', e.target.value)}
                      placeholder="Enter position"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Bio</label>
                    <Textarea
                      value={member.bio}
                      onChange={(e) => updateTeamMember(member.id, 'bio', e.target.value)}
                      placeholder="Enter member bio"
                      rows={3}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Profile Image</label>
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
            onClick={addTeamMember}
            className="w-full flex items-center gap-2 mt-4"
          >
            <PlusCircle size={16} />
            Add Team Member
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}