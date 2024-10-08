import express from 'express';
import {
  deleteComment,
  deletePost,
  editPost,
  getFeedPosts,
  getUserPosts,
  likePost,
  newComment,
} from '../controllers/posts.controller.js';

const router = express.Router();

/* READ */
router.get('/', getFeedPosts);
router.get('/:userId', getUserPosts);

/* UPDATE */
router.patch('/:postId/like', likePost);
router.patch('/:postId/edit', editPost);
router.patch('/:postId/comment', newComment);

/* DELETE */
router.delete('/:postId/delete', deletePost);
router.delete('/:commentId/comment-delete', deleteComment);

export default router;
