const express = require("express");
const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  getCoupon,
  deleteCoupon,
} = require("../controller/couponCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCoupon);
router.get("/", authMiddleware, isAdmin, getAllCoupons);
router.put("/:id", authMiddleware, isAdmin, updateCoupon);
router.get("/:id", authMiddleware, isAdmin, getCoupon);
router.delete("/:id", authMiddleware, isAdmin, deleteCoupon);

module.exports = router;