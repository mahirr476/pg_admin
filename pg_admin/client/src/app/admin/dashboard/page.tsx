// "use client"

// import React from 'react'
// import { motion } from 'framer-motion'

// const Dashboard = () => {
//   return (
//     <main className=" p-6 bg-gray-50 min-h-screen">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="bg-white rounded-lg shadow-sm p-6"
//       >
//         <h1 className="text-2xl font-semibold mb-4">Welcome to Dashboard</h1>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           {/* Quick Stats */}
//           <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
//             <h3 className="text-sm text-blue-600 font-medium">Total Companies</h3>
//             <p className="text-2xl font-bold text-blue-800">21</p>
//           </div>

//           <div className="bg-green-50 p-4 rounded-lg border border-green-100">
//             <h3 className="text-sm text-green-600 font-medium">Active Projects</h3>
//             <p className="text-2xl font-bold text-green-800">13</p>
//           </div>

//           <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
//             <h3 className="text-sm text-purple-600 font-medium">Employees</h3>
//             <p className="text-2xl font-bold text-purple-800">1,200+</p>
//           </div>

//           <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
//             <h3 className="text-sm text-orange-600 font-medium">Business Units</h3>
//             <p className="text-2xl font-bold text-orange-800">8</p>
//           </div>
//         </div>

//         {/* Recent Activity Section */}
//         <div className="mt-8">
//           <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
//           <div className="space-y-4">
//             {/* Activity items */}
//             <div className="border-l-4 border-blue-500 pl-4 py-2">
//               <p className="text-sm text-gray-600">Today</p>
//               <p className="text-gray-800">New project initiated at Paragon Poultry Ltd</p>
//             </div>
//             <div className="border-l-4 border-green-500 pl-4 py-2">
//               <p className="text-sm text-gray-600">Yesterday</p>
//               <p className="text-gray-800">Quarterly report submitted for Feed Mills</p>
//             </div>
//             <div className="border-l-4 border-purple-500 pl-4 py-2">
//               <p className="text-sm text-gray-600">3 days ago</p>
//               <p className="text-gray-800">New partnership established with Renewable Energy division</p>
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     </main>
//   )
// }

// export default Dashboard




// "use client"

// import React from 'react'
// import { motion } from 'framer-motion'
// import { 
//   LineChart, 
//   Line, 
//   XAxis, 
//   YAxis, 
//   CartesianGrid, 
//   Tooltip, 
//   ResponsiveContainer,
//   PieChart, 
//   Pie, 
//   Cell 
// } from 'recharts'
// import { 
//   TrendingUp, 
//   Users, 
//   Briefcase, 
//   Activity, 
//   DollarSign, 
//   TrendingDown 
// } from 'lucide-react'

// // Sample data for charts
// const revenueData = [
//   { name: 'Jan', revenue: 4000, profit: 2400 },
//   { name: 'Feb', revenue: 3000, profit: 1398 },
//   { name: 'Mar', revenue: 2000, profit: 9800 },
//   { name: 'Apr', revenue: 2780, profit: 3908 },
//   { name: 'May', revenue: 1890, profit: 4800 },
//   { name: 'Jun', revenue: 2390, profit: 3800 },
// ];

// const businessUnitData = [
//   { name: 'Poultry', value: 400 },
//   { name: 'Feed Mills', value: 300 },
//   { name: 'Renewable Energy', value: 200 },
//   { name: 'Agriculture', value: 150 },
// ];

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// const Dashboard = () => {
//   return (
//     <main className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="space-y-6"
//       >
//         {/* Quick Stats Section */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//           {/* Performance Cards */}
//           <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-shadow">
//             <div className="flex justify-between items-center mb-3">
//               <TrendingUp className="text-blue-500" size={24} />
//               <span className="text-green-500 text-sm flex items-center">
//                 <TrendingUp size={16} className="mr-1" /> 12.5%
//               </span>
//             </div>
//             <h3 className="text-sm text-gray-500 font-medium">Total Revenue</h3>
//             <p className="text-2xl font-bold text-gray-800">$1.2M</p>
//           </div>

//           <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-shadow">
//             <div className="flex justify-between items-center mb-3">
//               <Users className="text-purple-500" size={24} />
//               <span className="text-green-500 text-sm flex items-center">
//                 <TrendingUp size={16} className="mr-1" /> 8.2%
//               </span>
//             </div>
//             <h3 className="text-sm text-gray-500 font-medium">New Employees</h3>
//             <p className="text-2xl font-bold text-gray-800">42</p>
//           </div>

//           <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-shadow">
//             <div className="flex justify-between items-center mb-3">
//               <Briefcase className="text-green-500" size={24} />
//               <span className="text-red-500 text-sm flex items-center">
//                 <TrendingDown size={16} className="mr-1" /> 3.1%
//               </span>
//             </div>
//             <h3 className="text-sm text-gray-500 font-medium">Active Projects</h3>
//             <p className="text-2xl font-bold text-gray-800">15</p>
//           </div>

//           <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-shadow">
//             <div className="flex justify-between items-center mb-3">
//               <Activity className="text-orange-500" size={24} />
//               <span className="text-green-500 text-sm flex items-center">
//                 <TrendingUp size={16} className="mr-1" /> 5.7%
//               </span>
//             </div>
//             <h3 className="text-sm text-gray-500 font-medium">Business Units</h3>
//             <p className="text-2xl font-bold text-gray-800">8</p>
//           </div>

//           <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-shadow">
//             <div className="flex justify-between items-center mb-3">
//               <DollarSign className="text-indigo-500" size={24} />
//               <span className="text-green-500 text-sm flex items-center">
//                 <TrendingUp size={16} className="mr-1" /> 15.3%
//               </span>
//             </div>
//             <h3 className="text-sm text-gray-500 font-medium">Profit Margin</h3>
//             <p className="text-2xl font-bold text-gray-800">22.4%</p>
//           </div>
//         </div>

//         {/* Charts Section */}
//         <div className="grid lg:grid-cols-3 gap-6">
//           {/* Revenue Line Chart */}
//           <div className="bg-white rounded-xl shadow-md p-5 lg:col-span-2">
//             <h2 className="text-xl font-semibold mb-4 text-gray-800">Revenue & Profit Trends</h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={revenueData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                 <XAxis dataKey="name" stroke="#888888" />
//                 <YAxis stroke="#888888" />
//                 <Tooltip 
//                   contentStyle={{ 
//                     backgroundColor: 'white', 
//                     border: '1px solid #e0e0e0',
//                     borderRadius: '8px'
//                   }} 
//                 />
//                 <Line 
//                   type="monotone" 
//                   dataKey="revenue" 
//                   stroke="#8884d8" 
//                   strokeWidth={3}
//                   activeDot={{ r: 8 }}
//                 />
//                 <Line 
//                   type="monotone" 
//                   dataKey="profit" 
//                   stroke="#82ca9d" 
//                   strokeWidth={3}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Business Units Pie Chart */}
//           <div className="bg-white rounded-xl shadow-md p-5">
//             <h2 className="text-xl font-semibold mb-4 text-gray-800">Business Unit Distribution</h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={businessUnitData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="value"
//                 >
//                   {businessUnitData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip 
//                   contentStyle={{ 
//                     backgroundColor: 'white', 
//                     border: '1px solid #e0e0e0',
//                     borderRadius: '8px'
//                   }} 
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Recent Activity Section */}
//         <div className="bg-white rounded-xl shadow-md p-6">
//           <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h2>
//           <div className="space-y-4">
//             <div className="border-l-4 border-blue-500 pl-4 py-3 hover:bg-blue-50 transition-colors">
//               <p className="text-sm text-gray-600">Today</p>
//               <p className="text-gray-800 font-medium">New project initiated at Paragon Poultry Ltd</p>
//             </div>
//             <div className="border-l-4 border-green-500 pl-4 py-3 hover:bg-green-50 transition-colors">
//               <p className="text-sm text-gray-600">Yesterday</p>
//               <p className="text-gray-800 font-medium">Quarterly report submitted for Feed Mills</p>
//             </div>
//             <div className="border-l-4 border-purple-500 pl-4 py-3 hover:bg-purple-50 transition-colors">
//               <p className="text-sm text-gray-600">3 days ago</p>
//               <p className="text-gray-800 font-medium">New partnership established with Renewable Energy division</p>
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     </main>
//   )
// }

// export default Dashboard





"use client"

import React from 'react'
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
  Users, 
  Briefcase, 
  Activity, 
  Globe,
  ChevronUp,
  ChevronDown
} from 'lucide-react'

// Sample data for charts
const revenueData = [
  { name: 'Jan', income: 4000, expense: 2400 },
  { name: 'Feb', income: 3000, expense: 1398 },
  { name: 'Mar', income: 5000, expense: 3800 },
  { name: 'Apr', income: 4780, expense: 2908 },
  { name: 'May', income: 3890, expense: 2800 },
  { name: 'Jun', income: 4390, expense: 3100 },
];

const businessUnitData = [
  { name: 'Poultry', value: 400, color: '#6366F1' },
  { name: 'Feed Mills', value: 300, color: '#10B981' },
  { name: 'Renewable Energy', value: 200, color: '#F43F5E' },
  { name: 'Agriculture', value: 150, color: '#8B5CF6' },
];

const Dashboard = () => {
  return (
    <main className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6 lg:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500">Welcome back, John Doe</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white shadow-md rounded-full p-2">
              <Globe className="text-indigo-600" size={24} />
            </div>
            <div className="bg-white shadow-md rounded-full p-2">
              <Users className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Performance Cards */}
          <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:scale-105">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-indigo-50 rounded-full p-3">
                <TrendingUp className="text-indigo-600" size={24} />
              </div>
              <span className="text-green-500 flex items-center">
                <ChevronUp size={20} />
                12.5%
              </span>
            </div>
            <h3 className="text-gray-500 mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-gray-800">$1.2M</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:scale-105">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-green-50 rounded-full p-3">
                <Briefcase className="text-green-600" size={24} />
              </div>
              <span className="text-red-500 flex items-center">
                <ChevronDown size={20} />
                3.1%
              </span>
            </div>
            <h3 className="text-gray-500 mb-2">Active Projects</h3>
            <p className="text-3xl font-bold text-gray-800">15</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:scale-105">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-rose-50 rounded-full p-3">
                <Activity className="text-rose-600" size={24} />
              </div>
              <span className="text-green-500 flex items-center">
                <ChevronUp size={20} />
                5.7%
              </span>
            </div>
            <h3 className="text-gray-500 mb-2">Business Units</h3>
            <p className="text-3xl font-bold text-gray-800">8</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:scale-105">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-purple-50 rounded-full p-3">
                <Users className="text-purple-600" size={24} />
              </div>
              <span className="text-green-500 flex items-center">
                <ChevronUp size={20} />
                8.2%
              </span>
            </div>
            <h3 className="text-gray-500 mb-2">New Employees</h3>
            <p className="text-3xl font-bold text-gray-800">42</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Revenue Line Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Financial Overview</h2>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
                <span className="text-gray-600">Income</span>
                <span className="w-3 h-3 bg-green-500 rounded-full ml-4"></span>
                <span className="text-gray-600">Expense</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={revenueData}>
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
                  dataKey="income" 
                  stroke="#6366F1" 
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: '#6366F1', stroke: 'white', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expense" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: '#10B981', stroke: 'white', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Business Units Pie Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Business Distribution</h2>
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

        {/* Recent Activity Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h2>
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-6 border-b border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-50 rounded-full p-3">
                  <Briefcase className="text-indigo-600" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">New Project Initiated</p>
                  <p className="text-gray-500 text-sm">Paragon Poultry Ltd</p>
                </div>
              </div>
              <span className="text-gray-500 text-sm">Today</span>
            </div>
            <div className="flex justify-between items-center pb-6 border-b border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="bg-green-50 rounded-full p-3">
                  <Users className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Quarterly Report</p>
                  <p className="text-gray-500 text-sm">Feed Mills Division</p>
                </div>
              </div>
              <span className="text-gray-500 text-sm">Yesterday</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="bg-rose-50 rounded-full p-3">
                  <Globe className="text-rose-600" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">New Partnership</p>
                  <p className="text-gray-500 text-sm">Renewable Energy Division</p>
                </div>
              </div>
              <span className="text-gray-500 text-sm">3 days ago</span>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  )
}

export default Dashboard