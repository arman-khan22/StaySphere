const cloudinary = require("cloudinary").v2;
const multerCloudinary = require("multer-storage-cloudinary");

const CloudinaryStorage =
  multerCloudinary.CloudinaryStorage ||
  multerCloudinary.default ||
  multerCloudinary;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "wanderlust_DEV",
    allowed_formats: ["jpeg", "png", "jpg"],
  },
});

module.exports = {
  cloudinary,
  storage,
};
