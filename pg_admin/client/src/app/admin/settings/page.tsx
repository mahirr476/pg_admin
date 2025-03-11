
"use client"

import React, { useState } from 'react'
import { 
  User, 
  Lock, 
  Bell, 
  Settings as SettingsIcon,
  ChevronRight,
  Save,
  Mail,
  Moon,
  Sun,
  Globe,
  X
} from 'lucide-react'

const Settings = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    language: 'english',
    theme: 'light',
    emailNotifications: true,
    pushNotifications: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const menuItems = [
    { 
      id: 'profile', 
      icon: <User size={20} />, 
      label: 'Profile' 
    },
    { 
      id: 'security', 
      icon: <Lock size={20} />, 
      label: 'Security' 
    },
    { 
      id: 'notifications', 
      icon: <Bell size={20} />, 
      label: 'Notifications' 
    },
    { 
      id: 'settings', 
      icon: <SettingsIcon size={20} />, 
      label: 'Preferences' 
    }
  ];

  const renderContent = () => {
    switch(activeSection) {
      case 'profile':
        return (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
              <div className="flex items-center space-x-2">
                <button className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium">
                  <Save size={18} className="mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3 flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 text-3xl font-bold mb-4">
                    {formData.firstName.charAt(0) || ''}{formData.lastName.charAt(0) || ''}
                  </div>
                  <button className="absolute bottom-4 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors duration-200">
                    <User size={16} />
                  </button>
                </div>
                <p className="text-gray-500 text-sm mt-4 text-center">
                  Upload a profile picture<br />JPG, GIF or PNG. 1MB max.
                </p>
              </div>
              
              <div className="md:w-2/3 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">First Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <User size={16} />
                      </div>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-colors"
                        placeholder="Enter your first name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Last Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <User size={16} />
                      </div>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-colors"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    name="bio"
                    rows="4"
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-colors"
                    placeholder="Tell us about yourself..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'security':
        return (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Security Settings</h2>
            
            <div className="p-6 bg-indigo-50 rounded-lg mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Current Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <Lock size={16} />
                    </div>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-colors"
                      placeholder="Enter current password"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-colors"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-colors"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                
                <div className="pt-2">
                  <button className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium flex items-center">
                    <Save size={16} className="mr-2" />
                    Update Password
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-orange-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Two-Factor Authentication</h3>
              <p className="text-gray-600 mb-4">Add an extra layer of security to your account by enabling two-factor authentication.</p>
              <button className="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium">
                Enable 2FA
              </button>
            </div>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Notification Settings</h2>
            
            <div className="space-y-6">
              <div className="p-6 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Email Notifications</h3>
                    <p className="text-gray-600 text-sm mt-1">Receive notifications via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="emailNotifications"
                      checked={formData.emailNotifications}
                      onChange={handleInputChange}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                
                {formData.emailNotifications && (
                  <div className="mt-4 space-y-3 pl-4 border-l-2 border-indigo-200">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="updates" 
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor="updates" className="ml-2 text-sm font-medium text-gray-700">
                        Product updates
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="security" 
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor="security" className="ml-2 text-sm font-medium text-gray-700">
                        Security alerts
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="newsletter" 
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor="newsletter" className="ml-2 text-sm font-medium text-gray-700">
                        Newsletter
                      </label>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-6 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Push Notifications</h3>
                    <p className="text-gray-600 text-sm mt-1">Receive notifications on your device</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="pushNotifications"
                      checked={formData.pushNotifications}
                      onChange={handleInputChange}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium flex items-center">
                  <Save size={16} className="mr-2" />
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Application Preferences</h2>
            
            <div className="space-y-8">
              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <Globe size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Language</h3>
                    <p className="text-gray-600 text-sm mt-1">Select your preferred language</p>
                  </div>
                </div>
                <select 
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-colors"
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-lg mr-4">
                    {formData.theme === 'dark' ? (
                      <Moon size={24} className="text-purple-600" />
                    ) : (
                      <Sun size={24} className="text-purple-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Theme</h3>
                    <p className="text-gray-600 text-sm mt-1">Choose light or dark theme</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setFormData({...formData, theme: 'light'})}
                    className={`px-4 py-2 rounded-lg flex items-center ${
                      formData.theme === 'light' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    <Sun size={16} className="mr-2" />
                    Light
                  </button>
                  <button 
                    onClick={() => setFormData({...formData, theme: 'dark'})}
                    className={`px-4 py-2 rounded-lg flex items-center ${
                      formData.theme === 'dark' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    <Moon size={16} className="mr-2" />
                    Dark
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium flex items-center">
                  <Save size={16} className="mr-2" />
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className={`min-h-screen ${formData.theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-800'} p-4 md:p-8`}>
      <div className="max-w-6xl mx-auto">
        {/* Mobile Menu Button - Only visible on small screens */}
        <div className="md:hidden mb-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Settings</h1>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-indigo-600 text-white"
          >
            {mobileMenuOpen ? <X size={20} /> : <SettingsIcon size={20} />}
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation - Transforms to top menu on mobile */}
          <div className={`
            ${mobileMenuOpen ? 'block' : 'hidden'} md:block
            ${formData.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} 
            rounded-xl shadow-lg md:w-64 md:h-fit sticky top-4
          `}>
            <div className="p-6 border-b border-gray-200 hidden md:block">
              <h1 className="text-xl font-bold text-center">Settings</h1>
            </div>
            
            <div className="p-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-lg mb-2 transition-colors
                    ${activeSection === item.id 
                      ? formData.theme === 'dark'
                        ? 'bg-indigo-900 text-indigo-300' 
                        : 'bg-indigo-50 text-indigo-600'
                      : formData.theme === 'dark'
                        ? 'hover:bg-gray-700 text-gray-300'
                        : 'hover:bg-gray-100 text-gray-700'}
                  `}
                >
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg mr-3 ${
                      activeSection === item.id
                        ? 'bg-indigo-200 text-indigo-700'
                        : formData.theme === 'dark'
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-gray-200 text-gray-600'
                    }`}>
                      {item.icon}
                    </div>
                    {item.label}
                  </div>
                  <ChevronRight size={16} className={activeSection === item.id ? 'opacity-100' : 'opacity-0'} />
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings