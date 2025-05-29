import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    subject: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
    },
    message: {
      type: String,
      required: true,
      maxlength: 500,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "processing", "completed", "cancelled"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("contacts", contactSchema);
