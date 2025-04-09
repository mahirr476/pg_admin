import { group } from '../../../config/db.config';

// Get the about record
export const getAbout = async () => {
    try {
        // Since we expect only one about record, get the first one
        const about = await group.about.findFirst({
            select: {
                id: true,
                title: true,
                description: true,
                image: true,
                mission: true,
                vision: true,
                commitedTitle: true,
                commitedDescrip: true,
                about: true,
                greenMission: true,
            }
        });
        return about;
    } catch (error) {
        console.error("Error fetching about:", error);
        throw new Error("Failed to fetch about information.");
    }
};