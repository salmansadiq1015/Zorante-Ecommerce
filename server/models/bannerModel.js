import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "Banner image is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("banner", bannerSchema);
