import { Request, Response } from 'express';
import { registerUser, loginUser, getActiveUsers, getInactiveUsers } from '../../services/global/auth.service';
import jwt from "jsonwebtoken";

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

    // Send success response
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
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error. Please try again later.",
    });
  }
};

export const loginUserHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      // Validate required fields
      if (!email || password === undefined) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }
  
      // Login the user
      const user = await loginUser({ email, password });
  
      if (!user) {
        res.status(401).json({
          status: "error",
          message: "Invalid email or password",
        });
        return;
      }
  
      // Generate JWT token
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error("JWT secret not defined in environment variables");
      }
      const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: "24h" });
  
      // Send success response
      res.status(200).json({
        status: "success",
        message: "Login successful",
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
        token,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error. Please try again later.",
      });
    }
  };

export const getActiveUsersHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await getActiveUsers();
  
      res.status(200).json({
        status: "success",
        message: "Active users retrieved successfully",
        users: users.map(user => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        //   status: user.status,
        })),
      });
    } catch (error) {
      console.error("Error fetching active users:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error. Please try again later.",
      });
    }
  };


export const getInactiveUsersHandler = async (req: Request, res: Response) => {
    try {
        const users = await getInactiveUsers();

        res.status(200).json({
            status: "success",
            message: "Inactive users retrieved successfully",
            users: users.map(user => ({
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
  
  