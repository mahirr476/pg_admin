
// "use client";

// import React, { useState, useEffect } from "react";
// import Cookies from "js-cookie";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   User,
//   UserPlus,
//   Edit,
//   Eye,
//   Key,
//   Search,
//   X,
//   UserCog,
//   RefreshCw,
// } from "lucide-react";

// // Import custom components
// import AddUserModal from "./user/AddUserModal";
// import EditUserModal from "./user/EditUserModal";
// import ViewUserModal from "./user/ViewUserModal";
// import PermissionsModal from "./user/PermissionsModal";

// // Define User interface
// interface UserType {
//   id: number;
//   firstName: string;
//   lastName: string;
//   email: string;
//   status: string; // Possible values: active, inactive, closed
//   roleId: number; // Role ID (1: Super Admin, 2: Admin, 3: User)
//   permissions?: {
//     pargon: string[];
//     parasole: string[];
//     user: string[];
//     settings: string[];
//     analytics: string[];
//   };
// }

// interface NewUser {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   status: string;
//   roleId: number;
// }

// const Users = () => {
//   const [isUpdatingStatus, setIsUpdatingStatus] = useState(null);
//   const [users, setUsers] = useState<UserType[]>([]);
//   const [selectedStatus, setSelectedStatus] = useState("all");
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showPermissionModal, setShowPermissionModal] = useState(false);
//   const [editingUser, setEditingUser] = useState<UserType | null>(null);
//   const [viewingUser, setViewingUser] = useState<UserType | null>(null);
//   const [selectedRole, setSelectedRole] = useState<UserType | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");

//   // Permission options
//   const permissionOptions = {
//     pargon: ["view", "create", "edit", "delete"],
//     parasole: ["view", "create", "edit", "delete"],
//     user: ["view", "create", "edit", "delete"],
//     settings: ["view", "create", "edit"],
//     analytics: ["view", "dashboard"],
//   };

//   // Fetch users on component mount
//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     setIsLoading(true);
//     try {
//       const token = Cookies.get("token");
//       if (!token) {
//         setError("No token found, please login first.");
//         setIsLoading(false);
//         return;
//       }

//       const response = await fetch("http://localhost:7000/api/v1/user/all", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Error ${response.status}: ${response.statusText}`);
//       }

//       const data = await response.json();
//       // Initialize permissions for each user if missing
//       const usersWithPermissions = data.users.map((user: UserType) => ({
//         ...user,
//         permissions: user.permissions || {
//           pargon: [],
//           parasole: [],
//           user: [],
//           settings: [],
//           analytics: [],
//         },
//       }));
//       setUsers(usersWithPermissions);
//       setError(null);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       setError(error instanceof Error ? error.message : "An error occurred");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Filter users based on selected status and search query
//   const filteredUsers = users
//     .filter(
//       (user) =>
//         selectedStatus === "all" ||
//         user.status.toLowerCase() === selectedStatus.toLowerCase()
//     )
//     .filter((user) => {
//       if (!searchQuery) return true;
//       const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
//       return (
//         fullName.includes(searchQuery.toLowerCase()) ||
//         user.email.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     });

//   // Handle Add User Form Submission
//   const handleAddUser = async (newUser: NewUser) => {
//     try {
//       const token = Cookies.get("token");
//       if (!token) {
//         throw new Error("No token found, please login first");
//       }

//       // Ensure roleId is a number and status is in the correct format
//       const userToCreate = {
//         ...newUser,
//         roleId: parseInt(newUser.roleId.toString(), 10),
//         status: newUser.status.toUpperCase(),
//       };

//       const response = await fetch("http://localhost:7000/api/v1/user/create", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(userToCreate),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to add user");
//       }

//       await fetchUsers(); // Refresh the user list after adding a new user
//       setShowAddModal(false);
//     } catch (err) {
//       console.error("Error adding user:", err);
//       setError(
//         err instanceof Error
//           ? err.message
//           : "An error occurred while adding user"
//       );
//     }
//   };

//   // Handle Edit Button Click
//   const handleEdit = (user: UserType) => {
//     setEditingUser({ ...user });
//     setShowEditModal(true);
//   };

//   // Handle Edit User Submission
//   const handleEditUser = async (editedUser: UserType) => {
//     try {
//       const token = Cookies.get("token");
//       if (!token) {
//         throw new Error("No token found, please login first");
//       }

//       // Prepare the payload for the API
//       const userToUpdate = {
//         firstName: editedUser.firstName,
//         lastName: editedUser.lastName,
//         email: editedUser.email,
//         roleId: parseInt(editedUser.roleId.toString(), 10),
//         status: editedUser.status.toUpperCase(),
//       };

//       const response = await fetch(
//         `http://localhost:7000/api/v1/user/${editedUser.id}`,
//         {
//           method: "PUT",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(userToUpdate),
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to update user");
//       }

//       await fetchUsers(); // Refresh the user list after successful update

//       // Close the modal and reset the editing state
//       setShowEditModal(false);
//       setEditingUser(null);
//     } catch (err) {
//       console.error("Error updating user:", err);
//       setError(
//         err instanceof Error
//           ? err.message
//           : "An error occurred while updating user"
//       );
//     }
//   };

//   // Handle View Button Click
//   const handleView = (user: UserType) => {
//     // Create a deep copy of the user with default permissions if missing
//     const userWithPermissions = {
//       ...user,
//       permissions: user.permissions || {
//         pargon: [],
//         parasole: [],
//         user: [],
//         settings: [],
//         analytics: [],
//       },
//     };

//     setViewingUser(userWithPermissions);
//     setShowViewModal(true);

//     // Fetch permissions in the background (if you have such an API)
//     fetchUserPermissions(user.id).catch((error) => {
//       console.error("Error fetching permissions for view:", error);
//     });
//   };

//   // Fetch user permissions
//   const fetchUserPermissions = async (userId) => {
//     try {
//       const token = Cookies.get("token");
//       if (!token) {
//         throw new Error("No token found, please login first");
//       }

//       const response = await fetch(
//         `http://localhost:7000/api/v1/user/${userId}/permissions`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         console.warn(`Could not fetch permissions for user ${userId}`);
//         return null;
//       }

//       const data = await response.json();

//       if (data.permissions) {
//         // Update the viewing user with the latest permissions
//         if (viewingUser && viewingUser.id === userId) {
//           setViewingUser((prev) => ({
//             ...prev,
//             permissions: data.permissions,
//           }));
//         }

//         return data.permissions;
//       }

//       return null;
//     } catch (error) {
//       console.error("Error fetching user permissions:", error);
//       return null;
//     }
//   };

//   // Handle Permissions Button Click
//   const handlePermissions = (user: UserType) => {
//     // Create a deep copy of the user with default permissions if missing
//     const userWithDefaultPermissions = {
//       ...user,
//       permissions: user.permissions || {
//         pargon: [],
//         parasole: [],
//         user: [],
//         settings: [],
//         analytics: [],
//       },
//     };

//     setSelectedRole(userWithDefaultPermissions);
//     setShowPermissionModal(true);

//     // Optionally fetch the latest permissions from API
//     fetchUserPermissions(user.id)
//       .then((permissions) => {
//         if (permissions) {
//           setSelectedRole((prev) => ({
//             ...prev,
//             permissions,
//           }));
//         }
//       })
//       .catch((error) => {
//         console.error("Error loading permissions:", error);
//       });
//   };

//   // Handle Permission Change
//   const handlePermissionChange = (website: string, permission: string) => {
//     if (!selectedRole) return;

//     // Make a deep copy of the current permissions
//     const updatedPermissions = JSON.parse(
//       JSON.stringify(selectedRole.permissions || {})
//     );

//     // Ensure the website array exists
//     if (!updatedPermissions[website]) {
//       updatedPermissions[website] = [];
//     }

//     // Toggle the permission
//     const currentPermissions = updatedPermissions[website];
//     const permissionIndex = currentPermissions.indexOf(permission);

//     if (permissionIndex === -1) {
//       // Add permission if it doesn't exist
//       updatedPermissions[website] = [...currentPermissions, permission];
//     } else {
//       // Remove permission if it exists
//       updatedPermissions[website] = currentPermissions.filter(
//         (p) => p !== permission
//       );
//     }

//     // Update state with the new permissions
//     setSelectedRole({
//       ...selectedRole,
//       permissions: updatedPermissions,
//     });
//   };

//   // Convert permissions to the format expected by the API
//   const convertPermissionsToApiFormat = (permissions) => {
//     return {
//       user_id: selectedRole.id,
//       pargon_view: permissions.pargon?.includes("view") || false,
//       pargon_create: permissions.pargon?.includes("create") || false,
//       pargon_edit: permissions.pargon?.includes("edit") || false,
//       pargon_delete: permissions.pargon?.includes("delete") || false,
//       parasole_view: permissions.parasole?.includes("view") || false,
//       parasole_create: permissions.parasole?.includes("create") || false,
//       parasole_edit: permissions.parasole?.includes("edit") || false,
//       parasole_delete: permissions.parasole?.includes("delete") || false,
//       user_view: permissions.user?.includes("view") || false,
//       user_create: permissions.user?.includes("create") || false,
//       user_edit: permissions.user?.includes("edit") || false,
//       user_delete: permissions.user?.includes("delete") || false,
//       settings_view: permissions.settings?.includes("view") || false,
//       settings_create: permissions.settings?.includes("create") || false,
//       settings_edit: permissions.settings?.includes("edit") || false,
//       dashboard: permissions.analytics?.includes("dashboard") || false,
//       analytics_view: permissions.analytics?.includes("view") || false,
//     };
//   };

//   // Handle Save Permissions
//   const handlePermissionSave = async () => {
//     if (!selectedRole || !selectedRole.id) {
//       console.error("No user selected for permission update");
//       return;
//     }

//     try {
//       const token = Cookies.get("token");
//       if (!token) {
//         throw new Error("No token found, please login first");
//       }

//       // Ensure permissions object is properly structured
//       const permissionsToSave = selectedRole.permissions || {
//         pargon: [],
//         parasole: [],
//         user: [],
//         settings: [],
//         analytics: [],
//       };

//       // Convert to the flat format expected by the API
//       const apiFormatPermissions =
//         convertPermissionsToApiFormat(permissionsToSave);

//       // Log what we're sending for debugging
//       console.log("Sending permissions payload:", apiFormatPermissions);

//       setIsLoading(true);
//       const response = await fetch(
//         `http://localhost:7000/api/v1/user/${selectedRole.id}/permissions`,
//         {
//           method: "PUT",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(apiFormatPermissions),
//         }
//       );
//       setIsLoading(false);

//       if (!response.ok) {
//         const errorText = await response.text();
//         if (!errorText) {
//           console.error("Empty error response from server");
//           alert(
//             "Server returned an empty response. Please check your API logs."
//           );
//           return;
//         }

//         try {
//           const errorData = JSON.parse(errorText);
//           console.error("Server error response:", errorData);
//           alert(errorData.error || "Failed to update permissions");
//         } catch (e) {
//           console.error("Server error (non-JSON):", errorText);
//           alert("Failed to update permissions. See console for details.");
//         }
//         return;
//       }

//       // If successful
//       const data = await response.json();
//       console.log("Permission update successful:", data);

//       // Refresh the user list after successful update
//       await fetchUsers();

//       // Show success message
//       alert("Permissions updated successfully");

//       // Close the modal and clear selection
//       setShowPermissionModal(false);
//       setSelectedRole(null);
//     } catch (error) {
//       setIsLoading(false);
//       console.error("Error updating permissions:", error);
//       alert("An error occurred while updating permissions. Please try again.");
//     }
//   };

//   // Get role label and badge color
//   const getRoleInfo = (roleId: number) => {
//     switch (roleId) {
//       case 1:
//         return { label: "Super Admin", color: "bg-purple-100 text-purple-800" };
//       case 2:
//         return { label: "Admin", color: "bg-blue-100 text-blue-800" };
//       case 3:
//         return { label: "User", color: "bg-green-100 text-green-800" };
//       default:
//         return { label: "Unknown", color: "bg-gray-100 text-gray-800" };
//     }
//   };

//   // Get status badge color
//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case "active":
//         return "bg-green-100 text-green-800";
//       case "inactive":
//         return "bg-amber-100 text-amber-800";
//       case "closed":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   // Handle Status Change
//   const handleStatusChange = async (userId, newStatus) => {
//     try {
//       // Set loading state for this specific user
//       setIsUpdatingStatus(userId);

//       const token = Cookies.get("token");
//       if (!token) {
//         throw new Error("No token found, please login first");
//       }

//       // Find the user to update
//       const userToUpdate = users.find((user) => user.id === userId);
//       if (!userToUpdate) {
//         throw new Error("User not found");
//       }

//       // Prepare the payload for the API
//       const updateData = {
//         firstName: userToUpdate.firstName,
//         lastName: userToUpdate.lastName,
//         email: userToUpdate.email,
//         roleId: parseInt(userToUpdate.roleId.toString(), 10),
//         status: newStatus.toUpperCase(),
//       };

//       const response = await fetch(
//         `http://localhost:7000/api/v1/user/${userId}`,
//         {
//           method: "PUT",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(updateData),
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to update user status");
//       }

//       // Update the local state to show the change immediately
//       setUsers(
//         users.map((user) =>
//           user.id === userId ? { ...user, status: newStatus } : user
//         )
//       );
//     } catch (err) {
//       console.error("Error updating user status:", err);
//       setError(
//         err instanceof Error
//           ? err.message
//           : "An error occurred while updating user status"
//       );
//     } finally {
//       // Clear loading state
//       setIsUpdatingStatus(null);
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header Section */}
//       <div className="mb-8">
//         <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900 flex items-center">
//               <UserCog className="mr-2 h-6 w-6 text-indigo-600" />
//               User Management
//             </h1>
//             <p className="text-gray-500 mt-1">
//               Manage system users and their permissions
//             </p>
//           </div>
//           <Button
//             onClick={() => setShowAddModal(true)}
//             className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
//           >
//             <UserPlus className="h-5 w-5" />
//             Add New User
//           </Button>
//         </div>
//       </div>

//       {/* Filters and Search Section */}
//       <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="flex-1">
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search className="h-5 w-5 text-gray-400" />
//               </div>
//               <Input
//                 type="text"
//                 placeholder="Search users by name or email..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10 w-full"
//               />
//             </div>
//           </div>
//           <div className="w-full md:w-64">
//             <Select
//               value={selectedStatus}
//               onValueChange={(value) => setSelectedStatus(value)}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Filter by Status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Users</SelectItem>
//                 <SelectItem value="active">Active</SelectItem>
//                 <SelectItem value="inactive">Inactive</SelectItem>
//                 <SelectItem value="closed">Closed Accounts</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <Button
//             onClick={fetchUsers}
//             variant="outline"
//             className="flex items-center gap-2"
//           >
//             <RefreshCw className="h-4 w-4" />
//             Refresh
//           </Button>
//         </div>
//       </div>

//       {/* Error Alert */}
//       {error && (
//         <div className="mb-6 p-4 border border-red-200 bg-red-50 text-red-700 rounded-lg flex items-start gap-3">
//           <div className="mt-0.5">
//             <X className="h-5 w-5 text-red-500" />
//           </div>
//           <div>
//             <h3 className="font-medium">Error</h3>
//             <p className="text-sm">{error}</p>
//           </div>
//           <button
//             onClick={() => setError(null)}
//             className="ml-auto p-1 hover:bg-red-100 rounded-full"
//           >
//             <X className="h-4 w-4" />
//           </button>
//         </div>
//       )}

//       {/* Users Table Card */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//         <div className="p-5 border-b border-gray-200 bg-gray-50">
//           <div className="flex justify-between items-center">
//             <h2 className="font-semibold text-gray-800">User Directory</h2>
//             <div className="text-sm text-gray-500">
//               {filteredUsers.length}{" "}
//               {filteredUsers.length === 1 ? "user" : "users"} found
//             </div>
//           </div>
//         </div>

//         {/* Table */}
//         {isLoading ? (
//           <div className="py-12 text-center">
//             <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
//             <p className="text-gray-500">Loading users...</p>
//           </div>
//         ) : filteredUsers.length === 0 ? (
//           <div className="py-12 text-center">
//             <User className="h-12 w-12 text-gray-300 mx-auto mb-2" />
//             <h3 className="text-lg font-medium text-gray-500">
//               No users found
//             </h3>
//             <p className="text-gray-400 text-sm mt-1">
//               {searchQuery
//                 ? "Try a different search term or filter"
//                 : "Start by adding a new user"}
//             </p>
//             <Button
//               onClick={() => setShowAddModal(true)}
//               className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
//             >
//               <UserPlus className="h-4 w-4 mr-2" />
//               Add New User
//             </Button>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader className="bg-gray-50">
//                 <TableRow>
//                   <TableHead className="w-14 font-medium">ID</TableHead>
//                   <TableHead className="font-medium">Name</TableHead>
//                   <TableHead className="font-medium">Email</TableHead>
//                   <TableHead className="font-medium">Role</TableHead>
//                   <TableHead className="font-medium">Status</TableHead>
//                   <TableHead className="font-medium text-right">
//                     Actions
//                   </TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredUsers.map((user) => {
//                   const role = getRoleInfo(user.roleId);

//                   return (
//                     <TableRow key={user.id} className="hover:bg-gray-50">
//                       <TableCell className="font-mono text-sm text-gray-500">
//                         #{user.id}
//                       </TableCell>
//                       <TableCell>
//                         <div className="font-medium">{`${user.firstName} ${user.lastName}`}</div>
//                       </TableCell>
//                       <TableCell className="text-gray-600">
//                         {user.email}
//                       </TableCell>
//                       <TableCell className="text-gray-600">
//                         {role.label}
//                       </TableCell>
//                       <TableCell>
//                         <div className="relative">
//                           <Select
//                             value={user.status.toLowerCase()}
//                             onValueChange={(value) =>
//                               handleStatusChange(user.id, value)
//                             }
//                             disabled={isUpdatingStatus === user.id}
//                           >
//                             <SelectTrigger
//                               className={`w-28 h-8 border-none px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
//                                 user.status
//                               )}`}
//                             >
//                               <SelectValue>{user.status}</SelectValue>
//                             </SelectTrigger>
//                             <SelectContent side="right">
//                               <SelectItem
//                                 value="active"
//                                 className="text-green-800 bg-green-50"
//                               >
//                                 Active
//                               </SelectItem>
//                               <SelectItem
//                                 value="inactive"
//                                 className="text-amber-800 bg-amber-50"
//                               >
//                                 Inactive
//                               </SelectItem>
//                               <SelectItem
//                                 value="closed"
//                                 className="text-red-800 bg-red-50"
//                               >
//                                 Closed
//                               </SelectItem>
//                             </SelectContent>
//                           </Select>
//                           {isUpdatingStatus === user.id && (
//                             <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded-full">
//                               <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
//                             </div>
//                           )}
//                         </div>
//                       </TableCell>

//                       <TableCell>
//                         <div className="flex justify-end space-x-2">
//                           <button
//                             onClick={() => handleView(user)}
//                             className="text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg p-1.5 transition-all"
//                             title="View details"
//                           >
//                             <Eye className="h-4 w-4" />
//                           </button>
//                           <button
//                             onClick={() => handleEdit(user)}
//                             className="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-1.5 transition-all"
//                             title="Edit user"
//                           >
//                             <Edit className="h-4 w-4" />
//                           </button>
//                           <button
//                             onClick={() => handlePermissions(user)}
//                             className="text-purple-500 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-1.5 transition-all"
//                             title="Manage permissions"
//                           >
//                             <Key className="h-4 w-4" />
//                           </button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </div>
//         )}
//       </div>

//       {/* Add User Modal */}
//       <AddUserModal
//         showModal={showAddModal}
//         setShowModal={setShowAddModal}
//         onAddUser={handleAddUser}
//         error={error}
//       />

//       {/* Edit User Modal */}
//       <EditUserModal
//         showModal={showEditModal}
//         setShowModal={setShowEditModal}
//         editingUser={editingUser}
//         setEditingUser={setEditingUser}
//         onEditUser={handleEditUser}
//         error={error}
//       />

//       {/* View User Modal */}
//       <ViewUserModal
//         showModal={showViewModal}
//         setShowModal={setShowViewModal}
//         viewingUser={viewingUser}
//         getStatusColor={getStatusColor}
//         getRoleInfo={getRoleInfo}
//       />

//       {/* Permission Modal */}
//       <PermissionsModal
//         showModal={showPermissionModal}
//         setShowModal={setShowPermissionModal}
//         selectedRole={selectedRole}
//         setSelectedRole={setSelectedRole}
//         handlePermissionChange={handlePermissionChange}
//         handlePermissionSave={handlePermissionSave}
//         isLoading={isLoading}
//         getRoleInfo={getRoleInfo}
//       />
//     </div>
//   );
// };

// export default Users;




"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  User,
  UserPlus,
  Edit,
  Eye,
  Key,
  Search,
  X,
  UserCog,
  RefreshCw,
  Users as UsersIcon,
  Filter,
  AlertCircle,
} from "lucide-react";

// Import custom components
import AddUserModal from "./user/AddUserModal";
import EditUserModal from "./user/EditUserModal";
import ViewUserModal from "./user/ViewUserModal";
import PermissionsModal from "./user/PermissionsModal";

// Define User interface
interface UserType {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status: string; // Possible values: active, inactive, closed
  roleId: number; // Role ID (1: Super Admin, 2: Admin, 3: User)
  permissions?: {
    pargon: string[];
    parasole: string[];
    user: string[];
    settings: string[];
    analytics: string[];
  };
}

interface NewUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  status: string;
  roleId: number;
}

const Users = () => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [viewingUser, setViewingUser] = useState<UserType | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Permission options
  const permissionOptions = {
    pargon: ["view", "create", "edit", "delete"],
    parasole: ["view", "create", "edit", "delete"],
    user: ["view", "create", "edit", "delete"],
    settings: ["view", "create", "edit"],
    analytics: ["view", "dashboard"],
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get("token");
      if (!token) {
        setError("No token found, please login first.");
        setIsLoading(false);
        return;
      }

      const response = await fetch("http://localhost:7000/api/v1/user/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      // Initialize permissions for each user if missing
      const usersWithPermissions = data.users.map((user: UserType) => ({
        ...user,
        permissions: user.permissions || {
          pargon: [],
          parasole: [],
          user: [],
          settings: [],
          analytics: [],
        },
      }));
      setUsers(usersWithPermissions);
      setError(null);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter users based on selected status and search query
  const filteredUsers = users
    .filter(
      (user) =>
        selectedStatus === "all" ||
        user.status.toLowerCase() === selectedStatus.toLowerCase()
    )
    .filter((user) => {
      if (!searchQuery) return true;
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return (
        fullName.includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  // Handle Add User Form Submission
  const handleAddUser = async (newUser: NewUser) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("No token found, please login first");
      }

      // Ensure roleId is a number and status is in the correct format
      const userToCreate = {
        ...newUser,
        roleId: parseInt(newUser.roleId.toString(), 10),
        status: newUser.status.toUpperCase(),
      };

      const response = await fetch("http://localhost:7000/api/v1/user/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userToCreate),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add user");
      }

      await fetchUsers(); // Refresh the user list after adding a new user
      setShowAddModal(false);
    } catch (err) {
      console.error("Error adding user:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while adding user"
      );
    }
  };

  // Handle Edit Button Click
  const handleEdit = (user: UserType) => {
    setEditingUser({ ...user });
    setShowEditModal(true);
  };

  // Handle Edit User Submission
  const handleEditUser = async (editedUser: UserType) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("No token found, please login first");
      }

      // Prepare the payload for the API
      const userToUpdate = {
        firstName: editedUser.firstName,
        lastName: editedUser.lastName,
        email: editedUser.email,
        roleId: parseInt(editedUser.roleId.toString(), 10),
        status: editedUser.status.toUpperCase(),
      };

      const response = await fetch(
        `http://localhost:7000/api/v1/user/${editedUser.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userToUpdate),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user");
      }

      await fetchUsers(); // Refresh the user list after successful update

      // Close the modal and reset the editing state
      setShowEditModal(false);
      setEditingUser(null);
    } catch (err) {
      console.error("Error updating user:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while updating user"
      );
    }
  };

  // Handle View Button Click
  const handleView = (user: UserType) => {
    // Create a deep copy of the user with default permissions if missing
    const userWithPermissions = {
      ...user,
      permissions: user.permissions || {
        pargon: [],
        parasole: [],
        user: [],
        settings: [],
        analytics: [],
      },
    };

    setViewingUser(userWithPermissions);
    setShowViewModal(true);

    // Fetch permissions in the background (if you have such an API)
    fetchUserPermissions(user.id).catch((error) => {
      console.error("Error fetching permissions for view:", error);
    });
  };

  // Fetch user permissions
  const fetchUserPermissions = async (userId) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("No token found, please login first");
      }

      const response = await fetch(
        `http://localhost:7000/api/v1/user/${userId}/permissions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.warn(`Could not fetch permissions for user ${userId}`);
        return null;
      }

      const data = await response.json();

      if (data.permissions) {
        // Update the viewing user with the latest permissions
        if (viewingUser && viewingUser.id === userId) {
          setViewingUser((prev) => ({
            ...prev,
            permissions: data.permissions,
          }));
        }

        return data.permissions;
      }

      return null;
    } catch (error) {
      console.error("Error fetching user permissions:", error);
      return null;
    }
  };

  // Handle Permissions Button Click
  const handlePermissions = (user: UserType) => {
    // Create a deep copy of the user with default permissions if missing
    const userWithDefaultPermissions = {
      ...user,
      permissions: user.permissions || {
        pargon: [],
        parasole: [],
        user: [],
        settings: [],
        analytics: [],
      },
    };

    setSelectedRole(userWithDefaultPermissions);
    setShowPermissionModal(true);

    // Optionally fetch the latest permissions from API
    fetchUserPermissions(user.id)
      .then((permissions) => {
        if (permissions) {
          setSelectedRole((prev) => ({
            ...prev,
            permissions,
          }));
        }
      })
      .catch((error) => {
        console.error("Error loading permissions:", error);
      });
  };

  // Handle Permission Change
  const handlePermissionChange = (website: string, permission: string) => {
    if (!selectedRole) return;

    // Make a deep copy of the current permissions
    const updatedPermissions = JSON.parse(
      JSON.stringify(selectedRole.permissions || {})
    );

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
      updatedPermissions[website] = currentPermissions.filter(
        (p) => p !== permission
      );
    }

    // Update state with the new permissions
    setSelectedRole({
      ...selectedRole,
      permissions: updatedPermissions,
    });
  };

  // Convert permissions to the format expected by the API
  const convertPermissionsToApiFormat = (permissions) => {
    return {
      user_id: selectedRole.id,
      pargon_view: permissions.pargon?.includes("view") || false,
      pargon_create: permissions.pargon?.includes("create") || false,
      pargon_edit: permissions.pargon?.includes("edit") || false,
      pargon_delete: permissions.pargon?.includes("delete") || false,
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
      analytics_view: permissions.analytics?.includes("view") || false,
    };
  };

  // Handle Save Permissions
  const handlePermissionSave = async () => {
    if (!selectedRole || !selectedRole.id) {
      console.error("No user selected for permission update");
      return;
    }

    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("No token found, please login first");
      }

      // Ensure permissions object is properly structured
      const permissionsToSave = selectedRole.permissions || {
        pargon: [],
        parasole: [],
        user: [],
        settings: [],
        analytics: [],
      };

      // Convert to the flat format expected by the API
      const apiFormatPermissions =
        convertPermissionsToApiFormat(permissionsToSave);

      // Log what we're sending for debugging
      console.log("Sending permissions payload:", apiFormatPermissions);

      setIsLoading(true);
      const response = await fetch(
        `http://localhost:7000/api/v1/user/${selectedRole.id}/permissions`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiFormatPermissions),
        }
      );
      setIsLoading(false);

      if (!response.ok) {
        const errorText = await response.text();
        if (!errorText) {
          console.error("Empty error response from server");
          alert(
            "Server returned an empty response. Please check your API logs."
          );
          return;
        }

        try {
          const errorData = JSON.parse(errorText);
          console.error("Server error response:", errorData);
          alert(errorData.error || "Failed to update permissions");
        } catch (e) {
          console.error("Server error (non-JSON):", errorText);
          alert("Failed to update permissions. See console for details.");
        }
        return;
      }

      // If successful
      const data = await response.json();
      console.log("Permission update successful:", data);

      // Refresh the user list after successful update
      await fetchUsers();

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

  // Get role label and badge color
  const getRoleInfo = (roleId: number) => {
    switch (roleId) {
      case 1:
        return { label: "Super Admin", color: "bg-violet-100 text-violet-800" };
      case 2:
        return { label: "Admin", color: "bg-blue-100 text-blue-800" };
      case 3:
        return { label: "User", color: "bg-emerald-100 text-emerald-800" };
      default:
        return { label: "Unknown", color: "bg-gray-100 text-gray-800" };
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-emerald-100 text-emerald-800";
      case "inactive":
        return "bg-amber-100 text-amber-800";
      case "closed":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handle Status Change
  const handleStatusChange = async (userId, newStatus) => {
    try {
      // Set loading state for this specific user
      setIsUpdatingStatus(userId);

      const token = Cookies.get("token");
      if (!token) {
        throw new Error("No token found, please login first");
      }

      // Find the user to update
      const userToUpdate = users.find((user) => user.id === userId);
      if (!userToUpdate) {
        throw new Error("User not found");
      }

      // Prepare the payload for the API
      const updateData = {
        firstName: userToUpdate.firstName,
        lastName: userToUpdate.lastName,
        email: userToUpdate.email,
        roleId: parseInt(userToUpdate.roleId.toString(), 10),
        status: newStatus.toUpperCase(),
      };

      const response = await fetch(
        `http://localhost:7000/api/v1/user/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user status");
      }

      // Update the local state to show the change immediately
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
    } catch (err) {
      console.error("Error updating user status:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while updating user status"
      );
    } finally {
      // Clear loading state
      setIsUpdatingStatus(null);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      {/* Header Section with decorative elements */}
      <div className="relative mb-8 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-center gap-4 pt-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <div className="bg-indigo-600 text-white p-2 rounded-lg mr-3 shadow-md">
                <UserCog className="h-6 w-6" />
              </div>
              User Management
            </h1>
            <p className="text-gray-600 mt-2 ml-1">
              Manage system users and their permissions
            </p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-indigo-600 to-violet-500 text-white hover:from-indigo-700 hover:to-violet-600 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg"
          >
            <UserPlus className="h-5 w-5" />
            Add New User
          </Button>
        </div>
        {/* Decorative circles */}
        <div className="absolute -bottom-6 -right-6 w-16 h-16 rounded-full bg-indigo-100 opacity-50"></div>
        <div className="absolute -bottom-10 -right-10 w-24 h-24 rounded-full bg-blue-100 opacity-20"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-indigo-100 text-indigo-700 mr-4">
              <UsersIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <h3 className="text-xl font-bold text-gray-900">{users.length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-emerald-100 text-emerald-700 mr-4">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Active Users</p>
              <h3 className="text-xl font-bold text-gray-900">
                {users.filter(u => u.status.toLowerCase() === 'active').length}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-amber-100 text-amber-700 mr-4">
              <UserCog className="h-5 w-5" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Admins</p>
              <h3 className="text-xl font-bold text-gray-900">
                {users.filter(u => u.roleId === 1 || u.roleId === 2).length}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search Section */}
      <div className="mb-6 bg-white p-5 rounded-xl shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <Filter className="h-5 w-5 mr-2 text-indigo-500" />
          Filters & Search
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-indigo-400" />
              </div>
              <Input
                type="text"
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full border-indigo-100 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-lg"
              />
            </div>
          </div>
          <div className="w-full md:w-64">
            <Select
              value={selectedStatus}
              onValueChange={(value) => setSelectedStatus(value)}
            >
              <SelectTrigger className="border-indigo-100 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-lg">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="closed">Closed Accounts</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={fetchUsers}
            variant="outline"
            className="flex items-center gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-colors duration-200 rounded-lg"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 border border-rose-200 bg-rose-50 text-rose-700 rounded-lg flex items-start gap-3 shadow-sm animate-pulse">
          <div className="mt-0.5">
            <AlertCircle className="h-5 w-5 text-rose-500" />
          </div>
          <div>
            <h3 className="font-medium">Error</h3>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="ml-auto p-1 hover:bg-rose-100 rounded-full transition-colors duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Users Table Card */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-lg">
        <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-white">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-gray-800 flex items-center">
              <UsersIcon className="h-5 w-5 mr-2 text-indigo-500" />
              User Directory
            </h2>
            <div className="text-sm bg-indigo-100 text-indigo-800 py-1 px-3 rounded-full font-medium">
              {filteredUsers.length}{" "}
              {filteredUsers.length === 1 ? "user" : "users"} found
            </div>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="py-16 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-500 text-lg">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center">
            <div className="bg-gray-100 rounded-full p-4 mx-auto w-20 h-20 flex items-center justify-center mb-4">
              <User className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-500">
              No users found
            </h3>
            <p className="text-gray-400 text-sm mt-1 max-w-md mx-auto">
              {searchQuery
                ? "Try a different search term or filter"
                : "Start by adding a new user to the system"}
            </p>
            <Button
              onClick={() => setShowAddModal(true)}
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add New User
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-14 font-medium">ID</TableHead>
                  <TableHead className="font-medium">Name</TableHead>
                  <TableHead className="font-medium">Email</TableHead>
                  <TableHead className="font-medium">Role</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="font-medium text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const role = getRoleInfo(user.roleId);

                  return (
                    <TableRow key={user.id} className="hover:bg-indigo-50/30 transition-colors duration-150">
                      <TableCell className="font-mono text-sm text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded-md">#{user.id}</span>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">{`${user.firstName} ${user.lastName}`}</div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {user.email}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${role.color}`}>
                          {role.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="relative">
                          <Select
                            value={user.status.toLowerCase()}
                            onValueChange={(value) =>
                              handleStatusChange(user.id, value)
                            }
                            disabled={isUpdatingStatus === user.id}
                          >
                            <SelectTrigger
                              className={`w-32 h-8 border-none px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                user.status
                              )}`}
                            >
                              <SelectValue>{user.status}</SelectValue>
                            </SelectTrigger>
                            <SelectContent side="right">
                              <SelectItem
                                value="active"
                                className="text-emerald-800 bg-emerald-50 rounded-md my-1"
                              >
                                Active
                              </SelectItem>
                              <SelectItem
                                value="inactive"
                                className="text-amber-800 bg-amber-50 rounded-md my-1"
                              >
                                Inactive
                              </SelectItem>
                              <SelectItem
                                value="closed"
                                className="                              text-rose-800 bg-rose-50 rounded-md my-1">
                                Closed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          {isUpdatingStatus === user.id && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-full">
                              <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleView(user)}
                            className="text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg p-2 transition-all hover:shadow-md"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-2 transition-all hover:shadow-md"
                            title="Edit user"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handlePermissions(user)}
                            className="text-violet-500 hover:text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-lg p-2 transition-all hover:shadow-md"
                            title="Manage permissions"
                          >
                            <Key className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Pagination (Optional) */}
      <div className="mt-6 flex justify-center">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex items-center overflow-hidden">
          <button className="px-4 py-2 border-r border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50" disabled>
            Previous
          </button>
          <button className="px-4 py-2 bg-indigo-50 text-indigo-700 font-medium">1</button>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-50">2</button>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-50">3</button>
          <button className="px-4 py-2 border-l border-gray-200 text-gray-500 hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>

      {/* Add User Modal */}
      <AddUserModal
        showModal={showAddModal}
        setShowModal={setShowAddModal}
        onAddUser={handleAddUser}
        error={error}
      />

      {/* Edit User Modal */}
      <EditUserModal
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        editingUser={editingUser}
        setEditingUser={setEditingUser}
        onEditUser={handleEditUser}
        error={error}
      />

      {/* View User Modal */}
      <ViewUserModal
        showModal={showViewModal}
        setShowModal={setShowViewModal}
        viewingUser={viewingUser}
        getStatusColor={getStatusColor}
        getRoleInfo={getRoleInfo}
      />

      {/* Permission Modal */}
      <PermissionsModal
        showModal={showPermissionModal}
        setShowModal={setShowPermissionModal}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        handlePermissionChange={handlePermissionChange}
        handlePermissionSave={handlePermissionSave}
        isLoading={isLoading}
        getRoleInfo={getRoleInfo}
      />
    </div>
  );
};

export default Users;