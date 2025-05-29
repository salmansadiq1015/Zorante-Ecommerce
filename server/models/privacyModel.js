import mongoose from "mongoose";

const privacySchema = new mongoose.Schema(
  {
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("privacy", privacySchema);
