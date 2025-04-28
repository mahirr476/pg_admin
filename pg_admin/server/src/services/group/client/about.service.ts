import { group } from '../../../config/db.config';

// Get the about record
export const getAbout = async () => {
  try {
      return await group.about.findFirst({
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
      throw new Error("Failed to fetch board content.");
  }
};


// Get board of director information
export const getAllBoardDirectors = async () => {
  try {
      return await group.boardOfDirector.findMany({
          where: {
              status: 'ACTIVE'
          },
          select: {
              id: true,
              orderIndex: true,
              name: true,
              designation: true,
              image: true,
              shortDescription: true,
              longDescription: true,
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


// Get all CSRs with their details
export const getAllCSRWithDetails = async () => {
  try {
      return await group.cSR.findMany({
          where: {
              status: 'ACTIVE',
          },
          select: {
              id: true,
              orderIndex: true,
              title: true,
              description: true,
              details: {  
                  where: {
                      status: 'ACTIVE'
                  },
                  select: {
                      id: true,
                      title: true,
                      description: true,
                      image: true
                  }
              }
          },
          orderBy: {
              orderIndex: 'asc',
          },
      });
  } catch (error) {
      console.error('Error fetching CSR items:', error);
      throw new Error('Failed to fetch CSR items');
  }
};
