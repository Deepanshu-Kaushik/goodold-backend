import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { cloudinaryUpload } from "../services/cloudinary.js";
import fs from "fs";

/* REGISTER USER */
export async function register(req, res) {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      friends,
      location,
      occupation,
    } = req.body;
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    let userPicturePath, userPictureId;
    if (req.file) {
      const { pictureUrl, picturePublicId } = await cloudinaryUpload(
        req.file.path
      );
      userPicturePath = pictureUrl;
      userPictureId = picturePublicId;
      fs.unlinkSync(req.file.path);
    } else {
      userPicturePath = process.env.DEFAULT_USER_PICTURE_PATH;
      userPictureId = process.env.DEFAULT_USER_PICTURE_ID;
    }

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: passwordHash,
      userPicturePath,
      userPictureId,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    let userObject = newUser.toObject();
    delete userObject.password;
    res.status(200).json({ token, user: userObject });
  } catch (error) {
    res.status(400).json({ error: "User already exists on this email." });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Email or password is incorrect." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Email or password is incorrect." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    let userObject = user.toObject();
    delete userObject.password;
    res.status(200).json({ token, user: userObject });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
