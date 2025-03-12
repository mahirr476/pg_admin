// src/components/users/PermissionsModal.jsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Key, Shield, Save, Square, CheckSquare } from "lucide-react";

const PermissionsModal = ({ 
  showModal, 
  setShowModal, 
  selectedRole, 
  setSelectedRole, 
  handlePermissionChange, 
  handlePermissionSave, 
  isLoading, 
  getRoleInfo 
}) => {
  if (!selectedRole) return null;

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-xl">
        <DialogHeader className="p-6 border-b border-gray-200 bg-gray-50">
          <DialogTitle className="flex items-center text-xl">
            <Key className="h-5 w-5 mr-2 text-purple-600" />
            User Permissions
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100 mb-6">
            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-1">User</div>
              <div className="font-medium">{`${selectedRole.firstName} ${selectedRole.lastName}`}</div>
            </div>
            <div
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                getRoleInfo(selectedRole.roleId).color
              }`}
            >
              {getRoleInfo(selectedRole.roleId).label}
            </div>
          </div>

          {/* Dashboard Module */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3 flex items-center">
              <Shield className="h-4 w-4 mr-2 text-indigo-500" />
              Dashboard
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div
                className="flex items-center p-3 rounded-lg hover:bg-white transition-colors cursor-pointer border border-gray-100 bg-white"
                onClick={() =>
                  handlePermissionChange("analytics", "dashboard")
                }
              >
                {selectedRole.permissions?.analytics?.includes(
                  "dashboard"
                ) ? (
                  <CheckSquare className="h-5 w-5 text-indigo-600 mr-2" />
                ) : (
                  <Square className="h-5 w-5 text-gray-400 mr-2" />
                )}
                <span className="text-gray-700">View Access</span>
              </div>
            </div>
          </div>

          {/* Analytics Module */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3 flex items-center">
              <Shield className="h-4 w-4 mr-2 text-indigo-500" />
              Analytics
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div
                className="flex items-center p-3 rounded-lg hover:bg-white transition-colors cursor-pointer border border-gray-100 bg-white"
                onClick={() => handlePermissionChange("analytics", "view")}
              >
                {selectedRole.permissions?.analytics?.includes("view") ? (
                  <CheckSquare className="h-5 w-5 text-indigo-600 mr-2" />
                ) : (
                  <Square className="h-5 w-5 text-gray-400 mr-2" />
                )}
                <span className="text-gray-700">View Access</span>
              </div>
            </div>
          </div>

          {/* Settings Module */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3 flex items-center">
              <Shield className="h-4 w-4 mr-2 text-indigo-500" />
              Settings
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {["view", "create", "edit"].map((permission) => (
                  <div
                    key={permission}
                    className="flex items-center p-3 rounded-lg hover:bg-white transition-colors cursor-pointer border border-gray-100 bg-white"
                    onClick={() =>
                      handlePermissionChange("settings", permission)
                    }
                  >
                    {selectedRole.permissions?.settings?.includes(
                      permission
                    ) ? (
                      <CheckSquare className="h-5 w-5 text-indigo-600 mr-2" />
                    ) : (
                      <Square className="h-5 w-5 text-gray-400 mr-2" />
                    )}
                    <span className="text-gray-700 capitalize">
                      {permission}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User Management */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3 flex items-center">
              <Shield className="h-4 w-4 mr-2 text-indigo-500" />
              User Management
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="grid grid-cols-2 gap-3">
                {["view", "create", "edit", "delete"].map((permission) => (
                  <div
                    key={permission}
                    className="flex items-center p-3 rounded-lg hover:bg-white transition-colors cursor-pointer border border-gray-100 bg-white"
                    onClick={() =>
                      handlePermissionChange("user", permission)
                    }
                  >
                    {selectedRole.permissions?.user?.includes(
                      permission
                    ) ? (
                      <CheckSquare className="h-5 w-5 text-indigo-600 mr-2" />
                    ) : (
                      <Square className="h-5 w-5 text-gray-400 mr-2" />
                    )}
                    <span className="text-gray-700 capitalize">
                      {permission}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pargon Website */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3 flex items-center capitalize">
              <Shield className="h-4 w-4 mr-2 text-indigo-500" />
              Pargon Website
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="grid grid-cols-2 gap-3">
                {["view", "create", "edit", "delete"].map((permission) => (
                  <div
                    key={permission}
                    className="flex items-center p-3 rounded-lg hover:bg-white transition-colors cursor-pointer border border-gray-100 bg-white"
                    onClick={() =>
                      handlePermissionChange("pargon", permission)
                    }
                  >
                    {selectedRole.permissions?.pargon?.includes(
                      permission
                    ) ? (
                      <CheckSquare className="h-5 w-5 text-indigo-600 mr-2" />
                    ) : (
                      <Square className="h-5 w-5 text-gray-400 mr-2" />
                    )}
                    <span className="text-gray-700 capitalize">
                      {permission}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Parasole Website */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3 flex items-center capitalize">
              <Shield className="h-4 w-4 mr-2 text-indigo-500" />
              Parasole Website
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="grid grid-cols-2 gap-3">
                {["view", "create", "edit", "delete"].map((permission) => (
                  <div
                    key={permission}
                    className="flex items-center p-3 rounded-lg hover:bg-white transition-colors cursor-pointer border border-gray-100 bg-white"
                    onClick={() =>
                      handlePermissionChange("parasole", permission)
                    }
                  >
                    {selectedRole.permissions?.parasole?.includes(
                      permission
                    ) ? (
                      <CheckSquare className="h-5 w-5 text-indigo-600 mr-2" />
                    ) : (
                      <Square className="h-5 w-5 text-gray-400 mr-2" />
                    )}
                    <span className="text-gray-700 capitalize">
                      {permission}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3 bg-gray-50">
          <Button
            type="button"
            onClick={() => {
              setShowModal(false);
              setSelectedRole(null);
            }}
            variant="outline"
            className="px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handlePermissionSave}
            disabled={isLoading}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 shadow-sm"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Permissions
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PermissionsModal;