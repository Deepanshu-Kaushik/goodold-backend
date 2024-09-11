import { DateTime } from 'luxon';
import User from '../models/user.model.js';

export const updateLastOnline = async (userId) => {
  try {
    const user = await User.findById(userId);
    user.lastOnline = `${DateTime.now().toISO()}`;
    await user.save();
  } catch (error) {
    console.log(error.message);
  }
};
