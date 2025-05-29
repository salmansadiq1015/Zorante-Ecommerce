import express from "express";
import { isAdmin, isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  categoryDetail,
  createCategory,
  deleteAllCategory,
  fetchAllCategory,
  removeCategory,
  updateCategory,
} from "../controllers/categoryController.js";
import uploadMiddleware from "../middlewares/uploadFiles.js";

const router = express.Router();

// Create Category
router.post(
  "/create/category",
  isAuthenticated,
  uploadMiddleware,
  createCategory
);

// Update Category
router.put(
  "/update/category/:id",
  isAuthenticated,
  uploadMiddleware,
  updateCategory
);

// Fetch All Category
router.get("/all/categories", fetchAllCategory);

// Fetch Single Category
router.get("/category/detail/:id", categoryDetail);

// Delete Category
router.delete("/delete/category/:id", isAuthenticated, removeCategory);

router.put("/delete/multiple", isAuthenticated, isAdmin, deleteAllCategory);

export default router;
