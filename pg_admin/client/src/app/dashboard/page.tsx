"use client"

import React from 'react'
import { motion } from 'framer-motion'

const Dashboard = () => {
  return (
    <main className="ml-64 p-6 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h1 className="text-2xl font-semibold mb-4">Welcome to Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Quick Stats */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="text-sm text-blue-600 font-medium">Total Companies</h3>
            <p className="text-2xl font-bold text-blue-800">21</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 className="text-sm text-green-600 font-medium">Active Projects</h3>
            <p className="text-2xl font-bold text-green-800">13</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h3 className="text-sm text-purple-600 font-medium">Employees</h3>
            <p className="text-2xl font-bold text-purple-800">1,200+</p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
            <h3 className="text-sm text-orange-600 font-medium">Business Units</h3>
            <p className="text-2xl font-bold text-orange-800">8</p>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {/* Activity items */}
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="text-sm text-gray-600">Today</p>
              <p className="text-gray-800">New project initiated at Paragon Poultry Ltd</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <p className="text-sm text-gray-600">Yesterday</p>
              <p className="text-gray-800">Quarterly report submitted for Feed Mills</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <p className="text-sm text-gray-600">3 days ago</p>
              <p className="text-gray-800">New partnership established with Renewable Energy division</p>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  )
}

export default Dashboard