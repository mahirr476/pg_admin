"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, PlusCircle, X, Save, Upload, Calendar, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50';
      case 'expired':
        return 'text-red-600 bg-red-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Compliance Management</h1>
        <Button 
          variant="outline"
          onClick={() => {/* Add save functionality */}}
          className="flex items-center gap-2"
        >
          <Save size={16} />
          Save Changes
        </Button>
      </div>

      {/* Certifications & Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Certifications & Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {documents.map((doc) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 border rounded-lg space-y-4 relative"
            >
              <button
                onClick={() => removeDocument(doc.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                <X size={20} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div className="border-2 border-dashed rounded-lg p-4">
                      <div className="flex items-center justify-center gap-2">
                        <FileText className="w-6 h-6 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          Click to upload or drag and drop
                        </span>
                        <input type="file" className="hidden" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <select
                      value={doc.status}
                      onChange={(e) => {
                        const updatedDocs = documents.map(d => 
                          d.id === doc.id ? { ...d, status: e.target.value as any } : d
                        );
                        setDocuments(updatedDocs);
                      }}
                      className={`w-full p-2 rounded-lg border ${getStatusColor(doc.status)}`}
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          <Button
            variant="outline"
            onClick={addDocument}
            className="w-full flex items-center gap-2 mt-4"
          >
            <PlusCircle size={16} />
            Add Document
          </Button>
        </CardContent>
      </Card>

      {/* Policies Section */}
      <Card>
        <CardHeader>
          <CardTitle>Company Policies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {policies.map((policy) => (
            <motion.div
              key={policy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 border rounded-lg space-y-4 relative"
            >
              <button
                onClick={() => removePolicy(policy.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                <X size={20} />
              </button>

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
            </motion.div>
          ))}

          <Button
            variant="outline"
            onClick={addPolicy}
            className="w-full flex items-center gap-2 mt-4"
          >
            <PlusCircle size={16} />
            Add Policy
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}