const express = require("express");
const {
  createUser,
  loginUserCtrl,
  getallUsers,
  getaUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logoutUser,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getWishlist,
  saveUserAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus,
} = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();
router.post("/register", createUser);
router.post("/forgot-pw-token", forgotPasswordToken);
router.put("/reset-pw/:token", resetPassword);
router.put("/order/update-order/:id", updateOrderStatus);
router.put('/password', authMiddleware, isAdmin, updatePassword)
router.post("/login", loginUserCtrl);
router.post("/login-admin", loginAdmin);
router.post("/cart", userCart);
router.post("/cart/applycoupon", authMiddleware, applyCoupon);
router.post("/cart/order", authMiddleware, createOrder);
router.get("/all-users", getallUsers);
router.get("/all-orders", authMiddleware, getOrders);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logoutUser);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/cart", authMiddleware, getUserCart);
router.get("/:id", authMiddleware, isAdmin, getaUser);
router.delete("/empty-cart", emptyCart);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);
router.put("/edit-user", authMiddleware, updateUser);
router.put("/save-address", authMiddleware, saveUserAddress);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;