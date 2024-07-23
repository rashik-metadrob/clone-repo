const express = require('express');
const addressController = require('../../controllers/address.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/create', auth(), addressController.createAddress);
router.get('/all', auth(), addressController.getAllAddresss);
router.get('/', auth(), addressController.getAddress);
router.delete('/', auth(), addressController.deleteAddress);
router.put('/', auth(), addressController.updateAddress);

module.exports = router;