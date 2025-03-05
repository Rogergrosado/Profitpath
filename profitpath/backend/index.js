import dotenv from "dotenv";
dotenv.config();

console.log("✅ Environment Variables Loaded");
console.log("🔍 Loaded REDIS_URL:", process.env.REDIS_URL);

import express from "express";
import cors from "cors";
import pool from "./config/db.js";
import admin from "./config/firebaseAdmin.js";
import verifyToken from "./middleware/authMiddleware.js";
import redisClient from "./config/redis.js";

const app = express();
app.use(cors());
app.use(express.json());

console.log("✅ Middleware Applied");

// ✅ Import Routes
import inventoryRoutes from "./routes/inventoryRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// ✅ Mount Routes
app.use("/api/inventory", inventoryRoutes);
app.use("/api/auth", authRoutes);

console.log("✅ Routes Mounted");

// ✅ Database Test Route
app.get("/test-db", async (req, res) => {
  try {
    console.log("🔍 Checking database connection...");
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, timestamp: result.rows[0] });
  } catch (error) {
    console.error("❌ Database connection error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// ✅ Redis Test Route
app.get("/test-redis", async (req, res) => {
  try {
    console.log("🔍 Testing Redis connection...");
    await redisClient.set("test-key", "Redis is working!");
    const value = await redisClient.get("test-key");
    console.log("✅ Redis test successful:", value);
    res.json({ message: value });
  } catch (error) {
    console.error("❌ Redis error:", error);
    res.status(500).json({ error: "Redis connection failed" });
  }
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});

server.on("listening", () => console.log("🌍 Express is listening on", server.address()));
server.on("error", (err) => console.error("❌ Express Server Error:", err));

export { app, server }; // ✅ Export for Jest testing
