// // src/app/api/auth/login/route.ts
// import { NextResponse } from "next/server";

// // Dummy user data
// const VALID_CREDENTIALS = {
//   email: "admin@admin.com",
//   password: "admin123",
// };

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const { email, password } = body;

//     // Simulate API delay
//     await new Promise((resolve) => setTimeout(resolve, 1000));

//     if (
//       email === VALID_CREDENTIALS.email &&
//       password === VALID_CREDENTIALS.password
//     ) {
//       return NextResponse.json({
//         status: "success",
//         user: {
//           id: 1,
//           email: VALID_CREDENTIALS.email,
//           name: "Admin User",
//           role: "admin",
//         },
//       });
//     }

//     return NextResponse.json(
//       { status: "error", message: "Invalid credentials" },
//       { status: 401 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { status: "error", message: "Server error" },
//       { status: 500 }
//     );
//   }
// }