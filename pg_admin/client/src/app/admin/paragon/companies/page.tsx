"use client"
import Image from 'next/image';
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
  Users,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  BarChart,
  Search
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Company {
  id: number;
  name: string;
  logo: string;
  description: string;
  yearEstablished: string;
  employeeCount: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  directors: string[];
  businessType: string;
  registrationNumber: string;
  status: 'active' | 'inactive' | 'pending';
}

export default function ParagonCompaniesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: 1,
      name: "Paragon Poultry Ltd",
      logo: "/logos/paragon-poultry.jpg",
      description: "Leading poultry production company...",
      yearEstablished: "2010",
      employeeCount: "500+",
      location: "Dhaka, Bangladesh",
      email: "info@paragonpoultry.com",
      phone: "+880 123456789",
      website: "www.paragonpoultry.com",
      directors: ["John Doe", "Jane Smith"],
      businessType: "Poultry Production",
      registrationNumber: "REG123456",
      status: 'active'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50';
      case 'inactive':
        return 'text-red-600 bg-red-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.businessType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addDirector = (companyId: number) => {
    setCompanies(companies.map(company => {
      if (company.id === companyId) {
        return {
          ...company,
          directors: [...company.directors, '']
        };
      }
      return company;
    }));
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Companies Management</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-[300px]"
            />
          </div>
          <Button 
            onClick={() => setCompanies([...companies, {
              id: companies.length + 1,
              name: "",
              logo: "",
              description: "",
              yearEstablished: "",
              employeeCount: "",
              location: "",
              email: "",
              phone: "",
              website: "",
              directors: [],
              businessType: "",
              registrationNumber: "",
              status: 'pending'
            }])}
            className="flex items-center gap-2"
          >
            <PlusCircle size={16} />
            Add Company
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {filteredCompanies.map((company) => (
          <motion.div
            key={company.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-500" />
                  {company.name || "New Company"}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <select
                    value={company.status}
                    onChange={(e) => setCompanies(companies.map(c => 
                      c.id === company.id ? { ...c, status: e.target.value as any } : c
                    ))}
                    className={`px-3 py-1 rounded-lg border ${getStatusColor(company.status)}`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setCompanies(companies.filter(c => c.id !== company.id))}
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
                          Company Name
                        </label>
                        <Input
                          value={company.name}
                          onChange={(e) => setCompanies(companies.map(c => 
                            c.id === company.id ? { ...c, name: e.target.value } : c
                          ))}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium flex items-center gap-2">
                          <BarChart className="h-4 w-4 text-gray-400" />
                          Business Type
                        </label>
                        <Input
                          value={company.businessType}
                          onChange={(e) => setCompanies(companies.map(c => 
                            c.id === company.id ? { ...c, businessType: e.target.value } : c
                          ))}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          Year Established
                        </label>
                        <Input
                          value={company.yearEstablished}
                          onChange={(e) => setCompanies(companies.map(c => 
                            c.id === company.id ? { ...c, yearEstablished: e.target.value } : c
                          ))}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium flex items-center gap-2">
                          Description
                      </label>
                      <Textarea
                        value={company.description}
                        onChange={(e) => setCompanies(companies.map(c => 
                          c.id === company.id ? { ...c, description: e.target.value } : c
                        ))}
                        rows={5}
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        Email
                      </label>
                      <Input
                        type="email"
                        value={company.email}
                        onChange={(e) => setCompanies(companies.map(c => 
                          c.id === company.id ? { ...c, email: e.target.value } : c
                        ))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        Phone
                      </label>
                      <Input
                        value={company.phone}
                        onChange={(e) => setCompanies(companies.map(c => 
                          c.id === company.id ? { ...c, phone: e.target.value } : c
                        ))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        Website
                      </label>
                      <Input
                        value={company.website}
                        onChange={(e) => setCompanies(companies.map(c => 
                          c.id === company.id ? { ...c, website: e.target.value } : c
                        ))}
                      />
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        Location
                      </label>
                      <Textarea
                        value={company.location}
                        onChange={(e) => setCompanies(companies.map(c => 
                          c.id === company.id ? { ...c, location: e.target.value } : c
                        ))}
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        Employee Count
                      </label>
                      <Input
                        value={company.employeeCount}
                        onChange={(e) => setCompanies(companies.map(c => 
                          c.id === company.id ? { ...c, employeeCount: e.target.value } : c
                        ))}
                      />
                    </div>
                  </div>

                  {/* Directors */}
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      Directors
                    </label>
                    <div className="space-y-2">
                      {company.directors.map((director, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={director}
                            onChange={(e) => {
                              const newDirectors = [...company.directors];
                              newDirectors[index] = e.target.value;
                              setCompanies(companies.map(c => 
                                c.id === company.id ? { ...c, directors: newDirectors } : c
                              ));
                            }}
                            placeholder="Director name"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newDirectors = company.directors.filter((_, i) => i !== index);
                              setCompanies(companies.map(c => 
                                c.id === company.id ? { ...c, directors: newDirectors } : c
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
                        onClick={() => addDirector(company.id)}
                        className="mt-2"
                      >
                        <PlusCircle size={16} className="mr-2" />
                        Add Director
                      </Button>
                    </div>
                  </div>

                  {/* Logo Upload */}
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2 mb-2">
                      Logo
                    </label>
                    <div className="border-2 border-dashed rounded-lg p-4">
                      <div className="flex flex-col items-center gap-2">
                        {company.logo ? (
                          
                          
                          <Image 
                            src={company.logo} 
                            alt={`${company.name} logo`} 
                            width={128}
                            height={128}
                            className="object-contain"
                          />
                        ) : (
                          <Building2 className="w-12 h-12 text-gray-400" />
                        )}
                        <p className="text-sm text-gray-500">
                          Drop logo here or click to upload
                        </p>
                        <input type="file" className="hidden" accept="image/*" />
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