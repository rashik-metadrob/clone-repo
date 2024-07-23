const express = require('express');
const easyShipController = require('../../controllers/easyShip.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/rates', easyShipController.getRates);
router.post('/shipment/create', easyShipController.createShipment);
router.get('/couriers', easyShipController.getCouriers);

module.exports = router;