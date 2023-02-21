const express = require("express")
const { createProduct, getProduct, getAllproducts, updateProduct, deleteProduct} = require("../controller/productCtrl")
const {isAdmin, authMiddleware } = require("../middlewares/authMiddleware")
const router = express.Router()

router.post('/', authMiddleware, isAdmin, createProduct)
router.get('/:id', getProduct)
router.put('/:id',  authMiddleware,isAdmin, updateProduct)
router.delete('/:id', authMiddleware, isAdmin, deleteProduct)
router.get('/', getAllproducts)










module.exports = router;