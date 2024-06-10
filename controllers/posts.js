import Post from "../models/posts.js";
import User from "../models/user.js";
import { cloudinaryUpload, cloudinaryDelete } from "../services/cloudinary.js";
import fs from "fs";
import formatPosts from "../utils/formatPosts.js";

/* CREATE */
const createPost = async (req, res) => {
  try {
    const { userId, description } = req.body;
    const { firstName, lastName, location, userPicturePath } =
      await User.findById(userId);
    const postPicturePath = await cloudinaryUpload(req.file.path);
    fs.unlinkSync(req.file.path);
    const newPost = new Post({
      userId,
      firstName,
      lastName,
      location,
      userPicturePath,
      description,
      postPicturePath,
      likes: {},
      comments: [],
    });

    await newPost.save();
    const posts = await Post.find();
    const formattedPosts = formatPosts(posts);
    res.status(201).json(formattedPosts);
  } catch (error) {
    console.log(error.message);
    res.status(409).json({ error: err.message });
  }
};

/* READ */
const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    const formattedPosts = formatPosts(posts);
    res.status(200).json(formattedPosts);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId });
    const formattedPosts = formatPosts(posts);
    res.status(200).json(formattedPosts);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

/* UPDATE */
const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);
    if (isLiked) post.likes.delete(userId);
    else post.likes.set(userId, true);

    let updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    updatedPost = updatedPost.toJSON();
    const formattedPost = { postId: updatedPost._id, ...updatedPost };
    res.status(200).json(formattedPost);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

/* DELETE */
const deletePost = async (req, res) => {
  const { file } = req.body;
  const result = await cloudinaryDelete(file);
  if (result[result] === "ok") res.status(200).send("Deleted");
  else res.status(404).send("File doesn't exist");
};

export { createPost, getFeedPosts, getUserPosts, likePost, deletePost };
