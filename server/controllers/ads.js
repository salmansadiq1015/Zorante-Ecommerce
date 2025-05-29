import adsModel from "../models/adsModel.js";
import dotenv from "dotenv";
dotenv.config();
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../middlewares/uploadFiles.js";

// Post Video
export const createAds = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files were uploaded.",
      });
    }

    const fileUrls = req.files.map((file) => file.location);

    const video = await adsModel.create({ videoURL: fileUrls[0] });

    res.status(200).json({
      success: true,
      message: "Files uploaded successfully.",
      videoURL: video.videoURL,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Server Error",
      error: error,
    });
  }
};

// Get Video
export const getVideo = async (req, res) => {
  try {
    const video = await adsModel.findOne({ status: true });
    res.status(200).json({
      success: true,
      video: video,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error,
    });
  }
};

// Get Admin Video
export const getAdminVideo = async (req, res) => {
  try {
    const video = await adsModel.findOne({});
    res.status(200).json({
      success: true,
      video: video,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error,
    });
  }
};

// Update Video
export const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;

    try {
      if (!req.files || req?.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files were uploaded.",
        });
      }

      const fileUrls = req?.files?.map((file) => file.location);

      const video = await adsModel.findById(id);

      if (!video) {
        return res.status(404).json({
          success: false,
          message: "Video not found.",
        });
      }

      // Handle deletion of old thumbnails
      if (video.videoURL) {
        const oldKey = video.videoURL.split("/").pop();
        try {
          await s3.send(
            new DeleteObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: oldKey,
            })
          );
          console.log(`Old video deleted successfully: ${oldKey}`);
        } catch (error) {
          console.error("Error deleting old video from S3:", error);
          return res.status(500).json({
            success: false,
            message:
              "Error occurred while deleting the old video. Please try again.",
            error: error.message,
          });
        }
      }

      const videoURL = await adsModel.findByIdAndUpdate(
        id,
        {
          videoURL: fileUrls[0],
        },
        { new: true }
      );

      return res
        .status(200)
        .send({ success: true, message: "Video updated", videoURL });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update Video Status
export const updateVideoStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const video = await adsModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Video status updated.",
      video,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
