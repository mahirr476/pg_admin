"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown,
  Users,
  DollarSign,
  ShoppingCart,
  Activity,
  ChevronDown,
  Filter
} from 'lucide-react'

// Sample data for various charts
const performanceData = [
  { name: 'Jan', revenue: 4000, profit: 2400, customers: 400 },
  { name: 'Feb', revenue: 3000, profit: 1398, customers: 350 },
  { name: 'Mar', revenue: 5000, profit: 3800, customers: 500 },
  { name: 'Apr', revenue: 4780, profit: 2908, customers: 450 },
  { name: 'May', revenue: 3890, profit: 2800, customers: 380 },
  { name: 'Jun', revenue: 4390, profit: 3100, customers: 420 },
];

const customerSegmentData = [
  { name: 'Enterprise', value: 400, color: '#6366F1' },
  { name: 'Mid-Market', value: 300, color: '#10B981' },
  { name: 'Small Business', value: 200, color: '#F43F5E' },
  { name: 'Startup', value: 100, color: '#8B5CF6' },
];

const productPerformanceData = [
  { name: 'Poultry Solutions', sales: 4000, profit: 2400 },
  { name: 'Feed Management', sales: 3000, profit: 1800 },
  { name: 'Renewable Energy', sales: 2000, profit: 1200 },
  { name: 'Agricultural Tech', sales: 2780, profit: 1600 },
];

const Analytics = () => {
  const [activeFilter, setActiveFilter] = useState('6M');

  const filterOptions = [
    { label: '1M', value: '1M' },
    { label: '3M', value: '3M' },
    { label: '6M', value: '6M' },
    { label: '1Y', value: '1Y' },
  ];

  return (
    <main className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6 lg:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Analytics</h1>
            <p className="text-gray-500">Comprehensive business insights</p>
          </div>
          <div className="flex items-center space-x-4">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setActiveFilter(option.value)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${activeFilter === option.value 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Performance Metrics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:scale-105">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-indigo-50 rounded-full p-3">
                <DollarSign className="text-indigo-600" size={24} />
              </div>
              <span className="text-green-500 flex items-center">
                <TrendingUp size={20} />
                12.5%
              </span>
            </div>
            <h3 className="text-gray-500 mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-gray-800">$1.2M</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:scale-105">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-green-50 rounded-full p-3">
                <Users className="text-green-600" size={24} />
              </div>
              <span className="text-green-500 flex items-center">
                <TrendingUp size={20} />
                8.2%
              </span>
            </div>
            <h3 className="text-gray-500 mb-2">New Customers</h3>
            <p className="text-3xl font-bold text-gray-800">156</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:scale-105">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-rose-50 rounded-full p-3">
                <ShoppingCart className="text-rose-600" size={24} />
              </div>
              <span className="text-green-500 flex items-center">
                <TrendingUp size={20} />
                15.7%
              </span>
            </div>
            <h3 className="text-gray-500 mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-gray-800">487</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:scale-105">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-purple-50 rounded-full p-3">
                <Activity className="text-purple-600" size={24} />
              </div>
              <span className="text-green-500 flex items-center">
                <TrendingUp size={20} />
                10.3%
              </span>
            </div>
            <h3 className="text-gray-500 mb-2">Retention Rate</h3>
            <p className="text-3xl font-bold text-gray-800">92%</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Performance Line Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Performance Trends</h2>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
                <span className="text-gray-600">Revenue</span>
                <span className="w-3 h-3 bg-green-500 rounded-full ml-4"></span>
                <span className="text-gray-600">Profit</span>
                <span className="w-3 h-3 bg-rose-500 rounded-full ml-4"></span>
                <span className="text-gray-600">Customers</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={performanceData}>
                <CartesianGrid vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#6366F1" 
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: '#6366F1', stroke: 'white', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: '#10B981', stroke: 'white', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="customers" 
                  stroke="#F43F5E" 
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: '#F43F5E', stroke: 'white', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Customer Segment Pie Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Segments</h2>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={customerSegmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius="80%"
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {customerSegmentData.map((entry) => (
                    <Cell 
                      key={entry.name} 
                      fill={entry.color} 
                      className="hover:opacity-80 transition-opacity"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }} 
                />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  iconType="circle"
                  formatter={(value, entry) => (
                    <span className="text-gray-600">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Performance Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Product Performance</h2>
            <button className="flex items-center text-gray-600 hover:text-gray-800">
              <Filter className="mr-2" size={20} />
              Filter
            </button>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={productPerformanceData}>
              <CartesianGrid vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }} 
              />
              <Bar dataKey="sales" fill="#6366F1" barSize={20} radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" fill="#10B981" barSize={20} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </main>
  )
}

export default Analytics