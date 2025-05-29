import express from "express";
import {
  addContact,
  deleteContact,
  getAllContacts,
  getContact,
  getUserContacts,
  updateContact,
} from "../controllers/contactController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Add Contact
router.post("/add", isAuthenticated, addContact);

// Update Contact
router.put("/update/:id", isAuthenticated, updateContact);

// Get All Contact
router.get("/all", getAllContacts);

// Get User Contact
router.get("/user/:id", getUserContacts);

// Get Contact Detail
router.get("/detail/:id", getContact);

// Delete Contact
router.delete("/delete/:id", isAuthenticated, deleteContact);

export default router;
