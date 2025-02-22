import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { authMiddleware } from './middleware/auth.middleware';
import authRoutes from "./routes/global/auth.routes";
import websiteRoutes from "./routes/global/website.routes";
import roleRoutes from "./routes/global/role.routes";

// Load environment variables from .env
dotenv.config();
// Add this temporarily to your index.ts to debug
console.log('Database URL:', process.env.DATABASE_URL);

// Validate required environment variables
if (!process.env.PORT || !process.env.JWT_SECRET) {
    console.error("Missing required environment variables");
    process.exit(1);
  }

const app = express();

// Middleware
// app.use(cors({
//     origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Your Next.js URL
//     credentials: true
//   }));
app.use(express.json());
app.use(cors());


//test
app.get("/test", (req, res) => {
    res.status(200).json({ status: "ok" });
});


// Routes for global module
app.use("/api/v1/user", authRoutes);
app.use('/api/v1/website', websiteRoutes);
app.use('/api/v1/role', authMiddleware, roleRoutes);

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

// Server initialization
const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});