const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");

//CREATING a blog
const createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.json(newBlog);
  } catch (error) {
    throw new Error(error);
  }
});

//UPDATING a blog
const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  //validateMongoDbId(id);
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedBlog);
  } catch (error) {
    throw new Error(error);
  }
});

//GETTING a blog
const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  //validateMongoDbId(id);
  try {
    const getBlog = await Blog.findById(id);
    const updateViews = await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );
    res.json(updateViews);
  } catch (error) {
    throw new Error(error);
  }
});

//GETTING ALL blogs
const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const getBlogs = await Blog.find();
    res.json(getBlogs);
  } catch (error) {
    throw new Error(error);
  }
});

//DELETING a blog
const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  //validateMongoDbId(id);
  try {
    const deleteBlog = await Blog.findByIdAndDelete(id);
    res.json(deleteBlog);
  } catch (error) {
    throw new Error(error);
  }
});

//LIKE Functionality
const likeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  //validateMongoDbId(blogId);
  //Find the blog you want to like
  const blog = await Blog.findById(blogId);
  //Verify if the user is logged in to be able to like a blog
  const loginUserId = req?.user?._id;
  //Check if the blog is liked
  const isLiked = blog?.isLiked;
  //Check if the blog is disliked
  const Disliked = blog?.dislikes?.find(
    (userId => userId?.toString() === loginUserId?.toString())
  );
  if (Disliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  }
  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  }else{
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});
module.exports = {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  likeBlog,
};
