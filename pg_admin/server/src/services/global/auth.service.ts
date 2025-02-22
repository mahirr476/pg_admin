import { UserModel } from "../../model/global/auth.model";
import bcrypt from 'bcryptjs';

export const registerUser = async (data: { firstName: string; lastName: string; email: string; password: string; }) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const user = await UserModel.create({
        data: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: hashedPassword,
            roleId: 1,
            
        },
    });
    
    return user;
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