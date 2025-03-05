require("dotenv").config();
const axios = require("axios");
const pool = require("../config/db");

const updateInventory = async () => {
    try {
        console.log("🔄 Running inventory update...");

        // ✅ Fetch products older than 24 hours
        const outdatedProducts = await pool.query(
            "SELECT * FROM amazon_products WHERE created_at < NOW() - INTERVAL '24 hours' LIMIT 10"
        );

        if (outdatedProducts.rows.length === 0) {
            console.log("✅ No outdated products found.");
            return;
        }

        for (const product of outdatedProducts.rows) {
            console.log(`🔄 Updating product: ${product.asin}`);

            // ✅ Fetch latest data from RapidAPI
            const response = await axios.get("https://real-time-amazon-data.p.rapidapi.com/search", {
                params: { query: product.title },
                headers: {
                    "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                    "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
                },
            });

            if (!response.data || !response.data.data || !response.data.data.products || response.data.data.products.length === 0) {
                console.log(`❌ No new data found for ${product.asin}`);
                continue;
            }

            const latestProduct = response.data.data.products[0];

            // ✅ Update the product in the database
            await pool.query(
                `UPDATE amazon_products 
                SET price = $1, image_url = $2, created_at = NOW()
                WHERE asin = $3`,
                [latestProduct.product_price.replace("$", ""), latestProduct.product_photo, product.asin]
            );

            console.log(`✅ Updated ${product.asin} with new data.`);
        }

    } catch (error) {
        console.error("❌ Error updating inventory:", error.message);
    }
};

// ✅ Export the function
module.exports = { updateInventory };
