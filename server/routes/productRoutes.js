import express from "express";
import { isAdmin, isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  addReview,
  addReviewReply,
  createProduct,
  deleteAllProductsData,
  deleteProduct,
  fetchProductDetail,
  fetchProductDetails,
  fetchTrendingProducts,
  getAdminProducts,
  getAllProducts,
  getCouponProducts,
  getProductByCategory,
  getProductsOnSale,
  importData,
  searchProductByName,
  setProductSale,
  updateProduct,
  updateProductStatus,
} from "../controllers/productController.js";
import uploadMiddleware from "../middlewares/uploadFiles.js";
import multer from "multer";

const router = express.Router();
const upload = multer();

// Create Product
router.post(
  "/create/product",
  isAuthenticated,
  uploadMiddleware,
  createProduct
);

// Update Product
router.put(
  "/update/product/:id",
  isAuthenticated,
  uploadMiddleware,
  updateProduct
);

// Fetch All Products-Admin
router.get("/all/admin/products", getAdminProducts);

// Fetch All Products-User
router.get("/all/products", getAllProducts);

// Fetch Trending Products
router.get("/trending/products", fetchTrendingProducts);

// Fetch Sales Products
router.get("/sales/products", getProductsOnSale);

// Set Sale Product
router.put("/update/sale/product/:id", isAuthenticated, setProductSale);

// Get Product Detail
router.get("/product/detail/:id", fetchProductDetail);

// Delete Product
router.delete("/delete/product/:id", isAuthenticated, deleteProduct);

// Update Product Status
router.put("/update/status/:id", isAuthenticated, updateProductStatus);

// Product By Category
router.get("/category/:id", getProductByCategory);

// Review
router.put("/review/:id", isAuthenticated, addReview);
// Reply
router.put("/reply/:id", isAuthenticated, addReviewReply);

// Delete Multiple products
router.put("/delete/multiple", isAuthenticated, isAdmin, deleteAllProductsData);

// Coupon Products
router.get("/coupon", getCouponProducts);

// Import Router
router.post("/import", upload.single("file"), importData);

// Fetch Product detail from 1688 using product sku
router.get("/1688/details/:sku", fetchProductDetails);

// Search Product
router.get("/search/:name", searchProductByName);

export default router;
