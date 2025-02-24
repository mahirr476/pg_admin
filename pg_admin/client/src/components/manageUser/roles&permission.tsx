"use client";

import React from "react";

const PermissionModal = ({
  selectedRole,
  permissionOptions,
  handlePermissionChange,
  handlePermissionSave,
  setShowPermissionModal,
  setSelectedRole,
}) => {
  if (!selectedRole) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Manage Permissions</h2>
        <div className="mb-4">
          <strong>Pargon Permissions</strong>
          {permissionOptions.pargon.map((permission) => (
            <div key={permission} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={selectedRole.permissions.pargon.includes(permission)}
                onChange={() => handlePermissionChange("pargon", permission)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span>{permission.charAt(0).toUpperCase() + permission.slice(1)}</span>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <strong>Parasole Permissions</strong>
          {permissionOptions.parasole.map((permission) => (
            <div key={permission} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={selectedRole.permissions.parasole.includes(permission)}
                onChange={() => handlePermissionChange("parasole", permission)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span>{permission.charAt(0).toUpperCase() + permission.slice(1)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setShowPermissionModal(false);
              setSelectedRole(null);
            }}
            className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handlePermissionSave}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
          >
            Save Permissions
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionModal;