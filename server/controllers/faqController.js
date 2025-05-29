import faqModel from "../models/faqModel.js";

// Create FAQ
export const addFAQ = async (req, res) => {
  try {
    const { question, answer, category } = req.body;

    const faq = await faqModel.create({
      question,
      answer,
      category,
    });

    res.status(200).send({
      success: true,
      message: "FAQ added successfully!",
      faq: faq,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occur while adding FAQ, please try again!",
      error: error.message,
    });
  }
};

// Update FAQ
export const updateFAQ = async (req, res) => {
  try {
    const faqId = req.params.id;
    const { question, answer, category } = req.body;

    const faq = await faqModel.findByIdAndUpdate(
      { _id: faqId },
      {
        question: question || faq.question,
        answer: answer || faq.answer,
        category: category || faq.category,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "FAQ updated successfully!",
      faq: faq,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occur while updating FAQ, please try again!",
      error: error.message,
    });
  }
};

// Get All FAQ
export const getAllFAQ = async (req, res) => {
  try {
    const faqs = await faqModel.find({});
    res
      .status(200)
      .json({ success: true, message: "All FAQ list!", faqs: faqs });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch FAQ",
      error: error.message,
    });
  }
};

// Delete FAQ
export const deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    await faqModel.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "FAQ deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete FAQ",
      error: error.message,
    });
  }
};
