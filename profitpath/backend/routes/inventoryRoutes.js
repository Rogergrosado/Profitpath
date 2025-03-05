const express = require("express");
const { getAmazonProduct } = require("../controllers/inventoryController");

const router = express.Router();

router.get("/", getAmazonProduct);

module.exports = router;
// ✅ Ensure this line exists