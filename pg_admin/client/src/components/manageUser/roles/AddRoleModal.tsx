// // src/components/roles/AddRoleModal.jsx
// import React from 'react';
// import { Plus, X } from 'lucide-react';

// const AddRoleModal = ({ 
//   showModal, 
//   setShowModal, 
//   newRole, 
//   setNewRole, 
//   handleAddRole 
// }) => {
//   if (!showModal) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all animate-slide-up">
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex justify-between items-center">
//             <h2 className="text-xl font-bold text-gray-800">Add New Role</h2>
//             <button
//               onClick={() => {
//                 setShowModal(false);
//                 setNewRole({
//                   name: "",
//                   role: "",
//                   permissions: {
//                     pargon: [],
//                     parasole: [],
//                     user: [],
//                     settings: [],
//                     analytics: []
//                   },
//                 });
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
//             handleAddRole();
//           }}
//           className="p-6 space-y-6"
//         >
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
//             <input
//               type="text"
//               value={newRole.name}
//               onChange={(e) =>
//                 setNewRole({ ...newRole, name: e.target.value })
//               }
//               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all focus:outline-none"
//               placeholder="Enter role name"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Role Type</label>
//             <select
//               value={newRole.role}
//               onChange={(e) =>
//                 setNewRole({ ...newRole, role: e.target.value })
//               }
//               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all focus:outline-none bg-white"
//               required
//             >
//               <option value="">Select Role Type</option>
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
//                 setNewRole({
//                   name: "",
//                   role: "",
//                   permissions: {
//                     pargon: [],
//                     parasole: [],
//                     user: [],
//                     settings: [],
//                     analytics: []
//                   },
//                 });
//               }}
//               className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-gray-200"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 flex items-center gap-2"
//             >
//               <Plus className="h-4 w-4" />
//               Create Role
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddRoleModal;