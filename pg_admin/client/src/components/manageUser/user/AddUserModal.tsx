
// src/components/users/AddUserModal.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, X, CheckCircle2, AlertCircle, ShieldCheck, ToggleLeft, Mail, User, Key } from "lucide-react";

const AddUserModal = ({ showModal, setShowModal, onAddUser, error }) => {
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    status: "active",
    roleId: 3, // Default role ID (User)
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddUser(newUser);
  };

  // Get role name based on ID
  const getRoleName = (id) => {
    switch (id) {
      case 1: return "Super Admin";
      case 2: return "Admin";
      case 3: return "User";
      default: return "User";
    }
  };

  // Get role color based on ID
  const getRoleColor = (id) => {
    switch (id) {
      case 1: return "from-purple-600 to-indigo-700"; // Super Admin
      case 2: return "from-blue-600 to-indigo-600"; // Admin
      case 3: return "from-emerald-600 to-teal-600"; // User
      default: return "from-gray-600 to-gray-700";
    }
  };

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="sm:max-w-[525px] p-0 overflow-hidden rounded-xl shadow-2xl">
        {/* Gradient Header */}
        <DialogHeader className="relative overflow-hidden border-b-0 p-0">
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">
            <div className="absolute top-0 right-0 mt-4 mr-4">
              <button 
                onClick={() => setShowModal(false)}
                className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <UserPlus className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold mb-1">
                  Add New User
                </DialogTitle>
                <p className="text-indigo-100 text-sm">
                  Create a new user account with permissions
                </p>
              </div>
            </div>
          </div>
          
          {/* User Role Tab Display */}
          <div className="bg-white px-6 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`h-8 w-8 rounded-full bg-gradient-to-r ${getRoleColor(newUser.roleId)} flex items-center justify-center text-white text-xs font-medium`}>
                  {getRoleName(newUser.roleId).charAt(0)}
                </div>
                <div>
                  <p className="text-gray-800 font-medium">{getRoleName(newUser.roleId)}</p>
                  <p className="text-gray-500 text-xs">Role</p>
                </div>
              </div>
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  newUser.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${
                    newUser.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                  }`}></span>
                  {newUser.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* First Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <User className="h-4 w-4 mr-1 text-gray-500" />
                First Name
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter first name"
                  value={newUser.firstName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, firstName: e.target.value })
                  }
                  required
                  className="w-full pl-3 pr-9 py-2 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg shadow-sm"
                />
                {newUser.firstName && (
                  <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                )}
              </div>
            </div>
            
            {/* Last Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <User className="h-4 w-4 mr-1 text-gray-500" />
                Last Name
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter last name"
                  value={newUser.lastName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, lastName: e.target.value })
                  }
                  required
                  className="w-full pl-3 pr-9 py-2 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg shadow-sm"
                />
                {newUser.lastName && (
                  <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                )}
              </div>
            </div>
          </div>
          
          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <Mail className="h-4 w-4 mr-1 text-gray-500" />
              Email Address
            </label>
            <div className="relative">
              <Input
                type="email"
                placeholder="user@example.com"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                required
                className="w-full pl-3 pr-9 py-2 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg shadow-sm"
              />
              {newUser.email && (
                <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
              )}
            </div>
            <p className="text-xs text-gray-500">They will use this email to log in</p>
          </div>
          
          {/* Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <Key className="h-4 w-4 mr-1 text-gray-500" />
              Password
            </label>
            <div className="relative">
              <Input
                type="password"
                placeholder="Enter secure password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                required
                className="w-full pl-3 pr-9 py-2 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg shadow-sm"
              />
              {newUser.password && (
                <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
              )}
            </div>
            <p className="text-xs text-gray-500">Minimum 8 characters recommended</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Role Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <ShieldCheck className="h-4 w-4 mr-1 text-gray-500" />
                Role
              </label>
              <Select
                value={newUser.roleId.toString()}
                onValueChange={(value) =>
                  setNewUser({ ...newUser, roleId: parseInt(value, 10) })
                }
              >
                <SelectTrigger className="w-full border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg shadow-sm">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3" className="flex items-center py-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></div>
                    User
                  </SelectItem>
                  <SelectItem value="2" className="flex items-center py-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                    Admin
                  </SelectItem>
                  <SelectItem value="1" className="flex items-center py-2">
                    <div className="h-2 w-2 rounded-full bg-purple-500 mr-2"></div>
                    Super Admin
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Status Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <ToggleLeft className="h-4 w-4 mr-1 text-gray-500" />
                Status
              </label>
              <Select
                value={newUser.status}
                onValueChange={(value) =>
                  setNewUser({ ...newUser, status: value })
                }
              >
                <SelectTrigger className="w-full border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg shadow-sm">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active" className="flex items-center py-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    Active
                  </SelectItem>
                  <SelectItem value="inactive" className="flex items-center py-2">
                    <div className="h-2 w-2 rounded-full bg-gray-400 mr-2"></div>
                    Inactive
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Submit Buttons */}
          <div className="pt-5 border-t border-gray-200 flex justify-end space-x-3">
            <Button
              type="button"
              onClick={() => setShowModal(false)}
              variant="outline"
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white flex items-center gap-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              <UserPlus className="h-4 w-4" />
              Create User
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;