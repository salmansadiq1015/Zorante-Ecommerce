import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

// Review Schema
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    commentReplies: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        comment: { type: String, trim: true, maxlength: 500 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Comment Schema for Q&A Section
const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    question: {
      type: String,
      trim: true,
      required: true,
      maxlength: 500,
    },
    questionReplies: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        reply: { type: String, trim: true, maxlength: 500 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Product Schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      duplicate: false,
    },
    description: {
      type: String,
      // required: [true, "Product description is required"],
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      // required: [true, "Product category is required"],
    },
    price: {
      type: Number,
      // required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    estimatedPrice: {
      type: Number,
      min: [0, "Estimated price cannot be negative"],
    },
    thumbnails: [],
    quantity: {
      type: Number,
      default: 0,
      min: [0, "Quantity cannot be negative"],
    },
    colors: [
      {
        name: {
          type: String,
        },
        code: {
          type: String,
        },
      },
    ],
    sizes: {
      type: [String],
      default: [],
    },
    reviews: [reviewSchema],
    comments: [commentSchema],
    ratings: {
      type: Number,
      default: 0,
    },
    purchased: {
      type: Number,
      default: 0,
      min: [0, "Purchased count cannot be negative"],
    },
    trending: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: true,
    },
    sale: {
      isActive: {
        type: Boolean,
        default: false,
      },
      discountPercentage: {
        type: Number,
        min: [0, "Discount cannot be negative"],
        max: [100, "Discount cannot exceed 100%"],
        default: 0,
      },
      saleExpiry: {
        type: Date,
      },
    },
    shipping: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

productSchema.plugin(aggregatePaginate);

export default mongoose.model("products", productSchema);
