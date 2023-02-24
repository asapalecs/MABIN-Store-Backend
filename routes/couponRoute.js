const express = require("express");
const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  getCoupon,
} = require("../controller/couponCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCoupon);
router.get("/", authMiddleware, isAdmin, getAllCoupons);
router.put("/:id", authMiddleware, isAdmin, updateCoupon);
router.get("/:id", authMiddleware, isAdmin, getCoupon);

module.exports = router;