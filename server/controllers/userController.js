import {
  comparePassword,
  createRandomToken,
  hashPassword,
} from "../helper/encryption.js";
import sendMail from "../helper/mail.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
// import {
//   accessTokenOptions,
//   refreshTokenOptions,
//   // sendToken,
// } from "../utils/jwt.js";
import dotenv from "dotenv";
dotenv.config();
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../middlewares/uploadFiles.js";

import Stripe from "stripe";
import chatModel from "../models/chat/chatModel.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, number, addressDetails, bankDetails } =
      req.body;

    const file = req.files;
    const avatar = file && file[0].location;

    if (!avatar) {
      return res.status(400).send({
        success: false,
        message: "Profile image is required!",
      });
    }

    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Name is required!",
      });
    }

    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required!",
      });
    }
    if (!password) {
      return res.status(400).send({
        success: false,
        message: "Password is required!",
      });
    }

    const isExisting = await userModel.findOne({ email: email });

    if (isExisting) {
      return res.status(400).send({
        success: false,
        message: "Email already exist!",
      });
    }

    const user = {
      name,
      email,
      password,
      number,
      avatar,
      addressDetails,
      bankDetails,
    };

    const activationToken = await createActivationToken(user);
    const activationCode = activationToken.activationCode;

    // Send Verification Email
    const data = {
      user: { name: user.name },
      activationCode,
      activationLink: "http://localhost:3000/activation",
    };

    await sendMail({
      email: user.email,
      subject: "Varification Email!",
      template: "activation_code.ejs",
      data,
    });

    res.status(200).send({
      success: true,
      message: `Please cheak your email: ${user.email} to activate your account`,
      activationToken: activationToken.token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registering user!",
      error: error,
    });
  }
};

export const createActivationToken = async (user) => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign({ user, activationCode }, process.env.JWT_SECRET, {
    expiresIn: "5m",
  });

  return { token, activationCode };
};

// Save User
export const verificationUser = async (req, res) => {
  try {
    const { activation_token, activation_code } = req.body;

    if (!activation_token) {
      return res.status(400).send({
        success: false,
        message: "Activation_token is required! ",
      });
    }
    if (!activation_code) {
      return res.status(400).send({
        success: false,
        message: "Activation_code is required! ",
      });
    }

    const newUser = await jwt.verify(activation_token, process.env.JWT_SECRET);

    if (newUser.activationCode !== activation_code) {
      return res.status({
        success: false,
        message: "Invalid activation code!",
      });
    }
    const {
      name,
      email,
      password,
      number,
      avatar,
      addressDetails,
      bankDetails,
    } = newUser.user;

    // Existing User

    const isExisting = await userModel.findOne({ email });

    if (isExisting) {
      return res.status(400).send({
        success: false,
        message: "Email already exist!",
      });
    }

    const hashedPassword = await hashPassword(password);

    const customer = await stripe.customers.create({
      email: email,
      name: name,
    });

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      avatar,
      number,
      addressDetails,
      bankDetails,
      stripe_customer_id: customer.id,
    });

    var chatData = {
      chatName: "sender",
      users: ["68139e2b2c66a6b42f0ead25", user._id],
    };

    await chatModel.create(chatData);

    res.status(200).send({
      success: true,
      message: "Register successfully!",
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while register user after activation!",
    });
  }
};

// Login User Controller
export const loginUser = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Email & Password in required!",
      });
    }

    const user = await userModel.findOne({ email: email });

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Invalid email & password!",
      });
    }

    const isPasswordValid = await comparePassword(password, user.password);

    console.log("isPasswordValid", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(400).send({
        success: false,
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        user: { _id: user._id, name: user.name, email: user.email },
      },
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? "29d" : "7d" }
    );

    const {
      password: userPassword,
      passwordResetToken,
      passwordResetTokenExpire,
      ...userData
    } = user._doc;

    res.status(200).send({
      success: true,
      message: "Login successfully!",
      user: userData,
      token: token,
    });
    // sendToken(user, 200, res);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while login user!",
      error,
    });
  }
};

// Social Auth
export const socialAuth = async (req, res) => {
  try {
    const { name, email, avatar, applePayId } = req.body;

    let user;

    if (email) {
      user = await userModel.findOne({ email });
    } else if (applePayId) {
      user = await userModel.findOne({ applePayId: applePayId });
    }

    const customer = await stripe.customers.create({
      email: email,
      name: name,
    });

    if (!user) {
      const newUser = await userModel.create({
        name,
        email,
        avatar,
        applePayId,
        stripe_customer_id: customer.id,
      });
      user = newUser;
    }

    // sendToken(user, 200, res);
    const token = jwt.sign(
      {
        id: user._id,
        user: { _id: user._id, name: user.name, email: user.email },
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Create a new Chat

    let isChat = await chatModel.find({
      $and: [
        { users: { $elemMatch: { $eq: user._id } } },
        { users: { $elemMatch: { $eq: "68139e2b2c66a6b42f0ead25" } } },
      ],
    });

    if (isChat.length === 0) {
      var chatData = {
        chatName: "sender",
        users: ["68139e2b2c66a6b42f0ead25", user._id],
      };

      await chatModel.create(chatData);
    }

    const {
      password,
      passwordResetToken,
      passwordResetTokenExpire,
      ...userData
    } = user._doc;

    res.status(200).send({
      success: true,
      message: "Login successfully!",
      user: userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in social auth controller!",
      error,
    });
  }
};

// Logout User
export const logoutUser = async (req, res) => {
  try {
    res.cookie("access_token", "", { maxAge: 1 });
    res.cookie("refresh_token", "", { maxAge: 1 });

    res.status(200).json({
      success: true,
      message: "Logout successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while logout user!",
      error,
    });
  }
};

// Update Access Token
export const updateAccessToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not provided. Please login again.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired refresh token.",
      });
    }

    const user = await userModel
      .findById({ _id: decoded.id })
      .select("-password -passwordResetToken -passwordResetTokenExpire");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please login again.",
      });
    }

    // Update Access Token
    const accessToken = jwt.sign(
      {
        id: user._id,
        user: { _id: user._id, name: user.name, email: user.email },
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    req.user = user;

    return res.status(200).send({
      success: true,
      message: "Tokens refreshed successfully.",
      accessToken,
    });
  } catch (error) {
    console.error("Error updating access token:", error);
    res.status(500).json({
      success: false,
      message: "Failed to refresh tokens. Please try again.",
      error: error.message,
    });
  }
};

// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel
      .find({})
      .select("-password -passwordResetToken -passwordResetTokenExpire");

    res.status(200).send({
      success: true,
      message: "All users list!",
      users: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to get all users. Please try again.",
      error: error.message,
    });
  }
};

// Get User detail
export const getUserDetail = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userModel
      .findById(userId)
      .select("-password -passwordResetToken -passwordResetTokenExpire");

    res.status(200).send({
      success: true,
      message: "User Detail",
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to get user detail. Please try again.",
      error: error.message,
    });
  }
};

// Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, password, number, image } = req.body;

    const file = req?.files;
    const avatar = file?.length > 0 ? file[0]?.location : undefined;

    const user = await userModel
      .findById(userId)
      .select("-password -passwordResetToken -passwordResetTokenExpire");

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found!",
      });
    }

    // Update From S3 Bucket
    if (avatar && avatar !== user?.avatar) {
      const oldMediaKey = user?.avatar.split("/").pop();

      const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: oldMediaKey,
      };

      try {
        await s3.send(new DeleteObjectCommand(deleteParams));
        console.log("Old media deleted from S3 successfully");
      } catch (error) {
        console.error("Error deleting old media from S3:", error);
      }
    }

    const hashedPassword = await hashPassword(password);

    const updateUser = await userModel.findByIdAndUpdate(
      { _id: user._id },
      {
        name: name || user.name,
        email: email || user.email,
        avatar: image || avatar || user.avatar,
        password: hashedPassword || user.password,
        number: number || user.number,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "User Detail",
      user: updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to update user profile. Please try again.",
      error: error.message,
    });
  }
};

// Update Checkout Detail
export const updateCheckoutDetail = async (req, res) => {
  try {
    const userId = req.params.id;
    const { addressDetails, bankDetails } = req.body;

    const user = await userModel
      .findById(userId)
      .select("-password -passwordResetToken -passwordResetTokenExpire");

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found!",
      });
    }

    const updateUser = await userModel.findByIdAndUpdate(
      { _id: user._id },
      {
        addressDetails,
        bankDetails,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Checkout Detail updated successfully!",
      user: updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to update checkout detail. Please try again.",
      error: error.message,
    });
  }
};

// Update Role
export const updateRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role, status } = req.body;

    const user = await userModel
      .findById(userId)
      .select("-password -passwordResetToken -passwordResetTokenExpire");

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found!",
      });
    }

    const updateUser = await userModel.findByIdAndUpdate(
      { _id: user._id },
      {
        role: role || user.role,
        status: status || user.status,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "User updated successfully!",
      user: updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to update user role/status. Please try again.",
      error: error.message,
    });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    console.log("userId", userId);

    const user = await userModel
      .findById(userId)
      .select("-password -passwordResetToken -passwordResetTokenExpire");

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found!",
      });
    }

    await userModel.findByIdAndDelete({ _id: user._id });

    res.status(200).send({
      success: true,
      message: "User deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user. Please try again.",
      error: error.message,
    });
  }
};

// Send Reset Password Token
export const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required!",
      });
    }

    const user = await userModel
      .findOne({ email: email })
      .select(
        "_id name email password passwordResetToken passwordResetTokenExpire"
      );

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Invaild email!",
      });
    }

    // Generate a random token
    const token = createRandomToken();
    const expireIn = Date.now() + 10 * 60 * 1000;
    await userModel.findByIdAndUpdate(user._id, {
      passwordResetToken: token,
      passwordResetTokenExpire: expireIn,
    });

    // Send email to user
    const data = {
      user: {
        name: user.name,
        token: token,
      },
    };

    await sendMail({
      email: user.email,
      subject: "Reset Password",
      template: "reset-password.ejs",
      data,
    });

    res.status(200).send({
      success: true,
      message: "Reset password link send to your email!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "An error occurred while reset the password.",
      error: error,
    });
  }
};

// Update Password
export const updatePassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required.",
      });
    }

    // Check User
    const user = await userModel.findOne({
      passwordResetToken: token,
      passwordResetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(201).send({
        success: false,
        message: "Invalid or expired reset token.",
      });
    }

    // Hashed Password
    const hashedPassword = await hashPassword(newPassword);

    const updatePassword = await userModel.findByIdAndUpdate(
      user._id,
      {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetTokenExpire: null,
      },
      { new: true }
    );

    await updatePassword.save();

    res.status(200).send({
      success: true,
      message: "Password updated successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "An error occurred while updating the password.",
      error: error.message,
    });
  }
};

// Upload file
export const uploadFiles = async (req, res) => {
  try {
    // await uploadMiddleware(req, res);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files were uploaded.",
      });
    }

    const fileUrls = req.files.map((file) => file.location);

    res.status(200).json({
      success: true,
      message: "Files uploaded successfully.",
      files: fileUrls,
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while uploading files.",
      error: error.message,
    });
  }
};

// Get User Info
export const getUserInfo = async (req, res) => {
  try {
    const userId = req.user?._id;
    const user = await userModel
      .findById(userId)
      .select("-password -passwordResetToken -passwordResetTokenExpire");

    res.status(200).send({
      success: true,
      message: "User Detail",
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to get user detail. Please try again.",
      error: error.message,
    });
  }
};

// Add User - Admin Panal
export const addUser = async (req, res) => {
  try {
    const { name, email, password, number, addressDetails, bankDetails } =
      req.body;

    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Name is required!",
      });
    }

    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required!",
      });
    }
    if (!password) {
      return res.status(400).send({
        success: false,
        message: "Password is required!",
      });
    }

    const hashedPassword = await hashPassword(password);

    const customer = await stripe.customers.create({
      email: email,
      name: name,
    });

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      number,
      addressDetails,
      bankDetails,
      stripe_customer_id: customer.id,
    });

    // Create Chat
    var chatData = {
      chatName: "sender",
      users: ["68139e2b2c66a6b42f0ead25", user._id],
    };

    await chatModel.create(chatData);

    res.status(200).send({
      success: true,
      message: "User added successfully!",
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to add user. Please try again.",
      error: error.message,
    });
  }
};

// Update User through Admin Panal
export const updateUserinfo = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, password, number, addressDetails, bankDetails } =
      req.body;

    const existingUser = await userModel.findById(userId);

    if (!existingUser) {
      return res.status(404).send({
        success: false,
        message: "User not found!",
      });
    }

    const hashedPassword = password
      ? await hashPassword(password)
      : existingUser.password;

    const user = await userModel.findByIdAndUpdate(
      { _id: userId },
      {
        name: name || existingUser.name,
        email: email || existingUser.email,
        password: hashedPassword,
        number: number || existingUser.number,
        addressDetails: {
          pincode:
            addressDetails?.pincode || existingUser.addressDetails.pincode,
          city: addressDetails?.city || existingUser.addressDetails.city,
          state: addressDetails?.state || existingUser.addressDetails.state,
          country:
            addressDetails?.country || existingUser.addressDetails.country,
          address:
            addressDetails?.address || existingUser.addressDetails.address,
        },
        bankDetails: {
          accountNumber:
            bankDetails?.accountNumber ||
            existingUser.bankDetails.accountNumber,
          accountHolder:
            bankDetails?.accountHolder ||
            existingUser.bankDetails.accountHolder,
          ifscCode: bankDetails?.ifscCode || existingUser.bankDetails.ifscCode,
        },
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "User info update successfully!",
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to update user info. Please try again.",
      error: error.message,
    });
  }
};

// Delete All Users
export const deleteAllUsers = async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).send({
        success: false,
        message: "No valid user IDs provided.",
      });
    }

    await userModel.deleteMany({
      _id: { $in: userIds },
    });

    res.status(200).send({
      success: true,
      message: "All users deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting users:", error);
    res.status(500).send({
      success: false,
      message: "Error occurred while users notifications. Please try again!",
      error: error.message,
    });
  }
};

// Get All Users Count
export const allUsersCount = async (req, res) => {
  try {
    const currentMonth = new Date();
    const previousMonth = new Date();
    previousMonth.setMonth(previousMonth.getMonth() - 1);

    // Total Count
    const usersCount = await userModel.countDocuments();

    // Current Month User Count
    const currentMonthCount = await userModel.countDocuments({
      createdAt: {
        $gte: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1),
        $lt: new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() + 1,
          1
        ),
      },
    });

    // Previous Month User Count
    const previousMonthCount = await userModel.countDocuments({
      createdAt: {
        $gte: new Date(
          previousMonth.getFullYear(),
          previousMonth.getMonth(),
          1
        ),
        $lt: new Date(
          previousMonth.getFullYear(),
          previousMonth.getMonth() + 1,
          1
        ),
      },
    });

    // Calculate Percentage Change
    const percentageChange =
      previousMonthCount > 0
        ? ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100
        : null;

    res.status(200).send({
      success: true,
      message: "All users count fetched successfully!",
      count: usersCount,
      percentageChange:
        percentageChange !== null
          ? `${percentageChange > 0 ? "+" : ""}${percentageChange.toFixed(2)}%`
          : "N/A",
    });
  } catch (error) {
    console.error("Error get users count:", error);
  }
};

// Get User
export const getUser = async (req, res) => {
  try {
    const users = await userModel.find({}).select("name email avatar");

    res.status(200).send({
      success: true,
      message: "All users list!",
      users: users,
    });
  } catch (error) {
    console.error("Error get user:", error);
  }
};
