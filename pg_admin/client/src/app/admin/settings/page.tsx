"use client"

import React, { useState } from 'react'
import { 
  User, 
  Lock, 
  Bell, 
  Settings as SettingsIcon 
} from 'lucide-react'

const Settings = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@company.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const menuItems = [
    { 
      id: 'profile', 
      icon: <User className="mr-3" size={20} />, 
      label: 'Profile' 
    },
    { 
      id: 'security', 
      icon: <Lock className="mr-3" size={20} />, 
      label: 'Security' 
    },
    { 
      id: 'notifications', 
      icon: <Bell className="mr-3" size={20} />, 
      label: 'Notifications' 
    },
    { 
      id: 'settings', 
      icon: <SettingsIcon className="mr-3" size={20} />, 
      label: 'Preferences' 
    }
  ];

  const renderContent = () => {
    switch(activeSection) {
      case 'profile':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Update Profile
              </button>
            </div>
          </div>
        );
      
      case 'security':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Change Password</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-gray-700">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Change Password
              </button>
            </div>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Email Notifications</span>
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="flex justify-between items-center">
                <span>Push Notifications</span>
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Preferences</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-gray-700">Language</label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-gray-700">Theme</label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option>Light</option>
                  <option>Dark</option>
                  <option>System Default</option>
                </select>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto flex space-x-6">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white rounded-lg shadow-md p-4">
          <h1 className="text-xl font-bold mb-6 text-center">Settings</h1>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`
                w-full flex items-center px-4 py-3 rounded-lg mb-2
                ${activeSection === item.id 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'hover:bg-gray-100 text-gray-700'}
              `}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Settings