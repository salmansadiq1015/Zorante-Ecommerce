import mongoose from "mongoose";

const paymentCardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    card_number: {
      type: String,
      required: true,
    },
    cvv: {
      type: String,
      required: true,
    },
    expiry_date: {
      type: Date,
      required: true,
    },
    zip_code: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("card", paymentCardSchema);
