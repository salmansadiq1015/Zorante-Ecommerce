import mongoose from "mongoose";

const adsSchema = new mongoose.Schema(
  {
    videoURL: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
); // adsSchema

export default mongoose.model("ads", adsSchema);
