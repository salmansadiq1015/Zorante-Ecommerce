import express from "express";
import { isAdmin, isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  addCoupon,
  applyCoupon,
  applyCouponByOrder,
  couponDetail,
  deleteCoupons,
  getActiveCoupons,
  getAllCoupons,
  updateCoupon,
  updateCouponStatus,
} from "../controllers/couponController.js";

const router = express.Router();

// Add Coupon
router.post("/create", isAuthenticated, isAdmin, addCoupon);

// Update Coupon
router.put("/update/:id", isAuthenticated, isAdmin, updateCoupon);

// Get All Coupon
router.get("/all", getAllCoupons);

// Get Active Coupon
router.get("/active", getActiveCoupons);

// Get Coupon Detail
router.get("/detail/:id", couponDetail);

// Apply Coupon By Product
router.post("/apply/product", isAuthenticated, applyCoupon);

// Apply Coupon By Order
router.post("/apply/order", isAuthenticated, applyCouponByOrder);

// Update Status
router.put("/status/:id", isAuthenticated, isAdmin, updateCouponStatus);

// Delete Coupon
router.delete("/delete/:id", isAuthenticated, isAdmin, deleteCoupons);

export default router;
