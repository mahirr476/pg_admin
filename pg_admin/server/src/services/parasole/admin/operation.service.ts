import { generateSlug } from '../../../util/slugGenerator';
import { parasole } from '../../../config/db.config';
import { CreateOperationInput, UpdateOperationInput } from '../../../types/parasole/operation.types';

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