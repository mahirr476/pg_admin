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
  Factory,
  Truck,
  Gauge,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductionUnit {
  id: number;
  name: string;
  location: string;
  capacity: string;
  status: 'active' | 'maintenance' | 'inactive';
  maintenanceSchedule: string;
}

interface Supplier {
  id: number;
  name: string;
  materials: string;
  leadTime: string;
  contactPerson: string;
  contactInfo: string;
}

interface QualityMetric {
  id: number;
  parameter: string;
  target: string;
  current: string;
  lastUpdated: string;
}

export default function ParasoleOperationsPage() {
  const [productionUnits, setProductionUnits] = useState<ProductionUnit[]>([
    {
      id: 1,
      name: "Unit A",
      location: "Factory 1, Ground Floor",
      capacity: "10000 units/day",
      status: 'active',
      maintenanceSchedule: "Every 3 months"
    }
  ]);

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: 1,
      name: "ABC Materials Ltd",
      materials: "Raw leather, Soles",
      leadTime: "15 days",
      contactPerson: "John Smith",
      contactInfo: "john@abcmaterials.com"
    }
  ]);

  const [qualityMetrics, setQualityMetrics] = useState<QualityMetric[]>([
    {
      id: 1,
      parameter: "Defect Rate",
      target: "<1%",
      current: "0.8%",
      lastUpdated: "2024-02-12"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50';
      case 'maintenance':
        return 'text-yellow-600 bg-yellow-50';
      case 'inactive':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Operations Management</h1>
        <Button 
          variant="outline"
          onClick={() => {/* Add save functionality */}}
          className="flex items-center gap-2"
        >
          <Save size={16} />
          Save Changes
        </Button>
      </div>

      {/* Production Units */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Factory className="h-5 w-5" />
            Production Units
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setProductionUnits([...productionUnits, {
              id: productionUnits.length + 1,
              name: "",
              location: "",
              capacity: "",
              status: 'inactive',
              maintenanceSchedule: ""
            }])}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Unit
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {productionUnits.map((unit) => (
            <motion.div
              key={unit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 border rounded-lg relative"
            >
              <button
                onClick={() => setProductionUnits(productionUnits.filter(u => u.id !== unit.id))}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                <X size={20} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Unit Name</label>
                    <Input 
                      value={unit.name}
                      onChange={(e) => setProductionUnits(productionUnits.map(u => 
                        u.id === unit.id ? { ...u, name: e.target.value } : u
                      ))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <Input 
                      value={unit.location}
                      onChange={(e) => setProductionUnits(productionUnits.map(u => 
                        u.id === unit.id ? { ...u, location: e.target.value } : u
                      ))}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <select
                      value={unit.status}
                      onChange={(e) => setProductionUnits(productionUnits.map(u => 
                        u.id === unit.id ? { ...u, status: e.target.value as any } : u
                      ))}
                      className={`w-full p-2 rounded-lg border ${getStatusColor(unit.status)}`}
                    >
                      <option value="active">Active</option>
                      <option value="maintenance">Under Maintenance</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Production Capacity</label>
                    <Input 
                      value={unit.capacity}
                      onChange={(e) => setProductionUnits(productionUnits.map(u => 
                        u.id === unit.id ? { ...u, capacity: e.target.value } : u
                      ))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Maintenance Schedule</label>
                    <Input 
                      value={unit.maintenanceSchedule}
                      onChange={(e) => setProductionUnits(productionUnits.map(u => 
                        u.id === unit.id ? { ...u, maintenanceSchedule: e.target.value } : u
                      ))}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Suppliers Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Suppliers
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSuppliers([...suppliers, {
              id: suppliers.length + 1,
              name: "",
              materials: "",
              leadTime: "",
              contactPerson: "",
              contactInfo: ""
            }])}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {suppliers.map((supplier) => (
            <motion.div
              key={supplier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 border rounded-lg relative"
            >
              <button
                onClick={() => setSuppliers(suppliers.filter(s => s.id !== supplier.id))}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                <X size={20} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Supplier Name</label>
                    <Input 
                      value={supplier.name}
                      onChange={(e) => setSuppliers(suppliers.map(s => 
                        s.id === supplier.id ? { ...s, name: e.target.value } : s
                      ))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Materials Supplied</label>
                    <Input 
                      value={supplier.materials}
                      onChange={(e) => setSuppliers(suppliers.map(s => 
                        s.id === supplier.id ? { ...s, materials: e.target.value } : s
                      ))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Lead Time</label>
                    <Input 
                      value={supplier.leadTime}
                      onChange={(e) => setSuppliers(suppliers.map(s => 
                        s.id === supplier.id ? { ...s, leadTime: e.target.value } : s
                      ))}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Contact Person</label>
                    <Input 
                      value={supplier.contactPerson}
                      onChange={(e) => setSuppliers(suppliers.map(s => 
                        s.id === supplier.id ? { ...s, contactPerson: e.target.value } : s
                      ))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Contact Information</label>
                    <Input 
                      value={supplier.contactInfo}
                      onChange={(e) => setSuppliers(suppliers.map(s => 
                        s.id === supplier.id ? { ...s, contactInfo: e.target.value } : s
                      ))}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Quality Metrics */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Quality Metrics
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQualityMetrics([...qualityMetrics, {
              id: qualityMetrics.length + 1,
              parameter: "",
              target: "",
              current: "",
              lastUpdated: new Date().toISOString().split('T')[0]
            }])}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Metric
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {qualityMetrics.map((metric) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 border rounded-lg relative"
            >
              <button
                onClick={() => setQualityMetrics(qualityMetrics.filter(m => m.id !== metric.id))}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                <X size={20} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium">Parameter</label>
                  <Input 
                    value={metric.parameter}
                    onChange={(e) => setQualityMetrics(qualityMetrics.map(m => 
                      m.id === metric.id ? { ...m, parameter: e.target.value } : m
                    ))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Target</label>
                  <Input 
                    value={metric.target}
                    onChange={(e) => setQualityMetrics(qualityMetrics.map(m => 
                      m.id === metric.id ? { ...m, target: e.target.value } : m
                    ))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Current Value</label>
                  <Input 
                    value={metric.current}
                    onChange={(e) => setQualityMetrics(qualityMetrics.map(m => 
                      m.id === metric.id ? { ...m, current: e.target.value } : m
                    ))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Last Updated</label>
                  <Input 
                    type="date"
                    value={metric.lastUpdated}
                    onChange={(e) => setQualityMetrics(qualityMetrics.map(m => 
                      m.id === metric.id ? { ...m, lastUpdated: e.target.value } : m
                    ))}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}