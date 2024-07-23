const express = require('express');
const paypalController = require('../../controllers/paypal.controller');

const router = express.Router();

router.post('/pricing-plan/:subId', paypalController.createOrderForPricingPlan);
router.post('/orders/:orderID', paypalController.createOrder);
router.get('/orders/:orderID/capture', paypalController.capture);

module.exports = router;