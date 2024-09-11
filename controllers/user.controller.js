import Notification from '../models/notification.model.js';
import User from '../models/user.model.js';
import formatFriends from '../utils/formatFriends.util.js';

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    let user = await User.findById(id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ error: error.message });
  }
};

const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(user.friends.map((id) => User.findById(id)));
    let [pendingRequests, unAcceptedRequests] = await Promise.all([
      Notification.find({ createrId: id, acceptedFriendRequest: false }).select('userId'),
      Notification.find({ userId: id, acceptedFriendRequest: false }).select('createrId'),
    ]);

    pendingRequests = pendingRequests.map((pendingRequest) => pendingRequest.userId) || [];
    unAcceptedRequests = unAcceptedRequests.map((unAcceptedRequest) => unAcceptedRequest.createrId) || [];
    const formattedFriends = formatFriends(friends);
    res.status(200).json({ formattedFriends, pendingRequests, unAcceptedRequests });
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ error: error.message });
  }
};

const addRemoveFriend = async (req, res) => {
  const { id, friendId } = req.params;

  try {
    const user = await User.findById(id);
    const friend = await User.findById(friendId);
    let notification;
    let removed = false;

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((friendId) => id !== friendId);
      notification = await Notification.findOne({
        userId: id,
        createrId: friendId,
        typeOfNotification: 'friend-request',
      });
      if (notification) await notification.deleteOne();
      notification = await Notification.findOne({
        userId: friendId,
        createrId: id,
        typeOfNotification: 'friend-request',
      });
      if (notification) await notification.deleteOne();
      removed = true;
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
      notification = await Notification.findOne({
        userId: id,
        createrId: friendId,
        typeOfNotification: 'friend-request',
      });
      if (notification) {
        notification.notificationText = `${friend.firstName} ${friend.lastName} is now your friend!`;
        notification.acceptedFriendRequest = true;
        await notification.save();
      }

      await Notification.create({
        userId: friendId,
        createrId: id,
        userPicturePath: user.userPicturePath,
        typeOfNotification: 'friend-request',
        notificationText: `${user.firstName} ${user.lastName} accepted your friend request!`,
        acceptedFriendRequest: true,
      });
    }

    await user.save();
    await friend.save();

    const friends = await Promise.all(user.friends.map((id) => User.findById(id)));

    const formattedFriends = formatFriends(friends);
    res.status(200).json({ formattedFriends, notification, removed });
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ error: error.message });
  }
};

export { getUser, getUserFriends, addRemoveFriend };
