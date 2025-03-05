const pool = require("../config/db");
const { fetchAmazonProduct } = require("../services/amazonService");

// ✅ Fetch a Single Amazon Product with Caching
const getAmazonProduct = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: "Query parameter is required" });

    console.log(`🔍 Checking cache for product: ${query}`);

    // ✅ 1. Check if product is cached in PostgreSQL
    const cachedResult = await pool.query("SELECT * FROM amazon_products WHERE title ILIKE $1 LIMIT 1", [`%${query}%`]);

    if (cachedResult.rows.length > 0) {
      console.log("✅ Returning cached product from PostgreSQL");
      return res.json(cachedResult.rows[0]); // Return cached data
    }

    console.log("⚡ Fetching product from RapidAPI...");
    const productData = await fetchAmazonProduct(query);

    if (!productData || !productData.asin) {
      console.log("❌ Product not found in API");
      return res.status(404).json({ error: "Product not found" });
    }

    console.log("✅ Returning new product from API:", productData.asin);
    return res.json(productData);
  } catch (error) {
    console.error("❌ Error fetching Amazon product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Fetch Multiple Products (Search Query)
const fetchInventory = async (req, res) => {
  try {
    const { query } = req.query; // Example: ?query=laptop
    if (!query) return res.status(400).json({ error: "Query parameter is required" });

    console.log(`🔍 Searching for products related to: ${query}`);

    // ✅ Check for Cached Products
    const cachedProducts = await pool.query(
      "SELECT * FROM amazon_products WHERE title ILIKE $1 LIMIT 10",
      [`%${query}%`]
    );

    if (cachedProducts.rows.length > 0) {
      console.log("✅ Returning cached search results from database");
      return res.json(cachedProducts.rows);
    }

    console.log("⚡ Fetching from RapidAPI...");
    const apiResponse = await axios.get("https://real-time-amazon-data.p.rapidapi.com/search", {
      params: { query },
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
      },
    });

    if (!apiResponse.data || !apiResponse.data.data || !apiResponse.data.data.products || apiResponse.data.data.products.length === 0) {
      console.log("❌ No products found in RapidAPI");
      return res.status(404).json({ error: "No products found" });
    }

    const products = apiResponse.data.data.products.map(product => ({
      asin: product.asin,
      title: product.product_title,
      price: product.product_price || "N/A",
      image_url: product.product_photo
    }));

    console.log(`✅ Storing ${products.length} new products in database...`);

    for (const product of products) {
      if (product.asin) {
        await pool.query(
          "INSERT INTO amazon_products (asin, title, price, image_url, created_at) VALUES ($1, $2, $3, $4, NOW()) ON CONFLICT (asin) DO NOTHING",
          [product.asin, product.title, product.price, product.image_url]
        );
      }
    }

    console.log("✅ Products successfully stored in database");
    return res.json(products);
  } catch (error) {
    console.error("❌ Error fetching inventory:", error);
    return res.status(500).json({ error: "Failed to fetch inventory data" });
  }
};

// ✅ Export All Functions
module.exports = { getAmazonProduct, fetchInventory };
