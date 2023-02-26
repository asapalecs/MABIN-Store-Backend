const express = require("express");
const {
  createProduct,
  getProduct,
  getAllproducts,
  updateProduct,
  deleteProduct,
  addtoWishlist,
  rating,
  uploadImages,
} = require("../controller/productCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImages");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createProduct);
router.put("/upload/:id", authMiddleware, isAdmin, uploadPhoto.array('images', 10), productImgResize, uploadImages)
router.get("/:id", getProduct);
router.put("/wishlist", authMiddleware, addtoWishlist);
router.put("/rating", authMiddleware, rating);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);
router.get("/", getAllproducts);

module.exports = router;
