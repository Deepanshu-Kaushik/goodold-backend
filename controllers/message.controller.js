import { DateTime } from 'luxon';
import { io, userSocketMap } from '../index.js';
import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';
import User from '../models/user.model.js';
import fs from 'fs';
import { cloudinaryDeleteFolder, cloudinaryUploadToFolder } from '../services/cloudinary.service.js';

const participantsFolderString = (s1, s2) => {
  return s1 < s2 ? `${s1}_${s2}` : `${s2}_${s1}`;
};

export const getMessages = async (req, res) => {
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

export const markAsRead = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const { friendId } = req.body;
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, friendId] },
    }).populate('participants', '-password');
    if (!!conversation.messages.length) {
      conversation.numberOfUnread.set(userId, 0);
      conversation.messageSeenAt.set(userId, DateTime.now().toISO());
      const receiverSocketId = userSocketMap[friendId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('messageSeen', conversation.messageSeenAt.get(userId));
      }
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

export const getConversations = async (req, res) => {
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

export const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const { id: senderId } = req.user;
    const { message } = req.body;
    const { file } = req;

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

    let chatPictureId, chatPicturePath;
    if (req.file) {
      const { pictureUrl, picturePublicId } = await cloudinaryUploadToFolder(
        file.path,
        participantsFolderString(senderId, receiverId),
      );
      fs.unlinkSync(file.path);
      chatPicturePath = pictureUrl;
      chatPictureId = picturePublicId;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      chatPictureId,
      chatPicturePath,
    });
    if (newMessage) {
      conversation.messages.push(newMessage._id);
      conversation.latestMessage = message;
      conversation.numberOfUnread.set(receiverId, (conversation.numberOfUnread.get(receiverId) || 0) + 1);
    }
    await Promise.all([newMessage.save(), conversation.save()]);
    const receiverSocketId = userSocketMap[receiverId];
    const senderData = await User.findById(newMessage.senderId);
    if (receiverSocketId) io.to(receiverSocketId).emit('messageNotification', { newMessage, senderData });
    res.status(201).json(newMessage);
  } catch (error) {
    console.log('Error in send message controller: ', error.message);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(404).json({ error: error.message });
  }
};

export const clearConversation = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    if (!senderId || !receiverId) return res.status(400).json({ error: 'Invalid request! Please try again' });
    const deleteParticipantsCloudinaryFolder = cloudinaryDeleteFolder(participantsFolderString(senderId, receiverId));
    const sendersMessages = Message.deleteMany({
      senderId,
      receiverId,
    });
    const receiversMessages = Message.deleteMany({
      senderId: receiverId,
      receiverId: senderId,
    });
    const conversation = Conversation.updateOne(
      { participants: { $all: [senderId, receiverId] } },
      {
        messages: [],
        numberOfUnread: {},
        latestMessage: '',
        messageSeenAt: {},
      },
    );
    await Promise.all([deleteParticipantsCloudinaryFolder, sendersMessages, receiversMessages, conversation]);
    return res.status(200).json({ message: 'Cleared the conversation successfully' });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
};
