const express = require('express');
const configController = require('../../controllers/config.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/setting', configController.getSettings);
router.get('/', configController.getConfigByType);
router.post('/', auth('config'), configController.uniqueConfig);

module.exports = router;