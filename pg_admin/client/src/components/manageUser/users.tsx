
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
  roleId: number; // Role ID (1: User, 2: Admin, 3: Super Admin)
}

interface NewUser {
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  roleId: number; // Role ID for dropdown
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newUser, setNewUser] = useState<NewUser>({
    firstName: '',
    lastName: '',
    email: '',
    status: 'active',
    roleId: 1, // Default role ID (User)
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setUsers(data.users);
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

      const userToCreate = {
        ...newUser,
        roleId: parseInt(newUser.roleId.toString(), 10), // Ensure roleId is a number
        status: newUser.status.toLowerCase(),
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

      setNewUser({ firstName: '', lastName: '', email: '', status: 'active', roleId: 1 });
      setShowAddModal(false);
      setError(null);
    } catch (err) {
      console.error('Error adding user:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while adding user');
    }
  };

  // Handle Edit Button Click
  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  // Handle Edit Form Submission
  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No token found, please login first');
      }

      const response = await fetch(`http://localhost:7000/api/v1/user/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingUser),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const updatedUser = await response.json();
      setUsers(users.map((user) => (user.id === editingUser.id ? updatedUser.user : user)));
      setShowEditModal(false);
      setEditingUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // Handle Close Account (Mark as Closed)
  const handleCloseAccount = async (userId: number) => {
    if (window.confirm('Are you sure you want to close this account?')) {
      try {
        const token = Cookies.get('token');
        const response = await fetch(`http://localhost:7000/api/v1/user/${userId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'closed' }), // Update status to "closed"
        });

        if (!response.ok) {
          throw new Error('Failed to close account');
        }

        await response.json(); // Consume the response
        setUsers(users.map((user) => (user.id === userId ? { ...user, status: 'closed' } : user)));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    }
  };

  // Loading State
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Error State
  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="p-6">
      {/* Header Section */}
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      {/* Filter Section */}
      <div className="flex justify-between mb-4">
        <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="closed">Closed Accounts</SelectItem>
          </SelectContent>
        </Select>

        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button variant="default">Add User</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">First Name</label>
                <Input
                  type="text"
                  value={newUser.firstName}
                  onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Last Name</label>
                <Input
                  type="text"
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Role</label>
                <Select
                  value={newUser.roleId.toString()}
                  onValueChange={(value) =>
                    setNewUser({ ...newUser, roleId: parseInt(value, 10) })
                  }
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
                <label className="block text-sm font-medium">Status</label>
                <Select
                  value={newUser.status}
                  onValueChange={(value) => setNewUser({ ...newUser, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add User</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
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
            <TableRow key={user.id}>
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
                  <Button
                    size="sm"
                    onClick={() => handleEdit(user)}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleCloseAccount(user.id)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit User Modal */}
      {editingUser && (
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">First Name</label>
                <Input
                  type="text"
                  value={editingUser.firstName}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, firstName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Last Name</label>
                <Input
                  type="text"
                  value={editingUser.lastName}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, lastName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Role</label>
                <Select
                  value={editingUser.roleId.toString()}
                  onValueChange={(value) =>
                    setEditingUser({ ...editingUser, roleId: parseInt(value, 10) })
                  }
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
                <label className="block text-sm font-medium">Status</label>
                <Select
                  value={editingUser.status}
                  onValueChange={(value) =>
                    setEditingUser({ ...editingUser, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Users;