const express = require('express');
const productController = require('../../controllers/product.controller');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const productValidation = require('../../validations/product.validation');

const router = express.Router();

router.get('/products-of-the-month', auth(), productController.getProductsOfTheMonth);
router.post('/import-from-csv', auth(), productController.importProductsFromCsv);
router.post('/multiple', auth(), productController.createProducts);
router.post('/', auth(), productController.createProduct);
router.get('/get-public-products', auth(), validate(productValidation.queryPublicProducts), productController.getPublicsProducts);
router.get('/get-all-products', auth(), productController.getAllProducts)
router.get('/get-public-products-for-viewer', productController.getPublicsProductsForViewer);
router.get('/get-product', productController.getProduct);
router.get('/get-product-by-merchandise', productController.getProductByShopifyVariantMerchandiseId);
router.get('/get-list-product-types', auth(), productController.getProductTypes);
router.get('/get-list-product-currencies', auth(), productController.getProductCurrencies);
router.get('/', auth(), validate(productValidation.queryProductByUser), productController.getProductsByUser);
router.put('/', auth(), productController.updateProduct);
router.delete('/', auth(), productController.deleteProduct);

module.exports = router;