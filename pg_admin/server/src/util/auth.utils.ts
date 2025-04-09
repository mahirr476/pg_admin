// utils/auth.utils.ts
import { Request, Response } from "express";

interface AuthUser {
  userId: number;
  userName: string;
}

export const getAuthenticatedUser = (req: Request, res: Response): AuthUser | null => {
  const user = (req as any).user;
  
  if (!user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required. User not found in request.',
    });
    return null;
  }
  
  // const userId = user.userId;
  const userId = parseInt(user.userId, 10);
  if (!userId) {
    res.status(401).json({
      success: false,
      message: 'User ID not found in authentication token',
    });
    return null;
  }
  
  // Get user name
  const userName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : `User ${userId}`;
  
  return { userId, userName };
};