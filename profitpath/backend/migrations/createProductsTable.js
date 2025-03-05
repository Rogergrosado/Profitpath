const pool = require("../config/db");

const createProductsTable = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      asin VARCHAR(20) UNIQUE NOT NULL,
      title TEXT NOT NULL,
      price DECIMAL(10,2),
      image_url TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  try {
    await pool.query(queryText);
    console.log("✅ Table 'products' created successfully.");
  } catch (error) {
    console.error("❌ Error creating 'products' table:", error.message);
  } finally {
    pool.end();
  }
};

createProductsTable();
// Compare this snippet from profitpath/backend/middleware/authMiddleware.js: