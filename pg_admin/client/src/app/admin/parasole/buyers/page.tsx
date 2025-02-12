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
  Users,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Search
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Buyer {
  id: number;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  orderHistory: string;
  preferredProducts: string;
  status: 'active' | 'inactive' | 'pending';
}

export default function ParasoleBuyersPage() {
  const [buyers, setBuyers] = useState<Buyer[]>([
    {
      id: 1,
      companyName: "ABC Retail Ltd",
      contactPerson: "John Smith",
      email: "john@abcretail.com",
      phone: "+1 234 567 8900",
      address: "123 Business Street, City, Country",
      website: "www.abcretail.com",
      orderHistory: "Regular buyer since 2022",
      preferredProducts: "Sports Shoes, Casual Footwear",
      status: 'active'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredBuyers = buyers.filter(buyer => 
    buyer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    buyer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Buyers Management</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search buyers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-[300px]"
            />
          </div>
          <Button 
            onClick={() => setBuyers([...buyers, {
              id: buyers.length + 1,
              companyName: "",
              contactPerson: "",
              email: "",
              phone: "",
              address: "",
              website: "",
              orderHistory: "",
              preferredProducts: "",
              status: 'pending'
            }])}
            className="flex items-center gap-2"
          >
            <PlusCircle size={16} />
            Add Buyer
          </Button>
        </div>
      </div>

      {/* Buyers List */}
      <div className="space-y-6">
        {filteredBuyers.map((buyer) => (
          <motion.div
            key={buyer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-500" />
                  {buyer.companyName || "New Buyer"}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <select
                    value={buyer.status}
                    onChange={(e) => setBuyers(buyers.map(b => 
                      b.id === buyer.id ? { ...b, status: e.target.value as any } : b
                    ))}
                    className={`px-3 py-1 rounded-lg border ${getStatusColor(buyer.status)}`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setBuyers(buyers.filter(b => b.id !== buyer.id))}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        Company Name
                      </label>
                      <Input
                        value={buyer.companyName}
                        onChange={(e) => setBuyers(buyers.map(b => 
                          b.id === buyer.id ? { ...b, companyName: e.target.value } : b
                        ))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        Contact Person
                      </label>
                      <Input
                        value={buyer.contactPerson}
                        onChange={(e) => setBuyers(buyers.map(b => 
                          b.id === buyer.id ? { ...b, contactPerson: e.target.value } : b
                        ))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        Email
                      </label>
                      <Input
                        type="email"
                        value={buyer.email}
                        onChange={(e) => setBuyers(buyers.map(b => 
                          b.id === buyer.id ? { ...b, email: e.target.value } : b
                        ))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        Phone
                      </label>
                      <Input
                        value={buyer.phone}
                        onChange={(e) => setBuyers(buyers.map(b => 
                          b.id === buyer.id ? { ...b, phone: e.target.value } : b
                        ))}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        Address
                      </label>
                      <Textarea
                        value={buyer.address}
                        onChange={(e) => setBuyers(buyers.map(b => 
                          b.id === buyer.id ? { ...b, address: e.target.value } : b
                        ))}
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        Website
                      </label>
                      <Input
                        value={buyer.website}
                        onChange={(e) => setBuyers(buyers.map(b => 
                          b.id === buyer.id ? { ...b, website: e.target.value } : b
                        ))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Order History</label>
                      <Textarea
                        value={buyer.orderHistory}
                        onChange={(e) => setBuyers(buyers.map(b => 
                          b.id === buyer.id ? { ...b, orderHistory: e.target.value } : b
                        ))}
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Preferred Products</label>
                      <Textarea
                        value={buyer.preferredProducts}
                        onChange={(e) => setBuyers(buyers.map(b => 
                          b.id === buyer.id ? { ...b, preferredProducts: e.target.value } : b
                        ))}
                        rows={2}
                      />
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