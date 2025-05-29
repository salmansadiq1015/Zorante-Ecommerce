import express from "express";
import {
  orderAnalytics,
  userAnalytics,
} from "../controllers/analyticsController.js";

const router = express.Router();

// User
router.get("/users", userAnalytics);

// Orders
router.get("/orders", orderAnalytics);

export default router;
