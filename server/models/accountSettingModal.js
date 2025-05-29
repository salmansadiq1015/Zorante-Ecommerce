import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    accountNumber: {
      type: String,
    },
    accountHolderName: {
      type: String,
    },
    pickUpLocation: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("AccountSetting", accountSchema);
