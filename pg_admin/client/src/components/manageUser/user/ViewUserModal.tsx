// src/components/users/ViewUserModal.jsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Shield } from "lucide-react";

const ViewUserModal = ({ showModal, setShowModal, viewingUser, getStatusColor, getRoleInfo }) => {
  if (!viewingUser) return null;

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-y-auto rounded-xl">
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
              <div className="font-semibold text-gray-900">
                #{viewingUser.id}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  getRoleInfo(viewingUser.roleId).color
                }`}
              >
                {getRoleInfo(viewingUser.roleId).label}
              </div>
              <div
                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                  viewingUser.status
                )}`}
              >
                {viewingUser.status}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div>
              <div className="text-sm text-gray-500 mb-1">First Name</div>
              <div className="font-medium text-gray-900">
                {viewingUser.firstName}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Last Name</div>
              <div className="font-medium text-gray-900">
                {viewingUser.lastName}
              </div>
            </div>
            <div className="col-span-2">
              <div className="text-sm text-gray-500 mb-1">Email</div>
              <div className="font-medium text-gray-900">
                {viewingUser.email}
              </div>
            </div>
          </div>

          {/* Permissions Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">User Access</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dashboard Module */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center border-b border-gray-200 pb-2">
                  <Shield className="h-4 w-4 mr-2 text-indigo-500" />
                  Dashboard
                </h4>
                <div className="px-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        viewingUser.permissions?.analytics?.includes(
                          "dashboard"
                        )
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    >
                      {viewingUser.permissions?.analytics?.includes(
                        "dashboard"
                      ) && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span
                      className={`text-sm ${
                        viewingUser.permissions?.analytics?.includes(
                          "dashboard"
                        )
                          ? "text-gray-900 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      View Access
                    </span>
                  </div>
                </div>
              </div>

              {/* Analytics Module */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center border-b border-gray-200 pb-2">
                  <Shield className="h-4 w-4 mr-2 text-indigo-500" />
                  Analytics
                </h4>
                <div className="px-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        viewingUser.permissions?.analytics?.includes("view")
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    >
                      {viewingUser.permissions?.analytics?.includes(
                        "view"
                      ) && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span
                      className={`text-sm ${
                        viewingUser.permissions?.analytics?.includes("view")
                          ? "text-gray-900 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      View Access
                    </span>
                  </div>
                </div>
              </div>

              {/* Settings Module */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center border-b border-gray-200 pb-2">
                  <Shield className="h-4 w-4 mr-2 text-indigo-500" />
                  Settings
                </h4>
                <div className="grid grid-cols-2 gap-2 px-2">
                  {["view", "create", "edit"].map((permission) => {
                    const hasPermission =
                      viewingUser.permissions?.settings?.includes(
                        permission
                      );
                    return (
                      <div
                        key={permission}
                        className="flex items-center space-x-2"
                      >
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            hasPermission ? "bg-green-500" : "bg-gray-300"
                          }`}
                        >
                          {hasPermission && (
                            <span className="text-white text-xs">✓</span>
                          )}
                        </div>
                        <span
                          className={`text-sm capitalize ${
                            hasPermission
                              ? "text-gray-900 font-medium"
                              : "text-gray-500"
                          }`}
                        >
                          {permission}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* User Management Module */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center border-b border-gray-200 pb-2">
                  <Shield className="h-4 w-4 mr-2 text-indigo-500" />
                  User Management
                </h4>
                <div className="grid grid-cols-2 gap-2 px-2">
                  {["view", "create", "edit", "delete"].map(
                    (permission) => {
                      const hasPermission =
                        viewingUser.permissions?.user?.includes(permission);
                      return (
                        <div
                          key={permission}
                          className="flex items-center space-x-2"
                        >
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center ${
                              hasPermission ? "bg-green-500" : "bg-gray-300"
                            }`}
                          >
                            {hasPermission && (
                              <span className="text-white text-xs">✓</span>
                            )}
                          </div>
                          <span
                            className={`text-sm capitalize ${
                              hasPermission
                                ? "text-gray-900 font-medium"
                                : "text-gray-500"
                            }`}
                          >
                            {permission}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Pargon Website */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center border-b border-gray-200 pb-2">
                  <Shield className="h-4 w-4 mr-2 text-indigo-500" />
                  Pargon Website
                </h4>
                <div className="grid grid-cols-2 gap-2 px-2">
                  {["view", "create", "edit", "delete"].map(
                    (permission) => {
                      const hasPermission =
                        viewingUser.permissions?.pargon?.includes(
                          permission
                        );
                      return (
                        <div
                          key={permission}
                          className="flex items-center space-x-2"
                        >
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center ${
                              hasPermission ? "bg-green-500" : "bg-gray-300"
                            }`}
                          >
                            {hasPermission && (
                              <span className="text-white text-xs">✓</span>
                            )}
                          </div>
                          <span
                            className={`text-sm capitalize ${
                              hasPermission
                                ? "text-gray-900 font-medium"
                                : "text-gray-500"
                            }`}
                          >
                            {permission}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Parasole Website */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center border-b border-gray-200 pb-2">
                  <Shield className="h-4 w-4 mr-2 text-indigo-500" />
                  Parasole Website
                </h4>
                <div className="grid grid-cols-2 gap-2 px-2">
                  {["view", "create", "edit", "delete"].map(
                    (permission) => {
                      const hasPermission =
                        viewingUser.permissions?.parasole?.includes(
                          permission
                        );
                      return (
                        <div
                          key={permission}
                          className="flex items-center space-x-2"
                        >
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center ${
                              hasPermission ? "bg-green-500" : "bg-gray-300"
                            }`}
                          >
                            {hasPermission && (
                              <span className="text-white text-xs">✓</span>
                            )}
                          </div>
                          <span
                            className={`text-sm capitalize ${
                              hasPermission
                                ? "text-gray-900 font-medium"
                                : "text-gray-500"
                            }`}
                          >
                            {permission}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end bg-gray-50 rounded-b-xl">
          <Button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-800"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewUserModal;