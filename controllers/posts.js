import Post from "../models/posts.js";
import User from "../models/user.js";
import { cloudinaryUpload, cloudinaryDelete } from "../services/cloudinary.js";
import fs from "fs";
import formatPosts from "../utils/formatPosts.js";

/* CREATE */
const createPost = async (req, res) => {
  try {
    const { userId, description } = req.body;
    const { file } = req;
    if (!userId || !file || !description)
      return res.status(400).json({ error: "Inputs required" });
    const { firstName, lastName, location, userPicturePath } =
      await User.findById(userId);
    const { pictureUrl: postPicturePath, picturePublicId: postPictureId } =
      await cloudinaryUpload(file.path);
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
    res.status(409).json({ error: error.message });
  }
};

/* READ */
const getFeedPosts = async (_, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    const formattedPosts = formatPosts(posts);
    res.status(200).json(formattedPosts);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId }).sort({ createdAt: -1 });
    const formattedPosts = formatPosts(posts);
    res.status(200).json(formattedPosts);
  } catch (error) {
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

    let updatedPost = await Post.findByIdAndUpdate(
      postId,
      { likes: post.likes },
      { new: true }
    );

    updatedPost = updatedPost.toJSON();
    const formattedPost = { postId: updatedPost._id, ...updatedPost };
    res.status(201).json(formattedPost);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const editPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, description } = req.body;
    const result = await Post.findById(postId);
    if (!result) return res.status(404).json({ error: "Post not found." });
    if (!(result.userId === userId)) {
      return res
        .status(403)
        .json({ error: "You are not authorized for this action!" });
    }
    let updatedPost = await Post.findByIdAndUpdate(
      postId,
      { description: description },
      { new: true }
    );

    updatedPost = updatedPost.toJSON();
    const formattedPost = { postId: updatedPost._id, ...updatedPost };
    res.status(200).json(formattedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const newComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { comment } = req.body;
    const result = await Post.findById(postId);
    if (!result) return res.status(404).json({ error: "Post not found." });
    const newComments = result.comments.slice();
    newComments.push(comment);
    console.log(newComments);
    let updatedPost = await Post.findByIdAndUpdate(
      postId,
      { comments: newComments },
      { new: true }
    );

    updatedPost = updatedPost.toJSON();
    const formattedPost = { postId: updatedPost._id, ...updatedPost };
    res.status(200).json(formattedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* DELETE */
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;
    const result = await Post.findById(postId);
    if (!result) return res.status(404).json({ error: "Post not found." });
    if (result.userId === userId) {
      const { postPictureId } = result;
      await Promise.all([result.deleteOne(), cloudinaryDelete(postPictureId)]);
      return res.status(200).json({ success: "Post deleted.", result });
    } else
      return res
        .status(403)
        .json({ error: "You are not authorized for this action!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createPost,
  getFeedPosts,
  getUserPosts,
  likePost,
  newComment,
  editPost,
  deletePost,
};
