import ShippingModel from "../models/ShippingModel.js";

// Add Shipping
export const addShipping = async (req, res) => {
  const { country, fee } = req.body;
  if (!country || !fee) {
    return res
      .status(400)
      .json({ message: "Please provide country name and fee" });
  }

  const isExisting = await ShippingModel.findOne({ country: country });

  if (isExisting) {
    return res.status(400).json({ message: "Shipping already exists" });
  }

  try {
    const shipping = new ShippingModel({ country, fee });
    shipping.save();
    return res
      .status(201)
      .json({ success: true, message: "Shipping Added", shipping });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update Shipping
export const updateShipping = async (req, res) => {
  const { id } = req.params;
  const { country, fee } = req.body;
  try {
    const shipping = await ShippingModel.findByIdAndUpdate(
      { _id: id },
      { country, fee },
      { new: true }
    );

    return res
      .status(201)
      .json({ success: true, message: "Shipping Added", shipping });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete Shipping
export const deleteShipping = async (req, res) => {
  const { id } = req.params;
  try {
    const shipping = await ShippingModel.findByIdAndDelete(id);
    return res.status(201).json({ success: true, message: "Shipping Deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get All Shipping
export const getShipping = async (req, res) => {
  try {
    const shippings = await ShippingModel.find({});
    return res
      .status(200)
      .json({ success: true, message: "Shipping Found", shippings: shippings });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Shipping By Country
export const getShippingByCountry = async (req, res) => {
  try {
    const { country } = req.params;
    const shipping = await ShippingModel.findOne({ country: country });
    return res.status(200).json({
      success: true,
      shipping: shipping,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
