import { DateTime } from 'luxon';
import { io, userSocketMap } from '../index.js';
import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';
import User from '../models/user.model.js';

const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const { id: senderId } = req.user;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate('messages');

    const messages = conversation?.messages || [];
    res.status(200).json(messages);
  } catch (error) {
    console.log('Error in get message controller: ', error.message);
    res.status(404).json({ error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const { friendId } = req.body;
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, friendId] },
    }).populate('participants', '-password');
    conversation.numberOfUnread.set(userId, 0);
    conversation.messageSeenAt.set(userId, DateTime.now().toISO());
    const receiverSocketId = userSocketMap[friendId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('messageSeen', conversation.messageSeenAt.get(userId));
    }
    await conversation.save();
    const otherParticipants = conversation.participants.filter((participant) => participant._id.toString() !== userId);

    res.status(200).json({
      ...conversation.toJSON(),
      participants: otherParticipants[0],
    });
  } catch (error) {
    console.log('Error in get message controller: ', error.message);
    res.status(404).json({ error: error.message });
  }
};

const getConversations = async (req, res) => {
  try {
    const { id: userId } = req.params;
    let conversations = await Conversation.find({
      participants: { $all: [userId] },
    })
      .populate('participants', '-password')
      .sort({ updatedAt: -1 });

    conversations = conversations.map((conversation) => {
      const otherParticipants = conversation.participants.filter(
        (participant) => participant._id.toString() !== userId,
      );

      return {
        ...conversation.toJSON(),
        participants: otherParticipants[0],
      };
    });

    res.status(200).json(conversations);
  } catch (error) {
    console.log('Error in get message controller: ', error.message);
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
    conversation.messageSeenAt.delete(senderId);
    conversation.messageSeenAt.delete(receiverId);

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });
    if (newMessage) {
      conversation.messages.push(newMessage._id);
      conversation.latestMessage = message;
      conversation.numberOfUnread.set(receiverId, (conversation.numberOfUnread.get(receiverId) || 0) + 1);
    }
    await Promise.all([newMessage.save(), conversation.save()]);
    const receiverSocketId = userSocketMap[receiverId];
    const senderData = await User.findById(newMessage.senderId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', newMessage);
      io.to(receiverSocketId).emit('chatRoomMessage', newMessage);
      io.to(receiverSocketId).emit('messageNotification', {newMessage, senderData});
    }
    res.status(201).json(newMessage);
  } catch (error) {
    console.log('Error in send message controller: ', error.message);
    res.status(404).json({ error: error.message });
  }
};

export { getMessages, getConversations, sendMessage, markAsRead };
