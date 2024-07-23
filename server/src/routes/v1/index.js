const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const productRoute = require('./product.route');
const projectRoute = require('./project.route');
const uploadRoute = require('./upload.route');
const stripeRoute = require('./stripe.route')
const trackingRoute = require('./traking.route')
const feedbackRoute = require('./feedback.route')
const configRoute = require('./config.route')
const userConfigRoute = require('./userConfig.route');
const config = require('../../config/config');
const productCategoryRoute = require("./productCategory.route")
const pricingPlanRoute = require("./pricingPlan.route")
const userSubcriptionRoute = require("./userSubcription.route")
const easyShipRoute = require("./easyShip.route")
const orderRoute = require("./order.route")
const addressRoute = require("./address.route")
const paypalRoute = require("./paypal.route")
const hdriRoute = require('./hdri.route')
const shopifyRoute = require('./shopify.route')
const spotifyRoute = require('./spotify.route')
const textRoute = require('./text.route')
const assetRoute = require('./asset.route')
const avatarModelRoute = require('./avatarModel.route')
const placeholderRoute = require('./placeholder.route')
const loggerRoute = require('./logger.route')
const userStorageRoute = require('./userStorage.route')
const compressWebhooksRoute = require('./compressWebhooks.route')
const notificationRoute = require('./notification.route')
const userAudioRoute = require('./userAudio.route')
const roleAndPermissionRoute = require('./roleAndPermission.route')
const invitationRoute = require('./invitation.route')
const zohoRoute = require('./zoho.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: "/project",
    route: projectRoute
  },
  {
    path: "/product",
    route: productRoute
  },
  {
    path: "/upload",
    route: uploadRoute
  },
  {
    path: '/stripe',
    route: stripeRoute
  },
  {
    path: '/tracking',
    route: trackingRoute
  },
  {
    path: '/feedback',
    route: feedbackRoute
  },
  {
    path: '/config',
    route: configRoute
  },
  {
    path: '/user-config',
    route: userConfigRoute
  },
  {
    path: '/pricing-plan',
    route: pricingPlanRoute
  },
  {
    path: '/user-subcription',
    route: userSubcriptionRoute
  },
  {
    path: '/easy-ship',
    route: easyShipRoute
  },
  {
    path: '/order',
    route: orderRoute
  },
  {
    path: '/product-category',
    route: productCategoryRoute
  },
  {
    path: '/address',
    route: addressRoute
  },
  {
    path: '/paypal',
    route: paypalRoute
  },
  {
    path: '/hdri',
    route: hdriRoute
  },
  {
    path: '/shopify',
    route: shopifyRoute
  },
  {
    path: '/spotify',
    route: spotifyRoute
  },
  {
    path: '/text',
    route: textRoute
  },
  {
    path: '/asset',
    route: assetRoute
  },
  {
    path: '/avatar-model',
    route: avatarModelRoute
  },
  {
    path: '/placeholder',
    route: placeholderRoute
  },
  {
    path: '/logger',
    route: loggerRoute
  },
  {
    path: '/user-storage',
    route: userStorageRoute
  },
  {
    path: '/compress-webhooks',
    route: compressWebhooksRoute
  },
  {
    path: '/notification',
    route: notificationRoute
  },
  {
    path: '/user-audio',
    route: userAudioRoute
  },
  {
    path: '/role-and-permission',
    route: roleAndPermissionRoute
  },
  {
    path: '/invitation',
    route: invitationRoute
  },
  {
    path: '/zoho',
    route: zohoRoute
  }
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
