import fs from 'fs';
import path from 'path';
import multer from 'multer';

/**
 * Ensures that the upload directory exists
 * @param dirPath Path to the upload directory
 */
export const ensureUploadDirExists = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

/**
 * Creates a configured multer upload middleware
 * @param uploadPath Path where files should be stored
 * @returns Configured multer instance
 */
export const createUploadMiddleware = (uploadPath: string) => {
  // Ensure the directory exists
  ensureUploadDirExists(uploadPath);
 
  // Configure storage
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      // Create a more secure filename while preserving original extension
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const extension = path.extname(file.originalname).toLowerCase();
      const sanitizedName = file.originalname
        .replace(extension, '')
        .replace(/[^a-zA-Z0-9]/g, '-')
        .substring(0, 40); // Limit original name length
      
      cb(null, `${sanitizedName}-${uniqueSuffix}${extension}`);
    }
  });
 
  // Return configured upload
  return multer({ 
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB file size limit
    }
  });

};

// Constants for common upload paths
export const UPLOAD_PATHS = {

  //For Parasole

  HERO_IMAGES: 'public/uploads/parasole/hero',
};


//For Parasole

// Pre-configured upload middleware for Hero images
export const uploadHeroImage = createUploadMiddleware(UPLOAD_PATHS.HERO_IMAGES).array('image', 10);