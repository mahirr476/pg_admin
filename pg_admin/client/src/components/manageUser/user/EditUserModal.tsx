
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
import { Edit, Save } from "lucide-react";

const EditUserModal = ({ showModal, setShowModal, editingUser, setEditingUser, onEditUser, error }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onEditUser(editingUser);
  };

  if (!editingUser) return null;

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden rounded-xl">
        <DialogHeader className="p-6 border-b border-gray-200 bg-gray-50">
          <DialogTitle className="flex items-center text-xl">
            <Edit className="h-5 w-5 mr-2 text-blue-600" />
            Edit User
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <Input
                type="text"
                placeholder="First Name"
                value={editingUser.firstName}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    firstName: e.target.value,
                  })
                }
                required
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <Input
                type="text"
                placeholder="Last Name"
                value={editingUser.lastName}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    lastName: e.target.value,
                  })
                }
                required
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                placeholder="Email"
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
                required
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <Select
                value={editingUser.status.toLowerCase()}
                onValueChange={(value) =>
                  setEditingUser({ ...editingUser, status: value })
                }
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
                setShowModal(false);
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
  );
};

export default EditUserModal;