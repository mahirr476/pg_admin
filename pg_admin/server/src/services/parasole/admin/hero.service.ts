import { generateSlug } from '../../../util/slugGenerator';
import { parasole } from '../../../config/db.config';
import { CreateHeroDetailInput, CreateHeroInput, UpdateHeroDetailInput, UpdateHeroInput } from '../../../types/parasole/hero.types';

// Create a new hero
export const createHero = async (data: CreateHeroInput) => {
    // Check if index is already in use
    const existingHero = await parasole.hero.findFirst({
        where: { index: data.index }
    });
   
    if (existingHero) {
        throw new Error(`A hero with index ${data.index} already exists. Please use a unique index.`);
    }

    // Generate slug from title
    const slug = generateSlug(data.title);
    
    // Check if slug already exists
    const existingGallery = await parasole.hero.findUnique({
        where: { slug }
    });
    
    return await parasole.hero.create({
        data: {
            title: data.title,
            slug,
            description: data.description,
            image: data.image || '',
            index: data.index,
            createdBy: data.createdBy,
            updatedBy: "N/A"
        },
    });
};

// Get all heroes
export const getAllHeroes = async () => {
    return await parasole.hero.findMany({
        orderBy: { index: 'asc' }
    });
};

export const getHeroById = async (id: number) => {
    return await parasole.hero.findUnique({
        where: { id }
    });
};

export const updateHero = async (id: number, data: UpdateHeroInput) => {
    // Check if index is already in use by another hero
    if (data.index !== undefined) {
        const existingHero = await parasole.hero.findFirst({
            where: { 
                index: data.index,
                NOT: { id: id }
            }
        });
        
        if (existingHero) {
            throw new Error(`A hero with index ${data.index} already exists. Please use a unique index.`);
        }
    }
    
    return await parasole.hero.update({
        where: { id },
        data: {
            ...(data.title !== undefined && { title: data.title }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.image !== undefined && { image: data.image }),
            ...(data.index !== undefined && { index: data.index }),
            ...(data.status !== undefined && { status: data.status }),
            updatedBy: data.updatedBy,
            updatedAt: new Date()
        }
    });
};

export const deleteHero = async (id: number) => {
    return await parasole.hero.delete({
        where: { id }
    });
};




// ===========================  For Hero Detail Service Manage ===========================


// Create a new hero detail
export const createHeroDetail = async (data: CreateHeroDetailInput) => {
    // First check if the hero exists
    const heroExists = await parasole.hero.findUnique({
        where: { id: data.heroId }
    });
    
    if (!heroExists) {
        throw new Error(`Hero with ID ${data.heroId} does not exist.`);
    }
   
    // Generate slug from title
    const slug = generateSlug(data.title);
   
     // check if title already exists for this hero
    const existingHeroTitle = await parasole.heroDetail.findFirst({
        where: {
            heroId: data.heroId,
            slug: slug
        }
    });
    
    if (existingHeroTitle) {
        throw new Error(`A detail with this title already exists for this hero. Please use a different title.`);
    }
    
    // Check if index is already used for this hero
    const existingDetail = await parasole.heroDetail.findFirst({
        where: {
            heroId: data.heroId,
            index: data.index
        }
    });
   
    if (existingDetail) {
        throw new Error(`A detail with index ${data.index} already exists for this hero. Please use a unique index.`);
    }
   
    // Fix: Use heroDetail.create instead of hero.create
    return await parasole.heroDetail.create({
        data: {
            heroId: data.heroId,
            title: data.title,
            slug: slug,
            description: data.description,
            image: data.image || '',
            index: data.index,
            createdBy: data.createdBy,
            updatedBy: null
        },
    });
};

// Get all hero detail
export const getAllHeroDetails = async () => {
    return await parasole.heroDetail.findMany({
        orderBy: { index: 'asc' },
        include: {
            hero: {
                select: {
                    // id: true,
                    title: true
                }
            }
        }
    });
};

// Get hero detail by ID
export const getHeroDetailById = async (id: number) => {
    return await parasole.heroDetail.findUnique({
        where: { id },
        include: {
            hero: {
                select: {
                    // id: true,
                    title: true
                }
            }
        }
    });
};

export const updateHeroDetail = async (id: number, data: UpdateHeroDetailInput) => {

    // Get existing hero detail to check current values
    const existingDetail = await parasole.heroDetail.findUnique({
        where: { id }
    });

    if (!existingDetail) {
        throw new Error(`Hero detail with ID ${id} not found`);
    }

     // If heroId is changing, check if the new hero exists
     if (data.heroId !== undefined && data.heroId !== existingDetail.heroId) {
        const heroExists = await parasole.hero.findUnique({
            where: { id: data.heroId }
        });
        
        if (!heroExists) {
            throw new Error(`Hero with ID ${data.heroId} does not exist.`);
        }
    }

     // If index is changing, check if it's already in use for this hero
     if (data.index !== undefined) {
        const heroId = data.heroId !== undefined ? data.heroId : existingDetail.heroId;
        
        const existingWithIndex = await parasole.heroDetail.findFirst({
            where: {
                heroId: heroId,
                index: data.index,
                NOT: { id: id }
            }
        });
        
        if (existingWithIndex) {
            throw new Error(`A detail with index ${data.index} already exists for this hero. Please use a unique index.`);
        }
    }

     // If title is changing, update slug and check for duplicates
     let slug;
     if (data.title !== undefined && data.title !== existingDetail.title) {
         slug = generateSlug(data.title);
         
         // Check if slug is already in use
         const existingSlug = await parasole.heroDetail.findFirst({
             where: {
                 slug,
                 NOT: { id: id }
             }
         });
         
         if (existingSlug) {
             throw new Error(`A hero detail with slug "${slug}" already exists. Please use another title.`);
         }
     }
    
    // Update the hero detail
    return await parasole.heroDetail.update({
        where: { id },
        data: {
            ...(data.heroId !== undefined && { heroId: data.heroId }),
            ...(data.title !== undefined && { title: data.title }),
            ...(data.title !== undefined && { slug }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.image !== undefined && { image: data.image }),
            ...(data.index !== undefined && { index: data.index }),
            ...(data.status !== undefined && { status: data.status }),
            updatedBy: data.updatedBy,
            updatedAt: new Date()
        }
    });
};

export const deleteHeroDetail = async (id: number) => {
    return await parasole.heroDetail.delete({
        where: { id }
    });
};
