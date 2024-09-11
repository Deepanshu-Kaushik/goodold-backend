import Notification from '../models/notification.model.js';
import Post from '../models/posts.model.js';
import User from '../models/user.model.js';
import { createNotificationWithType } from '../utils/create-notification-with-type.util.js';

export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    await Notification.updateMany({ notificationRead: false }, { notificationRead: true });
    res.status(200).json(notifications);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

export const createLikeNotification = async (req, res) => {
  try {
    const typeOfNotification = 'like';
    const { userId, createrId, postId } = req.body;
    if (!userId || !createrId || !postId || userId === createrId)
      return res.status(400).json({ error: 'Invalid request! Please try again' });

    const user = await User.findById(createrId).select(['firstName', 'lastName', 'userPicturePath']);
    if (!user) return res.status(404).json({ error: 'User not found! Please try again.' });

    const { firstName, lastName, userPicturePath } = user;
    const notificationText = createNotificationWithType(typeOfNotification, { firstName, lastName });
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found! Please try again.' });
    if (post.userId !== userId) return res.status(404).json({ error: 'User not found! Please try again.' });
    await Notification.create({
      typeOfNotification,
      userId,
      createrId,
      notificationText,
      postId,
      userPicturePath,
    });
    res.status(201).json({ message: 'Like notification sent successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

export const createCommentNotification = async (req, res) => {
  try {
    const typeOfNotification = 'comment';
    const { userId, createrId, postId, commentOnPost, commentId } = req.body;
    if (!userId || !createrId || !postId || userId === createrId)
      return res.status(400).json({ error: 'Invalid request! Please try again' });

    if (!commentOnPost) return res.status(400).json({ error: 'Comment is required' });

    const user = await User.findById(createrId).select(['firstName', 'lastName', 'userPicturePath']);
    if (!user) return res.status(404).json({ error: 'User not found! Please try again.' });

    const { firstName, lastName, userPicturePath } = user;
    const notificationText = createNotificationWithType(typeOfNotification, { firstName, lastName });
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found! Please try again.' });
    if (post.userId !== userId) return res.status(404).json({ error: 'User not found! Please try again.' });
    await Notification.create({
      typeOfNotification,
      userId,
      createrId,
      notificationText,
      postId,
      commentOnPost,
      userPicturePath,
      commentId,
    });
    res.status(201).json({ message: 'Comment notification sent successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

export const createFriendRequestNotification = async (req, res) => {
  const typeOfNotification = 'friend-request';
  try {
    const { userId, createrId } = req.body;
    if (!userId || !createrId || userId === createrId)
      return res.status(400).json({ error: 'Invalid request! Please try again' });

    const user = await User.findById(createrId).select(['firstName', 'lastName', 'userPicturePath']);
    if (!user) return res.status(404).json({ error: 'User not found! Please try again.' });

    const notification = await Notification.findOne({
      typeOfNotification,
      userId,
      createrId,
    });
    if (notification) return res.status(201).json({ message: 'Friend request notification sent successfully' });

    const { firstName, lastName, userPicturePath } = user;
    const notificationText = createNotificationWithType(typeOfNotification, { firstName, lastName });
    await Notification.create({
      typeOfNotification,
      userId,
      createrId,
      notificationText,
      userPicturePath,
      acceptedFriendRequest: false,
    });
    res.status(201).json({ message: 'Friend request notification sent successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const deleteStatus = await Notification.findByIdAndDelete(notificationId);
    const notifications = await Notification.find({ userId: deleteStatus.userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

export const clearAllNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: 'Invalid request! Please try again' });
    await Notification.deleteMany({ userId });
    res.status(200).json({ message: 'Cleared all notifications successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

export const removeNotification = async (req, res) => {
  try {
    const { userId, postId, typeOfNotification, createrId } = req.body;
    if (!userId || !typeOfNotification || !createrId)
      return res.status(400).json({ error: 'Invalid request! Please try again' });
    if (typeOfNotification === 'like' || typeOfNotification === 'comment') {
      if (!postId) return res.status(400).json({ error: 'Invalid request! Please try again' });
      await Notification.deleteMany({ userId, postId, typeOfNotification, createrId });
    } else {
      await Notification.findOneAndDelete({ userId, createrId, typeOfNotification });
    }
    return res.status(200).json({ message: 'Removed junk notifications successfully' });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
};
