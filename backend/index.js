const express = require("express");
const { Client } = require("pg"); // Import PostgreSQL client
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Import Amazon API Routes
const amazonRoutes = require("./routes/amazonRoutes");

app.use(express.json()); // Ensure JSON request support
app.use("/api/amazon", amazonRoutes); // Add Amazon API routes

// ✅ Configure PostgreSQL connection
const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Railway-hosted PostgreSQL
  },
});

// ✅ Connect to PostgreSQL
db.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ Database connection error:", err));

// ✅ Default route (API health check)
app.get("/", (req, res) => {
  res.send("ProfitPath Backend Running");
});

// ✅ Test database query route
app.get("/db-test", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.json({ message: "Database connection successful!", timestamp: result.rows[0].now });
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

// ✅ Start the server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

