// controllers/contactController.js
import ContactMessage from "../models/contactMessage.js";

export const submitContactForm = async (req, res) => {
  console.log("Received data:", req.body); // Log the received data

  try {
    const { name, email, message } = req.body;

    // Validate email format
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: "Invalid email address." });
    }

    // Create new contact message
    const newMessage = new ContactMessage({ name, email, message });
    await newMessage.save();

    res.status(200).json({ message: "Message sent successfully." });
  } catch (error) {
    console.error("Error:", error); // Log error for debugging
    res.status(500).json({ message: "Internal server error." });
  }
};
