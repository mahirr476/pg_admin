// src/components/users/ViewUserModal.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  Shield, 
  X, 
  User, 
  Mail, 
  Calendar, 
  Check, 
  Settings, 
  PieChart, 
  BarChart, 
  Users, 
  Globe, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";

const ViewUserModal = ({ showModal, setShowModal, viewingUser, getStatusColor, getRoleInfo }) => {
  if (!viewingUser) return null;

  // State for expanded/collapsed sections
  const [expandedSections, setExpandedSections] = useState({
    personalInfo: true,
    permissions: true,
    modules: {
      dashboard: true,
      analytics: true,
      settings: true,
      userManagement: true,
      pargon: true,
      parasole: true
    }
  });

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Toggle module expansion
  const toggleModule = (module) => {
    setExpandedSections(prev => ({
      ...prev,
      modules: {
        ...prev.modules,
        [module]: !prev.modules[module]
      }
    }));
  };

  // Get module icon based on module name
  const getModuleIcon = (module) => {
    switch(module) {
      case 'dashboard':
        return <BarChart className="h-4 w-4 text-blue-500" />;
      case 'analytics':
        return <PieChart className="h-4 w-4 text-indigo-500" />;
      case 'settings':
        return <Settings className="h-4 w-4 text-purple-500" />;
      case 'userManagement':
        return <Users className="h-4 w-4 text-green-500" />;
      case 'pargon':
      case 'parasole':
        return <Globe className="h-4 w-4 text-amber-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get module color based on module name
  const getModuleColor = (module) => {
    switch(module) {
      case 'dashboard':
        return 'from-blue-500 to-blue-600';
      case 'analytics':
        return 'from-indigo-500 to-indigo-600';
      case 'settings':
        return 'from-purple-500 to-purple-600';
      case 'userManagement':
        return 'from-green-500 to-green-600';
      case 'pargon':
        return 'from-amber-500 to-amber-600';
      case 'parasole':
        return 'from-pink-500 to-pink-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  // Format created date (assuming viewingUser has a createdAt property)
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Calculate permission count
  const getPermissionCount = () => {
    let count = 0;
    if (viewingUser.permissions) {
      Object.values(viewingUser.permissions).forEach(modulePerms => {
        if (Array.isArray(modulePerms)) {
          count += modulePerms.length;
        }
      });
    }
    return count;
  };

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden rounded-xl shadow-lg max-h-[90vh] flex flex-col">
        {/* Header with gradient background */}
        <DialogHeader className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white border-b-0">
          <div className="absolute top-3 right-3">
            <button 
              onClick={() => setShowModal(false)}
              className="text-white/80 hover:text-white transition-colors rounded-full p-1.5 hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="bg-white/15 p-3 rounded-xl">
              <User className="h-10 w-10" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center">
                {viewingUser.firstName} {viewingUser.lastName}
              </DialogTitle>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <div className={`px-3 py-1 text-xs font-semibold rounded-full ${getRoleInfo(viewingUser.roleId).color}`}>
                  {getRoleInfo(viewingUser.roleId).label}
                </div>
                <div className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(viewingUser.status)}`}>
                  {viewingUser.status.charAt(0).toUpperCase() + viewingUser.status.slice(1)}
                </div>
                <div className="text-white/80 text-sm flex items-center">
                  <Shield className="h-3.5 w-3.5 mr-1.5" />
                  {getPermissionCount()} Permissions
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        {/* Tabbed Content - Main scrollable area */}
        <div className="overflow-y-auto flex-grow custom-scrollbar">
          <div className="p-5 space-y-5">
            {/* User Information Section */}
            <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
              <div 
                className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('personalInfo')}
              >
                <div className="flex items-center">
                  <User className="h-4 w-4 text-indigo-600 mr-2" />
                  <h3 className="font-medium text-gray-800">User Information</h3>
                </div>
                {expandedSections.personalInfo ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </div>
              
              {expandedSections.personalInfo && (
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="bg-indigo-100 p-1.5 rounded-md">
                        <Shield className="h-4 w-4 text-indigo-600" />
                      </div>
                      <span className="text-gray-600 font-medium">User ID:</span>
                    </div>
                    <span className="font-semibold text-indigo-700">#{viewingUser.id}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Email</span>
                      </div>
                      <div className="font-medium text-gray-900 ml-6">{viewingUser.email}</div>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Created</span>
                      </div>
                      <div className="font-medium text-gray-900 ml-6">
                        {formatDate(viewingUser.createdAt || new Date().toISOString())}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Permissions Section */}
            <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
              <div 
                className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('permissions')}
              >
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-indigo-600 mr-2" />
                  <h3 className="font-medium text-gray-800">Access & Permissions</h3>
                </div>
                {expandedSections.permissions ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </div>
              
              {expandedSections.permissions && (
                <div className="p-5 space-y-3">
                  {/* Dashboard Module */}
                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <div 
                      className={`bg-gradient-to-r ${getModuleColor('dashboard')} px-4 py-2 text-white flex items-center justify-between cursor-pointer`}
                      onClick={() => toggleModule('dashboard')}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="bg-white/20 p-1 rounded">
                          {getModuleIcon('dashboard')}
                        </div>
                        <h4 className="font-medium">Dashboard</h4>
                      </div>
                      {expandedSections.modules.dashboard ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                    
                    {expandedSections.modules.dashboard && (
                      <div className="p-3 bg-white">
                        <div className="flex items-center space-x-3 p-2">
                          <div 
                            className={`h-5 w-5 rounded flex items-center justify-center ${
                              viewingUser.permissions?.analytics?.includes("dashboard") 
                                ? "bg-green-500 text-white" 
                                : "bg-gray-200 text-gray-400"
                            }`}
                          >
                            {viewingUser.permissions?.analytics?.includes("dashboard") && (
                              <Check className="h-3 w-3" />
                            )}
                          </div>
                          <span 
                            className={`${
                              viewingUser.permissions?.analytics?.includes("dashboard") 
                                ? "text-gray-900 font-medium" 
                                : "text-gray-500"
                            }`}
                          >
                            Dashboard Access
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Analytics Module */}
                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <div 
                      className={`bg-gradient-to-r ${getModuleColor('analytics')} px-4 py-2 text-white flex items-center justify-between cursor-pointer`}
                      onClick={() => toggleModule('analytics')}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="bg-white/20 p-1 rounded">
                          {getModuleIcon('analytics')}
                        </div>
                        <h4 className="font-medium">Analytics</h4>
                      </div>
                      {expandedSections.modules.analytics ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                    
                    {expandedSections.modules.analytics && (
                      <div className="p-3 bg-white">
                        <div className="flex items-center space-x-3 p-2">
                          <div 
                            className={`h-5 w-5 rounded flex items-center justify-center ${
                              viewingUser.permissions?.analytics?.includes("view") 
                                ? "bg-green-500 text-white" 
                                : "bg-gray-200 text-gray-400"
                            }`}
                          >
                            {viewingUser.permissions?.analytics?.includes("view") && (
                              <Check className="h-3 w-3" />
                            )}
                          </div>
                          <span 
                            className={`${
                              viewingUser.permissions?.analytics?.includes("view") 
                                ? "text-gray-900 font-medium" 
                                : "text-gray-500"
                            }`}
                          >
                            View Analytics
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Settings Module */}
                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <div 
                      className={`bg-gradient-to-r ${getModuleColor('settings')} px-4 py-2 text-white flex items-center justify-between cursor-pointer`}
                      onClick={() => toggleModule('settings')}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="bg-white/20 p-1 rounded">
                          {getModuleIcon('settings')}
                        </div>
                        <h4 className="font-medium">System Settings</h4>
                      </div>
                      {expandedSections.modules.settings ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                    
                    {expandedSections.modules.settings && (
                      <div className="p-3 bg-white">
                        <div className="grid grid-cols-2 gap-2">
                          {["view", "create", "edit"].map((permission) => {
                            const hasPermission = viewingUser.permissions?.settings?.includes(permission);
                            return (
                              <div key={permission} className="flex items-center space-x-3 p-2">
                                <div 
                                  className={`h-5 w-5 rounded flex items-center justify-center ${
                                    hasPermission 
                                      ? "bg-green-500 text-white" 
                                      : "bg-gray-200 text-gray-400"
                                  }`}
                                >
                                  {hasPermission && <Check className="h-3 w-3" />}
                                </div>
                                <span 
                                  className={`capitalize ${
                                    hasPermission 
                                      ? "text-gray-900 font-medium" 
                                      : "text-gray-500"
                                  }`}
                                >
                                  {permission}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* User Management Module */}
                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <div 
                      className={`bg-gradient-to-r ${getModuleColor('userManagement')} px-4 py-2 text-white flex items-center justify-between cursor-pointer`}
                      onClick={() => toggleModule('userManagement')}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="bg-white/20 p-1 rounded">
                          {getModuleIcon('userManagement')}
                        </div>
                        <h4 className="font-medium">User Management</h4>
                      </div>
                      {expandedSections.modules.userManagement ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                    
                    {expandedSections.modules.userManagement && (
                      <div className="p-3 bg-white">
                        <div className="grid grid-cols-2 gap-2">
                          {["view", "create", "edit", "delete"].map((permission) => {
                            const hasPermission = viewingUser.permissions?.user?.includes(permission);
                            return (
                              <div key={permission} className="flex items-center space-x-3 p-2">
                                <div 
                                  className={`h-5 w-5 rounded flex items-center justify-center ${
                                    hasPermission 
                                      ? "bg-green-500 text-white" 
                                      : "bg-gray-200 text-gray-400"
                                  }`}
                                >
                                  {hasPermission && <Check className="h-3 w-3" />}
                                </div>
                                <span 
                                  className={`capitalize ${
                                    hasPermission 
                                      ? "text-gray-900 font-medium" 
                                      : "text-gray-500"
                                  }`}
                                >
                                  {permission}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Pargon Website */}
                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <div 
                      className={`bg-gradient-to-r ${getModuleColor('pargon')} px-4 py-2 text-white flex items-center justify-between cursor-pointer`}
                      onClick={() => toggleModule('pargon')}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="bg-white/20 p-1 rounded">
                          {getModuleIcon('pargon')}
                        </div>
                        <h4 className="font-medium">Pargon Website</h4>
                      </div>
                      {expandedSections.modules.pargon ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                    
                    {expandedSections.modules.pargon && (
                      <div className="p-3 bg-white">
                        <div className="grid grid-cols-2 gap-2">
                          {["view", "create", "edit", "delete"].map((permission) => {
                            const hasPermission = viewingUser.permissions?.pargon?.includes(permission);
                            return (
                              <div key={permission} className="flex items-center space-x-3 p-2">
                                <div 
                                  className={`h-5 w-5 rounded flex items-center justify-center ${
                                    hasPermission 
                                      ? "bg-green-500 text-white" 
                                      : "bg-gray-200 text-gray-400"
                                  }`}
                                >
                                  {hasPermission && <Check className="h-3 w-3" />}
                                </div>
                                <span 
                                  className={`capitalize ${
                                    hasPermission 
                                      ? "text-gray-900 font-medium" 
                                      : "text-gray-500"
                                  }`}
                                >
                                  {permission}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Parasole Website */}
                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <div 
                      className={`bg-gradient-to-r ${getModuleColor('parasole')} px-4 py-2 text-white flex items-center justify-between cursor-pointer`}
                      onClick={() => toggleModule('parasole')}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="bg-white/20 p-1 rounded">
                          {getModuleIcon('parasole')}
                        </div>
                        <h4 className="font-medium">Parasole Website</h4>
                      </div>
                      {expandedSections.modules.parasole ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                    
                    {expandedSections.modules.parasole && (
                      <div className="p-3 bg-white">
                        <div className="grid grid-cols-2 gap-2">
                          {["view", "create", "edit", "delete"].map((permission) => {
                            const hasPermission = viewingUser.permissions?.parasole?.includes(permission);
                            return (
                              <div key={permission} className="flex items-center space-x-3 p-2">
                                <div 
                                  className={`h-5 w-5 rounded flex items-center justify-center ${
                                    hasPermission 
                                      ? "bg-green-500 text-white" 
                                      : "bg-gray-200 text-gray-400"
                                  }`}
                                >
                                  {hasPermission && <Check className="h-3 w-3" />}
                                </div>
                                <span 
                                  className={`capitalize ${
                                    hasPermission 
                                      ? "text-gray-900 font-medium" 
                                      : "text-gray-500"
                                  }`}
                                >
                                  {permission}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-end bg-gray-50">
          <Button
            onClick={() => setShowModal(false)}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-colors"
          >
            Close
          </Button>
        </div>
        
        {/* Custom Scrollbar Styles */}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #cbd5e1;
            border-radius: 3px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #94a3b8;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background-color: transparent;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
};

export default ViewUserModal;