import BlogModel from "../models/BlogModel.js";
import dotenv from "dotenv";
dotenv.config();
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../middlewares/uploadFiles.js";

// Create Blogs
export const createBlogs = async (req, res) => {
  try {
    const { title, description, published } = req.body;
    const file = req.files;
    const fileUrl = file[0].location;

    if (!title) {
      return res.status(400).send({
        success: false,
        message: "Blog title is required!",
      });
    }

    if (!fileUrl) {
      return res.status(400).send({
        success: false,
        message: "Thumbnail is required!",
      });
    }

    const blog = await BlogModel.create({
      title,
      description,
      published,
      thumbnail: fileUrl,
    });

    res.status(200).send({
      success: true,
      message: "Blog posted successfully!",
      blog: blog,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occured while create blogs, please try again!",
      error: error,
    });
  }
};

// Update Blogs
export const updateBlogs = async (req, res) => {
  try {
    const blogId = req.params.id;
    const { title, description, published } = req.body;
    const file = req.files;
    const fileUrl = file && file[0] ? file[0].location : null;

    const existingBlog = await BlogModel.findById(blogId);

    if (!existingBlog) {
      return res.status(404).send({
        success: false,
        message: "Blog not found!",
      });
    }

    //  delete it from the S3 bucket
    if (fileUrl) {
      const oldImageKey =
        existingBlog.thumbnail && existingBlog.thumbnail.split("/").pop();

      const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: oldImageKey,
      };

      try {
        await s3.send(new DeleteObjectCommand(deleteParams));
        console.log("Old blog image deleted from S3 successfully.");
      } catch (error) {
        console.error("Error deleting old blog image from S3:", error);
      }
    }

    const updateBlog = await BlogModel.findByIdAndUpdate(
      { _id: blogId },
      {
        title: title || existingBlog.title,
        description: description || existingBlog.description,
        published: published || existingBlog.published,
        thumbnail: fileUrl || existingBlog.thumbnail,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Blog update successfully!",
      blog: updateBlog,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occured while update blogs, please try again!",
      error: error,
    });
  }
};

// Get All Banners
export const fetchBlogs = async (req, res) => {
  try {
    const blogs = await BlogModel.find({}).sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "Blogs list!",
      blogs: blogs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occured while get blogs, please try again!",
      error: error,
    });
  }
};

// Get Single Banner
export const fetchSingleBlog = async (req, res) => {
  try {
    const blogId = req.params.id;

    const blog = await BlogModel.findById(blogId);

    if (!blog) {
      return res.status(404).send({
        success: false,
        message: "Blog not found!",
      });
    }

    res.status(200).send({
      success: true,
      message: "Blog Detail!",
      blog: blog,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occured while get single blog, please try again!",
      error: error,
    });
  }
};

// Delete Banner
export const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;

    const blog = await BlogModel.findById(blogId);

    if (!blog) {
      return res.status(404).send({
        success: false,
        message: "Blog not found!",
      });
    }

    //  delete it from the S3 bucket
    if (blog.thumbnail) {
      const oldImageKey = blog.thumbnail && blog.thumbnail.split("/").pop();

      const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: oldImageKey,
      };

      try {
        await s3.send(new DeleteObjectCommand(deleteParams));
        console.log("Old blog image deleted from S3 successfully.");
      } catch (error) {
        console.error("Error deleting old blog image from S3:", error);
      }
    }

    await BlogModel.findByIdAndDelete(blogId);

    res.status(200).send({
      success: true,
      message: "Blog deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occured while delete blog, please try again!",
      error: error,
    });
  }
};
