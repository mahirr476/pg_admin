

import React from "react";
import { Key, X, Save, Shield } from "lucide-react";

const PermissionModal = ({
  selectedRole,
  permissionOptions,
  handlePermissionChange,
  handlePermissionSave,
  setShowPermissionModal,
  setSelectedRole,
}) => {
  // Safely handle potentially null/undefined selectedRole
  if (!selectedRole) {
    return null; // Don't render anything if selectedRole is not defined
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all animate-slide-up max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-800">
                Manage Permissions: {roleName}
              </h2>
            </div>
            <button
              onClick={() => {
                setShowPermissionModal(false);
                setSelectedRole(null);
              }}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          <div className="space-y-6">
            {/* Dashboard Module */}
            <div className="rounded-lg border border-gray-200">
              <div className="bg-gray-50 px-4 py-3 rounded-t-lg border-b border-gray-200 flex items-center">
                <Shield className="h-4 w-4 mr-2 text-indigo-500" />
                <h3 className="font-medium text-gray-700">Dashboard</h3>
              </div>
              <div className="p-4">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 border border-gray-100 bg-white">
                    <input
                      type="checkbox"
                      id="analytics-dashboard"
                      checked={safePermissions.analytics?.includes("dashboard") || false}
                      onChange={() => handlePermissionChange("analytics", "dashboard")}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="analytics-dashboard"
                      className="text-sm text-gray-700 cursor-pointer font-medium"
                    >
                      View Access
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Module */}
            <div className="rounded-lg border border-gray-200">
              <div className="bg-gray-50 px-4 py-3 rounded-t-lg border-b border-gray-200 flex items-center">
                <Shield className="h-4 w-4 mr-2 text-indigo-500" />
                <h3 className="font-medium text-gray-700">Analytics</h3>
              </div>
              <div className="p-4">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 border border-gray-100 bg-white">
                    <input
                      type="checkbox"
                      id="analytics-view"
                      checked={safePermissions.analytics?.includes("view") || false}
                      onChange={() => handlePermissionChange("analytics", "view")}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="analytics-view"
                      className="text-sm text-gray-700 cursor-pointer font-medium"
                    >
                      View Access
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Module */}
            <div className="rounded-lg border border-gray-200">
              <div className="bg-gray-50 px-4 py-3 rounded-t-lg border-b border-gray-200 flex items-center">
                <Shield className="h-4 w-4 mr-2 text-indigo-500" />
                <h3 className="font-medium text-gray-700">Settings</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  {["view", "create", "edit", "delete"].map((permission) => (
                    <div
                      key={permission}
                      className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 border border-gray-100 bg-white"
                    >
                      <input
                        type="checkbox"
                        id={`settings-${permission}`}
                        checked={safePermissions.settings?.includes(permission) || false}
                        onChange={() => handlePermissionChange("settings", permission)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`settings-${permission}`}
                        className="text-sm text-gray-700 capitalize cursor-pointer font-medium"
                      >
                        {permission}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* User Management */}
            <div className="rounded-lg border border-gray-200">
              <div className="bg-gray-50 px-4 py-3 rounded-t-lg border-b border-gray-200 flex items-center">
                <Shield className="h-4 w-4 mr-2 text-indigo-500" />
                <h3 className="font-medium text-gray-700">User Management</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  {["view", "create", "edit", "delete"].map((permission) => (
                    <div
                      key={permission}
                      className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 border border-gray-100 bg-white"
                    >
                      <input
                        type="checkbox"
                        id={`user-${permission}`}
                        checked={safePermissions.user?.includes(permission) || false}
                        onChange={() => handlePermissionChange("user", permission)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`user-${permission}`}
                        className="text-sm text-gray-700 capitalize cursor-pointer font-medium"
                      >
                        {permission}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pargon Website */}
            <div className="rounded-lg border border-gray-200">
              <div className="bg-gray-50 px-4 py-3 rounded-t-lg border-b border-gray-200 flex items-center">
                <Shield className="h-4 w-4 mr-2 text-indigo-500" />
                <h3 className="font-medium text-gray-700">Pargon Website</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  {["view", "create", "edit", "delete"].map((permission) => (
                    <div
                      key={permission}
                      className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 border border-gray-100 bg-white"
                    >
                      <input
                        type="checkbox"
                        id={`pargon-${permission}`}
                        checked={safePermissions.pargon?.includes(permission) || false}
                        onChange={() => handlePermissionChange("pargon", permission)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`pargon-${permission}`}
                        className="text-sm text-gray-700 capitalize cursor-pointer font-medium"
                      >
                        {permission}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Parasole Website */}
            <div className="rounded-lg border border-gray-200">
              <div className="bg-gray-50 px-4 py-3 rounded-t-lg border-b border-gray-200 flex items-center">
                <Shield className="h-4 w-4 mr-2 text-indigo-500" />
                <h3 className="font-medium text-gray-700">Parasole Website</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  {["view", "create", "edit", "delete"].map((permission) => (
                    <div
                      key={permission}
                      className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 border border-gray-100 bg-white"
                    >
                      <input
                        type="checkbox"
                        id={`parasole-${permission}`}
                        checked={safePermissions.parasole?.includes(permission) || false}
                        onChange={() => handlePermissionChange("parasole", permission)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`parasole-${permission}`}
                        className="text-sm text-gray-700 capitalize cursor-pointer font-medium"
                      >
                        {permission}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3 bg-gray-50 rounded-b-xl">
          <button
            onClick={() => {
              setShowPermissionModal(false);
              setSelectedRole(null);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handlePermissionSave}
            className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2 flex items-center gap-2 shadow-sm"
          >
            <Save className="h-4 w-4" />
            Save Permissions
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionModal;