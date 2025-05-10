import { generateSlug } from '../../../util/slugGenerator';
import { parasole } from '../../../config/db.config';
import { CreateOperationDetailInput, CreateOperationInput, UpdateOperationDetailInput, UpdateOperationInput } from '../../../types/parasole/operation.types';

// Create operation
export const createOperation = async (data: CreateOperationInput) => {
    // Check if index is already in use
    const existingOperation = await parasole.operation.findFirst({
        where: { index: data.index },
    });

    if (existingOperation) {
        throw new Error(`An operation with index ${data.index} already exists. Please use a unique index.`);
    }

    // Generate slug from title
    const slug = generateSlug(data.title);

    // Check if slug already exists
    const existingOperationWithSlug = await parasole.operation.findUnique({
        where: { slug },
    });

    if (existingOperationWithSlug) {
        throw new Error(`An operation with slug "${slug}" already exists. Please use a unique title.`);
    }

    return await parasole.operation.create({
        data: {
            title: data.title,
            slug,
            description: data.description,
            images: data.images || [], // Default to empty array if no images are provided
            index: data.index,
            createdBy: data.createdBy,
            updatedBy: "N/A",
        },
    });
};

// Get all operations
export const getAllOperations = async () => {
    return await parasole.operation.findMany({
        orderBy: { index: 'asc' }
    });
};

// Get operation by ID
export const getOperationById = async (id: number) => {
    return await parasole.operation.findUnique({
        where: { id }
    });
};

// Update operation
export const updateOperation = async (id: number, data: UpdateOperationInput) => {
    // Check if index is already in use by another operation
    if (data.index !== undefined) {
        const existingOperation = await parasole.operation.findFirst({
            where: {
                index: data.index,
                NOT: { id: id }
            }
        });

        if (existingOperation) {
            throw new Error(`An operation with index ${data.index} already exists. Please use a unique index.`);
        }
    }

    // Check if title is being updated and generate new slug if needed
    let slugUpdate = {};
    if (data.title !== undefined) {
        const slug = generateSlug(data.title);

        // Check if new slug would conflict with existing ones (except this record)
        const existingWithSlug = await parasole.operation.findFirst({
            where: {
                slug,
                NOT: { id }
            }
        });

        if (existingWithSlug) {
            throw new Error(`An operation with slug "${slug}" already exists. Please use a unique title.`);
        }

        slugUpdate = { slug };
    }

    return await parasole.operation.update({
        where: { id },
        data: {
            ...(data.title !== undefined && { title: data.title }),
            ...slugUpdate,
            ...(data.description !== undefined && { description: data.description }),
            ...(data.images !== undefined && { images: data.images }),
            ...(data.index !== undefined && { index: data.index }),
            ...(data.status !== undefined && { status: data.status }),
            updatedBy: data.updatedBy,
            updatedAt: new Date()
        }
    });
};

// Delete operation
export const deleteOperation = async (id: number) => {
    return await parasole.operation.delete({
        where: { id }
    });
};



// ===========================  For Operation Detail Service Manage ===========================


// Create a new operation detail
export const createOperationDetail = async (data: CreateOperationDetailInput) => {
    // First check if the operation exists
    const operationExists = await parasole.operation.findUnique({
        where: { id: data.operationId }
    });
    
    if (!operationExists) {
        throw new Error(`Operation with ID ${data.operationId} does not exist.`);
    }
   
    // Generate slug from title
    const slug = generateSlug(data.title);
   
    // check if title already exists for this operation
    const existingOperationTitle = await parasole.operationDetail.findFirst({
        where: {
            operationId: data.operationId,
            slug: slug
        }
    });
    
    if (existingOperationTitle) {
        throw new Error(`A detail with this title already exists for this operation. Please use a different title.`);
    }
    
    // Check if index is already used
    const existingDetail = await parasole.operationDetail.findFirst({
        where: {
            index: data.index
        }
    });
   
    if (existingDetail) {
        throw new Error(`An operation detail with index ${data.index} already exists. Please use a unique index.`);
    }
   
    // Create the operation detail
    return await parasole.operationDetail.create({
        data: {
            operationId: data.operationId,
            title: data.title,
            slug: slug,
            description: data.description,
            index: data.index,
            createdBy: data.createdBy,
            updatedBy: null
        },
    });
};

// Get all operation details
export const getAllOperationDetails = async () => {
    return await parasole.operationDetail.findMany({
        orderBy: { index: 'asc' },
        include: {
            operation: {
                select: {
                    title: true
                }
            }
        }
    });
};

// Get operation detail by ID
export const getOperationDetailById = async (id: number) => {
    return await parasole.operationDetail.findUnique({
        where: { id },
        include: {
            operation: {
                select: {
                    title: true
                }
            }
        }
    });
};

// Update operation detail
export const updateOperationDetail = async (id: number, data: UpdateOperationDetailInput) => {
    // Get existing operation detail to check current values
    const existingDetail = await parasole.operationDetail.findUnique({
        where: { id }
    });

    if (!existingDetail) {
        throw new Error(`Operation detail with ID ${id} not found`);
    }

    // If operationId is changing, check if the new operation exists
    if (data.operationId !== undefined && data.operationId !== existingDetail.operationId) {
        const operationExists = await parasole.operation.findUnique({
            where: { id: data.operationId }
        });
        
        if (!operationExists) {
            throw new Error(`Operation with ID ${data.operationId} does not exist.`);
        }
    }

    // If index is changing, check if it's already in use
    if (data.index !== undefined && data.index !== existingDetail.index) {
        const existingWithIndex = await parasole.operationDetail.findFirst({
            where: {
                index: data.index,
                NOT: { id: id }
            }
        });
        
        if (existingWithIndex) {
            throw new Error(`An operation detail with index ${data.index} already exists. Please use a unique index.`);
        }
    }

    // If title is changing, update slug and check for duplicates
    let slug;
    if (data.title !== undefined && data.title !== existingDetail.title) {
        slug = generateSlug(data.title);
        
        // Check if slug is already in use
        const existingSlug = await parasole.operationDetail.findFirst({
            where: {
                slug,
                NOT: { id: id }
            }
        });
        
        if (existingSlug) {
            throw new Error(`An operation detail with slug "${slug}" already exists. Please use another title.`);
        }
    }
    
    // Update the operation detail
    return await parasole.operationDetail.update({
        where: { id },
        data: {
            ...(data.operationId !== undefined && { operationId: data.operationId }),
            ...(data.title !== undefined && { title: data.title }),
            ...(data.title !== undefined && { slug }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.index !== undefined && { index: data.index }),
            ...(data.status !== undefined && { status: data.status }),
            updatedBy: data.updatedBy,
            updatedAt: new Date()
        }
    });
};

// Delete operation detail
export const deleteOperationDetail = async (id: number) => {
    return await parasole.operationDetail.delete({
        where: { id }
    });
};