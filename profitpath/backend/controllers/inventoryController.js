import pool from "../config/db.js";
import redisClient from "../config/redis.js";
import axios from "axios";

// ✅ Fetch a single product
export async function getAmazonProduct(req, res) {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: "Query parameter is required" });

    console.log(`🔍 Searching for product: ${query}`);

    // ✅ Check Redis cache
    const cachedProduct = await redisClient.get(`product:${query}`);
    if (cachedProduct) {
      console.log("✅ Returning cached product");
      return res.json(JSON.parse(cachedProduct));
    }

    // ✅ Fetch from RapidAPI
    const response = await axios.get("https://real-time-amazon-data.p.rapidapi.com/search", {
      params: { query },
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
      },
    });

    if (!response.data?.data?.products) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = response.data.data.products[0]; // First product
    const productData = {
      asin: product.asin,
      title: product.product_title,
      price: parseFloat(product.product_price.replace(/[^0-9.]/g, "")) || 0,
      image_url: product.product_photo,
    };

    // ✅ Cache in Redis (1 hour)
    await redisClient.set(`product:${query}`, JSON.stringify(productData), { EX: 3600 });

    return res.json(productData);
  } catch (error) {
    console.error("❌ Error in getAmazonProduct:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// ✅ Fetch multiple products
export async function fetchInventory(req, res) {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: "Query parameter is required" });

    console.log(`🔍 Searching inventory: ${query}`);

    // ✅ Check Redis cache
    const cachedProducts = await redisClient.get(`search:${query}`);
    if (cachedProducts) {
      console.log("✅ Returning cached inventory");
      return res.json(JSON.parse(cachedProducts));
    }

    // ✅ Fetch from API
    const response = await axios.get("https://real-time-amazon-data.p.rapidapi.com/search", {
      params: { query },
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
      },
    });

    if (!response.data?.data?.products) {
      return res.status(404).json({ error: "No products found" });
    }

    const products = response.data.data.products.map((product) => ({
      asin: product.asin,
      title: product.product_title,
      price: parseFloat(product.product_price.replace(/[^0-9.]/g, "")) || null,
      image_url: product.product_photo,
    }));

    // ✅ Cache results in Redis (24h)
    await redisClient.set(`search:${query}`, JSON.stringify(products), { EX: 86400 });

    // ✅ Save to PostgreSQL
    for (const product of products) {
      await pool.query(
        `INSERT INTO amazon_products (asin, title, price, image_url, created_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (asin) DO NOTHING`,
        [product.asin, product.title, product.price, product.image_url]
      );
    }

    return res.json(products);
  } catch (error) {
    console.error("❌ Error fetching inventory:", error);
    return res.status(500).json({ error: "Failed to fetch inventory" });
  }
}
