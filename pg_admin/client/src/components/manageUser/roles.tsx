
"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { 
  Shield, 
  Edit, 
  Eye, 
  Key, 
  Plus, 
  X, 
  Save, 
  UserCog
} from "lucide-react";
import PermissionModal from "./roles/PermissionModal";

const Roles = () => {
  // States
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  
  // Define Role interface
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
  
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [newRole, setNewRole] = useState({
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

  // Permission options
  const permissionOptions = {
    pargon: ["view", "create", "edit", "delete"],
    parasole: ["view", "create", "edit", "delete"],
    user: ["view", "create", "edit", "delete"],
    settings: ["view", "create", "edit"],
    analytics: ["view", "dashboard"]
  };

  // Fetch roles from API
  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await fetch("http://localhost:7000/api/v1/role", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch roles");
      }

      const data = await response.json();
      console.log("Fetched roles data:", data);
      
      const rolesData = Array.isArray(data) ? data : data.data || data.roles || [];
      const formattedRoles = rolesData.map((role) => ({
        id: role.id || role._id,
        name: role.name || "",
        role: role.role || "",
        permissions: {
          pargon: Array.isArray(role.permissions?.pargon) ? role.permissions.pargon : [],
          parasole: Array.isArray(role.permissions?.parasole) ? role.permissions.parasole : [],
          user: Array.isArray(role.permissions?.user) ? role.permissions.user : [],
          settings: Array.isArray(role.permissions?.settings) ? role.permissions.settings : [],
          analytics: Array.isArray(role.permissions?.analytics) ? role.permissions.analytics : []
        },
      }));

      console.log("Formatted roles:", formattedRoles);
      setRoles(formattedRoles);
    } catch (error) {
      console.error("Error fetching roles:", error);
      setRoles([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Handle View
  const handleView = (role) => {
    // Create a deep copy of the role to avoid reference issues
    const roleCopy = JSON.parse(JSON.stringify(role));
    
    // Set the role with default permissions structure if missing
    setSelectedRole({
      ...roleCopy,
      permissions: roleCopy.permissions || {
        pargon: [],
        parasole: [],
        user: [],
        settings: [],
        analytics: []
      }
    });
    
    setShowViewModal(true);
    
    // Fetch permissions in the background without blocking the UI
    fetchRolePermissions(role.id).then(permissions => {
      if (permissions) {
        setSelectedRole(prevRole => ({
          ...prevRole,
          permissions
        }));
      }
    }).catch(error => {
      console.error("Error fetching permissions for view:", error);
      // Modal is already open with default permissions
    });
  };

  // Handle Edit
  const handleEdit = (role) => {
    setSelectedRole({ ...role });
    setShowEditModal(true);
  };

  // Function to fetch the current permissions for a role
  const fetchRolePermissions = async (roleId) => {
    try {
      // Check if roleId exists
      if (!roleId) {
        console.warn("No roleId provided to fetchRolePermissions");
        return {
          pargon: [],
          parasole: [],
          user: [],
          settings: [],
          analytics: []
        };
      }
      
      const token = Cookies.get("token");
      console.log(`Fetching permissions for role ID: ${roleId}`);
      
      try {
        const response = await fetch(`http://localhost:7000/api/v1/role_permission/${roleId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // If response is not OK, log but don't throw error
        if (!response.ok) {
          console.warn(`API returned ${response.status} for role_permission/${roleId}`);
          // Return empty permissions instead of throwing
          return {
            pargon: [],
            parasole: [],
            user: [],
            settings: [],
            analytics: []
          };
        }

        const data = await response.json();
        console.log("Fetched role permissions:", data);
        
        if (data.status === "success" && data.rolePermission) {
          // Convert the flat permission structure to our nested object structure
          const permissionsMap = {
            pargon: [],
            parasole: [],
            user: [],
            settings: [],
            analytics: []
          };

          // Process paragon permissions
          if (data.rolePermission.paragon_group_view) permissionsMap.pargon.push("view");
          if (data.rolePermission.paragon_group_create) permissionsMap.pargon.push("create");
          if (data.rolePermission.paragon_group_edit) permissionsMap.pargon.push("edit");
          if (data.rolePermission.paragon_group_delete) permissionsMap.pargon.push("delete");

          // Process parasole permissions
          if (data.rolePermission.parasole_view) permissionsMap.parasole.push("view");
          if (data.rolePermission.parasole_create) permissionsMap.parasole.push("create");
          if (data.rolePermission.parasole_edit) permissionsMap.parasole.push("edit");
          if (data.rolePermission.parasole_delete) permissionsMap.parasole.push("delete");

          // Process user permissions
          if (data.rolePermission.user_view) permissionsMap.user.push("view");
          if (data.rolePermission.user_create) permissionsMap.user.push("create");
          if (data.rolePermission.user_edit) permissionsMap.user.push("edit");
          if (data.rolePermission.user_delete) permissionsMap.user.push("delete");

          // Process settings permissions
          if (data.rolePermission.settings_view) permissionsMap.settings.push("view");
          if (data.rolePermission.settings_create) permissionsMap.settings.push("create");
          if (data.rolePermission.settings_edit) permissionsMap.settings.push("edit");

          // Process analytics permissions
          if (data.rolePermission.analytics_view) permissionsMap.analytics.push("view");
          if (data.rolePermission.dashboard) permissionsMap.analytics.push("dashboard");

          return permissionsMap;
        }
        
        // If we didn't get a success status or rolePermission object,
        // return empty permissions
        return {
          pargon: [],
          parasole: [],
          user: [],
          settings: [],
          analytics: []
        };
        
      } catch (apiError) {
        console.error("API error in fetchRolePermissions:", apiError);
        // Return empty permissions on API error
        return {
          pargon: [],
          parasole: [],
          user: [],
          settings: [],
          analytics: []
        };
      }
      
    } catch (error) {
      console.error("Error in fetchRolePermissions:", error);
      // Return empty permissions instead of throwing
      return {
        pargon: [],
        parasole: [],
        user: [],
        settings: [],
        analytics: []
      };
    }
  };

  // Handle Permission Change
  const handlePermissionChange = (website, permission) => {
    if (!selectedRole || !selectedRole.permissions) return;

    // Make a deep copy of the current permissions to avoid reference issues
    const updatedPermissions = JSON.parse(JSON.stringify(selectedRole.permissions));
    
    // Ensure the website array exists
    if (!updatedPermissions[website]) {
      updatedPermissions[website] = [];
    }
    
    // Toggle the permission
    const currentPermissions = updatedPermissions[website];
    const permissionIndex = currentPermissions.indexOf(permission);
    
    if (permissionIndex === -1) {
      // Add permission if it doesn't exist
      updatedPermissions[website] = [...currentPermissions, permission];
    } else {
      // Remove permission if it exists
      updatedPermissions[website] = currentPermissions.filter(p => p !== permission);
    }
    
    // Update state with the new permissions
    setSelectedRole({
      ...selectedRole,
      permissions: updatedPermissions
    });
    
    // Log for debugging
    console.log(`Permission ${permission} for ${website} toggled:`, updatedPermissions[website]);
  };

  // Convert our permission structure to the API's expected format
  const convertPermissionsToApiFormat = (permissions) => {
    const apiFormat = {
      role_id: selectedRole.id,
      paragon_group_view: permissions.pargon?.includes("view") || false,
      paragon_group_create: permissions.pargon?.includes("create") || false,
      paragon_group_edit: permissions.pargon?.includes("edit") || false,
      paragon_group_delete: permissions.pargon?.includes("delete") || false,
      parasole_view: permissions.parasole?.includes("view") || false,
      parasole_create: permissions.parasole?.includes("create") || false,
      parasole_edit: permissions.parasole?.includes("edit") || false,
      parasole_delete: permissions.parasole?.includes("delete") || false,
      user_view: permissions.user?.includes("view") || false,
      user_create: permissions.user?.includes("create") || false,
      user_edit: permissions.user?.includes("edit") || false,
      user_delete: permissions.user?.includes("delete") || false,
      settings_view: permissions.settings?.includes("view") || false,
      settings_create: permissions.settings?.includes("create") || false,
      settings_edit: permissions.settings?.includes("edit") || false,
      dashboard: permissions.analytics?.includes("dashboard") || false,
      analytics_view: permissions.analytics?.includes("view") || false
    };
    
    return apiFormat;
  };

  // Handle Permission Save
  const handlePermissionSave = async () => {
    if (!selectedRole || !selectedRole.id) {
      console.error("No role selected for permission update");
      return;
    }

    try {
      const token = Cookies.get("token");
      
      // Convert the nested permissions to the flat format expected by the API
      const apiFormatPermissions = convertPermissionsToApiFormat(selectedRole.permissions);
      
      console.log("Sending permission payload:", apiFormatPermissions);

      // Show loading state
      setIsLoading(true);

      const response = await fetch(`http://localhost:7000/api/v1/role_permission/${selectedRole.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiFormatPermissions),
      });

      // Clear loading state regardless of outcome
      setIsLoading(false);

      // Check if the response is OK before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          console.error("Server error response:", errorData);
          alert(errorData.error || "Failed to update permissions");
        } catch (e) {
          // If the error response isn't valid JSON
          console.error("Server error (non-JSON):", errorText);
          alert("Failed to update permissions. See console for details.");
        }
        return; // Exit the function after handling the error
      }

      // Only try to parse JSON if response was OK
      const data = await response.json();
      console.log("Permission update successful:", data);
      
      // Explicitly refresh the roles data to get the updated permissions
      await fetchRoles();
      
      // Show success message
      alert("Permissions updated successfully");
      
      // Close the modal and clear selection
      setShowPermissionModal(false);
      setSelectedRole(null);
    } catch (error) {
      setIsLoading(false);
      console.error("Error updating permissions:", error);
      alert("An error occurred while updating permissions. Please try again.");
    }
  };

  // Handle Save Role
  const handleSaveRole = async () => {
    if (!selectedRole || !selectedRole.id) {
      console.error("No role selected for editing");
      return;
    }

    try {
      const token = Cookies.get("token");
      
      // Create a deep copy of the selected role to prevent reference issues
      const roleToUpdate = JSON.parse(JSON.stringify(selectedRole));
      
      console.log("Sending role update payload:", roleToUpdate);
      
      setIsLoading(true);
      const response = await fetch(`http://localhost:7000/api/v1/role/${selectedRole.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roleToUpdate),
      });
      setIsLoading(false);

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          console.error("Server error response:", errorData);
          alert(errorData.error || "Failed to update role");
        } catch (e) {
          console.error("Server error (non-JSON):", errorText);
          alert("Failed to update role. See console for details.");
        }
        return;
      }

      const data = await response.json();
      console.log("Role update successful:", data);
      
      await fetchRoles();
      alert("Role updated successfully");
      setShowEditModal(false);
      setSelectedRole(null);
    } catch (error) {
      setIsLoading(false);
      console.error("Error updating role:", error);
      alert("An error occurred while updating the role. Please try again.");
    }
  };

  // Handle Add Role
  const handleAddRole = async () => {
    try {
      const token = Cookies.get("token");
      
      // Create a deep copy of the new role
      const roleToAdd = JSON.parse(JSON.stringify(newRole));
      
      console.log("Sending new role payload:", roleToAdd);
      
      setIsLoading(true);
      const response = await fetch("http://localhost:7000/api/v1/role", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roleToAdd),
      });
      setIsLoading(false);

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          console.error("Server error response:", errorData);
          alert(errorData.error || "Failed to add role");
        } catch (e) {
          console.error("Server error (non-JSON):", errorText);
          alert("Failed to add role. See console for details.");
        }
        return;
      }

      const data = await response.json();
      console.log("Role creation successful:", data);

      await fetchRoles();
      alert("Role created successfully");
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
    } catch (error) {
      setIsLoading(false);
      console.error("Error adding role:", error);
      alert("An error occurred while adding the role. Please try again.");
    }
  };

  // Handle opening the permission modal with loading current permissions
  const handleOpenPermissionModal = async (role) => {
    // Create a deep copy of the role to avoid reference issues
    const roleCopy = JSON.parse(JSON.stringify(role));
    
    // Immediately show modal with default permissions
    setSelectedRole({
      ...roleCopy,
      permissions: roleCopy.permissions || {
        pargon: [],
        parasole: [],
        user: [],
        settings: [],
        analytics: []
      }
    });
    setShowPermissionModal(true);
    
    // Show loading state
    setIsLoading(true);
    
    try {
      // Fetch the latest permissions for this role
      const permissions = await fetchRolePermissions(role.id);
      
      // Update the selectedRole with fetched permissions
      if (permissions) {
        setSelectedRole(prevRole => ({
          ...prevRole,
          permissions
        }));
      }
    } catch (error) {
      console.error("Error loading permissions:", error);
      // Already showing default permissions, so we don't need to set them again
    } finally {
      setIsLoading(false);
    }
  };

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'Super Admin':
        return 'bg-purple-100 text-purple-800';
      case 'Admin':
        return 'bg-blue-100 text-blue-800';
      case 'User':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <UserCog className="mr-2 h-6 w-6 text-indigo-600" />
              Role Management
            </h1>
            <p className="text-gray-500 mt-1">Manage user roles and their permissions</p>
          </div>
          <button
            onClick={() => setShowAddRoleModal(true)}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-5 py-2.5 rounded-lg hover:from-indigo-700 hover:to-indigo-800 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium"
          >
            <Plus className="h-5 w-5" />
            Add New Role
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-gray-800">Available Roles</h2>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={2} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Loading roles...</p>
                  </td>
                </tr>
              ) : roles.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <UserCog className="h-10 w-10 text-gray-300 mb-2" />
                      <p className="text-gray-500">No roles found</p>
                      <button 
                        onClick={() => setShowAddRoleModal(true)}
                        className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Add your first role
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                roles.map((role) => (
                  <tr key={role.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="font-medium text-gray-900">{role.name}</div>
                        <span className={`ml-2 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(role.role)}`}>
                          {role.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(role)}
                          className="text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg p-1.5 transition-all"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(role)}
                          className="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-1.5 transition-all"
                          title="Edit role"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenPermissionModal(role)}
                          className="text-purple-500 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-1.5 transition-all"
                          title="Manage permissions"
                        >
                          <Key className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Role Modal */}
      {showAddRoleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all animate-slide-up">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Add New Role</h2>
                <button
                  onClick={() => {
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
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddRole();
              }}
              className="p-6 space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                <input
                  type="text"
                  value={newRole.name}
                  onChange={(e) =>
                    setNewRole({ ...newRole, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all focus:outline-none"
                  placeholder="Enter role name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role Type</label>
                <select
                  value={newRole.role}
                  onChange={(e) =>
                    setNewRole({ ...newRole, role: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all focus:outline-none bg-white"
                  required
                >
                  <option value="">Select Role Type</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </div>
              <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
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
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedRole && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in overflow-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all animate-slide-up">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-indigo-600" />
                  <h2 className="text-xl font-bold text-gray-800">Role Details</h2>
                </div>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedRole(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Role Name</div>
                  <div className="font-semibold text-gray-900">{selectedRole.name}</div>
                </div>
                <div className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(selectedRole.role)}`}>
                  {selectedRole.role}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Role Access</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Dashboard Module */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center border-b border-gray-200 pb-2">
                      <Shield className="h-4 w-4 mr-2 text-indigo-500" />
                      Dashboard
                    </h4>
                    <div className="px-2">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${selectedRole.permissions.analytics?.includes('view') ? 'bg-green-500' : 'bg-gray-300'}`}>
                          {selectedRole.permissions.analytics?.includes('view') && <span className="text-white text-xs">✓</span>}
                        </div>
                        <span className={`text-sm ${selectedRole.permissions.analytics?.includes('view') ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                          View Access
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Analytics Module */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center border-b border-gray-200 pb-2">
                      <Shield className="h-4 w-4 mr-2 text-indigo-500" />
                      Analytics
                    </h4>
                    <div className="px-2">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${selectedRole.permissions.analytics?.includes('view') ? 'bg-green-500' : 'bg-gray-300'}`}>
                          {selectedRole.permissions.analytics?.includes('view') && <span className="text-white text-xs">✓</span>}
                        </div>
                        <span className={`text-sm ${selectedRole.permissions.analytics?.includes('view') ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                          View Access
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Settings Module */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center border-b border-gray-200 pb-2">
                      <Shield className="h-4 w-4 mr-2 text-indigo-500" />
                      Settings
                    </h4>
                    <div className="grid grid-cols-2 gap-2 px-2">
                      {["view", "create", "edit", "delete"].map((permission) => {
                        const hasPermission = selectedRole.permissions.settings?.includes(permission);
                        return (
                          <div key={permission} className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${hasPermission ? 'bg-green-500' : 'bg-gray-300'}`}>
                              {hasPermission && <span className="text-white text-xs">✓</span>}
                            </div>
                            <span className={`text-sm capitalize ${hasPermission ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                              {permission}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* User Management Module */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center border-b border-gray-200 pb-2">
                      <Shield className="h-4 w-4 mr-2 text-indigo-500" />
                      User Management
                    </h4>
                    <div className="grid grid-cols-2 gap-2 px-2">
                      {["view", "create", "edit", "delete"].map((permission) => {
                        const hasPermission = selectedRole.permissions.user?.includes(permission);
                        return (
                          <div key={permission} className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${hasPermission ? 'bg-green-500' : 'bg-gray-300'}`}>
                              {hasPermission && <span className="text-white text-xs">✓</span>}
                            </div>
                            <span className={`text-sm capitalize ${hasPermission ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                              {permission}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Pargon Website */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center border-b border-gray-200 pb-2">
                      <Shield className="h-4 w-4 mr-2 text-indigo-500" />
                      Pargon Website
                    </h4>
                    <div className="grid grid-cols-2 gap-2 px-2">
                      {["view", "create", "edit", "delete"].map((permission) => {
                        const hasPermission = selectedRole.permissions.pargon?.includes(permission);
                        return (
                          <div key={permission} className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${hasPermission ? 'bg-green-500' : 'bg-gray-300'}`}>
                              {hasPermission && <span className="text-white text-xs">✓</span>}
                            </div>
                            <span className={`text-sm capitalize ${hasPermission ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                              {permission}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Parasole Website */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center border-b border-gray-200 pb-2">
                      <Shield className="h-4 w-4 mr-2 text-indigo-500" />
                      Parasole Website
                    </h4>
                    <div className="grid grid-cols-2 gap-2 px-2">
                      {["view", "create", "edit", "delete"].map((permission) => {
                        const hasPermission = selectedRole.permissions.parasole?.includes(permission);
                        return (
                          <div key={permission} className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${hasPermission ? 'bg-green-500' : 'bg-gray-300'}`}>
                              {hasPermission && <span className="text-white text-xs">✓</span>}
                            </div>
                            <span className={`text-sm capitalize ${hasPermission ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                              {permission}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end bg-gray-50 rounded-b-xl">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedRole(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedRole && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all animate-slide-up">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Edit className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-800">Edit Role</h2>
                </div>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedRole(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveRole();
              }}
              className="p-6 space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                <input
                  type="text"
                  value={selectedRole.name}
                  onChange={(e) =>
                    setSelectedRole({ ...selectedRole, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role Type</label>
                <select
                  value={selectedRole.role}
                  onChange={(e) =>
                    setSelectedRole({ ...selectedRole, role: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all focus:outline-none bg-white"
                  required
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </div>
              <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedRole(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionModal && selectedRole && (
        <PermissionModal
          selectedRole={selectedRole}
          permissionOptions={permissionOptions}
          handlePermissionChange={handlePermissionChange}
          handlePermissionSave={handlePermissionSave}
          setShowPermissionModal={setShowPermissionModal}
          setSelectedRole={setSelectedRole}
        />
      )}
    </div>
  );
};

export default Roles;