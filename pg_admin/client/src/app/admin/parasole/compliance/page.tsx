"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  PlusCircle, 
  X, 
  Save, 
  Upload, 
  Calendar, 
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ComplianceDocument {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  validUntil: string;
  status: 'active' | 'expired' | 'pending';
}

interface Policy {
  id: number;
  title: string;
  content: string;
  lastUpdated: string;
}

export default function ParasoleCompliancePage() {
  const [documents, setDocuments] = useState<ComplianceDocument[]>([
    {
      id: 1,
      title: "ISO 9001:2015 Certification",
      description: "Quality Management System Certification",
      fileUrl: "/certifications/iso9001.pdf",
      validUntil: "2024-12-31",
      status: 'active'
    }
  ]);

  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: 1,
      title: "Quality Control Policy",
      content: "Our commitment to maintaining the highest quality standards...",
      lastUpdated: "2024-01-15"
    }
  ]);

  const [savedAlert, setSavedAlert] = useState(false);

  const addDocument = () => {
    const newDocument: ComplianceDocument = {
      id: documents.length + 1,
      title: "",
      description: "",
      fileUrl: "",
      validUntil: "",
      status: 'pending'
    };
    setDocuments([...documents, newDocument]);
  };

  const addPolicy = () => {
    const newPolicy: Policy = {
      id: policies.length + 1,
      title: "",
      content: "",
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setPolicies([...policies, newPolicy]);
  };

  const removeDocument = (id: number) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const removePolicy = (id: number) => {
    setPolicies(policies.filter(policy => policy.id !== id));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleSave = () => {
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  return (
    <div className="p-6 space-y-8 mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm sticky top-0 z-10"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Management</h1>
          <p className="text-sm text-gray-500">Manage your organization's compliance documents and policies</p>
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

      <AnimatePresence>
        {savedAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                All changes have been saved successfully
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="documents">Documents & Certifications</TabsTrigger>
          <TabsTrigger value="policies">Company Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-6">
          <ScrollArea className="h-[600px] pr-4">
            <AnimatePresence>
              {documents.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="mb-4 group hover:shadow-md transition-shadow">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <Badge
                            variant={doc.status === 'active' ? 'default' : 
                                    doc.status === 'expired' ? 'destructive' : 'secondary'}
                            className="mb-2"
                          >
                            <span className="flex items-center gap-1">
                              {getStatusIcon(doc.status)}
                              {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                            </span>
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeDocument(doc.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Document Title</label>
                            <Input
                              value={doc.title}
                              onChange={(e) => {
                                const updatedDocs = documents.map(d => 
                                  d.id === doc.id ? { ...d, title: e.target.value } : d
                                );
                                setDocuments(updatedDocs);
                              }}
                              placeholder="Enter document title"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Description</label>
                            <Textarea
                              value={doc.description}
                              onChange={(e) => {
                                const updatedDocs = documents.map(d => 
                                  d.id === doc.id ? { ...d, description: e.target.value } : d
                                );
                                setDocuments(updatedDocs);
                              }}
                              placeholder="Enter description"
                              rows={3}
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Valid Until</label>
                            <Input
                              type="date"
                              value={doc.validUntil}
                              onChange={(e) => {
                                const updatedDocs = documents.map(d => 
                                  d.id === doc.id ? { ...d, validUntil: e.target.value } : d
                                );
                                setDocuments(updatedDocs);
                              }}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Document File</label>
                            <div className="border-2 border-dashed rounded-lg p-6 hover:border-primary/50 transition-colors">
                              <div className="flex flex-col items-center justify-center gap-2 text-center">
                                <Upload className="w-8 h-8 text-gray-400" />
                                <span className="text-sm text-gray-500">
                                  Drop your file here or click to browse
                                </span>
                                <Input type="file" className="hidden" />
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Status</label>
                            <Select
                              value={doc.status}
                              onValueChange={(value: any) => {
                                const updatedDocs = documents.map(d => 
                                  d.id === doc.id ? { ...d, status: value } : d
                                );
                                setDocuments(updatedDocs);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="expired">Expired</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            <Button
              variant="outline"
              onClick={addDocument}
              className="w-full flex items-center gap-2 mt-4"
            >
              <PlusCircle size={16} />
              Add Document
            </Button>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <ScrollArea className="h-[600px] pr-4">
            <AnimatePresence>
              {policies.map((policy, index) => (
                <motion.div
                  key={policy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="mb-4 group hover:shadow-md transition-shadow">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">Policy Document</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removePolicy(policy.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Policy Title</label>
                          <Input
                            value={policy.title}
                            onChange={(e) => {
                              const updatedPolicies = policies.map(p => 
                                p.id === policy.id ? { ...p, title: e.target.value } : p
                              );
                              setPolicies(updatedPolicies);
                            }}
                            placeholder="Enter policy title"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Policy Content</label>
                          <Textarea
                            value={policy.content}
                            onChange={(e) => {
                              const updatedPolicies = policies.map(p => 
                                p.id === policy.id ? { ...p, content: e.target.value } : p
                              );
                              setPolicies(updatedPolicies);
                            }}
                            placeholder="Enter policy content"
                            rows={6}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Last Updated</label>
                          <Input
                            type="date"
                            value={policy.lastUpdated}
                            onChange={(e) => {
                              const updatedPolicies = policies.map(p => 
                                p.id === policy.id ? { ...p, lastUpdated: e.target.value } : p
                              );
                              setPolicies(updatedPolicies);
                            }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            <Button
              variant="outline"
              onClick={addPolicy}
              className="w-full flex items-center gap-2 mt-4"
            >
              <PlusCircle size={16} />
              Add Policy
            </Button>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}