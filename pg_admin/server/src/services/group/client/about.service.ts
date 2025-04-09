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


// Get board information
export const getBoardContent = async () => {
    try {
        return await group.board.findFirst({
            select: {
                id: true,
                title: true,
                description: true
            }
        });
    } catch (error) {
        // console.error("Error fetching boards:", error);
        throw new Error("Failed to fetch board content.");
    }
};

// Get board of director information
export const getAllBoardDirectors = async () => {
    try {
      return await group.boardOfDirector.findMany({
        select: {
            id: true,
            orderIndex: true,
            name: true,
            designation: true,
            image: true,
            shortDescription: true,
        },
        orderBy: {
          orderIndex: 'asc'
        }
      });
    } catch (error) {
      console.error('Error fetching board directors:', error);
      throw new Error('Failed to fetch board directors');
    }
};