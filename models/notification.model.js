import mongoose from 'mongoose';

const notificationsSchema = new mongoose.Schema(
  {
    typeOfNotification: {
      type: String,
      enum: ['like', 'comment', 'friend-request'],
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    createrId: {
      type: String,
      required: true,
    },
    userPicturePath: {
      type: String,
      required: true,
    },
    notificationText: {
      type: String,
      required: true,
      trim: true,
    },
    notificationRead: {
      type: Boolean,
      default: false,
    },
    acceptedFriendRequest: {
      type: Boolean,
      required: false,
    },
    postId: {
      type: String,
      required: false,
    },
    commentOnPost: {
      type: String,
      required: false,
    },
    commentId: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

const Notification = mongoose.model('Notification', notificationsSchema);
export default Notification;
