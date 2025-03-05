import pool from "../config/db.js";  // ✅ Ensure `.js` extension
import axios from "axios";
import redis from "../config/redis.js"; // ✅ Ensure `.js` extension
import dotenv from "dotenv";

dotenv.config();

export async function fetchAmazonProduct(query) {
    try {
        console.log(`🔍 Checking cache for product: ${query}`);

        // ✅ Check if product is already in Redis cache
        const cachedProduct = await redis.get(`product:${query}`);
        if (cachedProduct) {
            console.log("✅ Returning cached product from Redis");
            return JSON.parse(cachedProduct);
        }

        // ✅ Check if product is in PostgreSQL
        const dbProduct = await pool.query("SELECT * FROM amazon_products WHERE title ILIKE $1 LIMIT 1", [`%${query}%`]);
        if (dbProduct.rows.length > 0) {
            console.log("✅ Returning cached product from PostgreSQL");
            return dbProduct.rows[0];
        }

        console.log("⚡ Fetching product from RapidAPI...");

        const response = await axios.get("https://real-time-amazon-data.p.rapidapi.com/search", {
            params: { query },
            headers: {
                "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
            },
        });

        if (!response.data?.data?.products || response.data.data.products.length === 0) {
            console.error("❌ RapidAPI returned no data");
            return null;
        }

        console.log("✅ RapidAPI Response:", response.data.data.products.length, "products found");

        const product = response.data.data.products[0];
        const asin = product.asin;
        const title = product.product_title;
        const price = parseFloat(product.product_price.replace("$", "")) || 0;
        const image_url = product.product_photo;
        const category = "Amazon Search";

        if (!asin || !title) {
            console.error("❌ Missing required fields in API response");
            return null;
        }

        console.log(`✅ Saving product to PostgreSQL & Redis: ${asin}`);

        // ✅ Save product to PostgreSQL
        await pool.query(
            `INSERT INTO amazon_products (asin, title, price, image_url, created_at)
             VALUES ($1, $2, $3, $4, NOW())
             ON CONFLICT (asin) DO NOTHING`,
            [asin, title, price, image_url]
        );

        // ✅ Store in Redis
        await redis.set(`product:${query}`, JSON.stringify({ asin, title, price, image_url, category }), "EX", 3600);

        return { asin, title, price, image_url, category };

    } catch (error) {
        console.error("❌ Error fetching product:", error.message);
        return null;
    }
}
