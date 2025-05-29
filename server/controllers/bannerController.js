import bannerModel from "../models/bannerModel.js";
import dotenv from "dotenv";
dotenv.config();
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../middlewares/uploadFiles.js";

// Create Banner
export const createBanner = async (req, res) => {
  try {
    const file = req.files;
    const fileUrl = file[0].location;

    if (!fileUrl) {
      return res.status(400).send({
        success: false,
        message: "File url is required!",
      });
    }

    const banner = await bannerModel.create({ image: fileUrl });

    res.status(200).send({
      success: true,
      message: "Banner added successfully!",
      banner: banner,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occured while post banner, please try again",
      error: error,
    });
  }
};

// Update Banner
export const updateBanner = async (req, res) => {
  try {
    const bannerId = req.params.id;
    const file = req.files;
    const fileUrl = file[0].location;

    const banner = await bannerModel.findById(bannerId);

    if (!banner) {
      return res.status(404).send({
        success: false,
        message: "Banner not found!",
      });
    }

    //  delete it from the S3 bucket
    if (fileUrl) {
      const oldImageKey = banner.image.split("/").pop(); // Get the file name from the URL

      const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: oldImageKey,
      };

      try {
        await s3.send(new DeleteObjectCommand(deleteParams));
        console.log("Old banner image deleted from S3 successfully.");
      } catch (error) {
        console.error("Error deleting old banner image from S3:", error);
      }
    }

    const updatedBanner = await bannerModel.findByIdAndUpdate(
      bannerId,
      { image: fileUrl },
      { new: true }
    );

    if (!updatedBanner) {
      return res.status(404).send({
        success: false,
        message: "Banner update failed!",
      });
    }

    res.status(200).send({
      success: true,
      message: "Banner updated successfully!",
      banner: updatedBanner,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occurred while updating banner, please try again.",
      error: error,
    });
  }
};

// Fetch All Banners
export const getAllBanners = async (req, res) => {
  try {
    const banners = await bannerModel.find({}).sort({ createdAt: -1 });

    if (!banners.length) {
      return res.status(404).send({
        success: false,
        message: "No banners found.",
      });
    }

    res.status(200).send({
      success: true,
      banners: banners,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occurred while fetching banners, please try again.",
      error: error,
    });
  }
};

// Fetch Single Banner
export const getSingleBanner = async (req, res) => {
  try {
    const bannerId = req.params.id;

    const banner = await bannerModel.findById(bannerId);

    if (!banner) {
      return res.status(404).send({
        success: false,
        message: "Banner not found.",
      });
    }

    res.status(200).send({
      success: true,
      banner: banner,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occurred while fetching banner, please try again.",
      error: error,
    });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const bannerId = req.params.id;

    const banner = await bannerModel.findById(bannerId);

    if (!banner) {
      return res.status(404).send({
        success: false,
        message: "Banner not found!",
      });
    }

    if (banner.image) {
      const imageKey = banner.image.split("/").pop();

      const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: imageKey,
      };

      try {
        await s3.send(new DeleteObjectCommand(deleteParams));
        console.log("Banner image deleted from S3 successfully.");
      } catch (error) {
        console.error("Error deleting banner image from S3:", error);
      }
    }

    await bannerModel.findByIdAndDelete(bannerId);

    res.status(200).send({
      success: true,
      message: "Banner deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occurred while deleting banner, please try again.",
      error: error,
    });
  }
};
