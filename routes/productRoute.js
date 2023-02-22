const express = require("express");
const {
  createProduct,
  getProduct,
  getAllproducts,
  updateProduct,
  deleteProduct,
  addtoWishlist,
  rating,
} = require("../controller/productCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createProduct);
router.get("/:id", getProduct);
router.put("/wishlist", authMiddleware, addtoWishlist);
router.put("/rating", authMiddleware, rating);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);
router.get("/", getAllproducts);

module.exports = router;
