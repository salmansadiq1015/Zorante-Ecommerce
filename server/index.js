import express from "express";
import cors from "cors";
import colors from "colors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import http from "http";
import db from "./utils/db.js";
import { initialSocketServer } from "./socketServer.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import blogsRoutes from "./routes/BlogRoutes.js";
import privacyRoutes from "./routes/privacyRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import chatRoutes from "./routes/chat/chatRoutes.js";
import messagesRoutes from "./routes/chat/messageRoutes.js";
import accountSettingRoute from "./routes/accountSettingRoute.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import shippingRoutes from "./routes/shippingRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";
import adsRoutes from "./routes/adsRoutes.js";
import contactRoutes from "./routes/contactRoute.js";
import faqRoutes from "./routes/FaqRoutes.js";

// Dotenv Config
dotenv.config();

// Database Config
db();
// Middlewares
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(morgan("dev"));

// Socket Server
const server = http.createServer(app);
initialSocketServer(server);

// Rest API's
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/banners", bannerRoutes);
app.use("/api/v1/blogs", blogsRoutes);
app.use("/api/v1/privacy", privacyRoutes);
app.use("/api/v1/notification", notificationRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/messages", messagesRoutes);
app.use("/api/v1/account", accountSettingRoute);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/coupon", couponRoutes);
app.use("/api/v1/shipping", shippingRoutes);
app.use("/api/v1/card", cardRoutes);
app.use("/api/v1/ads", adsRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/faq", faqRoutes);

// Webhook Endpoint
app.post("/webhook", (req, res) => {
  try {
    const data = req.body;
    console.log("Webhook received:", data);

    res.status(200).send({ success: true, message: "Webhook received." });
  } catch (error) {
    console.error("Webhook error:", error);
    res
      .status(500)
      .send({ success: false, message: "Webhook processing failed." });
  }
});

app.use("/", (req, res) => {
  res.send(`<h1>Server is running...</h1>`);
});

// Listen
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`.bgMagenta.white);
});
