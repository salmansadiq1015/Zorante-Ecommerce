import express from "express";
import { isAdmin, isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  createCard,
  deleteCard,
  getAllCards,
  getCardInformation,
  updateCard,
} from "../controllers/cardController.js";

const router = express.Router();

// Add Payment Card
router.post("/add", isAuthenticated, createCard);

// Update Payment Card
router.put("/update/:id", isAuthenticated, updateCard);

// Delete Payment Card
router.delete("/delete/:id", isAuthenticated, deleteCard);

// Get All Payment Cards
router.get("/all", getAllCards);

// Get Payment Card By ID
router.get("/information/:id", isAuthenticated, getCardInformation);

export default router;
