import express from "express";
import { deletePost, getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";

const router = express.Router();

/* READ */
router.get("/", getFeedPosts);
router.get("/:userId/posts", getUserPosts);

/* UPDATE */
router.patch("/:id/like", likePost);

/* DELETE */
router.delete("/delete", deletePost);

export default router;
