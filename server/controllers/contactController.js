import contactModel from "../models/contactModel.js";

// Add Contact message
export const addContact = async (req, res) => {
  try {
    const { subject, message, orderId } = req.body;

    const contact = await contactModel.create({
      subject,
      message,
      orderId,
      user: req.user._id,
    });

    res.status(200).send({
      success: true,
      message: "Contact message added successfully!",
      contact: contact,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occur while adding contact message, please try again!",
      error: error.message,
    });
  }
};

// Update Contact Message
export const updateContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    const { status, message, orderId, subject } = req.body;

    const contact = await contactModel.findByIdAndUpdate(
      { _id: contactId },
      {
        status: status || contact.status,
        message: message || contact.message,
        orderId: orderId || contact.orderId,
        subject: subject || contact.subject,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Contact message updated successfully!",
      contact: contact,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occur while updating contact message, please try again!",
      error: error.message,
    });
  }
};

// Get All Contact Messages
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await contactModel.find({});
    res
      .status(200)
      .json({ success: true, message: "All contact messages list!", contacts });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch contact messages",
      error: error.message,
    });
  }
};

// Get User Contact Messages
export const getUserContacts = async (req, res) => {
  try {
    const userId = req.params.id;
    const contacts = await contactModel.find({ user: userId });
    res.status(200).json({
      success: true,
      message: "User contact messages list!",
      contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user contact messages",
      error: error.message,
    });
  }
};

// Get Contact Message
export const getContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    const contact = await contactModel.findById(contactId);
    res
      .status(200)
      .send({ success: true, message: "Contact message detail!", contact });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch contact message detail!",
      error: error.message,
    });
  }
};

// Delete Contact Message
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    await contactModel.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Contact message deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete contact message",
      error: error.message,
    });
  }
};
