const express = require('express');
const userStorageController = require('../../controllers/userStorage.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/', auth(), userStorageController.getUserStorageInfo)

module.exports = router;