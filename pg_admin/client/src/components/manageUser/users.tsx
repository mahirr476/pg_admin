
// 'use client';

// import React, { useState, FormEvent } from 'react';

// const Users = () => {
//   // Dummy data
//   const initialUsers = [
//     { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
//     { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
//     { id: 3, name: 'Mike Johnson', email: 'mike@example.com', status: 'active' },
//     { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', status: 'inactive' },
//     { id: 5, name: 'Tom Brown', email: 'tom@example.com', status: 'active' }
//   ];

//   const [users, setUsers] = useState(initialUsers);
//   const [selectedStatus, setSelectedStatus] = useState('all');
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [newUser, setNewUser] = useState({ name: '', email: '', status: 'active' });
//   const [editingUser, setEditingUser] = useState(null);

//   // Filter users based on status
//   const filteredUsers = selectedStatus === 'all' 
//     ? users 
//     : users.filter(user => user.status === selectedStatus);

//   const handleAddUser = (e: FormEvent) => {
//     e.preventDefault();
//     const id = Math.max(...users.map(user => user.id)) + 1;
//     setUsers([...users, { ...newUser, id }]);
//     setNewUser({ name: '', email: '', status: 'active' });
//     setShowAddModal(false);
//   };

//   const handleEdit = (user) => {
//     setEditingUser(user);
//     setShowEditModal(true);
//   };

//   const handleEditSubmit = (e) => {
//     e.preventDefault();
//     if (editingUser) {
//       setUsers(users.map(user => 
//         user.id === editingUser.id ? editingUser : user
//       ));
//     }
//     setShowEditModal(false);
//     setEditingUser(null);
//   };

//   const handleDelete = (userId) => {
//     if (window.confirm('Are you sure you want to delete this user?')) {
//       setUsers(users.filter(user => user.id !== userId));
//     }
//   };

//   return (
//     <div className="p-6">
//       {/* Header Section */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">User Management</h1>
//         <button
//           onClick={() => setShowAddModal(true)}
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           Add User
//         </button>
//       </div>

//       {/* Filter Section */}
//       <div className="mb-6">
//         <select
//           value={selectedStatus}
//           onChange={(e) => setSelectedStatus(e.target.value)}
//           className="border rounded p-2"
//         >
//           <option value="all">All Users</option>
//           <option value="active">Active</option>
//           <option value="inactive">Inactive</option>
//         </select>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border border-gray-200">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="p-4 text-left font-medium border-b">Name</th>
//               <th className="p-4 text-left font-medium border-b">Email</th>
//               <th className="p-4 text-left font-medium border-b">Status</th>
//               <th className="p-4 text-left font-medium border-b">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredUsers.map((user) => (
//               <tr key={user.id} className="border-b">
//                 <td className="p-4">{user.name}</td>
//                 <td className="p-4">{user.email}</td>
//                 <td className="p-4">
//                   <span className={`px-2 py-1 rounded-full text-sm ${
//                     user.status === 'active' 
//                       ? 'bg-green-100 text-green-800' 
//                       : 'bg-red-100 text-red-800'
//                   }`}>
//                     {user.status}
//                   </span>
//                 </td>
//                 <td className="p-4">
//                   <div className="flex gap-2">
//                     <button
//                       className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
//                       onClick={() => handleEdit(user)}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50"
//                       onClick={() => handleDelete(user.id)}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Add User Modal */}
//       {showAddModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg w-96">
//             <h2 className="text-xl font-bold mb-4">Add New User</h2>
//             <form onSubmit={handleAddUser}>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">Name</label>
//                 <input
//                   type="text"
//                   value={newUser.name}
//                   onChange={(e) => setNewUser({...newUser, name: e.target.value})}
//                   className="w-full border rounded p-2"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">Email</label>
//                 <input
//                   type="email"
//                   value={newUser.email}
//                   onChange={(e) => setNewUser({...newUser, email: e.target.value})}
//                   className="w-full border rounded p-2"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">Status</label>
//                 <select
//                   value={newUser.status}
//                   onChange={(e) => setNewUser({...newUser, status: e.target.value})}
//                   className="w-full border rounded p-2"
//                 >
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                 </select>
//               </div>
//               <div className="flex justify-end gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setShowAddModal(false)}
//                   className="px-4 py-2 border rounded hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                 >
//                   Add User
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Edit User Modal */}
//       {showEditModal && editingUser && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg w-96">
//             <h2 className="text-xl font-bold mb-4">Edit User</h2>
//             <form onSubmit={handleEditSubmit}>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">Name</label>
//                 <input
//                   type="text"
//                   value={editingUser.name}
//                   onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
//                   className="w-full border rounded p-2"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">Email</label>
//                 <input
//                   type="email"
//                   value={editingUser.email}
//                   onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
//                   className="w-full border rounded p-2"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">Status</label>
//                 <select
//                   value={editingUser.status}
//                   onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
//                   className="w-full border rounded p-2"
//                 >
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                 </select>
//               </div>
//               <div className="flex justify-end gap-2">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowEditModal(false);
//                     setEditingUser(null);
//                   }}
//                   className="px-4 py-2 border rounded hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Users;




// "use client";
// import Cookies from "js-cookie";
// import { useEffect, useState } from "react";

// export default function UsersPage() {
//   const [users, setUsers] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const token = Cookies.get("token"); // Token from cookies
//       console.log("Token:", token);

//       if (!token) {
//         setError("No token found, please login first.");
//         return;
//       }

//       try {
//         const response = await fetch("http://localhost:7000/api/v1/user/all", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`, // Token being sent
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`Error ${response.status}: ${response.statusText}`);
//         }

//         const data = await response.json();
//         console.log("Users data:", data);
//         setUsers(data.users); // Set the users data
//       } catch (error) {
//         console.error("Error fetching users:", error);
//         setError(error.message);
//       }
//     };

//     fetchUsers();
//   }, []);

//   return (
//     <div>
//       <h1>User List</h1>
//       {error ? <p className="text-red-500">{error}</p> : null}
//       {users.length > 0 ? (
//         <table className="table-auto w-full border-collapse border border-gray-300">
//           <thead>
//             <tr>
//               <th className="border border-gray-300 p-2">ID</th>
//               <th className="border border-gray-300 p-2">UserName</th>
//               <td className="border border-gray-300 p-2">Email</td>
//               <th className="border border-gray-300 p-2">Role</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => (
//               <tr key={user.id}>
//                 <td className="border border-gray-300 p-2">{user.id}</td>
//                 <td className="border border-gray-300 p-2">{user.firstName + " " + user.lastName}</td>
//                 <td className="border border-gray-300 p-2">{user.email}</td>
               
//                 <td className="border border-gray-300 p-2">{user.status}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>No users found.</p>
//       )}
//     </div>
//   );
// }




'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import Cookies from 'js-cookie';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
}

interface NewUser {
  firstName: string;
  lastName: string;
  email: string;
  status: string;
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
    status: 'active' 
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
    : users.filter(user => user.status === selectedStatus);

  const handleAddUser = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = Cookies.get('token');
      const response = await fetch('http://localhost:7000/api/v1/user/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });

      if (!response.ok) {
        throw new Error('Failed to add user');
      }

      const data = await response.json();
      setUsers([...users, data.user]);
      setNewUser({ firstName: '', lastName: '', email: '', status: 'active' });
      setShowAddModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    user.status === 'active' 
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
                  onClick={() => setShowAddModal(false)}
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