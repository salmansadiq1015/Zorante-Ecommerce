import cardModel from "../models/cardModel.js";

// Create a new payment card
export const createCard = async (req, res) => {
  try {
    const { name, card_number, cvv, expiry_date, zip_code } = req.body;

    const userId = req.user._id;

    if (!name || !card_number || !cvv || !expiry_date || !zip_code) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const card = new cardModel({
      user: userId,
      name,
      card_number,
      cvv,
      expiry_date,
      zip_code,
    });

    await card.save();

    res.status(200).json({
      success: true,
      message: "Card information created successfully",
      card: card,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating card" });
  }
};

// Update a payment card
export const updateCard = async (req, res) => {
  try {
    const cardId = req.params.id;
    const { name, card_number, cvv, expiry_date, zip_code } = req.body;

    const isCardExists = await cardModel.findById({ _id: cardId });

    if (!isCardExists) {
      return res
        .status(404)
        .json({ success: false, message: "Payment information not found!" });
    }

    const card = await cardModel.findByIdAndUpdate(
      { _id: isCardExists._id },
      {
        name: name || isCardExists.name,
        card_number: card_number || isCardExists.card_number,
        cvv: cvv || isCardExists.cvv,
        expiry_date: expiry_date || isCardExists.expiry_date,
        zip_code: zip_code || isCardExists.zip_code,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Card information updated successfully",
      card,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating card information" });
  }
};

// Delete a payment card
export const deleteCard = async (req, res) => {
  try {
    const cardId = req.params.id;

    const isCardExists = await cardModel.findById(cardId);

    if (!isCardExists) {
      return res
        .status(404)
        .json({ success: false, message: "Payment information not found!" });
    }

    await cardModel.findByIdAndDelete({ _id: cardId });

    res.status(200).json({
      success: true,
      message: "Card information deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting card" });
  }
};

// Get all payment cards
export const getAllCards = async (req, res) => {
  try {
    const cards = await cardModel.find().populate("user", "name email avatar");

    res.status(200).json({ success: true, cards });
  } catch (error) {
    res.status(500).json({ message: "Error getting all cards" });
  }
};

// Get a payment card by ID
export const getCardInformation = async (req, res) => {
  try {
    const userId = req.params.id;

    const card = await cardModel
      .find({ user: userId })
      .populate("user", "name email avatar");

    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Payment information not found!" });
    }

    res.status(200).json({ success: true, message: "Card Information", card });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting card by ID" });
  }
};
