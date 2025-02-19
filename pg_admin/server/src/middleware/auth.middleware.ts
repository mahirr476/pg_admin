import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

//The AuthRequest interface is a custom extension of Express's built-in Request object
//In Express, Request is a built-in object that contains information about the HTTP request, such as headers, body, query parameters, etc.
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

    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      status: "error",
      message: "Invalid token"
    });
  }
};
