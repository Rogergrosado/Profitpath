require("dotenv").config();
const axios = require("axios");
const pool = require("../config/db");

const fetchAmazonProduct = async (query) => {
    try {
        console.log(`🔍 Checking cache for product: ${query}`);

        // ✅ Check if product already exists in PostgreSQL
        const cachedProduct = await pool.query("SELECT * FROM amazon_products WHERE title ILIKE $1 LIMIT 1", [`%${query}%`]);

        if (cachedProduct.rows.length > 0) {
            console.log("✅ Returning cached product from PostgreSQL");
            return cachedProduct.rows[0];
        }

        console.log("⚡ Fetching product from RapidAPI...");

        const response = await axios.get("https://real-time-amazon-data.p.rapidapi.com/search", {
            params: { query },
            headers: {
                "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
            },
        });

        // ✅ Ensure API response has valid products
        if (!response.data || !response.data.data || !response.data.data.products || response.data.data.products.length === 0) {
            console.error("❌ RapidAPI returned no data");
            return null;
        }

        console.log("✅ RapidAPI Response:", response.data.data.products.length, "products found");

        // ✅ Extract the first valid product
        const product = response.data.data.products[0];

        if (!product.asin || !product.product_title || !product.product_price || !product.product_photo) {
            console.error("❌ Missing required fields in API response");
            return null;
        }

        // ✅ Extract and sanitize fields
        const asin = product.asin;
        const title = product.product_title;
        let price = product.product_price ? parseFloat(product.product_price.replace(/[$,]/g, '')) : null; // Convert price
        const image_url = product.product_photo;
        const category = "Amazon Search"; // Placeholder category

        console.log(`✅ Saving product to PostgreSQL: ${asin}`);

        // ✅ Save product to PostgreSQL
        const newProduct = await pool.query(
            `INSERT INTO amazon_products (asin, title, price, image_url, created_at)
             VALUES ($1, $2, $3, $4, NOW())
             ON CONFLICT (asin) DO NOTHING RETURNING *`,
            [asin, title, price, image_url]
        );

        return newProduct.rows[0] || { asin, title, price, image_url, category };

    } catch (error) {
        console.error("❌ Error fetching product:", error.message);
        return null;
    }
};

module.exports = { fetchAmazonProduct };
