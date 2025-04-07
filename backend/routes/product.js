const express = require('express');
const router = express.Router();
const upload = require("../utils/multerProduct");
// const { isAuthenticatedUser } = require('../middleware/authMiddleware');
// const { multerProduct } = require ('../utils/multerProduct');
// const { uploadCloud } = require ('../utils/uploadCloud');
const { newProduct, getProducts, getAdminProducts,  getSingleProduct, deleteProduct, updateProduct, addReview, deleteMultipleProducts} = require('../controllers/product');

router.get('/products', getProducts)
router.get('/adminProducts', getAdminProducts)
router.get('/product/:id', getSingleProduct)
// router.post('/products/new', newProduct)
router.post("/products/new", upload.array("images"),newProduct);
router.put('/product/:id', upload.array("images"), updateProduct);
// router.post('/product/:productId/review', addReview);
router.delete('/product/:id', deleteProduct) // Delete single product
router.post('/products/delete', deleteMultipleProducts)

// router('/admin/products',getProdAdmin);

module.exports = router












