const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// The storage engine specifies where uploaded files should be stored and how they should be named.
const multerStorage = multer.diskStorage({
  // The `destination` function determines the directory where uploaded files should be stored. 
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images"));
  },
  // The `filename` function determines the name of the uploaded file.
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
  },
});


// The filter function is used to limit the types of files that can be uploaded.
const multerFilter = (req, file, cb) => {
  // The function first checks if the uploaded file is an image by calling the `startsWith()` method on the file's `mimetype` property.
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } 
  // If the mimetype does not start with "image", the function calls `cb()` with an error object and `false`
  else {
    cb(
      {
        message: "Unsupported file format!",
      },
      false
    );
  }
};


// Sets up a `multer` middleware that uses the previously defined `multerStorage` and `multerFilter`, and limits file size to 2MB.
const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fieldSize: 2000000,
  },
});


// Defines an `async` function to resize uploaded product images.
const productImgResize = async (req, res, next) => {
  // Checks if there are files to resize, and skips the function if there aren't.
  if (!req.files) return next();
  // Resizes and compresses each uploaded image using the `sharp` module.
  await Promise.all(
    req.files.map((file) => {
      req.files.map(async (file) => {
        await sharp(file.path)
          .resize(300, 300)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`public/images/products/${file.filename}`);
          // Deletes the original image after resizing it.
          fs.unlinkSync(`public/images/products/${file.filename}`);
      });
    })
  );
  // Calls the `next` middleware function.
  next();
};


// Defines an `async` function to resize uploaded blog images.
const blogImgResize = async (req, res, next) => {
  // Checks if there are files to resize, and skips the function if there aren't.
  if (!req.files) return next();
  // Resizes and compresses each uploaded image using the `sharp` module.
  await Promise.all(
    req.files.map((file) => {
      req.files.map(async (file) => {
        await sharp(file.path)
          .resize(300, 300)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`public/images/blogs/${file.filename}`);
          // Deletes the original image after resizing it.
          fs.unlinkSync(`public/images/blogs/${file.filename}`);
      });
    })
  );
  // Calls the `next` middleware function.
  next();
};


// Defines an `async` function to resize uploaded browse images.
// const browseImg = async (req, res, next) => {
//     // Checks if there are files to resize, and skips the function if there aren't.
//     if (!req.files) return next();
//     // Resizes and compresses each uploaded image using the `sharp` module.
//     await Promise.all(
//       req.files.map((file) => {
//         req.files.map(async (file) => {
//           await sharp(file.path)
//             .resize(300, 300)
//             .toFormat("jpeg")
//             .jpeg({ quality: 90 })
//             .toFile(`public/images/browse/${file.filename}`);
//         });
//       })
//     );
//   // Calls the `next` middleware function.
//   next();
// };

module.exports = { uploadPhoto, productImgResize, blogImgResize };
