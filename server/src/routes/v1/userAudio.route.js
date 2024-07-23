const express = require('express');
const userAudioController = require('../../controllers/userAudio.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/', auth(), userAudioController.getUserAudiosByUserId);
router.post('/', auth(), userAudioController.createUserAudio);
router.delete('/:id', auth(), userAudioController.deleteUserAudioById);

module.exports = router;