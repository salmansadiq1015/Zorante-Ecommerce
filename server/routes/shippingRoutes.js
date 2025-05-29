import express from "express";
import { isAdmin, isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  addShipping,
  deleteShipping,
  getShipping,
  getShippingByCountry,
  updateShipping,
} from "../controllers/ShippingController.js";

const router = express.Router();

// Add Shipping
router.post("/add", isAuthenticated, isAdmin, addShipping);

// Update Shipping
router.put("/update/:id", isAuthenticated, isAdmin, updateShipping);

// Delete Shipping
router.delete("/delete/:id", isAuthenticated, isAdmin, deleteShipping);

// Get All Shipping
router.get("/getAll", getShipping);

// Get Shipping By Country
router.get("/:country", getShippingByCountry);

export default router;
