const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const validateMongoDbId = require("../utils/validateMongoDbId");
const { generaterefreshToken } = require("../config/refreshToken");
const crypto = require('crypto')
const {
  findById,
  findByIdAndDelete,
  validate,
} = require("../models/userModel");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailCtrl");
const { request } = require("express");

//Create User
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    //CREATE A NEW USER
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    //USER ALREADY EXISTS
    throw new Error("User Already Exists");
  }
});

//Login User
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check is user exists or not
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generaterefreshToken(findUser?._id);
    const updateUser = await User.findByIdAndUpdate(
      findUser.id,
      { refreshToken: refreshToken },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

//Admin Login
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check is user exists or not
  const findAdmin = await User.findOne({ email });
  if(findAdmin.role !== 'admin') throw new Error("Not Authorized");
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await generaterefreshToken(findAdmin?._id);
    const updateUser = await User.findByIdAndUpdate(
      findAdmin.id,
      { refreshToken: refreshToken },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

//Handle a Refresh Token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  console.log(cookie);
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  console.log(refreshToken);
  const user = await User.findOne({ refreshToken });
  if (!user)
    throw new Error("No Refresh Token Present in Database or Not Matched!");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});

//Log Out User
const logoutUser = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); //forbidden
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.sendStatus(204); //forbidden
});

//Update User
const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  //validateMongoDbId();
  try {
    const update = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body.firstname,
        lastname: req?.body.lastname,
        email: req?.body.email,
        mobile: req?.body.mobile,
      },
      {
        new: true,
      }
    );
    res.json(update);
  } catch (error) {
    throw new Error(error);
  }
});

//Save User Address

const saveUserAddress = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const updateUser = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body.address,
      },
      {
        new: true,
      }
    );
    res.json(updateUser);
  } catch (error) {
    throw new Error(error);
  }
});

// Get all users
const getallUsers = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

//Fetch a Single User
const getaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaUser = await User.findById(id);
    res.json({ getaUser });
  } catch (error) {
    throw new Error(error);
  }
});

//Delete an User
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json({ deleteUser });
  } catch (error) {
    throw new Error(error);
  }
});

//Block User
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User Blocked!",
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Unblock user
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User Unblocked!",
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Change Password
const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  //validateMongoDbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});

const forgotPasswordToken = asyncHandler(async(req, res) =>{
  const {email} = req.body;
  const user = await User.findOne({email});
  if(!user) throw new Error('User not found with this email');
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi, please follow this link to reset your password. It is valid for 10 minutes from now! <a href="http://localhost:5000/api/user/reset-pw/${token}">Click here</a>`
    const data = {
      to: email,
      text: "Hi User",
      subject: "Forgot Password Link",
      htm: resetURL
    }
    sendEmail(data);
    res.json(token);  
  } catch (error) {
    throw new Error(error)
  }
})

const resetPassword = asyncHandler(async(req, res) =>{
  const {password} = req.body;
  const {token} = req.params;
  const hashedToken = crypto.createHash('sha256').update(token).digest("hex")
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  })
  if(!user) throw new Error("Token Expired, Please try again later");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

const getWishlist = asyncHandler(async (req, res) => {
  const {_id} = req.user;
  try {
    const findUser = await User.findById(_id).populate('wishlist');
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
})

module.exports = {
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
};


