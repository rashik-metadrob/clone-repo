const express = require('express');
const avatarModelController = require('../../controllers/avatarModel.controller');

const router = express.Router();

router.get('/all', avatarModelController.queryAllAvatarModels);

module.exports = router;