import { generateSlug } from '../../../util/slugGenerator';
import { parasole } from '../../../config/db.config';
import { CreateBuyerDetailInput, CreateBuyerInput, UpdateBuyerDetailInput, UpdateBuyerInput } from '../../../types/parasole/buyer.types';

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



// ===========================  For Buyer Detail Service Manage ===========================



// Create a new buyer detail
export const createBuyerDetail = async (data: CreateBuyerDetailInput) => {
    // First check if the buyer exists
    const buyerExists = await parasole.buyer.findUnique({
        where: { id: data.buyerId }
    });
    
    if (!buyerExists) {
        throw new Error(`Buyer with ID ${data.buyerId} does not exist.`);
    }
   
    // Generate slug from title
    const slug = generateSlug(data.title);
   
    // Check if title already exists for this buyer
    const existingBuyerTitle = await parasole.buyerDetail.findFirst({
        where: {
            buyerId: data.buyerId,
            slug: slug
        }
    });
    
    if (existingBuyerTitle) {
        throw new Error(`A detail with this title already exists for this buyer. Please use a different title.`);
    }
    
    // Check if index is already used
    const existingDetail = await parasole.buyerDetail.findFirst({
        where: {
            index: data.index
        }
    });
   
    if (existingDetail) {
        throw new Error(`A buyer detail with index ${data.index} already exists. Please use a unique index.`);
    }
   
    // Create the buyer detail
    return await parasole.buyerDetail.create({
        data: {
            buyerId: data.buyerId,
            title: data.title,
            slug: slug,
            description: data.description,
            type: data.type,
            year: data.year,
            image: data.image || '',
            index: data.index,
            createdBy: data.createdBy,
            updatedBy: null
        },
    });
};

// Get all buyer details
export const getAllBuyerDetails = async () => {
    return await parasole.buyerDetail.findMany({
        orderBy: { index: 'asc' },
        include: {
            buyer: {
                select: {
                    title: true
                }
            }
        }
    });
};

// Get buyer detail by ID
export const getBuyerDetailById = async (id: number) => {
    return await parasole.buyerDetail.findUnique({
        where: { id },
        include: {
            buyer: {
                select: {
                    title: true
                }
            }
        }
    });
};

// Update buyer detail
export const updateBuyerDetail = async (id: number, data: UpdateBuyerDetailInput) => {
    // Get existing buyer detail to check current values
    const existingDetail = await parasole.buyerDetail.findUnique({
        where: { id }
    });

    if (!existingDetail) {
        throw new Error(`Buyer detail with ID ${id} not found`);
    }

    // If buyerId is changing, check if the new buyer exists
    if (data.buyerId !== undefined && data.buyerId !== existingDetail.buyerId) {
        const buyerExists = await parasole.buyer.findUnique({
            where: { id: data.buyerId }
        });
        
        if (!buyerExists) {
            throw new Error(`Buyer with ID ${data.buyerId} does not exist.`);
        }
    }

    // If index is changing, check if it's already in use
    if (data.index !== undefined && data.index !== existingDetail.index) {
        const existingWithIndex = await parasole.buyerDetail.findFirst({
            where: {
                index: data.index,
                NOT: { id: id }
            }
        });
        
        if (existingWithIndex) {
            throw new Error(`A buyer detail with index ${data.index} already exists. Please use a unique index.`);
        }
    }

    // If title is changing, update slug and check for duplicates
    let slug;
    if (data.title !== undefined && data.title !== existingDetail.title) {
        slug = generateSlug(data.title);
        
        // Check if slug is already in use
        const existingSlug = await parasole.buyerDetail.findFirst({
            where: {
                slug,
                NOT: { id: id }
            }
        });
        
        if (existingSlug) {
            throw new Error(`A buyer detail with slug "${slug}" already exists. Please use another title.`);
        }
    }
    
    // Update the buyer detail
    return await parasole.buyerDetail.update({
        where: { id },
        data: {
            ...(data.buyerId !== undefined && { buyerId: data.buyerId }),
            ...(data.title !== undefined && { title: data.title }),
            ...(data.title !== undefined && { slug }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.type !== undefined && { type: data.type }),
            ...(data.year !== undefined && { year: data.year }),
            ...(data.image !== undefined && { image: data.image }),
            ...(data.index !== undefined && { index: data.index }),
            ...(data.status !== undefined && { status: data.status }),
            updatedBy: data.updatedBy,
            updatedAt: new Date()
        }
    });
};

// Delete buyer detail
export const deleteBuyerDetail = async (id: number) => {
    return await parasole.buyerDetail.delete({
        where: { id }
    });
};