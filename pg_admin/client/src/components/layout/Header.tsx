"use client"

import { useState } from 'react'
import {
  Bell,
  Inbox,
  Users2,
  HelpCircle,
  MoreHorizontal,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useWebsite } from '@/providers/WebsiteProvider'
import Image from 'next/image'
import Link from 'next/link'

interface Website {
  id: number
  name: string
  slug: 'parasole' | 'paragon'
}

const websites: Website[] = [
  { id: 1, name: 'Parasole', slug: 'parasole' },
  { id: 2, name: 'Paragon Group', slug: 'paragon' }
]

// Custom App Launcher Icon
const AppsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 1C1.44772 1 1 1.44772 1 2V4C1 4.55228 1.44772 5 2 5H4C4.55228 5 5 4.55228 5 4V2C5 1.44772 4.55228 1 4 1H2Z" />
    <path d="M2 8C1.44772 8 1 8.44772 1 9V11C1 11.5523 1.44772 12 2 12H4C4.55228 12 5 11.5523 5 11V9C5 8.44772 4.55228 8 4 8H2Z" />
    <path d="M1 16C1 15.4477 1.44772 15 2 15H4C4.55228 15 5 15.4477 5 16V18C5 18.5523 4.55228 19 4 19H2C1.44772 19 1 18.5523 1 18V16Z" />
    <path d="M9 1C8.44772 1 8 1.44772 8 2V4C8 4.55228 8.44772 5 9 5H11C11.5523 5 12 4.55228 12 4V2C12 1.44772 11.5523 1 11 1H9Z" />
    <path d="M8 9C8 8.44772 8.44772 8 9 8H11C11.5523 8 12 8.44772 12 9V11C12 11.5523 11.5523 12 11 12H9C8.44772 12 8 11.5523 8 11V9Z" />
    <path d="M9 15C8.44772 15 8 15.4477 8 16V18C8 18.5523 8.44772 19 9 19H11C11.5523 19 12 18.5523 12 18V16C12 15.4477 11.5523 15 11 15H9Z" />
    <path d="M15 2C15 1.44772 15.4477 1 16 1H18C18.5523 1 19 1.44772 19 2V4C19 4.55228 18.5523 5 18 5H16C15.4477 5 15 4.55228 15 4V2Z" />
    <path d="M16 8C15.4477 8 15 8.44772 15 9V11C15 11.5523 15.4477 12 16 12H18C18.5523 12 19 11.5523 19 11V9C19 8.44772 18.5523 8 18 8H16Z" />
    <path d="M15 16C15 15.4477 15.4477 15 16 15H18C18.5523 15 19 15.4477 19 16V18C19 18.5523 18.5523 19 18 19H16C15.4477 19 15 18.5523 15 18V16Z" />
  </svg>
)

export function Header() {
  const { selectedWebsite, setSelectedWebsite } = useWebsite()
  const [isWebsiteDropdownOpen, setWebsiteDropdownOpen] = useState(false)
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false)

  const handleWebsiteSelect = (website: Website) => {
    setSelectedWebsite(website)
    setWebsiteDropdownOpen(false)
    window.location.href = `/admin/${website.slug}/home`
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="h-14 border-b flex items-center justify-between px-4 bg-white">
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className="flex items-center gap-3 hover:bg-gray-100 rounded-lg p-2 transition-colors duration-200"
          >
            <Image
              src="/plogoTop.jpg"
              alt="Logo"
              width={38}
              height={38}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Global Admin</h1>
              <p className="text-xs text-gray-500">Paragon Group</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {/* Website Selector - Brought back from original */}
          <div className="relative">
            <button
              onClick={() => setWebsiteDropdownOpen(!isWebsiteDropdownOpen)}
              className={`
                flex items-center gap-2 px-4 py-2.5 
                ${selectedWebsite ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-700'} 
                border border-gray-200 rounded-xl hover:bg-gray-100 
                transition-colors duration-200
              `}
            >
              <span>{selectedWebsite ? selectedWebsite.name : 'Select Website'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 
                ${isWebsiteDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isWebsiteDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border 
                           border-gray-100 py-2 z-50">
                {websites.map((website) => (
                  <button
                    key={website.id}
                    onClick={() => handleWebsiteSelect(website)}
                    className={`
                      w-full px-4 py-2.5 text-left flex items-center gap-2
                      ${selectedWebsite?.slug === website.slug 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-700 hover:bg-gray-50'}
                    `}
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      selectedWebsite?.slug === website.slug ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />
                    {website.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Inbox className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                    1
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Inbox</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Users2 className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Invite members & guests</TooltipContent>
            </Tooltip>

            <div className="h-8 w-px bg-gray-200 mx-1" />

            {/* User Profile Section - Kept Original Styling */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center 
                             justify-center text-white shadow-sm">
                  <User size={18} />
                </div>
                <div className="text-right mr-2">
                  <p className="text-sm font-medium text-gray-700">John Doe</p>
                  <p className="text-xs text-gray-500">Super Admin</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 
                                     ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-xl shadow-lg border 
                             border-gray-100 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-medium text-gray-900">John Doe</p>
                    <p className="text-sm text-gray-500">john.doe@paragon.com</p>
                  </div>
                  <div className="py-2">
                    <Link 
                      href="/admin/settings" 
                      className="block w-full px-4 py-2.5 text-left hover:bg-gray-50 text-gray-700"
                    >
                      Profile Settings
                    </Link>
                    <Link 
                      href="/admin/settings" 
                      className="block w-full px-4 py-2.5 text-left hover:bg-gray-50 text-gray-700"
                    >
                      Preferences
                    </Link>
                  </div>
                  <div className="border-t border-gray-100 pt-2">
                    <button className="w-full px-4 py-2.5 text-left hover:bg-red-50 text-red-600 flex items-center gap-2">
                      <LogOut size={18} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}