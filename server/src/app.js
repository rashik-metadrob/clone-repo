const express = require('express');
const path = require("path");
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const cookieParser = require('cookie-parser')
const serveStatic = require("serve-static");

const shopifyAuthController = require('./controllers/shopifyAuth.controller');
const shopifyAppRoute = require("./routes/v1/shopifyApp.route.js")
const {DeliveryMethod} =require('@shopify/shopify-api')
const webhooksRoute = require("./routes/v1/webhooks.route.js")

const shopify = require("./shopify.js");
const productCreator  = require("./product-creator.js");
const PrivacyWebhookHandlers  = require("./privacy.js");

const logger = require("./logger.js")

const { metadrobValidateAuthenticatedSession, metadrobAuthCallback, processWebhooks } = require("./utils/shopifyUtils.js");
const { shopifyBillingMiddleware } = require('./middlewares/shopifyBilling.middleware.js');
const { initZohoConfig } = require('./config/initZohoConfig.js');

const app = express();

const STATIC_PATH = path.join(process.cwd(), 'public');

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// enable cors
// app.use(cors());

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://localhost:3000',
    'https://www.drobverse.com',
    'https://drobverse.com',
    'https://www.metadrob.com',
    'https://192.168.1.113:3000',
    'https://192.168.2.21:3000',
    'https://curious-formerly-gnu.ngrok-free.app',
    'https://127.0.0.1:3000',
    'https://192.168.1.107:3000',
    'https://www.metadrob.com',
    'https://bunny-merry-hopefully.ngrok-free.app',
    'https://127.0.0.1:8080',
    'https://192.168.2.21:8080',
    'https://192.168.17.1:8080',
    'https://192.168.17.1:3000',
    'https://localhost:8080',
    'https://shopify.metadrob.com',
    'https://api.metadrob.com',
    'https://tool.metadrob.com',
    'https://testing.metadrob.com'
  ],
  // origin: function (origin, callback) {
  //     return callback(null, true)
  // },
  //optionsSuccessStatus: 200,
  credentials: true
}));

//----------Shopify setup----------------
// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  // shopify.auth.callback(),
  async (req, res, next) => {
    const oauthCompleted = await metadrobAuthCallback(req, res, shopify)

    if (oauthCompleted) {
      next();
    }
  },
  shopifyBillingMiddleware,
  shopifyAuthController.createNewUserOrActiveUser,
  // shopifyAuthController.syncCollectionFromShopify,
  async (req, res, next) => {
    if (res.headersSent) {
      console.log(
        'Response headers have already been sent, skipping redirection to host',
        {shop: res.locals.shopify?.session?.shop},
      );

      return;
    }
    const host = shopify.api.utils.sanitizeHost(req.query.host);
    res.redirect(`/home-shopify?shop=${res.locals.shopify.session.shop}&host=${encodeURIComponent(host)}`)
  }
  // Load the app otherwise
  // It not working with This app
  // shopify.redirectToShopifyOrAppRoot()
);

// This function will auto delete session when app uninstalled
// deleteAppInstallationHandler
// When review app, reviewer uninstall and reinstall, webhook uninstall emit and the session will be deleted after reinstall -> error
// app.post(
//   shopify.config.webhooks.path,
//   shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
// );
// app.post(
//   shopify.config.webhooks.path,
//   (req, res, next) => { processWebhooks(req, res, shopify, PrivacyWebhookHandlers) }
// );

shopify.api.webhooks.addHandlers({
  PRODUCTS_UPDATE: [
    {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: '/v1/webhooks/product-updated'
    },
  ],
  PRODUCTS_CREATE: [
    {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: '/v1/webhooks/product-created'
    },
  ],
  APP_UNINSTALLED: [
    {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: '/v1/webhooks/app-uninstalled'
    },
  ],
  APP_PURCHASES_ONE_TIME_UPDATE: [
    {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: '/v1/webhooks/app-purchases-one-time-update'
    },
  ],
  APP_SUBSCRIPTIONS_UPDATE: [
    {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: '/v1/webhooks/app-subscriptions-update'
    },
  ],
});


// app.use("/shopify/*", shopify.validateAuthenticatedSession());
app.use("/shopify/*", (req, res, next) => {metadrobValidateAuthenticatedSession(req, res, next, shopify)});
//----------End shopify setup------------

// Handle webhooks
app.use('/v1/webhooks', webhooksRoute)

app.post('/shopify/webhooks', async (req, res) => {
  console.log('___WEBHOOKS___')
})


// parse json request body
// Limit the json
app.use(express.json({limit: "10mb"}));

//----------Shopify setup----------------
app.use('/shopify', shopifyAppRoute)

app.get("/shopify/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/shopify/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

// app.use(shopify.cspHeaders());
//----------End shopify setup------------

// app.use(express.static(path.resolve(__dirname, './public')));
// app.use(serveStatic(STATIC_PATH, { index: false }));
 app.use("/uploads", serveStatic(config.uploadDirectory, { index: false }));


app.use(cookieParser())

// set security HTTP headers
// app.use(helmet());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);

// Init zoho config
initZohoConfig()

// send back a 404 error for any unknown api request
// app.use((req, res, next) => {
//   next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
// });

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);


//Not found any matched route, return index
app.get('*', function(req, res) {
  console.log('No found any matched route, return index', path.resolve("public", "index.html"))
  res.sendFile(path.resolve("public", "index.html"));
});

module.exports = app;
