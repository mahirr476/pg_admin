// src/components/users/PermissionsModal.jsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Key, Shield, Save, Square, CheckSquare, X } from "lucide-react";

const PermissionsModal = ({
  showModal,
  setShowModal,
  selectedRole,
  setSelectedRole,
  handlePermissionChange,
  handlePermissionSave,
  isLoading,
  getRoleInfo,
}) => {
  if (!selectedRole) return null;

  const PermissionBlock = ({ title, module, permissions = ["view"] }) => (
    <div className="mb-6 transform transition-all duration-200 hover:translate-y-[-2px]">
      <h3 className="text-sm font-semibold mb-3 flex items-center">
        <Shield className="h-4 w-4 mr-2 text-purple-500" />
        {title}
      </h3>
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className={`grid ${permissions.length > 2 ? "grid-cols-2 sm:grid-cols-3" : ""} gap-3`}>
          {permissions.map((permission) => (
            <div
              key={permission}
              className={`flex items-center p-3 rounded-lg transition-all duration-200 cursor-pointer border 
                ${
                  selectedRole.permissions?.[module]?.includes(permission)
                    ? "border-purple-200 bg-purple-50 hover:bg-purple-100"
                    : "border-gray-100 bg-white hover:bg-gray-50"
                }`}
              onClick={() => handlePermissionChange(module, permission)}
            >
              {selectedRole.permissions?.[module]?.includes(permission) ? (
                <CheckSquare className="h-5 w-5 text-purple-600 mr-2" />
              ) : (
                <Square className="h-5 w-5 text-gray-400 mr-2" />
              )}
              <span className={`${selectedRole.permissions?.[module]?.includes(permission) ? "text-purple-800" : "text-gray-700"} capitalize font-medium`}>
                {permission}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden rounded-xl border-none shadow-xl">
        <DialogHeader className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600">
          <div className="flex justify-between items-center">
            <DialogTitle className="flex items-center text-xl text-white">
              <Key className="h-5 w-5 mr-2 text-white" />
              User Permissions
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-full h-8 w-8 p-0"
              onClick={() => {
                setShowModal(false);
                setSelectedRole(null);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 mb-8 shadow-sm">
            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-1">User</div>
              <div className="font-semibold text-lg">{`${selectedRole.firstName} ${selectedRole.lastName}`}</div>
            </div>
            <div
              className={`px-3 py-1.5 rounded-full text-xs font-medium shadow-sm ${
                getRoleInfo(selectedRole.roleId).color
              }`}
            >
              {getRoleInfo(selectedRole.roleId).label}
            </div>
          </div>

          {/* Dashboard Module */}
          <PermissionBlock title="Dashboard" module="analytics" permissions={["dashboard"]} />

          {/* Analytics Module */}
          <PermissionBlock title="Analytics" module="analytics" permissions={["view"]} />

          {/* Settings Module */}
          <PermissionBlock title="Settings" module="settings" permissions={["view", "create", "edit"]} />

          {/* User Management */}
          <PermissionBlock title="User Management" module="user" permissions={["view", "create", "edit", "delete"]} />

          {/* Pargon Website */}
          <PermissionBlock title="Pargon Website" module="pargon" permissions={["view", "create", "edit", "delete"]} />

          {/* Parasole Website */}
          <PermissionBlock title="Parasole Website" module="parasole" permissions={["view", "create", "edit", "delete"]} />

        </div>
        <div className="p-5 border-t border-gray-200 flex justify-end space-x-4 bg-gray-50">
          <Button
            type="button"
            onClick={() => {
              setShowModal(false);
              setSelectedRole(null);
            }}
            variant="outline"
            className="px-5 py-2.5 rounded-lg border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handlePermissionSave}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white flex items-center gap-2 shadow-md transition-all duration-200 hover:shadow-lg"
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