import { CreateCSRInput } from '../../types/csr.types';
import { group } from '../../config/db.config';

// Create a new CSR item
export const createCSR = async (data: CreateCSRInput) => {
    try {
      // Check if order index already exists
      const existingCSR = await group.cSR.findUnique({
        where: { orderIndex: data.orderIndex }
      });
      
      if (existingCSR) {
        throw new Error(`A CSR item with order index ${data.orderIndex} already exists`);
      }
      
      return await group.cSR.create({
        data: {
          title: data.title,
          description: data.description,
          orderIndex: data.orderIndex,
          createdBy: data.createdBy,
          updatedBy: "N/A"
        }
      });
    } catch (error) {
      console.error('Error creating CSR item:', error);
      throw error; 
    }
  };

