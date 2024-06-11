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
    const userPicturePath = await cloudinaryUpload(req.file.path);
    fs.unlinkSync(req.file.path);
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: passwordHash,
      userPicturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    let userObject = user.toObject();
    delete userObject.password;
    res.status(200).json({ token, user: userObject });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function token(req, res) {
  try {
    const { token } = req.body;
    const claims = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ userId: claims.id });
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
}
