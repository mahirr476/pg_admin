
import React from 'react'
import Dashboard from './admin/dashboard/page'


const page = () => {
  return (
    <div>
     <Dashboard/>
    </div>
  )
}

export default page



// "use client"
// import Cookies from 'js-cookie';
// import { useEffect, } from "react";

// export default function UsersPage() {
 

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const token = Cookies.get("token"); // Token from cookies
// console.log("Token:", token);
   
// console.log("Token:", token);
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
//        // Set the data
//       } catch (error) {
//         console.error("Error fetching users:", error);
       
//       }
//     };

//     fetchUsers();
//   }, []);

//   return (
//     <div>
//       <h1>User List</h1>
     
//     </div>
//   );
// }
