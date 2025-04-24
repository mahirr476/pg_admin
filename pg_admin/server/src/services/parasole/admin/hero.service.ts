import { parasole } from '../../../config/db.config';
import { CreateHeroInput, UpdateHeroInput } from '../../../types/parasole/hero.types';

// Create a new hero
export const createHero = async (data: CreateHeroInput) => {
    // Check if index is already in use
    const existingHero = await parasole.hero.findFirst({
        where: { index: data.index }
    });
   
    if (existingHero) {
        throw new Error(`A hero with index ${data.index} already exists. Please use a unique index.`);
    }
    
    return await parasole.hero.create({
        data: {
            title: data.title,
            description: data.description,
            image: data.image || '',
            index: data.index,
            createdBy: data.createdBy,
            updatedBy: "N/A"
        },
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

export const deleteHero = async (id: number) => {
    return await parasole.hero.delete({
        where: { id }
    });
};
