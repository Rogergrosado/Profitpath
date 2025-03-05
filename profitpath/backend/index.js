require("dotenv").config();
console.log("✅ Environment Variables Loaded");

const express = require("express");
console.log("✅ Express Loaded");

const cors = require("cors");
console.log("✅ CORS Middleware Loaded");

const app = express();
app.use(cors());
app.use(express.json());
console.log("✅ Middleware Applied");

const pool = require("./config/db");
console.log("✅ Database Config Loaded");

const verifyToken = require("./middleware/authMiddleware");
console.log("✅ Auth Middleware Loaded");

// ✅ Import Routes
const inventoryRoutes = require("./routes/inventoryRoutes");
console.log("✅ Inventory Routes Loaded");

const authRoutes = require("./routes/authRoutes");
console.log("✅ Auth Routes Loaded");

// ✅ Mount Routes
app.use("/api/inventory", inventoryRoutes);
app.use("/api/auth", authRoutes);
console.log("✅ Routes Mounted");

// ✅ Database Test Route
app.get("/test-db", async (req, res) => {
  try {
    console.log("🔍 Received /test-db request");
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Database connection error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// ✅ Protected Route
app.get("/protected", verifyToken, (req, res) => {
  console.log("🔍 Received /protected request");
  res.json({ message: "Access granted", user: req.user });
});

// ✅ Log All Registered Routes
console.log("🔹 inventoryRoutes:", inventoryRoutes);
console.log("🔹 authRoutes:", authRoutes);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// ✅ Log Server Events
server.on("listening", () => console.log("🌍 Express is listening on", server.address()));
server.on("error", (err) => console.error("❌ Express Server Error:", err));
