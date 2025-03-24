import { CreateBusinessInput } from "../../types/business.types";
import { group } from '../../config/db.config';
import { generateSlug } from "../../util/slugGenerator";

// Create a new business
export const createBusiness = async (data: CreateBusinessInput) => {
    try {
      // Generate slug from title
      const slug = generateSlug(data.title);
      
      // Check if slug already exists
      const existingBusiness = await group.business.findUnique({
        where: { slug }
      });
      
      // If slug exists, throw an error instead of appending a number
      if (existingBusiness) {
        throw new Error(`A business with the title "${data.title}" already exists. Please use a different title.`);
      }
      
      return await group.business.create({
        data: {
          title: data.title,
          bannerImage: data.bannerImage,
          slug: slug,
          shortDes: data.shortDes,
          longDes: data.longDes,
          videoLink: data.videoLink,
          image: data.image,
          createdBy: data.createdBy,
          updatedBy: "N/A"
        }
      });
    } catch (error) {
      console.error('Error creating business:', error);
      throw error;
    }
};

// Get all businesses
export const getAllBusinesses = async () => {
    try {
      return await group.business.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('Error fetching businesses:', error);
      throw new Error('Failed to fetch businesses');
    }
};