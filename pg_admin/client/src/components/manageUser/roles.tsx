

// "use client";

// import React, { useState, useEffect } from "react";
// import Cookies from "js-cookie";

// const Roles = () => {
//   // States
//   const [roles, setRoles] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showAddRoleModal, setShowAddRoleModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showPermissionModal, setShowPermissionModal] = useState(false);
//   const [selectedRole, setSelectedRole] = useState(null);
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
//   const handlePermissionChange = (website, permission) => {
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
//       {showPermissionModal && selectedRole && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <h2 className="text-xl font-bold mb-4">Manage Permissions</h2>
//             <div className="mb-4">
//               <strong>Pargon Permissions</strong>
//               {permissionOptions.pargon.map((permission) => (
//                 <div key={permission} className="flex items-center mb-2">
//                   <input
//                     type="checkbox"
//                     checked={selectedRole.permissions.pargon.includes(permission)}
//                     onChange={() => handlePermissionChange("pargon", permission)}
//                     className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                   />
//                   <span>{permission.charAt(0).toUpperCase() + permission.slice(1)}</span>
//                 </div>
//               ))}
//             </div>
//             <div className="mb-4">
//               <strong>Parasole Permissions</strong>
//               {permissionOptions.parasole.map((permission) => (
//                 <div key={permission} className="flex items-center mb-2">
//                   <input
//                     type="checkbox"
//                     checked={selectedRole.permissions.parasole.includes(permission)}
//                     onChange={() => handlePermissionChange("parasole", permission)}
//                     className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                   />
//                   <span>{permission.charAt(0).toUpperCase() + permission.slice(1)}</span>
//                 </div>
//               ))}
//             </div>
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => {
//                   setShowPermissionModal(false);
//                   setSelectedRole(null);
//                 }}
//                 className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors duration-200"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handlePermissionSave}
//                 className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
//               >
//                 Save Permissions
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Roles;




"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import PermissionModal from "./roles&permission"; // Import the new component

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
      console.log("Sending payload:", payload); // Log the payload

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
        console.error("Server error response:", errorData); // Log server response
        alert(errorData.error || "Failed to update permissions"); // Show error to user
        throw new Error(errorData.error || "Failed to update permissions");
      }

      await fetchRoles(); // Refresh roles after successful update
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
        console.error("Server error response:", errorData); // Log server response
        alert(errorData.error || "Failed to update role"); // Show error to user
        throw new Error(errorData.error || "Failed to update role");
      }

      await fetchRoles(); // Refresh roles after successful update
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
        console.error("Server error response:", errorData); // Log server response
        alert(errorData.error || "Failed to add role"); // Show error to user
        throw new Error(errorData.error || "Failed to add role");
      }

      await fetchRoles(); // Refresh roles after successful addition
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

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Role Management</h1>
        <button
          onClick={() => setShowAddRoleModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
        >
          + Add Role
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Role</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="2" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : roles.length === 0 ? (
              <tr>
                <td colSpan="2" className="text-center py-4">
                  No roles found
                </td>
              </tr>
            ) : (
              roles.map((role) => (
                <tr key={role.id}>
                  <td className="py-2 px-4 border-b">{role.name}</td>
                  <td className="py-2 px-4 border-b flex gap-2">
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
                      onClick={() => {
                        setSelectedRole({ ...role });
                        setShowPermissionModal(true);
                      }}
                      className="px-3 py-1 text-sm border border-green-300 text-green-600 rounded-md hover:bg-green-50 transition-colors duration-200"
                    >
                      Permissions
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Role Modal */}
      {showAddRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Role</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddRole();
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={newRole.name}
                  onChange={(e) =>
                    setNewRole({ ...newRole, name: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  value={newRole.role}
                  onChange={(e) =>
                    setNewRole({ ...newRole, role: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
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

      {/* View Modal */}
      {showViewModal && selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Role Details</h2>
            <p>
              <strong>Name:</strong> {selectedRole.name}
            </p>
            <p>
              <strong>Role:</strong> {selectedRole.role}
            </p>
            <p>
              <strong>Permissions:</strong>
            </p>
            <ul>
              <li>
                Pargon: {(selectedRole.permissions?.pargon || []).join(", ") || "No permissions"}
              </li>
              <li>
                Parasole: {(selectedRole.permissions?.parasole || []).join(", ") || "No permissions"}
              </li>
            </ul>
            <button
              onClick={() => {
                setShowViewModal(false);
                setSelectedRole(null);
              }}
              className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Role</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveRole();
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={selectedRole.name}
                  onChange={(e) =>
                    setSelectedRole({ ...selectedRole, name: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  value={selectedRole.role}
                  onChange={(e) =>
                    setSelectedRole({ ...selectedRole, role: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedRole(null);
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