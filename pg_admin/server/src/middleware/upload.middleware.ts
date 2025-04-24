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
  CSR_IMAGES: 'public/uploads/group/csr',
  MILESTONE_IMAGES: 'public/uploads/group/milestone',
  BUSINESS_BANNER_IMAGES: 'public/uploads/group/business/banner',
  BUSINESS_IMAGES: 'public/uploads/group/business/image',
  CERTIFICATION_IMAGES: 'public/uploads/group/business/certification',
  COMPANIES_IMAGES: 'public/uploads/group/companies/images',
  MEDIA_GALLERY_IMAGES: 'public/uploads/group/media/gallery',
  MEDIA_NEWS_IMAGES: 'public/uploads/group/media/news',

  //For Parasole

  HERO_IMAGES: 'public/uploads/parasole/hero',
};

// Pre-configured upload middleware for CSR images
export const uploadCSRImage = createUploadMiddleware(UPLOAD_PATHS.CSR_IMAGES).single('image');

// Pre-configured upload middleware for Milestone images
export const uploadMilestoneImage = createUploadMiddleware(UPLOAD_PATHS.MILESTONE_IMAGES).single('image');

// Pre-configured upload middleware for Business banner images
export const uploadBusinessBanner = createUploadMiddleware(UPLOAD_PATHS.BUSINESS_BANNER_IMAGES).single('bannerImage');

// Pre-configured upload middleware for Business additional images
export const uploadBusinessImage = createUploadMiddleware(UPLOAD_PATHS.BUSINESS_IMAGES).single('image');

// Pre-configured upload middleware for Business certification images
export const uploadCertificationImage = createUploadMiddleware(UPLOAD_PATHS.CERTIFICATION_IMAGES).single('image');

// Pre-configured upload middleware for Companies images
export const uploadCompanyImage = createUploadMiddleware(UPLOAD_PATHS.COMPANIES_IMAGES).single('image');

// Pre-configured upload middleware for Media Gallery images
export const uploadMediaGalleryImage = createUploadMiddleware(UPLOAD_PATHS.MEDIA_GALLERY_IMAGES).single('image');

// Pre-configured upload middleware for Media News images
export const uploadMediaNewsImage = createUploadMiddleware(UPLOAD_PATHS.MEDIA_NEWS_IMAGES).single('image');

// New combined middleware for uploading both banner and image in one request
export const uploadBusinessFiles = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      // Choose directory based on field name
      if (file.fieldname === 'bannerImage') {
        cb(null, UPLOAD_PATHS.BUSINESS_BANNER_IMAGES);
      } else if (file.fieldname === 'image') {
        cb(null, UPLOAD_PATHS.BUSINESS_IMAGES);
      }
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const extension = path.extname(file.originalname);
      cb(null, uniqueSuffix + extension);
    }
  })
}).fields([
  { name: 'bannerImage', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]);

// Middleware for companies
export const uploadCompanyFiles = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, UPLOAD_PATHS.COMPANIES_IMAGES);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const extension = path.extname(file.originalname);
      cb(null, uniqueSuffix + extension);
    }
  }),
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).fields([
  { name: 'image', maxCount: 1 }
]);



//For Parasole

// Pre-configured upload middleware for Hero images
export const uploadHeroImage = createUploadMiddleware(UPLOAD_PATHS.HERO_IMAGES).single('image');