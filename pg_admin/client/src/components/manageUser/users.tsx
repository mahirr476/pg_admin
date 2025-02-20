
'use client';
import React, { useState, FormEvent, useEffect } from 'react';
import Cookies from 'js-cookie';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  roleId: number;  // Added role field
}

interface NewUser {
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  role: string; 
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
    role: 'user'  // Added default role
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = Cookies.get('token');
      console.log('Token:', token);

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
        console.log('Users data:', data);
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

  const filteredUsers = selectedStatus === 'all'
    ? users
    : users.filter(user => user.status.toLowerCase() === selectedStatus.toLowerCase());

  const handleAddUser = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = Cookies.get('token');
      
      if (!token) {
        throw new Error('No token found, please login first');
      }

      const userToCreate = {
        ...newUser,
        status: newUser.status.toLowerCase()
      };

      const response = await fetch('http://localhost:7000/api/v1/user/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userToCreate)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add user');
      }

      const data = await response.json();
      if (data.success) {
        const refreshResponse = await fetch('http://localhost:7000/api/v1/user/all', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          setUsers(refreshData.users);
        }
        
        setNewUser({ firstName: '', lastName: '', email: '', status: 'active', role: 'user' });
        setShowAddModal(false);
        setError(null);
      } else {
        throw new Error(data.message || 'Failed to add user');
      }
    } catch (err) {
      console.error('Error adding user:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while adding user');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      try {
        const token = Cookies.get('token');
        const response = await fetch(`http://localhost:7000/api/v1/user/${editingUser.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(editingUser)
        });

        if (!response.ok) {
          throw new Error('Failed to update user');
        }

        const updatedUser = await response.json();
        setUsers(users.map(user => 
          user.id === editingUser.id ? updatedUser.user : user
        ));
        setShowEditModal(false);
        setEditingUser(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    }
  };

  const handleDelete = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = Cookies.get('token');
        const response = await fetch(`http://localhost:7000/api/v1/user/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete user');
        }

        setUsers(users.filter(user => user.id !== userId));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add User
        </button>
      </div>

      {/* Filter Section */}
      <div className="mb-6">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border rounded p-2"
        >
          <option value="all">All Users</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left font-medium border-b">ID</th>
              <th className="p-4 text-left font-medium border-b">Name</th>
              <th className="p-4 text-left font-medium border-b">Email</th>
              <th className="p-4 text-left font-medium border-b">Role</th>
              <th className="p-4 text-left font-medium border-b">Status</th>
              <th className="p-4 text-left font-medium border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="p-4">{user.id}</td>
                <td className="p-4">{user.firstName} {user.lastName}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.roleId}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    user.status.toLowerCase() === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New User</h2>
            {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
            <form onSubmit={handleAddUser}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input
                  type="text"
                  value={newUser.firstName}
                  onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">roleId</label>
                <select
                  value={newUser.roleId}
                  onChange={(e) => setNewUser({...newUser, roleId: e.target.value})}
                  className="w-full border rounded p-2"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={newUser.status}
                  onChange={(e) => setNewUser({...newUser, status: e.target.value})}
                  className="w-full border rounded p-2"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setError(null);
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input
                  type="text"
                  value={editingUser.firstName}
                  onChange={(e) => setEditingUser({...editingUser, firstName: e.target.value})}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  value={editingUser.lastName}
                  onChange={(e) => setEditingUser({...editingUser, lastName: e.target.value})}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">roleId</label>
                <select
                  value={editingUser.roleId}
                  onChange={(e) => setEditingUser({...editingUser, roleId: e.target.value})}
                  className="w-full border rounded p-2"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={editingUser.status}
                  onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
                  className="w-full border rounded p-2"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                    setError(null);
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;