const express = require('express');
const shopifyAuthController = require('../../controllers/shopifyAuth.controller');
const shopifyController = require('../../controllers/shopify.controller.js')

const router = express.Router();
// Use session was approved by shopifyApi
router.get('/auth/login', shopifyAuthController.retriveMetadrobUserFromShopifySession)
router.post('/auth/refresh-token', shopifyAuthController.retriveRefreshTokenFromShopifySession)
router.get('/product/get-all', shopifyController.getAllProductFromShopifyByShopifySession)
router.post('/get-purchase-one-time-url', shopifyController.getPurchaseOneTimeUrlByShopifySession)
router.get('/request-new-subcription', shopifyController.requestSubscriptionForUser)

module.exports = router;