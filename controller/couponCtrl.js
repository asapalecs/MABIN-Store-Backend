const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");

const createCoupon = asyncHandler(async (req, res) => {
  try {
    const createCupon = await Coupon.create(req.body);
    res.json(createCupon);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllCoupons = asyncHandler(async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    throw new Error(error);
  }
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  //validateMongoDbId(id);
  try {
    const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

const getCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    //validateMongoDbId(id);
    try {
      const getCoupon = await Coupon.findById(id);
      res.json(getCoupon);
    } catch (error) {
      throw new Error(error);
    }
  });

module.exports = { createCoupon, getAllCoupons, updateCoupon, getCoupon };
