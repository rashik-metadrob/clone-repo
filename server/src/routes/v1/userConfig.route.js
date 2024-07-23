const express = require('express');
const userConfigController = require('../../controllers/userConfig.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/user-enter-room', userConfigController.userEnterRoom)
router.post('/user-create-store', userConfigController.increaseValueOfConfig)
router.post('/user-create-product', userConfigController.increaseValueOfConfig)
router.post('/user-publish-store', userConfigController.increaseValueOfConfig)
router.get('/', userConfigController.getConfig);
router.post('/', userConfigController.uniqueConfig);

module.exports = router;