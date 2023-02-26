// Import the Cloudinary library
const cloudinary = require("cloudinary");

// Configure Cloudinary with API credentials
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.SECRET_KEY,
});

// Define a function to upload an image to Cloudinary
const cloudinaryUploadImg = async (fileToUploads) => {
  // Return a Promise that will resolve with the uploaded image URL and resource type
  return new Promise((resolve) => {
    // Use the Cloudinary uploader to upload the file
    cloudinary.uploader.upload(fileToUploads, (result) => {
      // Resolve the Promise with an object containing the uploaded image URL and resource type
      resolve(
        {
          url: result.secure_url,
        },
        {
          resource_type: "auto",
        }
      );
    });
  });
};

module.exports =  cloudinaryUploadImg;


//7:03:52 