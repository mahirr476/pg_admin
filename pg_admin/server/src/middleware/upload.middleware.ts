// src/middleware/upload.middleware.ts
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
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const extension = path.extname(file.originalname);
      cb(null, uniqueSuffix + extension);
    }
  });

  // Return configured upload
  return multer({ storage: storage });
};

// Constants for common upload paths
export const UPLOAD_PATHS = {
  CSR_IMAGES: 'public/uploads/group/csr'
};