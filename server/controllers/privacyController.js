import privacyModel from "../models/privacyModel.js";

// Create Privacy
export const createPrivacy = async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ message: "Please provide a description" });
    }
    const newPrivacy = await privacyModel.create({ description });

    res.status(200).json({
      success: true,
      message: "Privacy created successfully",
      privacy: newPrivacy,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occured while create privacy, please try again!",
      error: error,
    });
  }
};
// Update Privacy
export const updatePrivacy = async (req, res) => {
  try {
    const { description } = req.body;
    const id = req.params.id;
    const privacy = await privacyModel.findByIdAndUpdate(
      id,
      { description },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Privacy detail updated successfully!",
      privacy: privacy,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occured while update privacy, please try again!",
      error: error,
    });
  }
};
// Get Privacy Detail
export const fetchPrivacy = async (req, res) => {
  try {
    const privacy = await privacyModel.findOne({});

    res.status(200).send({
      success: true,
      message: "Privacy detail!",
      privacy: privacy,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occured while get privacy, please try again!",
      error: error,
    });
  }
};

// Delete Privacy
export const deletePrivacy = async (req, res) => {
  try {
    const pid = req.params.id;

    await privacyModel.findByIdAndDelete(pid);

    res.status(200).send({
      success: true,
      message: "Privacy data deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occured while delete privacy, please try again!",
      error: error,
    });
  }
};
