import { CreateCSRInput } from '../../types/csr.types';
import { group } from '../../config/db.config';
import { CreateCsrDetailInput } from '../../types/csrDetail.types';

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

  // Get all CSR items
export const getAllCSR = async () => {
    try {
      return await group.cSR.findMany({
        orderBy: {
          orderIndex: 'asc'
        }
      });
    } catch (error) {
      console.error('Error fetching CSR items:', error);
      throw new Error('Failed to fetch CSR items');
    }
};


// Create a new CSR detail
export const createCsrDetail = async (data: CreateCsrDetailInput) => {
  try {

    const csrId = Number(data.csr_id);
    // const csrId = data.csr_id ? parseInt(data.csr_id, 10): null;

    // Check if the parent CSR exists
    const existingCSR = await group.cSR.findUnique({
      where: { id: csrId }
    });
    
    if (!existingCSR) {
      throw new Error(`CSR with ID ${data.csr_id} does not exist`);
    }
    
    return await group.csrDetail.create({
      data: {
        csr_id: csrId,
        title: data.title,
        description: data.description,
        image: data.image || null,
        createdBy: data.createdBy,
        // updatedBy: data.createdBy
      }
    });
  } catch (error) {
    console.error('Error creating CSR detail:', error);
    throw error;
  }
};