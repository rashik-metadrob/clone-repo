const express = require('express');
const loggerController = require('../../controllers/logger.controller');

const router = express.Router();

router.post('/log', loggerController.createLog);

module.exports = router;