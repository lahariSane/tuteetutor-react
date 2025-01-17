// models/contactMessage.js
import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);

export default ContactMessage;
