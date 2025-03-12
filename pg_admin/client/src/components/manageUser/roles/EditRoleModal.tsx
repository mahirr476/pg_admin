// // src/components/roles/EditRoleModal.jsx
// import React from 'react';
// import { Edit, Save, X } from 'lucide-react';

// const EditRoleModal = ({ 
//   showModal, 
//   setShowModal, 
//   selectedRole, 
//   setSelectedRole, 
//   handleSaveRole 
// }) => {
//   if (!showModal || !selectedRole) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all animate-slide-up">
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center gap-2">
//               <Edit className="h-5 w-5 text-blue-600" />
//               <h2 className="text-xl font-bold text-gray-800">Edit Role</h2>
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
        
//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             handleSaveRole();
//           }}
//           className="p-6 space-y-6"
//         >
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
//             <input
//               type="text"
//               value={selectedRole.name}
//               onChange={(e) =>
//                 setSelectedRole({ ...selectedRole, name: e.target.value })
//               }
//               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all focus:outline-none"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Role Type</label>
//             <select
//               value={selectedRole.role}
//               onChange={(e) =>
//                 setSelectedRole({ ...selectedRole, role: e.target.value })
//               }
//               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all focus:outline-none bg-white"
//               required
//             >
//               <option value="Super Admin">Super Admin</option>
//               <option value="Admin">Admin</option>
//               <option value="User">User</option>
//             </select>
//           </div>
//           <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
//             <button
//               type="button"
//               onClick={() => {
//                 setShowModal(false);
//                 setSelectedRole(null);
//               }}
//               className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-gray-200"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 flex items-center gap-2"
//             >
//               <Save className="h-4 w-4" />
//               Save Changes
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditRoleModal;