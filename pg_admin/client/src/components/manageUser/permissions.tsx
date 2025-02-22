
"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

const PermissionsPage = () => {
  const [permissionsList, setPermissionsList] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedPermission, setEditedPermission] = useState(null);
  const [newPermission, setNewPermission] = useState({ name: "" });

  // Fetch permissions from the API
  const fetchPermissions = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch("http://localhost:7000/api/v1/permission", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setPermissionsList(data.permissions || []);
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  // Add a new permission
  const handleAdd = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch("http://localhost:7000/api/v1/permission", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPermission),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Check if the response contains an `id`
      if (!data.id) {
        console.error("Invalid API response: Missing `id` field");
        // Fallback: Refetch permissions to ensure consistency
        fetchPermissions();
        return;
      }

      setPermissionsList([...permissionsList, data]); // Add new permission to the list
      setIsAddModalOpen(false);
      setNewPermission({ name: "" }); // Reset form
    } catch (error) {
      console.error("Error adding permission:", error);
    }
  };

  // Update an existing permission
  const handleEdit = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch(
        `http://localhost:7000/api/v1/permission/${editedPermission.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedPermission),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Check if the response contains an `id`
      if (!data.id) {
        console.error("Invalid API response: Missing `id` field");
        // Fallback: Refetch permissions to ensure consistency
        fetchPermissions();
        return;
      }

      setPermissionsList(
        permissionsList.map((p) => (p.id === data.id ? data : p)) // Update the permission in the list
      );
      setIsEditModalOpen(false);
      setEditedPermission(null); // Reset form
    } catch (error) {
      console.error("Error updating permission:", error);
    }
  };

  return (
    <div className="p-8">
      {/* Header and Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Permissions Management</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add Permission
        </button>
      </div>

      {/* Table to Display Permissions */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {permissionsList.map((permission) => (
              <tr key={permission.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{permission.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => {
                      setEditedPermission(permission);
                      setIsEditModalOpen(true);
                    }}
                    className="text-green-600 hover:text-green-800"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Permission Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Permission</h2>
            <div className="mb-4">
              <label className="block mb-1">Name</label>
              <input
                type="text"
                value={newPermission.name}
                onChange={(e) =>
                  setNewPermission({ ...newPermission, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add Permission
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Permission Modal */}
      {isEditModalOpen && editedPermission && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Permission</h2>
            <div className="mb-4">
              <label className="block mb-1">Name</label>
              <input
                type="text"
                value={editedPermission.name}
                onChange={(e) =>
                  setEditedPermission({
                    ...editedPermission,
                    name: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionsPage;