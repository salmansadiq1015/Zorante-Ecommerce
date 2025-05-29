import productModel from "../models/productModel.js";
import dotenv from "dotenv";
dotenv.config();
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../middlewares/uploadFiles.js";
import notificationModel from "../models/notificationModel.js";
import userModel from "../models/userModel.js";
import XLSX from "xlsx";
import puppeteer from "puppeteer";
import mongoose from "mongoose";

// Create Product
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      estimatedPrice,
      quantity,
      colors,
      sizes,
      trending,
      sale,
      shipping,
    } = req.body;

    console.log("colors1", colors);

    const parsedColors = JSON.parse(colors);

    console.log("parsedColors", parsedColors);
    const sizesArray = Array.isArray(sizes)
      ? sizes
      : sizes.split(",").map((size) => size.trim());

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No thumbnail image provided.",
      });
    }

    const fileUrls = req.files.map((file) => file.location);

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Product name is required.",
      });
    }
    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Product description is required.",
      });
    }
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Product category is required.",
      });
    }
    if (!price || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid product price is required.",
      });
    }

    const newProduct = await productModel.create({
      name,
      description,
      category,
      price,
      estimatedPrice,
      thumbnails: fileUrls,
      quantity: quantity || 0,
      colors: parsedColors || [],
      sizes: sizesArray || [],
      trending: trending,
      sale: JSON.parse(sale),
      shipping,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({
      success: false,
      message:
        "An error occurred while creating the product. Please try again.",
      error: error.message,
    });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const {
      name,
      description,
      category,
      price,
      estimatedPrice,
      quantity,
      colors,
      sizes,
      trending,
      sale,
      deletedImages,
      shipping,
    } = req.body;

    console.log("shipping:", shipping);

    const deleteImages = JSON.parse(deletedImages);
    // Parse colors and sizes
    const parsedColors = JSON.parse(colors);

    const sizesArray = Array.isArray(sizes)
      ? sizes
      : sizes.split(",").map((size) => size.trim());

    // Process new file uploads
    const newFileUrls = req.files.map((file) => file.location);

    // Find the existing product
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Handle deletion of old thumbnails
    if (deleteImages && deleteImages.length > 0) {
      const deleteKeys = deleteImages?.map((url) => url.split("/").pop());

      try {
        await Promise.all(
          deleteKeys.map((key) =>
            s3.send(
              new DeleteObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: key,
              })
            )
          )
        );
        console.log("Selected old thumbnails deleted from S3 successfully");
      } catch (error) {
        console.error("Error deleting old thumbnails from S3:", error);
        return res.status(500).json({
          success: false,
          message:
            "Error occurred while deleting thumbnails. Please try again.",
          error: error.message,
        });
      }

      // Remove deleted images from database
      product.thumbnails = product.thumbnails.filter(
        (url) => !deleteImages.includes(url)
      );
    }

    // Add new images to thumbnails array
    const updatedThumbnails = [...product.thumbnails, ...newFileUrls];

    // Update product details
    const updatedProduct = await productModel.findByIdAndUpdate(
      { _id: productId },
      {
        name: name || product.name,
        description: description || product.description,
        category: category || product.category,
        price: price || product.price,
        estimatedPrice: estimatedPrice || product.estimatedPrice,
        thumbnails: updatedThumbnails,
        quantity: quantity || product.quantity,
        colors: parsedColors || product.colors,
        sizes: sizesArray || product.sizes,
        trending: trending || product.trending,
        sale: JSON.parse(sale) || product.sale,
        shipping: shipping || product.shipping,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({
      success: false,
      message:
        "An error occurred while updating the product. Please try again.",
      error: error.message,
    });
  }
};

// Fetch Products-Admin
export const getAdminProducts = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category", "name")
      .select("-reviews -comments")
      .sort({ createdAt: -1 });

    return res.status(201).send({
      success: true,
      message: "All products list",
      products: products,
    });
  } catch (error) {
    console.error("Error get all products:", error);
    return res.status(500).send({
      success: false,
      message: "An error occurred while get all products. Please try again.",
      error: error.message,
    });
  }
};

// Get All Products-User
export const getAllProducts = async (req, res) => {
  try {
    const products = await productModel
      .find({ status: true }, { sale: 0, trending: 0 })
      .populate("category", "name")
      .select("-reviews -comments -description ")
      .sort({ createdAt: -1 });

    return res.status(201).send({
      success: true,
      message: "All products list",
      products: products,
    });
  } catch (error) {
    console.error("Error get all products:", error);
    return res.status(500).send({
      success: false,
      message: "An error occurred while get all products. Please try again.",
      error: error.message,
    });
  }
};

// Get ALl Products-by Filter

// export const getAllProducts = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 40,
//       category,
//       minPrice,
//       maxPrice,
//       sortBy,
//     } = req.query;

//     const pageNumber = Math.max(1, parseInt(page, 10) || 1);
//     const pageSize = Math.max(1, parseInt(limit, 10) || 40);
//     const skip = (pageNumber - 1) * pageSize;

//     const match = { status: true };

//     if (category && mongoose.Types.ObjectId.isValid(category)) {
//       match.category = new mongoose.Types.ObjectId(category);
//     }

//     if (minPrice || maxPrice) {
//       const priceFilter = {};
//       if (!isNaN(minPrice)) priceFilter.$gte = parseFloat(minPrice);
//       if (!isNaN(maxPrice)) priceFilter.$lte = parseFloat(maxPrice);
//       match.price = priceFilter;
//     }

//     const sortOptions = {
//       price_asc: { price: 1 },
//       price_desc: { price: -1 },
//       name_asc: { name: 1 },
//       name_desc: { name: -1 },
//       createdAt_desc: { createdAt: -1 },
//     };

//     const sort = sortOptions[sortBy] || { createdAt: -1 };

//     const aggregationPipeline = [
//       { $match: match },
//       {
//         $facet: {
//           metadata: [{ $count: "total" }],
//           data: [
//             { $sort: sort },
//             { $skip: skip },
//             { $limit: pageSize },
//             {
//               $lookup: {
//                 from: "categories",
//                 localField: "category",
//                 foreignField: "_id",
//                 as: "category",
//               },
//             },
//             {
//               $unwind: {
//                 path: "$category",
//                 preserveNullAndEmptyArrays: true,
//               },
//             },
//             {
//               $project: {
//                 sale: 1,
//                 name: 1,
//                 price: 1,
//                 estimatedPrice: 1,
//                 image: 1,
//                 thumbnails: 1,
//                 colors: 1,
//                 sizes: 1,
//                 shipping: 1,
//                 quantity: 1,
//                 purchased: 1,
//                 ratings: 1,
//                 status: 1,
//                 trending: 1,
//                 createdAt: 1,
//                 updatedAt: 1,
//                 category: { _id: 1, name: 1 },
//               },
//             },
//           ],
//         },
//       },
//     ];

//     const result = await productModel.aggregate(aggregationPipeline);
//     const total = result[0]?.metadata[0]?.total || 0;
//     const totalPages = Math.ceil(total / pageSize);
//     const products = result[0]?.data || [];

//     return res.status(200).json({
//       success: true,
//       message: "Products list fetched successfully",
//       products,
//       pagination: {
//         total,
//         totalPages,
//         currentPage: pageNumber,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return res.status(500).json({
//       success: false,
//       message: "An error occurred while fetching products.",
//       error: error.message,
//     });
//   }
// };

// Get Trending Products
export const fetchTrendingProducts = async (req, res) => {
  try {
    const products = await productModel
      .find({ trending: true, status: true })
      .populate("category", "name")
      .select("-reviews -comments")
      .sort({ createdAt: -1 });

    return res.status(201).send({
      success: true,
      message: "Trending products",
      products: products,
    });
  } catch (error) {
    console.error("Error get trending products:", error);
    return res.status(500).send({
      success: false,
      message:
        "An error occurred while get trending products. Please try again.",
      error: error.message,
    });
  }
};
// Get Product Detail
export const fetchProductDetail = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productModel
      .findById(productId)
      .populate("category", "name image")
      .populate("reviews.user", "name email avatar")
      .populate("reviews.commentReplies.user", "name email avatar");

    return res.status(201).send({
      success: true,
      message: "Products Detail.",
      product: product,
    });
  } catch (error) {
    console.error("Error get product detail:", error);
    return res.status(500).send({
      success: false,
      message: "An error occurred while get product detail. Please try again.",
      error: error.message,
    });
  }
};

// Set Product Sale
export const setProductSale = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, discountPercentage, saleExpiry } = req.body;

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    product.sale = {
      isActive: Boolean(isActive),
      discountPercentage: discountPercentage || 0,
      saleExpiry: saleExpiry ? new Date(saleExpiry) : null,
    };

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product sale updated successfully.",
      product,
    });
  } catch (error) {
    console.error("Error updating sale:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the sale.",
      error: error.message,
    });
  }
};

// Get Sale Products
export const getProductsOnSale = async (req, res) => {
  try {
    const products = await productModel
      .find({ "sale.isActive": true, status: true })
      .select("-reviews -comments")
      .populate("category", "name")
      .exec();
    res.status(200).send({
      success: true,
      message: "Sale products retrieved successfully.",
      products,
    });
  } catch (error) {
    console.error("Error fetching sale products:", error);
    res.status(500).send({
      success: false,
      message: "An error occurred while fetching sale products.",
      error: error.message,
    });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found!",
      });
    }

    // Delete product thumbnails from S3 if necessary
    if (product.thumbnails && product.thumbnails.length > 0) {
      const deletePromises = product.thumbnails.map((thumb) => {
        const deleteParams = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: thumb.split("/").pop(),
        };
        return s3.send(new DeleteObjectCommand(deleteParams));
      });

      await Promise.all(deletePromises);
    }

    await productModel.findByIdAndDelete(productId);

    return res.status(201).send({
      success: true,
      message: "Product deleted successfully!.",
    });
  } catch (error) {
    console.error("Error delete product:", error);
    return res.status(500).send({
      success: false,
      message: "An error occurred while delete product. Please try again.",
      error: error.message,
    });
  }
};

// Update Product Status
export const updateProductStatus = async (req, res) => {
  try {
    const productId = req.params.id;
    const { status } = req.body;

    console.log("status:", status);

    // Find the existing product
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      { _id: productId },
      {
        status,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Product status updated.",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product status:", error);
    return res.status(500).json({
      success: false,
      message:
        "An error occurred while updating product status. Please try again.",
      error: error.message,
    });
  }
};

// Product By Category
export const getProductByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const products = await productModel
      .find({ category: categoryId, status: true })
      .populate("category", "name");

    return res.status(200).json({
      success: true,
      message: "Products by category.",
      products: products,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message:
        "An error occurred while get products by category. Please try again.",
      error: error.message,
    });
  }
};

// Add Review
export const addReview = async (req, res) => {
  try {
    const productId = req.params.id;
    const { review, rating } = req.body;

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(400).send({
        success: false,
        message: "Product not found!",
      });
    }

    const reviewData = {
      user: req.user._id,
      comment: review,
      rating,
    };

    product.reviews?.push(reviewData);

    let avg = 0;

    product?.reviews.forEach((rev) => {
      avg += rev.rating;
    });

    if (product) {
      product.ratings = avg / product.reviews.length;
    }

    await product?.save();

    res.status(200).send({
      success: true,
      message: "Review added successfully!",
      product: product,
    });

    const admins = await userModel.find({ role: "admin" });

    const notifications = admins.map((admin) => ({
      user: admin._id,
      subject: "📢 New Product Review Alert!",
      context: `${req.user.name} has just submitted a new product review "${review}" . 🚀 Check it out now!`,
      type: "admin",
      redirectLink: "/dashboard/products",
    }));

    // Create notifications for all admins
    await notificationModel.insertMany(notifications);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occured while add review, please try again!",
      error: error.message,
    });
  }
};

// Add Reply
export const addReviewReply = async (req, res) => {
  try {
    const productId = req.params.id;
    const { reply, reviewId } = req.body;

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(400).send({
        success: false,
        message: "Product not found!",
      });
    }

    const review = product?.reviews?.find(
      (rev) => rev._id.toString() === reviewId
    );

    if (!review) {
      return res.status(400).send({
        success: false,
        message: "Review not found!",
      });
    }

    const replyData = {
      user: req.user._id,
      comment: reply,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!review.commentReplies) {
      review.commentReplies = [];
    }

    review.commentReplies?.push(replyData);

    await product?.save();

    // Notification

    //

    res.status(200).send({
      success: true,
      message: "Reply added successfully!",
      product: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occured while add review reply, please try again!",
      error: error.message,
    });
  }
};

// Delete All Products
export const deleteAllProductsData = async (req, res) => {
  try {
    const { productIds } = req.body;

    console.log("productIds:", productIds);

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).send({
        success: false,
        message: "No valid product IDs provided.",
      });
    }

    await productModel.deleteMany({
      _id: { $in: productIds },
    });

    res.status(200).send({
      success: true,
      message: "All products deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting products:", error);
    res.status(500).send({
      success: false,
      message: "Error occurred while products notifications. Please try again!",
      error: error.message,
    });
  }
};

// Fetch Product-Coupon
export const getCouponProducts = async (req, res) => {
  try {
    const products = await productModel
      .find({ status: true })
      .select("name")
      .sort({ createdAt: -1 });

    return res.status(201).send({
      success: true,
      message: "All products list",
      products: products,
    });
  } catch (error) {
    console.error("Error get all products:", error);
    return res.status(500).send({
      success: false,
      message: "An error occurred while get all products. Please try again.",
      error: error.message,
    });
  }
};

// Function to parse Excel/CSV data
const parseData = (buffer) => {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet);
};

// Controller to handle file upload and avoid duplicate entries
export const importData = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send("No file uploaded.");
    }

    const data = parseData(file.buffer);

    if (!Array.isArray(data)) {
      throw new Error("Invalid data format. Expected an array.");
    }

    const safeSplit = (value) =>
      typeof value === "string"
        ? value.split(",")
        : Array.isArray(value)
        ? value
        : [];

    const productMap = new Map();

    data.forEach((item) => {
      const description = item.description?.trim();
      if (!description) {
        return;
      }

      if (!productMap.has(description)) {
        productMap.set(description, {
          name: item.name?.trim(),
          description: description || "",
          category: item.category || null,
          price: parseFloat(item.price) || 0,
          estimatedPrice: parseFloat(item.estimatedPrice) || 0,
          thumbnails: safeSplit(item.thumbnails),
          quantity: parseInt(item.quantity, 10) || 200,
          sizes: safeSplit(item.sizes),
          status: Boolean(item.status),
        });
      } else {
        const existingProduct = productMap.get(description);

        existingProduct.thumbnails = [
          ...new Set([
            ...existingProduct.thumbnails,
            ...safeSplit(item.thumbnails),
          ]),
        ];
        existingProduct.sizes = [
          ...new Set([...existingProduct.sizes, ...safeSplit(item.sizes)]),
        ];
        existingProduct.quantity += parseInt(item.quantity, 10) || 0;
      }
    });

    const uniqueProducts = Array.from(productMap.values());

    for (const product of uniqueProducts) {
      try {
        // Use updateOne to avoid duplicate entries
        await productModel.updateOne(
          { name: product.name }, // Find a product with the same name
          { $setOnInsert: product }, // Only insert if not found
          { upsert: true } // Prevent insertion if product already exists
        );
      } catch (error) {
        console.error(
          `Error inserting product ${product.name}:`,
          error.message
        );
      }
    }

    res.status(200).send({
      success: true,
      message: "Product data imported and aggregated successfully!",
    });
  } catch (error) {
    console.error("Error importing data:", error);
    res.status(500).send("An error occurred while importing data.");
  }
};

// Controller to handle file upload
// export const importData = async (req, res) => {
//   try {
//     const file = req.file;
//     if (!file) {
//       return res.status(400).send("No file uploaded.");
//     }

//     const data = parseData(file.buffer);

//     if (!Array.isArray(data)) {
//       throw new Error("Invalid data format. Expected an array.");
//     }

//     const safeSplit = (value) =>
//       typeof value === "string"
//         ? value.split(",")
//         : Array.isArray(value)
//         ? value
//         : [];

//     const productMap = new Map();

//     data.forEach((item) => {
//       const description = item.description?.trim();
//       if (!description) {
//         return;
//       }

//       if (!productMap.has(description)) {
//         productMap.set(description, {
//           name: item.name?.trim(),
//           description: description || "",
//           category: item.category || null,
//           price: parseFloat(item.price) || 0,
//           estimatedPrice: parseFloat(item.estimatedPrice) || 0,
//           thumbnails: safeSplit(item.thumbnails),
//           quantity: parseInt(item.quantity, 10) || 200,
//           // colors: safeSplit(item.colors),
//           sizes: safeSplit(item.sizes),
//           status: Boolean(item.status),
//         });
//       } else {
//         const existingProduct = productMap.get(description);

//         existingProduct.thumbnails = [
//           ...new Set([
//             ...existingProduct.thumbnails,
//             ...safeSplit(item.thumbnails),
//           ]),
//         ];
//         // existingProduct.colors = [
//         //   ...new Set([...existingProduct.colors, ...safeSplit(item.colors)]),
//         // ];
//         existingProduct.sizes = [
//           ...new Set([...existingProduct.sizes, ...safeSplit(item.sizes)]),
//         ];
//         existingProduct.quantity += parseInt(item.quantity, 10) || 0;
//       }
//     });

//     const uniqueProducts = Array.from(productMap.values());
//     await productModel.insertMany(uniqueProducts);

//     res.status(200).send({
//       success: true,
//       message: "Product data imported and aggregated successfully!",
//     });
//   } catch (error) {
//     console.error("Error importing data:", error);
//     res.status(500).send("An error occurred while importing data.");
//   }
// };

// Fetch Products from 1688 using product sku
// export const fetchProductDetails = async (req, res) => {
//   const { sku } = req.params;
//   console.log("sku:", sku);
//   try {
//     const response = await axios.get(
//       `https://detail.1688.com/offer/${sku}.html`,
//       {
//         headers: {
//           "User-Agent": "Mozilla/5.0",
//           "Accept-Language": "en-US,en;q=0.9",
//         },
//       }
//     );
//     console.log("Response:", response.data);

//     // Example: Extracting product title using regex (for demonstration)
//     const productTitleMatch = response.data.match(/<title>(.*?)<\/title>/);
//     const productTitle = productTitleMatch
//       ? productTitleMatch[1]
//       : "Title not found";

//     console.log("Product Title:", productTitle);
//   } catch (error) {
//     console.error("Error fetching product details:", error.message);
//   }
// };
const retry = async (fn, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      console.warn(`Retry attempt ${i + 1} failed: ${error.message}`);
    }
  }
  throw new Error("All retry attempts failed.");
};

// Fetch Product details from 1688 using the SKU
export const fetchProductDetails = async (req, res) => {
  try {
    const { sku } = req.params;
    console.log("Fetching product for SKU:", sku);

    const url = `https://detail.1688.com/offer/${sku}.html`;

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/85.0.4183.121 Safari/537.36"
    );

    // Retry fetching the page in case of failure
    await retry(async () => {
      const response = await page.goto(url, { waitUntil: "networkidle2" });
      if (response.status() !== 200) {
        throw new Error(`Failed to load page: ${response.status()}`);
      }
    });

    // Check for Captcha
    const captchaDetected = await page.$(".captcha_img");
    if (captchaDetected) {
      throw new Error("Captcha Detected - Manual Interaction Required");
    }

    // Extract product details
    const productTitle = await page.title();
    const price = await page.evaluate(() => {
      const priceElement = document.querySelector(".price .value");
      return priceElement ? priceElement.innerText : "Price not available";
    });
    const images = await page.evaluate(() =>
      Array.from(document.querySelectorAll("img")).map((img) => img.src)
    );
    const description = await page.evaluate(() => {
      const descElement = document.querySelector(".description");
      return descElement ? descElement.innerText : "Description not available";
    });
    const variations = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".sku-item")).map(
        (variant) => variant.innerText
      )
    );

    const productDetails = {
      title: productTitle,
      price,
      images,
      description,
      variations,
    };

    await browser.close();

    // Return the product details as JSON
    return res.status(200).json({
      success: true,
      message: "Product details fetched successfully.",
      productDetails,
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching product details.",
      error: error.message,
    });
  }
};

// Search Product API
export const searchProductByName = async (req, res) => {
  try {
    const { name } = req.params;

    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Please provide a product name to search.",
      });
    }

    const products = await productModel.find({ status: true });

    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(name.toLowerCase())
    );

    // console.log("filteredProducts:", filteredProducts);

    if (filteredProducts.length === 0) {
      return res.status(200).send({
        success: false,
        message: "No products found matching the given name.",
        products: filteredProducts,
      });
    }

    return res.status(200).send({
      success: true,
      length: filteredProducts.length,
      message: `Products matching '${name}'`,
      products: filteredProducts,
    });
  } catch (error) {
    console.error("Error searching for products:", error);
    return res.status(500).send({
      success: false,
      message:
        "An error occurred while searching for products. Please try again.",
      error: error.message,
    });
  }
};
