

'use client';
import React, { useState, FormEvent, useEffect } from 'react';
import Cookies from 'js-cookie';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Define User and NewUser interfaces
interface User {
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
  const [users, setUsers] = useState<User[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false); // For View Modal
  const [showPermissionModal, setShowPermissionModal] = useState(false); // For Permission Modal
  const [newUser, setNewUser] = useState<NewUser>({
    firstName: '',
    lastName: '',
    email: '',
    password: '', // Initialize password field
    status: 'active',
    roleId: 3, // Default role ID (User)
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null); // For View Modal
  const [selectedRole, setSelectedRole] = useState<User | null>(null); // For Permission Modal
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Permission options
  const permissionOptions = {
    pargon: ['view', 'edit', 'delete', 'create'],
    parasole: ['view', 'edit', 'delete', 'create'],
  };

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      const token = Cookies.get('token');
      if (!token) {
        setError('No token found, please login first.');
        setIsLoading(false);
        return;
      }

      try {
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
        const usersWithPermissions = data.users.map((user: User) => ({
          ...user,
          permissions: user.permissions || { pargon: [], parasole: [] },
        }));
        setUsers(usersWithPermissions);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on selected status
  const filteredUsers =
    selectedStatus === 'all'
      ? users
      : users.filter((user) => user.status.toLowerCase() === selectedStatus.toLowerCase());

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
        roleId: parseInt(newUser.roleId.toString(), 10), // Convert roleId to number
        status: newUser.status.toUpperCase(), // Ensure status is in uppercase
      };

      console.log('Sending payload:', userToCreate); // Log the payload for debugging

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

      // Refresh the user list after adding a new user
      const refreshResponse = await fetch('http://localhost:7000/api/v1/user/all', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        setUsers(refreshData.users);
      }

      // Reset the form and close the modal
      setNewUser({ firstName: '', lastName: '', email: '', password: '', status: 'active', roleId: 3 });
      setShowAddModal(false);
      setError(null);
    } catch (err) {
      console.error('Error adding user:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while adding user');
    }
  };

  // Handle Edit Button Click
  const handleEdit = (user: User) => {
    setEditingUser({ ...user }); // Clone the user object to avoid direct mutation
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
        roleId: parseInt(editingUser.roleId.toString(), 10), // Ensure roleId is a number
        status: editingUser.status.toUpperCase(), // Ensure status is in uppercase
      };

      console.log('Sending payload:', userToUpdate); // Log the payload for debugging

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

      // Refresh the user list after successful update
      const refreshResponse = await fetch('http://localhost:7000/api/v1/user/all', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        setUsers(refreshData.users);
      }

      // Close the modal and reset the editing state
      setShowEditModal(false);
      setEditingUser(null);
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while updating user');
    }
  };

  // Handle View Button Click
  const handleView = (user: User) => {
    setViewingUser(user);
    setShowViewModal(true);
  };

  // Handle Permissions Button Click
  const handlePermissions = (user: User) => {
    setSelectedRole({
      ...user,
      permissions: user.permissions || { pargon: [], parasole: [] }, // Initialize permissions if undefined
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
      console.log('Sending payload:', payload); // Log the payload

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
        console.error('Server error response:', errorData); // Log server response
        alert(errorData.error || 'Failed to update permissions'); // Show error to user
        throw new Error(errorData.error || 'Failed to update permissions');
      }

      // Refresh the user list after successful update
      const refreshResponse = await fetch('http://localhost:7000/api/v1/user/all', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        setUsers(refreshData.users);
      }

      setShowPermissionModal(false);
      setSelectedRole(null);
    } catch (error) {
      console.error('Error updating permissions:', error.message);
    }
  };

  // Loading State
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Error State
  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <Button onClick={() => setShowAddModal(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
          Add User
        </Button>
      </div>

      {/* Filter Section */}
      <div className="mb-6">
        <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value)}>
          <SelectTrigger className="w-full md:w-1/3">
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

      {/* Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell>{user.id}</TableCell>
                <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.roleId === 3
                    ? 'User'
                    : user.roleId === 2
                    ? 'Admin'
                    : 'Super Admin'}
                </TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button onClick={() => handleEdit(user)} className="bg-blue-500 hover:bg-blue-600 text-white">
                      Edit
                    </Button>
                    <Button onClick={() => handleView(user)} className="bg-green-500 hover:bg-green-600 text-white">
                      View
                    </Button>
                    <Button onClick={() => handlePermissions(user)} className="bg-purple-500 hover:bg-purple-600 text-white">
                      Permissions
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add User Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddUser} className="space-y-4">
            <Input
              type="text"
              placeholder="First Name"
              value={newUser.firstName}
              onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
            <Input
              type="text"
              placeholder="Last Name"
              value={newUser.lastName}
              onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
            <Input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
            <Input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
            <Select
              value={newUser.roleId.toString()}
              onValueChange={(value) => setNewUser({ ...newUser, roleId: parseInt(value, 10) })}
              className="w-full"
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
            <Select
              value={newUser.status}
              onValueChange={(value) => setNewUser({ ...newUser, status: value })}
              className="w-full"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex justify-end space-x-2">
              <Button onClick={() => setShowAddModal(false)} className="bg-gray-500 hover:bg-gray-600">
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                Add User
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      {editingUser && (
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditUser} className="space-y-4">
              <Input
                type="text"
                placeholder="First Name"
                value={editingUser.firstName}
                onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
              <Input
                type="text"
                placeholder="Last Name"
                value={editingUser.lastName}
                onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
              <Input
                type="email"
                placeholder="Email"
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
              <Select
                value={editingUser.roleId.toString()}
                onValueChange={(value) => setEditingUser({ ...editingUser, roleId: parseInt(value, 10) })}
                className="w-full"
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
              <Select
                value={editingUser.status}
                onValueChange={(value) => setEditingUser({ ...editingUser, status: value })}
                className="w-full"
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
              <div className="flex justify-end space-x-2">
                <Button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                  }}
                  className="bg-gray-500 hover:bg-gray-600"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
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
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <p>
                <strong>First Name:</strong> {viewingUser.firstName}
              </p>
              <p>
                <strong>Last Name:</strong> {viewingUser.lastName}
              </p>
              <p>
                <strong>Email:</strong> {viewingUser.email}
              </p>
              <p>
                <strong>Role:</strong>{' '}
                {viewingUser.roleId === 3
                  ? 'User'
                  : viewingUser.roleId === 2
                  ? 'Admin'
                  : 'Super Admin'}
              </p>
              <p>
                <strong>Status:</strong> {viewingUser.status}
              </p>
              <Button onClick={() => setShowViewModal(false)} className="bg-gray-500 hover:bg-gray-600">
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Permission Modal */}
      {selectedRole && (
        <Dialog open={showPermissionModal} onOpenChange={setShowPermissionModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Manage Permissions</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <h3 className="font-semibold">Pargon Permissions</h3>
              {permissionOptions.pargon.map((permission) => (
                <div key={permission} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedRole.permissions?.pargon?.includes(permission)}
                    onChange={() => handlePermissionChange('pargon', permission)}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span>{permission}</span>
                </div>
              ))}
              <h3 className="font-semibold">Parasole Permissions</h3>
              {permissionOptions.parasole.map((permission) => (
                <div key={permission} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedRole.permissions?.parasole?.includes(permission)}
                    onChange={() => handlePermissionChange('parasole', permission)}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span>{permission}</span>
                </div>
              ))}
              <div className="flex justify-end space-x-2">
                <Button onClick={() => setShowPermissionModal(false)} className="bg-gray-500 hover:bg-gray-600">
                  Cancel
                </Button>
                <Button onClick={handlePermissionSave} className="bg-blue-500 hover:bg-blue-600">
                  Save Permissions
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Users;