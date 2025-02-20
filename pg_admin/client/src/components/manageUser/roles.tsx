"use client";

import React, { useState } from "react";

const Roles = () => {
  // Existing initial roles data...
  const initialRoles = [
    {
      id: 1,
      name: "John Smith",
      role: "SuperAdmin",
      permissions: {
        pargon: ["view", "edit", "delete"],
        parasole: ["view", "edit"],
      },
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Admin",
      permissions: {
        pargon: ["view", "edit"],
        parasole: ["view"],
      },
    },
    {
      id: 3,
      name: "Mike Wilson",
      role: "User",
      permissions: {
        pargon: ["view"],
        parasole: ["view"],
      },
    },
  ];

  // States (including new state for Add Role modal)
  const [roles, setRoles] = useState(initialRoles);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [editedRole, setEditedRole] = useState(null);
  const [newRole, setNewRole] = useState({
    name: "",
    role: "",
    permissions: {
      pargon: [],
      parasole: [],
    },
  });

  // Permission options
  const permissionOptions = {
    pargon: ["view", "edit", "delete", "create"],
    parasole: ["view", "edit", "delete", "create"],
  };

  // Existing handlers...
  const handleView = (role) => {
    setSelectedRole(role);
    setShowViewModal(true);
  };

  const handleEdit = (role) => {
    setEditedRole({ ...role });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setRoles(
      roles.map((role) => (role.id === editedRole.id ? editedRole : role))
    );
    setShowEditModal(false);
    setEditedRole(null);
  };

  const handlePermission = (role) => {
    setSelectedRole({ ...role });
    setShowPermissionModal(true);
  };

  const handlePermissionChange = (website, permission) => {
    const currentPermissions = selectedRole.permissions[website];
    const updatedPermissions = currentPermissions.includes(permission)
      ? currentPermissions.filter((p) => p !== permission)
      : [...currentPermissions, permission];

    setSelectedRole({
      ...selectedRole,
      permissions: {
        ...selectedRole.permissions,
        [website]: updatedPermissions,
      },
    });
  };

  const handlePermissionSave = () => {
    setRoles(
      roles.map((role) => (role.id === selectedRole.id ? selectedRole : role))
    );
    setShowPermissionModal(false);
    setSelectedRole(null);
  };

  // New handler for adding role
  const handleAddRole = (e) => {
    e.preventDefault();
    const id = Math.max(...roles.map((role) => role.id)) + 1;
    setRoles([...roles, { ...newRole, id }]);
    setNewRole({
      name: "",
      role: "",
      permissions: {
        pargon: [],
        parasole: [],
      },
    });
    setShowAddRoleModal(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Enhanced Header Section */}
      <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-800">Role Management</h1>
        <button
          onClick={() => setShowAddRoleModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
        >
          <span className="text-xl">+</span> Add Role
        </button>
      </div>

      {/* Enhanced Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {roles.map((role) => (
              <tr key={role.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{role.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                    {role.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleView(role)}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(role)}
                      className="px-3 py-1 text-sm border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handlePermission(role)}
                      className="px-3 py-1 text-sm border border-green-300 text-green-600 rounded-md hover:bg-green-50 transition-colors duration-200"
                    >
                      Permissions
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Role Modal */}
      {showAddRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add New Role</h2>
            <form onSubmit={handleAddRole}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={newRole.name}
                  onChange={(e) =>
                    setNewRole({ ...newRole, name: e.target.value })
                  }
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  value={newRole.role}
                  onChange={(e) =>
                    setNewRole({ ...newRole, role: e.target.value })
                  }
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="SuperAdmin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddRoleModal(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                >
                  Add Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Existing modals with enhanced styling... */}
      {/* View Modal */}
      {showViewModal && selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Role Details</h2>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="mt-1">{selectedRole.name}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500">Role</p>
              <p className="mt-1">{selectedRole.role}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500">Permissions</p>
              <div className="mt-2">
                <p className="font-medium">Pargon:</p>
                <p className="ml-2">
                  {selectedRole.permissions.pargon.join(", ")}
                </p>
                <p className="font-medium mt-2">Parasole:</p>
                <p className="ml-2">
                  {selectedRole.permissions.parasole.join(", ")}
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Edit Role</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={editedRole.name}
                  onChange={(e) =>
                    setEditedRole({ ...editedRole, name: e.target.value })
                  }
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  value={editedRole.role}
                  onChange={(e) =>
                    setEditedRole({ ...editedRole, role: e.target.value })
                  }
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="SuperAdmin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditedRole(null);
                  }}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionModal && selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Manage Permissions</h2>
            <div className="mb-6">
              <h3 className="font-medium mb-2">Pargon Permissions</h3>
              <div className="space-y-2">
                {permissionOptions.pargon.map((permission) => (
                  <label key={permission} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedRole.permissions.pargon.includes(
                        permission
                      )}
                      onChange={() =>
                        handlePermissionChange("pargon", permission)
                      }
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    {permission.charAt(0).toUpperCase() + permission.slice(1)}
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h3 className="font-medium mb-2">Parasole Permissions</h3>
              <div className="space-y-2">
                {permissionOptions.parasole.map((permission) => (
                  <label key={permission} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedRole.permissions.parasole.includes(
                        permission
                      )}
                      onChange={() =>
                        handlePermissionChange("parasole", permission)
                      }
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    {permission.charAt(0).toUpperCase() + permission.slice(1)}
                  </label>
                ))}
              </div>
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
      )}
    </div>
  );
};

export default Roles;
