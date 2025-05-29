import express from "express";
import { isAdmin, isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  addAccountSetting,
  editAccountSetting,
  getAccountSetting,
} from "../controllers/accountSettingController.js";

const router = express.Router();

// Add Account
router.post("/account-setting", isAuthenticated, isAdmin, addAccountSetting);

// Update Account
router.put(
  "/account-setting/:id",
  isAuthenticated,
  isAdmin,
  editAccountSetting
);

// Fetch Account
router.get("/account-setting", getAccountSetting);

export default router;
