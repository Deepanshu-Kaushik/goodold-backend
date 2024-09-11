import Post from '../models/posts.model.js';
import User from '../models/user.model.js';
import { cloudinaryUpload, cloudinaryDelete } from '../services/cloudinary.service.js';
import fs from 'fs';
import formatPosts from '../utils/formatPosts.util.js';
import Comment from '../models/comment.model.js';
import Notification from '../models/notification.model.js';

/* CREATE */
const createPost = async (req, res) => {
  try {
    const { userId, description } = req.body;
    const { file } = req;
    if (!userId || !file) return res.status(400).json({ error: 'Inputs required' });
    const { firstName, lastName, location, userPicturePath } = await User.findById(userId);
    const { pictureUrl: postPicturePath, picturePublicId: postPictureId } = await cloudinaryUpload(file.path);
    fs.unlinkSync(req.file.path);
    const newPost = new Post({
      userId,
      firstName,
      lastName,
      location,
      userPicturePath,
      description,
      postPicturePath,
      postPictureId,
      likes: {},
      comments: [],
    });
    await newPost.save();

    let post = await Post.find().sort({ createdAt: -1 }).limit(1);
    const formattedPost = formatPosts(post);
    res.status(201).json(formattedPost[0]);
  } catch (error) {
    console.log(error.message);
    fs.unlinkSync(req.file.path);
    res.status(404).json({ error: error.message });
  }
};

/* READ */
const getFeedPosts = async (_, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: 'comments',
        options: { sort: { createdAt: 1 } },
      });
    const formattedPosts = formatPosts(posts);
    res.status(200).json(formattedPosts);
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ error: error.message });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'comments',
        options: { sort: { createdAt: 1 } },
      });
    const formattedPosts = formatPosts(posts);
    res.status(200).json(formattedPosts);
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ error: error.message });
  }
};

/* UPDATE */
const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(postId);
    const isLiked = post.likes.get(userId);
    if (isLiked) post.likes.delete(userId);
    else post.likes.set(userId, true);

    let updatedPost = await Post.findByIdAndUpdate(postId, { likes: post.likes }, { new: true }).populate({
      path: 'comments',
      options: { sort: { createdAt: 1 } },
    });

    updatedPost = updatedPost.toJSON();
    const formattedPost = { postId: updatedPost._id, ...updatedPost };
    res.status(201).json(formattedPost);
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ error: error.message });
  }
};

const editPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, description } = req.body;
    const result = await Post.findById(postId);
    if (!result) return res.status(404).json({ error: 'Post not found.' });
    if (!(result.userId === userId)) {
      return res.status(403).json({ error: 'You are not authorized for this action!' });
    }
    let updatedPost = await Post.findByIdAndUpdate(postId, { description: description }, { new: true }).populate({
      path: 'comments',
      options: { sort: { createdAt: 1 } },
    });

    updatedPost = updatedPost.toJSON();
    const formattedPost = { postId: updatedPost._id, ...updatedPost };
    res.status(200).json(formattedPost);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

const newComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { comment, userId } = req.body;
    const userPromise = User.findById(userId).select(['firstName', 'lastName']);
    const resultPromise = Post.findById(postId);
    const [user, result] = await Promise.all([userPromise, resultPromise]);
    const { firstName, lastName } = user;
    if (!result) return res.status(404).json({ error: 'Post not found.' });
    const newComment = await Comment.create({
      whoCommented: firstName + ' ' + lastName,
      comment,
      userId,
    });
    if (newComment) result.comments.push(newComment._id);
    await result.save();
    let updatedPost = await Post.findById(postId).populate({
      path: 'comments',
      options: { sort: { createdAt: 1 } },
    });
    updatedPost = updatedPost.toJSON();
    const formattedPost = { postId: updatedPost._id, ...updatedPost };
    res.status(200).json({ updatedPost: formattedPost, newComment });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

/* DELETE */
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;
    const result = await Post.findById(postId);
    if (!result) return res.status(404).json({ error: 'Post not found.' });
    if (result.userId === userId) {
      const { postPictureId } = result;
      await Promise.all([result.deleteOne(), cloudinaryDelete(postPictureId), Notification.deleteMany({ postId })]);
      return res.status(200).json({ success: 'Post deleted.', result });
    } else return res.status(403).json({ error: 'You are not authorized for this action!' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const { userId } = req.body;
  if (!commentId) {
    return res.status(404).json({ error: 'Comment not found.' });
  }

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found.' });
    }
    if (comment.userId !== userId) {
      return res.status(404).json({ error: 'You are not authorized to delete this comment.' });
    }

    await Promise.all([Comment.findByIdAndDelete(commentId), Notification.deleteOne({ commentId })]);

    let updatedPost = await Post.findOneAndUpdate(
      { comments: commentId },
      { $pull: { comments: commentId } },
      { new: true },
    ).populate('comments');
    updatedPost = updatedPost.toJSON();
    const formattedPost = { postId: updatedPost._id, ...updatedPost };
    return res.status(200).json({ success: 'Comment deleted successfully', updatedPost: formattedPost });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return res.status(500).json({ error: error.message });
  }
};

export { createPost, getFeedPosts, getUserPosts, likePost, newComment, editPost, deletePost, deleteComment };
