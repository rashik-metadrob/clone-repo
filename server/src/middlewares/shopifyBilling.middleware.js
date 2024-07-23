const config = require("../config/config");
const shopify = require("../shopify");
const { SHOPIFY_RECURRING_CHARGE_NAME } = require("../utils/constant");
const userSubcriptionService = require('../services/userSubcription.service')
const _ = require("lodash")
const moment = require('moment');
const logger = require("../logger");

async function shopifyBillingMiddleware(req, res, next) {
  shopify.config.logger.info('Running shopifyBillingMiddleware')
  const session = _.get(res, ['locals', 'shopify', 'session'])

  const hasPayment = await shopify.api.billing.check({
    session,
    plans: [SHOPIFY_RECURRING_CHARGE_NAME],
    isTest: true, //config.env !== 'production',
    returnObject: true,
  });

  shopify.config.logger.info('Running shopifyBillingMiddleware hasPayment', {
    hasPayment: hasPayment.hasActivePayment,
    timestamps: moment().toISOString()
  })

  if (hasPayment.hasActivePayment) {
    const subId = _.get(hasPayment, ['appSubscriptions', 0, 'id'])
    await userSubcriptionService.createActiveUserSubcriptionForShopifyAppSubcription(session.shop, _.get(hasPayment, ['appSubscriptions', 0], null))

    // Test cancel sub
    // try {
    //   const canceledSubscription = await shopify.api.billing.cancel({
    //     session,
    //     subscriptionId: subId,
    //     prorate: true,  // Whether to issue prorated credits for the unused portion of the app subscription. Defaults to true.
    //   })
    // } catch (error) {
    //   if (typeof error == typeof BillingError) {
    //     console.log(`Unable to cancel subscription ${subscriptionId}: ${JSON.stringify(error.errorData, null, 2)}`);
    //     // handle error appropriately
    //   }
    // }

    next();
  } else {
    // Either request payment now (if single plan) or redirect to plan selection page (if multiple plans available), e.g.
    const confirmationUrl = await shopify.api.billing.request({
      session,
      plan: SHOPIFY_RECURRING_CHARGE_NAME,
      isTest: true, //config.env !== 'production',
      returnObject: true
    });

    logger.log("info", `confirmationUrl ${JSON.stringify({
      confirmationUrl: _.get(confirmationUrl, ['appSubscription'], null),
      timestamps: moment().toISOString()
    })}`)

    await userSubcriptionService.createUserSubcriptionForShopifyAppSubcription(session.shop, _.get(confirmationUrl, ['appSubscription'], null))

    res.redirect(confirmationUrl.confirmationUrl);
  }
}

module.exports = {
    shopifyBillingMiddleware
}