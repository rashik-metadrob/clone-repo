const express = require('express');
const orderController = require('../../controllers/order.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/gross-income', orderController.getGrossIncomeInfo);
router.get('/retailer-gross-income', auth(), orderController.getRetailerGrossIncomeInfo);
router.get('/intent/:intentSecret', orderController.getOrderByIntentSetcret);
router.get('/paypal-payment/:id', orderController.getOrderByPaypalPaymentId);
router.post('/create', auth(), orderController.createOrder);
router.put('/:id', orderController.updateOrder);
router.get('/count-orders-last-7-days', auth(), orderController.getOrdersLast7Days);
router.get('/', auth(), orderController.getOrders)

module.exports = router;