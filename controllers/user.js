import User from "../models/user.js";
import formatFriends from "../utils/formatFriends.js";

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    let user = await User.findById(id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    const formattedFriends = formatFriends(friends);
    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const addRemoveFriend = async (req, res) => {
  const { id, friendId } = req.params;

  try {
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((friendId) => id !== friendId);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }

    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    
    const formattedFriends = formatFriends(friends);
    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export { getUser, getUserFriends, addRemoveFriend };
