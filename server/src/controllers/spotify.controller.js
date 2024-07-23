var querystring = require('querystring');
const catchAsync = require('../utils/catchAsync');
const config = require('../config/config');
var request = require('request');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const getSpotifyLoginUrl = catchAsync(async (req, res) => {
    const state = req.query.state;
    // your application requests authorization
    const scope = 'user-read-private user-read-email streaming user-modify-playback-state';
    const url = 'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: config.spotify.spotifyClientId,
      scope: scope,
      redirect_uri: config.spotify.spotifyRedirect,
      state: state
    })
    res.send({url: url});
});

const getAccessToken = catchAsync(async (req, res) => {
  const code = req.query.code
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: config.spotify.spotifyRedirect,
      grant_type: 'authorization_code'
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + (new Buffer.from(config.spotify.spotifyClientId + ':' + config.spotify.spotifyClientSecret).toString('base64'))
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {

      var access_token = body.access_token,
          refresh_token = body.refresh_token;

      // we can also pass the token to the browser to make requests from there
      res.send({
        access_token: access_token,
        refresh_token: refresh_token
      });
    } else {
      console.log('error', error)
      res.status(httpStatus.BAD_REQUEST).send({message: "Can't connect to Spotify!"})
    }
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (new Buffer.from(config.spotify.spotifyClientId + ':' + config.spotify.spotifyClientSecret).toString('base64')) 
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {

      var access_token = body.access_token,
          refresh_token = body.refresh_token;
      // we can also pass the token to the browser to make requests from there
      res.send({
        access_token: access_token,
        refresh_token: refresh_token
      });
    } else {
      console.log('error', error)
      res.status(httpStatus.BAD_REQUEST).send({message: "Can't connect to Spotify!"})
    }
  });
});

module.exports = {
    getSpotifyLoginUrl,
    getAccessToken,
    refreshToken
};