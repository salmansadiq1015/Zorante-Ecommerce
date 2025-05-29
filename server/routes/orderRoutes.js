import express from "express";
import {
  addCommentToOrder,
  addReplyToComment,
  allOrdersByStatus,
  allUserOrders,
  cancelOrder,
  createOrderAdmin,
  createOrderStripe,
  deleteAllOrders,
  deleteOrder,
  getAllOrders,
  getAllRevenueAnalyticsData,
  getConversionRate,
  getRevenueAnalyticsData,
  getRevenueByCategory,
  getTotalRevenue,
  getUserBuyProducts,
  handleCreateOrderWithPayPal,
  handlePayPalPayment,
  newPayment,
  orderDetail,
  sendStripePublishableKey,
  trackOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { isAdmin, isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Initiate PayPal Payment
router.post("/paypal/payment", isAuthenticated, handlePayPalPayment);

// Create Order with PayPal
router.post("/paypal/create-order", handleCreateOrderWithPayPal);

// Stripe Payment
router.get("/payment/stripe/publishableKey", sendStripePublishableKey);

router.post("/payment", isAuthenticated, newPayment);

// Create Order
router.post("/stripe/create-order", isAuthenticated, createOrderStripe);

// Fetch All Order by Admin
router.get("/all/orders", getAllOrders);

// All User Orders
router.get("/user/orders/:id", allUserOrders);

// Order Detail
router.get("/detail/:id", orderDetail);

// Update Order & Payment Status
router.put("/update/status/:id", isAuthenticated, updateOrderStatus);

// Delete Order
router.delete("/delete/order/:id", isAuthenticated, deleteOrder);

//Return/Cancel Request
router.put("/cancel/request/:id", isAuthenticated, cancelOrder);

// Delete Multiple Orders
router.put("/delete/multiple", isAuthenticated, isAdmin, deleteAllOrders);
// Total Revenue
router.get("/total/revenue", getTotalRevenue);

// Day wise Revenue
router.get("/analytics/revenue/:startDate/:endDate", getRevenueAnalyticsData);

// All Revenue Data
router.get("/all/analytics/revenue", getAllRevenueAnalyticsData);

// Renenue by Category
router.get("/revenue/category", getRevenueByCategory);

// Order By Status
router.get("/add/:status", isAuthenticated, allOrdersByStatus);

// Track Order
router.post("/track", isAuthenticated, trackOrder);

// Get User Buy Products for add review
router.get("/buy/products", isAuthenticated, getUserBuyProducts);

// Conversion Rate
router.get("/conversion/rate", getConversionRate);

// Create Order through Admin Panel
router.post("/admin/create-order", isAuthenticated, createOrderAdmin);

// Add Comment to order
router.put("/comment/:id", isAuthenticated, isAdmin, addCommentToOrder);

// Add Reply to Comment
router.put("/reply/:id", isAuthenticated, addReplyToComment);

export default router;
