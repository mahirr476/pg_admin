import { group } from '../../config/db.config';


// Get the about record
export const getAbout = async () => {
    try {
        // Since we expect only one about record, get the first one
        const about = await group.about.findFirst();
        return about;
    } catch (error) {
        console.error("Error fetching about:", error);
        throw new Error("Failed to fetch about information.");
    }
};

// Create or update the about information
export const upsertAbout = async (data: any) => {
    try {
        // Check if about record already exists
        const existingAbout = await group.about.findFirst();
        
        if (existingAbout) {
            // Update existing record
            return await group.about.update({
                where: { id: existingAbout.id },
                data: {
                    title: data.title,
                    description: data.description,
                    image: data.image,
                    mission: data.mission,
                    vision: data.vision,
                    commitedTitle: data.commitedTitle, 
                    commitedDescrip: data.commitedDescrip, 
                    about: data.about,
                    greenMission: data.greenMission,
                    extraField: data.extraField,
                    updatedBy: data.updatedBy,
                },
            });
        } else {
            // Create new record
            return await group.about.create({
                data: {
                    title: data.title,
                    description: data.description,
                    image: data.image,
                    mission: data.mission,
                    vision: data.vision,
                    commitedTitle: data.commitedTitle,
                    commitedDescrip: data.commitedDescrip,
                    about: data.about,
                    greenMission: data.greenMission,
                    extraField: data.extraField || '',
                    createdBy: data.createdBy,
                    updatedBy: data.createdBy,
                },
            });
        }
    } catch (error) {
        console.error("Error saving about information:", error);
        throw new Error("Failed to save about information.");
    }
};