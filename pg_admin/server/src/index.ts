// // src/index.ts
// import express from "express";
// import * as dotenv from "dotenv";
// import cors from "cors";
// import { authMiddleware } from './middleware/auth.middleware';
// import authRoutes from "./routes/global/auth.routes";
// import websiteRoutes from "./routes/global/website.routes";
// import roleRoutes from "./routes/global/role.routes";
// import permissionRoutes from "./routes/global/permission.routes";
// import rolePermissionRoutes from "./routes/global/role_permission.routes";
// import auditRoutes from "./routes/global/audit.routes";
// import groupAllRoutes from './routes/group/group-all.routes';
// import parasoleAllRoutes from './routes/parasole/admin/all.routes';
// import clientAllRoutes from './routes/group/client/client-all.routes';
// import parasoleSitesRoutes from './routes/parasole/client/all.routes';
// import initializeDatabase from './config/init.db';
// import path from 'path';

// dotenv.config();

// if (!process.env.PORT || !process.env.JWT_SECRET || !process.env.DATABASE_URL_GLOBAL || !process.env.DATABASE_URL_GROUP || !process.env.DATABASE_URL_PARASOLE) {
//   console.error("Missing required environment variables");
//   process.exit(1);
// }

// const app = express();
// // FIXED CORS configuration
// app.use(cors({
//   origin: '*', // Allow all origins for testing (change this in production!)
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
// // app.use(cors());
// app.use(express.json());

// // app.use('/uploads', express.static(path.join('D:', 'Devlopment', 'pg_admin', 'pg_admin', 'server', 'public', 'uploads')));
// app.use('/uploads', express.static(path.join('/app', 'public', 'uploads')));
// // app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// // Health check endpoint
// app.get("/health", (req, res) => {
//   res.status(200).json({ status: "healthy" });
// });

// //For global admin panel
// app.use("/api/v1/user", authRoutes);
// app.use('/api/v1/website', websiteRoutes);
// app.use('/api/v1/role', roleRoutes);
// app.use('/api/v1/permission', authMiddleware, permissionRoutes);
// app.use('/api/v1/role_permission', rolePermissionRoutes);
// app.use('/api/v1/audit-logs', auditRoutes);

// //For group admin panel
// app.use("/api/v1/group", groupAllRoutes);

// //For parasole admin panel
// app.use("/api/v1/parasole", parasoleAllRoutes);

// // For client/website API
// app.use("/api/v1/pg", clientAllRoutes);

// // For parasole website API
// app.use("/api/v1/site/parasole", parasoleSitesRoutes);


// // Catch-all route for undefined endpoints
// app.use((req, res) => {
//     res.status(404).json({
//       status: "error",
//       message: "Route not found",
//     });
//   });


// // Error handling middleware
// app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
//     console.error(err);
//     res.status(500).json({
//       status: "error",
//       message: "Something went wrong on the server"
//     });
//   });

//   const PORT = process.env.PORT || 7000;

// let retries = 5;
// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// async function startServer() {
//   while (retries > 0) {
//     try {
//       await initializeDatabase();
      
//       app.listen(PORT, () => {
//         console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
//       });
      
//       break;
//     } catch (err) {
//       console.log(`Failed to start server, retrying... (${retries} attempts left)`);
//       retries--;
//       await delay(5000);
//     }
//   }
  
//   if (retries === 0) {
//     console.error('Failed to start server after multiple retries');
//     process.exit(1);
//   }
// }

// startServer();







// src/index.ts
// import express from "express";
// import * as dotenv from "dotenv";
// import cors from "cors";
// import { authMiddleware } from './middleware/auth.middleware';
// import authRoutes from "./routes/global/auth.routes";
// import websiteRoutes from "./routes/global/website.routes";
// import roleRoutes from "./routes/global/role.routes";
// import permissionRoutes from "./routes/global/permission.routes";
// import rolePermissionRoutes from "./routes/global/role_permission.routes";
// import auditRoutes from "./routes/global/audit.routes";
// import groupAllRoutes from './routes/group/group-all.routes';
// import parasoleAllRoutes from './routes/parasole/admin/all.routes';
// import clientAllRoutes from './routes/group/client/client-all.routes';
// import parasoleSitesRoutes from './routes/parasole/client/all.routes';
// import initializeDatabase from './config/init.db';
// import path from 'path';

// dotenv.config();

// if (!process.env.PORT || !process.env.JWT_SECRET || !process.env.DATABASE_URL_GLOBAL || !process.env.DATABASE_URL_GROUP || !process.env.DATABASE_URL_PARASOLE) {
//   console.error("Missing required environment variables");
//   process.exit(1);
// }

// const app = express();

// // FIXED CORS configuration - only call it once!
// app.use(cors({
//   origin: '*', // Allow all origins for testing (change this in production!)
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// app.use(express.json());

// // Serve static files
// // app.use('/uploads', express.static(path.join('/app', 'public', 'uploads')));
// app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// // Health check endpoint
// app.get("/health", (req, res) => {
//   res.status(200).json({ status: "healthy" });
// });

// // For global admin panel
// app.use("/api/v1/user", authRoutes);
// app.use('/api/v1/website', websiteRoutes);
// app.use('/api/v1/role', roleRoutes);
// app.use('/api/v1/permission', authMiddleware, permissionRoutes);
// app.use('/api/v1/role_permission', rolePermissionRoutes);
// app.use('/api/v1/audit-logs', auditRoutes);

// // For group admin panel
// app.use("/api/v1/group", groupAllRoutes);

// // For parasole admin panel
// app.use("/api/v1/parasole", parasoleAllRoutes);

// // For client/website API
// app.use("/api/v1/pg", clientAllRoutes);

// // For parasole website API
// app.use("/api/v1/site/parasole", parasoleSitesRoutes);

// // Catch-all route for undefined endpoints
// app.use((req, res) => {
//   res.status(404).json({
//     status: "error",
//     message: "Route not found",
//   });
// });

// // Error handling middleware
// app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
//   console.error(err);
//   res.status(500).json({
//     status: "error",
//     message: "Something went wrong on the server"
//   });
// });

// const PORT = process.env.PORT || 7000;
// let retries = 5;
// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// async function startServer() {
//   while (retries > 0) {
//     try {
//       await initializeDatabase();
      
//       app.listen(PORT, () => {
//         console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
//         // console.log(`✅ CORS enabled for all origins (*)`);
//       });
      
//       break;
//     } catch (err) {
//       console.log(`Failed to start server, retrying... (${retries} attempts left)`);
//       retries--;
//       await delay(5000);
//     }
//   }
  
//   if (retries === 0) {
//     console.error('Failed to start server after multiple retries');
//     process.exit(1);
//   }
// }

// startServer();










// src/index.ts
// import express from "express";
// import * as dotenv from "dotenv";
// import cors from "cors";
// import { authMiddleware } from './middleware/auth.middleware';
// import authRoutes from "./routes/global/auth.routes";
// import websiteRoutes from "./routes/global/website.routes";
// import roleRoutes from "./routes/global/role.routes";
// import permissionRoutes from "./routes/global/permission.routes";
// import rolePermissionRoutes from "./routes/global/role_permission.routes";
// import auditRoutes from "./routes/global/audit.routes";
// import groupAllRoutes from './routes/group/group-all.routes';
// import parasoleAllRoutes from './routes/parasole/admin/all.routes';
// import clientAllRoutes from './routes/group/client/client-all.routes';
// import parasoleSitesRoutes from './routes/parasole/client/all.routes';
// import initializeDatabase from './config/init.db';
// import path from 'path';
// import fs from 'fs';

// dotenv.config();

// if (!process.env.PORT || !process.env.JWT_SECRET || !process.env.DATABASE_URL_GLOBAL || !process.env.DATABASE_URL_GROUP || !process.env.DATABASE_URL_PARASOLE) {
//   console.error("Missing required environment variables");
//   process.exit(1);
// }

// const app = express();

// // CORS configuration
// app.use(cors({
//   origin: '*', // Allow all origins for testing (change this in production!)
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// app.use(express.json());

// // Ensure upload directories exist
// const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
//   console.log('Created upload directory:', uploadDir);
// }

// // Serve static files from public directory
// // This will serve files at /uploads/... from the public/uploads/... directory
// app.use('/public', express.static(path.join(__dirname, '..', 'public')));

// // Also serve uploads directly (without /public prefix) for backward compatibility
// app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

// // Log static file requests for debugging
// app.use((req, res, next) => {
//   if (req.url.startsWith('/uploads') || req.url.startsWith('/public')) {
//     console.log(`Static file request: ${req.method} ${req.url}`);
//   }
//   next();
// });

// // Health check endpoint
// app.get("/health", (req, res) => {
//   res.status(200).json({ status: "healthy" });
// });

// // Test endpoint to check if files exist
// app.get("/api/v1/test/uploads", (req, res) => {
//   const uploadsPath = path.join(__dirname, '..', 'public', 'uploads');
//   try {
//     const files = fs.readdirSync(uploadsPath);
//     res.json({ 
//       uploadsPath, 
//       exists: fs.existsSync(uploadsPath),
//       files: files.slice(0, 10) // Show first 10 files
//     });
//   } catch (error) {
//     res.json({ 
//       uploadsPath, 
//       exists: false, 
//       error: (error as any).message 
//     });
//   }
// });

// // For global admin panel
// app.use("/api/v1/user", authRoutes);
// app.use('/api/v1/website', websiteRoutes);
// app.use('/api/v1/role', roleRoutes);
// app.use('/api/v1/permission', authMiddleware, permissionRoutes);
// app.use('/api/v1/role_permission', rolePermissionRoutes);
// app.use('/api/v1/audit-logs', auditRoutes);

// // For group admin panel
// app.use("/api/v1/group", groupAllRoutes);

// // For parasole admin panel
// app.use("/api/v1/parasole", parasoleAllRoutes);

// // For client/website API
// app.use("/api/v1/pg", clientAllRoutes);

// // For parasole website API
// app.use("/api/v1/site/parasole", parasoleSitesRoutes);

// // Catch-all route for undefined endpoints
// app.use((req, res) => {
//   res.status(404).json({
//     status: "error",
//     message: "Route not found",
//     path: req.path
//   });
// });

// // Error handling middleware
// app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
//   console.error(err);
//   res.status(500).json({
//     status: "error",
//     message: "Something went wrong on the server"
//   });
// });

// const PORT = process.env.PORT || 7000;
// let retries = 5;
// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// async function startServer() {
//   while (retries > 0) {
//     try {
//       await initializeDatabase();
     
//       app.listen(PORT, () => {
//         console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
//         console.log(`📁 Serving static files from: ${path.join(__dirname, '..', 'public')}`);
//       });
     
//       break;
//     } catch (err) {
//       console.log(`Failed to start server, retrying... (${retries} attempts left)`);
//       retries--;
//       await delay(5000);
//     }
//   }
 
//   if (retries === 0) {
//     console.error('Failed to start server after multiple retries');
//     process.exit(1);
//   }
// }

// startServer();



// src/index.ts
import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { authMiddleware } from './middleware/auth.middleware';
import authRoutes from "./routes/global/auth.routes";
import websiteRoutes from "./routes/global/website.routes";
import roleRoutes from "./routes/global/role.routes";
import permissionRoutes from "./routes/global/permission.routes";
import rolePermissionRoutes from "./routes/global/role_permission.routes";
import auditRoutes from "./routes/global/audit.routes";
import groupAllRoutes from './routes/group/group-all.routes';
import parasoleAllRoutes from './routes/parasole/admin/all.routes';
import clientAllRoutes from './routes/group/client/client-all.routes';
import parasoleSitesRoutes from './routes/parasole/client/all.routes';
import initializeDatabase from './config/init.db';
import path from 'path';
import fs from 'fs';

dotenv.config();

if (!process.env.PORT || !process.env.JWT_SECRET || !process.env.DATABASE_URL_GLOBAL || !process.env.DATABASE_URL_GROUP || !process.env.DATABASE_URL_PARASOLE) {
  console.error("Missing required environment variables");
  process.exit(1);
}

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: '*', // Allow all origins for testing (change this in production!)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'Content-Type']
}));

// Handle preflight requests globally
app.options('*', cors());

app.use(express.json());

// CORRECTED: Determine the actual file paths based on your working directory
const publicDir = path.join(process.cwd(), 'public');
const uploadDir = path.join(process.cwd(), 'public', 'uploads');

console.log('🔍 File Path Debug:');
console.log('Current working directory:', process.cwd());
console.log('__dirname:', __dirname);
console.log('Calculated public dir:', publicDir);
console.log('Calculated upload dir:', uploadDir);
console.log('Public dir exists:', fs.existsSync(publicDir));
console.log('Upload dir exists:', fs.existsSync(uploadDir));

// Create upload directories if they don't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created upload directory:', uploadDir);
}

// Enhanced CORS specifically for static files - BEFORE static file serving
app.use(['/uploads', '/public'], (req, res, next) => {
  // Set comprehensive CORS headers for static files
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
  res.header('Cache-Control', 'public, max-age=31536000');
  
  // Handle preflight requests for static files
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  next();
});

// CORRECTED: Serve static files from the correct path
app.use('/public', express.static(publicDir, {
  setHeaders: (res, path) => {
    // Additional headers for static files
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Access-Control-Allow-Origin', '*');
    console.log(`📁 Serving static file: ${path}`);
  }
}));

// Also serve uploads directly (without /public prefix) for backward compatibility
app.use('/uploads', express.static(uploadDir, {
  setHeaders: (res, path) => {
    // Additional headers for static files
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Access-Control-Allow-Origin', '*');
    console.log(`📁 Serving upload file: ${path}`);
  }
}));

// Log static file requests for debugging
app.use((req, res, next) => {
  if (req.url.startsWith('/uploads') || req.url.startsWith('/public')) {
    console.log(`📁 Static file request: ${req.method} ${req.url} from ${req.get('origin') || 'unknown'}`);
    console.log(`📂 Looking for file in: ${req.url.startsWith('/public') ? publicDir : uploadDir}`);
  }
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    paths: {
      cwd: process.cwd(),
      __dirname,
      publicDir,
      uploadDir,
      publicExists: fs.existsSync(publicDir),
      uploadExists: fs.existsSync(uploadDir)
    }
  });
});

// Enhanced test endpoint to check if files exist
app.get("/api/v1/test/uploads", (req, res) => {
  // Try multiple possible paths
  const possiblePaths = [
    path.join(process.cwd(), 'public', 'uploads'),
    path.join(__dirname, '..', 'public', 'uploads'),
    path.join(__dirname, 'public', 'uploads'),
    '/app/public/uploads',
    '/app/pg_admin/server/public/uploads'
  ];

  const results = possiblePaths.map(testPath => ({
    path: testPath,
    exists: fs.existsSync(testPath),
    files: fs.existsSync(testPath) ? fs.readdirSync(testPath).slice(0, 5) : []
  }));

  // Find the correct path
  const correctPath = results.find(r => r.exists && r.files.length > 0);
  
  if (correctPath) {
    // Try to find hero images specifically
    const heroPath = path.join(correctPath.path, 'group', 'hero');
    let heroFiles: string[] = [];
    if (fs.existsSync(heroPath)) {
      heroFiles = fs.readdirSync(heroPath).slice(0, 5);
    }

    res.json({ 
      success: true,
      correctPath: correctPath.path,
      allPathsChecked: results,
      heroImages: {
        path: heroPath,
        exists: fs.existsSync(heroPath),
        files: heroFiles
      },
      testUrls: {
        publicRoute: `${req.protocol}://${req.get('host')}/public/uploads/`,
        uploadsRoute: `${req.protocol}://${req.get('host')}/uploads/`,
        sampleHeroImage: heroFiles.length > 0 ? 
          `${req.protocol}://${req.get('host')}/public/uploads/group/hero/${heroFiles[0]}` : 
          'No hero images found'
      },
      serverConfig: {
        currentPublicDir: publicDir,
        currentUploadDir: uploadDir,
        publicDirExists: fs.existsSync(publicDir),
        uploadDirExists: fs.existsSync(uploadDir)
      }
    });
  } else {
    res.json({
      success: false,
      message: "No valid upload directory found",
      allPathsChecked: results,
      serverConfig: {
        currentPublicDir: publicDir,
        currentUploadDir: uploadDir,
        publicDirExists: fs.existsSync(publicDir),
        uploadDirExists: fs.existsSync(uploadDir)
      }
    });
  }
});

// Test endpoint for specific image
app.get("/api/v1/test/image/:type/:category/:filename", (req, res) => {
  const { type, category, filename } = req.params;
  
  // Try multiple possible paths
  const possibleImagePaths = [
    path.join(process.cwd(), 'public', 'uploads', type, category, filename),
    path.join(__dirname, '..', 'public', 'uploads', type, category, filename),
    path.join(__dirname, 'public', 'uploads', type, category, filename),
    path.join('/app/public/uploads', type, category, filename),
    path.join('/app/pg_admin/server/public/uploads', type, category, filename)
  ];

  console.log(`🖼️ Testing image paths for: ${filename}`);
  
  for (const imagePath of possibleImagePaths) {
    console.log(`   Checking: ${imagePath} - ${fs.existsSync(imagePath) ? 'EXISTS' : 'NOT FOUND'}`);
    
    if (fs.existsSync(imagePath)) {
      res.json({
        success: true,
        message: "Image exists",
        foundAt: imagePath,
        publicUrl: `/public/uploads/${type}/${category}/${filename}`,
        uploadsUrl: `/uploads/${type}/${category}/${filename}`,
        fullUrl: `${req.protocol}://${req.get('host')}/public/uploads/${type}/${category}/${filename}`
      });
      return;
    }
  }
  
  res.status(404).json({
    success: false,
    message: "Image not found",
    searchedPaths: possibleImagePaths
  });
});

// For global admin panel
app.use("/api/v1/user", authRoutes);
app.use('/api/v1/website', websiteRoutes);
app.use('/api/v1/role', roleRoutes);
app.use('/api/v1/permission', authMiddleware, permissionRoutes);
app.use('/api/v1/role_permission', rolePermissionRoutes);
app.use('/api/v1/audit-logs', auditRoutes);

// For group admin panel
app.use("/api/v1/group", groupAllRoutes);

// For parasole admin panel
app.use("/api/v1/parasole", parasoleAllRoutes);

// For client/website API
app.use("/api/v1/pg", clientAllRoutes);

// For parasole website API
app.use("/api/v1/site/parasole", parasoleSitesRoutes);

// Catch-all route for undefined endpoints
app.use((req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    status: "error",
    message: "Route not found",
    path: req.path,
    method: req.method
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('💥 Server Error:', err);
  res.status(500).json({
    status: "error",
    message: "Something went wrong on the server",
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

const PORT = process.env.PORT || 7000;
let retries = 5;
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function startServer() {
  while (retries > 0) {
    try {
      await initializeDatabase();
     
      app.listen(PORT, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
        console.log(`📁 Serving static files from: ${publicDir}`);
        console.log(`🖼️ Static routes available:`);
        console.log(`   - /public/* -> ${publicDir}`);
        console.log(`   - /uploads/* -> ${uploadDir}`);
        console.log(`🧪 Test endpoints:`);
        console.log(`   - GET /api/v1/test/uploads`);
        console.log(`   - GET /health`);
        console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      });
     
      break;
    } catch (err) {
      console.log(`Failed to start server, retrying... (${retries} attempts left)`);
      retries--;
      await delay(5000);
    }
  }
 
  if (retries === 0) {
    console.error('Failed to start server after multiple retries');
    process.exit(1);
  }
}

startServer();