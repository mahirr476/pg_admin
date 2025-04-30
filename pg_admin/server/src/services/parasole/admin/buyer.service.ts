import { generateSlug } from '../../../util/slugGenerator';
import { parasole } from '../../../config/db.config';
import { CreateBuyerInput, UpdateBuyerInput } from '../../../types/parasole/buyer.types';

// Create buyer
export const createBuyer = async (data: CreateBuyerInput) => {
    // Check if index is already in use
    const existingBuyer = await parasole.buyer.findFirst({
        where: { index: data.index },
    });
    if (existingBuyer) {
        throw new Error(`A buyer with index ${data.index} already exists. Please use a unique index.`);
    }

    // Generate slug from title
    const slug = generateSlug(data.title);

    // Check if slug already exists
    const existingBuyerWithSlug = await parasole.buyer.findUnique({
        where: { slug },
    });
    if (existingBuyerWithSlug) {
        throw new Error(`A buyer with slug "${slug}" already exists. Please use a unique title.`);
    }

    return await parasole.buyer.create({
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

// Get all buyers
export const getAllBuyers = async () => {
    return await parasole.buyer.findMany({
        orderBy: { index: 'asc' }
    });
};

// Get buyer by ID
export const getBuyerById = async (id: number) => {
    return await parasole.buyer.findUnique({
        where: { id }
    });
};

// Update buyer
export const updateBuyer = async (id: number, data: UpdateBuyerInput) => {
    // Check if index is already in use by another buyer
    if (data.index !== undefined) {
        const existingBuyer = await parasole.buyer.findFirst({
            where: {
                index: data.index,
                NOT: { id: id }
            }
        });
        if (existingBuyer) {
            throw new Error(`A buyer with index ${data.index} already exists. Please use a unique index.`);
        }
    }

    // Check if title is being updated and generate new slug if needed
    let slugUpdate = {};
    if (data.title !== undefined) {
        const slug = generateSlug(data.title);
        
        // Check if new slug would conflict with existing ones (except this record)
        const existingWithSlug = await parasole.buyer.findFirst({
            where: {
                slug,
                NOT: { id }
            }
        });
        if (existingWithSlug) {
            throw new Error(`A buyer with slug "${slug}" already exists. Please use a unique title.`);
        }
        slugUpdate = { slug };
    }

    return await parasole.buyer.update({
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

// Delete buyer
export const deleteBuyer = async (id: number) => {
    return await parasole.buyer.delete({
        where: { id }
    });
};