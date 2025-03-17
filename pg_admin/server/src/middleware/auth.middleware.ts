// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// //The AuthRequest interface is a custom extension of Express's built-in Request object
// //In Express, Request is a built-in object that contains information about the HTTP request, such as headers, body, query parameters, etc.
// export interface AuthRequest extends Request {
//   user?: any;
// }

// export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const token = req.header('Authorization')?.replace('Bearer ', '');

//     if (!token) {
//       res.status(401).json({
//         status: "error",
//         message: "Authentication required"
//       });
//       return;
//     }

//     const jwtSecret = process.env.JWT_SECRET;
//     if (!jwtSecret) {
//       throw new Error("JWT secret not defined");
//     }

//     const decoded = jwt.verify(token, jwtSecret);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({
//       status: "error",
//       message: "Invalid token"
//     });
//   }
// };



import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getUserProfile } from '../services/global/auth.service'; // Adjust import path as needed

// The AuthRequest interface is a custom extension of Express's built-in Request object
export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({
        status: "error",
        message: "Authentication required"
      });
      return;
    }
    
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT secret not defined");
    }
    
    // Decode the JWT token
    const decoded = jwt.verify(token, jwtSecret) as any;
    
    try {
      // Fetch the complete user profile from the database
      const userProfile = await getUserProfile(Number(decoded.userId));
      
      // Attach the complete user profile to the request
      req.user = {
        ...decoded,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        email: userProfile.email,
        role: userProfile.role?.name
      };
      
      next();
    } catch (userError) {
      console.error("Error fetching user profile:", userError);
      
      // If we can't fetch the user profile, we'll still proceed with just the decoded token data
      req.user = decoded;
      next();
    }
  } catch (error) {
    res.status(401).json({
      status: "error",
      message: "Invalid token"
    });
  }
};