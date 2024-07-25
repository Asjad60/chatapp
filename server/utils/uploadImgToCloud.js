import { v2 as cloudinary } from "cloudinary";
import { v4 as uuid } from "uuid";
import fs from "fs";

export const uploadFileToCloud = async (file, folder, height, quality) => {
  const options = { folder };
  let res;
  if (height) {
    options.height = height;
  }
  if (quality) {
    options.quality = quality;
  }
  options.resource_type = "auto";
  options.public_id = uuid();
  try {
    res = await cloudinary.uploader.upload(file, options);
    if (res.secure_url) {
      fs.unlinkSync(file);
    }
  } catch (error) {
    fs.unlinkSync(file);
    console.log("Error At Uploading to Cloudinary");
    throw error;
  }

  return res;
};
