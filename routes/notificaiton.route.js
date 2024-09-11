import express from 'express';
import {
  clearAllNotifications,
  createCommentNotification,
  createFriendRequestNotification,
  createLikeNotification,
  deleteNotification,
  getNotifications,
  removeNotification
} from '../controllers/notification.controller.js';

const router = express.Router();

router.get('/:userId', getNotifications);
router.post('/like', createLikeNotification);
router.post('/comment', createCommentNotification);
router.post('/friend-request', createFriendRequestNotification);
router.delete('/:notificationId/delete', deleteNotification);
router.delete('/:userId/clear', clearAllNotifications);
router.delete('/remove', removeNotification);

export default router;
