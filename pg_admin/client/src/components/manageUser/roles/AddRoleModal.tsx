// AddRoleModal.tsx
import React from "react";
import { Plus, X, Shield, CheckCircle2 } from "lucide-react";
import { Toaster, toast } from 'sonner';

interface Role {
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

interface RoleType {
  value: string;
  description: string;
  color: string;
}

interface AddRoleModalProps {
  showAddRoleModal: boolean;
  setShowAddRoleModal: (show: boolean) => void;
  newRole: Role;
  setNewRole: (role: Role) => void;
  handleAddRole: () => void;
}

const AddRoleModal: React.FC<AddRoleModalProps> = ({ 
  showAddRoleModal, 
  setShowAddRoleModal, 
  newRole, 
  setNewRole, 
  handleAddRole 
}) => {
  // Role type options with their descriptions and colors
  const roleTypes: RoleType[] = [
    {
      value: "Super Admin",
      description: "Full access to all system features and settings",
      color: "from-indigo-600 to-violet-700"
    },
    {
      value: "Admin",
      description: "Manage users and content with limited system settings access",
      color: "from-blue-600 to-sky-500"
    },
    {
      value: "User",
      description: "Access to assigned features without administrative privileges",
      color: "from-emerald-600 to-teal-500"
    }
  ];

  // Reset form function
  const resetForm = (): void => {
    setShowAddRoleModal(false);
    setNewRole({
      name: "",
      role: "",
      permissions: {
        pargon: [],
        parasole: [],
        user: [],
        settings: [],
        analytics: []
      },
    });
  };

  // Handle form submission with toast notifications
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    try {
      handleAddRole();
      toast.success(`Role "${newRole.name}" created successfully!`);
      resetForm();
    } catch (error) {
      toast.error(`Failed to create role: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    showAddRoleModal ? (
      <>
        <Toaster position="top-right" richColors />
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all animate-modalFade overflow-hidden"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()} // Prevent clicks from closing the modal
          >
            {/* Header with gradient background */}
            <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Create New Role</h2>
                    <p className="text-indigo-100 text-sm mt-1">Define role settings and permissions</p>
                  </div>
                </div>
                <button
                  onClick={resetForm}
                  className="text-white p-2 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-6"
            >
              {/* Role Name Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Role Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={newRole.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setNewRole({ ...newRole, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all focus:outline-none shadow-sm"
                    placeholder="Enter a descriptive name for this role"
                    required
                  />
                  {newRole.name && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">Choose a name that clearly identifies the role's purpose</p>
              </div>
              
              {/* Role Type Selection */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Role Type</label>
                <div className="grid grid-cols-1 gap-3">
                  {roleTypes.map((type) => (
                    <div 
                      key={type.value}
                      className={`border rounded-xl p-4 cursor-pointer transition-all ${
                        newRole.role === type.value 
                          ? 'border-indigo-300 bg-indigo-50 shadow-sm' 
                          : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50'
                      }`}
                      onClick={() => setNewRole({ ...newRole, role: type.value })}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`h-8 w-8 rounded-full bg-gradient-to-r ${type.color} flex items-center justify-center text-white`}>
                            {type.value.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{type.value}</p>
                            <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                          </div>
                        </div>
                        <div className={`h-5 w-5 rounded-full border ${
                          newRole.role === type.value 
                            ? 'border-indigo-500 bg-indigo-500' 
                            : 'border-gray-300'
                        } flex items-center justify-center`}>
                          {newRole.role === type.value && (
                            <div className="h-2 w-2 bg-white rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Action Buttons with gradient effect */}
              <div className="pt-6 border-t border-gray-100 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newRole.name || !newRole.role}
                  className={`px-6 py-2.5 rounded-xl transition-all font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 flex items-center gap-2 ${
                    !newRole.name || !newRole.role
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:-translate-y-0.5 transform'
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  Create Role
                </button>
              </div>
            </form>
            
            {/* Bottom Tips Section */}
            <div className="px-6 py-4 bg-indigo-50/50 border-t border-indigo-100">
              <p className="text-xs text-indigo-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                You can customize permissions for this role after creation
              </p>
            </div>
          </div>
          
          {/* Animation Keyframes */}
          <style jsx>{`
            @keyframes modalFade {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
            
            .animate-modalFade {
              animation: modalFade 0.3s ease-out forwards;
            }
          `}</style>
        </div>
      </>
    ) : null
  );
};

export default AddRoleModal;