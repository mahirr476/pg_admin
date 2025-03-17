

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
  Check,
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

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
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
  gradient?: boolean;
  color?: 'indigo' | 'blue' | 'green' | 'red' | 'orange' | 'purple';
  icon?: React.ReactNode;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

interface SectionCardProps {
  children: React.ReactNode;
  title?: string;
  gradient?: boolean;
  color?: 'indigo' | 'blue' | 'purple' | 'teal';
  icon?: React.ReactNode;
}

// Toast notification component
const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50" style={{ animation: 'slideInRight 0.3s ease-out forwards' }}>
      <div className={`
        rounded-xl shadow-xl p-4 flex items-center min-w-80
        ${type === 'success' 
          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
          : 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
        }
      `}>
        <div className="mr-3 bg-white bg-opacity-20 p-2 rounded-full">
          {type === 'success' ? (
            <Check size={18} className="text-white" />
          ) : (
            <X size={18} className="text-white" />
          )}
        </div>
        <p className="font-medium">{message}</p>
        <button 
          onClick={onClose} 
          className="ml-auto p-1 rounded-full hover:bg-white hover:bg-opacity-20"
        >
          <X size={16} className="text-white" />
        </button>
      </div>
    </div>
  );
};

// Button component
const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  disabled, 
  gradient = true, 
  color = "indigo", 
  icon, 
  children,
  type = "button" 
}) => {
  const baseClasses = "px-5 py-3 rounded-xl hover:shadow-lg focus:outline-none transition-all duration-200 font-medium flex items-center";
  
  const colorClasses = {
    indigo: gradient 
      ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90 text-white" 
      : "bg-indigo-600 hover:bg-indigo-700 text-white",
    blue: gradient 
      ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-90 text-white" 
      : "bg-blue-600 hover:bg-blue-700 text-white",
    green: gradient 
      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white" 
      : "bg-emerald-600 hover:bg-emerald-700 text-white",
    red: gradient 
      ? "bg-gradient-to-r from-red-500 to-rose-600 hover:opacity-90 text-white" 
      : "bg-red-600 hover:bg-red-700 text-white",
    orange: gradient 
      ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 text-white" 
      : "bg-orange-600 hover:bg-orange-500 text-white",
    purple: gradient 
      ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white" 
      : "bg-purple-600 hover:bg-purple-700 text-white",
  };

  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${colorClasses[color]} ${disabled ? 'opacity-70 cursor-not-allowed' : 'shadow-md'}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

// Input field component
const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  name, 
  type = "text", 
  value, 
  icon, 
  placeholder, 
  onChange 
}) => (
  <div>
    <label className="block mb-2 text-sm font-semibold text-gray-700">{label}</label>
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
        className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border border-gray-300 rounded-xl focus:ring-3 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all duration-200 bg-gray-50`}
        placeholder={placeholder}
      />
    </div>
  </div>
);

// Section card component
const SectionCard: React.FC<SectionCardProps> = ({ 
  children, 
  title, 
  gradient = true, 
  color = "indigo", 
  icon 
}) => {
  const headerClasses = {
    indigo: gradient 
      ? "bg-gradient-to-r from-indigo-600 to-violet-600" 
      : "bg-indigo-600",
    blue: gradient 
      ? "bg-gradient-to-r from-blue-600 to-cyan-600" 
      : "bg-blue-600",
    purple: gradient 
      ? "bg-gradient-to-r from-purple-600 to-pink-600" 
      : "bg-purple-600",
    teal: gradient 
      ? "bg-gradient-to-r from-teal-600 to-emerald-600" 
      : "bg-teal-600",
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {title && (
        <div className={`${headerClasses[color]} p-6`}>
          <div className="flex items-center">
            {icon && <span className="mr-3 text-white opacity-90">{icon}</span>}
            <div>
              <h2 className="text-2xl font-bold text-white">{title}</h2>
              <p className={`mt-1 text-${color}-200`}>Manage your settings</p>
            </div>
          </div>
        </div>
      )}
      <div className="p-8">
        {children}
      </div>
    </div>
  );
};

// Toggle switch component
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
  label, 
  description, 
  name, 
  checked, 
  onChange 
}) => (
  <div className="flex items-center justify-between p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
    <div className="flex items-center">
      <div className="mr-4">
        <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
        <p className="text-gray-500 text-sm mt-1">{description}</p>
      </div>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only peer" 
      />
      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-3 peer-focus:ring-indigo-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-indigo-600 peer-checked:to-violet-600"></div>
    </label>
  </div>
);

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
  
  // Toast state
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Show toast function
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ ...toast, show: false });
    }, 4000);
  };

  // Custom CSS for toast animation
  useEffect(() => {
    // Add the animation keyframes to the document
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes slideInRight {
        from {
          transform: translateX(300px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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
        const errorMsg = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMsg);
        showToast(errorMsg, 'error');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);

  // Update user profile
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
        showToast('Profile updated successfully!', 'success');
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      const errorMsg = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle password change
  const handlePasswordChange = async (): Promise<void> => {
    // Reset states
    setPasswordChangeSuccess(false);
    setPasswordChangeError(null);
    
    // Validate passwords
    if (!formData.currentPassword) {
      setPasswordChangeError('Current password is required');
      showToast('Current password is required', 'error');
      return;
    }
    
    if (!formData.newPassword) {
      setPasswordChangeError('New password is required');
      showToast('New password is required', 'error');
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordChangeError('New passwords do not match');
      showToast('New passwords do not match', 'error');
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
        showToast('Password updated successfully!', 'success');
      } else {
        throw new Error(data.message || 'Failed to change password');
      }
    } catch (err) {
      console.error('Error changing password:', err);
      const errorMsg = err instanceof Error ? err.message : 'An unknown error occurred';
      setPasswordChangeError(errorMsg);
      showToast(errorMsg, 'error');
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

  const renderContent = () => {
    switch(activeSection) {
      case 'profile':
        return (
          <SectionCard color="indigo" icon={<User size={24} />} title="Profile Information">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-12 py-24">
                <Loader2 size={48} className="animate-spin text-indigo-600 mb-4" />
                <p className="text-gray-600 font-medium">Loading profile information...</p>
              </div>
            ) : error ? (
              <div className="text-center p-12 py-16">
                <div className="w-20 h-20 mx-auto flex items-center justify-center bg-red-100 rounded-full mb-6">
                  <AlertCircle size={32} className="text-red-600" />
                </div>
                <p className="text-red-600 font-medium mb-6">{error}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  color="red"
                  icon={<AlertCircle size={18} />}
                >
                  Retry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleProfileSubmit}>
                <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
                  <div className="md:w-1/3 w-full flex flex-col items-center">
                    <div className="relative group">
                      <div className="w-32 h-32 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                        {formData.firstName.charAt(0) || ''}{formData.lastName.charAt(0) || ''}
                      </div>
                      <button 
                        type="button"
                        className="absolute bottom-0 right-0 bg-white text-indigo-600 p-2 rounded-full hover:bg-indigo-100 transition-colors shadow-md"
                      >
                        <Camera size={18} />
                      </button>
                    </div>
                    <p className="text-gray-500 text-sm mt-4 text-center">
                      Upload a profile picture
                    </p>
                  </div>
                  
                  <div className="md:w-2/3 w-full space-y-6">
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
                    
                    <div className="pt-4 flex justify-end">
                      <Button 
                        type="submit"
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
          <SectionCard color="blue" icon={<ShieldCheck size={24} />} title="Security Settings">
            <div className="space-y-8">
              <div className="p-6 bg-blue-50 rounded-xl relative overflow-hidden">
                <h3 className="text-xl font-semibold text-blue-800 mb-6 flex items-center">
                  <Lock size={20} className="mr-2 text-blue-600" />
                  Change Password
                </h3>
                
                <div className="space-y-6">
                  <InputField
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    icon={<Lock size={16} />}
                    placeholder="Enter current password"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  
                  <div className="pt-3 flex justify-end">
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
              
              <div className="p-6 bg-orange-50 rounded-xl relative overflow-hidden">
                <h3 className="text-xl font-semibold text-orange-800 mb-4 flex items-center">
                  <ShieldCheck size={20} className="mr-2 text-orange-600" />
                  Two-Factor Authentication
                </h3>
                <p className="text-gray-700 mb-6">Add an extra layer of security to your account by enabling two-factor authentication.</p>
                
                <Button color="orange" icon={<ShieldCheck size={18} />}>
                  Enable 2FA
                </Button>
              </div>
            </div>
          </SectionCard>
        );
      
      case 'notifications':
        return (
          <SectionCard color="purple" icon={<Bell size={24} />} title="Notification Preferences">
            <div className="space-y-6">
              <ToggleSwitch
                label="Email Notifications"
                description="Receive notifications via email"
                name="emailNotifications"
                checked={formData.emailNotifications}
                onChange={handleInputChange}
              />
              
              <ToggleSwitch
                label="Push Notifications"
                description="Receive notifications on your device"
                name="pushNotifications"
                checked={formData.pushNotifications}
                onChange={handleInputChange}
              />
              
              <div className="pt-4 flex justify-end">
                <Button color="purple" icon={<Save size={18} />}>
                  Save Preferences
                </Button>
              </div>
            </div>
          </SectionCard>
        );
      
      case 'settings':
        return (
          <SectionCard color="teal" icon={<PenTool size={24} />} title="Application Preferences">
            <div className="space-y-8">
              <div className="p-6 bg-white rounded-xl shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-200">
                <div className="flex items-center">
                  <div className="p-4 bg-blue-50 rounded-xl mr-5 text-blue-600">
                    <Globe size={24} />
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
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-3 focus:ring-teal-200 focus:border-teal-500 outline-none transition-all duration-200 bg-gray-50 text-gray-700 min-w-40"
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                </select>
              </div>
              
              <div className="p-6 bg-white rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:shadow-md transition-all duration-200">
                <div className="flex items-center">
                  <div className="p-4 bg-purple-50 rounded-xl mr-5 text-purple-600">
                    {formData.theme === 'dark' ? (
                      <Moon size={24} />
                    ) : (
                      <Sun size={24} />
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
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Sun size={18} className="mr-2" />
                    Light
                  </button>
                  <button 
                    onClick={() => setFormData({...formData, theme: 'dark'})}
                    className={`px-5 py-3 rounded-xl flex items-center transition-all duration-200 ${
                      formData.theme === 'dark' 
                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Moon size={18} className="mr-2" />
                    Dark
                  </button>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button color="teal" icon={<Save size={18} />}>
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 px-3 py-8 mx-[-15px] mt-[-8px]">
      {/* Toast notifications */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
      
      <div className="max-w-screen-2xl mx-auto">
        {/* Mobile Menu Button - Only visible on small screens */}
        <div className="md:hidden flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Settings</h1>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg"
          >
            {mobileMenuOpen ? <X size={24} /> : <SettingsIcon size={24} />}
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className={`
            ${mobileMenuOpen ? 'block' : 'hidden'} md:block
            w-full md:w-72 bg-white rounded-2xl shadow-xl overflow-hidden sticky top-4
          `}>
            <div className="hidden md:block p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-indigo-600">Settings</h2>
              <p className="text-gray-600 mt-1">Manage your account</p>
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
                    w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 mb-2
                    ${activeSection === item.id 
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md' 
                      : 'hover:bg-indigo-50 text-gray-700'}
                  `}
                >
                  <div className="flex items-center">
                    <div className={`mr-4 ${activeSection === item.id ? 'bg-white bg-opacity-20' : 'bg-indigo-100'} p-3 rounded-xl`}>
                      {item.icon}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{item.label}</div>
                      <div className={`text-xs ${activeSection === item.id ? 'text-indigo-100' : 'text-gray-500'}`}>
                        {item.description}
                      </div>
                    </div>
                  </div>
                  {activeSection === item.id && <ChevronRight size={20} className="text-white" />}
                </button>
              ))}
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 transition-all duration-300">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;