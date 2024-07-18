import { io, userSocketMap } from "../index.js";
import Conversation from "../models/coversation.js";
import Message from "../models/message.js";

const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const { id: senderId } = req.user;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    const messages = conversation?.messages || [];
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in get message controller: ", error.message);
    res.status(404).json({ error: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const { id: senderId } = req.user;
    const { message } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    await Promise.all([newMessage.save(), conversation.save()]);
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
      io.to(receiverSocketId).emit("messageNotification", newMessage);
    }
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in send message controller: ", error.message);
    res.status(404).json({ error: error.message });
  }
};

export { getMessages, sendMessage };
