// src/components/users/EditUserModal.jsx
import React from "react";
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
import { Edit, Save, X, User, Mail, ShieldCheck, ToggleLeft, CheckCircle2, AlertCircle } from "lucide-react";

const EditUserModal = ({ showModal, setShowModal, editingUser, setEditingUser, onEditUser, error }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onEditUser(editingUser);
  };

  if (!editingUser) return null;

  // Get role name based on ID
  const getRoleName = (id) => {
    switch (parseInt(id, 10)) {
      case 1: return "Super Admin";
      case 2: return "Admin";
      case 3: return "User";
      default: return "User";
    }
  };

  // Get role color based on ID
  const getRoleColor = (id) => {
    switch (parseInt(id, 10)) {
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
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="absolute top-0 right-0 mt-4 mr-4">
              <button 
                onClick={() => {
                  setShowModal(false);
                  setEditingUser(null);
                }}
                className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <Edit className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold mb-1">
                  Edit User
                </DialogTitle>
                <p className="text-blue-100 text-sm">
                  Update user information and settings
                </p>
              </div>
            </div>
          </div>
          
          {/* User Role Preview */}
          <div className="bg-white px-6 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`h-8 w-8 rounded-full bg-gradient-to-r ${getRoleColor(editingUser.roleId)} flex items-center justify-center text-white text-xs font-medium`}>
                  {getRoleName(editingUser.roleId).charAt(0)}
                </div>
                <div>
                  <p className="text-gray-800 font-medium">{getRoleName(editingUser.roleId)}</p>
                  <p className="text-gray-500 text-xs">Role</p>
                </div>
              </div>
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  editingUser.status === 'active' ? 'bg-green-100 text-green-800' : 
                  editingUser.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${
                    editingUser.status === 'active' ? 'bg-green-500' : 
                    editingUser.status === 'inactive' ? 'bg-gray-500' : 
                    'bg-red-500'
                  }`}></span>
                  {editingUser.status.charAt(0).toUpperCase() + editingUser.status.slice(1)}
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
                  value={editingUser.firstName}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      firstName: e.target.value,
                    })
                  }
                  required
                  className="w-full pl-3 pr-9 py-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm"
                />
                {editingUser.firstName && (
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
                  value={editingUser.lastName}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      lastName: e.target.value,
                    })
                  }
                  required
                  className="w-full pl-3 pr-9 py-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm"
                />
                {editingUser.lastName && (
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
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
                required
                className="w-full pl-3 pr-9 py-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm"
              />
              {editingUser.email && (
                <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
              )}
            </div>
            <p className="text-xs text-gray-500">This email is used for login and notifications</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Role Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <ShieldCheck className="h-4 w-4 mr-1 text-gray-500" />
                Role
              </label>
              <Select
                value={editingUser.roleId.toString()}
                onValueChange={(value) =>
                  setEditingUser({
                    ...editingUser,
                    roleId: parseInt(value, 10),
                  })
                }
              >
                <SelectTrigger className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm">
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
              <p className="text-xs text-gray-500">Determines user access level</p>
            </div>
            
            {/* Status Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <ToggleLeft className="h-4 w-4 mr-1 text-gray-500" />
                Status
              </label>
              <Select
                value={editingUser.status.toLowerCase()}
                onValueChange={(value) =>
                  setEditingUser({ ...editingUser, status: value })
                }
              >
                <SelectTrigger className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm">
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
                  <SelectItem value="closed" className="flex items-center py-2">
                    <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                    Closed
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">Controls whether user can login</p>
            </div>
          </div>
          
          {/* Information Banner */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 text-sm text-blue-800">
            <p className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Changes to role and status will take effect immediately after saving
            </p>
          </div>
          
          {/* Submit Buttons */}
          <div className="pt-5 border-t border-gray-200 flex justify-end space-x-3">
            <Button
              type="button"
              onClick={() => {
                setShowModal(false);
                setEditingUser(null);
              }}
              variant="outline"
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center gap-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;