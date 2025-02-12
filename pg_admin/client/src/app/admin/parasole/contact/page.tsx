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
  MapPin,
  Phone,
  Mail,
  Globe,
  MessageSquare,
  Clock,
  Building
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Office {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  googleMapEmbed: string;
}

interface ContactForm {
  id: number;
  label: string;
  fields: {
    name: string;
    type: string;
    required: boolean;
    placeholder: string;
  }[];
}

export default function ParasoleContactPage() {
  const [offices, setOffices] = useState<Office[]>([
    {
      id: 1,
      name: "Head Office",
      address: "123 Business Avenue, Industrial Area, City",
      phone: "+1 234 567 8900",
      email: "info@parasole.com",
      workingHours: "Monday - Friday: 9:00 AM - 6:00 PM",
      googleMapEmbed: "https://www.google.com/maps/embed?..."
    }
  ]);

  const [contactForm, setContactForm] = useState<ContactForm[]>([
    {
      id: 1,
      label: "General Inquiry Form",
      fields: [
        { name: "name", type: "text", required: true, placeholder: "Full Name" },
        { name: "email", type: "email", required: true, placeholder: "Email Address" },
        { name: "phone", type: "tel", required: false, placeholder: "Phone Number" },
        { name: "subject", type: "text", required: true, placeholder: "Subject" },
        { name: "message", type: "textarea", required: true, placeholder: "Your Message" }
      ]
    }
  ]);

  const addField = (formId: number) => {
    setContactForm(contactForm.map(form => {
      if (form.id === formId) {
        return {
          ...form,
          fields: [...form.fields, {
            name: `field_${form.fields.length + 1}`,
            type: "text",
            required: false,
            placeholder: "New Field"
          }]
        };
      }
      return form;
    }));
  };

  const removeField = (formId: number, fieldName: string) => {
    setContactForm(contactForm.map(form => {
      if (form.id === formId) {
        return {
          ...form,
          fields: form.fields.filter(field => field.name !== fieldName)
        };
      }
      return form;
    }));
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Contact Management</h1>
        <Button 
          variant="outline"
          onClick={() => {/* Add save functionality */}}
          className="flex items-center gap-2"
        >
          <Save size={16} />
          Save Changes
        </Button>
      </div>

      {/* Office Locations */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Office Locations
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOffices([...offices, {
              id: offices.length + 1,
              name: "",
              address: "",
              phone: "",
              email: "",
              workingHours: "",
              googleMapEmbed: ""
            }])}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Office
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {offices.map((office) => (
            <motion.div
              key={office.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 border rounded-lg relative"
            >
              <button
                onClick={() => setOffices(offices.filter(o => o.id !== office.id))}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                <X size={20} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-400" />
                      Office Name
                    </label>
                    <Input
                      value={office.name}
                      onChange={(e) => setOffices(offices.map(o => 
                        o.id === office.id ? { ...o, name: e.target.value } : o
                      ))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      Address
                    </label>
                    <Textarea
                      value={office.address}
                      onChange={(e) => setOffices(offices.map(o => 
                        o.id === office.id ? { ...o, address: e.target.value } : o
                      ))}
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      Phone
                    </label>
                    <Input
                      value={office.phone}
                      onChange={(e) => setOffices(offices.map(o => 
                        o.id === office.id ? { ...o, phone: e.target.value } : o
                      ))}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      Email
                    </label>
                    <Input
                      type="email"
                      value={office.email}
                      onChange={(e) => setOffices(offices.map(o => 
                        o.id === office.id ? { ...o, email: e.target.value } : o
                      ))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      Working Hours
                    </label>
                    <Input
                      value={office.workingHours}
                      onChange={(e) => setOffices(offices.map(o => 
                        o.id === office.id ? { ...o, workingHours: e.target.value } : o
                      ))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      Google Maps Embed Code
                    </label>
                    <Textarea
                      value={office.googleMapEmbed}
                      onChange={(e) => setOffices(offices.map(o => 
                        o.id === office.id ? { ...o, googleMapEmbed: e.target.value } : o
                      ))}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Contact Form Builder */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Contact Form Builder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {contactForm.map((form) => (
            <motion.div
              key={form.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Input
                value={form.label}
                onChange={(e) => setContactForm(contactForm.map(f => 
                  f.id === form.id ? { ...f, label: e.target.value } : f
                ))}
                placeholder="Form Label"
                className="font-medium"
              />
              
              <div className="space-y-4">
                {form.fields.map((field, index) => (
                  <motion.div
                    key={field.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-4 items-start"
                  >
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Input
                        value={field.placeholder}
                        onChange={(e) => {
                          const updatedFields = [...form.fields];
                          updatedFields[index] = { ...field, placeholder: e.target.value };
                          setContactForm(contactForm.map(f => 
                            f.id === form.id ? { ...f, fields: updatedFields } : f
                          ));
                        }}
                        placeholder="Field Label"
                      />
                      <select
                        value={field.type}
                        onChange={(e) => {
                          const updatedFields = [...form.fields];
                          updatedFields[index] = { ...field, type: e.target.value };
                          setContactForm(contactForm.map(f => 
                            f.id === form.id ? { ...f, fields: updatedFields } : f
                          ));
                        }}
                        className="p-2 border rounded-md"
                      >
                        <option value="text">Text</option>
                        <option value="email">Email</option>
                        <option value="tel">Phone</option>
                        <option value="textarea">Text Area</option>
                      </select>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => {
                            const updatedFields = [...form.fields];
                            updatedFields[index] = { ...field, required: e.target.checked };
                            setContactForm(contactForm.map(f => 
                              f.id === form.id ? { ...f, fields: updatedFields } : f
                            ));
                          }}
                          className="rounded border-gray-300"
                        />
                        <label className="text-sm">Required</label>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeField(form.id, field.name)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={20} />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => addField(form.id)}
                className="mt-4"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}