


// "use client";

// import React, { useState, useEffect } from "react";
// import Cookies from "js-cookie";
// import PermissionModal from "./roles&permission"; // Import the new component

// const Roles = () => {
//   // States
//   const [roles, setRoles] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showAddRoleModal, setShowAddRoleModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showPermissionModal, setShowPermissionModal] = useState(false);
//   interface Role {
//     id: string;
//     name: string;
//     role: string;
//     permissions: {
//       pargon: string[];
//       parasole: string[];
//     };
//   }
  
//   const [selectedRole, setSelectedRole] = useState<Role | null>(null);
//   const [newRole, setNewRole] = useState({
//     name: "",
//     role: "",
//     permissions: {
//       pargon: [],
//       parasole: [],
//     },
//   });

//   // Permission options
//   const permissionOptions = {
//     pargon: ["view", "edit", "delete", "create"],
//     parasole: ["view", "edit", "delete", "create"],
//   };

//   // Fetch roles from API
//   const fetchRoles = async () => {
//     setIsLoading(true);
//     try {
//       const token = Cookies.get("token");
//       const response = await fetch("http://localhost:7000/api/v1/role", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch roles");
//       }

//       const data = await response.json();
//       const rolesData = Array.isArray(data) ? data : data.data || data.roles || [];
//       const formattedRoles = rolesData.map((role) => ({
//         id: role.id || role._id,
//         name: role.name || "",
//         role: role.role || "",
//         permissions: {
//           pargon: Array.isArray(role.permissions?.pargon) ? role.permissions.pargon : [],
//           parasole: Array.isArray(role.permissions?.parasole) ? role.permissions.parasole : [],
//         },
//       }));

//       setRoles(formattedRoles);
//     } catch (error) {
//       console.error("Error fetching roles:", error);
//       setRoles([]);
//     }
//     setIsLoading(false);
//   };

//   useEffect(() => {
//     fetchRoles();
//   }, []);

//   // Handle View
//   const handleView = (role) => {
//     setSelectedRole({ ...role });
//     setShowViewModal(true);
//   };

//   // Handle Edit
//   const handleEdit = (role) => {
//     setSelectedRole({ ...role });
//     setShowEditModal(true);
//   };

//   // Handle Permission Change
//   const handlePermissionChange = (website: 'pargon' | 'parasole', permission: string) => {
//     if (!selectedRole || !selectedRole.permissions) return;

//     const currentPermissions = selectedRole.permissions[website] || [];
//     const updatedPermissions = currentPermissions.includes(permission)
//       ? currentPermissions.filter((p) => p !== permission)
//       : [...currentPermissions, permission];

//     setSelectedRole({
//       ...selectedRole,
//       permissions: {
//         ...selectedRole.permissions,
//         [website]: updatedPermissions,
//       },
//     });
//   };

//   // Handle Save Permissions
//   const handlePermissionSave = async () => {
//     if (!selectedRole || !selectedRole.id) {
//       console.error("No role selected for permission update");
//       return;
//     }

//     try {
//       const token = Cookies.get("token");
//       const payload = {
//         permissions: {
//           pargon: selectedRole.permissions.pargon || [],
//           parasole: selectedRole.permissions.parasole || [],
//         },
//       };
//       console.log("Sending payload:", payload); // Log the payload

//       const response = await fetch(`http://localhost:7000/api/v1/role/${selectedRole.id}/permissions`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error("Server error response:", errorData); // Log server response
//         alert(errorData.error || "Failed to update permissions"); // Show error to user
//         throw new Error(errorData.error || "Failed to update permissions");
//       }

//       await fetchRoles(); // Refresh roles after successful update
//       setShowPermissionModal(false);
//       setSelectedRole(null);
//     } catch (error) {
//       console.error("Error updating permissions:", error.message);
//     }
//   };

//   // Handle Save Role
//   const handleSaveRole = async () => {
//     if (!selectedRole || !selectedRole.id) {
//       console.error("No role selected for editing");
//       return;
//     }

//     try {
//       const token = Cookies.get("token");
//       const response = await fetch(`http://localhost:7000/api/v1/role/${selectedRole.id}`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(selectedRole),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error("Server error response:", errorData); // Log server response
//         alert(errorData.error || "Failed to update role"); // Show error to user
//         throw new Error(errorData.error || "Failed to update role");
//       }

//       await fetchRoles(); // Refresh roles after successful update
//       setShowEditModal(false);
//       setSelectedRole(null);
//     } catch (error) {
//       console.error("Error updating role:", error.message);
//     }
//   };

//   // Handle Add Role
//   const handleAddRole = async () => {
//     try {
//       const token = Cookies.get("token");
//       const response = await fetch("http://localhost:7000/api/v1/role", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newRole),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error("Server error response:", errorData); // Log server response
//         alert(errorData.error || "Failed to add role"); // Show error to user
//         throw new Error(errorData.error || "Failed to add role");
//       }

//       await fetchRoles(); // Refresh roles after successful addition
//       setShowAddRoleModal(false);
//       setNewRole({
//         name: "",
//         role: "",
//         permissions: {
//           pargon: [],
//           parasole: [],
//         },
//       });
//     } catch (error) {
//       console.error("Error adding role:", error.message);
//     }
//   };

//   return (
//     <div>
//       {/* Header Section */}
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Role Management</h1>
//         <button
//           onClick={() => setShowAddRoleModal(true)}
//           className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
//         >
//           + Add Role
//         </button>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border border-gray-300">
//           <thead>
//             <tr>
//               <th className="py-2 px-4 border-b">Role</th>
//               <th className="py-2 px-4 border-b">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {isLoading ? (
//               <tr>
//                 <td colSpan="2" className="text-center py-4">
//                   Loading...
//                 </td>
//               </tr>
//             ) : roles.length === 0 ? (
//               <tr>
//                 <td colSpan="2" className="text-center py-4">
//                   No roles found
//                 </td>
//               </tr>
//             ) : (
//               roles.map((role) => (
//                 <tr key={role.id}>
//                   <td className="py-2 px-4 border-b">{role.name}</td>
//                   <td className="py-2 px-4 border-b flex gap-2">
//                     <button
//                       onClick={() => handleView(role)}
//                       className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
//                     >
//                       View
//                     </button>
//                     <button
//                       onClick={() => handleEdit(role)}
//                       className="px-3 py-1 text-sm border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-200"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => {
//                         setSelectedRole({ ...role });
//                         setShowPermissionModal(true);
//                       }}
//                       className="px-3 py-1 text-sm border border-green-300 text-green-600 rounded-md hover:bg-green-50 transition-colors duration-200"
//                     >
//                       Permissions
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Add Role Modal */}
//       {showAddRoleModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <h2 className="text-xl font-bold mb-4">Add New Role</h2>
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleAddRole();
//               }}
//             >
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">Name</label>
//                 <input
//                   type="text"
//                   value={newRole.name}
//                   onChange={(e) =>
//                     setNewRole({ ...newRole, name: e.target.value })
//                   }
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">Role</label>
//                 <select
//                   value={newRole.role}
//                   onChange={(e) =>
//                     setNewRole({ ...newRole, role: e.target.value })
//                   }
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                   required
//                 >
//                   <option value="">Select Role</option>
//                   <option value="Super Admin">Super Admin</option>
//                   <option value="Admin">Admin</option>
//                   <option value="User">User</option>
//                 </select>
//               </div>
//               <div className="flex justify-end gap-2">
//                 <button
//                   onClick={() => {
//                     setShowAddRoleModal(false);
//                     setNewRole({
//                       name: "",
//                       role: "",
//                       permissions: {
//                         pargon: [],
//                         parasole: [],
//                       },
//                     });
//                   }}
//                   className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors duration-200"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
//                 >
//                   Add Role
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* View Modal */}
//       {showViewModal && selectedRole && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <h2 className="text-xl font-bold mb-4">Role Details</h2>
//             <p>
//               <strong>Name:</strong> {selectedRole.name}
//             </p>
//             <p>
//               <strong>Role:</strong> {selectedRole.role}
//             </p>
//             <p>
//               <strong>Permissions:</strong>
//             </p>
//             <ul>
//               <li>
//                 Pargon: {(selectedRole.permissions?.pargon || []).join(", ") || "No permissions"}
//               </li>
//               <li>
//                 Parasole: {(selectedRole.permissions?.parasole || []).join(", ") || "No permissions"}
//               </li>
//             </ul>
//             <button
//               onClick={() => {
//                 setShowViewModal(false);
//                 setSelectedRole(null);
//               }}
//               className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors duration-200"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Edit Modal */}
//       {showEditModal && selectedRole && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <h2 className="text-xl font-bold mb-4">Edit Role</h2>
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleSaveRole();
//               }}
//             >
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">Name</label>
//                 <input
//                   type="text"
//                   value={selectedRole.name}
//                   onChange={(e) =>
//                     setSelectedRole({ ...selectedRole, name: e.target.value })
//                   }
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">Role</label>
//                 <select
//                   value={selectedRole.role}
//                   onChange={(e) =>
//                     setSelectedRole({ ...selectedRole, role: e.target.value })
//                   }
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                   required
//                 >
//                   <option value="Super Admin">Super Admin</option>
//                   <option value="Admin">Admin</option>
//                   <option value="User">User</option>
//                 </select>
//               </div>
//               <div className="flex justify-end gap-2">
//                 <button
//                   onClick={() => {
//                     setShowEditModal(false);
//                     setSelectedRole(null);
//                   }}
//                   className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors duration-200"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Permissions Modal */}
//       {showPermissionModal && (
//         <PermissionModal
//           selectedRole={selectedRole}
//           permissionOptions={permissionOptions}
//           handlePermissionChange={handlePermissionChange}
//           handlePermissionSave={handlePermissionSave}
//           setShowPermissionModal={setShowPermissionModal}
//           setSelectedRole={setSelectedRole}
//         />
//       )}
//     </div>
//   );
// };

// export default Roles;



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
  UserCog, 
  CheckSquare, 
  Square 
} from "lucide-react";

// Permission Modal Component
const PermissionModal = ({ 
  selectedRole, 
  permissionOptions, 
  handlePermissionChange, 
  handlePermissionSave, 
  setShowPermissionModal, 
  setSelectedRole 
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all animate-slide-up">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-800">
                Permissions for {selectedRole.name}
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
        
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {Object.keys(permissionOptions).map((website) => (
            <div key={website} className="mb-8">
              <h3 className="text-lg font-semibold mb-4 capitalize flex items-center">
                <Shield className="h-4 w-4 mr-2 text-indigo-500" />
                {website} Website
              </h3>
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {permissionOptions[website].map((permission) => (
                    <div 
                      key={permission}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white transition-colors cursor-pointer border border-gray-100"
                      onClick={() => handlePermissionChange(website, permission)}
                    >
                      {selectedRole.permissions[website]?.includes(permission) ? (
                        <CheckSquare className="h-5 w-5 text-indigo-600" />
                      ) : (
                        <Square className="h-5 w-5 text-gray-400" />
                      )}
                      <span className="text-gray-700 capitalize">
                        {permission}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3 bg-gray-50 rounded-b-xl">
          <button
            onClick={() => {
              setShowPermissionModal(false);
              setSelectedRole(null);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-gray-200 flex items-center"
          >
            Cancel
          </button>
          <button
            onClick={handlePermissionSave}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Permissions
          </button>
        </div>
      </div>
    </div>
  );
};

const Roles = () => {
  // States
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  
  interface Role {
    id: string;
    name: string;
    role: string;
    permissions: {
      pargon: string[];
      parasole: string[];
    };
  }
  
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
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
      const rolesData = Array.isArray(data) ? data : data.data || data.roles || [];
      const formattedRoles = rolesData.map((role) => ({
        id: role.id || role._id,
        name: role.name || "",
        role: role.role || "",
        permissions: {
          pargon: Array.isArray(role.permissions?.pargon) ? role.permissions.pargon : [],
          parasole: Array.isArray(role.permissions?.parasole) ? role.permissions.parasole : [],
        },
      }));

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
    setSelectedRole({ ...role });
    setShowViewModal(true);
  };

  // Handle Edit
  const handleEdit = (role) => {
    setSelectedRole({ ...role });
    setShowEditModal(true);
  };

  // Handle Permission Change
  const handlePermissionChange = (website: 'pargon' | 'parasole', permission: string) => {
    if (!selectedRole || !selectedRole.permissions) return;

    const currentPermissions = selectedRole.permissions[website] || [];
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

  // Handle Save Permissions
  const handlePermissionSave = async () => {
    if (!selectedRole || !selectedRole.id) {
      console.error("No role selected for permission update");
      return;
    }

    try {
      const token = Cookies.get("token");
      const payload = {
        permissions: {
          pargon: selectedRole.permissions.pargon || [],
          parasole: selectedRole.permissions.parasole || [],
        },
      };

      const response = await fetch(`http://localhost:7000/api/v1/role/${selectedRole.id}/permissions`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error response:", errorData);
        alert(errorData.error || "Failed to update permissions");
        throw new Error(errorData.error || "Failed to update permissions");
      }

      await fetchRoles();
      setShowPermissionModal(false);
      setSelectedRole(null);
    } catch (error) {
      console.error("Error updating permissions:", error.message);
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
      const response = await fetch(`http://localhost:7000/api/v1/role/${selectedRole.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedRole),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error response:", errorData);
        alert(errorData.error || "Failed to update role");
        throw new Error(errorData.error || "Failed to update role");
      }

      await fetchRoles();
      setShowEditModal(false);
      setSelectedRole(null);
    } catch (error) {
      console.error("Error updating role:", error.message);
    }
  };

  // Handle Add Role
  const handleAddRole = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch("http://localhost:7000/api/v1/role", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRole),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error response:", errorData);
        alert(errorData.error || "Failed to add role");
        throw new Error(errorData.error || "Failed to add role");
      }

      await fetchRoles();
      setShowAddRoleModal(false);
      setNewRole({
        name: "",
        role: "",
        permissions: {
          pargon: [],
          parasole: [],
        },
      });
    } catch (error) {
      console.error("Error adding role:", error.message);
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
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissions
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Loading roles...</p>
                  </td>
                </tr>
              ) : roles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
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
                      <div className="font-medium text-gray-900">{role.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(role.role)}`}>
                        {role.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2 flex-wrap">
                        {Object.keys(role.permissions).map(website => (
                          role.permissions[website].length > 0 && (
                            <span key={website} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-800 border border-indigo-100">
                              {website}: {role.permissions[website].length}
                            </span>
                          )
                        ))}
                        {Object.values(role.permissions).every(perms => perms.length === 0) && (
                          <span className="text-gray-400 text-sm">No permissions</span>
                        )}
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
                          onClick={() => {
                            setSelectedRole({ ...role });
                            setShowPermissionModal(true);
                          }}
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
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
                <h3 className="text-lg font-semibold mb-3">Permissions</h3>
                
                {Object.keys(selectedRole.permissions).map((website) => (
                  <div key={website} className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 capitalize mb-2 flex items-center">
                      <Shield className="h-4 w-4 mr-1 text-indigo-500" />
                      {website} Website
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      {selectedRole.permissions[website].length === 0 ? (
                        <p className="text-gray-500 text-sm">No permissions configured</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {selectedRole.permissions[website].map((permission) => (
                            <span 
                              key={permission}
                              className="px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 capitalize"
                            >
                              {permission}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
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
      {showPermissionModal && (
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