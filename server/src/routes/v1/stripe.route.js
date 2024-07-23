const express = require('express');
const stripeController = require('../../controllers/stripe.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/secret', stripeController.getIntentSecret);

module.exports = router;