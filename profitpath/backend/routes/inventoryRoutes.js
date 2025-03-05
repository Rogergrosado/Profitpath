import express from "express";
import { getAmazonProduct, fetchInventory } from "../controllers/inventoryController.js"; 

const router = express.Router();

// ✅ Define Routes Correctly
router.get("/product", getAmazonProduct);
router.get("/", fetchInventory); // ✅ Fix: `/api/inventory` calls `fetchInventory`

export default router;
