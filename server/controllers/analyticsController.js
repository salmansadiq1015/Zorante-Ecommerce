import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import { generateLast12MonthData } from "../utils/analyticsGenerator.js";

// User Analytics
export const userAnalytics = async (req, res) => {
  try {
    const users = await generateLast12MonthData(userModel);

    res.status(200).send({
      success: true,
      message: "user Analytics",
      users: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in users analytics!",
      error,
    });
  }
};

// Order Analytics
export const orderAnalytics = async (req, res) => {
  try {
    const order = await generateLast12MonthData(orderModel);

    res.status(200).send({
      success: true,
      message: "Order Analytics",
      order: order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in order analytics!",
      error,
    });
  }
};
