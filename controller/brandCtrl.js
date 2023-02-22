const Brand = require("../models/brandModel")
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require("../utils/validateMongoDbId");
const { validate } = require("../models/brandModel");

//Create a Brand
const createBrand = asyncHandler(async(req, res) =>{
    try {
        const newBrand = await Brand.create(req.body)
        res.json(newBrand)
    } catch (error) {
        throw new Error(error)
    }
});

//Update a brand
const updateBrand = asyncHandler(async(req, res) =>{
    const {id} = req.params;
    //validateMongoDbId(id);
    try {
        const updateBrand = await Brand.findByIdAndUpdate(id, req.body,{
            new: true
        } )
        res.json(updateBrand)
    } catch (error) {
        throw new Error(error)
    }
});

//Delete a brand
const deleteBrand = asyncHandler(async(req, res) =>{
    const {id} = req.params;
    //validateMongoDbId(id);
    try {
        const deleteBrand = await brand.findByIdAndDelete(id)
        res.json(deleteBrand)
    } catch (error) {
        throw new Error(error)
    }
});

//GET a brand
const getBrand = asyncHandler(async(req, res) =>{
    const {id} = req.params;
    //validateMongoDbId(id);
    try {
        const getBrand = await Brand.findById(id)
        res.json(getBrand)
    } catch (error) {
        throw new Error(error)
    }
});

//GET ALL Brands
const getAllBrands = asyncHandler(async(req, res) =>{
    //validateMongoDbId(id);
    try {
        const getAllBrands = await Brand.find()
        res.json(getAllBrands)
    } catch (error) {
        throw new Error(error)
    }
});



module.exports = { createBrand, updateBrand, deleteBrand, getBrand, getAllBrands};