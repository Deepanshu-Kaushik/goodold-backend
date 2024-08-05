import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const cloudinaryUpload = async (picturePath) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const result = await cloudinary.uploader.upload(picturePath, {
      resource_type: "auto",
    });

    return { pictureUrl: result.secure_url, picturePublicId: result.public_id };
  } catch (error) {
    fs.unlinkSync(picturePath);
    return error.message;
  }
};

export const cloudinaryDelete = async (pictureId) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const result = await cloudinary.uploader.destroy(pictureId);
    return result;
  } catch (error) {
    return error.message;
  }
};
