// ViewRoleModal.tsx
import React from "react";
import { Shield, X, Eye, Settings, Users, Globe, PieChart, Check } from "lucide-react";

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

interface ViewRoleModalProps {
  showViewModal: boolean;
  selectedRole: Role | null;
  setShowViewModal: (show: boolean) => void;
  setSelectedRole: (role: Role | null) => void;
  getRoleBadgeColor: (role: string) => string;
}

const ViewRoleModal: React.FC<ViewRoleModalProps> = ({ 
  showViewModal, 
  selectedRole, 
  setShowViewModal, 
  setSelectedRole, 
  getRoleBadgeColor 
}) => {
  if (!showViewModal || !selectedRole) return null;
  
  // Function to get icon for module
  const getModuleIcon = (moduleKey: string) => {
    switch(moduleKey) {
      case 'analytics':
        return <PieChart className="h-4 w-4" />;
      case 'settings':
        return <Settings className="h-4 w-4" />;
      case 'user':
        return <Users className="h-4 w-4" />;
      case 'pargon':
      case 'parasole':
        return <Globe className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };
  
  // Function to get gradient color for module
  const getModuleGradient = (moduleKey: string) => {
    switch(moduleKey) {
      case 'analytics':
        return 'from-blue-600 to-sky-500';
      case 'settings':
        return 'from-violet-600 to-purple-600';
      case 'user':
        return 'from-emerald-600 to-teal-500';
      case 'pargon':
        return 'from-amber-500 to-orange-600';
      case 'parasole':
        return 'from-pink-500 to-rose-600';
      default:
        return 'from-gray-600 to-gray-700';
    }
  };
  
  // Get total permissions count
  const getTotalPermissions = () => {
    let count = 0;
    Object.values(selectedRole.permissions).forEach(permArray => {
      count += permArray.length;
    });
    return count;
  };
  
  // Generate modules data with proper display names and icons
  const modules = [
    { key: 'analytics', name: 'Analytics & Dashboards', permissions: selectedRole.permissions.analytics || [] },
    { key: 'settings', name: 'System Settings', permissions: selectedRole.permissions.settings || [] },
    { key: 'user', name: 'User Management', permissions: selectedRole.permissions.user || [] },
    { key: 'pargon', name: 'Pargon Website', permissions: selectedRole.permissions.pargon || [] },
    { key: 'parasole', name: 'Parasole Website', permissions: selectedRole.permissions.parasole || [] }
  ];
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl transform transition-all animate-fadeModal my-8">
        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-violet-700 p-6 rounded-t-2xl text-white overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-violet-500/20 rounded-full blur-3xl"></div>
          
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Eye className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold">{selectedRole.name}</h2>
                  <div className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(selectedRole.role)}`}>
                    {selectedRole.role}
                  </div>
                </div>
                <div className="flex items-center text-indigo-100 text-sm">
                  <div className="flex items-center mr-4">
                    <Shield className="h-4 w-4 mr-1" />
                    <span>{getTotalPermissions()} Permissions</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 mr-1" />
                    <span>Active Role</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setShowViewModal(false);
                setSelectedRole(null);
              }}
              className="text-white p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-auto max-h-[calc(90vh-220px)]">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-indigo-600" />
              Role Access Permissions
            </h3>
            <p className="text-gray-600 text-sm">
              This role grants access to the following modules and operations. Each permission provides specific capabilities within the system.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((module) => (
              <div key={module.key} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className={`bg-gradient-to-r ${getModuleGradient(module.key)} p-4 text-white flex items-center gap-3`}>
                  <div className="bg-white/20 p-2 rounded">
                    {getModuleIcon(module.key)}
                  </div>
                  <h4 className="font-medium">{module.name}</h4>
                </div>
                
                <div className="p-4">
                  {module.permissions.length === 0 ? (
                    <div className="flex items-center justify-center py-6 text-gray-500 text-sm">
                      <span className="inline-block mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </span>
                      No permissions granted
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {["view", "create", "edit", "delete", "dashboard"].map((permission) => {
                        const hasPermission = module.permissions.includes(permission);
                        
                        // Skip this permission if it's not applicable to this module
                        if (permission === "dashboard" && module.key !== "analytics") return null;
                        if (module.key === "analytics" && !["view", "dashboard"].includes(permission)) return null;
                        
                        return (
                          <div 
                            key={`${module.key}-${permission}`} 
                            className={`flex items-center gap-2 p-2 rounded-lg ${hasPermission ? 'bg-indigo-50' : 'bg-gray-50'}`}
                          >
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              hasPermission ? 'bg-indigo-500 text-white' : 'bg-gray-300 text-gray-100'
                            }`}>
                              {hasPermission && <Check className="h-3 w-3" />}
                            </div>
                            <span className={`text-sm capitalize ${hasPermission ? 'text-indigo-900 font-medium' : 'text-gray-500'}`}>
                              {permission}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-5 border-t border-gray-200 flex justify-end bg-gray-50 rounded-b-2xl">
          <button
            onClick={() => {
              setShowViewModal(false);
              setSelectedRole(null);
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-700 text-white rounded-xl hover:shadow-lg transition-all font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 flex items-center"
          >
            Close Details
          </button>
        </div>
      </div>
      
      {/* Animation Keyframes */}
      <style jsx>{`
        @keyframes fadeModal {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeModal {
          animation: fadeModal 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ViewRoleModal;