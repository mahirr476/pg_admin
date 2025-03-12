// // src/components/roles/ViewRoleModal.jsx
// import React from 'react';
// import { Shield, X } from 'lucide-react';

// const ViewRoleModal = ({ 
//   showModal, 
//   setShowModal, 
//   selectedRole, 
//   setSelectedRole, 
//   getRoleBadgeColor 
// }) => {
//   if (!showModal || !selectedRole) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in overflow-auto">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all animate-slide-up">
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center gap-2">
//               <Shield className="h-5 w-5 text-indigo-600" />
//               <h2 className="text-xl font-bold text-gray-800">Role Details</h2>
//             </div>
//             <button
//               onClick={() => {
//                 setShowModal(false);
//                 setSelectedRole(null);
//               }}
//               className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
//             >
//               <X className="h-5 w-5" />
//             </button>
//           </div>
//         </div>
        
//         <div className="p-6 space-y-6">
//           <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
//             <div>
//               <div className="text-sm text-gray-500 mb-1">Role Name</div>
//               <div className="font-semibold text-gray-900">{selectedRole.name}</div>
//             </div>
//             <div className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(selectedRole.role)}`}>
//               {selectedRole.role}
//             </div>
//           </div>
          
//           <div>
//             <h3 className="text-lg font-semibold mb-3">Role Access</h3>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Dashboard Module */}
//               <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
//                 <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center border-b border-gray-200 pb-2">
//                   <Shield className="h-4 w-4 mr-2 text-indigo-500" />
//                   Dashboard
//                 </h4>
//                 <div className="px-2">
//                   <div className="flex items-center space-x-2 mb-2">
//                     <div className={`w-4 h-4 rounded-full flex items-center justify-center ${selectedRole.permissions.analytics?.includes('view') ? 'bg-green-500' : 'bg-gray-300'}`}>
//                       {selectedRole.permissions.analytics?.includes('view') && <span className="text-white text-xs">✓</span>}
//                     </div>
//                     <span className={`text-sm ${selectedRole.permissions.analytics?.includes('view') ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
//                       View Access
//                     </span>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Analytics Module */}
//               <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
//                 <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center border-b border-gray-200 pb-2">
//                   <Shield className="h-4 w-4 mr-2 text-indigo-500" />
//                   Analytics
//                 </h4>
//                 <div className="px-2">
//                   <div className="flex items-center space-x-2 mb-2">
//                     <div className={`w-4 h-4 rounded-full flex items-center justify-center ${selectedRole.permissions.analytics?.includes('view') ? 'bg-green-500' : 'bg-gray-300'}`}>
//                       {selectedRole.permissions.analytics?.includes('view') && <span className="text-white text-xs">✓</span>}
//                     </div>
//                     <span className={`text-sm ${selectedRole.permissions.analytics?.includes('view') ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
//                       View Access
//                     </span>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Settings Module */}
//               <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
//                 <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center border-b border-gray-200 pb-2">
//                   <Shield className="h-4 w-4 mr-2 text-indigo-500" />
//                   Settings
//                 </h4>
//                 <div className="grid grid-cols-2 gap-2 px-2">
//                   {["view", "create", "edit", "delete"].map((permission) => {
//                     const hasPermission = selectedRole.permissions.settings?.includes(permission);
//                     return (
//                       <div key={permission} className="flex items-center space-x-2">
//                         <div className={`w-4 h-4 rounded-full flex items-center justify-center ${hasPermission ? 'bg-green-500' : 'bg-gray-300'}`}>
//                           {hasPermission && <span className="text-white text-xs">✓</span>}
//                         </div>
//                         <span className={`text-sm capitalize ${hasPermission ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
//                           {permission}
//                         </span>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
              
//               {/* User Management Module */}
//               <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
//                 <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center border-b border-gray-200 pb-2">
//                   <Shield className="h-4 w-4 mr-2 text-indigo-500" />
//                   User Management
//                 </h4>
//                 <div className="grid grid-cols-2 gap-2 px-2">
//                   {["view", "create", "edit", "delete"].map((permission) => {
//                     const hasPermission = selectedRole.permissions.user?.includes(permission);
//                     return (
//                       <div key={permission} className="flex items-center space-x-2">
//                         <div className={`w-4 h-4 rounded-full flex items-center justify-center ${hasPermission ? 'bg-green-500' : 'bg-gray-300'}`}>
//                           {hasPermission && <span className="text-white text-xs">✓</span>}
//                         </div>
//                         <span className={`text-sm capitalize ${hasPermission ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
//                           {permission}
//                         </span>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
              
//               {/* Pargon Website */}
//               <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
//                 <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center border-b border-gray-200 pb-2">
//                   <Shield className="h-4 w-4 mr-2 text-indigo-500" />
//                   Pargon Website
//                 </h4>
//                 <div className="grid grid-cols-2 gap-2 px-2">
//                   {["view", "create", "edit", "delete"].map((permission) => {
//                     const hasPermission = selectedRole.permissions.pargon?.includes(permission);
//                     return (
//                       <div key={permission} className="flex items-center space-x-2">
//                         <div className={`w-4 h-4 rounded-full flex items-center justify-center ${hasPermission ? 'bg-green-500' : 'bg-gray-300'}`}>
//                           {hasPermission && <span className="text-white text-xs">✓</span>}
//                         </div>
//                         <span className={`text-sm capitalize ${hasPermission ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
//                           {permission}
//                         </span>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
              
//               {/* Parasole Website */}
//               <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
//                 <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center border-b border-gray-200 pb-2">
//                   <Shield className="h-4 w-4 mr-2 text-indigo-500" />
//                   Parasole Website
//                 </h4>
//                 <div className="grid grid-cols-2 gap-2 px-2">
//                   {["view", "create", "edit", "delete"].map((permission) => {
//                     const hasPermission = selectedRole.permissions.parasole?.includes(permission);
//                     return (
//                       <div key={permission} className="flex items-center space-x-2">
//                         <div className={`w-4 h-4 rounded-full flex items-center justify-center ${hasPermission ? 'bg-green-500' : 'bg-gray-300'}`}>
//                           {hasPermission && <span className="text-white text-xs">✓</span>}
//                         </div>
//                         <span className={`text-sm capitalize ${hasPermission ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
//                           {permission}
//                         </span>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         <div className="p-6 border-t border-gray-200 flex justify-end bg-gray-50 rounded-b-xl">
//           <button
//             onClick={() => {
//               setShowModal(false);
//               setSelectedRole(null);
//             }}
//             className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-gray-200"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewRoleModal;