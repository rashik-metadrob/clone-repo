const httpStatus = require('http-status');
const axios = require('axios');
const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');
const config = require('../config/config');
const { User } = require('../models');
const { WARNING_TEXTS } = require('../utils/constant');
const { ACCOUNT_SOURCES } = require('../config/accountSource');
const { APP_SOURCES } = require('../config/appSource');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
  await emailService.sendVerificationEmail(user.email, verifyEmailToken);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { shopifyShop } = _.pick(req.query, ['shopifyShop']);
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);

  if (!_.isNil(shopifyShop)) {
    if (_.isEqual(shopifyShop, _.get(user, ['shopifyStoreName']))) {
      res.send({ user, tokens });
    } else {
      res.status(httpStatus.BAD_REQUEST).send({ message: WARNING_TEXTS.SHOPIFY_STORE_NOT_MATCH });
    }
  } else {
    res.send({ user, tokens });
  }
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  if (!req.query.shop) {
    const tokens = await authService.refreshAuth(req.body.refreshToken);
    res.send({ ...tokens });
  } else {
    // Shopify logic
    const user = await authService.getUserByShopifyShop(req.query.shop);
    if (user) {
      const tokens = await tokenService.generateAuthTokens(user, false);
      res.send({ ...tokens });
    } else {
      res.status(httpStatus.UNAUTHORIZED).send({ message: 'Please authenticate' });
    }
  }
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

const loginFacebook = catchAsync(async (req, res) => {
  const { shopifyShop, isDrobA } = _.pick(req.query, ['shopifyShop', 'isDrobA']);
  const { data } = await axios({
    url: 'https://graph.facebook.com/me',
    method: 'GET',
    params: {
      fields: ['id', 'email', 'first_name', 'last_name', 'name', 'picture'].join(','),
      access_token: req.body.token,
    },
  });
  const newUser = {
    password: config.defaultPassword,
    socialId: data.id,
    socialType: 'Facebook',
    name: data.name,
    source: ACCOUNT_SOURCES.SOCIAL,
    isEmailVerified: true,
    appSource: isDrobA == 1 ? APP_SOURCES.DROBA : APP_SOURCES.METADROB
  };
  if (data.picture && data.picture.data.url) {
    newUser.socialAvatar = data.picture.data.url;
  }
  if (await User.isSocialIdTaken(newUser.socialId)) {
    let user = await authService.getUserBySocialId(newUser.socialId);
    if (newUser.socialAvatar) {
      user = await userService.updateUserById(user._id, { socialAvatar: newUser.socialAvatar });
    }
    const tokens = await tokenService.generateAuthTokens(user);

    if (!_.isNil(shopifyShop)) {
      if (_.isEqual(shopifyShop, _.get(user, ['shopifyStoreName']))) {
        res.send({ user, tokens });
      } else {
        res.status(httpStatus.BAD_REQUEST).send({ message: WARNING_TEXTS.SHOPIFY_STORE_NOT_MATCH });
      }
    } else {
      res.send({ user, tokens });
    }
  } else {
    const user = await userService.createUser(newUser);
    const tokens = await tokenService.generateAuthTokens(user);

    if (!_.isNil(shopifyShop)) {
      if (_.isEqual(shopifyShop, _.get(user, ['shopifyStoreName']))) {
        res.status(httpStatus.CREATED).send({ user, tokens });
      } else {
        res.status(httpStatus.BAD_REQUEST).send({ message: WARNING_TEXTS.SHOPIFY_STORE_NOT_MATCH });
      }
    } else {
      res.status(httpStatus.CREATED).send({ user, tokens });
    }
  }
});

const loginGoogle = catchAsync(async (req, res) => {
  const { shopifyShop, isDrobA } = _.pick(req.query, ['shopifyShop', 'isDrobA']);
  const newUser = {
    password: config.defaultPassword,
    socialId: req.body.socialId,
    socialType: 'Google',
    name: req.body.name,
    email: req.body.email,
    socialAvatar: req.body.imageUrl,
    source: ACCOUNT_SOURCES.SOCIAL,
    isEmailVerified: true,
    appSource: isDrobA == 1 ? APP_SOURCES.DROBA : APP_SOURCES.METADROB
  };
  if (await User.isEmailTaken(newUser.email)) {
    let user = await authService.getUserByEmail(newUser.email);
    console.log('newUser', newUser);
    if (newUser.socialAvatar) {
      user = await userService.updateUserById(user._id, { socialAvatar: newUser.socialAvatar });
    }
    const tokens = await tokenService.generateAuthTokens(user);

    if (!_.isNil(shopifyShop)) {
      if (_.isEqual(shopifyShop, _.get(user, ['shopifyStoreName']))) {
        res.send({ user, tokens });
      } else {
        res.status(httpStatus.BAD_REQUEST).send({ message: WARNING_TEXTS.SHOPIFY_STORE_NOT_MATCH });
      }
    } else {
      res.send({ user, tokens });
    }
  } else if (await User.isSocialIdTaken(newUser.socialId)) {
    let user = await authService.getUserBySocialId(newUser.socialId);
    if (newUser.socialAvatar) {
      user = await userService.updateUserById(user._id, { socialAvatar: newUser.socialAvatar });
    }
    const tokens = await tokenService.generateAuthTokens(user);

    if (!_.isNil(shopifyShop)) {
      if (_.isEqual(shopifyShop, _.get(user, ['shopifyStoreName']))) {
        res.send({ user, tokens });
      } else {
        res.status(httpStatus.BAD_REQUEST).send({ message: WARNING_TEXTS.SHOPIFY_STORE_NOT_MATCH });
      }
    } else {
      res.send({ user, tokens });
    }
  } else {
    const user = await userService.createUser(newUser);
    const tokens = await tokenService.generateAuthTokens(user);

    if (!_.isNil(shopifyShop)) {
      if (_.isEqual(shopifyShop, _.get(user, ['shopifyStoreName']))) {
        res.status(httpStatus.CREATED).send({ user, tokens });
      } else {
        res.status(httpStatus.BAD_REQUEST).send({ message: WARNING_TEXTS.SHOPIFY_STORE_NOT_MATCH });
      }
    } else {
      res.status(httpStatus.CREATED).send({ user, tokens });
    }
  }
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  loginFacebook,
  loginGoogle,
};
