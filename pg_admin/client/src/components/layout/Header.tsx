

"use client"

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { User, LogOut, Bell, Settings, ChevronDown, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status?: string;
  roleId?: number;
  role?: string;
}

export function Header() {
  const router = useRouter();
  const { logout } = useAuth();
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data from API
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
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
          setUserData(data.user);
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

  const handleLogout = async () => {
    try {
      Cookies.remove('token');
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('accessToken');
      logout();
      setProfileDropdownOpen(false);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Handle click outside of dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('profile-dropdown');
      const button = document.getElementById('profile-button');
      
      if (
        dropdown && 
        button && 
        !dropdown.contains(event.target as Node) && 
        !button.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get initials for avatar
  const getInitials = () => {
    if (!userData) return 'U';
    return `${userData.firstName?.charAt(0) || ''}${userData.lastName?.charAt(0) || ''}`;
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 shadow-sm z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo and Brand */}
        <Link 
          href="/" 
          className="flex items-center gap-3 hover:bg-blue-50 rounded-lg p-2 transition-all duration-200 group"
        >
          <div className="relative w-10 h-10 overflow-hidden rounded-lg shadow-md transition-transform duration-200 group-hover:scale-105">
            <Image
              src="/plogoTop.jpg"
              alt="Logo"
              fill
              className="object-cover"
            />
          </div>
          <div className="transition-all duration-200 group-hover:translate-x-1">
            <h1 className="text-lg font-bold text-gray-800 tracking-tight">Global Admin</h1>
            <p className="text-xs text-blue-600 font-medium">Paragon Group</p>
          </div>
        </Link>
        {/* Right Section */}
        <div className="flex items-center gap-3">
          <button className="relative p-2 hover:bg-blue-50 rounded-lg text-gray-500 transition-all duration-200 hover:text-blue-600 hover:scale-105">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>

          <Link 
            href="/settings" 
            className="p-2 hover:bg-blue-50 rounded-lg text-gray-500 transition-all duration-200 hover:text-blue-600 hover:scale-105"
          >
            <Settings size={20} />
          </Link>

          <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block" />

          <div className="relative">
            <button
              id="profile-button"
              onClick={() => setProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-3 hover:bg-blue-50 p-2 rounded-lg transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-md overflow-hidden transition-all duration-200 group-hover:scale-105">
                {isLoading ? (
                  <div className="w-full h-full bg-blue-500 flex items-center justify-center">
                    <Loader2 size={20} className="animate-spin text-white" />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-bold text-base">
                    {getInitials()}
                  </div>
                )}
              </div>
              <div className="text-right mr-2 transition-all duration-200 group-hover:translate-x-1">
                {isLoading ? (
                  <>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </>
                ) : error ? (
                  <>
                    <p className="font-medium text-gray-900">User</p>
                    <div className="text-xs text-gray-600">User</div>
                  </>
                ) : (
                  <>
                    <div className="text-sm font-semibold text-gray-800">{`${userData?.firstName} ${userData?.lastName}`}</div>
                    <div className="text-xs font-medium text-blue-600">{userData?.role || 'User'}</div>
                  </>
                )}
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 
                                   ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProfileDropdownOpen && (
              <div 
                id="profile-dropdown"
                className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border 
                        border-gray-100 py-2 z-50 transition-all duration-300 ease-in-out animate-fadeIn"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  {isLoading ? (
                    <div className="space-y-2">
                      <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ) : error ? (
                    <>
                      <p className="font-medium text-gray-900">User</p>
                      <div className="text-xs text-gray-600">User</div>
                    </>
                  ) : (
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {getInitials()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{`${userData?.firstName} ${userData?.lastName}`}</div>
                        <div className="text-sm font-medium text-blue-600">{userData?.role || 'User'}</div>
                        <div className="text-xs text-gray-500 mt-1">{userData?.email}</div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="py-2">
                  <Link 
                    href="/admin/settings" 
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-blue-50 text-gray-700 transition-colors duration-200"
                  >
                    <User size={16} className="text-gray-500" />
                    <span>Profile Settings</span>
                  </Link>
                  <Link 
                    href="/admin/settings" 
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-blue-50 text-gray-700 transition-colors duration-200"
                  >
                    <Settings size={16} className="text-gray-500" />
                    <span>Preferences</span>
                  </Link>
                </div>
                <div className="border-t border-gray-100 pt-2">
                  <button 
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left hover:bg-red-50 text-red-600 flex items-center gap-2 transition-colors duration-200"
                  >
                    <LogOut size={16} />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}