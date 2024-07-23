
const { redirectToAuth } = require("@shopify/shopify-app-express/build/ts/redirect-to-auth")
const { redirectOutOfApp } = require("@shopify/shopify-app-express/build/ts/redirect-out-of-app")
const { hasValidAccessToken } = require("@shopify/shopify-app-express/build/ts/middlewares/has-valid-access-token");
const { process } = require("@shopify/shopify-app-express/build/ts/webhooks/process");
const { AppInstallations } = require("@shopify/shopify-app-express/build/ts/app-installations");
const { DeliveryMethod } = require('@shopify/shopify-api')
const moment = require("moment")

const metadrobValidateAuthenticatedSession = async (req, res, next, shopify) => {
    const api = shopify.api
    const config = shopify.config

    config.logger.info('Running validateAuthenticatedSession');
   
    let sessionId;
    try {
      sessionId = await api.session.getCurrentId({
        isOnline: config.useOnlineTokens,
        rawRequest: req,
        rawResponse: res,
      });
    } catch (error) {
      config.logger.error(
        `Error when loading session from storage: ${error}`,
      );

      handleSessionError(req, res, error);
      return undefined;
    }

    let session;
    if (sessionId) {
      try {
        session = await config.sessionStorage.loadSession(sessionId);
      } catch (error) {
        config.logger.error(
          `Error when loading session from storage: ${error}`,
        );

        res.status(500);
        res.send(error.message);
        return undefined;
      }
    } else {
        config.logger.error(
            `0000000002: Can't get sessionId`, {
                sessionId,
                timestamps: moment().toString()
            }
        );
    }

    let shop =
      api.utils.sanitizeShop(req.query.shop) || session?.shop;

    if (session && shop && session.shop !== shop) {
      config.logger.info(
        'Found a session for a different shop in the request',
        {
            currentShop: session.shop, 
            requestShop: shop,
            sessionId,
            timestamps: moment().toString()
        },
      );

      return redirectToAuth({req, res, api, config});
    }

    if (session) {
      config.logger.info('Request session found and loaded', {
        shop: session.shop,
      });

      if (session.isActive(api.config.scopes)) {
        config.logger.info('Request session exists and is active', {
          shop: session.shop,
        });

        if (await hasValidAccessToken(api, session)) {
          config.logger.info('Request session has a valid access token', {
            shop: session.shop,
          });

          res.locals.shopify = {
            ...res.locals.shopify,
            session,
          };
          return next();
        }
      }
    } else {
        config.logger.error(
            `0000000001: Can't get access token from Database`, {
                shop: shop,
                sessionId,
                timestamps: moment().toString()
            }
        );
    }

    const bearerPresent = req.headers.authorization?.match(/Bearer (.*)/);
    if (bearerPresent) {
      if (!shop) {
        shop = await setShopFromSessionOrToken(
          api,
          session,
          bearerPresent[1],
        );
      }
    }

    const redirectUri = `${config.auth.path}?shop=${shop}`;
    config.logger.info(
      `Session was not valid. Redirecting to ${redirectUri}`,
        {
            shop,
            session,
            sessionId,
            timestamps: moment().toString()
        },
    );

    return redirectOutOfApp({api, config})({
      req,
      res,
      redirectUri,
      shop: shop,
    });
};

const metadrobAuthCallback = async (
  req,
  res,
  shopify
) => {
  const api = shopify.api
  const config = shopify.config
  try {
    const callbackResponse = await api.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });

    config.logger.info('Callback is valid, storing session', {
      shop: callbackResponse.session.shop,
      isOnline: callbackResponse.session.isOnline,
    });

    await config.sessionStorage.storeSession(callbackResponse.session);

    config.logger.info('0000000003: Save shopify session successfully!', {
      session: callbackResponse.session,
      timestamps: moment().toString()
    });

    // If this is an offline OAuth process, register webhooks
    if (!callbackResponse.session.isOnline) {
      await registerWebhooks(config, api, callbackResponse.session);
    }

    // If we're completing an offline OAuth process, immediately kick off the online one
    if (config.useOnlineTokens && !callbackResponse.session.isOnline) {
      config.logger.info(
        'Completing offline token OAuth, redirecting to online token OAuth',
        {shop: callbackResponse.session.shop},
      );

      await redirectToAuth({req, res, api, config, isOnline: true});
      return false;
    }

    res.locals.shopify = {
      ...res.locals.shopify,
      session: callbackResponse.session,
    };

    config.logger.info('Completed OAuth callback', {
      shop: callbackResponse.session.shop,
      isOnline: callbackResponse.session.isOnline,
      timestamps: moment().toString()
    });

    return true;
  } catch (error) {
    config.logger.error(`Failed to complete OAuth with error: ${error}` , {
      timestamps: moment().toString()
    });

    await handleCallbackError(req, res, api, config, error);
  }

  return false;
}

async function registerWebhooks(
  config,
  api,
  session,
) {
  config.logger.info('Registering webhooks', {shop: session.shop});

  const responsesByTopic = await api.webhooks.register({session});

  for (const topic in responsesByTopic) {
    if (!Object.prototype.hasOwnProperty.call(responsesByTopic, topic)) {
      continue;
    }

    for (const response of responsesByTopic[topic]) {
      if (!response.success && !privacyTopics.includes(topic)) {
        const result = response.result;

        if (result.errors) {
          config.logger.error(
            `Failed to register ${topic} webhook: ${result.errors[0].message}`,
            {shop: session.shop},
          );
        } else {
          config.logger.error(
            `Failed to register ${topic} webhook: ${JSON.stringify(
              result.data,
            )}`,
            {shop: session.shop},
          );
        }
      }
    }
  }
}

async function handleCallbackError(
  req,
  res,
  api,
  config,
  error,
) {
  switch (true) {
    case error instanceof InvalidOAuthError:
      res.status(400);
      res.send(error.message);
      break;
    case error instanceof CookieNotFound:
      await redirectToAuth({req, res, api, config});
      break;
    case error instanceof BotActivityDetected:
      res.status(410);
      res.send(error.message);
      break;
    default:
      res.status(500);
      res.send(error.message);
      break;
  }
}

function handleSessionError(_req, res, error) {
    switch (true) {
      case error instanceof InvalidJwtError:
        res.status(401);
        res.send(error.message);
        break;
      default:
        res.status(500);
        res.send(error.message);
        break;
    }
  }
  
async function setShopFromSessionOrToken(
    api,
    session,
    token,
) {
    let shop;
  
    if (session) {
      shop = session.shop;
    } else if (api.config.isEmbeddedApp) {
      const payload = await api.session.decodeSessionToken(token);
      shop = payload.dest.replace('https://', '');
    }
    return shop;
}

async function processWebhooks(req, res, shopify, webhookHandlers) {
  const api = shopify.api
  const config = shopify.config

  mountWebhooks(api, config, webhookHandlers);
  await process({
    req,
    res,
    api,
    config,
  });
}

function mountWebhooks(
  api,
  config,
  handlers,
) {
  api.webhooks.addHandlers(handlers);

  // Add our custom app uninstalled webhook
  const appInstallations = new AppInstallations(config);

  api.webhooks.addHandlers({
    APP_UNINSTALLED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: config.webhooks.path,
      callback: deleteAppInstallationHandler(appInstallations, config),
    },
  });
}

function deleteAppInstallationHandler(
  appInstallations,
  config,
) {
  return async function (
    _topic,
    shop,
    _body,
    _webhookId,
  ) {
    config.logger.info('Deleting shop sessions', {
      shop,
      timestamps: moment().toString()
    });

    await appInstallations.delete(shop);
  };
}

module.exports = {
    metadrobValidateAuthenticatedSession,
    metadrobAuthCallback,
    processWebhooks
}