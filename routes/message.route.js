import express from 'express';
import {
  getMessages,
  getConversations,
  sendMessage,
  markAsRead,
  clearConversation,
} from '../controllers/message.controller.js';

const router = express.Router();

router.get('/:id', getMessages);
router.get('/conversations/:id', getConversations);
router.post('/send/:id', sendMessage);
router.put('/message-read/:id', markAsRead);
router.delete('/clear-conversation', clearConversation);

export default router;
