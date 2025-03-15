"use client"

import React, { useState, useEffect } from 'react'
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
  X,
  Loader2,
  CheckCircle,
  Camera,
  ShieldCheck,
  AlertCircle,
  PenTool
} from 'lucide-react'
import Cookies from 'js-cookie';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
}

interface FormDataState {
  firstName: string;
  lastName: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  language: string;
  theme: 'light' | 'dark';
  emailNotifications: boolean;
  pushNotifications: boolean;
}

interface MenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
}

interface SuccessMessageProps {
  message: string;
}

interface ErrorMessageProps {
  message: string;
}

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  icon?: React.ReactNode;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface ToggleSwitchProps {
  label: string;
  description: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface ButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  color?: 'indigo' | 'blue' | 'green' | 'red' | 'orange' | 'purple';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

interface SectionCardProps {
  children: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
}

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('profile');
  const [formData, setFormData] = useState<FormDataState>({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    language: 'english',
    theme: 'light',
    emailNotifications: true,
    pushNotifications: false
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState<boolean>(false);
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);

  // Fetch user profile data from API
  useEffect(() => {
    const fetchUserProfile = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('http://localhost:7000/api/v1/user/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken') || Cookies.get('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        
        const data = await response.json();
        
        if (data.status === 'success' && data.user) {
          // Update form data with user profile information
          setFormData(prevData => ({
            ...prevData,
            firstName: data.user.firstName || '',
            lastName: data.user.lastName || '',
            email: data.user.email || ''
          }));
        } else {
          throw new Error(data.message || 'Failed to retrieve user data');
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);

  // Function to update user profile
  const updateUserProfile = async (profileData: FormDataState): Promise<void> => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      const response = await fetch('http://localhost:7000/api/v1/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || Cookies.get('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          email: profileData.email
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        setSaveSuccess(true);
        // Reset success message after 3 seconds
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Function to handle password change
  const handlePasswordChange = async (): Promise<void> => {
    // Reset states
    setPasswordChangeSuccess(false);
    setPasswordChangeError(null);
    
    // Validate passwords
    if (!formData.currentPassword) {
      setPasswordChangeError('Current password is required');
      return;
    }
    
    if (!formData.newPassword) {
      setPasswordChangeError('New password is required');
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordChangeError('New passwords do not match');
      return;
    }
    
    setIsChangingPassword(true);
    
    try {
      const response = await fetch('http://localhost:7000/api/v1/user/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || Cookies.get('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }
      
      if (data.status === 'success') {
        // Clear password fields
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        setPasswordChangeSuccess(true);
        // Reset success message after 3 seconds
        setTimeout(() => setPasswordChangeSuccess(false), 3000);
      } else {
        throw new Error(data.message || 'Failed to change password');
      }
    } catch (err) {
      console.error('Error changing password:', err);
      setPasswordChangeError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleProfileSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    updateUserProfile(formData);
  };

  const menuItems: MenuItem[] = [
    { 
      id: 'profile', 
      icon: <User size={20} />, 
      label: 'Profile',
      description: 'Manage your personal information'
    },
    { 
      id: 'security', 
      icon: <Lock size={20} />, 
      label: 'Security',
      description: 'Update password and security settings'
    },
    { 
      id: 'notifications', 
      icon: <Bell size={20} />, 
      label: 'Notifications',
      description: 'Control how you receive alerts'
    },
    { 
      id: 'settings', 
      icon: <SettingsIcon size={20} />, 
      label: 'Preferences',
      description: 'Customize your application experience'
    }
  ];

  // Success message component
  const SuccessMessage: React.FC<SuccessMessageProps> = ({ message }) => (
    <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center animate-fadeIn">
      <CheckCircle size={20} className="mr-3 text-emerald-500" />
      <span>{message}</span>
    </div>
  );

  // Error message component
  const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center animate-fadeIn">
      <AlertCircle size={20} className="mr-3 text-red-500" />
      <span>{message}</span>
    </div>
  );

  // Input field component
  const InputField: React.FC<InputFieldProps> = ({ label, name, type = "text", value, icon, placeholder, onChange }) => (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition-all duration-200 shadow-sm`}
          placeholder={placeholder}
        />
      </div>
    </div>
  );

  // Toggle switch component
  const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, description, name, checked, onChange }) => (
    <div className="flex items-center justify-between p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      <div>
        <h3 className="text-lg font-medium text-gray-800">{label}</h3>
        <p className="text-gray-500 text-sm mt-1">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          name={name}
          checked={checked}
          onChange={onChange}
          className="sr-only peer" 
        />
        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:shadow-sm after:transition-all peer-checked:bg-indigo-500"></div>
      </label>
    </div>
  );

  // Button component
  const Button: React.FC<ButtonProps> = ({ onClick, disabled, color = "indigo", icon, children }) => {
    const colorClasses = {
      indigo: "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-300",
      blue: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-300",
      green: "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-300",
      red: "bg-red-600 hover:bg-red-700 focus:ring-red-300",
      orange: "bg-orange-600 hover:bg-orange-500 focus:ring-orange-300",
      purple: "bg-purple-600 hover:bg-purple-700 focus:ring-purple-300",
    };

    return (
      <button 
        onClick={onClick}
        disabled={disabled}
        className={`${colorClasses[color]} text-white px-5 py-3 rounded-xl hover:shadow-lg focus:ring-4 focus:outline-none transition-all duration-200 font-medium flex items-center ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </button>
    );
  };

  // Card component for sections
  const SectionCard: React.FC<SectionCardProps> = ({ children, title, icon = null }) => (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 transition-all duration-300 hover:shadow-2xl">
      {title && (
        <div className="flex items-center mb-8">
          {icon && <div className="p-3 bg-indigo-100 rounded-xl mr-4 text-indigo-600">{icon}</div>}
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        </div>
      )}
      {children}
    </div>
  );

  const renderContent = () => {
    switch(activeSection) {
      case 'profile':
        return (
          <SectionCard title="Profile Information" icon={<User size={24} />}>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-16">
                <Loader2 size={48} className="animate-spin text-indigo-600 mb-4" />
                <p className="text-gray-600 text-lg">Loading your profile...</p>
              </div>
            ) : error ? (
              <div className="p-8 bg-red-50 rounded-xl text-center">
                <p className="text-red-600 font-medium text-lg mb-4">{error}</p>
                <Button 
                  onClick={() => window.location.reload()}
                  color="red"
                >
                  Retry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleProfileSubmit}>
                {saveSuccess && (
                  <SuccessMessage message="Profile updated successfully!" />
                )}
                
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3 flex flex-col items-center">
                    <div className="relative group">
                      <div className="w-40 h-40 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-lg transform transition-all duration-300 group-hover:scale-105">
                        {formData.firstName.charAt(0) || ''}{formData.lastName.charAt(0) || ''}
                      </div>
                      <button 
                        type="button"
                        className="absolute bottom-4 right-0 bg-white text-indigo-600 p-3 rounded-full hover:bg-indigo-100 transition-colors duration-200 shadow-md transform transition-transform group-hover:scale-110"
                      >
                        <Camera size={20} />
                      </button>
                    </div>
                    <p className="text-gray-500 text-sm mt-4 text-center bg-gray-50 p-3 rounded-xl">
                      Upload a profile picture<br />JPG, GIF or PNG. 1MB max.
                    </p>
                  </div>
                  
                  <div className="md:w-2/3 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        icon={<User size={16} />}
                        placeholder="Enter your first name"
                      />
                      
                      <InputField
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        icon={<User size={16} />}
                        placeholder="Enter your last name"
                      />
                    </div>
                    
                    <InputField
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      icon={<Mail size={16} />}
                      placeholder="Enter your email"
                    />
                    
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Bio</label>
                      <textarea
                        name="bio"
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition-all duration-200 shadow-sm"
                        placeholder="Tell us about yourself..."
                      ></textarea>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <Button 
                        onClick={handleProfileSubmit} 
                        disabled={isSaving}
                        icon={isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </SectionCard>
        );
      
      case 'security':
        return (
          <SectionCard title="Security Settings" icon={<ShieldCheck size={24} />}>
            <div className="space-y-8">
              <div className="p-8 bg-indigo-50 rounded-xl border border-indigo-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full -mr-16 -mt-16 opacity-70"></div>
                
                <h3 className="text-xl font-semibold text-indigo-800 mb-4 relative z-10">Change Password</h3>
                
                {passwordChangeSuccess && (
                  <SuccessMessage message="Password updated successfully!" />
                )}
                
                {passwordChangeError && (
                  <ErrorMessage message={passwordChangeError} />
                )}
                
                <div className="space-y-5 relative z-10">
                  <InputField
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    icon={<Lock size={16} />}
                    placeholder="Enter current password"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField
                      label="New Password"
                      name="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      icon={<Lock size={16} />}
                      placeholder="Enter new password"
                    />
                    <InputField
                      label="Confirm New Password"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      icon={<Lock size={16} />}
                      placeholder="Confirm new password"
                    />
                  </div>
                  
                  <div className="pt-3">
                    <Button 
                      onClick={handlePasswordChange}
                      disabled={isChangingPassword}
                      color="blue"
                      icon={isChangingPassword ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
                    >
                      {isChangingPassword ? 'Updating...' : 'Update Password'}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-8 bg-orange-50 rounded-xl border border-orange-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full -mr-16 -mt-16 opacity-70"></div>
                
                <h3 className="text-xl font-semibold text-orange-800 mb-4 relative z-10">Two-Factor Authentication</h3>
                <p className="text-gray-700 mb-6 relative z-10 max-w-2xl">Add an extra layer of security to your account by enabling two-factor authentication. You'll be required to enter a code from your phone each time you sign in.</p>
                
                <Button color="orange" icon={<ShieldCheck size={18} />}>
                  Enable 2FA
                </Button>
              </div>
            </div>
          </SectionCard>
        );
      
      case 'notifications':
        return (
          <SectionCard title="Notification Preferences" icon={<Bell size={24} />}>
            <div className="space-y-6">
              <ToggleSwitch
                label="Email Notifications"
                description="Receive notifications via email"
                name="emailNotifications"
                checked={formData.emailNotifications}
                onChange={handleInputChange}
              />
              
              {formData.emailNotifications && (
                <div className="mt-4 space-y-4 pl-6 border-l-3 border-indigo-200 ml-3">
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200">
                    <input 
                      type="checkbox" 
                      id="updates" 
                      className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="updates" className="ml-3 text-gray-700 font-medium">
                      Product updates
                    </label>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200">
                    <input 
                      type="checkbox" 
                      id="security" 
                      className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="security" className="ml-3 text-gray-700 font-medium">
                      Security alerts
                    </label>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200">
                    <input 
                      type="checkbox" 
                      id="newsletter" 
                      className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="newsletter" className="ml-3 text-gray-700 font-medium">
                      Newsletter
                    </label>
                  </div>
                </div>
              )}
              
              <ToggleSwitch
                label="Push Notifications"
                description="Receive notifications on your device"
                name="pushNotifications"
                checked={formData.pushNotifications}
                onChange={handleInputChange}
              />
              
              <div className="flex justify-end pt-4">
                <Button icon={<Save size={18} />}>
                  Save Preferences
                </Button>
              </div>
            </div>
          </SectionCard>
        );
      
      case 'settings':
        return (
          <SectionCard title="Application Preferences" icon={<PenTool size={24} />}>
            <div className="space-y-8">
              <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-200">
                <div className="flex items-center">
                  <div className="p-4 bg-blue-50 rounded-xl mr-5 text-blue-600">
                    <Globe size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Language</h3>
                    <p className="text-gray-600 text-sm mt-1">Select your preferred language</p>
                  </div>
                </div>
                <select 
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition-all duration-200 shadow-sm text-gray-700 min-w-[160px]"
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                </select>
              </div>
              
              <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:shadow-md transition-all duration-200">
                <div className="flex items-center">
                  <div className="p-4 bg-purple-50 rounded-xl mr-5 text-purple-600">
                    {formData.theme === 'dark' ? (
                      <Moon size={28} />
                    ) : (
                      <Sun size={28} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Theme</h3>
                    <p className="text-gray-600 text-sm mt-1">Choose light or dark theme</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setFormData({...formData, theme: 'light'})}
                    className={`px-5 py-3 rounded-xl flex items-center transition-all duration-200 ${
                      formData.theme === 'light' 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Sun size={16} className="mr-2" />
                    Light
                  </button>
                  <button 
                    onClick={() => setFormData({...formData, theme: 'dark'})}
                    className={`px-5 py-3 rounded-xl flex items-center transition-all duration-200 ${
                      formData.theme === 'dark' 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Moon size={16} className="mr-2" />
                    Dark
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button icon={<Save size={18} />}>
                  Save Preferences
                </Button>
              </div>
            </div>
          </SectionCard>
        );
      
      default:
        return null;
    }
  };

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  return (
    <div className={`min-h-screen ${formData.theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-800'} p-4 md:p-8`}>
      <div className="max-w-6xl mx-auto">
        {/* Mobile Menu Button - Only visible on small screens */}
        <div className="md:hidden mb-5 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">Settings</h1>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-200 shadow-md"
          >
            {mobileMenuOpen ? <X size={20} /> : <SettingsIcon size={20} />}
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation - Transforms to top menu on mobile */}
          <div className={`
            ${mobileMenuOpen ? 'block' : 'hidden'} md:block
            ${formData.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} 
            rounded-2xl shadow-xl md:w-72 md:h-fit sticky top-4 border border-gray-200 overflow-hidden
          `}>
            <div className="p-6 border-b border-gray-200 hidden md:block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text text-center">Settings</h1>
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
                    w-full flex items-center justify-between p-4 rounded-xl mb-3 transition-all duration-200
                    ${activeSection === item.id 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md transform -translate-y-px'
                      : formData.theme === 'dark'
                        ? 'hover:bg-gray-700 text-gray-300'
                        : 'hover:bg-gray-100 text-gray-700'}
                  `}
                >
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg mr-3 ${
                      activeSection === item.id
                        ? 'bg-white bg-opacity-20'
                        : formData.theme === 'dark'
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-indigo-100 text-indigo-600'
                    }`}>
                      {item.icon}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{item.label}</div>
                      <div className={`text-xs ${activeSection === item.id ? 'text-indigo-100' : 'text-gray-500'}`}>
                        {item.description}
                      </div>
                    </div>
                  </div>
                  {activeSection === item.id && <ChevronRight size={18} />}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 animate-fadeIn">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;