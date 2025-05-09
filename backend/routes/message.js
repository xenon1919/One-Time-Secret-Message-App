import express from "express";
import { v4 as uuidv4 } from "uuid";
import Message from "../models/Message.js";

const router = express.Router();

// POST /api/message
router.post("/", async (req, res) => {
  const { content, ttl } = req.body;
  if (!content || typeof content !== "string") {
    return res
      .status(400)
      .json({ error: "Content is required and must be a string" });
  }
  if (ttl && (typeof ttl !== "number" || ttl <= 0)) {
    return res.status(400).json({ error: "TTL must be a positive number" });
  }
  const id = uuidv4();
  try {
    const message = new Message({ id, content, ttl });
    await message.save();
    console.log(
      "Created message with ID:",
      id,
      "TTL:",
      ttl,
      "CreatedAt:",
      message.createdAt
    );
    res.json({ id });
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({ error: "Failed to save message" });
  }
});

// GET /api/message/:id
router.get("/:id", async (req, res) => {
  try {
    const message = await Message.findOne({ id: req.params.id });
    if (!message) {
      console.log("Message not found for ID:", req.params.id);
      return res.status(404).json({ error: "Message not found" });
    }

    const now = new Date();
    const expiration = new Date(
      message.createdAt.getTime() + message.ttl * 60000
    );
    console.log(
      "Message ID:",
      req.params.id,
      "Viewed:",
      message.viewed,
      "Expired:",
      now > expiration,
      "Now:",
      now,
      "CreatedAt:",
      message.createdAt,
      "Expiration:",
      expiration,
      "TTL:",
      message.ttl
    );

    if (message.viewed || now > expiration) {
      await Message.deleteOne({ id: req.params.id });
      return res.status(410).json({ error: "Message expired or already read" });
    }

    message.viewed = true;
    await message.save();
    res.json({ content: message.content });
  } catch (err) {
    console.error("Error retrieving message:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
