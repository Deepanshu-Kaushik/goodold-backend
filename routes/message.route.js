import express from "express";
import {
  getMessages,
  getConversations,
  sendMessage,
  markAsRead,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/:id", getMessages);
router.get("/conversations/:id", getConversations);
router.post("/send/:id", sendMessage);
router.put('/message-read/:id', markAsRead)

export default router;
