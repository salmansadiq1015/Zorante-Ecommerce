import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  createAds,
  getAdminVideo,
  getVideo,
  updateVideo,
  updateVideoStatus,
} from "../controllers/ads.js";
import uploadMiddleware from "../middlewares/uploadFiles.js";

const router = express.Router();

// Post Ads
router.post("/upload", isAuthenticated, uploadMiddleware, createAds);

// Get Ads
router.get("/", getVideo);

// Get Admin Ads
router.get("/admin", getAdminVideo);

// Update Ads
router.put("/update/:id", isAuthenticated, uploadMiddleware, updateVideo);

// Update Ads Status
router.put("/update/status/:id", isAuthenticated, updateVideoStatus);

export default router;
