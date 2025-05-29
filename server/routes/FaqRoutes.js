import express from "express";
import { isAdmin, isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  addFAQ,
  deleteFAQ,
  getAllFAQ,
  updateFAQ,
} from "../controllers/faqController.js";

const router = express.Router();

// Add FAQ
router.post("/add", isAuthenticated, isAdmin, addFAQ);

// Update FAQ
router.put("/update/:id", isAuthenticated, isAdmin, updateFAQ);

// Get All FAQ
router.get("/all", getAllFAQ);

// Delete FAQ
router.delete("/delete/:id", isAuthenticated, isAdmin, deleteFAQ);

export default router;
