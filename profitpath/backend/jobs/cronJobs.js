const cron = require("node-cron");
const pool = require("../config/db");
const redisClient = require("../config/redisClient");
const { fetchAmazonProduct } = require("../services/amazonService");

console.log("⏳ Cron Jobs Initialized");

// ✅ Auto-Refresh Product Cache Every 12 Hours
cron.schedule("0 */12 * * *", async () => {
    console.log("🔄 Running Scheduled Product Cache Refresh");

    try {
        // Fetch all stored ASINs from PostgreSQL
        const products = await pool.query("SELECT asin FROM amazon_products");
        for (const row of products.rows) {
            console.log(`🔄 Refreshing cache for ASIN: ${row.asin}`);
            const productData = await fetchAmazonProduct(row.asin);

            if (productData) {
                await redisClient.set(`product:${row.asin}`, JSON.stringify(productData), {
                    EX: 86400, // Expire in 24 hours
                });
                console.log(`✅ Updated Redis Cache for ASIN: ${row.asin}`);
            }
        }
    } catch (error) {
        console.error("❌ Error in scheduled cache refresh:", error);
    }
});
