import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    number: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: null,
    },
    addressDetails: {
      pincode: {
        type: String,
        trim: true,
      },
      address: {
        type: String,
        trim: true,
        maxlength: [300, "Address cannot exceed 300 characters"],
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
      },
    },
    bankDetails: {
      accountNumber: {
        type: String,
        trim: true,
        // match: [/^\d{9,18}$/, "Please enter a valid bank account number"],
      },
      accountHolder: {
        type: String,
        trim: true,
        maxlength: [150, "Account holder name cannot exceed 100 characters"],
      },
      ifscCode: {
        type: String,
        trim: true,
        uppercase: true,
        // match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, "Please enter a valid IFSC code"],
      },
      expiryDate: {
        type: Date,
        default: null,
      },
      cvv: {
        type: String,
        trim: true,
      },
    },
    role: {
      type: String,
      enum: ["user", "admin", "agent", "superadmin"],
      default: "user",
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetTokenExpire: {
      type: Date,
      default: null,
    },
    status: {
      type: Boolean,
      default: true,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    applePayId: {
      type: String,
      default: null,
    },
    stripe_customer_id: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Sign Access Token
userSchema.methods.SignAccessToken = function () {
  if (!process.env.ACCESS_TOKEN) {
    throw new Error("ACCESS_TOKEN is not defined in the environment variables");
  }
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN, {
    expiresIn: "5m",
  });
};

// Sign Refresh Token
userSchema.methods.SignRefreshToken = function () {
  if (!process.env.REFRESH_TOKEN) {
    throw new Error(
      "REFRESH_TOKEN is not defined in the environment variables"
    );
  }
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN, {
    expiresIn: "7d",
  });
};

export default mongoose.model("users", userSchema);
