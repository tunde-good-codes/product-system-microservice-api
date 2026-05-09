import { v2 as cloudinary } from "cloudinary";

export function initCloudinary() {
  const cloudinaryName = process.env.CLOUDINARY_NAME;
  const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
  const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;
  const cloudinaryFolder = process.env.CLOUDINARY_FOLDER;

  if (!cloudinaryName || !cloudinaryApiKey || !cloudinaryApiSecret) {
    throw new Error("cloudinary api keys are missing");
  }

  cloudinary.config({
    cloud_name: cloudinaryName,
    api_key: cloudinaryApiKey,
    api_secret: cloudinaryApiSecret
  });

  return cloudinary
}

