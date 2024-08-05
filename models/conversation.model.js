import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        default: [],
      },
    ],
    latestMessage: {
      type: String,
    },
    numberOfUnread: {
      type: Map,
      of: Number,
      default: {},
    },
    messageSeenAt: {
      type: Map,
      of: String,
      default: {},
    },
  },
  { timestamps: true },
);

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
