import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import uploadMiddleware from "../middlewares/uploadFiles.js";
import {
  createBlogs,
  deleteBlog,
  fetchBlogs,
  fetchSingleBlog,
  updateBlogs,
} from "../controllers/blogControllers.js";

const router = express.Router();

// Create Blog
router.post("/create/blog", isAuthenticated, uploadMiddleware, createBlogs);

// Update Blog
router.put("/update/blog/:id", isAuthenticated, uploadMiddleware, updateBlogs);

// Get All Blogs
router.get("/all", fetchBlogs);

// Get Single Blog
router.get("/detail/:id", fetchSingleBlog);

// Delete Blog
router.delete("/remove/blog/:id", isAuthenticated, deleteBlog);

export default router;
