const express = require('express');
const placeholderController = require('../../controllers/placeholder.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/', auth(), placeholderController.createPlaceholder)
router.get('/get-public-placeholders', placeholderController.getPublicPlaceholders);
router.get('/', auth(), placeholderController.getPlaceholders)
router.delete('/', auth(), placeholderController.deletePlaceholder);
router.put('/:id', auth(), placeholderController.updatePlaceholder);

module.exports = router;