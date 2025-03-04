

// 'use client';
// import React, { useState, FormEvent, useEffect } from 'react';
// import Cookies from 'js-cookie';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// // Define User and NewUser interfaces
// interface User {
//   id: number;
//   firstName: string;
//   lastName: string;
//   email: string;
//   status: string; // Possible values: active, inactive, closed
//   roleId: number; // Role ID (1: Super Admin, 2: Admin, 3: User)
//   permissions?: {
//     pargon: string[];
//     parasole: string[];
//   };
// }

// interface NewUser {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string; // New password field
//   status: string;
//   roleId: number; // Role ID for dropdown
// }

// const Users = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [selectedStatus, setSelectedStatus] = useState('all');
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false); // For View Modal
//   const [showPermissionModal, setShowPermissionModal] = useState(false); // For Permission Modal
//   const [newUser, setNewUser] = useState<NewUser>({
//     firstName: '',
//     lastName: '',
//     email: '',
//     password: '', // Initialize password field
//     status: 'active',
//     roleId: 3, // Default role ID (User)
//   });
//   const [editingUser, setEditingUser] = useState<User | null>(null);
//   const [viewingUser, setViewingUser] = useState<User | null>(null); // For View Modal
//   const [selectedRole, setSelectedRole] = useState<User | null>(null); // For Permission Modal
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Permission options
//   const permissionOptions = {
//     pargon: ['view', 'edit', 'delete', 'create'],
//     parasole: ['view', 'edit', 'delete', 'create'],
//   };

//   // Fetch users on component mount
//   useEffect(() => {
//     const fetchUsers = async () => {
//       const token = Cookies.get('token');
//       if (!token) {
//         setError('No token found, please login first.');
//         setIsLoading(false);
//         return;
//       }

//       try {
//         const response = await fetch('http://localhost:7000/api/v1/user/all', {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`Error ${response.status}: ${response.statusText}`);
//         }

//         const data = await response.json();
//         // Initialize permissions for each user if missing
//         const usersWithPermissions = data.users.map((user: User) => ({
//           ...user,
//           permissions: user.permissions || { pargon: [], parasole: [] },
//         }));
//         setUsers(usersWithPermissions);
//         setIsLoading(false);
//       } catch (error) {
//         console.error('Error fetching users:', error);
//         setError(error instanceof Error ? error.message : 'An error occurred');
//         setIsLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   // Filter users based on selected status
//   const filteredUsers =
//     selectedStatus === 'all'
//       ? users
//       : users.filter((user) => user.status.toLowerCase() === selectedStatus.toLowerCase());

//   // Handle Add User Form Submission
//   const handleAddUser = async (e: FormEvent) => {
//     e.preventDefault();
//     try {
//       const token = Cookies.get('token');
//       if (!token) {
//         throw new Error('No token found, please login first');
//       }

//       // Ensure roleId is a number and status is in the correct format
//       const userToCreate = {
//         ...newUser,
//         roleId: parseInt(newUser.roleId.toString(), 10), // Convert roleId to number
//         status: newUser.status.toUpperCase(), // Ensure status is in uppercase
//       };

//       console.log('Sending payload:', userToCreate); // Log the payload for debugging

//       const response = await fetch('http://localhost:7000/api/v1/user/create', {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(userToCreate),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to add user');
//       }

//       // Refresh the user list after adding a new user
//       const refreshResponse = await fetch('http://localhost:7000/api/v1/user/all', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (refreshResponse.ok) {
//         const refreshData = await refreshResponse.json();
//         setUsers(refreshData.users);
//       }

//       // Reset the form and close the modal
//       setNewUser({ firstName: '', lastName: '', email: '', password: '', status: 'active', roleId: 3 });
//       setShowAddModal(false);
//       setError(null);
//     } catch (err) {
//       console.error('Error adding user:', err);
//       setError(err instanceof Error ? err.message : 'An error occurred while adding user');
//     }
//   };

//   // Handle Edit Button Click
//   const handleEdit = (user: User) => {
//     setEditingUser({ ...user }); // Clone the user object to avoid direct mutation
//     setShowEditModal(true);
//   };

//   // Handle Edit User Submission
//   const handleEditUser = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!editingUser) return;

//     try {
//       const token = Cookies.get('token');
//       if (!token) {
//         throw new Error('No token found, please login first');
//       }

//       // Prepare the payload for the API
//       const userToUpdate = {
//         firstName: editingUser.firstName,
//         lastName: editingUser.lastName,
//         email: editingUser.email,
//         roleId: parseInt(editingUser.roleId.toString(), 10), // Ensure roleId is a number
//         status: editingUser.status.toUpperCase(), // Ensure status is in uppercase
//       };

//       console.log('Sending payload:', userToUpdate); // Log the payload for debugging

//       const response = await fetch(`http://localhost:7000/api/v1/user/${editingUser.id}`, {
//         method: 'PUT',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(userToUpdate),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to update user');
//       }

//       // Refresh the user list after successful update
//       const refreshResponse = await fetch('http://localhost:7000/api/v1/user/all', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (refreshResponse.ok) {
//         const refreshData = await refreshResponse.json();
//         setUsers(refreshData.users);
//       }

//       // Close the modal and reset the editing state
//       setShowEditModal(false);
//       setEditingUser(null);
//     } catch (err) {
//       console.error('Error updating user:', err);
//       setError(err instanceof Error ? err.message : 'An error occurred while updating user');
//     }
//   };

//   // Handle View Button Click
//   const handleView = (user: User) => {
//     setViewingUser(user);
//     setShowViewModal(true);
//   };

//   // Handle Permissions Button Click
//   const handlePermissions = (user: User) => {
//     setSelectedRole({
//       ...user,
//       permissions: user.permissions || { pargon: [], parasole: [] }, // Initialize permissions if undefined
//     });
//     setShowPermissionModal(true);
//   };

//   // Handle Permission Change
//   const handlePermissionChange = (website: string, permission: string) => {
//     if (!selectedRole) return;

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
//       console.error('No role selected for permission update');
//       return;
//     }

//     try {
//       const token = Cookies.get('token');
//       const payload = {
//         permissions: {
//           pargon: selectedRole.permissions?.pargon || [],
//           parasole: selectedRole.permissions?.parasole || [],
//         },
//       };
//       console.log('Sending payload:', payload); // Log the payload

//       const response = await fetch(`http://localhost:7000/api/v1/user/${selectedRole.id}/permissions`, {
//         method: 'PUT',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('Server error response:', errorData); // Log server response
//         alert(errorData.error || 'Failed to update permissions'); // Show error to user
//         throw new Error(errorData.error || 'Failed to update permissions');
//       }

//       // Refresh the user list after successful update
//       const refreshResponse = await fetch('http://localhost:7000/api/v1/user/all', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (refreshResponse.ok) {
//         const refreshData = await refreshResponse.json();
//         setUsers(refreshData.users);
//       }

//       setShowPermissionModal(false);
//       setSelectedRole(null);
//     } catch (error) {
//       console.error('Error updating permissions:', error.message);
//     }
//   };

//   // Loading State
//   if (isLoading) {
//     return <div className="flex justify-center items-center h-screen">Loading...</div>;
//   }

//   // Error State
//   if (error) {
//     return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
//   }

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       {/* Header Section */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
//         <Button onClick={() => setShowAddModal(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
//           Add User
//         </Button>
//       </div>

//       {/* Filter Section */}
//       <div className="mb-6">
//         <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value)}>
//           <SelectTrigger className="w-full md:w-1/3">
//             <SelectValue placeholder="Filter by Status" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Users</SelectItem>
//             <SelectItem value="active">Active</SelectItem>
//             <SelectItem value="inactive">Inactive</SelectItem>
//             <SelectItem value="closed">Closed Accounts</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Table */}
//       <div className="bg-white shadow-md rounded-lg overflow-hidden">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>ID</TableHead>
//               <TableHead>Name</TableHead>
//               <TableHead>Email</TableHead>
//               <TableHead>Role</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredUsers.map((user) => (
//               <TableRow key={user.id} className="hover:bg-gray-50">
//                 <TableCell>{user.id}</TableCell>
//                 <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
//                 <TableCell>{user.email}</TableCell>
//                 <TableCell>
//                   {user.roleId === 3
//                     ? 'User'
//                     : user.roleId === 2
//                     ? 'Admin'
//                     : 'Super Admin'}
//                 </TableCell>
//                 <TableCell>{user.status}</TableCell>
//                 <TableCell>
//                   <div className="flex space-x-2">
//                     <Button onClick={() => handleEdit(user)} className="bg-blue-500 hover:bg-blue-600 text-white">
//                       Edit
//                     </Button>
//                     <Button onClick={() => handleView(user)} className="bg-green-500 hover:bg-green-600 text-white">
//                       View
//                     </Button>
//                     <Button onClick={() => handlePermissions(user)} className="bg-purple-500 hover:bg-purple-600 text-white">
//                       Permissions
//                     </Button>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Add User Modal */}
//       <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Add New User</DialogTitle>
//           </DialogHeader>
//           <form onSubmit={handleAddUser} className="space-y-4">
//             <Input
//               type="text"
//               placeholder="First Name"
//               value={newUser.firstName}
//               onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
//               required
//               className="w-full p-2 border border-gray-300 rounded"
//             />
//             <Input
//               type="text"
//               placeholder="Last Name"
//               value={newUser.lastName}
//               onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
//               required
//               className="w-full p-2 border border-gray-300 rounded"
//             />
//             <Input
//               type="email"
//               placeholder="Email"
//               value={newUser.email}
//               onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
//               required
//               className="w-full p-2 border border-gray-300 rounded"
//             />
//             <Input
//               type="password"
//               placeholder="Password"
//               value={newUser.password}
//               onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
//               required
//               className="w-full p-2 border border-gray-300 rounded"
//             />
//             <Select
//               value={newUser.roleId.toString()}
//               onValueChange={(value) => setNewUser({ ...newUser, roleId: parseInt(value, 10) })}
//               className="w-full"
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select Role" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="3">User</SelectItem>
//                 <SelectItem value="2">Admin</SelectItem>
//                 <SelectItem value="1">Super Admin</SelectItem>
//               </SelectContent>
//             </Select>
//             <Select
//               value={newUser.status}
//               onValueChange={(value) => setNewUser({ ...newUser, status: value })}
//               className="w-full"
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select Status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="active">Active</SelectItem>
//                 <SelectItem value="inactive">Inactive</SelectItem>
//               </SelectContent>
//             </Select>
//             <div className="flex justify-end space-x-2">
//               <Button onClick={() => setShowAddModal(false)} className="bg-gray-500 hover:bg-gray-600">
//                 Cancel
//               </Button>
//               <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
//                 Add User
//               </Button>
//             </div>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* Edit User Modal */}
//       {editingUser && (
//         <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
//           <DialogContent className="sm:max-w-[425px]">
//             <DialogHeader>
//               <DialogTitle>Edit User</DialogTitle>
//             </DialogHeader>
//             <form onSubmit={handleEditUser} className="space-y-4">
//               <Input
//                 type="text"
//                 placeholder="First Name"
//                 value={editingUser.firstName}
//                 onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
//                 required
//                 className="w-full p-2 border border-gray-300 rounded"
//               />
//               <Input
//                 type="text"
//                 placeholder="Last Name"
//                 value={editingUser.lastName}
//                 onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
//                 required
//                 className="w-full p-2 border border-gray-300 rounded"
//               />
//               <Input
//                 type="email"
//                 placeholder="Email"
//                 value={editingUser.email}
//                 onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
//                 required
//                 className="w-full p-2 border border-gray-300 rounded"
//               />
//               <Select
//                 value={editingUser.roleId.toString()}
//                 onValueChange={(value) => setEditingUser({ ...editingUser, roleId: parseInt(value, 10) })}
//                 className="w-full"
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select Role" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="3">User</SelectItem>
//                   <SelectItem value="2">Admin</SelectItem>
//                   <SelectItem value="1">Super Admin</SelectItem>
//                 </SelectContent>
//               </Select>
//               <Select
//                 value={editingUser.status}
//                 onValueChange={(value) => setEditingUser({ ...editingUser, status: value })}
//                 className="w-full"
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select Status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="active">Active</SelectItem>
//                   <SelectItem value="inactive">Inactive</SelectItem>
//                   <SelectItem value="closed">Closed</SelectItem>
//                 </SelectContent>
//               </Select>
//               <div className="flex justify-end space-x-2">
//                 <Button
//                   onClick={() => {
//                     setShowEditModal(false);
//                     setEditingUser(null);
//                   }}
//                   className="bg-gray-500 hover:bg-gray-600"
//                 >
//                   Cancel
//                 </Button>
//                 <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
//                   Save Changes
//                 </Button>
//               </div>
//             </form>
//           </DialogContent>
//         </Dialog>
//       )}

//       {/* View User Modal */}
//       {viewingUser && (
//         <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
//           <DialogContent className="sm:max-w-[425px]">
//             <DialogHeader>
//               <DialogTitle>User Details</DialogTitle>
//             </DialogHeader>
//             <div className="space-y-2">
//               <p>
//                 <strong>First Name:</strong> {viewingUser.firstName}
//               </p>
//               <p>
//                 <strong>Last Name:</strong> {viewingUser.lastName}
//               </p>
//               <p>
//                 <strong>Email:</strong> {viewingUser.email}
//               </p>
//               <p>
//                 <strong>Role:</strong>{' '}
//                 {viewingUser.roleId === 3
//                   ? 'User'
//                   : viewingUser.roleId === 2
//                   ? 'Admin'
//                   : 'Super Admin'}
//               </p>
//               <p>
//                 <strong>Status:</strong> {viewingUser.status}
//               </p>
//               <Button onClick={() => setShowViewModal(false)} className="bg-gray-500 hover:bg-gray-600">
//                 Close
//               </Button>
//             </div>
//           </DialogContent>
//         </Dialog>
//       )}

//       {/* Permission Modal */}
//       {selectedRole && (
//         <Dialog open={showPermissionModal} onOpenChange={setShowPermissionModal}>
//           <DialogContent className="sm:max-w-[425px]">
//             <DialogHeader>
//               <DialogTitle>Manage Permissions</DialogTitle>
//             </DialogHeader>
//             <div className="space-y-4">
//               <h3 className="font-semibold">Pargon Permissions</h3>
//               {permissionOptions.pargon.map((permission) => (
//                 <div key={permission} className="flex items-center space-x-2">
//                   <input
//                     type="checkbox"
//                     checked={selectedRole.permissions?.pargon?.includes(permission)}
//                     onChange={() => handlePermissionChange('pargon', permission)}
//                     className="form-checkbox h-4 w-4 text-blue-600"
//                   />
//                   <span>{permission}</span>
//                 </div>
//               ))}
//               <h3 className="font-semibold">Parasole Permissions</h3>
//               {permissionOptions.parasole.map((permission) => (
//                 <div key={permission} className="flex items-center space-x-2">
//                   <input
//                     type="checkbox"
//                     checked={selectedRole.permissions?.parasole?.includes(permission)}
//                     onChange={() => handlePermissionChange('parasole', permission)}
//                     className="form-checkbox h-4 w-4 text-blue-600"
//                   />
//                   <span>{permission}</span>
//                 </div>
//               ))}
//               <div className="flex justify-end space-x-2">
//                 <Button onClick={() => setShowPermissionModal(false)} className="bg-gray-500 hover:bg-gray-600">
//                   Cancel
//                 </Button>
//                 <Button onClick={handlePermissionSave} className="bg-blue-500 hover:bg-blue-600">
//                   Save Permissions
//                 </Button>
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>
//       )}
//     </div>
//   );
// };

// export default Users;



'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import Cookies from 'js-cookie';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  User, 
  UserPlus, 
  Edit, 
  Eye, 
  Key, 
  Search, 
  X, 
  Save, 
  CheckSquare, 
  Square, 
  UserCog, 
  Shield,
  RefreshCw
} from 'lucide-react';

// Define User and NewUser interfaces
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
  };
}

interface NewUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string; // New password field
  status: string;
  roleId: number; // Role ID for dropdown
}

const Users = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [newUser, setNewUser] = useState<NewUser>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    status: 'active',
    roleId: 3, // Default role ID (User)
  });
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [viewingUser, setViewingUser] = useState<UserType | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Permission options
  const permissionOptions = {
    pargon: ['view', 'edit', 'delete', 'create'],
    parasole: ['view', 'edit', 'delete', 'create'],
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get('token');
      if (!token) {
        setError('No token found, please login first.');
        setIsLoading(false);
        return;
      }

      const response = await fetch('http://localhost:7000/api/v1/user/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
        permissions: user.permissions || { pargon: [], parasole: [] },
      }));
      setUsers(usersWithPermissions);
      setError(null);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter users based on selected status and search query
  const filteredUsers = users
    .filter((user) => 
      selectedStatus === 'all' || user.status.toLowerCase() === selectedStatus.toLowerCase()
    )
    .filter((user) => {
      if (!searchQuery) return true;
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase()) || 
             user.email.toLowerCase().includes(searchQuery.toLowerCase());
    });

  // Handle Add User Form Submission
  const handleAddUser = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No token found, please login first');
      }

      // Ensure roleId is a number and status is in the correct format
      const userToCreate = {
        ...newUser,
        roleId: parseInt(newUser.roleId.toString(), 10),
        status: newUser.status.toUpperCase(),
      };

      const response = await fetch('http://localhost:7000/api/v1/user/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userToCreate),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add user');
      }

      await fetchUsers(); // Refresh the user list after adding a new user
      
      // Reset the form and close the modal
      setNewUser({ firstName: '', lastName: '', email: '', password: '', status: 'active', roleId: 3 });
      setShowAddModal(false);
    } catch (err) {
      console.error('Error adding user:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while adding user');
    }
  };

  // Handle Edit Button Click
  const handleEdit = (user: UserType) => {
    setEditingUser({ ...user });
    setShowEditModal(true);
  };

  // Handle Edit User Submission
  const handleEditUser = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No token found, please login first');
      }

      // Prepare the payload for the API
      const userToUpdate = {
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        email: editingUser.email,
        roleId: parseInt(editingUser.roleId.toString(), 10),
        status: editingUser.status.toUpperCase(),
      };

      const response = await fetch(`http://localhost:7000/api/v1/user/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userToUpdate),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }

      await fetchUsers(); // Refresh the user list after successful update
      
      // Close the modal and reset the editing state
      setShowEditModal(false);
      setEditingUser(null);
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while updating user');
    }
  };

  // Handle View Button Click
  const handleView = (user: UserType) => {
    setViewingUser(user);
    setShowViewModal(true);
  };

  // Handle Permissions Button Click
  const handlePermissions = (user: UserType) => {
    setSelectedRole({
      ...user,
      permissions: user.permissions || { pargon: [], parasole: [] },
    });
    setShowPermissionModal(true);
  };

  // Handle Permission Change
  const handlePermissionChange = (website: string, permission: string) => {
    if (!selectedRole) return;

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
      console.error('No role selected for permission update');
      return;
    }

    try {
      const token = Cookies.get('token');
      const payload = {
        permissions: {
          pargon: selectedRole.permissions?.pargon || [],
          parasole: selectedRole.permissions?.parasole || [],
        },
      };

      const response = await fetch(`http://localhost:7000/api/v1/user/${selectedRole.id}/permissions`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        alert(errorData.error || 'Failed to update permissions');
        throw new Error(errorData.error || 'Failed to update permissions');
      }

      await fetchUsers(); // Refresh the user list after successful update
      setShowPermissionModal(false);
      setSelectedRole(null);
    } catch (error) {
      console.error('Error updating permissions:', error.message);
    }
  };

  // Get role label and badge color
  const getRoleInfo = (roleId: number) => {
    switch(roleId) {
      case 1:
        return { label: 'Super Admin', color: 'bg-purple-100 text-purple-800' };
      case 2:
        return { label: 'Admin', color: 'bg-blue-100 text-blue-800' };
      case 3:
        return { label: 'User', color: 'bg-green-100 text-green-800' };
      default:
        return { label: 'Unknown', color: 'bg-gray-100 text-gray-800' };
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-amber-100 text-amber-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
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
              User Management
            </h1>
            <p className="text-gray-500 mt-1">Manage system users and their permissions</p>
          </div>
          <Button 
            onClick={() => setShowAddModal(true)} 
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <UserPlus className="h-5 w-5" />
            Add New User
          </Button>
        </div>
      </div>

      {/* Filters and Search Section */}
      <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
          <div className="w-full md:w-64">
            <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value)}>
              <SelectTrigger>
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
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 border border-red-200 bg-red-50 text-red-700 rounded-lg flex items-start gap-3">
          <div className="mt-0.5">
            <X className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h3 className="font-medium">Error</h3>
            <p className="text-sm">{error}</p>
          </div>
          <button 
            onClick={() => setError(null)} 
            className="ml-auto p-1 hover:bg-red-100 rounded-full"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Users Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-gray-800">User Directory</h2>
            <div className="text-sm text-gray-500">
              {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
            </div>
          </div>
        </div>
        
        {/* Table */}
        {isLoading ? (
          <div className="py-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
            <p className="text-gray-500">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-12 text-center">
            <User className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <h3 className="text-lg font-medium text-gray-500">No users found</h3>
            <p className="text-gray-400 text-sm mt-1">
              {searchQuery 
                ? "Try a different search term or filter" 
                : "Start by adding a new user"}
            </p>
            <Button 
              onClick={() => setShowAddModal(true)} 
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
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
                  <TableHead className="font-medium w-36">Permissions</TableHead>
                  <TableHead className="font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const role = getRoleInfo(user.roleId);
                  const permissionsCount = 
                    (user.permissions?.pargon?.length || 0) + 
                    (user.permissions?.parasole?.length || 0);
                  
                  return (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell className="font-mono text-sm text-gray-500">#{user.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{`${user.firstName} ${user.lastName}`}</div>
                      </TableCell>
                      <TableCell className="text-gray-600">{user.email}</TableCell>
                      <TableCell>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${role.color}`}>
                          {role.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {permissionsCount > 0 ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-800 border border-indigo-100">
                            {permissionsCount} permissions
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">No permissions</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleView(user)}
                            className="text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg p-1.5 transition-all"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-1.5 transition-all"
                            title="Edit user"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handlePermissions(user)}
                            className="text-purple-500 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-1.5 transition-all"
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

      {/* Add User Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden rounded-xl">
          <DialogHeader className="p-6 border-b border-gray-200 bg-gray-50">
            <DialogTitle className="flex items-center text-xl">
              <UserPlus className="h-5 w-5 mr-2 text-indigo-600" />
              Add New User
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddUser} className="p-6 space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <Input
                  type="text"
                  placeholder="First Name"
                  value={newUser.firstName}
                  onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <Input
                  type="text"
                  placeholder="Last Name"
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <Input
                  type="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <Select
                  value={newUser.roleId.toString()}
                  onValueChange={(value) => setNewUser({ ...newUser, roleId: parseInt(value, 10) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">User</SelectItem>
                    <SelectItem value="2">Admin</SelectItem>
                    <SelectItem value="1">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <Select
                  value={newUser.status}
                  onValueChange={(value) => setNewUser({ ...newUser, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200 flex justify-end space-x-2">
              <Button
                type="button"
                onClick={() => setShowAddModal(false)}
                variant="outline"
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Add User
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      {editingUser && (
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden rounded-xl">
            <DialogHeader className="p-6 border-b border-gray-200 bg-gray-50">
              <DialogTitle className="flex items-center text-xl">
                <Edit className="h-5 w-5 mr-2 text-blue-600" />
                Edit User
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditUser} className="p-6 space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <Input
                    type="text"
                    placeholder="First Name"
                    value={editingUser.firstName}
                    onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <Input
                    type="text"
                    placeholder="Last Name"
                    value={editingUser.lastName}
                    onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <Select
                    value={editingUser.roleId.toString()}
                    onValueChange={(value) => setEditingUser({ ...editingUser, roleId: parseInt(value, 10) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">User</SelectItem>
                      <SelectItem value="2">Admin</SelectItem>
                      <SelectItem value="1">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <Select
                    value={editingUser.status.toLowerCase()}
                    onValueChange={(value) => setEditingUser({ ...editingUser, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200 flex justify-end space-x-2">
                <Button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                  }}
                  variant="outline"
                  className="px-4 py-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* View User Modal */}
      {viewingUser && (
        <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
          <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden rounded-xl">
            <DialogHeader className="p-6 border-b border-gray-200 bg-gray-50">
              <DialogTitle className="flex items-center text-xl">
                <Eye className="h-5 w-5 mr-2 text-gray-600" />
                User Details
              </DialogTitle>
            </DialogHeader>
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <div className="text-sm text-gray-500 mb-1">User ID</div>
                  <div className="font-semibold text-gray-900">#{viewingUser.id}</div>
                </div>
                <div className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(viewingUser.status)}`}>
                  {viewingUser.status}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">First Name</div>
                  <div className="font-medium text-gray-900">{viewingUser.firstName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Last Name</div>
                  <div className="font-medium text-gray-900">{viewingUser.lastName}</div>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500mb-1">Email</div>
                <div className="font-medium text-gray-900">{viewingUser.email}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-1">Role</div>
                <div className="font-medium text-gray-900">
                  {viewingUser.roleId === 3
                    ? 'User'
                    : viewingUser.roleId === 2
                    ? 'Admin'
                    : 'Super Admin'}
                </div>
              </div>
              
              {/* Permissions summary */}
              <div>
                <h3 className="text-sm text-gray-500 mb-2">Permissions</h3>
                {(!viewingUser.permissions?.pargon?.length && !viewingUser.permissions?.parasole?.length) ? (
                  <p className="text-gray-400 text-sm">No permissions configured</p>
                ) : (
                  <div className="space-y-3">
                    {viewingUser.permissions?.pargon?.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-gray-600">Pargon:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {viewingUser.permissions.pargon.map(permission => (
                            <span key={permission} 
                              className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-100"
                            >
                              {permission}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {viewingUser.permissions?.parasole?.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-gray-600">Parasole:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {viewingUser.permissions.parasole.map(permission => (
                            <span key={permission} 
                              className="px-2 py-0.5 rounded-full text-xs bg-purple-50 text-purple-700 border border-purple-100"
                            >
                              {permission}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end bg-gray-50">
              <Button 
                onClick={() => setShowViewModal(false)} 
                className="px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-800"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Permission Modal */}
      {selectedRole && (
        <Dialog open={showPermissionModal} onOpenChange={setShowPermissionModal}>
          <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-xl">
            <DialogHeader className="p-6 border-b border-gray-200 bg-gray-50">
              <DialogTitle className="flex items-center text-xl">
                <Key className="h-5 w-5 mr-2 text-purple-600" />
                User Permissions
              </DialogTitle>
            </DialogHeader>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100 mb-6">
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">User</div>
                  <div className="font-medium">{`${selectedRole.firstName} ${selectedRole.lastName}`}</div>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${getRoleInfo(selectedRole.roleId).color}`}>
                  {getRoleInfo(selectedRole.roleId).label}
                </div>
              </div>
              
              {Object.keys(permissionOptions).map((website) => (
                <div key={website} className="mb-6">
                  <h3 className="text-sm font-semibold mb-3 flex items-center capitalize">
                    <Shield className="h-4 w-4 mr-2 text-indigo-500" />
                    {website} Website
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {permissionOptions[website].map((permission) => (
                        <div 
                          key={permission}
                          className="flex items-center p-3 rounded-lg hover:bg-white transition-colors cursor-pointer border border-gray-100"
                          onClick={() => handlePermissionChange(website, permission)}
                        >
                          {selectedRole.permissions[website]?.includes(permission) ? (
                            <CheckSquare className="h-5 w-5 text-indigo-600 mr-2" />
                          ) : (
                            <Square className="h-5 w-5 text-gray-400 mr-2" />
                          )}
                          <span className="text-gray-700 capitalize">{permission}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-3 bg-gray-50">
              <Button
                type="button"
                onClick={() => {
                  setShowPermissionModal(false);
                  setSelectedRole(null);
                }}
                variant="outline"
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePermissionSave}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Permissions
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Users;