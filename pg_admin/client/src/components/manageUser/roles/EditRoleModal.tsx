// EditRoleModal.tsx
import React from "react";
import { Edit, Save, X, CheckCircle2 } from "lucide-react";

interface Role {
  id: string;
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
  icon: React.ReactNode;
}

interface EditRoleModalProps {
  showEditModal: boolean;
  selectedRole: Role | null;
  setSelectedRole: (role: Role | null) => void;
  setShowEditModal: (show: boolean) => void;
  handleSaveRole: () => void;
}

const EditRoleModal: React.FC<EditRoleModalProps> = ({ 
  showEditModal, 
  selectedRole, 
  setSelectedRole, 
  setShowEditModal, 
  handleSaveRole 
}) => {
  if (!showEditModal || !selectedRole) return null;
  
  // Role type options with their descriptions and colors
  const roleTypes: RoleType[] = [
    {
      value: "Super Admin",
      description: "Full access to all system features and settings",
      color: "from-indigo-600 to-violet-700",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      value: "Admin",
      description: "Manage users and content with limited system settings",
      color: "from-blue-600 to-sky-500",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      value: "User",
      description: "Access to assigned features without administrative privileges",
      color: "from-emerald-600 to-teal-500",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  // Close modal function
  const closeModal = (): void => {
    setShowEditModal(false);
    setSelectedRole(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all animate-fadeModal overflow-hidden"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Edit className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Edit Role</h2>
                <p className="text-blue-100 text-sm mt-1">Modify role details and type</p>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="text-white p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            handleSaveRole();
          }}
          className="p-6 space-y-6"
        >
          {/* Role Name Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">Role Name</label>
              <span className="text-xs text-gray-500">ID: {typeof selectedRole.id === 'string' ? selectedRole.id.slice(0, 8) + '...' : selectedRole.id}</span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={selectedRole.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSelectedRole({ ...selectedRole, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all focus:outline-none shadow-sm"
                placeholder="Enter role name"
                required
              />
              {selectedRole.name && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500">Choose a descriptive name that clearly identifies the role's function</p>
          </div>
          
          {/* Role Type Selection */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Role Type</label>
            <div className="grid grid-cols-1 gap-3">
              {roleTypes.map((type) => (
                <div 
                  key={type.value}
                  className={`border rounded-xl p-4 cursor-pointer transition-all ${
                    selectedRole.role === type.value 
                      ? 'border-blue-300 bg-blue-50 shadow-sm' 
                      : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50'
                  }`}
                  onClick={() => setSelectedRole({ ...selectedRole, role: type.value })}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-r ${type.color} text-white`}>
                        {type.icon}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{type.value}</p>
                        <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                      </div>
                    </div>
                    <div className={`h-5 w-5 rounded-full border ${
                      selectedRole.role === type.value 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'
                    } flex items-center justify-center`}>
                      {selectedRole.role === type.value && (
                        <div className="h-2 w-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="pt-6 border-t border-gray-100 flex justify-end space-x-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-gray-200 shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedRole.name || !selectedRole.role}
              className={`px-6 py-2.5 rounded-xl transition-all font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 flex items-center gap-2 shadow-sm ${
                !selectedRole.name || !selectedRole.role
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:-translate-y-0.5 transform'
              }`}
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </form>
        
        {/* Info Section */}
        <div className="px-6 py-4 bg-blue-50/50 border-t border-blue-100">
          <div className="flex items-start text-xs text-blue-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              Changing a role type might affect user permissions. You can adjust detailed permissions in the permissions panel after saving.
            </span>
          </div>
        </div>
      </div>
      
      {/* Animation Keyframes */}
      <style jsx>{`
        @keyframes fadeModal {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-fadeModal {
          animation: fadeModal 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default EditRoleModal;