const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// View All Products
router.get('/', productController.view_all_product);

// Search For Products
router.get('/search', productController.search_products);

// Product Categories
router.get('/category/:category', productController.products_categorized);

// Product Categories (sub-categories)
router.get('/category/:category/:subCategory', productController.products_categorized);

// View A Product
router.get('/:id', productController.view_a_product);

// Add Product
router.post('/', productController.add_product);

// Update Product
router.put('/:id', productController.update_product);

// Update Product quantity
router.put('/update-quantity', productController.update_quantity);

// Delete A Product
router.delete('/:id', productController.delete_a_product);

// Delete All Products
router.delete('/', productController.delete_all_product);


module.exports = router;
