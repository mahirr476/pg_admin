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

// CORS configuration
app.use(cors({
  origin: '*', // Allow all origins for testing (change this in production!)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Ensure upload directories exist
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created upload directory:', uploadDir);
}

// Serve static files from public directory
// This will serve files at /uploads/... from the public/uploads/... directory
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

// Also serve uploads directly (without /public prefix) for backward compatibility
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

// Log static file requests for debugging
app.use((req, res, next) => {
  if (req.url.startsWith('/uploads') || req.url.startsWith('/public')) {
    console.log(`Static file request: ${req.method} ${req.url}`);
  }
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// Test endpoint to check if files exist
app.get("/api/v1/test/uploads", (req, res) => {
  const uploadsPath = path.join(__dirname, '..', 'public', 'uploads');
  try {
    const files = fs.readdirSync(uploadsPath);
    res.json({ 
      uploadsPath, 
      exists: fs.existsSync(uploadsPath),
      files: files.slice(0, 10) // Show first 10 files
    });
  } catch (error) {
    res.json({ 
      uploadsPath, 
      exists: false, 
      error: error.message 
    });
  }
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
  res.status(404).json({
    status: "error",
    message: "Route not found",
    path: req.path
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({
    status: "error",
    message: "Something went wrong on the server"
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
        console.log(`📁 Serving static files from: ${path.join(__dirname, '..', 'public')}`);
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