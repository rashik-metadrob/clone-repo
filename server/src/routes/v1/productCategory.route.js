const express = require('express');
const productCategoryController = require('../../controllers/productCategory.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/all-decorative-categories', productCategoryController.getDecorativeCategories);
router.post('/create', auth(), productCategoryController.createProductCategory);
router.get('/get-categories', auth(), productCategoryController.getProductCategories);
router.get('/get-all-customer-categories', auth('retriveUserData'), productCategoryController.getAllCustomerCategories);
router.get('/:id', auth(), productCategoryController.getProductCategory);
router.put('/:id', auth(), productCategoryController.updateProductCategory);
router.delete('/', auth(), productCategoryController.deleteProductCategory);

module.exports = router;