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
} = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();
router.post("/register", createUser);
router.post("/forgot-pw-token", forgotPasswordToken);
router.put("/reset-pw/:token", resetPassword);
router.put('/password', authMiddleware, updatePassword)
router.post("/login", loginUserCtrl);
router.post("/login-admin", loginAdmin);
router.get("/all-users", getallUsers);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logoutUser);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/:id", authMiddleware, isAdmin, getaUser);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);
router.put("/edit-user", authMiddleware, updateUser);
router.put("/save-address", authMiddleware, saveUserAddress);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;