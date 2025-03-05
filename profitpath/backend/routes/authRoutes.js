const express = require("express");
const { verifyUser } = require("../controllers/authController");

const router = express.Router();

// Define Authentication Route
router.post("/verify", verifyUser);

module.exports = router;  // ✅ Ensure this line exists
