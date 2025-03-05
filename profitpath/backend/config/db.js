import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
console.log("✅ DATABASE_URL:", process.env.DATABASE_URL); // Debugging

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Railway/PostgreSQL
  },
});

// ✅ Initialize the database with required tables
(async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS amazon_products (
        id SERIAL PRIMARY KEY,
        asin VARCHAR(20) UNIQUE NOT NULL,
        title TEXT NOT NULL,
        price DECIMAL(10, 2),
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Database initialized: amazon_products table ready");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
  } finally {
    client.release();
  }
})();

export default pool; // ✅ Use `export default` for ES Modules
