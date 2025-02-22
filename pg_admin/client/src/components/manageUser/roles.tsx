// "use client";

// import React, { useState } from "react";

// const Roles = () => {
//   // Existing initial roles data...
//   const initialRoles = [
//     {
//       id: 1,
//       name: "John Smith",
//       role: "SuperAdmin",
//       permissions: {
//         pargon: ["view", "edit", "delete"],
//         parasole: ["view", "edit"],
//       },
//     },
//     {
//       id: 2,
//       name: "Sarah Johnson",
//       role: "Admin",
//       permissions: {
//         pargon: ["view", "edit"],
//         parasole: ["view"],
//       },
//     },
//     {
//       id: 3,
//       name: "Mike Wilson",
//       role: "User",
//       permissions: {
//         pargon: ["view"],
//         parasole: ["view"],
//       },
//     },
//   ];

//   // States (including new state for Add Role modal)
//   const [roles, setRoles] = useState(initialRoles);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showPermissionModal, setShowPermissionModal] = useState(false);
//   const [showAddRoleModal, setShowAddRoleModal] = useState(false);
//   const [selectedRole, setSelectedRole] = useState(null);
//   const [editedRole, setEditedRole] = useState(null);
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

//   // Existing handlers...
//   const handleView = (role) => {
//     setSelectedRole(role);
//     setShowViewModal(true);
//   };

//   const handleEdit = (role) => {
//     setEditedRole({ ...role });
//     setShowEditModal(true);
//   };

//   const handleEditSubmit = (e) => {
//     e.preventDefault();
//     setRoles(
//       roles.map((role) => (role.id === editedRole.id ? editedRole : role))
//     );
//     setShowEditModal(false);
//     setEditedRole(null);
//   };

//   const handlePermission = (role) => {
//     setSelectedRole({ ...role });
//     setShowPermissionModal(true);
//   };

//   const handlePermissionChange = (website, permission) => {
//     const currentPermissions = selectedRole.permissions[website];
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

//   const handlePermissionSave = () => {
//     setRoles(
//       roles.map((role) => (role.id === selectedRole.id ? selectedRole : role))
//     );
//     setShowPermissionModal(false);
//     setSelectedRole(null);
//   };

//   // New handler for adding role
//   const handleAddRole = (e) => {
//     e.preventDefault();
//     const id = Math.max(...roles.map((role) => role.id)) + 1;
//     setRoles([...roles, { ...newRole, id }]);
//     setNewRole({
//       name: "",
//       role: "",
//       permissions: {
//         pargon: [],
//         parasole: [],
//       },
//     });
//     setShowAddRoleModal(false);
//   };

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       {/* Enhanced Header Section */}
//       <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow">
//         <h1 className="text-2xl font-bold text-gray-800">Role Management</h1>
//         <button
//           onClick={() => setShowAddRoleModal(true)}
//           className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
//         >
//           <span className="text-xl">+</span> Add Role
//         </button>
//       </div>

//       {/* Enhanced Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="min-w-full">
//           <thead>
//             <tr className="bg-gray-50 border-b border-gray-200">
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Name
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Role
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {roles.map((role) => (
//               <tr key={role.id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 whitespace-nowrap">{role.name}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
//                     {role.role}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex gap-2">
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
//                       onClick={() => handlePermission(role)}
//                       className="px-3 py-1 text-sm border border-green-300 text-green-600 rounded-md hover:bg-green-50 transition-colors duration-200"
//                     >
//                       Permissions
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Add Role Modal */}
//       {showAddRoleModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
//             <h2 className="text-xl font-bold mb-4">Add New Role</h2>
//             <form onSubmit={handleAddRole}>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">Name</label>
//                 <input
//                   type="text"
//                   value={newRole.name}
//                   onChange={(e) =>
//                     setNewRole({ ...newRole, name: e.target.value })
//                   }
//                   className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">Role</label>
//                 <select
//                   value={newRole.role}
//                   onChange={(e) =>
//                     setNewRole({ ...newRole, role: e.target.value })
//                   }
//                   className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 >
//                   <option value="">Select Role</option>
//                   <option value="SuperAdmin">Super Admin</option>
//                   <option value="Admin">Admin</option>
//                   <option value="User">User</option>
//                 </select>
//               </div>
//               <div className="flex justify-end gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setShowAddRoleModal(false)}
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

//       {/* Existing modals with enhanced styling... */}
//       {/* View Modal */}
//       {showViewModal && selectedRole && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
//             <h2 className="text-xl font-bold mb-4">Role Details</h2>
//             <div className="mb-4">
//               <p className="text-sm font-medium text-gray-500">Name</p>
//               <p className="mt-1">{selectedRole.name}</p>
//             </div>
//             <div className="mb-4">
//               <p className="text-sm font-medium text-gray-500">Role</p>
//               <p className="mt-1">{selectedRole.role}</p>
//             </div>
//             <div className="mb-4">
//               <p className="text-sm font-medium text-gray-500">Permissions</p>
//               <div className="mt-2">
//                 <p className="font-medium">Pargon:</p>
//                 <p className="ml-2">
//                   {selectedRole.permissions.pargon.join(", ")}
//                 </p>
//                 <p className="font-medium mt-2">Parasole:</p>
//                 <p className="ml-2">
//                   {selectedRole.permissions.parasole.join(", ")}
//                 </p>
//               </div>
//             </div>
//             <div className="flex justify-end">
//               <button
//                 onClick={() => setShowViewModal(false)}
//                 className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors duration-200"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Modal */}
//       {showEditModal && editedRole && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
//             <h2 className="text-xl font-bold mb-4">Edit Role</h2>
//             <form onSubmit={handleEditSubmit}>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">Name</label>
//                 <input
//                   type="text"
//                   value={editedRole.name}
//                   onChange={(e) =>
//                     setEditedRole({ ...editedRole, name: e.target.value })
//                   }
//                   className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">Role</label>
//                 <select
//                   value={editedRole.role}
//                   onChange={(e) =>
//                     setEditedRole({ ...editedRole, role: e.target.value })
//                   }
//                   className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 >
//                   <option value="SuperAdmin">Super Admin</option>
//                   <option value="Admin">Admin</option>
//                   <option value="User">User</option>
//                 </select>
//               </div>
//               <div className="flex justify-end gap-2">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowEditModal(false);
//                     setEditedRole(null);
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
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
//             <h2 className="text-xl font-bold mb-4">Manage Permissions</h2>
//             <div className="mb-6">
//               <h3 className="font-medium mb-2">Pargon Permissions</h3>
//               <div className="space-y-2">
//                 {permissionOptions.pargon.map((permission) => (
//                   <label key={permission} className="flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={selectedRole.permissions.pargon.includes(
//                         permission
//                       )}
//                       onChange={() =>
//                         handlePermissionChange("pargon", permission)
//                       }
//                       className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                     />
//                     {permission.charAt(0).toUpperCase() + permission.slice(1)}
//                   </label>
//                 ))}
//               </div>
//             </div>
//             <div className="mb-6">
//               <h3 className="font-medium mb-2">Parasole Permissions</h3>
//               <div className="space-y-2">
//                 {permissionOptions.parasole.map((permission) => (
//                   <label key={permission} className="flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={selectedRole.permissions.parasole.includes(
//                         permission
//                       )}
//                       onChange={() =>
//                         handlePermissionChange("parasole", permission)
//                       }
//                       className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                     />
//                     {permission.charAt(0).toUpperCase() + permission.slice(1)}
//                   </label>
//                 ))}
//               </div>
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




// "use client";

// import React, { useState, useEffect } from "react";
// import Cookies from 'js-cookie';

// const Roles = () => {
//   // States
//   const [roles, setRoles] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showPermissionModal, setShowPermissionModal] = useState(false);
//   const [showAddRoleModal, setShowAddRoleModal] = useState(false);
//   const [selectedRole, setSelectedRole] = useState(null);
//   const [editedRole, setEditedRole] = useState(null);
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
//       const token = Cookies.get('token'); // Get token from cookies
//       const response = await fetch('http://localhost:7000/api/v1/role', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch roles');
//       }
      
//       const data = await response.json();
//       console.log('API Response:', data); // Log the response to see its structure
      
//       // Check if data is in the expected format and handle different response structures
//       if (Array.isArray(data)) {
//         setRoles(data);
//       } else if (data.data && Array.isArray(data.data)) {
//         // If the API returns data in a wrapper object like { data: [...] }
//         setRoles(data.data);
//       } else if (data.roles && Array.isArray(data.roles)) {
//         // If the API returns data in a wrapper object like { roles: [...] }
//         setRoles(data.roles);
//       } else {
//         // If we get unexpected data structure, initialize as empty array
//         console.error('Unexpected data structure:', data);
//         setRoles([]);
//       }
//       setIsLoading(false);
//     } catch (error) {
//       console.error('Error fetching roles:', error);
//     }
//   };

//   // Add new role
//   const handleAddRole = async (e) => {
//     e.preventDefault();
//     try {
//       const token = Cookies.get('token');
//       const response = await fetch('http://localhost:7000/api/v1/role', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(newRole)
//       });

//       if (!response.ok) {
//         throw new Error('Failed to add role');
//       }

//       await fetchRoles(); // Refresh roles list
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
//       console.error('Error adding role:', error);
//     }
//   };

//   // Update role
//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = Cookies.get('token');
//       const response = await fetch(`http://localhost:7000/api/v1/role/${editedRole.id}`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(editedRole)
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update role');
//       }

//       await fetchRoles();
//       setShowEditModal(false);
//       setEditedRole(null);
//     } catch (error) {
//       console.error('Error updating role:', error);
//     }
//   };

//   // Update permissions
//   const handlePermissionSave = async () => {
//     try {
//       const token = Cookies.get('token');
//       const response = await fetch(`http://localhost:7000/api/v1/role/${selectedRole.id}/permissions`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ permissions: selectedRole.permissions })
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update permissions');
//       }

//       await fetchRoles();
//       setShowPermissionModal(false);
//       setSelectedRole(null);
//     } catch (error) {
//       console.error('Error updating permissions:', error);
//     }
//   };

//   // Load roles on component mount
//   useEffect(() => {
//     fetchRoles();
//   }, []);

//   // Existing handlers
//   const handleView = (role) => {
//     setSelectedRole(role);
//     setShowViewModal(true);
//   };

//   const handleEdit = (role) => {
//     setEditedRole({ ...role });
//     setShowEditModal(true);
//   };

//   const handlePermission = (role) => {
//     setSelectedRole({ ...role });
//     setShowPermissionModal(true);
//   };

//   const handlePermissionChange = (website, permission) => {
//     const currentPermissions = selectedRole.permissions[website];
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

//   // Rest of your component JSX remains the same...
//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       {/* Header Section */}
//       <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow">
//         <h1 className="text-2xl font-bold text-gray-800">Role Management</h1>
//         <button
//           onClick={() => setShowAddRoleModal(true)}
//           className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
//         >
//           <span className="text-xl">+</span> Add Role
//         </button>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="min-w-full">
//           <thead>
//             <tr className="bg-gray-50 border-b border-gray-200">
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Role
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {isLoading ? (
//               <tr>
//                 <td colSpan="3" className="px-6 py-4 text-center">
//                   Loading...
//                 </td>
//               </tr>
//             ) : roles.length === 0 ? (
//               <tr>
//                 <td colSpan="3" className="px-6 py-4 text-center">
//                   No roles found
//                 </td>
//               </tr>
//             ) : (
//               roles.map((role) => (
//               <tr key={role.id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 whitespace-nowrap">{role.name}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
//                     {role.status}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex gap-2">
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
//                       onClick={() => handlePermission(role)}
//                       className="px-3 py-1 text-sm border border-green-300 text-green-600 rounded-md hover:bg-green-50 transition-colors duration-200"
//                     >
//                       Permissions
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             )))}
//           </tbody>
//         </table>
//       </div>

//       {/* Your existing modals remain the same */}
//       {/* Add Role Modal */}
//       {showAddRoleModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
//             <h2 className="text-xl font-bold mb-4">Add New Role</h2>
//             <form onSubmit={handleAddRole}>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">Name</label>
//                 <input
//                   type="text"
//                   value={newRole.name}
//                   onChange={(e) =>
//                     setNewRole({ ...newRole, name: e.target.value })
//                   }
//                   className="w-full border rounded-md p-2"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">Role</label>
//                 <select
//                   value={newRole.role}
//                   onChange={(e) =>
//                     setNewRole({ ...newRole, role: e.target.value })
//                   }
//                   className="w-full border rounded-md p-2"
//                   required
//                 >
//                   <option value="">Select Role</option>
//                   <option value="SuperAdmin">Super Admin</option>
//                   <option value="Admin">Admin</option>
//                   <option value="User">User</option>
//                 </select>
//               </div>
//               <div className="flex justify-end gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setShowAddRoleModal(false)}
//                   className="px-4 py-2 border rounded-md hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
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
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
//             <h2 className="text-xl font-bold mb-4">Role Details</h2>
//             <div className="mb-4">
//               <p className="text-sm font-medium text-gray-500">Name</p>
//               <p className="mt-1">{selectedRole.name}</p>
//             </div>
//             <div className="mb-4">
//               <p className="text-sm font-medium text-gray-500">Role</p>
//               <p className="mt-1">{selectedRole.role}</p>
//             </div>
//             <div className="mb-4">
//               <p className="text-sm font-medium text-gray-500">Permissions</p>
//               <div className="mt-2">
//                 <p className="font-medium">Pargon:</p>
//                 <p className="ml-2">{selectedRole.permissions.pargon.join(", ")}</p>
//                 <p className="font-medium mt-2">Parasole:</p>
//                 <p className="ml-2">{selectedRole.permissions.parasole.join(", ")}</p>
//               </div>
//             </div>
//             <div className="flex justify-end">
//               <button
//                 onClick={() => setShowViewModal(false)}
//                 className="px-4 py-2 border rounded-md hover:bg-gray-50"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Modal */}
//       {showEditModal && editedRole && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
//             <h2 className="text-xl font-bold mb-4">Edit Role</h2>
//             <form onSubmit={handleEditSubmit}>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">Name</label>
//                 <input
//                   type="text"
//                   value={editedRole.name}
//                   onChange={(e) =>
//                     setEditedRole({ ...editedRole, name: e.target.value })
//                   }
//                   className="w-full border rounded-md p-2"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">Role</label>
//                 <select
//                   value={editedRole.role}
//                   onChange={(e) =>
//                     setEditedRole({ ...editedRole, role: e.target.value })
//                   }
//                   className="w-full border rounded-md p-2"
//                   required
//                 >
//                   <option value="SuperAdmin">Super Admin</option>
//                   <option value="Admin">Admin</option>
//                   <option value="User">User</option>
//                 </select>
//               </div>
//               <div className="flex justify-end gap-2">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowEditModal(false);
//                     setEditedRole(null);
//                   }}
//                   className="px-4 py-2 border rounded-md hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
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
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
//             <h2 className="text-xl font-bold mb-4">Manage Permissions</h2>
//             <div className="mb-6">
//               <h3 className="font-medium mb-2">Pargon Permissions</h3>
//               <div className="space-y-2">
//                 {permissionOptions.pargon.map((permission) => (
//                   <label key={permission} className="flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={selectedRole.permissions.pargon.includes(permission)}
//                       onChange={() => handlePermissionChange("pargon", permission)}
//                       className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                     />
//                     {permission.charAt(0).toUpperCase() + permission.slice(1)}
//                   </label>
//                 ))}
//               </div>
//             </div>
//             <div className="mb-6">
//               <h3 className="font-medium mb-2">Parasole Permissions</h3>
//               <div className="space-y-2">
//                 {permissionOptions.parasole.map((permission) => (
//                   <label key={permission} className="flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={selectedRole.permissions.parasole.includes(permission)}
//                       onChange={() => handlePermissionChange("parasole", permission)}
//                       className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                     />
//                     {permission.charAt(0).toUpperCase() + permission.slice(1)}
//                   </label>
//                 ))}
//               </div>
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

const Roles = () => {
  // States
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [editedRole, setEditedRole] = useState(null);
  const [newRole, setNewRole] = useState({
    name: "",
    role: "",
    status: "Active",
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
        status: role.status || "Active",
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

  // Add new role
  const handleAddRole = async (e) => {
    e.preventDefault();
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
        throw new Error("Failed to add role");
      }

      await fetchRoles();
      setShowAddRoleModal(false);
      setNewRole({
        name: "",
        role: "",
        status: "Active",
        permissions: {
          pargon: [],
          parasole: [],
        },
      });
    } catch (error) {
      console.error("Error adding role:", error);
    }
  };

  // Update role
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("token");
      const response = await fetch(`http://localhost:7000/api/v1/role/${editedRole.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedRole),
      });

      if (!response.ok) {
        throw new Error("Failed to update role");
      }

      await fetchRoles();
      setShowEditModal(false);
      setEditedRole(null);
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  // Deactivate role
  const handleDeactivate = async (roleId) => {
    if (!window.confirm("Are you sure you want to deactivate this role?")) return;

    try {
      const token = Cookies.get("token");
      const response = await fetch(`http://localhost:7000/api/v1/role/${roleId}/deactivate`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to deactivate role");
      }

      await fetchRoles();
    } catch (error) {
      console.error("Error deactivating role:", error);
    }
  };

  // Update permissions
  const handlePermissionSave = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`http://localhost:7000/api/v1/role/${selectedRole.id}/permissions`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ permissions: selectedRole.permissions }),
      });

      if (!response.ok) {
        throw new Error("Failed to update permissions");
      }

      await fetchRoles();
      setShowPermissionModal(false);
      setSelectedRole(null);
    } catch (error) {
      console.error("Error updating permissions:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleView = (role) => {
    setSelectedRole({ ...role });
    setShowViewModal(true);
  };

  const handleEdit = (role) => {
    setEditedRole({ ...role });
    setShowEditModal(true);
  };

  const handlePermissionChange = (website, permission) => {
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

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Role Management</h1>
        <button
          onClick={() => setShowAddRoleModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
        >
          + Add Role
        </button>
      </div>

      {/* Table */}
      <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left font-medium">Name</th>
            <th className="py-3 px-4 text-left font-medium">Role</th>
            <th className="py-3 px-4 text-left font-medium">Status</th>
            <th className="py-3 px-4 text-left font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="4" className="text-center py-4">
                Loading...
              </td>
            </tr>
          ) : roles.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-4">
                No roles found
              </td>
            </tr>
          ) : (
            roles.map((role) => (
              <tr key={role.id} className="border-t border-gray-200">
                <td className="py-3 px-4">{role.name}</td>
                <td className="py-3 px-4">{role.role}</td>
                <td className="py-3 px-4">{role.status}</td>
                <td className="py-3 px-4 space-x-2">
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
                    onClick={() => handleDeactivate(role.id)}
                    className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors duration-200"
                  >
                    Deactivate
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

      {/* Add Role Modal */}
      {showAddRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Role</h2>
            <form onSubmit={handleAddRole}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Role</label>
                <select
                  value={newRole.role}
                  onChange={(e) => setNewRole({ ...newRole, role: e.target.value })}
                  className="w-full border rounded-md p-2"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={newRole.status}
                  onChange={(e) => setNewRole({ ...newRole, status: e.target.value })}
                  className="w-full border rounded-md p-2"
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddRoleModal(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50 mr-2"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
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
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Role Details</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Name</label>
              <p>{selectedRole.name}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Role</label>
              <p>{selectedRole.role}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Status</label>
              <p>{selectedRole.status}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Permissions</label>
              <p>Pargon: {(selectedRole.permissions?.pargon || []).join(", ") || "No permissions"}</p>
              <p>Parasole: {(selectedRole.permissions?.parasole || []).join(", ") || "No permissions"}</p>
            </div>
            <button
              onClick={() => setShowViewModal(false)}
              className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Role</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={editedRole.name}
                  onChange={(e) => setEditedRole({ ...editedRole, name: e.target.value })}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Role</label>
                <select
                  value={editedRole.role}
                  onChange={(e) => setEditedRole({ ...editedRole, role: e.target.value })}
                  className="w-full border rounded-md p-2"
                  required
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={editedRole.status}
                  onChange={(e) => setEditedRole({ ...editedRole, status: e.target.value })}
                  className="w-full border rounded-md p-2"
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditedRole(null);
                  }}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50 mr-2"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionModal && selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Manage Permissions</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Pargon Permissions</label>
              {permissionOptions.pargon.map((permission) => (
                <label key={permission} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={(selectedRole.permissions?.pargon || []).includes(permission)}
                    onChange={() => handlePermissionChange("pargon", permission)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  {permission.charAt(0).toUpperCase() + permission.slice(1)}
                </label>
              ))}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Parasole Permissions</label>
              {permissionOptions.parasole.map((permission) => (
                <label key={permission} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={(selectedRole.permissions?.parasole || []).includes(permission)}
                    onChange={() => handlePermissionChange("parasole", permission)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  {permission.charAt(0).toUpperCase() + permission.slice(1)}
                </label>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowPermissionModal(false);
                  setSelectedRole(null);
                }}
                className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors duration-200 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handlePermissionSave}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
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