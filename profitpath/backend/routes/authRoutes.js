import express from "express";
import { verifyUser } from "../controllers/authController.js"; // ✅ Ensure `.js` extension is included

const router = express.Router();

// Define Authentication Route
router.post("/verify", verifyUser);

export default router; // ✅ Use `export default` for ES Modules
