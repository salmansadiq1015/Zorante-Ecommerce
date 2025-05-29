import mongoose from "mongoose";

const shippingSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },
    fee: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Shipping", shippingSchema);
