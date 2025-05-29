import subscriptionModel from "../models/subscriptionModel.js";

// Create a new subscription
export const createSubscription = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const isExisting = await subscriptionModel.findOne({ email });
    if (isExisting) {
      return res.status(400).json({
        message: "This email is already subscribed, use different email",
      });
    }
    const newSubscription = await subscriptionModel.create({ email });
    return res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      data: newSubscription,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

// Get All subscriptions
export const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await subscriptionModel.find();
    return res.status(200).json({
      success: true,
      message: "Subscriptions fetched successfully",
      data: subscriptions,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

// Delete a subscription
export const deleteSubscription = async (req, res) => {
  const subID = req.params.id;

  try {
    const subscription = await subscriptionModel.findById(subID);
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }
    await subscriptionModel.findByIdAndDelete(subID);
    return res.status(200).json({
      success: true,
      message: "Subscription deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};
