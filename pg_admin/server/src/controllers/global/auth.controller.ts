import { Request, Response } from 'express';
import { registerUser, loginUser, getAllUsers, getInactiveUsers, getUserById, updateUser, createUser } from '../../services/global/auth.service';
import jwt from "jsonwebtoken";
import { createAuditLog } from '../../services/global/audit-log.service';


export const registerUserHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || password === undefined) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    // Validate password length
    if (password.length < 6) {
      res.status(400).json({
        status: "error",
        message: "Password must be at least 6 characters long",
      });
      return;
    }

    // Register the user
    const user = await registerUser({ firstName, lastName, email, password });

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT secret not defined in environment variables");
    }
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: "24h" });

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      token,
    });
  } catch (error: unknown) {
    console.error("Registration error:", error);
    
    // Check if error is a Prisma error with code
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      res.status(400).json({
        status: "error",
        message: "A user with this email already exists",
      });
      return;
    }

    res.status(500).json({
      status: "error",
      message: "Internal server error. Please try again later.",
      details: process.env.NODE_ENV === 'development' ? 
        error instanceof Error ? error.message : 'Unknown error' 
        : undefined
    });
  }
};

// export const loginUserHandler = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { email, password } = req.body;

//     if (!email || password === undefined) {
//       res.status(400).json({ error: 'Email and password are required' });
//       return;
//     }

//     const result = await loginUser({ email, password });

//     if (!result || 'error' in result) {  // <-- TypeScript-safe check
//       if (result && result.error === 'inactive_account') {
//         const statusMessage = result.status === 'INACTIVE'
//           ? "Your account is inactive."
//           : "Your account has been closed.";

//         res.status(403).json({
//           status: "error",
//           message: `${statusMessage} Please contact support for assistance.`,
//           accountStatus: result.status
//         });
//       } else {
//         res.status(401).json({
//           status: "error",
//           message: "Invalid email or password",
//         });
//       }
//       return;
//     }

//     const user = result;
//     const jwtSecret = process.env.JWT_SECRET;
//     if (!jwtSecret) {
//       throw new Error("JWT secret not defined in environment variables");
//     }

//     const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: "24h" });

//     res.status(200).json({
//       status: "success",
//       message: "Login successful",
//       user: {
//         id: user.id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//       },
//       token,
//     });

//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: "Internal server error. Please try again later.",
//     });
//   }
// };

export const loginUserHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const result = await loginUser({ email, password });

    // Type guard to check if result is a user object
    const isSuccess = result && 'id' in result;
    //If login is successful, user is assigned the authenticated user.
    const user = isSuccess ? result : null;

    // Create audit log entry
    try {
      await createAuditLog({
        user_id: user?.id,
        action: isSuccess ? 'LOGIN_SUCCESS' : 'LOGIN_FAILED',
        entity_type: 'Auth',
        ip_address: req.ip,
        user_agent: req.get('User-Agent'),
        new_state: user ? {
          userId: user.id,
          email: user.email,
          status: user.status
        } : undefined,
        error_message: !isSuccess ? result.error : undefined,
      });
    } catch (auditError) {
      console.error('Audit log error:', auditError);
    }

    if (!isSuccess) {
      if (result?.error === 'inactive_account') {
        const statusMessage = result.status === 'INACTIVE'
          ? 'Your account is inactive.'
          : 'Your account has been closed.';
          
        res.status(403).json({
          status: 'error',
          message: `${statusMessage} Please contact support.`,
          accountStatus: result.status,
        });
      } else {
        res.status(401).json({ status: 'error', message: 'Invalid credentials' });
      }
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured');
    }

    const token = jwt.sign({ userId: user!.id }, jwtSecret, { expiresIn: '24h' });

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      user: {
        id: user!.id,
        firstName: user!.firstName,
        lastName: user!.lastName,
        email: user!.email,
      },
      token,
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};


export const getAllUsersHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await getAllUsers();
  
      res.status(200).json({
        status: "success",
        message: "All users retrieved successfully",
        users: users.map((user: any) => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          status: user.status,
          roleId: user.roleId,
          role: user.role.name,
        })),
      });
    } catch (error) {
      // console.error("Error fetching all users:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error. Please try again later.",
      });
    }
};

// Get a user by ID
export const getUserByIdHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await getUserById(Number(id));

    res.status(200).json({
      status: "success",
      message: "User retrieved successfully",
      user,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: (error as Error).message || "User not found",
    });
  }
};

// Update a user
export const updateUserHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedUser = await updateUser(Number(id), req.body);

    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      user: {
          id: updatedUser.id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          roleId: updatedUser.roleId,
          status: updatedUser.status,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: (error as Error).message || "Failed to update user",
    });
  }
};

// Create a user
export const createUserHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const roleId = Number(req.body.roleId);

    // Validate required fields
    if (!firstName || !lastName || !email || roleId === undefined || password === undefined) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    // Validate password length
    if (password.length < 6) {
      res.status(400).json({
        status: "error",
        message: "Password must be at least 6 characters long",
      });
      return;
    }

    // Create user
    const user = await createUser({ firstName, lastName, email, roleId, password });

    // success response
    res.status(201).json({
      status: "success",
      message: "User created successfully",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roleId: user.roleId,
      },
    });
  } catch (error: any) {
    // console.error("Creation error:", error);
    if (error.message === "Email already in use") {
      res.status(400).json({ status: "error", message: error.message });
    } else {
      res.status(500).json({
        status: "error",
        message: "Internal server error. Please try again later.",
      });
    }
  }
};

// export const createUserHandler = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { firstName, lastName, email, password } = req.body;
//     const roleId = Number(req.body.roleId);

//     // Validate required fields
//     if (!firstName || !lastName || !email || roleId === undefined || password === undefined) {
//       res.status(400).json({ error: 'All fields are required' });
//       return;
//     }

//     // Validate password length
//     if (password.length < 6) {
//       res.status(400).json({
//         status: "error",
//         message: "Password must be at least 6 characters long",
//       });
//       return;
//     }

//     // Create user
//     const user = await createUser({ firstName, lastName, email, roleId, password });

//     // Create audit log entry
//     try {
//       await createAuditLog({
//         user_id: user.id, // User ID of the created user (self-registration)
//         action: "CREATE_USER",
//         entity_type: "User",
//         entity_id: user.id,
//         ip_address: req.ip,
//         user_agent: req.get('User-Agent'),
//         new_state: {
//           id: user.id,
//           firstName: user.firstName,
//           lastName: user.lastName,
//           email: user.email,
//           roleId: user.roleId,
//           status: user.status,
//           createdAt: user.createdAt,
//           updatedAt: user.updatedAt
//         }
//       });
//     } catch (auditError) {
//       console.error("Audit log creation failed:", auditError);
//     }

//     // Success response
//     res.status(201).json({
//       status: "success",
//       message: "User created successfully",
//       user: {
//         id: user.id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         roleId: user.roleId,
//       },
//     });
//   } catch (error: any) {
//     if (error.message === "Email already in use") {
//       res.status(400).json({ status: "error", message: error.message });
//     } else {
//       res.status(500).json({
//         status: "error",
//         message: "Internal server error. Please try again later.",
//       });
//     }
//   }
// };

export const getInactiveUsersHandler = async (req: Request, res: Response) => {
    try {
        const users = await getInactiveUsers();

        res.status(200).json({
            status: "success",
            message: "Inactive users retrieved successfully",
            users: users.map((user: any) => ({
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
            })),
          });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Could not fetch inactive users"
        });
    }
};
  
  