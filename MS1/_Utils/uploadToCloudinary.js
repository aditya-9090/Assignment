import cloudinary from "../Config.js/cloudinary.js";
import fs from "fs";

const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      folder: "blog_uploads",
    });
    fs.unlinkSync(filePath); // delete local file
    return result;
  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new Error("Cloudinary upload failed: " + error.message);
  }
};

export default uploadToCloudinary;
