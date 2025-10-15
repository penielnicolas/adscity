const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');


router.get('/', categoryController.getCategories);
router.get('/:slug', categoryController.getCategoryBySlug); 
router.get('/subcategory/:subcatSlug', categoryController.getSubcategoryBySlug);
router.get('/:id/fields', categoryController.getCategoryFields);
router.get('/image/:imageName', categoryController.getCategoryByImageName);
router.get('/:categoryId/subcategories/:subcategoryId', categoryController.getSubcategoryById);

module.exports = router;