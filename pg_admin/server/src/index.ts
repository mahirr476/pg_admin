// src/index.ts
import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { authMiddleware } from './middleware/auth.middleware';
import authRoutes from "./routes/global/auth.routes";
import websiteRoutes from "./routes/global/website.routes";
import roleRoutes from "./routes/global/role.routes";
import permissionRoutes from "./routes/global/permission.routes";
import initializeDatabase from './config/init.db';

dotenv.config();

if (!process.env.PORT || !process.env.JWT_SECRET || !process.env.DATABASE_URL) {
  console.error("Missing required environment variables");
  process.exit(1);
}

const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

app.use("/api/v1/user", authRoutes);
app.use('/api/v1/website', websiteRoutes);
app.use('/api/v1/role', authMiddleware, roleRoutes);
app.use('/api/v1/permission', authMiddleware, permissionRoutes);

// Catch-all route for undefined endpoints
app.use((req, res) => {
    res.status(404).json({
      status: "error",
      message: "Route not found",
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