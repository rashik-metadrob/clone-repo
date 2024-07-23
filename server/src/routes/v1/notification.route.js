const express = require('express');
const notificationController = require('../../controllers/notification.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/', auth(), notificationController.getNotifications);
router.post('/', notificationController.createNotification);
router.put('/view/:id', notificationController.viewNotification);

module.exports = router;