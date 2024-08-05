import User from "../models/user.model.js";

export const searchUser = async (req, res) => {
  try {
    const { query } = req.body;
    const [firstName, lastName] = query.split(" ");
    if (lastName) {
      const users = await User.find({
        $and: [
          { firstName: { $regex: firstName, $options: "i" } },
          { lastName: { $regex: lastName, $options: "i" } },
        ],
      });
      res.status(200).json(users);
    } else {
      const users = await User.find({
        $or: [
          { firstName: { $regex: query, $options: "i" } },
          { lastName: { $regex: query, $options: "i" } },
        ],
      });
      res.status(200).json(users);
    }
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ error: error.message });
  }
};
