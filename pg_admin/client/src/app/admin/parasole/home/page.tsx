"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Layout, Home as HomeIcon, Settings, Menu, X } from "lucide-react";

// Use dynamic import to prevent hydration errors
const Home = dynamic(() => import("@/components/parasole/home/home").then(mod => ({ default: mod.Home })), { ssr: false });
const HomeDetails = dynamic(() => import("@/components/parasole/home/home-details"), { ssr: false });

export default function ParasoleHomePage() {
  const [activeTab, setActiveTab] = useState<"home" | "details">("home");
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Add animation class to body for page entrance
    document.body.classList.add('page-loaded');
    
    return () => {
      document.body.classList.remove('page-loaded');
    };
  }, []);

  if (!mounted) {
    // Return a placeholder during server-side rendering
    return <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100"></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 animate-fade-in">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm animate-slide-down">
        <div className="container mx-auto py-6 px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="bg-blue-100 p-2 rounded-lg mr-3 animate-pulse-soft">
                  <Layout className="h-6 w-6 text-blue-600" />
                </span>
                Parasole Home Management
              </h1>
              <p className="text-gray-500 mt-1">Manage and customize your website's home page</p>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="block md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {mobileMenuOpen ? 
                  <X className="h-6 w-6 text-gray-700" /> : 
                  <Menu className="h-6 w-6 text-gray-700" />
                }
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Tab Navigation with Better Design */}
        <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden animate-fade-in" style={{animationDelay: "200ms"}}>
          {/* Desktop Tabs */}
          <div className={`hidden md:flex border-b`}>
            <TabButton 
              isActive={activeTab === "home"} 
              onClick={() => setActiveTab("home")}
              icon={<HomeIcon className="h-5 w-5" />}
              label="Home"
            />
            <TabButton 
              isActive={activeTab === "details"} 
              onClick={() => setActiveTab("details")}
              icon={<Settings className="h-5 w-5" />}
              label="Home Details"
            />
          </div>
          
          {/* Mobile Tabs */}
          <div className={`flex flex-col md:hidden ${mobileMenuOpen ? 'border-b' : ''}`}>
            <TabButton 
              isActive={activeTab === "home"} 
              onClick={() => {
                setActiveTab("home");
                setMobileMenuOpen(false);
              }}
              icon={<HomeIcon className="h-5 w-5" />}
              label="Home"
              isMobile={true}
              isOpen={mobileMenuOpen}
              showAlways={true}
            />
            
            {mobileMenuOpen && (
              <TabButton 
                isActive={activeTab === "details"} 
                onClick={() => {
                  setActiveTab("details");
                  setMobileMenuOpen(false);
                }}
                icon={<Settings className="h-5 w-5" />}
                label="Home Details"
                isMobile={true}
                isOpen={mobileMenuOpen}
              />
            )}
          </div>
          
          {/* Tab Description Bar */}
          <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <p className="text-sm text-blue-800">
              {activeTab === "home" 
                ? "Manage the content items displayed on your homepage. Add, edit, or remove items as needed."
                : "Configure additional settings and properties for your homepage display."}
            </p>
          </div>
        </div>

        {/* Content Area with Smooth Transition */}
        <div className="relative min-h-[400px] animate-fade-in" style={{animationDelay: "400ms"}}>
          <div className={`transition-all duration-500 ${activeTab === "home" ? "opacity-100 z-10" : "opacity-0 z-0 absolute inset-0 pointer-events-none"}`}>
            {activeTab === "home" && <Home />}
          </div>
          <div className={`transition-all duration-500 ${activeTab === "details" ? "opacity-100 z-10" : "opacity-0 z-0 absolute inset-0 pointer-events-none"}`}>
            {activeTab === "details" && <HomeDetails />}
          </div>
        </div>
      </div>
      
      {/* Global animations */}
      <style jsx global>{`
        /* Page load animation */
        .animate-fade-in {
          opacity: 0;
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-slide-down {
          opacity: 0;
          transform: translateY(-10px);
          animation: slideDown 0.5s ease-out forwards;
        }
        
        .animate-pulse-soft {
          animation: pulseSoft 3s infinite ease-in-out;
        }
        
        /* Define the animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideDown {
          from { 
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulseSoft {
          0% { opacity: 0.8; }
          50% { opacity: 1; }
          100% { opacity: 0.8; }
        }
        
        /* Page transition effect */
        body.page-loaded {
          animation: pageFadeIn 0.8s ease-out;
        }
        
        @keyframes pageFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// Tab Button Component for better reusability
type TabButtonProps = {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  isMobile?: boolean;
  isOpen?: boolean;
  showAlways?: boolean;
};

function TabButton({ isActive, onClick, icon, label, isMobile = false, isOpen = true, showAlways = false }: TabButtonProps) {
  if (isMobile && !isOpen && !showAlways) return null;
  
  return (
    <button
      onClick={onClick}
      className={`
        relative px-6 py-4 flex items-center gap-2
        font-medium text-sm focus:outline-none transition-all duration-300
        ${isActive 
          ? "text-blue-700 bg-white" 
          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
        }
        ${isMobile ? "justify-start" : "justify-center flex-1"}
      `}
    >
      <div className={`transition-all duration-300 ${isActive ? "text-blue-600" : "text-gray-400"}`}>
        {icon}
      </div>
      {label}
      {isActive && (
        <div className={`absolute ${isMobile ? "left-0 top-0 h-full w-1" : "bottom-0 left-0 w-full h-0.5"} bg-blue-600`}></div>
      )}
    </button>
  );
}