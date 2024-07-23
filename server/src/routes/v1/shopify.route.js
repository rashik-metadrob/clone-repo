const express = require('express');
const controller = require('../../controllers/shopify.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.use('/', (req, res, next) => {
    // res.header('Access-Control-Allow-Origin', yourExactHostname);
    //res.header('Access-Control-Allow-Credentials', true);
    //res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.cookie('metadrob-cookie', 100, { maxAge: 900000 });
    //res.header('Custom-Nhan-Headers', 'NhanTH');
    next()
})

router.get('/get-session', controller.getSession);
router.post('/add-session', controller.addSession);
router.delete('/delete-session', controller.deleteSession);
router.get('/exchange-token', controller.exchangeAccessToken);
router.get('/import-product-from-shopify', auth(), controller.importProductFromShop)
router.get('/get-products-by-store-front', auth(), controller.getProductsByStoreFrontAPI);

router.route('/create-cart-by-store-front').all(controller.lookupRetailerUserBeforeHandleRoute).post(auth(), controller.createShopifyCartByStoreFrontAPI);
router.route('/get-cart-by-store-front').all(controller.lookupRetailerUserBeforeHandleRoute).get(auth(), controller.getShopifyCartByStoreFrontAPI);
router.route('/update-cart-by-store-front').all(controller.lookupRetailerUserBeforeHandleRoute).put(auth(), controller.updateShopifyCartItemsByStoreFrontAPI);
router.route('/add-cart-by-store-front').all(controller.lookupRetailerUserBeforeHandleRoute).put(auth(), controller.addShopifyCartItemsByStoreFrontAPI);
router.route('/get-checkout-url-by-store-front').all(controller.lookupRetailerUserBeforeHandleRoute).get(auth(), controller.getCheckoutUrlByStoreFrontAPI);
router.route('/remove-cart-by-store-front').all(controller.lookupRetailerUserBeforeHandleRoute).put(auth(), controller.removeShopifyCartItemsByStoreFrontAPI);

module.exports = router;