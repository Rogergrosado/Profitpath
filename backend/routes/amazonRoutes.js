require("dotenv").config();
const express = require("express");
const axios = require("axios");

const router = express.Router();

// Fetch Amazon product data using RapidAPI
router.get("/search/:query", async (req, res) => {
    try {
        const { query } = req.params;

        const options = {
            method: "GET",
            url: "https://amazon-product-advertising-api.p.rapidapi.com/amazon_search.php",
            params: {
                query: query,
                tld: "com",
                countryCode: "us"
            },
            headers: {
                "x-rapidapi-key": process.env.RAPIDAPI_KEY,
                "x-rapidapi-host": process.env.RAPIDAPI_HOST
            }
        };

        const response = await axios.request(options);
        res.json(response.data);
    } catch (error) {
        console.error("Amazon API Error:", error);
        res.status(500).json({ error: "Failed to fetch Amazon data" });
    }
});

module.exports = router;

