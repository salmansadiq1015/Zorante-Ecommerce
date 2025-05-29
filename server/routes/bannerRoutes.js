import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import uploadMiddleware from "../middlewares/uploadFiles.js";
import {
  createBanner,
  deleteBanner,
  getAllBanners,
  getSingleBanner,
  updateBanner,
} from "../controllers/bannerController.js";

const router = express.Router();

// Create Banner
router.post("/create/banner", isAuthenticated, uploadMiddleware, createBanner);

// Update Banner
router.put(
  "/update/banner/:id",
  isAuthenticated,
  uploadMiddleware,
  updateBanner
);

// Get All Banner
router.get("/list", getAllBanners);

// Get Single Banner
router.get("/fatch/banner/:id", getSingleBanner);

// Delete Banner
router.delete("/delete/banner/:id", isAuthenticated, deleteBanner);

export default router;
