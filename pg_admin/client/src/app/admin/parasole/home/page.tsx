
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Layout, Home as HomeIcon, Settings, Menu, X, ChevronRight, ExternalLink, Sun } from "lucide-react";

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
    <div className="min-h-screen bg-pattern overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full filter blur-3xl translate-y-1/3 -translate-x-1/4"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10">
        {/* Page Header */}
        <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-md animate-slide-down sticky top-0 z-20">
          <div className="container mx-auto py-5 px-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="relative mr-4">
                  <div className="absolute inset-0 bg-blue-600 rounded-xl blur-sm animate-pulse-glow"></div>
                  <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 p-3 rounded-xl shadow-lg animate-float">
                    <Layout className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                    Parasole Home
                  </h1>
                  <p className="text-gray-500 text-sm mt-0.5 flex items-center">
                    <Sun className="h-3 w-3 mr-1 text-amber-500" /> 
                    Manage and customize your website's home page
                  </p>
                </div>
              </div>
              
              {/* Mobile Menu Button */}
              <div className="block md:hidden">
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm"
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
          {/* Tab Navigation with Unique Design */}
          <div className="relative p-1.5 rounded-2xl shadow-lg mb-8 animate-fade-in bg-white/80 backdrop-blur-md overflow-hidden" style={{animationDelay: "200ms"}}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-60"></div>
            
            {/* Desktop Tabs */}
            <div className="hidden md:flex relative z-10">
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
            <div className={`flex flex-col relative z-10 md:hidden`}>
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
            <div className="px-6 py-3 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border-t border-blue-100/50 relative z-10">
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
      </div>
      
      {/* Global animations and styles */}
      <style jsx global>{`
        /* Background pattern */
        .bg-pattern {
          background-color: #f8fafc;
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        
        /* Animations */
        .animate-fade-in {
          opacity: 0;
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-slide-down {
          opacity: 0;
          transform: translateY(-10px);
          animation: slideDown 0.5s ease-out forwards;
        }
        
        .animate-pulse-glow {
          animation: pulseGlow 2s infinite ease-in-out;
        }
        
        .animate-float {
          animation: float 3s infinite ease-in-out;
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
        
        @keyframes pulseGlow {
          0% { opacity: 0.5; }
          50% { opacity: 0.8; }
          100% { opacity: 0.5; }
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
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

// Enhanced Tab Button Component
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
        font-medium focus:outline-none transition-all duration-300
        ${isActive 
          ? "text-white" 
          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50/50"
        }
        ${isMobile ? "justify-start" : "justify-center flex-1"}
      `}
    >
      {/* Active tab background effect */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md transition-all duration-300"></div>
      )}
      
      <div className={`relative z-10 transition-all duration-300 flex items-center gap-2`}>
        <span className={`${isActive ? "text-white" : "text-gray-400"}`}>
          {icon}
        </span>
        <span>{label}</span>
        {isActive && !isMobile && (
          <span className="ml-1 bg-white/30 text-white text-xs px-1.5 py-0.5 rounded-full font-normal">
            active
          </span>
        )}
      </div>
    </button>
  );
}