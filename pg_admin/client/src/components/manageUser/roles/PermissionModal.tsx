// PermissionModal.tsx
import React, { useState } from "react";
import { Key, X, Save, Shield, Users, Settings, Globe, PieChart, Check, AlertTriangle, ChevronDown, ChevronUp, Lock } from "lucide-react";

interface Role {
  id: string | number;
  name: string;
  role: string;
  permissions: {
    pargon: string[];
    parasole: string[];
    user: string[];
    settings: string[];
    analytics: string[];
  };
}

interface PermissionModalProps {
  selectedRole: Role | null;
  permissionOptions: Record<string, string[]>;
  handlePermissionChange: (module: string, permission: string) => void;
  handlePermissionSave: () => void;
  setShowPermissionModal: (show: boolean) => void;
  setSelectedRole: (role: Role | null) => void;
}

interface Module {
  key: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  permissions: string[];
}

const PermissionModal: React.FC<PermissionModalProps> = ({
  selectedRole,
  permissionOptions,
  handlePermissionChange,
  handlePermissionSave,
  setShowPermissionModal,
  setSelectedRole,
}) => {
  // State for expanded/collapsed sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    analytics: true,
    settings: true,
    user: true,
    pargon: true,
    parasole: true
  });

  // Toggle section expansion
  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Safely handle potentially null/undefined selectedRole
  if (!selectedRole) {
    return null;
  }
  
  // Handle permissions that might be null or undefined
  const safePermissions = selectedRole?.permissions || {
    pargon: [],
    parasole: [],
    user: [],
    settings: [],
    analytics: []
  };

  // Safely access the name property
  const roleName = selectedRole?.name || "Unknown Role";
  
  // Function to get total permissions granted
  const getTotalPermissions = () => {
    let count = 0;
    Object.values(safePermissions).forEach(permArray => {
      count += permArray.length;
    });
    return count;
  };

  // Module definitions with icons, gradients, and descriptions
  const modules: Module[] = [
    {
      key: "analytics",
      name: "Analytics & Dashboard",
      description: "Access to data visualization and analytics features",
      icon: <PieChart className="h-5 w-5" />,
      gradient: "from-blue-600 to-sky-500",
      permissions: safePermissions.analytics || []
    },
    {
      key: "settings",
      name: "System Settings",
      description: "Manage system configuration and preferences",
      icon: <Settings className="h-5 w-5" />,
      gradient: "from-violet-600 to-purple-600",
      permissions: safePermissions.settings || []
    },
    {
      key: "user",
      name: "User Management",
      description: "Control user accounts and access privileges",
      icon: <Users className="h-5 w-5" />,
      gradient: "from-emerald-600 to-teal-500",
      permissions: safePermissions.user || []
    },
    {
      key: "pargon",
      name: "Pargon Website",
      description: "Manage content and features of the Pargon website",
      icon: <Globe className="h-5 w-5" />,
      gradient: "from-amber-500 to-orange-600",
      permissions: safePermissions.pargon || []
    },
    {
      key: "parasole",
      name: "Parasole Website",
      description: "Manage content and features of the Parasole website",
      icon: <Globe className="h-5 w-5" />,
      gradient: "from-pink-500 to-rose-600",
      permissions: safePermissions.parasole || []
    }
  ];

  // Get permission description
  const getPermissionDescription = (permission: string) => {
    switch(permission) {
      case "view": 
        return "View content and data";
      case "create": 
        return "Create new entries";
      case "edit": 
        return "Modify existing content";
      case "delete": 
        return "Remove content permanently";
      case "dashboard": 
        return "Access analytics dashboard";
      default: 
        return "";
    }
  };

  // Determine if a section has any permissions
  const hasAnyPermission = (moduleKey: string) => {
    return safePermissions[moduleKey as keyof typeof safePermissions]?.length > 0;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl transform transition-all animate-fadeInScale max-h-[90vh] flex flex-col">
        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-t-2xl text-white overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
          
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Manage Permissions</h2>
                <p className="text-purple-100 text-sm mt-1 flex items-center">
                  <span className="mr-1">Role:</span>
                  <span className="font-medium">{roleName}</span>
                  <span className="mx-2 h-1 w-1 rounded-full bg-purple-200 inline-block"></span>
                  <span>{getTotalPermissions()} Permissions Granted</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowPermissionModal(false);
                setSelectedRole(null);
              }}
              className="text-white p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          {/* Info Banner */}
          <div className="bg-indigo-50 rounded-xl p-4 mb-6 flex items-start">
            <div className="text-indigo-500 mr-3 mt-1">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium text-indigo-800 mb-1">Permission Changes Impact</h4>
              <p className="text-indigo-700/80 text-sm">
                Changes to permissions will take effect immediately after saving. Users with this role may experience access changes on their next action.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {modules.map((module) => (
              <div 
                key={module.key} 
                className="rounded-xl border border-gray-200 overflow-hidden shadow-sm transition-all hover:shadow-md"
              >
                <div className={`bg-gradient-to-r ${module.gradient} px-6 py-4 text-white flex items-center justify-between cursor-pointer`} onClick={() => toggleSection(module.key)}>
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      {module.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{module.name}</h3>
                      <p className="text-white/80 text-xs">{module.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {hasAnyPermission(module.key) && (
                      <div className="bg-white/20 px-2 py-1 rounded-full text-xs mr-3">
                        {module.permissions.length} Permissions
                      </div>
                    )}
                    {expandedSections[module.key] ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </div>
                
                {expandedSections[module.key] && (
                  <div className="p-5 bg-gradient-to-b from-gray-50/80 to-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {permissionOptions[module.key]?.map((permission) => {
                        // Skip dashboard permission for non-analytics modules
                        if (permission === "dashboard" && module.key !== "analytics") return null;
                        
                        return (
                          <div
                            key={`${module.key}-${permission}`}
                            className={`flex items-start space-x-3 p-3 rounded-xl transition-colors ${
                              module.permissions.includes(permission) 
                                ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100/70'
                                : 'bg-white border border-gray-200 hover:border-indigo-100/50'
                            }`}
                          >
                            <div className="pt-0.5">
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  id={`${module.key}-${permission}`}
                                  checked={module.permissions.includes(permission)}
                                  onChange={() => handlePermissionChange(module.key, permission)}
                                  className="h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-gray-300 checked:border-indigo-500 checked:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:ring-offset-0"
                                />
                                {module.permissions.includes(permission) && (
                                  <Check className="h-3 w-3 text-white absolute left-1 top-1 pointer-events-none" />
                                )}
                              </div>
                            </div>
                            <div className="flex-1">
                              <label
                                htmlFor={`${module.key}-${permission}`}
                                className={`text-sm capitalize cursor-pointer font-medium ${
                                  module.permissions.includes(permission) ? 'text-indigo-900' : 'text-gray-700'
                                }`}
                              >
                                {permission}
                              </label>
                              <p className={`text-xs mt-1 ${
                                module.permissions.includes(permission) ? 'text-indigo-700/70' : 'text-gray-500'
                              }`}>
                                {getPermissionDescription(permission)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 border-t border-gray-200 flex justify-between items-center bg-gray-50 rounded-b-2xl">
          <div className="text-sm text-gray-500">
            <span className="text-purple-600 font-medium">{getTotalPermissions()}</span> permission{getTotalPermissions() === 1 ? '' : 's'} configured
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setShowPermissionModal(false);
                setSelectedRole(null);
              }}
              className="px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handlePermissionSave}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Permissions
            </button>
          </div>
        </div>
      </div>
      
      {/* Animation Keyframes */}
      <style jsx>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-fadeInScale {
          animation: fadeInScale 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PermissionModal;