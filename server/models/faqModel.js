import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      default: "general",
    },
  },
  { timestamps: true }
);

export default mongoose.model("faqs", faqSchema);
