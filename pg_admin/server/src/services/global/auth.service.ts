import prisma from "../../config/db.config";
import { UserModel } from "../../model/global/auth.model";
import bcrypt from 'bcryptjs';

export const registerUser = async (data: { firstName: string; lastName: string; email: string; password: string; }) => {
    try {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        
        const user = await prisma.user.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: hashedPassword,
                roleId: 1, // Make sure this role exists in your database
            },
        });
        
        return user;
    } catch (error) {
        console.error('Registration error:', error);
        throw error; // Re-throw to handle in controller
    }
};

export const loginUser = async (data: { email: string; password: string }) => {
    const user = await UserModel.findUnique({
        where: {
            email: data.email
        }
    });

    if (!user) {
        return null;
    }

    const validPassword = await bcrypt.compare(data.password, user.password);
    
    if (!validPassword) {
        return null;
    }

    return user;
};

export const getAllUsers = async () => {
    const users = await UserModel.findMany({
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            status: true,
            roleId: true
        }
    });
    return users;
};

// Get a user by ID
export const getUserById = async (id: number) => {
    const user = await UserModel.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
        roleId: true,
      },
    });
  
    if (!user) {
      throw new Error('User not found');
    }
  
    return user;
};

// Update a user
export const updateUser = async (id: number, data: { firstName?: string; lastName?: string; email?: string; status?: string; roleId?: number }) => {
    
    // Check if the user exists
    const existingUser = await UserModel.findUnique({ where: { id } });
    if (!existingUser) {
      throw new Error('User not found');
    }
  
    // If updating the email, ensure it's unique
    if (data.email) {
      const duplicateUser = await UserModel.findUnique({ where: { email: data.email } });
      if (duplicateUser && duplicateUser.id !== id) {
        throw new Error('A user with this email already exists');
      }
    }
  
    // Update the user
    return await UserModel.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        status: data.status as any,
        roleId: data.roleId,
      },
    });
};

export const getInactiveUsers = async () => {
    const users = await UserModel.findMany({
        where: {
            status: 'INACTIVE'
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            status: true
        }
    });
    return users;
};