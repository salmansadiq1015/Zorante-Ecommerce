import mongoose from "mongoose";

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
    image: {
      type: String,
      default: "",
    },
    questionReplies: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        reply: { type: String, trim: true, maxlength: 500 },
        image: { type: String, default: "" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        colors: {
          type: [String],
          default: [],
        },
        sizes: {
          type: [String],
          default: [],
        },
      },
    ],
    totalAmount: {
      type: String,
      required: true,
    },
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      postalCode: { type: String, default: "" },
      country: { type: String, default: "" },
    },
    paymentMethod: {
      type: String,
      enum: ["Credit Card", "PayPal", "Bank Transfer"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Packing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Returned",
      ],
      default: "Pending",
    },
    deliveredAt: {
      type: Date,
    },
    shippingFee: {
      type: String,
    },
    notes: {
      type: String,
    },
    trackingId: {
      type: String,
      default: "",
    },
    shippingCarrier: {
      type: String,
      default: "",
    },
    comments: [commentSchema],
  },
  { timestamps: true }
);

export default mongoose.model("orders", orderSchema);
