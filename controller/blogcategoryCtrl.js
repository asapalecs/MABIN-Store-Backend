const Category = require("../models/blogcategoryModel")
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require("../utils/validateMongoDbId");
const { validate } = require("../models/blogcategoryModel");

//Create a Category
const createCategory = asyncHandler(async(req, res) =>{
    try {
        const newCategory = await Category.create(req.body)
        res.json(newCategory)
    } catch (error) {
        throw new Error(error)
    }
});

//Update a Category
const updateCategory = asyncHandler(async(req, res) =>{
    const {id} = req.params;
    //validateMongoDbId(id);
    try {
        const updateCategory = await Category.findByIdAndUpdate(id, req.body,{
            new: true
        } )
        res.json(updateCategory)
    } catch (error) {
        throw new Error(error)
    }
});

//Delete a Category
const deleteCategory = asyncHandler(async(req, res) =>{
    const {id} = req.params;
    //validateMongoDbId(id);
    try {
        const deleteCategory = await Category.findByIdAndDelete(id)
        res.json(deleteCategory)
    } catch (error) {
        throw new Error(error)
    }
});

//GET a Category
const getCategory = asyncHandler(async(req, res) =>{
    const {id} = req.params;
    //validateMongoDbId(id);
    try {
        const getCategory = await Category.findById(id)
        res.json(getCategory)
    } catch (error) {
        throw new Error(error)
    }
});

//GET ALL Categories
const getAllCategories = asyncHandler(async(req, res) =>{
    //validateMongoDbId(id);
    try {
        const getAllCategories = await Category.find()
        res.json(getAllCategories)
    } catch (error) {
        throw new Error(error)
    }
});



module.exports = { createCategory, updateCategory, deleteCategory, getCategory, getAllCategories};