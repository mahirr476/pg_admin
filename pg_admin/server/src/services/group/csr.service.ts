import { CreateCsrDetailInput, UpdateCsrDetailInput } from '../../types/csrDetail.types';
import { group } from '../../config/db.config';
import { CreateCSRInput, UpdateCSRInput } from '../../types/csr.types';
import fs from 'fs';
import path from 'path';

// Create a new CSR item
export const createCSR = async (data: CreateCSRInput) => {
  try {
    // Check if order index already exists
    const existingCSR = await group.cSR.findUnique({
      where: { orderIndex: data.orderIndex },
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
        updatedBy: data.updatedBy || "N/A",
        status: data.status || 'ACTIVE',
      },
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
        orderIndex: 'asc',
      },
    });
  } catch (error) {
    console.error('Error fetching CSR items:', error);
    throw new Error('Failed to fetch CSR items');
  }
};

// Get a specific CSR item by ID
// export const getCSRById = async (id: number) => {
//   try {
//     const csrItem = await group.cSR.findUnique({
//       where: { id },
//     });

//     if (!csrItem) {
//       throw new Error(`CSR item with ID ${id} not found`);
//     }

//     return csrItem;
//   } catch (error) {
//     console.error('Error fetching CSR item:', error);
//     throw error;
//   }
// };

// Update a CSR item
export const updateCSR = async (id: number, data: UpdateCSRInput) => {
  try {
    // Check if CSR item exists
    const existingCSRItem = await group.cSR.findUnique({
      where: { id },
    });

    if (!existingCSRItem) {
      throw new Error(`CSR item with ID ${id} not found`);
    }

    // Check if the new orderIndex conflicts with another entry
    if (data.orderIndex !== undefined && data.orderIndex !== existingCSRItem.orderIndex) {
      const conflictingCSRItem = await group.cSR.findUnique({
        where: {
          orderIndex: data.orderIndex,
        },
      });

      if (conflictingCSRItem && conflictingCSRItem.id !== id) {
        throw new Error(`A CSR item with order index ${data.orderIndex} already exists`);
      }
    }

    // Update the CSR item
    return await group.cSR.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.orderIndex !== undefined && { orderIndex: data.orderIndex }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.status !== undefined && { status: data.status }),
        updatedBy: data.updatedBy,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Error updating CSR item:', error);
    throw error;
  }
};

// Delete a CSR item
export const deleteCSR = async (id: number) => {
  try {
    // Check if CSR item exists
    const csrItem = await group.cSR.findUnique({
      where: { id },
    });

    if (!csrItem) {
      throw new Error(`CSR item with ID ${id} not found`);
    }

    // Delete the CSR item
    await group.cSR.delete({
      where: { id },
    });

    return true;
  } catch (error) {
    console.error('Error deleting CSR item:', error);
    throw error;
  }
};



// ===========================  CSR Detail SERVICES ===========================


// Create a new CSR detail
export const createCsrDetail = async (data: CreateCsrDetailInput) => {
  try {
    // Check if the parent CSR exists
    const existingCSR = await group.cSR.findUnique({
      where: { id: data.csr_id },
    });

    if (!existingCSR) {
      throw new Error(`CSR with ID ${data.csr_id} does not exist`);
    }

    return await group.csrDetail.create({
      data: {
        csr_id: data.csr_id,
        title: data.title,
        description: data.description,
        image: data.image || null,
        createdBy: data.createdBy,
      },
    });
  } catch (error) {
    console.error('Error creating CSR detail:', error);
    throw error;
  }
};

// Get all CSR details
export const getAllCsrDetails = async () => {
  try {
    return await group.csrDetail.findMany({
      include: {
        csr: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });
  } catch (error) {
    console.error('Error fetching CSR details:', error);
    throw new Error('Failed to fetch CSR details');
  }
};

// Update a CSR detail
export const updateCsrDetail = async (id: number, data: UpdateCsrDetailInput) => {
  try {
    // Check if the CSR detail exists
    const existingCsrDetail = await group.csrDetail.findUnique({
      where: { id },
    });

    if (!existingCsrDetail) {
      throw new Error(`CSR detail with ID ${id} not found`);
    }

    // Delete the old image file if a new image is provided
    if (data.image && existingCsrDetail.image) {
      const oldImagePath = path.join(process.cwd(), 'public', existingCsrDetail.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    return await group.csrDetail.update({
      where: { id },
      data: {
        title: data.title !== undefined ? data.title : existingCsrDetail.title,
        description: data.description !== undefined ? data.description : existingCsrDetail.description,
        image: data.image !== undefined ? data.image : existingCsrDetail.image,
        updatedBy: data.updatedBy,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Error updating CSR detail:', error);
    throw error;
  }
};

// Delete a CSR detail
export const deleteCsrDetail = async (id: number) => {
  try {
    // Check if the CSR detail exists
    const existingCsrDetail = await group.csrDetail.findUnique({
      where: { id },
    });

    if (!existingCsrDetail) {
      throw new Error(`CSR detail with ID ${id} not found`);
    }

    await group.csrDetail.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Error deleting CSR detail:', error);
    throw error;
  }
};