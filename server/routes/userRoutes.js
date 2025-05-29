import express from "express";
import {
  addUser,
  allUsersCount,
  deleteAllUsers,
  deleteUser,
  getAllUsers,
  getUser,
  getUserDetail,
  getUserInfo,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  socialAuth,
  updateAccessToken,
  updateCheckoutDetail,
  updatePassword,
  updateRole,
  updateUserinfo,
  updateUserProfile,
  uploadFiles,
  verificationUser,
} from "../controllers/userController.js";
import { isAdmin, isAuthenticated } from "../middlewares/authMiddleware.js";
import uploadMiddleware from "../middlewares/uploadFiles.js";
import {
  createSubscription,
  deleteSubscription,
  getAllSubscriptions,
} from "../controllers/subscriptionController.js";

const router = express.Router();

// Register
router.post("/register", uploadMiddleware, registerUser);

// Email Verification
router.post("/email/verification", verificationUser);

// Login
router.post("/login", loginUser);

// Social Login
router.post("/socialAuth", socialAuth);

// Logout
router.get("/logout", isAuthenticated, logoutUser);

// Update Access Token
router.get("/refresh", updateAccessToken);

// Get ALl User
router.get("/allUsers", getAllUsers);

// Get Single User
router.get("/userDetail/:id", getUserDetail);

// Update Profile
router.put(
  "/update/profile/:id",
  isAuthenticated,
  uploadMiddleware,
  updateUserProfile
);

// Update Checkout Detail
router.put("/update/checkout/:id", isAuthenticated, updateCheckoutDetail);

// Update Role
router.put("/update/role/:id", isAuthenticated, updateRole);

// Send Reset Password (Code)
router.post("/reset/password", resetPassword);

// Update Password
router.put("/update/password", updatePassword);

// Delete User
router.delete("/delete/user/:id", isAuthenticated, isAdmin, deleteUser);

// Update Files
router.post("/upload/file", uploadMiddleware, uploadFiles);

// Get User Info
router.get("/userinfo", isAuthenticated, getUserInfo);

// Add User through Admin Panal
router.post("/add/user", isAuthenticated, isAdmin, addUser);

// Update User through Admin Panal
router.put("/update/userInfo/:id", isAuthenticated, isAdmin, updateUserinfo);
// Delete All User
router.put("/delete/multiple", isAuthenticated, isAdmin, deleteAllUsers);

// Users Count
router.get("/users/count", allUsersCount);
// Get User Info
router.get("/", getUser);

// --------------------Subscription Routes --------------------

// Create Subscription
router.post("/subscription", createSubscription);

// Get All Subscriptions
router.get("/subscription", getAllSubscriptions);

// Delete Subscription
router.delete(
  "/subscription/:id",
  isAuthenticated,
  isAdmin,
  deleteSubscription
);

export default router;
