const express = require('express');
const spotifyController = require('../../controllers/spotify.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/get-spotify-login-url', auth(), spotifyController.getSpotifyLoginUrl)
router.get('/get-spotify-access-token', auth(), spotifyController.getAccessToken)
router.get('/refresh-spotify-access-token', auth(), spotifyController.refreshToken)

module.exports = router;