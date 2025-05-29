import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  createPrivacy,
  deletePrivacy,
  fetchPrivacy,
  updatePrivacy,
} from "../controllers/privacyController.js";

const router = express.Router();

// Create Privacy
router.post("/create/privacy", isAuthenticated, createPrivacy);

// Update Privacy
router.put("/update/privacy/:id", isAuthenticated, updatePrivacy);

// Get Privacy
router.get("/fetch/privacy", fetchPrivacy);

// Delete Privacy
router.put("/delete/privacy/:id", isAuthenticated, deletePrivacy);

export default router;
