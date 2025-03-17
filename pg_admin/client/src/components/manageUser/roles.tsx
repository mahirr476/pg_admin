
"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { 
  Shield, 
  Edit, 
  Eye, 
  Key, 
  Plus, 
  UserCog,
  Search,
  Loader2,
  ShieldCheck,
  ChevronDown
} from "lucide-react";

// Import separated modal components
import AddRoleModal from "./roles/AddRoleModal";
import ViewRoleModal from "./roles/ViewRoleModal";
import EditRoleModal from "./roles/EditRoleModal";
import PermissionModal from "./roles/PermissionModal";

const Roles = () => {
  // States
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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
      setFilteredRoles(formattedRoles);
    } catch (error) {
      console.error("Error fetching roles:", error);
      setRoles([]);
      setFilteredRoles([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Filter roles based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredRoles(roles);
    } else {
      const filtered = roles.filter(
        role => 
          role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          role.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRoles(filtered);
    }
  }, [searchTerm, roles]);

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
        return 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white';
      case 'Admin':
        return 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white';
      case 'User':
        return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  // Get status dot based on permissions count
  const getStatusIndicator = (role) => {
    // Calculate total permissions for this role
    let totalPermissions = 0;
    if (role?.permissions) {
      Object.values(role.permissions).forEach(permArray => {
        totalPermissions += permArray.length;
      });
    }
    
    if (totalPermissions === 0) {
      return (
        <span className="relative flex h-2 w-2 mr-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
      );
    } else if (totalPermissions < 5) {
      return (
        <span className="relative flex h-2 w-2 mr-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
        </span>
      );
    } else {
      return (
        <span className="relative flex h-2 w-2 mr-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
      );
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <ShieldCheck className="mr-3 h-8 w-8 text-indigo-600" />
              Role Management
            </h1>
            <p className="text-gray-500 mt-2 flex items-center">
              <span className="w-1 h-6 bg-indigo-600 rounded-full mr-2"></span>
              Manage user roles and their permissions with complete control
            </p>
          </div>
          <button
            onClick={() => setShowAddRoleModal(true)}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-violet-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 flex items-center justify-center gap-2 font-medium"
          >
            <Plus className="h-5 w-5" />
            Create New Role
          </button>
        </div>
      </div>

      {/* Search and Filter Row */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="pl-10 pr-4 py-3 w-full bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative inline-block text-left w-full md:w-auto">
          <div>
            <button 
              type="button" 
              className="inline-flex justify-center w-full rounded-xl border border-gray-200 shadow-sm px-4 py-3 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="mr-1">Sort By</span>
              <ChevronDown className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
          <h2 className="font-semibold text-gray-800 text-lg flex items-center">
            <Shield className="h-5 w-5 text-indigo-600 mr-2" />
            Available Roles
          </h2>
          <span className="text-sm text-gray-500">{filteredRoles.length} roles found</span>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
                      <p className="mt-2 text-sm text-gray-600 font-medium">Loading roles...</p>
                      <p className="text-xs text-gray-500 mt-1">Please wait while we fetch your data</p>
                    </div>
                  </td>
                </tr>
              ) : filteredRoles.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="bg-gray-100 rounded-full p-5 mb-4">
                        <UserCog className="h-12 w-12 text-gray-400" />
                      </div>
                      <p className="text-gray-600 font-medium">No roles found</p>
                      <p className="text-gray-500 text-sm mt-1 mb-4 max-w-md">
                        {searchTerm ? 
                          `No roles match your search "${searchTerm}". Try a different search term or clear the search.` : 
                          "You haven't created any roles yet. Add your first role to get started."}
                      </p>
                      <button 
                        onClick={() => setShowAddRoleModal(true)}
                        className="mt-2 px-4 py-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg transition-colors font-medium text-sm"
                      >
                        <Plus className="h-4 w-4 inline mr-1" />
                        Add your first role
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRoles.map((role, index) => (
                  <tr 
                    key={role.id} 
                    className={`hover:bg-indigo-50/30 transition-colors group 
                      ${index === 0 ? 'animate-fadeIn' : `animate-fadeIn animation-delay-${Math.min(index, 10) * 100}`}`}
                    style={{animationDelay: `${Math.min(index * 50, 500)}ms`}}
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="font-medium text-gray-900">{role.name}</div>
                        <span className={`ml-2 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(role.role)}`}>
                          {role.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        {getStatusIndicator(role)}
                        Permissions
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleView(role)}
                          className="text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg p-2 transition-all hover:shadow-md"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(role)}
                          className="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-2 transition-all hover:shadow-md"
                          title="Edit role"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenPermissionModal(role)}
                          className="text-purple-500 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-2 transition-all hover:shadow-md"
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
        
        {/* Table Footer */}
        {filteredRoles.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 text-sm text-gray-500 flex justify-between items-center">
            <div>
              Showing <span className="font-medium text-gray-900">{filteredRoles.length}</span> roles
            </div>
            <div className="flex items-center">
              <button className="px-3 py-1 border border-gray-200 rounded-l-lg hover:bg-white transition-colors">
                Previous
              </button>
              <button className="px-3 py-1 border-t border-b border-r border-gray-200 bg-white text-indigo-600 font-medium">
                1
              </button>
              <button className="px-3 py-1 border-t border-b border-gray-200 hover:bg-white transition-colors">
                2
              </button>
              <button className="px-3 py-1 border-t border-b border-gray-200 hover:bg-white transition-colors">
                3
              </button>
              <button className="px-3 py-1 border-t border-b border-r border-gray-200 rounded-r-lg hover:bg-white transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tips Box */}
      <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-sm border border-indigo-100/50 p-5">
        <div className="flex items-start">
          <div className="bg-white p-2 rounded-full shadow-sm border border-indigo-100 mr-4">
            <ShieldCheck className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-indigo-900 text-md">Pro Tip: Role Management Best Practices</h3>
            <p className="text-indigo-800/70 text-sm mt-1">
              Assign permissions based on job responsibilities rather than individuals. Regularly review and audit role permissions to maintain proper security controls.
            </p>
          </div>
        </div>
      </div>

      {/* Render the modals using the separated components */}
      <AddRoleModal 
        showAddRoleModal={showAddRoleModal}
        setShowAddRoleModal={setShowAddRoleModal}
        newRole={newRole}
        setNewRole={setNewRole}
        handleAddRole={handleAddRole}
      />

      <ViewRoleModal 
        showViewModal={showViewModal}
        selectedRole={selectedRole}
        setShowViewModal={setShowViewModal}
        setSelectedRole={setSelectedRole}
        getRoleBadgeColor={getRoleBadgeColor}
      />

      <EditRoleModal 
        showEditModal={showEditModal}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        setShowEditModal={setShowEditModal}
        handleSaveRole={handleSaveRole}
      />

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
      
      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-600 { animation-delay: 600ms; }
        .animation-delay-700 { animation-delay: 700ms; }
        .animation-delay-800 { animation-delay: 800ms; }
        .animation-delay-900 { animation-delay: 900ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }
      `}</style>
    </div>
  );
};

export default Roles;