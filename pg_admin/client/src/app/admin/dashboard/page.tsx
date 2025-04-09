

"use client"

import React, { useState, useEffect } from 'react'
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
  Legend,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  Activity, 
  Globe,
  ChevronUp,
  ChevronDown,
  Zap,
  Landmark,
  Bell,
  Calendar,
  Clock,
  DollarSign,
  PieChart as PieChartIcon,
  BarChart2,
  Search,
  Filter,
  ChevronRight,
  Download,
  AlertTriangle
} from 'lucide-react'

// Sample data for charts
const revenueData = [
  { name: 'Jan', income: 4000, expense: 2400, profit: 1600 },
  { name: 'Feb', income: 3000, expense: 1398, profit: 1602 },
  { name: 'Mar', income: 5000, expense: 3800, profit: 1200 },
  { name: 'Apr', income: 4780, expense: 2908, profit: 1872 },
  { name: 'May', income: 3890, expense: 2800, profit: 1090 },
  { name: 'Jun', income: 4390, expense: 3100, profit: 1290 },
  { name: 'Jul', income: 5490, expense: 3800, profit: 1690 },
  { name: 'Aug', income: 6200, expense: 4300, profit: 1900 },
];

const businessUnitData = [
  { name: 'Poultry', value: 400, color: '#6366F1' },
  { name: 'Feed Mills', value: 300, color: '#10B981' },
  { name: 'Renewable Energy', value: 200, color: '#F43F5E' },
  { name: 'Agriculture', value: 150, color: '#8B5CF6' },
];

const employeeGrowthData = [
  { name: 'Jan', count: 220 },
  { name: 'Feb', count: 240 },
  { name: 'Mar', count: 290 },
  { name: 'Apr', count: 300 },
  { name: 'May', count: 320 },
  { name: 'Jun', count: 350 },
  { name: 'Jul', count: 380 },
  { name: 'Aug', count: 410 },
];

const projectStatusData = [
  { name: 'Completed', value: 12, color: '#10B981' },
  { name: 'In Progress', value: 15, color: '#6366F1' },
  { name: 'Planning', value: 8, color: '#F59E0B' },
  { name: 'On Hold', value: 3, color: '#EF4444' },
];

const performanceData = [
  { subject: 'Efficiency', A: 85, B: 90, fullMark: 100 },
  { subject: 'Quality', A: 92, B: 80, fullMark: 100 },
  { subject: 'Innovation', A: 78, B: 85, fullMark: 100 },
  { subject: 'Teamwork', A: 90, B: 88, fullMark: 100 },
  { subject: 'Delivery', A: 82, B: 86, fullMark: 100 },
  { subject: 'Cost', A: 80, B: 70, fullMark: 100 },
];

const notifications = [
  { 
    id: 1, 
    title: 'New Project Initiated', 
    description: 'Paragon Poultry Ltd',
    time: 'Today',
    icon: <Briefcase className="text-indigo-600" size={20} />,
    bgColor: 'bg-indigo-50',
    isNew: true
  },
  { 
    id: 2, 
    title: 'Quarterly Report', 
    description: 'Feed Mills Division',
    time: 'Yesterday',
    icon: <Users className="text-green-600" size={20} />,
    bgColor: 'bg-green-50',
    isNew: true
  },
  { 
    id: 3, 
    title: 'New Partnership', 
    description: 'Renewable Energy Division',
    time: '3 days ago',
    icon: <Globe className="text-rose-600" size={20} />,
    bgColor: 'bg-rose-50',
    isNew: false
  },
  { 
    id: 4, 
    title: 'Budget Approval', 
    description: 'Agriculture Division',
    time: '5 days ago',
    icon: <DollarSign className="text-amber-600" size={20} />,
    bgColor: 'bg-amber-50',
    isNew: false
  },
  { 
    id: 5, 
    title: 'System Maintenance', 
    description: 'IT Department',
    time: '1 week ago',
    icon: <Users className="text-purple-600" size={20} />,
    bgColor: 'bg-purple-50',
    isNew: false
  }
];

const upcomingEvents = [
  {
    id: 1,
    title: 'Quarterly Review Meeting',
    date: 'Sep 15, 2025',
    time: '10:00 AM - 12:00 PM',
    location: 'Conference Room A',
    priority: 'high'
  },
  {
    id: 2,
    title: 'Executive Board Meeting',
    date: 'Sep 18, 2025',
    time: '2:00 PM - 4:00 PM',
    location: 'Board Room',
    priority: 'medium'
  },
  {
    id: 3,
    title: 'New Project Kickoff',
    date: 'Sep 21, 2025',
    time: '9:30 AM - 11:00 AM',
    location: 'Meeting Room 3',
    priority: 'high'
  }
];

const quickStats = [
  {
    id: 1,
    title: 'Total Revenue',
    value: '$1.2M',
    change: 12.5,
    isIncrease: true,
    icon: <TrendingUp className="text-indigo-600" size={24} />,
    bgColor: 'bg-indigo-50'
  },
  {
    id: 2,
    title: 'Active Projects',
    value: '15',
    change: 3.1,
    isIncrease: false,
    icon: <Briefcase className="text-green-600" size={24} />,
    bgColor: 'bg-green-50'
  },
  {
    id: 3,
    title: 'Business Units',
    value: '8',
    change: 5.7,
    isIncrease: true,
    icon: <Activity className="text-rose-600" size={24} />,
    bgColor: 'bg-rose-50'
  },
  {
    id: 4,
    title: 'New Employees',
    value: '42',
    change: 8.2,
    isIncrease: true,
    icon: <Users className="text-purple-600" size={24} />,
    bgColor: 'bg-purple-50'
  }
];

const capitalAllocationData = [
  { name: 'R&D', value: 25 },
  { name: 'Operations', value: 40 },
  { name: 'Marketing', value: 15 },
  { name: 'Infrastructure', value: 20 },
];

const Dashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('6M');
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  // Handle dark mode toggling
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Custom tooltip styles for charts
  const customTooltipStyle = { 
    backgroundColor: isDarkMode ? '#374151' : 'white', 
    border: 'none',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    color: isDarkMode ? '#F9FAFB' : '#1F2937'
  };

  return (
    <main className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-6 lg:py-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-8"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{getGreeting()}, Paragon Group</h1>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mt-1`}>
                <Clock className="inline-block mr-1 h-4 w-4" /> 
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div className="flex mt-4 md:mt-0 space-x-3">
              <select 
                className={`rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
              >
                <option value="7D">Last 7 Days</option>
                <option value="1M">Last Month</option>
                <option value="3M">Last 3 Months</option>
                <option value="6M">Last 6 Months</option>
                <option value="1Y">Last Year</option>
              </select>
              <button className={`hidden md:flex items-center gap-2 px-4 py-2 ${isDarkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-lg`}>
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </motion.div>

          {/* Quick Stats Grid */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStats.map((stat) => (
              <div 
                key={stat.id} 
                className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-2xl shadow-lg p-6 transform transition-all hover:scale-105 border ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className={`${stat.bgColor} rounded-full p-3`}>
                    {stat.icon}
                  </div>
                  <span className={`${stat.isIncrease ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                    {stat.isIncrease ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    {stat.change}%
                  </span>
                </div>
                <h3 className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-2`}>{stat.title}</h3>
                <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{stat.value}</p>
              </div>
            ))}
          </motion.div>

          {/* Charts Section */}
          <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-8">
            {/* Revenue Line Chart */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-2xl shadow-lg p-6 lg:col-span-2 border ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Financial Overview</h2>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Income</span>
                  <span className="w-3 h-3 bg-green-500 rounded-full ml-4"></span>
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Expense</span>
                  <span className="w-3 h-3 bg-blue-500 rounded-full ml-4"></span>
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Profit</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke={isDarkMode ? "#374151" : "#f0f0f0"} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: isDarkMode ? '#9CA3AF' : '#6B7280' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: isDarkMode ? '#9CA3AF' : '#6B7280' }}
                  />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Area 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#6366F1" 
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                    activeDot={{ r: 6, fill: '#6366F1', stroke: 'white', strokeWidth: 2 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expense" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorExpense)"
                    activeDot={{ r: 6, fill: '#10B981', stroke: 'white', strokeWidth: 2 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorProfit)"
                    activeDot={{ r: 6, fill: '#3B82F6', stroke: 'white', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Business Units Pie Chart */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-2xl shadow-lg p-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>Business Distribution</h2>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={businessUnitData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius="80%"
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {businessUnitData.map((entry) => (
                      <Cell 
                        key={entry.name} 
                        fill={entry.color} 
                        className="hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Legend 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="right"
                    iconType="circle"
                    formatter={(value, entry) => (
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Second Row of Charts */}
          <motion.div variants={itemVariants} className="grid lg:grid-cols-2 gap-8">
            {/* Employee Growth Chart */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-2xl shadow-lg p-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>Employee Growth</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={employeeGrowthData}>
                  <CartesianGrid vertical={false} stroke={isDarkMode ? "#374151" : "#f0f0f0"} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: isDarkMode ? '#9CA3AF' : '#6B7280' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: isDarkMode ? '#9CA3AF' : '#6B7280' }}
                  />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Bar 
                    dataKey="count" 
                    name="Employees" 
                    barSize={30} 
                    radius={[4, 4, 0, 0]}
                  >
                    {employeeGrowthData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={isDarkMode ? "#8B5CF6" : "#8B5CF6"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Performance Radar Chart */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-2xl shadow-lg p-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Performance Matrix</h2>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
                    <span className={`ml-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>2025</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span className={`ml-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>2024</span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceData}>
                  <PolarGrid stroke={isDarkMode ? "#374151" : "#f0f0f0"} />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: isDarkMode ? '#9CA3AF' : '#6B7280' }}
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]} 
                    tick={{ fill: isDarkMode ? '#9CA3AF' : '#6B7280' }}
                  />
                  <Radar 
                    name="2025" 
                    dataKey="A" 
                    stroke="#6366F1" 
                    fill="#6366F1" 
                    fillOpacity={0.6} 
                  />
                  <Radar 
                    name="2024" 
                    dataKey="B" 
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.6} 
                  />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Legend 
                    iconType="circle"
                    formatter={(value, entry) => (
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{value}</span>
                    )}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Third Row with Activity and Events */}
          <motion.div variants={itemVariants} className="grid lg:grid-cols-2 gap-8">
            {/* Recent Activity Section */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-2xl shadow-lg p-8 border ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Recent Activity</h2>
                <button className={`${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'} text-sm font-medium`}>
                  View All
                </button>
              </div>
              <div className="space-y-6">
                {notifications.slice(0, 3).map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`flex justify-between items-center pb-6 ${notification.id !== 3 ? `border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}` : ''}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`${notification.bgColor} rounded-full p-3`}>
                        {notification.icon}
                      </div>
                      <div>
                        <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{notification.title}</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{notification.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{notification.time}</span>
                      {notification.isNew && (
                        <span className="ml-2 w-2 h-2 bg-indigo-500 rounded-full"></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-2xl shadow-lg p-8 border ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Upcoming Events</h2>
                <button className={`${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'} text-sm font-medium`}>
                  View Calendar
                </button>
              </div>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} cursor-pointer transition-colors`}
                    onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-10 rounded-full ${event.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                        <div>
                          <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{event.title}</p>
                          <div className="flex items-center mt-1">
                            <Calendar className={`h-3 w-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-1`} />
                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{event.date}</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight 
                        className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transform transition-transform ${expandedEvent === event.id ? 'rotate-90' : ''}`}
                      />
                    </div>
                    
                    {expandedEvent === event.id && (
                      <div className={`mt-4 p-3 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="flex items-center mb-2">
                          <Clock className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`} />
                          <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{event.time}</span>
                        </div>
                        <div className="flex items-center">
                          <Landmark className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`} />
                          <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{event.location}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Fourth Row with Project Status and Allocations */}
          <motion.div variants={itemVariants} className="grid lg:grid-cols-2 gap-8">
            {/* Project Status */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-2xl shadow-lg p-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>Project Status Overview</h2>
              <div className="flex flex-col md:flex-row justify-between">
                <div className="md:w-2/5">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={projectStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {projectStatusData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={customTooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="md:w-3/5 space-y-4 mt-4 md:mt-0">
                  {projectStatusData.map((status) => (
                    <div key={status.name} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: status.color }}></div>
                        <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{status.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-bold mr-2">{status.value}</span>
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {Math.round((status.value / projectStatusData.reduce((sum, item) => sum + item.value, 0)) * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Capital Allocation */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-2xl shadow-lg p-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>Capital Allocation</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  layout="vertical"
                  data={capitalAllocationData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid horizontal={true} vertical={false} stroke={isDarkMode ? "#374151" : "#f0f0f0"} />
                  <XAxis 
                    type="number" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: isDarkMode ? '#9CA3AF' : '#6B7280' }}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: isDarkMode ? '#9CA3AF' : '#6B7280' }}
                  />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Bar 
                    dataKey="value" 
                    name="Percentage Allocation" 
                    barSize={30} 
                    radius={[0, 4, 4, 0]}
                  >
                    {capitalAllocationData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 0 ? '#8B5CF6' : index === 1 ? '#6366F1' : index === 2 ? '#10B981' : '#F43F5E'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Alert Section */}
          <motion.div variants={itemVariants}>
            <div className={`${isDarkMode ? 'bg-indigo-900 border-indigo-700' : 'bg-indigo-50 border-indigo-100'} rounded-2xl shadow-md p-6 border`}>
              <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${isDarkMode ? 'bg-indigo-800' : 'bg-indigo-100'} mr-4`}>
                    <AlertTriangle className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Budget Review Required</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-indigo-200' : 'text-indigo-700'}`}>The Q3 budget planning cycle will close in 5 days. Complete your department reviews soon.</p>
                  </div>
                </div>
                <button className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
                  Take Action
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}

export default Dashboard