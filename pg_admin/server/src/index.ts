import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/global/auth.routes";

// Load environment variables from .env
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1/user", authRoutes);

// Server initialization
const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});