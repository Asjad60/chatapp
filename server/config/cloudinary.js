import { v2 as cloudinary } from "cloudinary";

export const cloudinaryConnect = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
    });
  } catch (error) {
    console.log("Error connecting to the cloudinary");
    console.log(error);
  }
};
