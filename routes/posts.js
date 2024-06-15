import express from "express";
import {
  deletePost,
  editPost,
  getFeedPosts,
  getUserPosts,
  likePost,
  newComment
} from "../controllers/posts.js";

const router = express.Router();

/* READ */
router.get("/", getFeedPosts);
router.get("/:userId/posts", getUserPosts);

/* UPDATE */
router.patch("/:postId/like", likePost);
router.patch("/:postId/edit", editPost);
router.patch("/:postId/comment", newComment);

/* DELETE */
router.delete("/:postId/delete", deletePost);

export default router;
