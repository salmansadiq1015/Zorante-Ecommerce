import CategoryModel from "../models/CategoryModel.js";
import dotenv from "dotenv";
dotenv.config();
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../middlewares/uploadFiles.js";

// Create Category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const file = req.files;
    const fileUrl = file[0].location;

    if (!fileUrl) {
      return res.status(400).send({
        success: false,
        message: "Category image is required!",
      });
    }

    const isExisting = await CategoryModel.findOne({ name: name });
    if (isExisting) {
      return res.status(400).send({
        success: false,
        message: "Category with this name already exist!",
      });
    }

    const newCategory = await CategoryModel.create({ name, image: fileUrl });

    res.status(200).send({
      success: true,
      message: "Category added successfully!",
      category: newCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occoured in create category. Please try again.",
    });
  }
};

// Update Category
export const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name } = req.body;

    const file = req.files;
    const fileUrl = file && file.length > 0 ? file[0].location : null;

    const category = await CategoryModel.findById(categoryId);

    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found!",
      });
    }

    // Update From S3 Bucket
    if (fileUrl && fileUrl !== category.fileUrl) {
      const oldMediaKey = category.image.split("/").pop();

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

    const updateCategory = await CategoryModel.findByIdAndUpdate(
      category._id,
      {
        name: name || category.name,
        image: fileUrl || category.image,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Category update successfully!",
      category: updateCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occoured in update category. Please try again.",
    });
  }
};

// Get All Category
export const fetchAllCategory = async (req, res) => {
  try {
    const categories = await CategoryModel.find({}).sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "All categories list!",
      categories: categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occoured in get all categories. Please try again.",
    });
  }
};

// Get Single Category
export const categoryDetail = async (req, res) => {
  try {
    const id = req.params.id;

    const category = await CategoryModel.findById({ _id: id });

    res.status(200).send({
      success: true,
      message: "Category detail.",
      category: category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occoured in get single category. Please try again.",
    });
  }
};

// Delete Category
export const removeCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await CategoryModel.findById(categoryId);

    // Delet Image From S3 Bucket
    if (category.image) {
      const oldMediaKey = category.image && category.image.split("/").pop();

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

    await CategoryModel.findByIdAndDelete({ _id: category._id });

    res.status(200).send({
      success: true,
      message: "Category deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occoured in delete category. Please try again.",
    });
  }
};

// Delete All Category
export const deleteAllCategory = async (req, res) => {
  try {
    const { categoryIds } = req.body;

    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      return res.status(400).send({
        success: false,
        message: "No valid category IDs provided.",
      });
    }

    await CategoryModel.deleteMany({
      _id: { $in: categoryIds },
    });

    res.status(200).send({
      success: true,
      message: "All categories deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting categories:", error);
    res.status(500).send({
      success: false,
      message:
        "Error occurred while categories notifications. Please try again!",
      error: error.message,
    });
  }
};
